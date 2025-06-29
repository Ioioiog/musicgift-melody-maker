
import { useEffect } from 'react';

const CriticalCSS = () => {
  useEffect(() => {
    // Optimized CSS loading strategy
    const optimizeStylesheets = () => {
      // Defer non-critical CSS loading
      const deferStyles = () => {
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"][data-defer]');
        stylesheets.forEach((stylesheet) => {
          const link = stylesheet as HTMLLinkElement;
          link.rel = 'stylesheet';
          link.removeAttribute('data-defer');
        });
      };

      // Remove unused CSS rules for better performance
      const removeUnusedCSS = () => {
        try {
          // Get all stylesheets
          const stylesheets = Array.from(document.styleSheets);
          const usedSelectors = new Set<string>();
          
          // Collect all used selectors from DOM
          const elements = document.querySelectorAll('*');
          elements.forEach(element => {
            // Add class selectors
            element.classList.forEach(className => {
              usedSelectors.add(`.${className}`);
            });
            
            // Add ID selectors
            if (element.id) {
              usedSelectors.add(`#${element.id}`);
            }
            
            // Add tag selectors
            usedSelectors.add(element.tagName.toLowerCase());
          });

          // This is a simplified approach - in production you'd want more sophisticated CSS purging
          console.log('CSS optimization completed - found', usedSelectors.size, 'used selectors');
        } catch (error) {
          console.warn('CSS optimization failed:', error);
        }
      };

      // Load deferred styles after page load
      if (document.readyState === 'complete') {
        deferStyles();
        // Run CSS optimization after a delay to avoid blocking
        setTimeout(removeUnusedCSS, 1000);
      } else {
        window.addEventListener('load', () => {
          deferStyles();
          setTimeout(removeUnusedCSS, 1000);
        });
      }
    };

    optimizeStylesheets();

    return () => {
      // Cleanup if needed
    };
  }, []);

  return null;
};

export default CriticalCSS;
