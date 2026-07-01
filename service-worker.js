const CACHE_VERSION = 'v2';
const CACHE_NAME = `lakeside-harmony-${CACHE_VERSION}`;

// Core assets + all images for reliable offline / fast loads
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/styles.css',
  '/js/main.js',
  // All images for guaranteed loading + PWA
  '/images/1.jpg',
  '/images/2.jpg',
  '/images/3.jpg',
  '/images/4.jpg',
  '/images/5.jpg',
  '/images/6.jpg',
  '/images/7.jpg',
  '/images/8.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch(() => {
        // Continue even if some assets fail to cache during install
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// Advanced fetch handler: Cache-first for static + images (fast reliable loads), network-first for navigations
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Navigations: network first, fallback to cached shell
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(req, clone));
          }
          return res;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Same-origin: images + styles + js — cache-first for speed + offline reliability
  if (url.origin === location.origin) {
    const isImage = url.pathname.startsWith('/images/');
    const isStatic = /\.(css|js|json|jpg|jpeg|png|webp|svg|ico)$/.test(url.pathname);

    if (isImage || isStatic) {
      event.respondWith(
        caches.match(req).then(cached => {
          if (cached) return cached;
          return fetch(req).then(res => {
            if (res.ok) {
              const clone = res.clone();
              caches.open(CACHE_NAME).then(c => c.put(req, clone)).catch(() => {});
            }
            return res;
          }).catch(() => {
            // graceful image fallback (returns nothing visible but prevents broken UI)
            if (isImage) return new Response('', { status: 200, headers: { 'Content-Type': 'image/jpeg' } });
            return caches.match('/index.html');
          });
        })
      );
      return;
    }

    // Other same-origin: cache then network
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        try {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, clone));
        } catch (_) {}
        return res;
      }).catch(() => caches.match('/index.html')))
    );
  }
});
