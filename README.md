# Natterly 🗣️

**Talk like a local. Speak like a pro.**

Natterly is a voice-first web app (installable as a PWA on phones) where people practise real-world English conversation with friendly AI **Locals**: a London barista, a Brummie cabbie, a Glaswegian teacher, an IT manager, a corner-shop owner, a Gen-Z student and a speaking coach. Then they get honest, useful feedback on how they sound.

| Feature | What it does |
|---|---|
| ☕ **Cuppa** | One-to-one voice chat with a Local in a scenario: casual natter, shop/café, work meeting, job interview, stage & presentation, friendly debate. |
| 📻 **The Briefing** | A Local narrates today's UK / India / world / AI news (or any topic, e.g. "Egyptian culture") and answers your follow-up questions. |
| 📈 **Playback** | After each session: pace (wpm), filler words, clarity, vocabulary variety, plus AI coaching ("say it even better"). |

> **Status:** Phase 1 (private beta). See [docs/product/roadmap.md](docs/product/roadmap.md).

## Quick start

Requires Node.js 20.9+ (22 recommended, see `.nvmrc`).

```bash
npm install
cp .env.example .env.local      # then add your ANTHROPIC_API_KEY
npm run dev                      # http://localhost:3000
```

Use **Chrome, Edge or Safari** for voice input (Firefox can type only). Stop the server with **Ctrl+C**.

### Trying the app without an API key
The UI loads, but chats show "ANTHROPIC_API_KEY is not set". To work on the UI without a key, mock `/api/chat` (example in [docs/onboarding-drill.md](docs/onboarding-drill.md)). The Briefing also needs outbound internet access to news feeds and Wikipedia.

`npm install` may report a few moderate advisories in dev-only lint tooling (eslint plugins). They don't ship to users; `npm audit --omit=dev` shows the production picture.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local development server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run check` | Typecheck + lint + unit tests (CI runs this, then `npm run build`) |
| `npm test` | Unit tests only (Vitest) |

## Documentation

**New here? Start with [docs/README.md](docs/README.md).** It maps everything: product, architecture, codebase tour, how-tos, runbooks and decision records.

AI coding agents: read [AGENTS.md](AGENTS.md) first.

## Tech at a glance

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Anthropic Claude Haiku (via a small AI gateway) · browser Web Speech API for free speech-to-text and text-to-speech · Vitest.

## Licence

Proprietary. © MahiKode. All rights reserved.
