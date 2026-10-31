# ADR-0007: PWA first; native apps later via Capacitor

- **Status:** Accepted
- **Date:** 2026-10-31

## Context
The Product Owner wants a web app and a mobile app. Building native apps separately doubles the work.

## Decision
Phase 1 ships a **Progressive Web App**: `public/manifest.webmanifest`, icons, and `public/sw.js` (network-first, never caches `/api/*`). Users install it from the browser ("Add to Home Screen").
In Phase 2, wrap the same web app with **Capacitor** for App Store / Play Store builds, adding native speech plugins where the browser APIs are weak.

## Consequences
- ✅ One codebase for web, Android and iOS.
- ⚠️ iOS PWAs have limits (no install prompt, some background restrictions). Acceptable for beta.
