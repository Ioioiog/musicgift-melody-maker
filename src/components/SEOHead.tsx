
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  canonicalUrl?: string;
  structuredData?: object;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  image = '/lovable-uploads/9d0d10ef-2340-4632-8df0-f5058547a0c9.png',
  type = 'website',
  canonicalUrl,
  structuredData
}) => {
  const { language } = useLanguage();
  const location = useLocation();
  
  const baseUrl = 'https://www.musicgift.ro';
  const currentUrl = canonicalUrl || `${baseUrl}${location.pathname}`;
  
  const defaultTitles = {
    en: 'MusicGift.ro - Personalized Songs & Musical Gifts',
    ro: 'MusicGift.ro - Cântece Personalizate și Cadouri Muzicale',
    fr: 'MusicGift.ro - Chansons Personnalisées et Cadeaux Musicaux',
    de: 'MusicGift.ro - Personalisierte Lieder und Musikgeschenke',
    pl: 'MusicGift.ro - Spersonalizowane Piosenki i Prezenty Muzyczne'
  };
  
  const defaultDescriptions = {
    en: 'Create personalized songs and musical gifts. Professional custom songs for special occasions, birthdays, weddings, and more. Order your unique musical gift today.',
    ro: 'Creează cântece personalizate și cadouri muzicale. Cântece personalizate profesionale pentru ocazii speciale, zile de naștere, nunți și multe altele.',
    fr: 'Créez des chansons personnalisées et des cadeaux musicaux. Chansons personnalisées professionnelles pour des occasions spéciales, anniversaires, mariages et plus.',
    de: 'Erstellen Sie personalisierte Lieder und Musikgeschenke. Professionelle maßgeschneiderte Lieder für besondere Anlässe, Geburtstage, Hochzeiten und mehr.',
    pl: 'Twórz spersonalizowane piosenki i prezenty muzyczne. Profesjonalne niestandardowe piosenki na specjalne okazje, urodziny, wesela i więcej.'
  };
  
  const pageTitle = title || defaultTitles[language as keyof typeof defaultTitles] || defaultTitles.en;
  const pageDescription = description || defaultDescriptions[language as keyof typeof defaultDescriptions] || defaultDescriptions.en;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={`${baseUrl}${image}`} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="MusicGift.ro" />
      <meta property="og:locale" content={language === 'ro' ? 'ro_RO' : language === 'en' ? 'en_US' : `${language}_${language.toUpperCase()}`} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={`${baseUrl}${image}`} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="MusicGift.ro" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
