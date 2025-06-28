
import { useEffect } from 'react';

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
}

const PerformanceMonitor = () => {
  useEffect(() => {
    // Performance observer for Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      const metrics: PerformanceMetrics = {};
      
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          metrics.lcp = entry.startTime;
        }
        if (entry.entryType === 'first-input') {
          metrics.fid = (entry as any).processingStart - entry.startTime;
        }
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          metrics.cls = (metrics.cls || 0) + (entry as any).value;
        }
        if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
          metrics.fcp = entry.startTime;
        }
        if (entry.entryType === 'navigation') {
          metrics.ttfb = (entry as any).responseStart - entry.startTime;
        }
      }

      // Send metrics to analytics (can be enhanced with actual analytics service)
      if (Object.keys(metrics).length > 0) {
        console.log('Core Web Vitals:', metrics);
        // Future: Send to Google Analytics or other service
        // gtag('event', 'web_vitals', metrics);
      }
    });

    // Observe different entry types
    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift', 'paint', 'navigation'] });
    } catch (e) {
      console.warn('Performance Observer not supported:', e);
    }

    return () => observer.disconnect();
  }, []);

  return null;
};

export default PerformanceMonitor;
