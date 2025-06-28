
import { useEffect } from 'react';

const FontOptimizer = () => {
  useEffect(() => {
    // Preload critical fonts
    const preloadFont = (href: string, as: string = 'font', type?: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      if (type) link.type = type;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    };

    // Preload Google Fonts with font-display: swap
    const googleFontsLink = document.createElement('link');
    googleFontsLink.rel = 'preload';
    googleFontsLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    googleFontsLink.as = 'style';
    googleFontsLink.onload = () => {
      googleFontsLink.rel = 'stylesheet';
    };
    document.head.appendChild(googleFontsLink);

    // Create a noscript fallback
    const noscript = document.createElement('noscript');
    const fallbackLink = document.createElement('link');
    fallbackLink.rel = 'stylesheet';
    fallbackLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    noscript.appendChild(fallbackLink);
    document.head.appendChild(noscript);

    // Add font-display: swap to existing fonts
    const existingFontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
    existingFontLinks.forEach(link => {
      const href = (link as HTMLLinkElement).href;
      if (!href.includes('display=swap')) {
        (link as HTMLLinkElement).href = href + (href.includes('?') ? '&' : '?') + 'display=swap';
      }
    });

    return () => {
      // Cleanup if needed
    };
  }, []);

  return null;
};

export default FontOptimizer;
