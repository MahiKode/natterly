# Runbook: AI provider or news source outage

## AI (Anthropic) errors
- Users see "The AI service is busy / had a problem". Check status.anthropic.com.
- 429 rate limits: the SDK retries twice automatically. If persistent, check account rate limits in the Console.
- 401: the API key is invalid or revoked → [rotate-keys](rotate-keys.md).

## News feeds
- If one feed for a topic fails, the others are still used (`Promise.allSettled`).
- If all feeds fail, users see "No news sources could be reached right now."
- Check a feed: `curl -sI <url>`. If a URL changed permanently, update `src/lib/news/topics.ts`.
- Wikipedia failures show "Couldn't find anything…". Check https://www.wikimediastatus.net.
