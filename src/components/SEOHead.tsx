
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';

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
  url = "https://www.musicgift.ro",
  type = "website",
  structuredData
}: SEOHeadProps) => {
  const { language } = useLanguage();
  
  const defaultTitle = "MusicGift.ro - Cadouri Muzicale Personalizate";
  const defaultDescription = "Creează melodii personalizate și cadouri muzicale unice. Servicii profesionale de compoziție. Peste 2000 melodii create cu dragoste.";

  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;

  // Voice Search optimized keywords
  const voiceSearchKeywords = [
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
      <meta name="voice-keywords" content="cum pot să comand, cât costă, unde pot să găsesc, care sunt cele mai bune, cum să aleg" />
      
      {/* Local SEO for Voice Search */}
      <meta name="geo.region" content="RO" />
      <meta name="geo.placename" content="România" />
      <meta name="geo.position" content="45.9432;24.9668" />
      <meta name="ICBM" content="45.9432, 24.9668" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Language and Locale */}
      <meta httpEquiv="content-language" content={language} />
      <meta name="language" content={language} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={`${url}${image}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="MusicGift.ro - Cadouri Muzicale Personalizate" />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="MusicGift.ro" />
      <meta property="og:locale" content={language === 'ro' ? 'ro_RO' : 'en_US'} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={`${url}${image}`} />
      <meta name="twitter:image:alt" content="MusicGift.ro - Cadouri Muzicale Personalizate" />
      
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
