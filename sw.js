const v = 1;
const cacheStaticVer = `static-v${v}`;
const cacheDynamicVer = `dynamic${v}`;


const staticArr = [
  '/',
  'index.html',
  'restaurant.html',
  'js/main.js',
  'js/dbhelper.js',
  'js/restaurant_info.js',
  'css/styles.css',
  '/img/icons/dish.png',
  'https://normalize-css.googlecode.com/svn/trunk/normalize.css',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css'
]

/**
* Installing Service Worker
*/
self.addEventListener('install', (e) => {
  console.log("Service Worker installing...");
  e.waitUntil(
    caches.open(cacheStaticVer)
    .then((cache) => {
      console.log('[Service Worker] Precaching app shell');
      cache.addAll(staticArr);
    })
  );
});


/**
* Activating Service Worker
*/
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


/**
* Service worker cache and network side by side
* Cache dot network strategy
*/
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
