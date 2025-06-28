
const CACHE_NAME = 'musicgift-v1.2.0';
const STATIC_CACHE_NAME = 'musicgift-static-v1.2.0';
const DYNAMIC_CACHE_NAME = 'musicgift-dynamic-v1.2.0';

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/uploads/logo_musicgift.webp',
  '/uploads/background.webp',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Resources to cache on first request
const CACHEABLE_ROUTES = [
  '/packages',
  '/how-it-works', 
  '/about',
  '/contact',
  '/order',
  '/gift'
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        return cache.addAll(CRITICAL_RESOURCES);
      }),
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheName.includes('musicgift-v1.2.0')) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests (except fonts and CDN resources)
  if (!url.origin.includes(location.origin) && 
      !url.origin.includes('fonts.googleapis.com') &&
      !url.origin.includes('fonts.gstatic.com')) {
    return;
  }

  event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Strategy 1: Cache First for static assets
  if (isStaticAsset(url.pathname)) {
    return cacheFirst(request, STATIC_CACHE_NAME);
  }
  
  // Strategy 2: Network First for API calls
  if (url.pathname.startsWith('/api/') || url.pathname.includes('supabase')) {
    return networkFirst(request, DYNAMIC_CACHE_NAME);
  }
  
  // Strategy 3: Stale While Revalidate for pages
  if (CACHEABLE_ROUTES.some(route => url.pathname.startsWith(route)) || url.pathname === '/') {
    return staleWhileRevalidate(request, DYNAMIC_CACHE_NAME);
  }
  
  // Default: Network only
  return fetch(request);
}

function isStaticAsset(pathname) {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.webp', '.avif', '.woff', '.woff2', '.svg'];
  return staticExtensions.some(ext => pathname.includes(ext)) || pathname.includes('/uploads/');
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Network error', { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    return cached || new Response('Network error', { status: 503 });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);
  
  return cached || fetchPromise;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  // Handle any queued offline actions
  const queuedActions = await getQueuedActions();
  
  for (const action of queuedActions) {
    try {
      await processQueuedAction(action);
      await removeQueuedAction(action.id);
    } catch (error) {
      console.log('Failed to process queued action:', error);
    }
  }
}

async function getQueuedActions() {
  // Implementation for retrieving queued actions from IndexedDB
  return [];
}

async function processQueuedAction(action) {
  // Implementation for processing queued actions
}

async function removeQueuedAction(actionId) {
  // Implementation for removing processed actions
}
