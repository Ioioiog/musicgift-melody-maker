
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

export const useTranslations = () => {
  const { language } = useLanguage();
  
  return useQuery({
    queryKey: ['translations', language],
    queryFn: async () => {
      console.log('Fetching translations for language:', language);
      
      const { data, error } = await supabase
        .from('translations')
        .select('key_name, translation')
        .eq('language_code', language);

      if (error) {
        console.error('Error fetching translations:', error);
        throw error;
      }
      
      // Convert to key-value object for easy lookup
      const translations: Record<string, string> = {};
      data?.forEach(item => {
        translations[item.key_name] = item.translation;
      });
      
      console.log('Fetched translations:', translations);
      return translations;
    },
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });
};

export const useTranslation = () => {
  const { data: dbTranslations = {}, isLoading, error } = useTranslations();
  const { t: localT, language } = useLanguage();
  
  const t = (key: string, fallback?: string) => {
    // 1. Try database translation first
    const dbTranslation = dbTranslations[key];
    if (dbTranslation) return dbTranslation;
    
    // 2. Try local translation from LanguageContext
    const localTranslation = localT(key);
    if (localTranslation && localTranslation !== key) return localTranslation;
    
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
