# How to change Playback metrics (e.g. filler words)

All speaking metrics are pure functions in `src/lib/feedback/metrics.ts`, tested in `metrics.test.ts`. They run in the browser and cost nothing.

## Add a filler word
1. One-word fillers go in `ONE_WORD_FILLERS` and two-word fillers in `TWO_WORD_FILLERS`, all **lowercase**. Phrases of three or more words (e.g. "to be honest") are **not supported** and will silently never match. Extend `countFillers` first if you need them.
2. Be careful with words that also have a real meaning. "like" is only counted when the previous word isn't in `LIKE_AS_VERB_BEFORE` ("I like tea" is not a filler). Add a similar guard if your word needs one.
3. Add a test to `countFillers` in `metrics.test.ts`, covering both a filler use and a real-meaning use.
4. Add an entry under `[Unreleased]` in `CHANGELOG.md`.

## Change the pace guidance
`describePace()` holds the wpm thresholds and messages. Update its test too.

## Add a new metric
Add a field to `SpeakingMetrics`, compute it in `computeMetrics()`, test it, then show it in `src/app/playback/[id]/page.tsx`.
