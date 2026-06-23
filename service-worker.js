/* StartWise service worker.
   Network-first for the page + app code (so updates always show when online),
   cache-first for static assets (fonts, images). Falls back to cache offline. */
const CACHE = "startwise-v6";
const CORE = [
  "StartWise.html",
  "manifest.webmanifest",
  "icon-192.png",
  "icon-512.png",
  "apple-touch-icon.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).catch(() => {}).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (e) => { if (e.data === "skipWaiting") self.skipWaiting(); });

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  let url;
  try { url = new URL(req.url); } catch (err) { return; }
  const isDoc = req.mode === "navigate" || /\.html$/.test(url.pathname);
  const isCode = /\.(jsx?|css)$/.test(url.pathname);

  if (isDoc || isCode) {
    // network-first: always prefer fresh code/page, fall back to cache offline
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          if (res && res.ok) caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match("StartWise.html")))
    );
    return;
  }

  // cache-first for static assets (images, fonts, library bundles)
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      const copy = res.clone();
      if (res && res.ok && (res.type === "basic" || res.type === "cors")) caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => hit))
  );
});
