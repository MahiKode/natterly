# CLAUDE.md

> Same content as AGENTS.md (kept for tools that look for CLAUDE.md). Edit both together.

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
