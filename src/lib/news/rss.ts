import { XMLParser } from "fast-xml-parser";
import type { SourceItem } from "./types";

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

/** Strip HTML tags/entities that some feeds put in descriptions. */
export function cleanText(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/** Parse an RSS 2.0 or Atom document into source items. Pure function — unit tested. */
export function parseFeed(xml: string, source: string, limit = 8): SourceItem[] {
  const doc = parser.parse(xml);
  const rssItems = doc?.rss?.channel?.item;
  const atomEntries = doc?.feed?.entry;
  const raw: unknown[] = toArray(rssItems ?? atomEntries);

  return raw
    .map((item) => {
      const i = item as Record<string, unknown>;
      const link = typeof i.link === "string" ? i.link : ((i.link as Record<string, string>)?.["@_href"] ?? "");
      return {
        title: cleanText(textOf(i.title)),
        summary: cleanText(textOf(i.description ?? i.summary)).slice(0, 400),
        url: link,
        source,
        published: textOf(i.pubDate ?? i.updated ?? i.published) || undefined,
      };
    })
    .filter((i) => i.title.length > 0)
    .slice(0, limit);
}

function toArray(value: unknown): unknown[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

/** Feeds sometimes wrap text as { "#text": "..." }. */
function textOf(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "#text" in value) return String((value as { "#text": unknown })["#text"]);
  return "";
}

export async function fetchFeed(url: string, source: string, limit?: number): Promise<SourceItem[]> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Natterly/0.1 (+https://github.com/MahiKode/natterly)" },
    signal: AbortSignal.timeout(6000),
    // Let Next.js cache feeds for 10 minutes: news stays fresh and we avoid hammering publishers.
    next: { revalidate: 600 },
  });
  if (!res.ok) throw new Error(`Feed ${url} returned ${res.status}`);
  return parseFeed(await res.text(), source, limit);
}
