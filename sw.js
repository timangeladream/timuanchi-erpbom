// 最小化 Service Worker:只用來滿足瀏覽器「可安裝成 App」的條件,
// 不快取任何資料,所有請求原樣放行,避免安裝後看到舊版頁面或過期的庫存/進價資料。
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// 只接手同源、GET 的請求(網頁自己的檔案);不是這種的一律不處理,讓瀏覽器原生處理——
// 尤其是 Firebase SDK 對外(不同來源)發出的讀寫請求,交給瀏覽器原生處理最穩定,
// 攔截後再用 fetch() 手動轉發,遇到跨來源或串流特性的請求偶爾會失敗,
// 在 console 留下「Failed to fetch」的錯誤(不影響功能,但很擾人)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  event.respondWith(fetch(event.request));
});
