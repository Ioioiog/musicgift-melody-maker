
import { useEffect } from 'react';

const CriticalCSSOptimized = () => {
  useEffect(() => {
    // Inline critical CSS for above-the-fold content
    const criticalCSS = `
      /* Critical layout styles */
      .critical-layout {
        display: block;
        contain: layout style paint;
        content-visibility: auto;
      }
      
      /* Hero section critical styles */
      .hero-critical {
        min-height: 60vh;
        position: relative;
        overflow: hidden;
        contain: layout style paint;
        will-change: auto;
      }
      
      /* Navigation critical styles */
      .nav-critical {
        position: sticky;
        top: 0;
        z-index: 50;
        backdrop-filter: blur(8px);
        contain: layout style paint;
      }
      
      /* Logo critical styles */
      .logo-critical {
        width: 256px;
        height: 64px;
        contain: size layout style;
        content-visibility: auto;
        contain-intrinsic-size: 256px 64px;
      }
      
      /* Video hero critical styles */
      .video-hero-critical {
        aspect-ratio: 16/9;
        position: relative;
        contain: layout style paint;
        content-visibility: auto;
        contain-intrinsic-size: 100vw 56.25vw;
      }
      
      /* Button critical styles */
      .btn-critical {
        display: inline-flex;
        align-items: center;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 500;
        transition: transform 0.15s ease-out;
        contain: layout style;
        will-change: transform;
      }
      
      .btn-critical:hover {
        transform: translate3d(0, -1px, 0);
      }
      
      /* Performance optimized animations */
      @keyframes optimized-fade-in {
        from {
          opacity: 0;
          transform: translate3d(0, 10px, 0);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }
      
      .animate-fade-in-optimized {
        animation: optimized-fade-in 0.3s ease-out;
        will-change: opacity, transform;
        contain: layout style paint;
      }
      
      /* Preload shimmer effect */
      @keyframes optimized-shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
      
      .loading-shimmer-optimized {
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.1) 25%,
          rgba(255, 255, 255, 0.2) 50%,
          rgba(255, 255, 255, 0.1) 75%
        );
        background-size: 200% 100%;
        animation: optimized-shimmer 1.5s infinite;
        contain: layout style paint;
      }
      
      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
        
        .animate-fade-in-optimized,
        .loading-shimmer-optimized {
          animation: none;
        }
      }
      
      /* High contrast support */
      @media (prefers-contrast: high) {
        .btn-critical {
          border: 2px solid currentColor;
        }
      }
      
      /* Dark mode optimizations */
      @media (prefers-color-scheme: dark) {
        .loading-shimmer-optimized {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.05) 25%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.05) 75%
          );
        }
      }
    `;

    // Create and inject critical CSS
    const styleElement = document.createElement('style');
    styleElement.id = 'critical-css-optimized';
    styleElement.textContent = criticalCSS;
    
    // Insert at the beginning of head for highest priority
    document.head.insertBefore(styleElement, document.head.firstChild);

    // Defer non-critical CSS loading
    const deferNonCriticalCSS = () => {
      const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"][data-defer]');
      nonCriticalCSS.forEach((link) => {
        const linkElement = link as HTMLLinkElement;
        linkElement.rel = 'stylesheet';
        linkElement.removeAttribute('data-defer');
      });
    };

    // Load non-critical CSS after initial render
    const timer = setTimeout(deferNonCriticalCSS, 100);

    return () => {
      clearTimeout(timer);
      const injectedStyle = document.getElementById('critical-css-optimized');
      if (injectedStyle) {
        injectedStyle.remove();
      }
    };
  }, []);

  return null;
};

export default CriticalCSSOptimized;
