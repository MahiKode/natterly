/*
 * Natterly service worker: makes the app installable and keeps the app shell
 * available on flaky connections. Deliberately simple:
 *  - API calls (/api/*) always go to the network and are never cached.
 *  - Other same-origin GETs: network first, then the last cached copy.
 *  - Only page navigations fall back to the cached home page when offline.
 *    (Giving HTML to a failed script or data request would break the page.)
 * Bump CACHE whenever this file's behaviour changes; old caches are deleted on activate.
 */
const CACHE = "natterly-v2";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(["/", "/manifest.webmanifest", "/icon.svg"])));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  event.respondWith(
    fetch(request)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
        }
        return res;
      })
      .catch(async () => {
        const hit = await caches.match(request);
        if (hit) return hit;
        if (request.mode === "navigate") return (await caches.match("/")) ?? Response.error();
        return Response.error();
      }),
  );
});
