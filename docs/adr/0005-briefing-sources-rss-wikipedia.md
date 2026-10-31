# ADR-0005: The Briefing gathers sources from RSS + Wikipedia

- **Status:** Accepted
- **Date:** 2026-10-31

## Context
The Briefing must talk about *current* news and any topic, without making facts up. LLM web-search tools cost extra per search and need larger models.

## Decision
- Preset news topics map to free public **RSS feeds** (BBC, The Guardian, The Hindu): `src/lib/news/topics.ts`. Feeds are cached for 10 minutes.
- Free-text topics use the **Wikipedia API** (top 3 article intros), cached for a day.
- The gathered items are sent to the model as numbered source material. The system prompt forbids facts not in the sources and asks the presenter to name sources.
- Source material is re-sent with each follow-up question (as the hidden first user turn), so answers stay grounded. Prompt caching keeps this cheap.

## Consequences
- ✅ Free and fast; answers cite real sources the learner can open.
- ⚠️ Only headlines and summaries are used (not full articles), so depth is limited; that suits a 1-minute briefing.
- ⚠️ Feed URLs can change. Each topic has several feeds and partial failure is tolerated. See runbook "provider outage".
- ⚠️ Respect publishers' terms: we show headlines with links and don't republish full text. Review before commercial launch.
