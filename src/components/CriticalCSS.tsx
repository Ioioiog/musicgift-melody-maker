
import { useEffect } from 'react';

const CriticalCSS = () => {
  useEffect(() => {
    // Defer non-critical CSS loading
    const deferStyles = () => {
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"][data-defer]');
      stylesheets.forEach((stylesheet) => {
        const link = stylesheet as HTMLLinkElement;
        link.rel = 'stylesheet';
        link.removeAttribute('data-defer');
      });
    };

    // Load deferred styles after page load
    if (document.readyState === 'complete') {
      deferStyles();
    } else {
      window.addEventListener('load', deferStyles);
    }

    return () => window.removeEventListener('load', deferStyles);
  }, []);

  return null;
};

export default CriticalCSS;
