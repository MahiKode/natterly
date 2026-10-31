"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage, ChatRequest } from "@/lib/api-schema";
import { streamChat } from "@/lib/client/api";
import { newSessionId, saveSession, type Session, type Turn } from "@/lib/client/history";
import { pickVoice, SentenceSpeaker, stopSpeaking, useVoices, type Utterance } from "@/lib/client/speech";
import type { Persona } from "@/lib/personas/types";

/**
 * All conversation logic (no UI): sending turns, streaming replies, speaking them,
 * and saving the session. `Conversation.tsx` only renders what this hook returns.
 */

/** Only the most recent turns are sent to the server. Keeps requests small and cost per turn flat. */
export const MAX_TURNS_SENT = 24;

export type Status = "idle" | "thinking" | "error";

interface Options {
  kind: Session["kind"];
  persona: Persona;
  title: string;
  buildRequest: (messages: ChatMessage[]) => ChatRequest;
  localOpens: boolean;
}

export function useConversation({ kind, persona, title, buildRequest, localOpens }: Options) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [streaming, setStreaming] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);

  const voices = useVoices();
  // Refs hold values that async code (the streaming loop) must read "live", not as of when it started.
  const turnsRef = useRef<Turn[]>([]);
  const sessionRef = useRef<{ id: string; startedAt: string } | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const speakerRef = useRef<SentenceSpeaker | null>(null);

  const commitTurns = useCallback(
    (next: Turn[]) => {
      turnsRef.current = next;
      setTurns(next);
      sessionRef.current ??= { id: newSessionId(), startedAt: new Date().toISOString() };
      saveSession({ ...sessionRef.current, kind, personaId: persona.id, title, turns: next });
    },
    [kind, persona.id, title],
  );

  /** Ask the Local for its next line, given the conversation so far. */
  const requestReply = useCallback(
    async (history: Turn[]) => {
      setStatus("thinking");
      setError(null);
      setStreaming("");
      stopSpeaking();
      speakerRef.current = voiceOn ? new SentenceSpeaker(persona, pickVoice(voices, persona), setSpeaking) : null;
      abortRef.current = new AbortController();

      try {
        const messages = history.slice(-MAX_TURNS_SENT).map(({ role, content }) => ({ role, content }));
        const reply = await streamChat(
          buildRequest(messages),
          (chunk) => {
            setStreaming((s) => s + chunk);
            speakerRef.current?.push(chunk);
          },
          abortRef.current.signal,
        );
        speakerRef.current?.flush();
        commitTurns([...history, { role: "assistant", content: reply.trim() }]);
        setStatus("idle");
      } catch (e) {
        if ((e as Error).name === "AbortError") {
          setStatus("idle");
        } else {
          setError((e as Error).message);
          setStatus("error");
        }
      } finally {
        setStreaming("");
      }
    },
    [buildRequest, commitTurns, persona, voiceOn, voices],
  );

  // The opening effect below must always call the latest requestReply without re-running.
  const requestReplyRef = useRef(requestReply);
  useEffect(() => {
    requestReplyRef.current = requestReply;
  }, [requestReply]);

  // Let the Local open the conversation. The timeout is cancelled by React Strict Mode's
  // simulated unmount in dev, so exactly one opening request is made.
  useEffect(() => {
    if (!localOpens) return;
    const timer = setTimeout(() => {
      if (turnsRef.current.length === 0) void requestReplyRef.current([]);
    }, 0);
    return () => clearTimeout(timer);
  }, [localOpens]);

  // On leaving the page: stop any reply in progress and any speech.
  useEffect(
    () => () => {
      abortRef.current?.abort();
      stopSpeaking();
    },
    [],
  );

  const sendLearnerTurn = useCallback(
    (text: string, meta?: Omit<Utterance, "text">) => {
      const clean = text.trim();
      if (!clean || status === "thinking") return;
      const next: Turn[] = [...turnsRef.current, { role: "user", content: clean, ...meta }];
      commitTurns(next); // save straight away so "Finish" never loses the learner's last line
      void requestReply(next);
    },
    [commitTurns, requestReply, status],
  );

  const retry = useCallback(() => void requestReply(turnsRef.current), [requestReply]);

  const toggleVoice = useCallback(() => {
    if (voiceOn) {
      speakerRef.current = null; // also silences a reply that is still streaming
      stopSpeaking();
      setSpeaking(false);
    }
    setVoiceOn(!voiceOn);
  }, [voiceOn]);

  /** Silence the Local (e.g. before the mic starts, so it doesn't hear itself). */
  const silence = useCallback(() => {
    stopSpeaking();
    setSpeaking(false);
  }, []);

  /** Stop everything; returns the session id if the learner said anything. */
  const end = useCallback((): string | null => {
    abortRef.current?.abort();
    stopSpeaking();
    const learnerSpoke = turnsRef.current.some((t) => t.role === "user");
    return learnerSpoke && sessionRef.current ? sessionRef.current.id : null;
  }, []);

  return { turns, streaming, status, error, speaking, voiceOn, sendLearnerTurn, retry, toggleVoice, silence, end };
}
