
import { useEffect, useRef } from 'react';

// Extend Window interface for Google Analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

interface ScriptConfig {
  src: string;
  defer?: boolean;
  async?: boolean;
  onLoad?: () => void;
  condition?: () => boolean;
  priority?: 'high' | 'low' | 'idle';
}

const OptimizedScriptLoader = () => {
  const loadedScripts = useRef(new Set<string>());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const scriptConfigs: ScriptConfig[] = [
      {
        src: 'https://www.googletagmanager.com/gtag/js?id=G-EHVL7BL5FS',
        priority: 'low',
        condition: () => !window.gtag,
        onLoad: () => {
          window.dataLayer = window.dataLayer || [];
          function gtag(...args: any[]) {
            window.dataLayer!.push(args);
          }
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', 'G-EHVL7BL5FS', {
            page_title: document.title,
            page_location: window.location.href
          });
        }
      }
    ];

    const loadScript = (config: ScriptConfig) => {
      if (loadedScripts.current.has(config.src)) return;
      if (config.condition && !config.condition()) return;

      const script = document.createElement('script');
      script.src = config.src;
      script.async = config.async !== false;
      script.defer = config.defer !== false;
      
      script.onload = () => {
        loadedScripts.current.add(config.src);
        config.onLoad?.();
      };

      script.onerror = () => {
        console.warn(`Failed to load script: ${config.src}`);
      };

      document.head.appendChild(script);
    };

    const loadScriptsByPriority = (priority: 'high' | 'low' | 'idle') => {
      scriptConfigs
        .filter(config => config.priority === priority)
        .forEach(loadScript);
    };

    // Load high priority scripts immediately
    loadScriptsByPriority('high');

    // Load low priority scripts on interaction
    const events = ['scroll', 'mouseover', 'touchstart', 'keydown'];
    const onFirstInteraction = () => {
      loadScriptsByPriority('low');
      events.forEach(event => 
        document.removeEventListener(event, onFirstInteraction, true)
      );
    };

    events.forEach(event => 
      document.addEventListener(event, onFirstInteraction, true)
    );

    // Load idle scripts when browser is idle
    if ('requestIdleCallback' in window && typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(() => {
        loadScriptsByPriority('idle');
      });
    } else {
      setTimeout(() => loadScriptsByPriority('idle'), 3000);
    }

    return () => {
      events.forEach(event => 
        document.removeEventListener(event, onFirstInteraction, true)
      );
    };
  }, []);

  return null;
};

export default OptimizedScriptLoader;
