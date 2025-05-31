
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
    retry: 3,
    retryDelay: 1000,
  });
};

export const useTranslation = () => {
  const { data: translations = {}, isLoading, error } = useTranslations();
  const { t: contextT, language } = useLanguage();
  
  const t = (key: string, fallback?: string) => {
    // First try database translation
    const dbTranslation = translations[key];
    if (dbTranslation) return dbTranslation;
    
    // Then try context translation (local translations)
    const contextTranslation = contextT(key);
    if (contextTranslation !== key) return contextTranslation;
    
    // Return provided fallback
    if (fallback) return fallback;
    
    // Log missing translation for debugging
    if (!isLoading && !error) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
    }
    
    // Return the key itself as last resort
    return key;
  };
  
  return { 
    t, 
    translations, 
    isLoading, 
    error,
    language 
  };
};
