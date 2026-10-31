"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/Avatar";
import type { ChatMessage, ChatRequest } from "@/lib/api-schema";
import type { Session } from "@/lib/client/history";
import { useSpeechRecognition } from "@/lib/client/speech";
import type { Persona } from "@/lib/personas/types";
import { useConversation } from "./useConversation";

/**
 * The conversation screen shared by Cuppa and The Briefing. UI only — the logic lives in
 * useConversation.ts. Flow: learner speaks (browser STT) or types → the Local's reply streams
 * in and is spoken sentence by sentence → "Finish & review" opens the Playback report.
 */
interface Props {
  kind: Session["kind"];
  persona: Persona;
  title: string;
  /** Builds the API request from the visible conversation so far. */
  buildRequest: (messages: ChatMessage[]) => ChatRequest;
  /** Whether the Local speaks first when the screen opens. */
  localOpens: boolean;
  /** Optional panel shown above the chat (e.g. briefing sources). */
  header?: React.ReactNode;
}

/** Matches ChatMessageSchema's content limit (api-schema.ts). */
const MAX_TYPED_CHARS = 1000;

export function Conversation({ kind, persona, title, buildRequest, localOpens, header }: Props) {
  const router = useRouter();
  const convo = useConversation({ kind, persona, title, buildRequest, localOpens });
  const [draft, setDraft] = useState("");
  const [subtitles, setSubtitles] = useState(true);
  const [showPhrases, setShowPhrases] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const mic = useSpeechRecognition((u) => convo.sendLearnerTurn(u.text, { durationSec: u.durationSec, confidence: u.confidence }));
  const thinking = convo.status === "thinking";
  const learnerTurns = convo.turns.filter((t) => t.role === "user").length;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [convo.turns, convo.streaming, mic.interim]);

  function handleMic() {
    if (mic.listening) {
      mic.stop();
      return;
    }
    convo.silence(); // never let the mic hear the Local
    mic.start();
  }

  function finish() {
    mic.stop();
    const sessionId = convo.end();
    router.push(sessionId ? `/playback/${sessionId}` : "/");
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-7rem)] max-w-2xl flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-3 border-b border-line pb-3">
        <Avatar persona={persona} speaking={convo.speaking} />
        <div className="min-w-0 flex-1">
          <div className="font-semibold">
            {persona.name} <span className="font-normal text-muted">· {persona.accentLabel}</span>
          </div>
          <div className="truncate text-sm text-muted">{title}</div>
        </div>
        <button
          onClick={finish}
          className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg hover:opacity-90"
          title="End the session and see your Playback report"
        >
          {learnerTurns > 0 ? "Finish & review" : "Leave"}
        </button>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-2 py-2 text-xs">
        <Toggle on={convo.voiceOn} onClick={convo.toggleVoice}>
          🔊 Voice
        </Toggle>
        <Toggle on={subtitles} onClick={() => setSubtitles((s) => !s)} title="Turn off to practise listening">
          💬 Subtitles
        </Toggle>
        <Toggle on={showPhrases} onClick={() => setShowPhrases((s) => !s)}>
          📖 Phrasebook
        </Toggle>
      </div>

      {showPhrases && (
        <div className="mb-2 grid gap-2 rounded-2xl bg-surface-2 p-3 text-sm sm:grid-cols-2">
          {persona.phrasebook.map((p) => (
            <div key={p.phrase}>
              <span className="font-medium">“{p.phrase}”</span> <span className="text-muted">— {p.meaning}</span>
            </div>
          ))}
        </div>
      )}

      {header}

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto py-3" aria-live="polite">
        {convo.turns.map((t, i) => (
          <Bubble key={i} role={t.role} hidden={t.role === "assistant" && !subtitles}>
            {t.content}
          </Bubble>
        ))}
        {thinking && convo.streaming && (
          <Bubble role="assistant" hidden={!subtitles}>
            {convo.streaming}
          </Bubble>
        )}
        {thinking && !convo.streaming && (
          <div className="flex gap-1 px-4 py-3" aria-label={`${persona.name} is thinking`}>
            {[0, 1, 2].map((i) => (
              <span key={i} className="typing-dot h-2 w-2 rounded-full bg-muted" />
            ))}
          </div>
        )}
        {mic.interim && (
          <Bubble role="user" faded>
            {mic.interim}
          </Bubble>
        )}
        {convo.error && (
          <div className="rounded-xl border border-warn/40 bg-warn/10 px-4 py-3 text-sm">
            {convo.error}{" "}
            <button className="font-medium underline" onClick={convo.retry}>
              Try again
            </button>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div className="border-t border-line pt-3">
        {mic.error && <p className="mb-2 text-sm text-warn">{mic.error}</p>}
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            convo.sendLearnerTurn(draft);
            setDraft("");
          }}
        >
          {mic.supported && (
            <button
              type="button"
              onClick={handleMic}
              disabled={thinking}
              aria-label={mic.listening ? "Stop listening" : "Speak"}
              className={`grid h-14 w-14 shrink-0 place-items-center rounded-full text-2xl transition disabled:opacity-40 ${
                mic.listening ? "animate-pulse-ring bg-brand text-brand-ink" : "bg-brand-soft hover:bg-brand hover:text-brand-ink"
              }`}
            >
              {mic.listening ? "■" : "🎙️"}
            </button>
          )}
          <input
            value={draft}
            maxLength={MAX_TYPED_CHARS}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={mic.supported ? "Tap the mic and speak — or type here" : "Type your reply (voice needs Chrome, Edge or Safari)"}
            className="h-12 min-w-0 flex-1 rounded-full border border-line bg-surface px-4 outline-none focus:border-brand"
          />
          <button
            type="submit"
            disabled={!draft.trim() || thinking}
            className="h-12 rounded-full bg-brand px-5 font-medium text-brand-ink disabled:opacity-40"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

function Bubble({ role, children, hidden, faded }: { role: "user" | "assistant"; children: React.ReactNode; hidden?: boolean; faded?: boolean }) {
  const mine = role === "user";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 leading-relaxed ${
          mine ? "rounded-br-md bg-brand text-brand-ink" : "rounded-bl-md bg-surface shadow-sm ring-1 ring-line"
        } ${faded ? "opacity-60" : ""}`}
      >
        {hidden ? <span className="italic text-muted">🎧 Listening mode — subtitles hidden</span> : children}
      </div>
    </div>
  );
}

function Toggle({ on, onClick, children, title }: { on: boolean; onClick: () => void; children: React.ReactNode; title?: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-pressed={on}
      className={`rounded-full border px-3 py-1 transition ${on ? "border-brand bg-brand-soft text-ink" : "border-line text-muted"}`}
    >
      {children}
    </button>
  );
}
