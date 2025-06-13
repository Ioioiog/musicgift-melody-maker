
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const StructuredDataLoader = () => {
  const { language } = useLanguage();
  
  useEffect(() => {
    // Load structured data after page content is rendered
    const timer = setTimeout(() => {
      const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "name": "MusicGift.ro",
            "alternateName": "Music Gift Romania",
            "url": "https://www.musicgift.ro",
            "description": "Servicii profesionale de compoziții muzicale personalizate și cadouri muzicale unice",
            "inLanguage": language,
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.musicgift.ro/packages?search={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          },
          {
            "@type": "Organization",
            "name": "MusicGift.ro",
            "url": "https://www.musicgift.ro",
            "logo": "https://www.musicgift.ro/uploads/logo_musicgift.webp",
            "description": "Creăm melodii personalizate și cadouri muzicale unice pentru momente speciale",
            "foundingDate": "2004",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "areaServed": "RO",
              "availableLanguage": ["Romanian", "English"]
            },
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "RO"
            }
          },
          {
            "@type": "Service",
            "name": "Compoziții Muzicale Personalizate",
            "description": "Creăm melodii personalizate pentru orice ocazie specială",
            "provider": {
              "@type": "Organization",
              "name": "MusicGift.ro"
            },
            "areaServed": {
              "@type": "Country",
              "name": "Romania"
            }
          }
        ]
      };

      // Create and append script element
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }, 100);

    return () => clearTimeout(timer);
  }, [language]);

  return null;
};

export default StructuredDataLoader;
