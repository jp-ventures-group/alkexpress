/* AlkExpress Team: Service Worker nur für Push-Benachrichtigungen (kein Caching). */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { titel: "AlkExpress", text: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.titel || "AlkExpress", {
    body: d.text || "",
    tag: d.tag || "ae",
    renotify: true,
    requireInteraction: true,
    vibrate: [300, 120, 300, 120, 300],
    icon: "/img/icon-192.png",
    badge: "/img/icon-192.png",
    data: { url: d.url || "/lager.html" }
  }));
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "/lager.html";
  e.waitUntil((async () => {
    const list = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of list) { if (c.url.includes("/lager")) { await c.focus(); return; } }
    await self.clients.openWindow(url);
  })());
});
