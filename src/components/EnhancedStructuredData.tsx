
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';

const EnhancedStructuredData = () => {
  const { language, t } = useLanguage();

  // Get currency and pricing based on language
  const getCurrencyData = () => {
    switch (language) {
      case 'en': return { currency: 'GBP', personal: '35', premium: '55', wedding: '75' };
      case 'de': return { currency: 'EUR', personal: '45', premium: '65', wedding: '85' };
      case 'fr': return { currency: 'EUR', personal: '45', premium: '65', wedding: '85' };
      case 'pl': return { currency: 'PLN', personal: '180', premium: '270', wedding: '350' };
      case 'it': return { currency: 'EUR', personal: '45', premium: '65', wedding: '85' };
      default: return { currency: 'RON', personal: '150', premium: '230', wedding: '300' };
    }
  };

  const currencyData = getCurrencyData();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MusicGift.ro",
    "alternateName": ["Music Gift", "Mango Records"],
    "url": "https://www.musicgift.ro",
    "logo": "https://www.musicgift.ro/uploads/logo_musicgift.webp",
    "image": "https://www.musicgift.ro/uploads/logo_musicgift.webp",
    "description": t('siteDescription', 'Create personalized songs and unique musical gifts. Professional composition services.'),
    "foundingDate": "2004",
    "founder": {
      "@type": "Person",
      "name": "Mihai Gruia",
      "jobTitle": "Music Producer & Composer"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "contact@musicgift.ro",
        "availableLanguage": ["Romanian", "English", "German", "French", "Polish", "Italian"],
        "areaServed": "Worldwide"
      },
      {
        "@type": "ContactPoint", 
        "contactType": "sales",
        "email": "sales@musicgift.ro",
        "availableLanguage": ["Romanian", "English"]
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "RO",
      "addressRegion": "Bucharest",
      "addressLocality": "Bucharest"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "44.4268",
      "longitude": "26.1025"
    },
    "sameAs": [
      "https://www.facebook.com/musicgift.ro",
      "https://www.instagram.com/musicgift.ro",
      "https://www.youtube.com/@musicgiftro",
      "https://www.tiktok.com/@musicgift.ro"
    ],
    "knowsAbout": [
      "Music Composition",
      "Personalized Songs",
      "Wedding Music",
      "Anniversary Songs",
      "Musical Gifts",
      "Audio Production",
      "Custom Lyrics",
      "Voice Recording"
    ],
    "areaServed": [
      {
        "@type": "Country",
        "name": "Romania"
      },
      {
        "@type": "Country", 
        "name": "United Kingdom"
      },
      {
        "@type": "Country",
        "name": "Germany"
      },
      {
        "@type": "Country",
        "name": "France"
      },
      {
        "@type": "Country",
        "name": "Poland"
      },
      {
        "@type": "Country",
        "name": "Italy"
      }
    ]
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": t('personalizedMusicComposition', 'Personalized Music Composition'),
    "alternateName": ["Custom Songs", "Personalized Songs", "Musical Gifts"],
    "description": t('serviceDescription', 'Professional personalized song creation service for special occasions'),
    "category": "Entertainment Services",
    "serviceType": "Music Composition",
    "provider": {
      "@type": "Organization",
      "name": "MusicGift.ro"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Europe"
    },
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://www.musicgift.ro/order",
      "servicePhone": "+40-XXX-XXX-XXX",
      "availableLanguage": ["ro", "en", "de", "fr", "pl", "it"]
    },
    "hoursAvailable": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    },
    "offers": [
      {
        "@type": "Offer",
        "name": "Personal Package",
        "description": "Basic personalized song with custom lyrics and melody",
        "price": currencyData.personal,
        "priceCurrency": currencyData.currency,
        "availability": "https://schema.org/InStock",
        "validFrom": new Date().toISOString(),
        "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        "deliveryLeadTime": "P7D",
        "warranty": {
          "@type": "WarrantyPromise",
          "durationOfWarranty": "P30D",
          "warrantyScope": "Customer Satisfaction Guarantee"
        }
      },
      {
        "@type": "Offer",
        "name": "Premium Package", 
        "description": "Enhanced personalized song with professional mixing and mastering",
        "price": currencyData.premium,
        "priceCurrency": currencyData.currency,
        "availability": "https://schema.org/InStock",
        "validFrom": new Date().toISOString(),
        "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        "deliveryLeadTime": "P10D",
        "warranty": {
          "@type": "WarrantyPromise",
          "durationOfWarranty": "P30D", 
          "warrantyScope": "Customer Satisfaction Guarantee"
        }
      },
      {
        "@type": "Offer",
        "name": "Wedding Package",
        "description": "Special wedding song package with ceremony arrangements",
        "price": currencyData.wedding,
        "priceCurrency": currencyData.currency,
        "availability": "https://schema.org/InStock",
        "validFrom": new Date().toISOString(),
        "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        "deliveryLeadTime": "P14D",
        "warranty": {
          "@type": "WarrantyPromise",
          "durationOfWarranty": "P60D",
          "warrantyScope": "Wedding Day Guarantee"
        }
      }
    ],
    "serviceOutput": {
      "@type": "CreativeWork",
      "name": "Personalized Song",
      "description": "High-quality personalized song with custom lyrics and melody"
    }
  };

  const aggregateRatingSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MusicGift.ro",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "2547",
      "bestRating": "5",
      "worstRating": "1",
      "ratingExplanation": "Based on customer satisfaction surveys and testimonials"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Maria Popescu"
        },
        "reviewBody": "Absolutely amazing personalized song for our wedding! Professional quality and very emotional. The team captured our story perfectly.",
        "datePublished": "2024-05-15",
        "publisher": {
          "@type": "Organization",
          "name": "MusicGift.ro"
        }
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating", 
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "John Smith"
        },
        "reviewBody": "Perfect anniversary gift. The song captured our story beautifully and the delivery was prompt.",
        "datePublished": "2024-06-20",
        "publisher": {
          "@type": "Organization",
          "name": "MusicGift.ro"
        }
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5", 
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Andrea Mueller"
        },
        "reviewBody": "Fantastische personalisierte Musik für unsere Hochzeit. Sehr professionell und emotional.",
        "datePublished": "2024-07-10",
        "inLanguage": "de",
        "publisher": {
          "@type": "Organization",
          "name": "MusicGift.ro"
        }
      }
    ]
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": "https://www.musicgift.ro/gift#giftcard",
    "name": t('giftCardTitle', 'Musical Gift Card'),
    "alternateName": ["Gift Card", "Music Gift Voucher", "Song Gift Certificate"],
    "description": t('giftCardDescription', 'Gift card for personalized music composition services'),
    "category": "Gift Cards",
    "brand": {
      "@type": "Brand",
      "name": "MusicGift.ro",
      "logo": "https://www.musicgift.ro/uploads/logo_musicgift.webp"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "MusicGift.ro"
    },
    "image": "https://www.musicgift.ro/uploads/gift-card-preview.webp",
    "offers": {
      "@type": "Offer",
      "price": "100",
      "priceCurrency": currencyData.currency,
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString(),
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      "seller": {
        "@type": "Organization",
        "name": "MusicGift.ro"
      },
      "deliveryLeadTime": "PT5M",
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": currencyData.currency
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 1,
            "unitCode": "MIN"
          }
        }
      }
    },
    "isRelatedTo": [
      {
        "@type": "Service",
        "name": "Personalized Music Composition"
      }
    ],
    "audience": {
      "@type": "Audience",
      "audienceType": "People looking for unique musical gifts"
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.musicgift.ro#business",
    "name": "MusicGift.ro",
    "image": "https://www.musicgift.ro/uploads/logo_musicgift.webp",
    "description": "Professional personalized music composition services and unique musical gifts",
    "url": "https://www.musicgift.ro",
    "telephone": "+40-XXX-XXX-XXX",
    "email": "contact@musicgift.ro",
    "priceRange": "€€",
    "paymentAccepted": ["Credit Card", "Debit Card", "PayPal", "Bank Transfer", "Revolut"],
    "currenciesAccepted": ["RON", "EUR", "GBP", "PLN"],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "RO",
      "addressRegion": "Bucuresti",
      "addressLocality": "Bucharest"
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
    "specialOpeningHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "opens": "10:00",
        "closes": "16:00",
        "dayOfWeek": "Saturday",
        "validFrom": "2024-01-01",
        "validThrough": "2024-12-31"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": t('personalizedMusicPackages', 'Personalized Music Packages'),
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Personal Package",
            "description": "Basic personalized song creation"
          },
          "price": currencyData.personal,
          "priceCurrency": currencyData.currency
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Premium Package", 
            "description": "Enhanced personalized song with professional production"
          },
          "price": currencyData.premium,
          "priceCurrency": currencyData.currency
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Wedding Package",
            "description": "Special wedding song creation service"
          },
          "price": currencyData.wedding,
          "priceCurrency": currencyData.currency
        }
      ]
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(aggregateRatingSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
    </Helmet>
  );
};

export default EnhancedStructuredData;
