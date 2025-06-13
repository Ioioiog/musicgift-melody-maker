import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const StructuredDataLoader = () => {
  const { language } = useLanguage();

  useEffect(() => {
    // Organization Schema with optimized logo
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "MusicGift.ro",
      "alternateName": ["MusicGift", "Mango Records"],
      "url": "https://musicgift.ro",
      "logo": {
        "@type": "ImageObject",
        "url": "https://musicgift.ro/uploads/e53a847b-7672-4212-aa90-b31d0bc6d328.png",
        "width": 180,
        "height": 60,
        "contentUrl": "https://musicgift.ro/uploads/e53a847b-7672-4212-aa90-b31d0bc6d328.png",
        "caption": "MusicGift.ro - Cadouri Muzicale Personalizate"
      },
      "image": "https://musicgift.ro/uploads/e53a847b-7672-4212-aa90-b31d0bc6d328.png",
      "description": "Crearea de cadouri muzicale personalizate. Transformă momentele tale speciale în melodii frumoase și personalizate",
      "foundingDate": "2020",
      "founder": {
        "@type": "Person",
        "name": "Mihai Gruia"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+40-723-141-501",
        "contactType": "customer service",
        "email": "info@musicgift.ro",
        "availableLanguage": ["Romanian", "English", "German", "French"]
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Strada Fabrica de Glucoza 6-8",
        "addressLocality": "București",
        "addressCountry": "RO"
      },
      "sameAs": [
        "https://www.facebook.com/MusicGiftofficialpage/",
        "https://www.instagram.com/musicgiftofficial/",
        "https://www.youtube.com/@MangoRecordsChannel",
        "https://www.tiktok.com/@musicgiftofficial"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Pachete Muzicale Personalizate",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Melodie Personalizată",
              "description": "Compoziție muzicală personalizată pentru evenimente speciale"
            }
          }
        ]
      }
    };

    // Website Schema
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "MusicGift.ro",
      "url": "https://musicgift.ro",
      "description": "Cadouri muzicale personalizate - melodii unice pentru persoanele dragi",
      "inLanguage": language,
      "publisher": {
        "@id": "https://musicgift.ro/#organization"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://musicgift.ro/packages?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };

    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Melodii Personalizate",
      "description": "Servicii profesionale de compoziție muzicală personalizată pentru cadouri speciale",
      "provider": {
        "@id": "https://musicgift.ro/#organization"
      },
      "areaServed": "RO",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Pachete Muzicale",
        "itemListElement": [
          {
            "@type": "Offer",
            "name": "Pachet Basic",
            "description": "Melodie personalizată cu text și compoziție originală"
          },
          {
            "@type": "Offer", 
            "name": "Pachet Premium",
            "description": "Melodie personalizată cu producție profesională și master"
          }
        ]
      }
    };

    // Create and append script tags
    const schemas = [organizationSchema, websiteSchema, serviceSchema];
    
    schemas.forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      script.id = `structured-data-${index}`;
      
      // Remove existing script if it exists
      const existing = document.getElementById(`structured-data-${index}`);
      if (existing) {
        existing.remove();
      }
      
      document.head.appendChild(script);
    });

    // Cleanup function
    return () => {
      schemas.forEach((_, index) => {
        const script = document.getElementById(`structured-data-${index}`);
        if (script) {
          script.remove();
        }
      });
    };
  }, [language]);

  return null;
};

export default StructuredDataLoader;
