
import { useEffect } from 'react';

interface ResourcePreloaderProps {
  criticalResources?: string[];
  fonts?: string[];
  images?: string[];
  scripts?: string[];
}

const AdvancedResourcePreloader = ({
  criticalResources = [],
  fonts = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
  ],
  images = [
    '/uploads/logo_musicgift.webp',
    '/uploads/1247309a-2342-4b12-af03-20eca7d1afab.png',
    '/uploads/video_placeholder.png'
  ],
  scripts = []
}: ResourcePreloaderProps) => {
  
  useEffect(() => {
    const preloadResource = (href: string, as: string, type?: string, crossorigin?: string) => {
      // Check if already preloaded
      const existing = document.querySelector(`link[href="${href}"]`);
      if (existing) return;

      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      if (type) link.type = type;
      if (crossorigin) link.crossOrigin = crossorigin;
      document.head.appendChild(link);
    };

    const preconnectDomain = (href: string) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = href;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    };

    // Preconnect to external domains
    const externalDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com'
    ];

    externalDomains.forEach(domain => preconnectDomain(domain));

    // Preload critical fonts
    fonts.forEach(font => {
      preloadResource(font, 'style');
    });

    // Preload critical images
    images.forEach(image => {
      preloadResource(image, 'image');
    });

    // Preload critical scripts
    scripts.forEach(script => {
      preloadResource(script, 'script');
    });

    // Preload critical resources
    criticalResources.forEach(resource => {
      const extension = resource.split('.').pop()?.toLowerCase();
      let as = 'fetch';
      let type = undefined;

      switch (extension) {
        case 'css':
          as = 'style';
          type = 'text/css';
          break;
        case 'js':
          as = 'script';
          type = 'text/javascript';
          break;
        case 'woff':
        case 'woff2':
          as = 'font';
          type = `font/${extension}`;
          break;
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'webp':
        case 'avif':
          as = 'image';
          break;
      }

      preloadResource(resource, as, type, as === 'font' ? 'anonymous' : undefined);
    });

    // Prefetch next-page resources after initial load
    const prefetchNextPageResources = () => {
      const nextPageResources = [
        '/packages',
        '/how-it-works',
        '/about',
        '/contact'
      ];

      nextPageResources.forEach(page => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = page;
        document.head.appendChild(link);
      });
    };

    // Defer prefetching until after initial load
    const timer = setTimeout(prefetchNextPageResources, 2000);

    return () => clearTimeout(timer);
  }, [criticalResources, fonts, images, scripts]);

  return null;
};

export default AdvancedResourcePreloader;
