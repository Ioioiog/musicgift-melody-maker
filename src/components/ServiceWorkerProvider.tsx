
import { useEffect } from 'react';

const ServiceWorkerProvider = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
            updateViaCache: 'imports'
          });

          console.log('ServiceWorker registered successfully:', registration);

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content available, show update notification
                  showUpdateNotification();
                }
              });
            }
          });

          // Handle service worker messages
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'CACHE_UPDATED') {
              console.log('Cache updated:', event.data.payload);
            }
          });

        } catch (error) {
          console.log('ServiceWorker registration failed:', error);
        }
      };

      registerSW();
    }
  }, []);

  const showUpdateNotification = () => {
    // You can integrate this with your toast system
    if (confirm('A new version is available. Refresh to update?')) {
      window.location.reload();
    }
  };

  return null;
};

export default ServiceWorkerProvider;
