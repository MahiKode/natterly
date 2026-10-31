# ADR-0006: Access code + in-memory rate limit for the beta

- **Status:** Accepted
- **Date:** 2026-10-31

## Context
Without accounts, a public URL lets anyone spend our AI budget.

## Decision
`src/lib/server/guard.ts` protects every API route:
- If `NATTERLY_ACCESS_CODE` is set, requests must send it in the `x-natterly-access` header. The UI asks once (AccessCodeDialog) and stores it locally.
- The access code is compared in constant time.
- A fixed one-hour window rate limit per client IP (`NATTERLY_RATE_LIMIT_PER_HOUR`, default 60; invalid values fall back to 60). The IP is the **right-most** `x-forwarded-for` hop (added by our hosting proxy, so it can't be faked), else `x-real-ip`. Expired entries are pruned once the map holds 5,000 clients.
- Request bodies over 64 KB are rejected.

## Consequences
- ✅ Simple and free.
- ⚠️ In-memory: resets on restart and is per server instance on serverless hosts, so it's a speed bump, not a wall. **Always set `NATTERLY_ACCESS_CODE` on public deployments, and set a monthly spend limit in the Anthropic Console.**
- ⚠️ On a host with no proxy in front, every request looks like "local" and shares one limit. Deploy behind a proxy (Vercel does this for you).
- 🔜 Phase 2 replaces this with per-user quotas stored in Redis/Postgres.
