const v = 2;
const cacheStaticVer = `static-v${v}`;
const cacheDynamicVer = `dynamic${v}`;

self.addEventListener('install', (e) => {
  console.log("Service Worker installing...");
  e.waitUntil(
    caches.open(cacheStaticVer)
    .then((cache) => {
      console.log('[Service Worker] Precaching app shell');
      cache.addAll([
        '/',
        'index.html',
        'restaurant.html',
        'js/main.js',
        'js/dbhelper.js',
        'js/restaurant_info.js',
        'css/styles.css',
        'data/restaurants.json',
        'src/images/main-image.jpg',
        'https://normalize-css.googlecode.com/svn/trunk/normalize.css',
        'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css'
      ]);
    })
  );
});


self.addEventListener('activate', (e) => {
  console.log("Service Worker activating...");
  e.waitUntil(
    caches.keys()
    .then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== cacheStaticVer && key !== cacheDynamicVer) {
          console.log('Removing old cache..', key);
          caches.delete(key);
        }
      }))
    })
  )
  return self.clients.claim();
})

self.addEventListener('fetch', (e) => {
  //console.log('Service Worker fetching...', e);
  e.respondWith(
    caches.match(e.request)
    .then((res) => {
      if (res) {
        return res;
      }else{
        return fetch(e.request)
        .then((res) => {
          return caches.open(cacheDynamicVer)
          .then((cache) => {
            cache.put(e.request.url, res.clone())
            return res;
          })
        }).catch((err) => {

        })
      }
    })
  );
})
