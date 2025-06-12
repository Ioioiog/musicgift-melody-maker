
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PageMetaProps {
  title_en: string;
  title_ro: string;
  description_en: string;
  description_ro: string;
  keywords_en?: string;
  keywords_ro?: string;
  ogImage?: string;
}

export const usePageMeta = ({
  title_en,
  title_ro,
  description_en,
  description_ro,
  keywords_en,
  keywords_ro,
  ogImage = '/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png'
}: PageMetaProps) => {
  const { language } = useLanguage();
  
  useEffect(() => {
    // Determine if we're on Romanian or English version
    const isRomanian = language === 'ro' || window.location.pathname.startsWith('/ro');
    
    // Set the appropriate title and description
    const title = isRomanian ? title_ro : title_en;
    const description = isRomanian ? description_ro : description_en;
    const keywords = isRomanian ? keywords_ro : keywords_en;
    
    // Update document title
    document.title = title;
    
    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);
    
    // Update or create meta keywords if provided
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords);
    }
    
    // Update or create Open Graph title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);
    
    // Update or create Open Graph description
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', description);
    
    // Update or create Open Graph image
    let ogImageMeta = document.querySelector('meta[property="og:image"]');
    if (!ogImageMeta) {
      ogImageMeta = document.createElement('meta');
      ogImageMeta.setAttribute('property', 'og:image');
      document.head.appendChild(ogImageMeta);
    }
    ogImageMeta.setAttribute('content', `${window.location.origin}${ogImage}`);
    
    // Update or create Twitter Card meta tags
    let twitterCard = document.querySelector('meta[name="twitter:card"]');
    if (!twitterCard) {
      twitterCard = document.createElement('meta');
      twitterCard.setAttribute('name', 'twitter:card');
      document.head.appendChild(twitterCard);
    }
    twitterCard.setAttribute('content', 'summary_large_image');
    
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta');
      twitterTitle.setAttribute('name', 'twitter:title');
      document.head.appendChild(twitterTitle);
    }
    twitterTitle.setAttribute('content', title);
    
    let twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDescription) {
      twitterDescription = document.createElement('meta');
      twitterDescription.setAttribute('name', 'twitter:description');
      document.head.appendChild(twitterDescription);
    }
    twitterDescription.setAttribute('content', description);
    
    let twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (!twitterImage) {
      twitterImage = document.createElement('meta');
      twitterImage.setAttribute('name', 'twitter:image');
      document.head.appendChild(twitterImage);
    }
    twitterImage.setAttribute('content', `${window.location.origin}${ogImage}`);
    
    // Set language attribute on html element
    document.documentElement.lang = isRomanian ? 'ro' : 'en';
    
  }, [title_en, title_ro, description_en, description_ro, keywords_en, keywords_ro, language, ogImage]);
};
