
import { useLanguage } from '@/contexts/LanguageContext';

export const useStructuredData = () => {
  const { language } = useLanguage();
  
  const websiteSchema = {
    "@context": "https://schema.org",
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
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MusicGift.ro",
    "url": "https://www.musicgift.ro",
    "logo": "https://www.musicgift.ro/uploads/logo_musicgift.webp",
    "description": "Creăm melodii personalizate și cadouri muzicale unice pentru momente speciale",
    "foundingDate": "2004",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+40-XXX-XXX-XXX",
      "contactType": "customer service",
      "areaServed": "RO",
      "availableLanguage": ["Romanian", "English"]
    },
    "sameAs": [
      "https://www.facebook.com/musicgiftro",
      "https://www.instagram.com/musicgiftro",
      "https://www.youtube.com/@musicgiftro"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "RO"
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "MusicGift.ro",
    "image": "https://www.musicgift.ro/uploads/logo_musicgift.webp",
    "description": "Servicii profesionale de compoziții muzicale personalizate, înregistrări și producție muzicală",
    "url": "https://www.musicgift.ro",
    "telephone": "+40-XXX-XXX-XXX",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "RO"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "44.4268",
      "longitude": "26.1025"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "priceRange": "€€",
    "servesCuisine": "Music Production Services",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Compoziții Muzicale Personalizate",
    "description": "Creăm melodii personalizate pentru orice ocazie specială - nunți, botezuri, aniversări, declarații de dragoste",
    "provider": {
      "@type": "Organization",
      "name": "MusicGift.ro"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Romania"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Pachete Muzicale",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Pachet Personal"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Pachet Premium"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Pachet Nuntă"
          }
        }
      ]
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Cât durează să creați o melodie personalizată?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "În funcție de pachetul ales, durata variază între 7-14 zile lucrătoare pentru o melodie personalizată completă."
        }
      },
      {
        "@type": "Question",
        "name": "Pot să aleg stilul muzical pentru melodia mea?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Da, puteți alege din diverse stiluri muzicale: pop, rock, folk, jazz, clasic, și multe altele în funcție de preferințele dumneavoastră."
        }
      },
      {
        "@type": "Question",
        "name": "Cum funcționează procesul de comandă?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Alegeți pachetul dorit, completați formularul cu detaliile melodiei, efectuați plata, și echipa noastră va începe lucrul la compoziția dumneavoastră personalizată."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Acasă",
        "item": "https://www.musicgift.ro"
      }
    ]
  };

  return {
    combined: {
      "@context": "https://schema.org",
      "@graph": [
        websiteSchema,
        organizationSchema,
        localBusinessSchema,
        serviceSchema,
        faqSchema,
        breadcrumbSchema
      ]
    }
  };
};

export default useStructuredData;
