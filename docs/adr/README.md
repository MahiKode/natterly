# Architecture Decision Records

An ADR records one significant decision: the context, what was decided, and the consequences. ADRs are **never deleted**. To change a decision, add a new ADR that *supersedes* the old one, and mark the old one as superseded.

| # | Decision | Status |
|---|---|---|
| [0001](0001-single-nextjs-app.md) | One Next.js app (not a monorepo or microservices) | Accepted |
| [0002](0002-no-accounts-in-phase-1.md) | No accounts or database in Phase 1; history on device | Accepted |
| [0003](0003-ai-gateway-and-cheap-model.md) | AI gateway + Claude Haiku by default | Accepted |
| [0004](0004-browser-speech-first.md) | Browser Web Speech API for STT/TTS in Phase 1 | Accepted |
| [0005](0005-briefing-sources-rss-wikipedia.md) | The Briefing gathers sources from RSS + Wikipedia, not AI web search | Accepted |
| [0006](0006-access-code-and-rate-limit.md) | Access code + in-memory rate limit for the beta | Accepted |
| [0007](0007-pwa-first-capacitor-later.md) | PWA first; native apps later via Capacitor | Accepted |

Template: copy [0000-template.md](0000-template.md).
