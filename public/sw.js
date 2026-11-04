/* EduVerse service worker: shell luring + cache aset statis. */
const VERSI = "eduverse-v1";
const CEPAT_SAJA = ["/", "/offline.html", "/manifest.webmanifest", "/icon.svg", "/icon.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(VERSI)
      .then((cache) => Promise.all(CEPAT_SAJA.map((sumber) => cache.add(new Request(sumber, { cache: "reload" })).catch(() => undefined))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((kunci) => Promise.all(kunci.filter((nama) => nama !== VERSI).map((nama) => caches.delete(nama))))
      .then(() => self.clients.claim()),
  );
});

const statis = (url) => url.pathname.startsWith("/assets/") || /\.(css|js|svg|png|jpg|webp|woff2?)$/.test(url.pathname);

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Data dan identitas tidak pernah dilayan dari cache.
  if (url.pathname.startsWith("/functions/")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((jawaban) => {
          const salinan = jawaban.clone();
          caches.open(VERSI).then((cache) => cache.put("/index-shell.html", salinan)).catch(() => undefined);
          return jawaban;
        })
        .catch(async () => {
          const cache = await caches.open(VERSI);
          return (
            (await cache.match("/")) ||
            (await cache.match("/index-shell.html")) ||
            (await cache.match("/offline.html")) ||
            new Response("Luring", { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } })
          );
        }),
    );
    return;
  }

  if (statis(url)) {
    event.respondWith(
      caches.match(request).then((tersimpan) => {
        if (tersimpan) return tersimpan;
        return fetch(request).then((jawaban) => {
          if (jawaban.ok) {
            const salinan = jawaban.clone();
            caches.open(VERSI).then((cache) => cache.put(request, salinan)).catch(() => undefined);
          }
          return jawaban;
        });
      }),
    );
  }
});
