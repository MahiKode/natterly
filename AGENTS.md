# Instructions for AI coding agents

You are working on **Natterly**, an English-conversation practice app. A human or agent should be able to pick this project up from the docs alone, so **keeping docs accurate is part of every change**.

## Before you change anything
1. Read `docs/README.md` → `docs/handbook/02-architecture.md` → `docs/handbook/03-codebase-tour.md`.
2. Skim `docs/adr/` for decisions you must not silently reverse. To reverse one, write a new ADR that supersedes it.

## Rules
- Run `npm run check` before you consider work done. Run `npm run build` if you touched routes, config or pages.
- **Docs are part of "done"**: update the handbook, how-tos and `CHANGELOG.md` in the same change. New terms go in `docs/handbook/06-glossary.md`.
- All LLM calls go through `src/lib/ai/` (the AI gateway). Never call a provider SDK from components or other modules.
- Keep prompts deterministic (no timestamps or random IDs in system prompts) so prompt caching keeps working.
- Personas and scenarios are **data** (`src/lib/personas/`). Adding a Local should not need new components.
- Never commit secrets. Config lives in env vars documented in `.env.example`.
- Cost matters: default to the cheapest model that does the job. Changing a model default needs an ADR.
- Write code a junior developer can follow: clear names, small functions, a short comment explaining *why* for anything non-obvious.

## Commands
```bash
npm install
npm run dev
npm run check   # typecheck + lint + tests
npm run build
```

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
