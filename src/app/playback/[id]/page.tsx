"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Avatar } from "@/components/Avatar";
import type { CoachFeedback } from "@/lib/api-schema";
import { fetchFeedback } from "@/lib/client/api";
import { deleteSession, getSession, saveSession, type Session } from "@/lib/client/history";
import { computeMetrics, describePace } from "@/lib/feedback/metrics";
import { getPersona } from "@/lib/personas/personas";

/**
 * The Playback report for one session: free on-device metrics plus one AI coaching call.
 * The AI feedback is cached in the saved session, so revisiting the report costs nothing.
 */
export default function PlaybackReport() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [feedback, setFeedback] = useState<CoachFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const s = getSession(id) ?? null;
    // Session data lives in localStorage, which only exists in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(s);
    if (!s) return;
    if (s.feedback) {
      setFeedback(s.feedback); // already reviewed: no AI call needed
      return;
    }

    let cancelled = false;
    fetchFeedback({
      personaId: s.personaId,
      scenarioTitle: s.title,
      messages: s.turns.map(({ role, content }) => ({ role, content })),
    })
      .then((fb) => {
        if (cancelled) return;
        setFeedback(fb);
        saveSession({ ...s, feedback: fb });
      })
      .catch((e: Error) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [id]);

  const metrics = useMemo(() => {
    const learner = session?.turns.filter((t) => t.role === "user") ?? [];
    return computeMetrics(learner.map((t) => ({ text: t.content, durationSec: t.durationSec ?? 0, confidence: t.confidence })));
  }, [session]);

  if (session === undefined) return null;
  if (session === null) {
    return (
      <p className="text-muted">
        This session isn’t on this device. <Link href="/playback" className="underline">See all sessions</Link>
      </p>
    );
  }

  const persona = getPersona(session.personaId);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="flex items-center gap-3">
        {persona && <Avatar persona={persona} />}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Your Playback</h1>
          <p className="text-sm text-muted">
            {session.title} · with {persona?.name}
          </p>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Words spoken" value={metrics.totalWords} />
        <Stat label="Pace (wpm)" value={metrics.wordsPerMinute ?? "—"} />
        <Stat label="Fillers / 100 words" value={metrics.fillerRate} />
        <Stat label="Clarity" value={metrics.clarityScore !== null ? `${metrics.clarityScore}%` : "—"} />
      </section>
      <div className="space-y-1 text-sm text-muted">
        <p>🕒 {describePace(metrics.wordsPerMinute)}</p>
        {metrics.topFillers.length > 0 && (
          <p>🫧 Most used fillers: {metrics.topFillers.map((f) => `“${f.word}” ×${f.count}`).join(", ")}</p>
        )}
        <p>📚 Vocabulary variety: {Math.round(metrics.vocabularyVariety * 100)}% unique words</p>
        {metrics.clarityScore !== null && <p>🎯 Clarity is how confidently your device’s speech recogniser understood you.</p>}
      </div>

      <section className="rounded-2xl bg-surface p-5 ring-1 ring-line">
        <h2 className="font-semibold">Coach’s notes</h2>
        {!feedback && !error && <p className="mt-2 animate-pulse text-sm text-muted">Listening back to your session…</p>}
        {error && <p className="mt-2 text-sm text-warn">{error}</p>}
        {feedback && (
          <div className="mt-3 space-y-5 text-sm">
            <p>{feedback.summary}</p>
            {feedback.strengths.length > 0 && (
              <div>
                <h3 className="mb-1 font-medium text-good">What went well</h3>
                <ul className="list-disc space-y-1 pl-5">{feedback.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
              </div>
            )}
            {feedback.improvements.length > 0 && (
              <div>
                <h3 className="mb-2 font-medium">Say it even better</h3>
                <div className="space-y-3">
                  {feedback.improvements.map((i, n) => (
                    <div key={n} className="rounded-xl bg-surface-2 p-3">
                      <p className="text-muted line-through decoration-1">{i.youSaid}</p>
                      <p className="font-medium">{i.better}</p>
                      <p className="mt-1 text-xs text-muted">{i.why}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {feedback.phrasesToTry.length > 0 && (
              <div>
                <h3 className="mb-1 font-medium">Phrases to try next time</h3>
                <div className="flex flex-wrap gap-2">
                  {feedback.phrasesToTry.map((p) => (
                    <span key={p} className="rounded-full bg-brand-soft px-3 py-1">{p}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <details className="rounded-2xl bg-surface p-5 ring-1 ring-line">
        <summary className="cursor-pointer font-semibold">Transcript</summary>
        <div className="mt-3 space-y-2 text-sm">
          {session.turns.map((t, i) => (
            <p key={i}>
              <span className="font-medium">{t.role === "user" ? "You" : persona?.name}:</span> {t.content}
            </p>
          ))}
        </div>
      </details>

      <div className="flex flex-wrap gap-3">
        <Link href="/cuppa" className="rounded-full bg-brand px-5 py-2 font-medium text-brand-ink">Practise again</Link>
        <button
          onClick={() => {
            deleteSession(session.id);
            router.push("/playback");
          }}
          className="rounded-full border border-line px-5 py-2 text-muted hover:text-ink"
        >
          Delete session
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-surface p-4 ring-1 ring-line">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}
