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
│  │  ├─ Conversation.tsx       ★ The chat screen (UI only): mic button, bubbles, toggles
│  │  ├─ useConversation.ts     ★ Chat logic: send turns, stream replies, speak, save session
│  │  ├─ Avatar.tsx             Local's round badge (pulses while speaking)
│  │  ├─ AccessCodeDialog.tsx   Asks for the beta code after a 401
│  │  └─ ServiceWorker.tsx      Registers public/sw.js in production
│  ├─ lib/
│  │  ├─ ai/                    ★ AI gateway: client.ts (models), prompts.ts, messages.ts
│  │  ├─ personas/              ★ Locals and scenarios as data (+ types)
│  │  ├─ news/                  RSS + Wikipedia gathering for The Briefing
│  │  ├─ feedback/metrics.ts    Pace, fillers, clarity, vocabulary (pure functions)
│  │  ├─ client/                Browser helpers: api.ts, speech.ts, sentences.ts, history.ts
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
| Change the chat screen (layout) | `src/components/Conversation.tsx` |
| Change chat behaviour (history, saving, voice) | `src/components/useConversation.ts` |
| Change voice selection / speech | `src/lib/client/speech.ts` |
| Change Playback metrics / filler words | `src/lib/feedback/metrics.ts` (+ its tests) ([how-to](04-how-to/change-playback-metrics.md)) |
| Change colours / theme | `src/app/globals.css` |

## Conventions
- `"use client"` only where needed (interactive components, browser APIs). Modules that hold secrets or server logic (`src/lib/ai/client.ts`, `src/lib/server/guard.ts`) import `"server-only"`, so importing them from the browser fails the build. Pure modules (prompts, news parsers, metrics) don't need it.
- Pure logic lives in `src/lib/**` with a `*.test.ts` next to it.
- Imports use the `@/` alias for `src/`.
- Next.js 16: `params` and `searchParams` in pages are **Promises**; `await` them.
