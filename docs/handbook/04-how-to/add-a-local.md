# How to add a Local

Time: ~15 minutes. No new components needed.

1. Open `src/lib/personas/personas.ts` and copy an existing persona object.
2. Fill in the fields (see `Persona` in `src/lib/personas/types.ts`):
   - `id`: lowercase, hyphenated and **permanent** (it is saved in users' history). Example: `"bronwen-cardiff"`.
   - `background` and `speechStyle`: these drive the AI's behaviour. Be warm and specific. **Never write a caricature.** Put dialect in word choice, not heavy phonetic spelling, because the text is read aloud by TTS.
   - `phrasebook`: 3–5 authentic phrases with plain meanings.
   - `voice`: `lang` (usually `en-GB`), `rate` 0.9–1.15, `pitch` 0.9–1.15, `gender`, and optional `preferredVoices` (installed voice names to try first).
   - `emoji` and `gradient`: Tailwind gradient classes, e.g. `"from-red-500 to-green-500"`.
3. Run `npm test`. The persona tests check id format, phrasebook and voice ranges.
4. Run `npm run dev`, open `/cuppa`, pick your Local and try two or three scenarios.
5. Ideally ask a native speaker from that region to review the persona.
6. Update `docs/handbook/01-product.md` (Locals table) and `CHANGELOG.md`.
