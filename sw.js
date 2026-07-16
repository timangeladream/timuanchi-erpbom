// 最小化 Service Worker:只用來滿足瀏覽器「可安裝成 App」的條件,
// 不快取任何資料,所有請求原樣放行,避免安裝後看到舊版頁面或過期的庫存/進價資料。
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
