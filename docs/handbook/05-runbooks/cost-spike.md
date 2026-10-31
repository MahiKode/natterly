# Runbook: AI cost spike

**Signals:** an Anthropic Console usage jump, or a spend-limit email.

1. **Stop the bleeding:** set or rotate `NATTERLY_ACCESS_CODE` in the hosting env vars and redeploy. Only testers with the new code can use AI.
2. Lower `NATTERLY_RATE_LIMIT_PER_HOUR` (e.g. 20).
3. Check hosting logs for a single IP or bot hammering `/api/chat`.
4. Check model env vars weren't changed to an expensive model by mistake.
5. If a key leaked, follow [rotate-keys](rotate-keys.md).
6. Write a short incident note in `docs/handbook/07-faq.md` or an issue.
