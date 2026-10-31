# Changelog

All notable changes to this project. Format: [Keep a Changelog](https://keepachangelog.com); versions follow [SemVer](https://semver.org).

## [Unreleased]

### Docs
- Onboarding drill fixes: add-a-local required fields, playback-metrics how-to, rollback and rotate-keys runbooks, README "no API key" section.

## [0.1.0] – 2026-10-31 · Phase 1 (private beta)

### Fixed (from code review, before release)
- Long conversations no longer fail after ~30 exchanges: only the last 24 turns are sent; feedback uses the last 40.
- The Local now opens the conversation in dev mode (React Strict Mode).
- Finishing mid-reply keeps the learner's last line in Playback.
- Turning voice off silences a reply that is still streaming.
- Cut-off replies show an error instead of being saved half-finished.
- Speech is split into one utterance per sentence.
- Hardened the guard: 64 KB body limit, trusted client IP, map pruning, env validation, constant-time code check.
- Feedback transcript capped; friendly briefing error messages; service worker only falls back to the home page for page navigations.

### Added
- **Cuppa**: one-to-one conversations with 7 Locals across 6 scenarios, with voice in and out (browser speech), live streaming replies, Phrasebook, and a Listening-mode toggle that hides subtitles.
- **The Briefing**: news narrator for UK, India, world, AI & tech, business and science (free RSS feeds), plus any topic via Wikipedia. Grounded follow-up Q&A.
- **Playback**: on-device speaking metrics (pace, fillers, clarity, vocabulary variety) and one-call AI coaching per session; history stored on the device.
- PWA: manifest, icons, service worker (installable on iOS/Android/desktop).
- Cost guards: optional beta access code and per-IP hourly rate limit.
- Documentation: handbook, ADRs 0001–0007, runbooks, onboarding drill, review checklist, agent instructions.
