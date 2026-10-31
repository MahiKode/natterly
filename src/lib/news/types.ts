/** One piece of source material the narrator may use (a headline or an encyclopedia extract). */
export interface SourceItem {
  title: string;
  summary: string;
  url: string;
  source: string;
  published?: string;
}

/** Everything The Briefing gathered for one topic. Sent to the browser and back as chat context. */
export interface Briefing {
  topic: string;
  kind: "news" | "explainer";
  items: SourceItem[];
}
