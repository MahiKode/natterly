# Contributing

## Workflow (lean team model)

| Role | Responsibility |
|---|---|
| **Product Owner** | Prioritises and accepts each phase. |
| **Lead Engineer** | Designs, builds, and writes/updates docs **in the same PR** as the code. |
| **Code Reviewer** | Reviews every PR against [docs/review-checklist.md](docs/review-checklist.md), including the docs gate. |
| **Onboarding drill** | At the end of each phase, someone with *no context* follows [docs/onboarding-drill.md](docs/onboarding-drill.md). Every place they get stuck becomes a docs fix. |

## Branches & commits
- Branch from `main`: `feat/<short-name>`, `fix/<short-name>`, `docs/<short-name>`, `chore/<short-name>`.
- [Conventional Commits](https://www.conventionalcommits.org): `feat: add Welsh Local`, `fix(chat): handle empty reply`, `docs: …`.
- Keep PRs small and focused. Fill in the PR template.

## Definition of done
- [ ] `npm run check` passes (CI enforces it).
- [ ] New logic has unit tests where practical (pure functions in `src/lib/**`).
- [ ] Docs updated: handbook / how-to / runbook / glossary as relevant, plus `CHANGELOG.md`.
- [ ] Significant decisions recorded as an ADR in `docs/adr/`.
- [ ] Reviewer approved.
