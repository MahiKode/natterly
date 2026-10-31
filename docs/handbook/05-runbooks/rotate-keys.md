# Runbook: rotate secrets

## Anthropic API key
1. console.anthropic.com → API Keys → **Create key** (name it `natterly-prod-YYYYMM`).
2. Hosting dashboard → Environment variables → replace `ANTHROPIC_API_KEY`.
3. **Redeploy:** env var changes only apply to new deployments. On Vercel: Deployments → latest → ⋯ → **Redeploy**.
4. Verify one chat works in production.
5. Back in the Console, **disable then delete** the old key.
6. Local development uses a separate key in `.env.local` (git-ignored). Rotate it the same way and restart `npm run dev`.

## Beta access code (`NATTERLY_ACCESS_CODE`)
Change it in the hosting env vars, redeploy, and send the new code to testers. Testers are asked for it automatically on their next request. Do this when the code leaks; see also [cost-spike](cost-spike.md).

Never paste secrets into code, issues or chat.
