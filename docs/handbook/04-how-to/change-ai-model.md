# How to change the AI model

Models are set in `src/lib/ai/client.ts` and can be overridden per deployment **without code changes**:

| Env var | Used for | Default |
|---|---|---|
| `NATTERLY_CHAT_MODEL` | Cuppa + Briefing replies | `claude-haiku-5-5` |
| `NATTERLY_FEEDBACK_MODEL` | Playback coaching (1 call/session) | `claude-haiku-5-5` |

Steps:
1. Set the env var in `.env.local` (local) or in the hosting dashboard (production), then redeploy.
2. Try a few sessions and compare quality, speed and cost (Anthropic Console → Usage).
3. To change the **default in code**, write an ADR that supersedes ADR-0003 and explain the cost impact.

Tip: the cheapest quality boost is usually upgrading only the feedback model (e.g. `claude-sonnet-5-5`), since it runs once per session.

Notes for current Claude models: don't send `temperature`/`top_p`, don't use assistant prefill, and control depth with `output_config.effort`. The code already follows these rules.
