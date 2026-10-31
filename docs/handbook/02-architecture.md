# 2. Architecture

## Big picture

```
 Browser / installed PWA                                      Server (Next.js API routes)
┌─────────────────────────────────────────────┐            ┌───────────────────────────────────┐
│ Pages: /, /cuppa, /briefing, /playback      │            │ POST /api/chat     ─┐             │
│                                             │  HTTPS     │ POST /api/feedback ─┼─► AI gateway ├──► Anthropic API (Claude Haiku)
│ Conversation.tsx                            │ ─────────► │ POST /api/briefing ─┘  src/lib/ai  │
│  ├ 🎙 SpeechRecognition (free, on device)  │            │        │                          │
│  ├ 🔊 speechSynthesis (free, on device)    │ ◄───────── │        └─► src/lib/news ──────────┼──► RSS feeds (BBC, Guardian, Hindu)
│  └ localStorage history (Playback)          │  NDJSON    │             (free)                ├──► Wikipedia API
│ metrics.ts (pace, fillers…) on device       │  stream    │ guard.ts: access code + rate limit│
└─────────────────────────────────────────────┘            └───────────────────────────────────┘
```

**Principles:**
1. **Free things on the device:** speech in/out, metrics and history all run in the browser.
2. **Paid things on the server, through one gateway:** only `src/lib/ai/` talks to the LLM (ADR-0003).
3. **Personas are data:** behaviour comes from prompts built from persona and scenario objects.
4. **No accounts yet:** nothing personal is stored on the server (ADR-0002).

## How a voice message flows (Cuppa)
1. The learner taps 🎙. `useSpeechRecognition` (`src/lib/client/speech.ts`) starts the browser recogniser (`en-GB`) and shows live text.
2. On a pause the recogniser ends → we get `{ text, durationSec, confidence }`.
3. `Conversation.sendLearnerTurn` appends the turn and calls `streamChat()` (`src/lib/client/api.ts`) → `POST /api/chat` with `{ mode: "chat", personaId, scenarioId, messages }`.
4. `src/app/api/chat/route.ts`:
   - `guardRequest()`: access code + rate limit.
   - Validates the body with Zod (`src/lib/api-schema.ts`).
   - Builds the system prompt from persona + scenario (`src/lib/ai/prompts.ts`). It is deterministic, so it's cacheable.
   - If the Local speaks first, inserts a hidden "learner has joined" cue (the API needs a user message first).
   - Calls `client.messages.stream()` with `effort: "low"` and automatic prompt caching.
   - Re-emits text as **NDJSON** lines: `{"type":"text","text":"…"}` … `{"type":"done"}`.
5. In the browser, each chunk is shown live and pushed into `SentenceSpeaker`, which speaks each finished sentence immediately.
6. When the reply finishes, the session is saved to `localStorage`.
7. **Finish & review** → `/playback/<id>`: `computeMetrics()` runs on device; `POST /api/feedback` returns structured coaching, which is cached in the saved session.

## How The Briefing works
1. The learner picks a topic → `POST /api/briefing` → `gatherBriefing()` fetches RSS (preset) or Wikipedia (free text). No AI, no cost.
2. The browser holds the `Briefing` and opens a `Conversation` in `mode: "briefing"`.
3. Each `/api/chat` call puts the source material as the hidden first user message, followed by the visible conversation. The presenter narrates first, then answers questions using only those sources.

## Cost model (rough, Phase 1)
| Item | Cost |
|---|---|
| Speech in/out, metrics, history | £0 (device) |
| News/Wikipedia | £0 |
| Chat turn (Haiku, ~1–3k input tokens, ~100 output) | ≈ £0.0002 |
| Feedback (one per session) | ≈ £0.001 |
| Hosting (Vercel hobby) | £0 at beta scale |

## Security & privacy notes
- API key only on the server (env var), never sent to the browser.
- All request bodies validated and size-limited by Zod schemas.
- Transcripts are sent to the AI provider to generate replies and feedback; Chrome's speech recognition sends audio to Google. Both must be listed in the privacy notice before public launch.
