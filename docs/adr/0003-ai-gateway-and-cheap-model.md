# ADR-0003: AI gateway + Claude Haiku by default

- **Status:** Accepted
- **Date:** 2026-10-31

## Context
The Product Owner asked for minimum running cost. Conversation replies are short; latency matters more than deep reasoning. We may want to switch providers or models later.

## Decision
- All LLM access goes through `src/lib/ai/` (the **AI gateway**). Routes import from there; nothing else imports a provider SDK.
- Default model for chat, briefing and feedback: **`claude-haiku-5-5`** (Anthropic's cheapest current model, about $0.10 / $0.50 per million input/output tokens at the time of writing). Overridable via `NATTERLY_CHAT_MODEL` and `NATTERLY_FEEDBACK_MODEL`.
- Chat uses `effort: "low"`, streams responses, and sends only the last 24 turns.
- Prompts are deterministic and use automatic prompt caching (`cache_control`), so long conversations reuse cached prefixes.
- Feedback uses structured output (a Zod schema) so the UI gets reliable JSON.

## Consequences
- ✅ Typical session (≈10 turns + feedback) costs a fraction of a penny.
- ✅ Swapping model is an env-var change; swapping provider is contained in one folder.
- ⚠️ Haiku is less nuanced than larger models. If coaching quality is weak, try `NATTERLY_FEEDBACK_MODEL=claude-sonnet-5-5` for feedback only (one call per session) before changing chat.
- ⚠️ Haiku has no server-side refusal fallback; on a refusal the Local politely changes the subject.
