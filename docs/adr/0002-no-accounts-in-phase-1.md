# ADR-0002: No accounts or database in Phase 1

- **Status:** Accepted
- **Date:** 2026-10-31

## Context
Accounts mean auth, a database, password resets, data-protection obligations and cost. Phase 1 needs to prove learners like the product.

## Decision
No sign-in in Phase 1. Practice history (transcripts, metrics, AI feedback) is stored in the browser's `localStorage` (`src/lib/client/history.ts`, key `natterly.sessions.v1`, max 50 sessions).

## Consequences
- ✅ Zero infrastructure and minimal personal data held by us.
- ⚠️ History doesn't sync between devices and is lost if the browser storage is cleared.
- ⚠️ Rate limiting can only be per IP (ADR-0006).
- 🔜 Phase 2 adds accounts (e.g. Supabase/Auth.js + Postgres) and imports local history on first sign-in. The `Session` type is the contract to migrate.
