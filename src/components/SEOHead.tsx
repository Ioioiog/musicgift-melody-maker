
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: any;
}

const SEOHead = ({ 
  title, 
  description, 
  image = "/uploads/1247309a-2342-4b12-af03-20eca7d1afab.png",
  url,
  type = "website",
  structuredData
}: SEOHeadProps) => {
  const { language, t } = useLanguage();
  const location = useLocation();
  
  const defaultTitle = t('siteTitle', 'MusicGift.ro - Personalized Musical Gifts');
  const defaultDescription = t('siteDescription', 'Create personalized songs and unique musical gifts. Professional composition services. Over 2000 songs created with love.');

  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;

  // Generate dynamic hreflang URLs based on current path
  const generateHreflangUrls = () => {
    const baseUrl = 'https://www.musicgift.ro';
    const currentPath = location.pathname;
    
    // Language mapping for hreflang URLs
    const languageRoutes = {
      'ro': currentPath === '/fr' || currentPath === '/en' || currentPath === '/de' || currentPath === '/pl' || currentPath === '/it' ? '/' : currentPath,
      'en': currentPath === '/fr' || currentPath === '/de' || currentPath === '/pl' || currentPath === '/it' ? '/en' : currentPath === '/' ? '/en' : currentPath,
      'fr': currentPath === '/en' || currentPath === '/de' || currentPath === '/pl' || currentPath === '/it' ? '/fr' : currentPath === '/' ? '/fr' : currentPath,
      'de': currentPath === '/fr' || currentPath === '/en' || currentPath === '/pl' || currentPath === '/it' ? '/de' : currentPath === '/' ? '/de' : currentPath,
      'pl': currentPath === '/fr' || currentPath === '/en' || currentPath === '/de' || currentPath === '/it' ? '/pl' : currentPath === '/' ? '/pl' : currentPath,
      'it': currentPath === '/fr' || currentPath === '/en' || currentPath === '/de' || currentPath === '/pl' ? '/it' : currentPath === '/' ? '/it' : currentPath
    };

    return {
      'ro': `${baseUrl}${languageRoutes.ro}`,
      'en': `${baseUrl}${languageRoutes.en}`,
      'fr': `${baseUrl}${languageRoutes.fr}`,
      'de': `${baseUrl}${languageRoutes.de}`,
      'pl': `${baseUrl}${languageRoutes.pl}`,
      'it': `${baseUrl}${languageRoutes.it}`
    };
  };

  const hreflangUrls = generateHreflangUrls();
  
  // Use provided URL or generate canonical URL
  const canonicalUrl = url || `https://www.musicgift.ro${location.pathname}`;

  // Language-specific voice search keywords
  const getVoiceSearchKeywords = () => {
    switch (language) {
      case 'en':
        return [
          "personalized musical gifts",
          "how to order a custom song",
          "wedding song cost",
          "music composition services UK",
          "personalized songs London",
          "musical gifts Manchester",
          "professional recording studio",
          "custom music compositions",
          "emotional gifts for husband",
          "best musical gifts",
          "anniversary songs",
          "music services near me",
          "romantic personalized gifts",
          "professional music production"
        ].join(", ");
      case 'fr':
        return [
          "cadeaux musicaux personnalisés",
          "comment commander une chanson personnalisée",
          "prix chanson de mariage",
          "services composition musicale France",
          "chansons personnalisées Paris",
          "cadeaux musicaux Lyon",
          "studio enregistrement professionnel",
          "compositions musicales personnalisées",
          "cadeaux émouvants pour mari",
          "meilleurs cadeaux musicaux",
          "chansons anniversaire",
          "services musicaux près de moi",
          "cadeaux romantiques personnalisés",
          "production musicale professionnelle"
        ].join(", ");
      case 'de':
        return [
          "personalisierte Musikgeschenke",
          "wie bestelle ich ein personalisiertes Lied",
          "Hochzeitslied Kosten",
          "Musikkompositionsdienste Deutschland",
          "personalisierte Lieder Berlin",
          "Musikgeschenke München",
          "professionelles Aufnahmestudio",
          "personalisierte Musikcompositionen",
          "emotionale Geschenke für Ehemann",
          "beste Musikgeschenke",
          "Jubiläumslieder",
          "Musikdienste in meiner Nähe",
          "romantische personalisierte Geschenke",
          "professionelle Musikproduktion"
        ].join(", ");
      case 'pl':
        return [
          "spersonalizowane prezenty muzyczne",
          "jak zamówić spersonalizowaną piosenkę",
          "koszt piosenki weselnej",
          "usługi kompozycji muzycznej Polska",
          "spersonalizowane piosenki Warszawa",
          "prezenty muzyczne Kraków",
          "profesjonalne studio nagrań",
          "spersonalizowane kompozycje muzyczne",
          "wzruszające prezenty dla męża",
          "najlepsze prezenty muzyczne",
          "piosenki rocznicowe",
          "usługi muzyczne w pobliżu",
          "romantyczne spersonalizowane prezenty",
          "profesjonalna produkcja muzyczna"
        ].join(", ");
      case 'it':
        return [
          "regali musicali personalizzati",
          "come ordinare una canzone personalizzata",
          "costo canzone matrimonio",
          "servizi composizione musicale Italia",
          "canzoni personalizzate Roma",
          "regali musicali Milano",
          "studio registrazione professionale",
          "composizioni musicali personalizzate",
          "regali emozionanti per marito",
          "migliori regali musicali",
          "canzoni anniversario",
          "servizi musicali vicino a me",
          "regali romantici personalizzati",
          "produzione musicale professionale"
        ].join(", ");
      default: // Romanian
        return [
          "cadouri muzicale personalizate",
          "cum să comand o melodie personalizată",
          "cât costă o melodie pentru nuntă",
          "servicii compoziții muzicale România",
          "melodii personalizate București",
          "cadouri muzicale Cluj-Napoca",
          "studio înregistrări profesionale",
          "compoziții muzicale personalizate",
          "cadouri emoționante pentru soț",
          "cele mai bune cadouri muzicale",
          "melodii pentru aniversări",
          "servicii muzicale lângă mine",
          "cadouri romantice personalizate",
          "producție muzicală profesională"
        ].join(", ");
    }
  };

  const voiceSearchKeywords = getVoiceSearchKeywords();

  // Get region-specific geo coordinates
  const getGeoData = () => {
    switch (language) {
      case 'en':
        return { region: 'GB', placename: 'United Kingdom', position: '51.5074;-0.1278', icbm: '51.5074, -0.1278' };
      case 'fr':
        return { region: 'FR', placename: 'France', position: '48.8566;2.3522', icbm: '48.8566, 2.3522' };
      case 'de':
        return { region: 'DE', placename: 'Deutschland', position: '52.5200;13.4050', icbm: '52.5200, 13.4050' };
      case 'pl':
        return { region: 'PL', placename: 'Polska', position: '52.2297;21.0122', icbm: '52.2297, 21.0122' };
      case 'it':
        return { region: 'IT', placename: 'Italia', position: '41.9028;12.4964', icbm: '41.9028, 12.4964' };
      default:
        return { region: 'RO', placename: 'România', position: '45.9432;24.9668', icbm: '45.9432, 24.9668' };
    }
  };

  const geoData = getGeoData();

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={voiceSearchKeywords} />
      <meta name="author" content="MusicGift.ro" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Voice Search Optimization */}
      <meta name="voice-search-optimized" content="true" />
      <meta name="question-answer-format" content="conversational" />
      
      {/* Conversational Keywords for Voice Search */}
      <meta name="voice-keywords" content={t('voiceKeywords', 'how can I order, how much does it cost, where can I find, what are the best, how to choose')} />
      
      {/* Local SEO for Voice Search */}
      <meta name="geo.region" content={geoData.region} />
      <meta name="geo.placename" content={geoData.placename} />
      <meta name="geo.position" content={geoData.position} />
      <meta name="ICBM" content={geoData.icbm} />
      
      {/* Dynamic hreflang tags based on current page */}
      <link rel="alternate" hrefLang="ro" href={hreflangUrls.ro} />
      <link rel="alternate" hrefLang="en" href={hreflangUrls.en} />
      <link rel="alternate" hrefLang="fr" href={hreflangUrls.fr} />
      <link rel="alternate" hrefLang="de" href={hreflangUrls.de} />
      <link rel="alternate" hrefLang="pl" href={hreflangUrls.pl} />
      <link rel="alternate" hrefLang="it" href={hreflangUrls.it} />
      <link rel="alternate" hrefLang="x-default" href="https://www.musicgift.ro/" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Language and Locale */}
      <meta httpEquiv="content-language" content={language} />
      <meta name="language" content={language} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={`https://www.musicgift.ro${image}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={finalTitle} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="MusicGift.ro" />
      <meta property="og:locale" content={language === 'ro' ? 'ro_RO' : language === 'en' ? 'en_US' : language === 'fr' ? 'fr_FR' : language === 'de' ? 'de_DE' : language === 'pl' ? 'pl_PL' : 'it_IT'} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={`https://www.musicgift.ro${image}`} />
      <meta name="twitter:image:alt" content={finalTitle} />
      
      {/* Voice Search Specific Tags */}
      <meta name="speakable" content="true" />
      <meta name="voice-assistant-compatible" content="Google Assistant, Alexa, Siri" />
      
      {/* Performance Hints */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      
      {/* Sitemap Reference */}
      <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
    </Helmet>
  );
};

export default SEOHead;
