/*
Un Service Worker è un file JavaScript speciale che il browser esegue in background, separato dalla pagina 
(non ha accesso diretto al DOM). È come un proxy tra la tua webapp e la rete: può intercettare le richieste (fetch), 
gestire cache, abilitare offline, e alcune feature “da app” come push notification e background sync.
Perché non è un normale script JS
-Non gira dentro la pagina: gira in un contesto separato (worker).
-Non può fare document.querySelector(...).
-Si attiva su eventi: install, activate, fetch, ecc.
-È vincolato a HTTPS (Firebase Hosting va bene).
-Push notifications e background sync (opzionale): Con un service worker puoi ricevere notifiche anche a browser chiuso 
(se implementi Firebase Cloud Messaging, ecc.).
*/

/*NOTE MANIFEST
-start_url è richiesto dai browser Chromium per l’installabilità.
-scope evita che l’app “esca” dal contesto PWA e riapra col browser.
-purpose: "any maskable" è lo stile consigliato quando la stessa icona deve funzionare sia “normale” che “maskable”.
-display: "standalone" rimuove la barra del browser ma non può rimuovere la status bar di Android (quella di sistema).
*/

/* -------------------- OFFLINE CACHE -------------------- */
const CACHE_NAME = "procast-cache-v1";

// Metti qui i file “core” che vuoi disponibili offline.
// Aggiungi/togli asset in base al tuo progetto reale.
const APP_SHELL = [
  // root
  "/",
  "/index.html",

  // manifest (nel tuo progetto è dentro assets/img)
  "/assets/img/site.webmanifest",

  // CSS + map + SCSS (anche se SCSS/map non servono a runtime, li includo perché li vuoi offline)
  "/assets/css/scss/main.css",

  // Fonts (locali)
  "/assets/fonts/fonts.css",
  "/assets/fonts/icomoon.eot",
  "/assets/fonts/icomoon.svg",
  "/assets/fonts/icomoon.ttf",
  "/assets/fonts/icomoon.woff",

  // JS (locali)
  "/assets/js/pageBuild.js",
  "/assets/js/script.js",
  "/assets/js/serviceWorker.js", // se esiste davvero ed è servito come file statico

  // Immagini + icone
  "/assets/img/apple-touch-icon.png",
  "/assets/img/background.png",
  "/assets/img/favicon-96x96.png",
  "/assets/img/favicon.ico",
  "/assets/img/favicon.svg",
  "/assets/img/logo-procastination.png",

  "/assets/img/man.png",
  "/assets/img/woman.png",
  "/assets/img/man_or_woman.png",
  "/assets/img/question_mark.png",

  "/assets/img/man_level1.png",
  "/assets/img/man_level2.png",
  "/assets/img/man_level3.png",
  "/assets/img/man_level4.png",
  "/assets/img/man_level5.png",

  "/assets/img/woman_level1.png",
  "/assets/img/woman_level2.png",
  "/assets/img/woman_level3.png",
  "/assets/img/woman_level4.png",
  "/assets/img/woman_level5.png",

  // Icone PWA
  "/assets/img/web-app-manifest-192x192.png",
  "/assets/img/web-app-manifest-512x512.png",
];


//È la prima installazione del worker.Tipicamente qui pre-cachi i file statici.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

/*Scatta quando il worker diventa quello attivo.
Tipicamente qui:
-pulisci vecchie cache
-prendi controllo delle pagine aperte*/
self.addEventListener("activate", (event) => {
  //“cache first”: se c’è in cache lo usa, altrimenti va in rete.
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))));
      await self.clients.claim();
    })()
  );
});

/*Intercetta ogni richiesta fatta dalla pagina (HTML, CSS, JS, immagini, API…).
Qui puoi decidere:
-“cache first” (prima cache, poi rete)
-“network first” (prima rete, poi cache)
-“stale-while-revalidate” (servi cache e aggiorni in background)*/
// opzionale: lascia passare tutte le richieste (nessuna cache offline)
// Navigazioni: network-first con fallback alla cache (per SPA/PWA).
// Asset: cache-first (semplice e affidabile).
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Solo GET
  if (req.method !== "GET") return;

  // Navigazione (URL in address bar)
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          // opzionale: aggiorna cache dell'index
          const cache = await caches.open(CACHE_NAME);
          cache.put("/index.html", fresh.clone());
          return fresh;
        } catch {
          // fallback offline
          const cachedIndex = await caches.match("/index.html");
          return cachedIndex || new Response("Offline", { status: 503 });
        }
      })()
    );
    return;
  }

  // Asset same-origin: cache-first
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        });
      })
    );
  }
});


/* -------------------- PUSH NOTIFICATIONS (FCM) -------------------- */
/**
 * Se NON vuoi bundlare, Firebase consiglia compat packages con importScripts nel SW. :contentReference[oaicite:2]{index=2}
 * (Aggiorna la versione se cambi SDK)
 */
importScripts("https://www.gstatic.com/firebasejs/12.9.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.9.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBkKV-rYhwW3OS-btvrgp5pDSxHTlS9XHs",
  authDomain: "procastination-counter.firebaseapp.com",
  projectId: "procastination-counter",
  storageBucket: "procastination-counter.firebasestorage.app",
  messagingSenderId: "769651517850",
  appId: "1:769651517850:web:667ce95b181976885d3223"
});

// Istanza Messaging per gestire i messaggi in background
const messaging = firebase.messaging();

// Quando arriva un messaggio in background, puoi mostrare una notifica custom
messaging.onBackgroundMessage((payload) => {
  const title = payload?.notification?.title || "ProcastinationGame";
  const body = payload?.notification?.body || "Hai una nuova notifica";
  const link =
    payload?.fcmOptions?.link ||
    payload?.data?.link ||
    "/";

  self.registration.showNotification(title, {
    body,
    icon: "/assets/img/web-app-manifest-192x192.png",
    data: { link }
  });
});

// Click sulla notifica: apri o porta in primo piano la tua app
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const link = event.notification?.data?.link || "/";

  event.waitUntil(
    (async () => {
      const allClients = await clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const c of allClients) {
        // se la tua app è già aperta, focus
        if (c.url.startsWith(self.location.origin + "/")) {
          c.focus();
          c.navigate(link);
          return;
        }
      }
      // altrimenti apri
      await clients.openWindow(link);
    })()
  );
});