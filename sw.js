/* Hors ligne : on garde une copie de l'application après la première visite */
const CACHE='revisions-lea-v1';
const FILES=['./','./index.html','./core.js','./ui.js','./manifest.webmanifest','./icon-192.png','./icon-512.png',
'./data/languefr.js','./data/gramarabe.js','./data/gramanglaise.js','./data/gestion.js','./data/economie.js','./data/civiarabe.js','./data/civianglo.js','./data/comecrite.js','./data/extra1.js','./data/extra2.js','./data/planning.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  /* réseau d'abord pour avoir la dernière version, cache si hors ligne */
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();if(r.ok&&new URL(e.request.url).origin===location.origin)caches.open(CACHE).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
});
