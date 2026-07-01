const CACHE_VERSION = 'v3-premium';
const CACHE_NAME = `lakeside-harmony-${CACHE_VERSION}`;

// Core assets + optimized WebP images + icons for ultra fast loads + offline
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/styles.css',
  '/js/main.js',
  // All original fallbacks
  '/images/1.jpg',
  '/images/2.jpg',
  '/images/3.jpg',
  '/images/4.jpg',
  '/images/5.jpg',
  '/images/6.jpg',
  '/images/7.jpg',
  '/images/8.jpg',
  '/images/hero.jpg',
  // Optimized WebPs (main + responsive)
  '/images/hero.webp',
  '/images/hero-480w.webp',
  '/images/hero-768w.webp',
  '/images/hero-1024w.webp',
  '/images/hero-1280w.webp',
  '/images/1.webp',
  '/images/1-480w.webp',
  '/images/1-768w.webp',
  '/images/1-1024w.webp',
  '/images/1-1280w.webp',
  '/images/2.webp',
  '/images/2-360w.webp',
  '/images/2-480w.webp',
  '/images/2-640w.webp',
  '/images/2-864w.webp',
  '/images/3.webp',
  '/images/3-480w.webp',
  '/images/3-768w.webp',
  '/images/3-1024w.webp',
  '/images/3-1280w.webp',
  '/images/4.webp',
  '/images/4-480w.webp',
  '/images/4-768w.webp',
  '/images/4-1024w.webp',
  '/images/5.webp',
  '/images/5-480w.webp',
  '/images/5-768w.webp',
  '/images/5-1024w.webp',
  '/images/5-1280w.webp',
  '/images/6.webp',
  '/images/6-480w.webp',
  '/images/6-768w.webp',
  '/images/6-1024w.webp',
  '/images/7.webp',
  '/images/7-480w.webp',
  '/images/7-768w.webp',
  '/images/7-1024w.webp',
  '/images/7-1280w.webp',
  '/images/8.webp',
  '/images/8-480w.webp',
  '/images/8-768w.webp',
  '/images/8-1024w.webp',
  // PWA icons
  '/images/icon-192.png',
  '/images/icon-384.png',
  '/images/apple-touch-icon.png'
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
