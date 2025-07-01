
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRegionConfig } from '@/hooks/useRegionConfig';

const BreadcrumbStructuredData = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { regionConfig } = useRegionConfig();
  
  useEffect(() => {
    if (!regionConfig) return;

    // Clean up existing breadcrumb structured data
    const existingScripts = document.querySelectorAll('script[data-breadcrumb-schema]');
    existingScripts.forEach(script => script.remove());

    const getBreadcrumbItems = () => {
      const pathSegments = location.pathname.split('/').filter(Boolean);
      const baseUrl = `https://${regionConfig.domain}`;
      
      const items = [
        {
          "@type": "ListItem",
          "position": 1,
          "name": t('home', 'Home'),
          "item": baseUrl
        }
      ];

      let currentPath = '';
      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        let name = segment;
        let url = `${baseUrl}${currentPath}`;

        // Map segments to user-friendly names
        switch (segment) {
          case 'packages':
            name = t('packages', 'Packages');
            break;
          case 'order':
            name = t('orderSong', 'Order Song');
            break;
          case 'gift':
            name = t('giftCard', 'Gift Card');
            break;
          case 'about':
            name = t('aboutUs', 'About Us');
            break;
          case 'contact':
            name = t('contact', 'Contact');
            break;
          case 'how-it-works':
            name = t('howItWorks', 'How It Works');
            break;
          case 'blog':
            name = t('blog', 'Blog');
            break;
          case 'testimonials':
            name = t('testimonials', 'Testimonials');
            break;
          case 'history':
            name = t('orderHistory', 'Order History');
            break;
          case 'settings':
            name = t('settings', 'Settings');
            break;
          default:
            name = segment.charAt(0).toUpperCase() + segment.slice(1);
        }

        items.push({
          "@type": "ListItem",
          "position": index + 2,
          "name": name,
          "item": url
        });
      });

      return items;
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": getBreadcrumbItems()
    };

    // Create and append script element
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-breadcrumb-schema', 'true');
    script.text = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      const scripts = document.querySelectorAll('script[data-breadcrumb-schema]');
      scripts.forEach(script => script.remove());
    };
  }, [location.pathname, t, regionConfig]);

  return null;
};

export default BreadcrumbStructuredData;
