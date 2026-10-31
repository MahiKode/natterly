# ADR-0004: Browser Web Speech API for speech in Phase 1

- **Status:** Accepted
- **Date:** 2026-10-31

## Context
Cloud speech-to-text and text-to-speech are the biggest cost in voice apps. Regional accent TTS voices (Brummie, Glaswegian) are scarce and mostly premium.

## Decision
Use the browser's free **Web Speech API**:
- Speech-to-text: `SpeechRecognition` / `webkitSpeechRecognition` (Chrome, Edge, Safari incl. iOS). Tap-to-talk, auto-stop on pause, `en-GB`.
- Text-to-speech: `speechSynthesis` with the best installed `en-GB` voice per persona (`pickVoice()`), tuned by rate and pitch, with optional preferred voice names (e.g. "Fiona", the Scottish voice on Apple devices).
- Replies are spoken **sentence by sentence while streaming** (`SentenceSpeaker`) for low latency.

## Consequences
- ✅ £0 speech cost; works offline for TTS.
- ⚠️ Voices vary by device; most Locals sound "generic British". Dialect comes through word choice and phrasing in the text.
- ⚠️ Firefox has no speech recognition; the UI falls back to typing.
- ⚠️ Chrome's recognition sends audio to Google's service; Safari may process on device. Mention in the privacy notice.
- 🔜 Phase 2: premium regional voices (Azure Neural / ElevenLabs) and pronunciation assessment for paying tiers, behind a `speech` gateway mirroring the AI gateway.
