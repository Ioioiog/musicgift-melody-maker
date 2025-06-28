
import { useEffect } from 'react';

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
  tbt?: number;
}

const EnhancedPerformanceMonitor = () => {
  useEffect(() => {
    let tbtStart = performance.now();
    let totalBlockingTime = 0;

    // Enhanced Performance Observer for Core Web Vitals + TBT
    const observer = new PerformanceObserver((list) => {
      const metrics: PerformanceMetrics = {};
      
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'largest-contentful-paint':
            metrics.lcp = entry.startTime;
            break;
          case 'first-input':
            metrics.fid = (entry as any).processingStart - entry.startTime;
            break;
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              metrics.cls = (metrics.cls || 0) + (entry as any).value;
            }
            break;
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              metrics.fcp = entry.startTime;
            }
            break;
          case 'navigation':
            metrics.ttfb = (entry as any).responseStart - entry.startTime;
            break;
          case 'longtask':
            // Calculate Total Blocking Time
            const taskDuration = entry.duration;
            if (taskDuration > 50) {
              totalBlockingTime += taskDuration - 50;
              metrics.tbt = totalBlockingTime;
            }
            break;
        }
      }

      // Report metrics
      if (Object.keys(metrics).length > 0) {
        console.log('Enhanced Web Vitals:', metrics);
        
        // Send to analytics service if available
        if (typeof gtag !== 'undefined') {
          gtag('event', 'web_vitals', {
            event_category: 'Performance',
            event_label: 'Core Web Vitals',
            custom_map: metrics
          });
        }

        // Performance budget alerts
        if (metrics.lcp && metrics.lcp > 2500) {
          console.warn('LCP exceeds 2.5s threshold:', metrics.lcp);
        }
        if (metrics.fid && metrics.fid > 100) {
          console.warn('FID exceeds 100ms threshold:', metrics.fid);
        }
        if (metrics.cls && metrics.cls > 0.1) {
          console.warn('CLS exceeds 0.1 threshold:', metrics.cls);
        }
        if (metrics.tbt && metrics.tbt > 200) {
          console.warn('TBT exceeds 200ms threshold:', metrics.tbt);
        }
      }
    });

    // Observe all performance entry types
    try {
      observer.observe({ 
        entryTypes: [
          'largest-contentful-paint', 
          'first-input', 
          'layout-shift', 
          'paint', 
          'navigation',
          'longtask'
        ] 
      });
    } catch (e) {
      console.warn('Enhanced Performance Observer not fully supported:', e);
    }

    // Memory usage monitoring
    const checkMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const memoryInfo = {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        };
        
        // Alert if memory usage is high
        const memoryUsage = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit;
        if (memoryUsage > 0.8) {
          console.warn('High memory usage detected:', memoryInfo);
        }
      }
    };

    // Check memory usage every 30 seconds
    const memoryInterval = setInterval(checkMemoryUsage, 30000);

    return () => {
      observer.disconnect();
      clearInterval(memoryInterval);
    };
  }, []);

  return null;
};

export default EnhancedPerformanceMonitor;
