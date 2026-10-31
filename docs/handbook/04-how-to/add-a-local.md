# How to add a Local

Time: ~15 minutes. No new components needed.

1. Open `src/lib/personas/personas.ts` and copy an existing persona object.
2. Fill in **every** field (all are required except `voice.preferredVoices`; see `Persona` in `src/lib/personas/types.ts`):
   - `id`: lowercase, hyphenated and **permanent** (it is saved in users' history). Example: `"bronwen-cardiff"`.
   - `name` (e.g. `"Bronwen"`), `accentLabel` (card label, e.g. `"Cardiff (Welsh)"`), `tagline` (one line shown on cards).
   - `background` and `speechStyle`: these drive the AI's behaviour. Be warm and specific. **Never write a caricature.** Put dialect in word choice, not heavy phonetic spelling, because the text is read aloud by TTS.
   - `phrasebook`: 3–5 authentic phrases with plain meanings.
   - `voice`: `lang` (usually `en-GB`), `rate` 0.9–1.15, `pitch` 0.9–1.15, `gender`, and optional `preferredVoices` (installed voice names to try first).
   - `emoji` and `gradient`: Tailwind gradient classes, e.g. `"from-red-500 to-green-500"`.
3. Run `npm test`. The persona tests check: unique URL-safe ids, a non-empty phrasebook, and rate and pitch both between 0.85 and 1.2.
4. Run `npm run dev` and check she appears on `/` (Meet the Locals), `/cuppa` and `/briefing` (presenter list). Try two or three scenarios. No API key? See "Trying the app without an API key" in the README.
5. Ideally ask a native speaker from that region to review the persona.
6. Update the Locals list and count in `README.md` and `docs/handbook/01-product.md`, then add an entry under `[Unreleased]` in `CHANGELOG.md`.
