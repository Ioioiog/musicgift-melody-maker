
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

export const useTranslations = () => {
  const { language } = useLanguage();
  
  return useQuery({
    queryKey: ['translations', language],
    queryFn: async () => {
      console.log('Fetching translations for language:', language);
      
      // Since the translations table doesn't exist in the database,
      // return an empty object to avoid errors
      console.log('Translations table does not exist, returning empty translations');
      return {};
    },
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });
};

export const useTranslation = () => {
  const { data: dbTranslations = {}, isLoading, error } = useTranslations();
  const { t: localT, language } = useLanguage();
  
  const t = (key: string, fallback?: string) => {
    // 1. First try local translation from LanguageContext (prioritized for packages)
    const localTranslation = localT(key);
    if (localTranslation && localTranslation !== key) {
      return localTranslation;
    }
    
    // 2. Then try database translation (for dynamic/admin content)
    const dbTranslation = dbTranslations[key];
    if (dbTranslation) {
      return dbTranslation;
    }
    
    // 3. Return fallback or the key itself if no translation found
    return fallback || key;
  };
  
  return { 
    t, 
    translations: dbTranslations,
    isLoading,
    error,
    language
  };
};
