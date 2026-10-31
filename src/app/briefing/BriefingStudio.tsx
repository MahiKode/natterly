"use client";

import { useCallback, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { Conversation } from "@/components/Conversation";
import type { ChatMessage } from "@/lib/api-schema";
import { fetchBriefing } from "@/lib/client/api";
import { NEWS_TOPICS, SUGGESTED_TOPICS } from "@/lib/news/topics";
import type { Briefing } from "@/lib/news/types";
import { getPersona, PERSONAS } from "@/lib/personas/personas";

/**
 * The Briefing: pick a topic and a narrator → we gather sources (free RSS / Wikipedia)
 * → the Local narrates it and answers follow-up questions, grounded in those sources.
 */
export function BriefingStudio() {
  const [narratorId, setNarratorId] = useState("eleanor-coach");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [briefing, setBriefing] = useState<Briefing | null>(null);

  async function start(input: { topicId?: string; query?: string }, label: string) {
    setLoading(label);
    setError(null);
    try {
      setBriefing(await fetchBriefing(input));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(null);
    }
  }

  const buildRequest = useCallback(
    (messages: ChatMessage[]) => ({ mode: "briefing" as const, personaId: narratorId, briefing: briefing!, messages }),
    [narratorId, briefing],
  );

  if (briefing) {
    return (
      <Conversation
        kind="briefing"
        persona={getPersona(narratorId)!}
        title={`📻 The Briefing: ${briefing.topic}`}
        buildRequest={buildRequest}
        localOpens
        header={<Sources briefing={briefing} />}
      />
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">The Briefing 📻</h1>
        <p className="mt-1 text-muted">
          A Local talks you through the news or any topic you choose. Then ask questions and share your view — out loud.
        </p>
      </header>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Your presenter</h2>
        <div className="flex flex-wrap gap-2">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              onClick={() => setNarratorId(p.id)}
              aria-pressed={p.id === narratorId}
              className={`flex items-center gap-2 rounded-full bg-surface py-1 pl-1 pr-3 text-sm ring-1 ${
                p.id === narratorId ? "ring-2 ring-brand" : "ring-line"
              }`}
            >
              <Avatar persona={p} size="sm" />
              {p.name}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Today’s news</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {NEWS_TOPICS.map((t) => (
            <button
              key={t.id}
              disabled={loading !== null}
              onClick={() => start({ topicId: t.id }, t.label)}
              className="rounded-2xl bg-surface p-4 text-left ring-1 ring-line transition hover:ring-brand disabled:opacity-50"
            >
              <div className="text-2xl">{t.emoji}</div>
              <div className="mt-1 font-medium">{loading === t.label ? "Gathering…" : t.label}</div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Or any topic</h2>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) void start({ query }, query);
          }}
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Egyptian culture"
            className="h-12 min-w-0 flex-1 rounded-full border border-line bg-surface px-4 outline-none focus:border-brand"
          />
          <button disabled={!query.trim() || loading !== null} className="h-12 rounded-full bg-brand px-5 font-medium text-brand-ink disabled:opacity-40">
            {loading === query && query ? "Gathering…" : "Go"}
          </button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTED_TOPICS.map((s) => (
            <button
              key={s}
              disabled={loading !== null}
              onClick={() => {
                setQuery(s);
                void start({ query: s }, s);
              }}
              className="rounded-full bg-surface-2 px-3 py-1 text-sm text-muted hover:text-ink"
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      {error && <p className="rounded-xl bg-warn/10 px-4 py-3 text-sm text-warn">{error}</p>}
    </div>
  );
}

function Sources({ briefing }: { briefing: Briefing }) {
  return (
    <details className="mb-2 rounded-2xl bg-surface-2 px-4 py-2 text-sm">
      <summary className="cursor-pointer text-muted">
        Sources ({briefing.items.length}) · {briefing.kind === "news" ? "latest headlines" : "Wikipedia"}
      </summary>
      <ol className="mt-2 list-decimal space-y-1 pl-5">
        {briefing.items.map((i) => (
          <li key={i.url || i.title}>
            <a href={i.url} target="_blank" rel="noreferrer" className="hover:underline">
              {i.title}
            </a>{" "}
            <span className="text-muted">— {i.source}</span>
          </li>
        ))}
      </ol>
    </details>
  );
}
