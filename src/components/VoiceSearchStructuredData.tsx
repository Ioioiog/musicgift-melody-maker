
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const VoiceSearchStructuredData = () => {
  const { language, t } = useLanguage();
  
  useEffect(() => {
    // Clean up existing voice search structured data
    const existingScripts = document.querySelectorAll('script[data-voice-search-schema]');
    existingScripts.forEach(script => script.remove());

    // Get currency based on language/region
    const getCurrency = () => {
      switch (language) {
        case 'en': return 'GBP';
        case 'fr': return 'EUR';
        case 'de': return 'EUR';
        case 'pl': return 'PLN';
        case 'it': return 'EUR';
        default: return 'RON';
      }
    };

    // Get base price based on currency
    const getBasePrice = () => {
      switch (language) {
        case 'en': return '35';
        case 'fr': return '45';
        case 'de': return '45';
        case 'pl': return '180';
        case 'it': return '45';
        default: return '399';
      }
    };

    // Get wedding price based on currency
    const getWeddingPrice = () => {
      switch (language) {
        case 'en': return '75';
        case 'fr': return '85';
        case 'de': return '85';
        case 'pl': return '350';
        case 'it': return '85';
        default: return '899';
      }
    };

    // Get country code for geo data
    const getCountryCode = () => {
      switch (language) {
        case 'en': return 'GB';
        case 'fr': return 'FR';
        case 'de': return 'DE';
        case 'pl': return 'PL';
        case 'it': return 'IT';
        default: return 'RO';
      }
    };

    // Get geo coordinates
    const getGeoCoordinates = () => {
      switch (language) {
        case 'en': return { lat: "51.5074", lng: "-0.1278" }; // London
        case 'fr': return { lat: "48.8566", lng: "2.3522" }; // Paris
        case 'de': return { lat: "52.5200", lng: "13.4050" }; // Berlin
        case 'pl': return { lat: "52.2297", lng: "21.0122" }; // Warsaw
        case 'it': return { lat: "41.9028", lng: "12.4964" }; // Rome
        default: return { lat: "45.9432", lng: "24.9668" }; // Romania center
      }
    };

    const currency = getCurrency();
    const basePrice = getBasePrice();
    const weddingPrice = getWeddingPrice();
    const countryCode = getCountryCode();
    const coords = getGeoCoordinates();

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": t('howToOrderSong'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('howToOrderAnswer')
          }
        },
        {
          "@type": "Question",
          "name": t('weddingSongCost'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('weddingSongCostAnswer')
          }
        },
        {
          "@type": "Question",
          "name": t('deliveryTime'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('deliveryTimeAnswer')
          }
        },
        {
          "@type": "Question",
          "name": t('bestAnniversaryGifts'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('bestAnniversaryGiftsAnswer')
          }
        },
        {
          "@type": "Question",
          "name": t('musicServicesNearMe'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('musicServicesNearMeAnswer')
          }
        },
        {
          "@type": "Question",
          "name": t('bestGiftForWife'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('bestGiftForWifeAnswer')
          }
        }
      ]
    };

    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": t('howToOrderSong'),
      "description": t('howToOrderAnswer'),
      "image": "https://www.musicgift.ro/uploads/1247309a-2342-4b12-af03-20eca7d1afab.png",
      "totalTime": "PT5M",
      "estimatedCost": {
        "@type": "MonetaryAmount",
        "currency": currency,
        "value": basePrice
      },
      "supply": [
        {
          "@type": "HowToSupply",
          "name": t('yourStory', 'Your personal story')
        },
        {
          "@type": "HowToSupply", 
          "name": t('musicalPreferences', 'Musical preferences')
        }
      ],
      "tool": [
        {
          "@type": "HowToTool",
          "name": "MusicGift.ro " + t('orderForm', 'Order Form')
        }
      ],
      "step": [
        {
          "@type": "HowToStep",
          "name": t('choosePackage', 'Choose package'),
          "text": t('selectPackageStep', 'Select the musical package that fits your needs from our packages page.'),
          "url": "https://www.musicgift.ro/packages"
        },
        {
          "@type": "HowToStep",
          "name": t('fillForm', 'Complete the form'),
          "text": t('fillFormStep', 'Tell us about the person or special moment you want the personalized song for.'),
          "url": "https://www.musicgift.ro/order"
        },
        {
          "@type": "HowToStep",
          "name": t('makePayment', 'Make payment'),
          "text": t('paymentStep', 'Choose your preferred payment method and securely complete your order.')
        },
        {
          "@type": "HowToStep",
          "name": t('receiveSong', 'Receive your song'),
          "text": t('receiveSongStep', 'You will receive your personalized song via email within 3-5 business days.')
        }
      ]
    };

    const speakableSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "MusicGift.ro - " + t('personalizedMusicalGifts', 'Personalized Musical Gifts'),
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
      "alternateName": "Music Gift " + countryCode,
      "description": t('businessDescription', 'Professional personalized music composition services and unique musical gifts'),
      "url": "https://www.musicgift.ro",
      "telephone": "+40-XXX-XXX-XXX",
      "priceRange": "€€",
      "image": "https://www.musicgift.ro/uploads/logo_musicgift.webp",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": countryCode
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": coords.lat,
        "longitude": coords.lng
      },
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
        "name": t('personalizedMusicPackages', 'Personalized Music Packages'),
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": t('personalPackage', 'Personal Package - Personalized Song'),
              "description": t('personalPackageDesc', 'Personalized song for special moments')
            },
            "price": basePrice,
            "priceCurrency": currency
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service", 
              "name": t('weddingPackage', 'Wedding Package - Wedding Song'),
              "description": t('weddingPackageDesc', 'Personalized song for your wedding')
            },
            "price": weddingPrice,
            "priceCurrency": currency
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
  }, [language, t]);

  return null;
};

export default VoiceSearchStructuredData;
