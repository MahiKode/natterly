"use client";

import { useEffect } from "react";

/** Registers the PWA service worker (public/sw.js) in production builds. */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Not fatal: the app works without offline support.
      });
    }
  }, []);
  return null;
}
