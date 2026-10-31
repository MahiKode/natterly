# Onboarding drill

Run at the end of every phase by someone (human or AI agent) with **no prior context**, using only the repo and these docs. Every point where they get stuck or have to guess is a docs bug. Fix it before the phase is signed off.

## Tasks (target: under 2 hours in total)
1. **Orient:** From `docs/README.md`, explain in 5 sentences what Natterly does and how a voice message flows from mic to speaker.
2. **Run it:** Clone, install and run locally (`README.md` quick start). Have a typed conversation with a Local.
3. **Quality gate:** Run `npm run check` and `npm run build`; both pass.
4. **Change it:** Add a new Local (e.g. "Bronwen, Cardiff") by following the how-to. Tests pass, and she appears in Cuppa and The Briefing.
5. **Change behaviour:** Add a filler word to `metrics.ts` with a unit test.
6. **Operate it:** Without help, describe the steps to roll back a bad deploy and to rotate the API key.
7. **Decisions:** Answer: why does the app use browser speech instead of cloud TTS? Where is that decided?

## Testing the UI without spending AI credit
Use Playwright to mock the chat endpoint:

```js
await page.route("**/api/chat", (route) =>
  route.fulfill({
    contentType: "application/x-ndjson",
    body: '{"type":"text","text":"Ay up! Ow am ya?"}\n{"type":"done"}\n',
  }),
);
```

## Record
| Date | Who | Phase | Stuck points → docs fixed |
|---|---|---|---|
| | | 1 | |
