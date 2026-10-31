# Code review checklist

The reviewer checks every PR against this list. Block the merge on any ❌ in the first three sections.

## Correctness & safety
- [ ] Does what the PR says; edge cases handled (empty input, network failure, unsupported browser).
- [ ] Inputs validated at API boundaries (Zod schemas in `src/lib/api-schema.ts`).
- [ ] No secrets in code; no API keys reach the browser; server-only modules import `"server-only"`.
- [ ] New AI calls go through `src/lib/ai/`, set sensible `max_tokens`, and handle errors and refusals.

## Cost
- [ ] No new paid service or more expensive model default without an ADR.
- [ ] Prompts stay deterministic (cacheable); history stays bounded.

## Docs gate (the "junior dev" check)
- [ ] Could a newcomer understand this change from the code and docs alone?
- [ ] If any code is too complex to explain in two sentences, simplify it or add a *why* comment.
- [ ] Handbook / how-to / runbook / glossary updated as needed; `CHANGELOG.md` updated.

## Quality
- [ ] Tests for new pure logic; `npm run check` green; `npm run build` green.
- [ ] Readable names, small functions, matches surrounding style.
- [ ] UI: works at phone width (no horizontal scroll), keyboard accessible, readable in dark mode.
