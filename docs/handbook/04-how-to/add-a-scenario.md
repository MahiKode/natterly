# How to add a scenario

1. Add an object to `SCENARIOS` in `src/lib/personas/scenarios.ts`:
   - `id` (permanent), `title`, `emoji`, `description` (shown to learners).
   - `brief`: instructions to the Local for this situation. Say what role the Local plays, what to ask, and one realistic challenge to include.
   - `localOpens`: `true` if the Local should speak first.
2. `npm run dev` → `/cuppa` → try it with two different Locals.
3. Update `docs/handbook/01-product.md` if user-facing, and `CHANGELOG.md`.
