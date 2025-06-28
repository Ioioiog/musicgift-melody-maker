
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';

const EnhancedStructuredData = () => {
  const { language, t } = useLanguage();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MusicGift.ro",
    "url": "https://www.musicgift.ro",
    "logo": "https://www.musicgift.ro/uploads/logo_musicgift.webp",
    "description": t('siteDescription', 'Create personalized songs and unique musical gifts. Professional composition services.'),
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "contact@musicgift.ro",
      "availableLanguage": ["Romanian", "English", "German", "French", "Polish", "Italian"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "RO",
      "addressRegion": "Bucharest"
    },
    "sameAs": [
      "https://www.facebook.com/musicgift.ro",
      "https://www.instagram.com/musicgift.ro"
    ]
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": t('personalizedMusicComposition', 'Personalized Music Composition'),
    "description": t('serviceDescription', 'Professional personalized song creation service for special occasions'),
    "provider": {
      "@type": "Organization",
      "name": "MusicGift.ro"
    },
    "serviceType": "Music Composition",
    "areaServed": {
      "@type": "Country",
      "name": "Europe"
    },
    "offers": [
      {
        "@type": "Offer",
        "name": "Personal Package",
        "price": language === 'en' ? "35" : language === 'de' ? "45" : language === 'pl' ? "180" : "150",
        "priceCurrency": language === 'en' ? "GBP" : language === 'de' ? "EUR" : language === 'pl' ? "PLN" : "RON",
        "description": "Basic personalized song package"
      },
      {
        "@type": "Offer", 
        "name": "Premium Package",
        "price": language === 'en' ? "55" : language === 'de' ? "65" : language === 'pl' ? "270" : "230",
        "priceCurrency": language === 'en' ? "GBP" : language === 'de' ? "EUR" : language === 'pl' ? "PLN" : "RON",
        "description": "Premium personalized song with enhanced features"
      },
      {
        "@type": "Offer",
        "name": "Wedding Package", 
        "price": language === 'en' ? "75" : language === 'de' ? "85" : language === 'pl' ? "350" : "300",
        "priceCurrency": language === 'en' ? "GBP" : language === 'de' ? "EUR" : language === 'pl' ? "PLN" : "RON",
        "description": "Special wedding song package"
      }
    ]
  };

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MusicGift.ro",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "2000",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Maria Popescu"
        },
        "reviewBody": "Absolutely amazing personalized song for our wedding! Professional quality and very emotional."
      },
      {
        "@type": "Review", 
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "author": {
          "@type": "Person",
          "name": "John Smith"
        },
        "reviewBody": "Perfect anniversary gift. The song captured our story beautifully."
      }
    ]
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": t('giftCardTitle', 'Musical Gift Card'),
    "description": t('giftCardDescription', 'Gift card for personalized music composition services'),
    "brand": {
      "@type": "Brand",
      "name": "MusicGift.ro"
    },
    "offers": {
      "@type": "Offer",
      "price": "100",
      "priceCurrency": language === 'en' ? "GBP" : language === 'de' ? "EUR" : language === 'pl' ? "PLN" : "RON",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString(),
      "seller": {
        "@type": "Organization", 
        "name": "MusicGift.ro"
      }
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
        {JSON.stringify(reviewSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
    </Helmet>
  );
};

export default EnhancedStructuredData;
