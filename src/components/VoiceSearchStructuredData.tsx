
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const VoiceSearchStructuredData = () => {
  const { language } = useLanguage();
  
  useEffect(() => {
    // Clean up existing voice search structured data
    const existingScripts = document.querySelectorAll('script[data-voice-search-schema]');
    existingScripts.forEach(script => script.remove());

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Cum pot să comand o melodie personalizată?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pentru a comanda o melodie personalizată, accesați pagina de comenzi, alegeți pachetul dorit, completați formularul cu povestea dumneavoastră și efectuați plata. Procesul durează doar 5 minute și veți primi melodia în 3-5 zile lucrătoare."
          }
        },
        {
          "@type": "Question",
          "name": "Cât costă să fac o melodie pentru nuntă?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pachetul de nuntă costă 899 RON și include o melodie personalizată profesională, înregistrare vocală de calitate studio, o revizuire gratuită și livrare în format digital de înaltă calitate."
          }
        },
        {
          "@type": "Question",
          "name": "În cât timp primesc cadoul muzical?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Cadoul dumneavoastră muzical va fi gata în 3-5 zile lucrătoare după confirmarea comenzii. Pentru pachetele mai complexe, timpul de livrare poate fi de până la 7 zile."
          }
        },
        {
          "@type": "Question",
          "name": "Care sunt cele mai bune cadouri muzicale pentru aniversări?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pentru aniversări recomandăm Pachetul Personal (399 RON) sau Pachetul Premium (599 RON). Acestea includ melodii personalizate cu versuri care spun povestea persoanei sărbătorite."
          }
        }
      ]
    };

    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "Cum să comandați o melodie personalizată",
      "description": "Ghid pas cu pas pentru comandarea unei melodii personalizate la MusicGift.ro",
      "image": "https://www.musicgift.ro/uploads/1247309a-2342-4b12-af03-20eca7d1afab.png",
      "totalTime": "PT5M",
      "estimatedCost": {
        "@type": "MonetaryAmount",
        "currency": "RON",
        "value": "399"
      },
      "supply": [
        {
          "@type": "HowToSupply",
          "name": "Povestea dumneavoastră personală"
        },
        {
          "@type": "HowToSupply", 
          "name": "Preferințe muzicale"
        }
      ],
      "tool": [
        {
          "@type": "HowToTool",
          "name": "Formularul de comandă MusicGift.ro"
        }
      ],
      "step": [
        {
          "@type": "HowToStep",
          "name": "Alegeți pachetul",
          "text": "Selectați pachetul muzical care se potrivește nevoilor dumneavoastră din pagina de pachete.",
          "url": "https://www.musicgift.ro/packages"
        },
        {
          "@type": "HowToStep",
          "name": "Completați formularul",
          "text": "Povestiți-ne despre persoana sau momentul special pentru care doriți melodia personalizată.",
          "url": "https://www.musicgift.ro/order"
        },
        {
          "@type": "HowToStep",
          "name": "Efectuați plata",
          "text": "Alegeți metoda de plată preferată și finalizați comanda în siguranță."
        },
        {
          "@type": "HowToStep",
          "name": "Primiți melodia",
          "text": "Veți primi melodia personalizată prin email în 3-5 zile lucrătoare."
        }
      ]
    };

    const speakableSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "MusicGift.ro - Cadouri Muzicale Personalizate",
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".voice-search-content", ".faq-answer", ".package-description"]
      }
    };

    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": "https://www.musicgift.ro",
      "name": "MusicGift.ro",
      "alternateName": "Music Gift Romania",
      "description": "Servicii profesionale de compoziții muzicale personalizate și cadouri muzicale unice în România",
      "url": "https://www.musicgift.ro",
      "telephone": "+40-XXX-XXX-XXX",
      "priceRange": "€€",
      "image": "https://www.musicgift.ro/uploads/logo_musicgift.webp",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "RO",
        "addressLocality": "România"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "45.9432",
        "longitude": "24.9668"
      },
      "areaServed": [
        {
          "@type": "City",
          "name": "București"
        },
        {
          "@type": "City", 
          "name": "Cluj-Napoca"
        },
        {
          "@type": "City",
          "name": "Timișoara"
        },
        {
          "@type": "City",
          "name": "Iași"
        },
        {
          "@type": "Country",
          "name": "România"
        }
      ],
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "18:00"
        }
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "150",
        "bestRating": "5",
        "worstRating": "1"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Pachete Muzicale Personalizate",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Pachet Personal - Melodie Personalizată",
              "description": "Melodie personalizată pentru momente speciale"
            },
            "price": "399",
            "priceCurrency": "RON"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service", 
              "name": "Pachet Nuntă - Melodie de Nuntă",
              "description": "Melodie personalizată pentru nunta dumneavoastră"
            },
            "price": "899",
            "priceCurrency": "RON"
          }
        ]
      }
    };

    // Combine all schemas
    const combinedSchema = {
      "@context": "https://schema.org",
      "@graph": [
        faqSchema,
        howToSchema,
        speakableSchema,
        localBusinessSchema
      ]
    };

    // Create and append script element
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-voice-search-schema', 'true');
    script.text = JSON.stringify(combinedSchema);
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      const scripts = document.querySelectorAll('script[data-voice-search-schema]');
      scripts.forEach(script => script.remove());
    };
  }, [language]);

  return null;
};

export default VoiceSearchStructuredData;
