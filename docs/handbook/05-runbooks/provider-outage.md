# Runbook: AI provider or news source outage

## AI (Anthropic) errors
- Users see "The AI service is busy / had a problem". Check status.anthropic.com.
- 429 rate limits: the SDK retries twice automatically. If persistent, check account rate limits in the Console.
- 401: the API key is invalid or revoked → [rotate-keys](rotate-keys.md).

## News feeds
- If one feed for a topic fails, the others are still used (`Promise.allSettled`).
- If all feeds fail, users see "No news sources could be reached right now."
- Check a feed: `curl -sI <url>`. If a URL changed permanently, update `src/lib/news/topics.ts`.
- If Wikipedia has no match, users see "Couldn't find anything about …". If Wikipedia is down or times out, users see "Couldn't gather that topic right now" and the real error is in the server logs (`briefing gather failed`). Check https://www.wikimediastatus.net.
