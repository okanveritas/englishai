const CACHE_NAME = 'ai-quiz-v' + new Date().getTime(); // Her deployda değişen benzersiz isim
const BASE_PATH = '/englishai/';
const ASSETS = [
  BASE_PATH,
  BASE_PATH + 'index.html?t=' + Date.now(),
  BASE_PATH + 'manifest.json?t=' + Date.now(),
  BASE_PATH + 'sw.js?t=' + Date.now(),
  BASE_PATH + 'styles.css?t=' + Date.now(),
  BASE_PATH + 'app.js?t=' + Date.now()
];

// 1. INSTALL - Yeni cache oluştur
self.addEventListener('install', event => {
  self.skipWaiting(); // Hemen aktifleş
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Yeni cache oluşturuldu:', CACHE_NAME);
        return cache.addAll(ASSETS);
      })
  );
});

// 2. ACTIVATE - Eski cache'leri temizle
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('Eski cache siliniyor:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // Tüm tabları kontrol et
  );
});

// 3. FETCH - Network-first stratejisi
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request) // Önce network'ten dene
      .then(response => {
        // Yeni veriyi cache'e yaz
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request)) // Offline destek
  );
});

// 4. MESSAGE - Manuel güncelleme tetikleme
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
