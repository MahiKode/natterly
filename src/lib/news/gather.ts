import { fetchFeed } from "./rss";
import { getNewsTopic } from "./topics";
import { searchWikipedia } from "./wikipedia";
import type { Briefing, SourceItem } from "./types";

/** An error whose message is safe and friendly to show to learners. */
export class BriefingError extends Error {}

/**
 * Gather source material for The Briefing.
 * - Preset news topic (e.g. "uk") → headlines from free RSS feeds.
 * - Anything else ("Egyptian culture") → Wikipedia extracts.
 * The AI never browses the web itself; this keeps cost near zero and answers grounded.
 */
export async function gatherBriefing(input: { topicId?: string; query?: string }): Promise<Briefing> {
  const preset = input.topicId ? getNewsTopic(input.topicId) : undefined;

  if (preset) {
    const perFeed = Math.ceil(10 / preset.feeds.length);
    const results = await Promise.allSettled(preset.feeds.map((f) => fetchFeed(f.url, f.source, perFeed)));
    const items = interleave(results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : [])));
    if (items.length === 0) throw new BriefingError("No news sources could be reached right now. Please try again shortly.");
    return { topic: preset.label, kind: "news", items: dedupe(items).slice(0, 10) };
  }

  const query = (input.query ?? "").trim();
  if (!query) throw new BriefingError("Please choose or type a topic.");
  const items = await searchWikipedia(query);
  if (items.length === 0) throw new BriefingError(`Couldn't find anything about "${query}". Try wording it differently.`);
  return { topic: query, kind: "explainer", items };
}

/** Mix feeds so one publisher doesn't dominate the top of the list. */
function interleave(lists: SourceItem[][]): SourceItem[] {
  const out: SourceItem[] = [];
  const max = Math.max(0, ...lists.map((l) => l.length));
  for (let i = 0; i < max; i++) for (const list of lists) if (list[i]) out.push(list[i]);
  return out;
}

function dedupe(items: SourceItem[]): SourceItem[] {
  const seen = new Set<string>();
  return items.filter((i) => {
    const key = i.title.toLowerCase().slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Render the briefing as numbered plain text for the AI prompt. */
export function briefingToContext(b: Briefing): string {
  return b.items
    .map((i, n) => `[${n + 1}] ${i.title} (${i.source}${i.published ? `, ${i.published}` : ""})\n${i.summary}`)
    .join("\n\n");
}
