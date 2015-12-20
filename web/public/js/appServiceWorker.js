var CACHE_NAME = "blobs-app-cache";
var urlsToCache = [
        '/',
        '/css/styles.css',
        '/js/script.js',
        '/imgs/cat-falls-over.gif'//,
        //new Request('//example.com/whatever/script.js', {mode: 'no-cors'})
      ];

// when the browser sees this SW for the first time
self.addEventListener('install', function(event) {
  //console.log("SW install", event);
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

//when a new page or resource is requested
self.addEventListener('fetch', function(event) {
  //console.log("SW fetch", event);
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        //Cache hit - return response
        if (response) {
          return response;
        }

        //Clone the request. A request is a stream and can only be consumed once 
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            //Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            //Clone the response. Both browser and the cache need to consume it
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
    );
});

//When a serviceworker is activated (ie. reinstalled)
self.addEventListener('activate', function(event) {
  //console.log("SW activate", event);
});