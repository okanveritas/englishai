const CACHE_NAME = 'ai-quiz-prod-v2';
const BASE_PATH = '/englishai/'; // REPO ADINIZ
const urlsToCache = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'manifest.json',
  BASE_PATH + 'apple-icon.png',
  BASE_PATH + 'sw.js'
];

// INSTALL
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// FETCH
self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith(location.origin + BASE_PATH)) {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
        .catch(() => caches.match(BASE_PATH + 'index.html'))
    );
  }
});

// ACTIVATE
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      );
    })
  );
});
