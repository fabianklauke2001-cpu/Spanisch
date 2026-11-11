// Service Worker: hält die App auf dem Gerät vor, damit sie ohne Internet startet.
// Strategie: sofort aus dem Speicher antworten und im Hintergrund die neueste Fassung holen. Eine neue Version ist beim nächsten Start aktiv.
const VERSION = '2026-11-11.1466eb', CACHE = 'spanisch-' + VERSION, SHELL = ["./","manifest.webmanifest","icons/apple-touch-icon.png","icons/favicon-48.png","icons/icon-192.png","icons/icon-512.png","fonts/atkinson-hyperlegible-next-latin-wght-normal.woff2","fonts/fraunces-latin-wght-italic.woff2","fonts/fraunces-latin-wght-normal.woff2"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, {cache: 'reload'})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.indexOf('spanisch-') === 0 && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const rq = e.request;
  if (rq.method !== 'GET') return;
  const u = new URL(rq.url);
  if (u.origin !== self.location.origin) return;
  const key = rq.mode === 'navigate' ? new URL('./', self.registration.scope).href : rq;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(key, {ignoreSearch: true});
    const net = fetch(rq).then(rs => { if (rs && rs.ok && rs.type === 'basic') c.put(key, rs.clone()).catch(() => {}); return rs; }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    const rs = await net;
    return rs || new Response('Keine Verbindung. Öffne die App einmal mit Internet, danach läuft sie offline.', {status: 503, headers: {'Content-Type': 'text/plain; charset=utf-8'}});
  }));
});
