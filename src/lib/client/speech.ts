"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Persona } from "@/lib/personas/types";

/**
 * Free, on-device speech using the browser's Web Speech API (ADR-0004).
 * - Listening (speech-to-text): Chrome, Edge, Safari (incl. iOS). Not Firefox — the UI falls back to typing.
 * - Speaking (text-to-speech): all modern browsers, using the device's installed voices.
 */

// ---------- Speech-to-text ----------

// The Web Speech API is not in TypeScript's DOM types yet, so we declare the parts we use.
interface RecognitionResult {
  isFinal: boolean;
  0: { transcript: string; confidence: number };
}
interface RecognitionEvent {
  resultIndex: number;
  results: ArrayLike<RecognitionResult>;
}
interface Recognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: RecognitionEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}
type RecognitionCtor = new () => Recognition;

function getRecognitionCtor(): RecognitionCtor | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export interface Utterance {
  text: string;
  durationSec: number;
  confidence?: number;
}

/**
 * Tap-to-talk speech recognition. Stops automatically after a pause, then calls `onFinal`.
 * `interim` holds live text while the user is speaking, for display.
 */
export function useSpeechRecognition(onFinal: (u: Utterance) => void) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<Recognition | null>(null);
  const onFinalRef = useRef(onFinal);

  useEffect(() => {
    onFinalRef.current = onFinal;
  }, [onFinal]);

  // Feature detection must run after mount; the server render has no `window`.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setSupported(Boolean(getRecognitionCtor())), []);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor || recRef.current) return;
    const rec = new Ctor();
    rec.lang = "en-GB";
    rec.continuous = false;
    rec.interimResults = true;

    const startedAt = performance.now();
    let finalText = "";
    let confidenceSum = 0;
    let confidenceCount = 0;

    rec.onresult = (e) => {
      let live = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) {
          finalText += r[0].transcript;
          if (r[0].confidence > 0) {
            confidenceSum += r[0].confidence;
            confidenceCount++;
          }
        } else {
          live += r[0].transcript;
        }
      }
      setInterim((finalText + " " + live).trim());
    };
    rec.onerror = (e) => {
      if (e.error === "not-allowed") setError("Microphone permission was blocked. Allow it in your browser settings.");
      else if (e.error !== "no-speech" && e.error !== "aborted") setError("Couldn't hear that. Please try again.");
    };
    rec.onend = () => {
      recRef.current = null;
      setListening(false);
      setInterim("");
      const text = finalText.trim();
      if (text) {
        onFinalRef.current({
          text,
          durationSec: Math.max(1, (performance.now() - startedAt) / 1000),
          confidence: confidenceCount ? confidenceSum / confidenceCount : undefined,
        });
      }
    };

    setError(null);
    recRef.current = rec;
    setListening(true);
    rec.start();
  }, []);

  const stop = useCallback(() => recRef.current?.stop(), []);

  useEffect(() => () => recRef.current?.abort(), []);

  return { supported, listening, interim, error, start, stop };
}

// ---------- Text-to-speech ----------

const FEMALE_HINTS = /female|woman|serena|kate|martha|stephanie|fiona|moira|susan|libby|sonia|hazel|amy|emma/i;
const MALE_HINTS = /\bmale\b|daniel|arthur|oliver|george|ryan|thomas|alfie|brian|harry/i;

/** Pick the best installed voice for a persona: preferred names → en-GB with matching gender → any English. */
export function pickVoice(voices: SpeechSynthesisVoice[], persona: Persona): SpeechSynthesisVoice | undefined {
  const byName = persona.voice.preferredVoices
    ?.map((name) => voices.find((v) => v.name.toLowerCase().includes(name.toLowerCase())))
    .find(Boolean);
  if (byName) return byName;

  const british = voices.filter((v) => v.lang.replace("_", "-").toLowerCase().startsWith("en-gb"));
  const pool = british.length ? british : voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  const hint = persona.voice.gender === "female" ? FEMALE_HINTS : MALE_HINTS;
  return pool.find((v) => hint.test(v.name)) ?? pool[0];
}

/** Voices load asynchronously in most browsers; this hook returns them once ready. */
export function useVoices(): SpeechSynthesisVoice[] {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  useEffect(() => {
    if (typeof speechSynthesis === "undefined") return;
    const load = () => setVoices(speechSynthesis.getVoices());
    load();
    speechSynthesis.addEventListener("voiceschanged", load);
    return () => speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);
  return voices;
}

/**
 * Speaks streamed text sentence by sentence, so the Local starts talking before the
 * whole reply has arrived (and avoids Chrome cutting off long utterances).
 */
export class SentenceSpeaker {
  private buffer = "";
  private pending = 0;

  constructor(
    private persona: Persona,
    private voice: SpeechSynthesisVoice | undefined,
    private onSpeakingChange: (speaking: boolean) => void,
  ) {}

  push(chunk: string) {
    this.buffer += chunk;
    // Speak every complete sentence; keep the unfinished tail in the buffer.
    const match = this.buffer.match(/^[\s\S]*[.!?…]["'”’)]?\s/);
    if (match) {
      this.say(match[0]);
      this.buffer = this.buffer.slice(match[0].length);
    }
  }

  flush() {
    this.say(this.buffer);
    this.buffer = "";
  }

  private say(text: string) {
    const clean = text.trim();
    if (!clean || typeof speechSynthesis === "undefined") return;
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = this.persona.voice.lang;
    u.rate = this.persona.voice.rate;
    u.pitch = this.persona.voice.pitch;
    if (this.voice) u.voice = this.voice;
    u.onstart = () => this.onSpeakingChange(true);
    u.onend = u.onerror = () => {
      this.pending--;
      if (this.pending <= 0) this.onSpeakingChange(false);
    };
    this.pending++;
    speechSynthesis.speak(u);
  }
}

export function stopSpeaking() {
  if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
}
