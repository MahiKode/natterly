# Runbook: roll back a bad release

## Vercel
1. Project → Deployments → find the last good deployment → ⋯ → **Promote to Production**. This takes seconds and needs no code change.
2. **Verify:** on the production URL, open Cuppa, send one message, and open The Briefing.
3. Fix forward: `git revert <bad-commit>` on a branch → PR → merge.

## Other hosts
1. `git checkout v<last-good-version>` (release tags, see the deploy runbook).
2. `npm ci && npm run build && npm start`, then verify as above.

## Stale pages after a rollback
If users still see the broken version, increment `CACHE` in `public/sw.js` (e.g. `natterly-v2` → `natterly-v3`) and deploy. On their next visit the service worker deletes the old cache.
