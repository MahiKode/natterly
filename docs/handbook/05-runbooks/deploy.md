# Runbook: deploy

## First-time setup (Vercel, free tier)
1. Push the repo to GitHub (`MahiKode/natterly`).
2. Go to vercel.com → **Add New Project** → import the repo. Framework: Next.js (auto-detected).
3. **Environment variables** (Production):
   - `ANTHROPIC_API_KEY`: from console.anthropic.com → API Keys (create a key just for production).
   - `NATTERLY_ACCESS_CODE`: a beta code to share with testers.
   - Optional: `NATTERLY_RATE_LIMIT_PER_HOUR`, model overrides.
4. Deploy. Vercel gives an HTTPS URL, which voice input requires.
5. In the Anthropic Console, **set a monthly spend limit** (e.g. $10) on the workspace.

## Every release
1. Merge to `main` after CI is green and review is approved. Vercel deploys automatically.
2. Smoke test on the production URL (phone and desktop): open Cuppa, have 2 turns by voice, Finish & review, open a Briefing.
3. Add the version to `CHANGELOG.md` and tag: `git tag v0.x.y && git push --tags`.

## Other hosts
Any Node 20+ host works: `npm ci && npm run build && npm start` (port 3000). It must be served over HTTPS for microphone access.
