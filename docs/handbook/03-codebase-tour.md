# 3. Codebase tour

```
natterly/
├─ src/
│  ├─ app/                      Next.js App Router: one folder per URL
│  │  ├─ layout.tsx             Shell: header/nav, access-code dialog, service worker
│  │  ├─ page.tsx               Home page
│  │  ├─ globals.css            Design tokens (colours, light/dark) + small animations
│  │  ├─ cuppa/                 /cuppa picker → /cuppa/[personaId]?scenario=… chat
│  │  ├─ briefing/              /briefing: topic + presenter picker, then chat
│  │  ├─ playback/              /playback list and /playback/[id] report
│  │  └─ api/                   Server endpoints (the only server code)
│  │     ├─ chat/route.ts       Streams a Local's reply (Cuppa + Briefing)
│  │     ├─ briefing/route.ts   Gathers news/topic sources (no AI)
│  │     └─ feedback/route.ts   One structured AI coaching call per session
│  ├─ components/
│  │  ├─ Conversation.tsx       ★ The chat screen: mic, streaming, TTS, toggles
│  │  ├─ Avatar.tsx             Local's round badge (pulses while speaking)
│  │  ├─ AccessCodeDialog.tsx   Asks for the beta code after a 401
│  │  └─ ServiceWorker.tsx      Registers public/sw.js in production
│  ├─ lib/
│  │  ├─ ai/                    ★ AI gateway: client.ts (models), prompts.ts, messages.ts
│  │  ├─ personas/              ★ Locals and scenarios as data (+ types)
│  │  ├─ news/                  RSS + Wikipedia gathering for The Briefing
│  │  ├─ feedback/metrics.ts    Pace, fillers, clarity, vocabulary (pure functions)
│  │  ├─ client/                Browser-only helpers: api.ts, speech.ts, history.ts
│  │  ├─ server/guard.ts        Access code + rate limit for API routes
│  │  └─ api-schema.ts          Zod contracts shared by client and server
│  └─ test/empty.ts             Test stub for the "server-only" package
├─ public/                      PWA manifest, icons, service worker
├─ docs/                        You are here
└─ .github/                     CI workflow + PR template
```

## Where do I go to…
| Task | File(s) |
|---|---|
| Add or edit a Local | `src/lib/personas/personas.ts` ([how-to](04-how-to/add-a-local.md)) |
| Add a scenario | `src/lib/personas/scenarios.ts` ([how-to](04-how-to/add-a-scenario.md)) |
| Add a news topic | `src/lib/news/topics.ts` ([how-to](04-how-to/add-a-news-topic.md)) |
| Change how Locals behave | `src/lib/ai/prompts.ts` |
| Change model or cost settings | `src/lib/ai/client.ts`, env vars ([how-to](04-how-to/change-ai-model.md)) |
| Change the chat screen | `src/components/Conversation.tsx` |
| Change voice selection / speech | `src/lib/client/speech.ts` |
| Change Playback metrics | `src/lib/feedback/metrics.ts` (+ its tests) |
| Change colours / theme | `src/app/globals.css` |

## Conventions
- `"use client"` only where needed (interactive components, browser APIs). Server-only modules import `"server-only"` so they can't leak into the browser bundle.
- Pure logic lives in `src/lib/**` with a `*.test.ts` next to it.
- Imports use the `@/` alias for `src/`.
- Next.js 16: `params` and `searchParams` in pages are **Promises**; `await` them.
