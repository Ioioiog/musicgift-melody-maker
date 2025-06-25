
import { BlogPost, Translation, BlogPostTranslations } from '@/types/blog';

export const getTranslation = (
  translations: BlogPostTranslations, 
  language: string, 
  defaultLanguage: string = 'ro'
): Translation | null => {
  // Try current language first
  if (translations[language]) {
    return translations[language];
  }
  
  // Fallback to English
  if (language !== 'en' && translations['en']) {
    return translations['en'];
  }
  
  // Fallback to default language (Romanian)
  if (language !== defaultLanguage && translations[defaultLanguage]) {
    return translations[defaultLanguage];
  }
  
  // Return first available translation
  const availableLanguages = Object.keys(translations);
  if (availableLanguages.length > 0) {
    return translations[availableLanguages[0]];
  }
  
  return null;
};

export const getLocalizedBlogPost = (post: BlogPost, language: string) => {
  const translation = getTranslation(post.translations, language, post.default_language);
  
  if (!translation) {
    return null;
  }
  
  return {
    ...post,
    title: translation.title,
    excerpt: translation.excerpt,
    content: translation.content,
    meta_title: translation.meta_title,
    meta_description: translation.meta_description,
    slug: translation.slug,
  };
};

export const generateSlugFromTitle = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .trim();
};

export const getAvailableLanguages = (translations: BlogPostTranslations): string[] => {
  return Object.keys(translations);
};

export const hasTranslation = (translations: BlogPostTranslations, language: string): boolean => {
  return Boolean(translations[language]);
};
