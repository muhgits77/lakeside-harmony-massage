const CACHE_VERSION = 'v1';
const CACHE_NAME = `lakeside-harmony-${CACHE_VERSION}`;
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/js/main.js',
  '/css/',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch((err) => {
        // ignore individual fetch failures
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

// Basic fetch handler: Cache-first for same-origin assets, fallback to network, then index.html
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // For navigation requests, use network-first then cache fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(res => {
        // optionally cache navigation responses
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        return res;
      }).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // For same-origin assets, try cache first
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).then((res) => {
        try {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        } catch (err) {}
        return res;
      }).catch(() => {
        // fallback to index for HTML, otherwise fail
        if (req.headers.get('accept') && req.headers.get('accept').includes('text/html')) return caches.match('/index.html');
        return new Response('', { status: 503, statusText: 'Service Unavailable' });
      }))
    );
  }
});
