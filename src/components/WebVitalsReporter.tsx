
import { useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const WebVitalsReporter = () => {
  useEffect(() => {
    const reportWebVitals = async () => {
      try {
        // Dynamic import to reduce bundle size
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');
        
        const sendToAnalytics = ({ name, delta, value, id }: any) => {
          // Send to Google Analytics if available
          if (window.gtag) {
            window.gtag('event', name, {
              event_category: 'Web Vitals',
              event_label: id,
              value: Math.round(name === 'CLS' ? delta * 1000 : delta),
              non_interaction: true,
            });
          }
          
          // Send to console for development
          console.log(`${name}: ${value} (${delta})`);
          
          // Could also send to custom analytics endpoint
          // fetch('/api/vitals', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ name, delta, value, id, url: location.href })
          // });
        };

        // Measure all Web Vitals
        getCLS(sendToAnalytics);
        getFID(sendToAnalytics);
        getFCP(sendToAnalytics);
        getLCP(sendToAnalytics);
        getTTFB(sendToAnalytics);
        
      } catch (error) {
        console.warn('Web Vitals measurement failed:', error);
      }
    };

    // Only load in production or when specifically enabled
    if (process.env.NODE_ENV === 'production' || 
        localStorage.getItem('enable-web-vitals') === 'true') {
      reportWebVitals();
    }
  }, []);

  return null;
};

export default WebVitalsReporter;
