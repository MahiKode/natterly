# ADR-0006: Access code + in-memory rate limit for the beta

- **Status:** Accepted
- **Date:** 2026-10-31

## Context
Without accounts, a public URL lets anyone spend our AI budget.

## Decision
`src/lib/server/guard.ts` protects every API route:
- If `NATTERLY_ACCESS_CODE` is set, requests must send it in the `x-natterly-access` header. The UI asks once (AccessCodeDialog) and stores it locally.
- A fixed one-hour window rate limit per client IP (`NATTERLY_RATE_LIMIT_PER_HOUR`, default 60 requests).

## Consequences
- ✅ Simple and free.
- ⚠️ In-memory: resets on restart and is per server instance on serverless hosts, so it's a speed bump, not a wall. **Also set a monthly spend limit in the Anthropic Console.**
- 🔜 Phase 2 replaces this with per-user quotas stored in Redis/Postgres.
