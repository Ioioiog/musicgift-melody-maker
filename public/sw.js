
const CACHE_NAME = 'musicgift-v1.0.0';
const RUNTIME_CACHE = 'runtime-cache';

// Assets to cache on install
const PRECACHE_URLS = [
  '/',
  '/packages',
  '/order',
  '/gift',
  '/about',
  '/contact',
  '/uploads/logo_musicgift.webp',
  '/uploads/1247309a-2342-4b12-af03-20eca7d1afab.png'
];

// Install event - cache essential resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE)
          .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request)
            .then(response => {
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(RUNTIME_CACHE)
                  .then(cache => cache.put(event.request, responseClone));
              }
              return response;
            });
        })
        .catch(() => {
          // Fallback to homepage for navigation requests
          return caches.match('/');
        })
    );
    return;
  }

  // Handle other requests (assets, API calls, etc.)
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(event.request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200) {
              return response;
            }

            // Cache images and static assets
            if (event.request.destination === 'image' || 
                event.request.url.includes('/uploads/') ||
                event.request.url.includes('.css') ||
                event.request.url.includes('.js')) {
              const responseClone = response.clone();
              caches.open(RUNTIME_CACHE)
                .then(cache => cache.put(event.request, responseClone));
            }

            return response;
          });
      })
  );
});

// Background sync for offline form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'order-sync') {
    event.waitUntil(syncOrderData());
  }
});

async function syncOrderData() {
  // Handle offline order submissions when back online
  try {
    const orders = await getStoredOrders();
    for (const order of orders) {
      await submitOrder(order);
      await removeStoredOrder(order.id);
    }
  } catch (error) {
    console.log('Background sync failed:', error);
  }
}

// Helper functions for offline storage
async function getStoredOrders() {
  // Implementation would depend on IndexedDB storage
  return [];
}

async function submitOrder(order) {
  // Submit order to server
  return fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  });
}

async function removeStoredOrder(orderId) {
  // Remove from IndexedDB after successful submission
}
