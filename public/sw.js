
// Service Worker v2.0 - Fixed HEAD request handling
const CACHE_VERSION = 'v2.0';
const CACHE_NAME = `musicgift-cache-${CACHE_VERSION}`;
const OLD_CACHE_NAMES = ['musicgift-cache-v1.0', 'musicgift-cache'];

// Resources to cache (only for GET requests)
const STATIC_RESOURCES = [
  '/',
  '/uploads/background.webp',
  '/uploads/logo_musicgift.webp',
  '/uploads/video_placeholder.png'
];

// Install event - Cache static resources and clean up old caches
self.addEventListener('install', (event) => {
  console.log('Service Worker v2.0 installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static resources
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(STATIC_RESOURCES.map(url => new Request(url, { method: 'GET' })));
      }),
      // Clean up old caches
      cleanupOldCaches(),
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - Take control and cleanup
self.addEventListener('activate', (event) => {
  console.log('Service Worker v2.0 activating...');
  
  event.waitUntil(
    Promise.all([
      cleanupOldCaches(),
      self.clients.claim()
    ])
  );
});

// Fetch event - Handle requests with proper method filtering
self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  // Only handle GET requests - ignore HEAD, POST, PUT, DELETE, etc.
  if (request.method !== 'GET') {
    console.log(`Ignoring ${request.method} request to ${request.url}`);
    return; // Let the browser handle non-GET requests normally
  }
  
  // Only cache certain resources
  if (shouldCache(request.url)) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(request)
            .then((response) => {
              // Only cache successful GET responses
              if (response.status === 200 && request.method === 'GET') {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  })
                  .catch((error) => {
                    console.warn('Failed to cache resource:', error);
                  });
              }
              return response;
            })
            .catch((error) => {
              console.warn('Fetch failed:', error);
              throw error;
            });
        })
    );
  }
});

// Helper function to determine if a resource should be cached
function shouldCache(url) {
  const urlObj = new URL(url);
  
  // Cache static assets
  if (urlObj.pathname.startsWith('/uploads/') || 
      urlObj.pathname.endsWith('.webp') || 
      urlObj.pathname.endsWith('.png') || 
      urlObj.pathname.endsWith('.jpg') || 
      urlObj.pathname.endsWith('.css') || 
      urlObj.pathname.endsWith('.js')) {
    return true;
  }
  
  // Cache main page
  if (urlObj.pathname === '/' || urlObj.pathname === '/index.html') {
    return true;
  }
  
  return false;
}

// Helper function to clean up old caches
async function cleanupOldCaches() {
  try {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => 
      name !== CACHE_NAME && (
        name.startsWith('musicgift-cache') || 
        OLD_CACHE_NAMES.includes(name)
      )
    );
    
    await Promise.all(
      oldCaches.map(cacheName => {
        console.log('Deleting old cache:', cacheName);
        return caches.delete(cacheName);
      })
    );
    
    console.log('Old caches cleaned up');
  } catch (error) {
    console.warn('Failed to cleanup old caches:', error);
  }
}

// Handle service worker updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled rejection:', event.reason);
});
