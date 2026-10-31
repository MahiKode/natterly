# 7. FAQ

**Why do all the Locals sound similar?**
Phase 1 uses the voices installed on your device (ADR-0004). Accent comes through vocabulary and phrasing. Premium regional voices are planned for Phase 2. On Apple devices, Morag uses "Fiona" (Scottish) if installed: Settings → Accessibility → Spoken Content → Voices → English.

**The mic button doesn't appear.**
The browser has no speech recognition (e.g. Firefox). Use Chrome, Edge or Safari.

**"Microphone permission was blocked".**
Allow the microphone for the site in browser settings. Voice also needs HTTPS (or localhost).

**Why does the Local speak first?**
Most scenarios have `localOpens: true`, so the server sends a hidden "learner has joined" cue because the API needs a user message first (`withOpeningCue`).

**Where is my history stored?**
In your browser's `localStorage` only. Clearing site data deletes it.

**Why aren't there accounts or payments?**
Deliberately postponed (ADR-0002, roadmap Phase 2/5).

**Tests pass but the build fails?**
Run `npm run build`. Next.js does extra checks, such as route files only exporting HTTP handlers. Put helpers in `src/lib/`.

**How do I test the AI without spending money?**
Unit tests don't call the AI. For UI work you can mock `/api/chat` (see the Playwright example in `docs/onboarding-drill.md`), or set a tiny monthly spend limit on a dev key.
