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
3. `sendLearnerTurn` in `useConversation.ts` appends the turn, **saves the session straight away**, and calls `streamChat()` (`src/lib/client/api.ts`) → `POST /api/chat` with `{ mode: "chat", personaId, scenarioId, messages }`. Only the last 24 turns are sent (`MAX_TURNS_SENT`), so long chats keep working and cost per turn stays flat.
4. `src/app/api/chat/route.ts`:
   - `guardRequest()`: access code + rate limit.
   - Validates the body with Zod (`src/lib/api-schema.ts`).
   - Builds the system prompt from persona + scenario (`src/lib/ai/prompts.ts`). It is deterministic, so it's cacheable.
   - If the Local speaks first, inserts a hidden "learner has joined" cue (the API needs a user message first).
   - Calls `client.messages.stream()` with `effort: "low"` and automatic prompt caching.
   - Re-emits text as **NDJSON** lines: `{"type":"text","text":"…"}` … `{"type":"done"}`.
5. In the browser, each chunk is shown live and pushed into `SentenceSpeaker`, which uses `splitSentences()` to speak each finished sentence as its own utterance.
6. When the `done` event arrives, the reply is saved to `localStorage`. If the stream ends without `done` (connection cut), the learner sees "The reply was cut off" and can retry. A half reply is never saved.
7. **Finish & review** → `/playback/<id>`: `computeMetrics()` runs on device; `POST /api/feedback` (last 40 turns, transcript capped at 16k characters on the server) returns structured coaching, which is cached in the saved session.

## How The Briefing works
1. The learner picks a topic → `POST /api/briefing` → `gatherBriefing()` fetches RSS (preset) or Wikipedia (free text). No AI, no cost.
2. The browser holds the `Briefing` and opens a `Conversation` in `mode: "briefing"`.
3. Each `/api/chat` call puts the source material as the hidden first user message, followed by the visible conversation. The presenter narrates first, then answers questions using only those sources.

## Cost model (rough, Phase 1)
| Item | Cost |
|---|---|
| Speech in/out, metrics, history | £0 (device) |
| News/Wikipedia | £0 |
| Chat turn (Haiku, ≤24 turns of history ≈ 1–4k input tokens, ~100 output) | ≈ £0.0003 |
| Briefing turn (sources re-sent each turn, ≈ 3–6k input tokens, mostly cached) | ≈ £0.0005 |
| Feedback (one per session, ≤16k characters of transcript) | ≈ £0.001 |
| Hosting (Vercel hobby) | £0 at beta scale |

## Security & privacy notes
- API key only on the server (env var), never sent to the browser.
- Every API request goes through `guard.ts`: access code check, per-IP rate limit, and `readJsonBody()` (rejects bodies over 64 KB) before Zod validation. Zod schemas cap every string and array.
- **Known limitation:** in briefing mode the browser sends the gathered sources back with each question, so a crafted request could supply its own "sources" (≤10 items, 64 KB). Impact is limited: no tools, the user's own session, rate-limited. Phase 2 stores briefings on the server and sends only an id (see ADR-0005).
- Transcripts are sent to the AI provider to generate replies and feedback; Chrome's speech recognition sends audio to Google. Both must be listed in the privacy notice before public launch.
