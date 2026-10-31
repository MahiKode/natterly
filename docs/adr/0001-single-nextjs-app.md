# ADR-0001: One Next.js app

- **Status:** Accepted
- **Date:** 2026-10-31

## Context
Phase 1 needs a web UI, a few server endpoints (chat, briefing, feedback) and a PWA. The team is small and must keep cost and complexity low. Later phases add real-time rooms and billing.

## Decision
Build a single **Next.js (App Router) + TypeScript** app. The UI and API routes (`src/app/api/*`) live together and deploy as one unit (e.g. Vercel's free tier).

## Consequences
- ✅ One repo, one deploy, one language. Easiest possible onboarding.
- ✅ Hosting is free at beta scale.
- ⚠️ Real-time multi-party audio (Phase 3–4) will need a separate media service (e.g. LiveKit). We'll add it as a separate service then, with its own ADR, and *may* move to a monorepo at that point.
