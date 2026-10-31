# Runbook: roll back a bad release

1. **Vercel:** Project → Deployments → find the last good deployment → ⋯ → **Promote to Production**. This takes seconds and needs no code change.
2. Then fix forward: `git revert <bad-commit>` on a branch → PR → merge.
3. If the service worker is serving stale pages to users, bump `CACHE` in `public/sw.js` (e.g. `natterly-v2`) and deploy.
