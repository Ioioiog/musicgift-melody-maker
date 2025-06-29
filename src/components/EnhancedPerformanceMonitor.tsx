
import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
  domContentLoaded?: number;
  loadEventEnd?: number;
}

interface SEOMetrics {
  hasH1: boolean;
  hasMetaDescription: boolean;
  hasTitle: boolean;
  imagesWithoutAlt: number;
  internalLinks: number;
  externalLinks: number;
  wordCount: number;
}

const EnhancedPerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics & SEOMetrics>();
  
  useEffect(() => {
    const collectMetrics = () => {
      const performanceMetrics: PerformanceMetrics = {};
      const seoMetrics: SEOMetrics = {
        hasH1: !!document.querySelector('h1'),
        hasMetaDescription: !!document.querySelector('meta[name="description"]'),
        hasTitle: !!document.title && document.title.length > 0,
        imagesWithoutAlt: document.querySelectorAll('img:not([alt])').length,
        internalLinks: document.querySelectorAll('a[href^="/"], a[href^="#"]').length,
        externalLinks: document.querySelectorAll('a[href^="http"]:not([href*="musicgift.ro"])').length,
        wordCount: document.body.innerText.split(/\s+/).length
      };

      // Performance observer for Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            performanceMetrics.lcp = entry.startTime;
          }
          if (entry.entryType === 'first-input') {
            performanceMetrics.fid = (entry as any).processingStart - entry.startTime;
          }
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            performanceMetrics.cls = (performanceMetrics.cls || 0) + (entry as any).value;
          }
          if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
            performanceMetrics.fcp = entry.startTime;
          }
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            performanceMetrics.ttfb = navEntry.responseStart - navEntry.requestStart;
            performanceMetrics.domContentLoaded = navEntry.domContentLoadedEventEnd - navEntry.navigationStart;
            performanceMetrics.loadEventEnd = navEntry.loadEventEnd - navEntry.navigationStart;
          }
        }

        const combinedMetrics = { ...performanceMetrics, ...seoMetrics };
        setMetrics(combinedMetrics);

        // Log comprehensive metrics
        console.group('🚀 SEO & Performance Audit');
        console.log('📊 Core Web Vitals:', {
          LCP: performanceMetrics.lcp ? `${performanceMetrics.lcp.toFixed(0)}ms` : 'N/A',
          FID: performanceMetrics.fid ? `${performanceMetrics.fid.toFixed(0)}ms` : 'N/A',
          CLS: performanceMetrics.cls ? performanceMetrics.cls.toFixed(3) : 'N/A',
          FCP: performanceMetrics.fcp ? `${performanceMetrics.fcp.toFixed(0)}ms` : 'N/A',
          TTFB: performanceMetrics.ttfb ? `${performanceMetrics.ttfb.toFixed(0)}ms` : 'N/A'
        });
        
        console.log('🔍 SEO Health Check:', {
          'H1 Tag': seoMetrics.hasH1 ? '✅' : '❌',
          'Meta Description': seoMetrics.hasMetaDescription ? '✅' : '❌',
          'Page Title': seoMetrics.hasTitle ? '✅' : '❌',
          'Images Missing Alt': seoMetrics.imagesWithoutAlt,
          'Internal Links': seoMetrics.internalLinks,
          'External Links': seoMetrics.externalLinks,
          'Word Count': seoMetrics.wordCount
        });

        // Performance scoring
        const getPerformanceGrade = () => {
          let score = 0;
          if (performanceMetrics.lcp && performanceMetrics.lcp < 2500) score += 25;
          if (performanceMetrics.fid && performanceMetrics.fid < 100) score += 25;
          if (performanceMetrics.cls && performanceMetrics.cls < 0.1) score += 25;
          if (performanceMetrics.fcp && performanceMetrics.fcp < 1800) score += 25;
          return score;
        };

        const getSEOGrade = () => {
          let score = 0;
          if (seoMetrics.hasH1) score += 20;
          if (seoMetrics.hasMetaDescription) score += 20;
          if (seoMetrics.hasTitle) score += 20;
          if (seoMetrics.imagesWithoutAlt === 0) score += 20;
          if (seoMetrics.wordCount > 300) score += 20;
          return score;
        };

        const performanceGrade = getPerformanceGrade();
        const seoGrade = getSEOGrade();
        
        console.log(`🎯 Performance Score: ${performanceGrade}/100`);
        console.log(`🎯 SEO Score: ${seoGrade}/100`);
        console.groupEnd();

        // Voice Search specific checks
        const voiceSearchElements = {
          faqStructuredData: !!document.querySelector('script[type="application/ld+json"]'),
          speakableContent: document.querySelectorAll('[data-speakable]').length,
          conversationalQuestions: document.querySelectorAll('.faq-answer').length,
          localBusinessSchema: document.body.innerHTML.includes('"@type":"LocalBusiness"')
        };

        console.group('🎤 Voice Search Optimization');
        console.log('Voice Search Elements:', voiceSearchElements);
        console.groupEnd();
      });

      // Observe different entry types
      try {
        observer.observe({ 
          entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift', 'paint', 'navigation'] 
        });
      } catch (e) {
        console.warn('Performance Observer not supported:', e);
      }

      return observer;
    };

    const observer = collectMetrics();
    return () => observer.disconnect();
  }, []);

  // Development-only performance badge
  if (process.env.NODE_ENV === 'development' && metrics) {
    return (
      <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs z-50 max-w-xs">
        <div className="font-bold mb-1">Performance Metrics</div>
        <div>LCP: {metrics.lcp?.toFixed(0)}ms</div>
        <div>FCP: {metrics.fcp?.toFixed(0)}ms</div>
        <div>CLS: {metrics.cls?.toFixed(3)}</div>
        <div>TTFB: {metrics.ttfb?.toFixed(0)}ms</div>
        <div className="mt-1 font-bold">SEO Health</div>
        <div>H1: {metrics.hasH1 ? '✅' : '❌'}</div>
        <div>Meta: {metrics.hasMetaDescription ? '✅' : '❌'}</div>
        <div>Alt Issues: {metrics.imagesWithoutAlt}</div>
      </div>
    );
  }

  return null;
};

export default EnhancedPerformanceMonitor;
