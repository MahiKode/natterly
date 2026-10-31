"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { loadSessions, type Session } from "@/lib/client/history";
import { getPersona } from "@/lib/personas/personas";

export default function PlaybackList() {
  const [sessions, setSessions] = useState<Session[] | null>(null);

  // History lives in localStorage, which only exists in the browser.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setSessions(loadSessions().filter((s) => s.turns.some((t) => t.role === "user"))), []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Playback 📈</h1>
        <p className="mt-1 text-muted">Your past sessions and feedback. Stored privately on this device.</p>
      </header>

      {sessions?.length === 0 && (
        <div className="rounded-2xl bg-surface p-8 text-center ring-1 ring-line">
          <p className="text-muted">No sessions yet.</p>
          <Link href="/cuppa" className="mt-3 inline-block rounded-full bg-brand px-5 py-2 font-medium text-brand-ink">
            Start your first chat
          </Link>
        </div>
      )}

      <ul className="space-y-2">
        {sessions?.map((s) => {
          const persona = getPersona(s.personaId);
          return (
            <li key={s.id}>
              <Link href={`/playback/${s.id}`} className="flex items-center gap-3 rounded-2xl bg-surface p-4 ring-1 ring-line hover:ring-brand">
                {persona && <Avatar persona={persona} size="sm" />}
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{s.title}</div>
                  <div className="text-sm text-muted">
                    with {persona?.name ?? "a Local"} · {new Date(s.startedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                  </div>
                </div>
                {s.feedback && <span className="rounded-full bg-good/10 px-2 py-0.5 text-xs text-good">reviewed</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
