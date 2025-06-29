
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const EnhancedVoiceSearchStructuredData = () => {
  const { language, t } = useLanguage();
  
  useEffect(() => {
    // Clean up existing schemas
    const existingScripts = document.querySelectorAll('script[data-enhanced-voice-schema]');
    existingScripts.forEach(script => script.remove());

    const getCurrencyData = () => {
      switch (language) {
        case 'en': return { currency: 'GBP', symbol: '£', personal: '49', premium: '79', wedding: '59' };
        case 'de': return { currency: 'EUR', symbol: '€', personal: '59', premium: '99', wedding: '69' };
        case 'fr': return { currency: 'EUR', symbol: '€', personal: '59', premium: '99', wedding: '69' };
        default: return { currency: 'RON', symbol: 'RON', personal: '299', premium: '499', wedding: '399' };
      }
    };

    const currencyData = getCurrencyData();

    // Enhanced Product Schema
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": t('personalizedMusicComposition', 'Personalized Music Composition'),
      "description": t('productDescription', 'Professional personalized music composition service for special occasions'),
      "brand": {
        "@type": "Brand",
        "name": "MusicGift.ro"
      },
      "offers": [
        {
          "@type": "Offer",
          "name": t('personalPackage', 'Personal Package'),
          "price": currencyData.personal,
          "priceCurrency": currencyData.currency,
          "availability": "InStock",
          "deliveryLeadTime": "P5D"
        },
        {
          "@type": "Offer",
          "name": t('premiumPackage', 'Premium Package'),
          "price": currencyData.premium,
          "priceCurrency": currencyData.currency,
          "availability": "InStock",
          "deliveryLeadTime": "P7D"
        },
        {
          "@type": "Offer",
          "name": t('weddingPackage', 'Wedding Package'),
          "price": currencyData.wedding,
          "priceCurrency": currencyData.currency,
          "availability": "InStock",
          "deliveryLeadTime": "P7D"
        }
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "150",
        "bestRating": "5"
      }
    };

    // Enhanced Service Schema with Local Business
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "MusicGift.ro",
      "description": t('serviceDescription', 'Professional personalized music composition and recording services'),
      "serviceType": "Music Composition",
      "provider": {
        "@type": "Organization",
        "name": "MusicGift.ro"
      },
      "areaServed": [
        { "@type": "Country", "name": language === 'ro' ? 'România' : language === 'en' ? 'United Kingdom' : language === 'de' ? 'Deutschland' : language === 'fr' ? 'France' : 'Europe' }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": t('musicPackages', 'Music Packages'),
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": t('personalizedSongComposition', 'Personalized Song Composition'),
              "category": "Music"
            }
          }
        ]
      }
    };

    // Event Schema for seasonal offerings
    const eventSchema = {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": t('seasonalMusicOffers', 'Seasonal Music Offers'),
      "description": t('seasonalOffersDesc', 'Special seasonal packages for holidays and celebrations'),
      "startDate": new Date().toISOString(),
      "endDate": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      "eventStatus": "EventScheduled",
      "eventAttendanceMode": "OnlineEventAttendanceMode",
      "location": {
        "@type": "VirtualLocation",
        "url": "https://www.musicgift.ro"
      },
      "organizer": {
        "@type": "Organization",
        "name": "MusicGift.ro"
      }
    };

    // Speakable Schema for voice optimization
    const speakableSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "speakable": [
        {
          "@type": "SpeakableSpecification",
          "cssSelector": [".voice-search-content", ".faq-answer", ".package-description"],
          "xpath": [
            "/html/body//div[contains(@class, 'voice-search-content')]",
            "/html/body//div[contains(@class, 'faq-answer')]"
          ]
        }
      ]
    };

    const combinedSchema = {
      "@context": "https://schema.org",
      "@graph": [
        productSchema,
        serviceSchema,
        eventSchema,
        speakableSchema
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-enhanced-voice-schema', 'true');
    script.text = JSON.stringify(combinedSchema);
    document.head.appendChild(script);

    return () => {
      const scripts = document.querySelectorAll('script[data-enhanced-voice-schema]');
      scripts.forEach(script => script.remove());
    };
  }, [language, t]);

  return null;
};

export default EnhancedVoiceSearchStructuredData;
