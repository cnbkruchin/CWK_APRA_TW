/* Service worker: ทำให้แอพเปิดได้แม้ไม่มีอินเทอร์เน็ตในสนามแข่ง */
const CACHE = 'cwk-apra-v1.1.0';
const ASSETS = [
  './',
  './index.html',
  './config.js',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms));

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  // ไม่ยุ่งกับคำขอไปเว็บอื่น (เช่น Firebase) และคำขอที่ไม่ใช่ GET
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  const isPage = req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
  const isConfig = url.pathname.endsWith('/config.js');

  if (isPage || isConfig) {
    // หน้าแอพและ config: ใช้ของใหม่จากเน็ตก่อน (รอไม่เกิน 3.5 วิ) ถ้าไม่มีเน็ตใช้ของในเครื่อง
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const res = await Promise.race([fetch(req), timeout(3500)]);
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      } catch (err) {
        const hit = await cache.match(req, { ignoreSearch: true });
        if (hit) return hit;
        if (isPage) return (await cache.match('./index.html')) || (await cache.match('./')) || Response.error();
        return Response.error();
      }
    })());
    return;
  }

  // ไฟล์อื่น (ไอคอน ฯลฯ): เปิดจากเครื่องทันที แล้วอัปเดตเบื้องหลัง
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req, { ignoreSearch: true });
      const network = fetch(req)
        .then((res) => { if (res && res.ok) cache.put(req, res.clone()); return res; })
        .catch(() => cached);
      return cached || network;
    })
  );
});
