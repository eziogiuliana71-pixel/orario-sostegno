/* Service worker dell'Agenda del docente: permette l'uso offline. */
const CACHE = "agenda-docente-v3";
const FILES = ["./", "manifest.json", "icon-192.png", "icon-512.png"];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).catch(() => {}));
});

self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim())
));

/* prima la rete (così gli aggiornamenti arrivano subito); senza connessione, la copia salvata */
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(r => { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); return r; })
      .catch(() => caches.match(e.request).then(m => m || caches.match("./")))
  );
});
