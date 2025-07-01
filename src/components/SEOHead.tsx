
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'react-router-dom';
import { useRegionConfig } from '@/hooks/useRegionConfig';
import { getHreflangUrls } from '@/utils/regionConfig';

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
  const { regionConfig } = useRegionConfig();
  
  if (!regionConfig) return null;

  const defaultTitle = t('siteTitle', 'MusicGift - Personalized Musical Gifts');
  const defaultDescription = t('siteDescription', 'Create personalized songs and unique musical gifts. Professional composition services. Over 2000 songs created with love.');

  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;

  // Generate canonical URL based on current domain
  const canonicalUrl = url || `https://${regionConfig.domain}${location.pathname}`;
  
  // Generate hreflang URLs for current path
  const hreflangUrls = getHreflangUrls(location.pathname);

  // Language-specific voice search keywords based on region
  const getVoiceSearchKeywords = () => {
    const baseKeywords = {
      'en': [
        "personalized musical gifts",
        "how to order a custom song",
        "wedding song cost",
        "music composition services",
        "personalized songs",
        "musical gifts",
        "professional recording studio",
        "custom music compositions",
        "emotional gifts for husband",
        "best musical gifts",
        "anniversary songs",
        "music services near me",
        "romantic personalized gifts",
        "professional music production"
      ],
      'ro': [
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
      ]
    };

    // Add region-specific keywords
    const regionKeywords = baseKeywords[language as keyof typeof baseKeywords] || baseKeywords['en'];
    
    if (regionConfig.region === 'RO') {
      regionKeywords.push("România", "București", "Cluj", "Timișoara");
    } else if (regionConfig.region === 'EU') {
      regionKeywords.push("Europe", "UK", "Germany", "France");
    } else if (regionConfig.region === 'US') {
      regionKeywords.push("United States", "USA", "America");
    }

    return regionKeywords.join(", ");
  };

  const voiceSearchKeywords = getVoiceSearchKeywords();

  // Get region-specific geo data
  const getGeoData = () => {
    switch (regionConfig.region) {
      case 'RO':
        return { 
          region: 'RO', 
          placename: 'România', 
          position: '45.9432;24.9668', 
          icbm: '45.9432, 24.9668' 
        };
      case 'EU':
        return { 
          region: 'GB', 
          placename: 'United Kingdom', 
          position: '51.5074;-0.1278', 
          icbm: '51.5074, -0.1278' 
        };
      case 'US':
        return { 
          region: 'US', 
          placename: 'United States', 
          position: '39.8283;-98.5795', 
          icbm: '39.8283, -98.5795' 
        };
      default:
        return { 
          region: 'GB', 
          placename: 'United Kingdom', 
          position: '51.5074;-0.1278', 
          icbm: '51.5074, -0.1278' 
        };
    }
  };

  const geoData = getGeoData();

  // Region-specific site name
  const siteName = `MusicGift ${regionConfig.region}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={voiceSearchKeywords} />
      <meta name="author" content={siteName} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Voice Search Optimization */}
      <meta name="voice-search-optimized" content="true" />
      <meta name="question-answer-format" content="conversational" />
      <meta name="voice-keywords" content={t('voiceKeywords', 'how can I order, how much does it cost, where can I find, what are the best, how to choose')} />
      
      {/* Local SEO for Voice Search */}
      <meta name="geo.region" content={geoData.region} />
      <meta name="geo.placename" content={geoData.placename} />
      <meta name="geo.position" content={geoData.position} />
      <meta name="ICBM" content={geoData.icbm} />
      
      {/* Dynamic hreflang tags based on region config */}
      {Object.entries(hreflangUrls).map(([lang, href]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={href} />
      ))}
      
      {/* Canonical URL - Domain specific */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Language and Locale */}
      <meta httpEquiv="content-language" content={language} />
      <meta name="language" content={language} />
      
      {/* Open Graph Tags - Domain specific */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={`https://${regionConfig.domain}${image}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={finalTitle} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={regionConfig.locale} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={`https://${regionConfig.domain}${image}`} />
      <meta name="twitter:image:alt" content={finalTitle} />
      
      {/* Voice Search Specific Tags */}
      <meta name="speakable" content="true" />
      <meta name="voice-assistant-compatible" content="Google Assistant, Alexa, Siri" />
      
      {/* Performance Hints */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      
      {/* Sitemap Reference - Domain specific */}
      <link rel="sitemap" type="application/xml" href={`https://${regionConfig.domain}/sitemap.xml`} />
      
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
