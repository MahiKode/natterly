import type { SourceItem } from "./types";

const API = "https://en.wikipedia.org/w/api.php";
const HEADERS = { "User-Agent": "Natterly/0.1 (+https://github.com/MahiKode/natterly)" };

interface SearchResponse {
  query?: { pages?: Record<string, { title: string; extract?: string; fullurl?: string; index?: number }> };
}

/**
 * Find the best-matching Wikipedia articles for a free-text topic and return their intro extracts.
 * One request: `generator=search` + `prop=extracts|info` returns search hits with their text.
 */
export async function searchWikipedia(topic: string, limit = 3): Promise<SourceItem[]> {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: topic,
    gsrlimit: String(limit),
    prop: "extracts|info",
    inprop: "url",
    exintro: "1",
    explaintext: "1",
    exchars: "1800",
    origin: "*",
  });
  const res = await fetch(`${API}?${params}`, {
    headers: HEADERS,
    signal: AbortSignal.timeout(6000),
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`Wikipedia returned ${res.status}`);
  return parseWikipedia((await res.json()) as SearchResponse);
}

/** Pure parser, unit tested. Keeps search ranking order. */
export function parseWikipedia(data: SearchResponse): SourceItem[] {
  const pages = Object.values(data.query?.pages ?? {});
  return pages
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    .filter((p) => p.extract && p.extract.trim().length > 0)
    .map((p) => ({
      title: p.title,
      summary: p.extract!.trim(),
      url: p.fullurl ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(p.title.replace(/ /g, "_"))}`,
      source: "Wikipedia",
    }));
}
