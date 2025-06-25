
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
  image = "/uploads/logo_musicgift.webp",
  url = "https://www.musicgift.ro",
  type = "website",
  structuredData
}: SEOHeadProps) => {
  const { language } = useLanguage();
  
  const defaultTitle = "MusicGift.ro - Cadouri Muzicale Personalizate";
  const defaultDescription = "Creează melodii personalizate și cadouri muzicale unice. Servicii profesionale de compoziție. Peste 2000 melodii create cu dragoste.";

  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;
  
  // Ensure the image URL is absolute
  const absoluteImageUrl = image.startsWith('http') ? image : `${url}${image}`;
  
  // Log for debugging
  console.log('SEO Head - Image URL:', absoluteImageUrl);
  console.log('SEO Head - Title:', finalTitle);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content="cadouri muzicale, melodii personalizate, compoziții muzicale, cadouri unice, muzică personalizată, înregistrări profesionale, producție muzicală, România" />
      <meta name="author" content="MusicGift.ro" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Language and Locale */}
      <meta httpEquiv="content-language" content={language} />
      <meta name="language" content={language} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:image:secure_url" content={absoluteImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="MusicGift.ro - Cadouri Muzicale Personalizate - Logo oficial" />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="MusicGift.ro" />
      <meta property="og:locale" content={language === 'ro' ? 'ro_RO' : 'en_US'} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={absoluteImageUrl} />
      <meta name="twitter:image:alt" content="MusicGift.ro - Cadouri Muzicale Personalizate - Logo oficial" />
      <meta name="twitter:site" content="@MusicGiftRo" />
      <meta name="twitter:creator" content="@MusicGiftRo" />
      
      {/* Additional Social Media Tags */}
      <meta property="article:publisher" content="https://www.facebook.com/MusicGiftRo" />
      <meta name="theme-color" content="#8B5CF6" />
      
      {/* Performance Hints */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      
      {/* Sitemap Reference */}
      <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      
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
