// 最小化 Service Worker:只用來滿足瀏覽器「可安裝成 App」的條件,
// 不快取任何資料,所有請求原樣放行,避免安裝後看到舊版頁面或過期的庫存/進價資料。
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// 只接手同源、GET 的請求(網頁自己的檔案);不是這種的一律不處理,讓瀏覽器原生處理——
// 尤其是 Firebase SDK 對外(不同來源)發出的讀寫請求,交給瀏覽器原生處理最穩定
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  // 網頁本身的讀取(navigate,例如直接打開網址、重新整理)不攔截,交給瀏覽器原生處理——
  // 這類請求最容易因為分頁關閉/切換到一半被中斷,攔截轉發反而容易在 console 留下
  // 「Failed to fetch」的錯誤;瀏覽器只要偵測到有註冊 fetch 事件就符合「可安裝成 App」
  // 的條件,不需要連這種請求也攔截轉發
  if (event.request.mode === 'navigate') return;
  // 其餘同源請求(圖片、CSS、JS 等)還是攔截轉發,保持原樣放行、不做任何快取;
  // 加上 catch 是避免偶發的轉發失敗變成「Uncaught (in promise)」留在 console,
  // 不影響實際功能,失敗時瀏覽器重新整理就會恢復正常
  event.respondWith(
    fetch(event.request).catch(() => new Response('', { status: 504, statusText: 'Service Worker fetch failed' }))
  );
});
