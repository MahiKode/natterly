"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { PERSONAS } from "@/lib/personas/personas";
import { SCENARIOS } from "@/lib/personas/scenarios";

/** Step 1: choose a Local. Step 2: choose a scenario. Then start chatting. */
export function CuppaPicker({ initialLocal }: { initialLocal?: string }) {
  const [localId, setLocalId] = useState(PERSONAS.some((p) => p.id === initialLocal) ? initialLocal! : PERSONAS[0].id);
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Cuppa ☕</h1>
        <p className="mt-1 text-muted">Pick who you’d like to talk to and what about.</p>
      </header>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">1 · Choose a Local</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              onClick={() => setLocalId(p.id)}
              aria-pressed={p.id === localId}
              className={`flex gap-3 rounded-2xl bg-surface p-4 text-left ring-1 transition ${
                p.id === localId ? "ring-2 ring-brand" : "ring-line hover:ring-brand/50"
              }`}
            >
              <Avatar persona={p} />
              <div className="min-w-0">
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-muted">{p.accentLabel}</div>
                <p className="mt-1 text-sm text-muted">{p.tagline}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">2 · Choose a scenario</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => setScenarioId(s.id)}
              aria-pressed={s.id === scenarioId}
              className={`rounded-2xl bg-surface p-4 text-left ring-1 transition ${
                s.id === scenarioId ? "ring-2 ring-brand" : "ring-line hover:ring-brand/50"
              }`}
            >
              <div className="font-medium">
                {s.emoji} {s.title}
              </div>
              <p className="mt-1 text-sm text-muted">{s.description}</p>
            </button>
          ))}
        </div>
      </section>

      <div className="sticky bottom-4 flex justify-center">
        <Link
          href={`/cuppa/${localId}?scenario=${scenarioId}`}
          className="rounded-full bg-brand px-8 py-3 font-medium text-brand-ink shadow-lg hover:opacity-90"
        >
          Start chatting →
        </Link>
      </div>
    </div>
  );
}
