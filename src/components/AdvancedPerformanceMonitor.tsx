
import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
  tbt?: number;
  si?: number; // Speed Index
  tti?: number; // Time to Interactive
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    webVitals?: any;
  }
}

const AdvancedPerformanceMonitor = () => {
  const metricsRef = useRef<PerformanceMetrics>({});
  const observerRef = useRef<PerformanceObserver>();

  useEffect(() => {
    let tbtStart = performance.now();
    let totalBlockingTime = 0;
    let isPageLoaded = false;

    // Enhanced Performance Observer
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'largest-contentful-paint':
            metricsRef.current.lcp = entry.startTime;
            reportMetric('LCP', entry.startTime);
            break;
            
          case 'first-input':
            metricsRef.current.fid = (entry as any).processingStart - entry.startTime;
            reportMetric('FID', metricsRef.current.fid);
            break;
            
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              metricsRef.current.cls = (metricsRef.current.cls || 0) + (entry as any).value;
              reportMetric('CLS', metricsRef.current.cls);
            }
            break;
            
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              metricsRef.current.fcp = entry.startTime;
              reportMetric('FCP', entry.startTime);
            }
            break;
            
          case 'navigation':
            const navEntry = entry as PerformanceNavigationTiming;
            metricsRef.current.ttfb = navEntry.responseStart - navEntry.requestStart;
            reportMetric('TTFB', metricsRef.current.ttfb);
            
            // Calculate Time to Interactive (approximate)
            metricsRef.current.tti = navEntry.domInteractive - navEntry.navigationStart;
            reportMetric('TTI', metricsRef.current.tti);
            break;
            
          case 'longtask':
            const taskDuration = entry.duration;
            if (taskDuration > 50) {
              totalBlockingTime += taskDuration - 50;
              metricsRef.current.tbt = totalBlockingTime;
              reportMetric('TBT', totalBlockingTime);
            }
            break;
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
          'longtask',
          'element' // For element timing
        ] 
      });
      observerRef.current = observer;
    } catch (e) {
      console.warn('Some performance observers not supported:', e);
    }

    // Memory monitoring
    const monitorMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const memoryUsage = {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
          usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
        };
        
        // Report high memory usage
        if (memoryUsage.usagePercentage > 80) {
          console.warn('High memory usage detected:', memoryUsage);
          reportMetric('Memory Usage', memoryUsage.usagePercentage);
        }
      }
    };

    // Resource timing analysis
    const analyzeResourceTiming = () => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const analysis = {
        totalResources: resources.length,
        slowResources: resources.filter(r => r.duration > 1000),
        failedResources: resources.filter(r => r.transferSize === 0 && r.decodedBodySize > 0),
        largeResources: resources.filter(r => r.transferSize > 500000), // > 500KB
        cacheHits: resources.filter(r => r.transferSize === 0 && r.decodedBodySize === 0).length
      };
      
      console.log('Resource Analysis:', analysis);
      
      // Report problematic resources
      if (analysis.slowResources.length > 0) {
        console.warn('Slow resources detected:', analysis.slowResources);
      }
      
      if (analysis.failedResources.length > 0) {
        console.warn('Failed resources detected:', analysis.failedResources);
      }
    };

    // Page Load event
    const handlePageLoad = () => {
      isPageLoaded = true;
      setTimeout(() => {
        monitorMemory();
        analyzeResourceTiming();
        calculateSpeedIndex();
        generatePerformanceReport();
      }, 1000);
    };

    // Calculate Speed Index (simplified implementation)
    const calculateSpeedIndex = () => {
      const paintEntries = performance.getEntriesByType('paint');
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (paintEntries.length > 0 && navEntry) {
        // Simplified Speed Index calculation
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        if (fcp) {
          metricsRef.current.si = fcp.startTime + (navEntry.domContentLoadedEventEnd - navEntry.navigationStart) / 2;
          reportMetric('Speed Index', metricsRef.current.si);
        }
      }
    };

    // Generate comprehensive performance report
    const generatePerformanceReport = () => {
      const report = {
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        connectionType: (navigator as any).connection?.effectiveType || 'unknown',
        metrics: { ...metricsRef.current },
        scores: calculateScores(metricsRef.current),
        recommendations: generateRecommendations(metricsRef.current)
      };
      
      console.log('Performance Report:', report);
      
      // Send to analytics if available
      if (window.gtag) {
        window.gtag('event', 'performance_report', {
          event_category: 'Performance',
          custom_map: report.metrics
        });
      }
    };

    // Performance scoring (based on Lighthouse thresholds)
    const calculateScores = (metrics: PerformanceMetrics) => {
      const scores: Record<string, number> = {};
      
      // LCP Score (0-100)
      if (metrics.lcp) {
        scores.lcp = metrics.lcp <= 2500 ? 100 : metrics.lcp <= 4000 ? 50 : 0;
      }
      
      // FID Score (0-100)
      if (metrics.fid) {
        scores.fid = metrics.fid <= 100 ? 100 : metrics.fid <= 300 ? 50 : 0;
      }
      
      // CLS Score (0-100)
      if (metrics.cls !== undefined) {
        scores.cls = metrics.cls <= 0.1 ? 100 : metrics.cls <= 0.25 ? 50 : 0;
      }
      
      return scores;
    };

    // Generate performance recommendations
    const generateRecommendations = (metrics: PerformanceMetrics) => {
      const recommendations: string[] = [];
      
      if (metrics.lcp && metrics.lcp > 2500) {
        recommendations.push('Optimize Largest Contentful Paint by improving server response times and optimizing above-the-fold content');
      }
      
      if (metrics.fid && metrics.fid > 100) {
        recommendations.push('Reduce First Input Delay by minimizing JavaScript execution time and breaking up long tasks');
      }
      
      if (metrics.cls && metrics.cls > 0.1) {
        recommendations.push('Improve Cumulative Layout Shift by adding size attributes to images and avoiding dynamic content insertion');
      }
      
      if (metrics.tbt && metrics.tbt > 200) {
        recommendations.push('Reduce Total Blocking Time by optimizing JavaScript and splitting large bundles');
      }
      
      return recommendations;
    };

    // Report individual metrics
    const reportMetric = (name: string, value: number) => {
      console.log(`${name}: ${Math.round(value)}ms`);
      
      // Performance budget alerts
      const budgets: Record<string, number> = {
        'LCP': 2500,
        'FID': 100,
        'CLS': 0.1,
        'FCP': 1800,
        'TTFB': 600,
        'TBT': 200
      };
      
      if (budgets[name] && value > budgets[name]) {
        console.warn(`⚠️ ${name} budget exceeded: ${Math.round(value)} > ${budgets[name]}`);
      }
    };

    // Event listeners
    window.addEventListener('load', handlePageLoad);
    setInterval(monitorMemory, 30000); // Check memory every 30 seconds

    return () => {
      observer?.disconnect();
      window.removeEventListener('load', handlePageLoad);
    };
  }, []);

  return null;
};

export default AdvancedPerformanceMonitor;
