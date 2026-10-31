/**
 * Preset topics for The Briefing. Each preset maps to free, public RSS feeds,
 * so gathering news costs nothing — only the narration uses AI (ADR-0005).
 *
 * Any topic NOT in this list is researched via Wikipedia instead.
 */
export interface NewsTopic {
  id: string;
  label: string;
  emoji: string;
  feeds: { source: string; url: string }[];
}

export const NEWS_TOPICS: NewsTopic[] = [
  {
    id: "uk",
    label: "UK news",
    emoji: "🇬🇧",
    feeds: [
      { source: "BBC News", url: "https://feeds.bbci.co.uk/news/uk/rss.xml" },
      { source: "The Guardian", url: "https://www.theguardian.com/uk-news/rss" },
    ],
  },
  {
    id: "india",
    label: "India news",
    emoji: "🇮🇳",
    feeds: [
      { source: "BBC News", url: "https://feeds.bbci.co.uk/news/world/asia/india/rss.xml" },
      { source: "The Hindu", url: "https://www.thehindu.com/news/national/feeder/default.rss" },
    ],
  },
  {
    id: "world",
    label: "World news",
    emoji: "🌍",
    feeds: [
      { source: "BBC News", url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
      { source: "The Guardian", url: "https://www.theguardian.com/world/rss" },
    ],
  },
  {
    id: "ai",
    label: "Latest in AI & tech",
    emoji: "🤖",
    feeds: [
      { source: "BBC News", url: "https://feeds.bbci.co.uk/news/technology/rss.xml" },
      { source: "The Guardian", url: "https://www.theguardian.com/technology/artificialintelligenceai/rss" },
    ],
  },
  {
    id: "business",
    label: "Business",
    emoji: "💼",
    feeds: [{ source: "BBC News", url: "https://feeds.bbci.co.uk/news/business/rss.xml" }],
  },
  {
    id: "science",
    label: "Science",
    emoji: "🔬",
    feeds: [{ source: "BBC News", url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml" }],
  },
];

/** Example free-text topics shown as suggestions (researched via Wikipedia). */
export const SUGGESTED_TOPICS = [
  "Egyptian culture",
  "History of the London Underground",
  "How the NHS works",
  "Diwali",
  "Scottish Highlands",
];

export function getNewsTopic(id: string): NewsTopic | undefined {
  return NEWS_TOPICS.find((t) => t.id === id);
}
