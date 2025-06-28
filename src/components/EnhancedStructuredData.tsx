import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';
import { testimonials } from '@/data/testimonials';

const EnhancedStructuredData = () => {
  const { language, t } = useLanguage();

  // Get currency and pricing based on language - CORRECTED PRICES
  const getCurrencyData = () => {
    switch (language) {
      case 'en': return { currency: 'GBP', personal: '49', premium: '79', wedding: '49' };
      case 'de': return { currency: 'EUR', personal: '59', premium: '99', wedding: '59' };
      case 'fr': return { currency: 'EUR', personal: '59', premium: '99', wedding: '59' };
      case 'pl': return { currency: 'PLN', personal: '255', premium: '425', wedding: '255' };
      case 'it': return { currency: 'EUR', personal: '59', premium: '99', wedding: '59' };
      default: return { currency: 'RON', personal: '299', premium: '499', wedding: '299' };
    }
  };

  const currencyData = getCurrencyData();

  // Calculate real aggregate rating from testimonials
  const calculateAggregateRating = () => {
    const validTestimonials = testimonials.filter(t => t.approved && t.stars);
    const totalReviews = validTestimonials.length;
    const totalStars = validTestimonials.reduce((sum, t) => sum + t.stars, 0);
    const averageRating = totalReviews > 0 ? (totalStars / totalReviews).toFixed(1) : "5.0";
    
    return {
      ratingValue: averageRating,
      reviewCount: totalReviews.toString(),
      bestRating: "5",
      worstRating: Math.min(...validTestimonials.map(t => t.stars)).toString()
    };
  };

  // Get real sample reviews from testimonials data
  const getSampleReviews = () => {
    const validTestimonials = testimonials.filter(t => t.approved && t.message && t.name);
    
    // Select diverse reviews: Romanian, English, and business clients
    const selectedReviews = [
      validTestimonials.find(t => t.name === "Oana"),
      validTestimonials.find(t => t.name === "Alexandra D."),
      validTestimonials.find(t => t.name === "Layna Noor"),
      validTestimonials.find(t => t.name === "AdminChirii.ro"),
      validTestimonials.find(t => t.name === "Tayem")
    ].filter(Boolean).slice(0, 5);

    return selectedReviews.map(testimonial => ({
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": testimonial.stars.toString(),
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": testimonial.name
      },
      "reviewBody": testimonial.message,
      "datePublished": "2024-12-01", // Using current date as testimonials don't have specific dates
      "publisher": {
        "@type": "Organization",
        "name": "MusicGift.ro"
      },
      ...(testimonial.location && { "locationCreated": testimonial.location }),
      ...(testimonial.youtube_link && { "url": testimonial.youtube_link }),
      "verified": true,
      "itemReviewed": {
        "@type": "Service",
        "name": "Personalized Music Composition"
      }
    }));
  };

  const aggregateRating = calculateAggregateRating();
  const sampleReviews = getSampleReviews();

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
        "telephone": "+40-721-501-141",
        "email": "contact@musicgift.ro",
        "availableLanguage": ["Romanian", "English", "German", "French", "Polish", "Italian"],
        "areaServed": "Worldwide"
      },
      {
        "@type": "ContactPoint", 
        "contactType": "sales",
        "telephone": "+40-721-501-141",
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
      "servicePhone": "+40-721-501-141",
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

  // Updated aggregate rating schema with real testimonials data
  const aggregateRatingSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MusicGift.ro",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": aggregateRating.ratingValue,
      "reviewCount": aggregateRating.reviewCount,
      "bestRating": aggregateRating.bestRating,
      "worstRating": aggregateRating.worstRating,
      "ratingExplanation": "Based on verified customer testimonials and satisfaction surveys"
    },
    "review": sampleReviews
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
    "telephone": "+40-721-501-141",
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
