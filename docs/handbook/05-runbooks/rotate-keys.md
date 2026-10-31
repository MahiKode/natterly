# Runbook: rotate the API key

1. console.anthropic.com → API Keys → **Create key** (name it `natterly-prod-YYYYMM`).
2. Hosting dashboard → Environment variables → replace `ANTHROPIC_API_KEY` → redeploy.
3. Verify one chat works in production.
4. Back in the Console, **disable then delete** the old key.
5. Never paste keys into code, issues or chat. `.env.local` is git-ignored.
