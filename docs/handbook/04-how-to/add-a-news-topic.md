# How to add a news topic to The Briefing

1. Find a public RSS/Atom feed for the topic (e.g. BBC topic feeds at `https://feeds.bbci.co.uk/news/<section>/rss.xml`). Check the publisher's terms allow headline use with links.
2. Add an entry to `NEWS_TOPICS` in `src/lib/news/topics.ts`: `id`, `label`, `emoji`, and one or more `feeds` (`{ source, url }`). Two publishers per topic gives balance and resilience.
3. Test the feed parses: `curl -s <url> | head` and check that it's RSS (`<rss>`) or Atom (`<feed>`). Both are supported by `parseFeed`.
4. `npm run dev` → `/briefing` → choose the new topic.
5. Update `CHANGELOG.md`.

Free-text topics need no setup: they use Wikipedia automatically.
