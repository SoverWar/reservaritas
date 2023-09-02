/* eslint-disable no-restricted-globals */

// Nombre de la cache
const CACHE_NAME = 'my-cache';

// Archivos/ rutas a cachear
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/script/main.js'
];

// Instalación del service worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Evento fetch
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            if (response) {
                return response;
            }

            return fetch(event.request).then(
                function(response) {
                    if(!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    var responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(function(cache) {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                }
            );
        })
    );
});

// Evento activate
// Que hacer cuando el service worker se activa
self.addEventListener('activate', event => {
    var cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.forEach(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
