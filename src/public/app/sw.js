
/* global self */

const cacheName = 'v1';
const cacheFiles = [
  './app.js',
  './index.html',
  './favicon.ico',
  'https://fonts.googleapis.com/css?family=Source+Sans+Pro',
];

self.addEventListener('install', e => {
  console.log('[SW] Installed');
  e.waitUntil(
    self.caches.open(cacheName)
    .then(cache => {
      return cache.addAll(cacheFiles);
    })
  );

});

self.addEventListener('activate', e => {

  console.log('[SW] Activated');
  e.waitUntil(
    self.caches.keys()
    .then(cacheNames => {
      return Promise.all(cacheNames.map(itemChacheName => {
        if (itemChacheName !== cacheName) {
          console.log('[SW] Removing cached files from ', itemChacheName);
          return self.caches.delete(itemChacheName);
        }
      }));
    })
  );

});


self.addEventListener('fetch', e => {

  const url = e.request.url;
  console.log('[SW] Fetching', url);

  const isApiCall = url.indexOf('/api/') >= 0;
  if (isApiCall) {
    e.respondWith(self.fetch(e.request));

  } else {
    e.respondWith(
      self.caches.match(e.request)
      .then(response => {
        if (response) {
          console.log('[SW] Found in cache', url);
          return response;
        }

        const requestClone = e.request.clone();

        self.fetch(requestClone)
        .then(fetchResponse => {
          if (!fetchResponse) {
            console.log('[SW] No response from fetch');
            return fetchResponse;
          }
          const responseClone = fetchResponse.clone();
          self.caches.open(cacheName)
          .then(cache => {
            cache.put(e.request, responseClone);
            return response;
          });
        })
        .catch(error => {
          console.log('[SW] Error Fetching && Catching', error);
        });
      })
    );
  }


});

