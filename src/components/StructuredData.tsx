
import { useLanguage } from '@/contexts/LanguageContext';

export const useStructuredData = () => {
  const { language } = useLanguage();
  
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "MusicGift.ro",
    "url": "https://www.musicgift.ro",
    "description": language === 'ro' 
      ? "Creează cântece personalizate și cadouri muzicale unice"
      : "Create personalized songs and unique musical gifts",
    "publisher": {
      "@type": "Organization",
      "name": "MusicGift.ro",
      "url": "https://www.musicgift.ro"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.musicgift.ro/packages?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
  
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MusicGift.ro",
    "url": "https://www.musicgift.ro",
    "logo": "https://www.musicgift.ro/lovable-uploads/9d0d10ef-2340-4632-8df0-f5058547a0c9.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "contact@musicgift.ro",
      "availableLanguage": ["Romanian", "English", "French", "German", "Polish"]
    },
    "sameAs": [
      "https://www.facebook.com/musicgift.ro",
      "https://www.instagram.com/musicgift.ro"
    ]
  };
  
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Custom Song Creation",
    "description": language === 'ro' 
      ? "Servicii profesionale de creare a cântecelor personalizate"
      : "Professional custom song creation services",
    "provider": {
      "@type": "Organization",
      "name": "MusicGift.ro"
    },
    "areaServed": "Romania",
    "serviceType": "Music Production"
  };
  
  return {
    websiteSchema,
    organizationSchema,
    serviceSchema
  };
};
