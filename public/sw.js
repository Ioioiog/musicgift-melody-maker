

// Service Worker v2.1 - Enhanced scheme filtering and error handling
const CACHE_VERSION = 'v2.1';
const CACHE_NAME = `musicgift-cache-${CACHE_VERSION}`;
const OLD_CACHE_NAMES = ['musicgift-cache-v2.0', 'musicgift-cache-v1.0', 'musicgift-cache'];

// Resources to cache (only for GET requests)
const STATIC_RESOURCES = [
  '/',
  '/uploads/background.webp',
  '/uploads/logo_musicgift.webp',
  '/uploads/video_placeholder.png'
];

// Install event - Cache static resources and clean up old caches
self.addEventListener('install', (event) => {
  console.log('Service Worker v2.1 installing...');
  
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
  console.log('Service Worker v2.1 activating...');
  
  event.waitUntil(
    Promise.all([
      cleanupOldCaches(),
      self.clients.claim()
    ])
  );
});

// Fetch event - Handle requests with proper scheme and method filtering
self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  // Only handle GET requests - ignore HEAD, POST, PUT, DELETE, etc.
  if (request.method !== 'GET') {
    console.log(`Ignoring ${request.method} request to ${request.url}`);
    return; // Let the browser handle non-GET requests normally
  }
  
  // Check URL scheme first - only handle http/https requests
  let requestUrl;
  try {
    requestUrl = new URL(request.url);
  } catch (error) {
    console.warn('Invalid URL in fetch event:', request.url, error);
    return; // Let browser handle malformed URLs
  }
  
  // Only handle HTTP/HTTPS schemes
  if (requestUrl.protocol !== 'http:' && requestUrl.protocol !== 'https:') {
    console.log(`Ignoring ${requestUrl.protocol} request to ${request.url}`);
    return; // Let browser handle non-HTTP schemes (chrome-extension:, file:, etc.)
  }
  
  // Only handle same-origin requests or specific allowed origins
  if (requestUrl.origin !== self.location.origin && !isAllowedOrigin(requestUrl.origin)) {
    console.log(`Ignoring cross-origin request to ${request.url}`);
    return; // Let browser handle cross-origin requests
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
                    // Additional safety check before caching
                    try {
                      cache.put(request, responseClone);
                    } catch (error) {
                      console.warn('Failed to cache resource:', request.url, error);
                    }
                  })
                  .catch((error) => {
                    console.warn('Failed to open cache for resource:', error);
                  });
              }
              return response;
            })
            .catch((error) => {
              console.warn('Fetch failed:', error);
              throw error;
            });
        })
        .catch((error) => {
          console.warn('Cache match failed:', error);
          // Fallback to network
          return fetch(request);
        })
    );
  }
});

// Helper function to determine if a resource should be cached
function shouldCache(url) {
  try {
    const urlObj = new URL(url);
    
    // Only cache HTTP/HTTPS schemes
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return false;
    }
    
    // Only cache same-origin requests
    if (urlObj.origin !== self.location.origin) {
      return false;
    }
    
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
  } catch (error) {
    console.warn('Error parsing URL for caching decision:', url, error);
    return false;
  }
}

// Helper function to check if origin is allowed
function isAllowedOrigin(origin) {
  const allowedOrigins = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];
  return allowedOrigins.includes(origin);
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

// Enhanced error handling
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled rejection:', event.reason);
  // Prevent the default behavior to avoid console spam
  event.preventDefault();
});

