
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language, LanguageContextType } from '@/types/language';
import { languageNames } from '@/types/language';
import { translations } from '@/translations';
import { useRegionConfig } from '@/hooks/useRegionConfig';

export { Language, languageNames };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>('ro'); // Default fallback
  const [isInitialized, setIsInitialized] = useState(false);
  const { regionConfig, isLoading } = useRegionConfig();

  useEffect(() => {
    if (isLoading || !regionConfig) return;

    try {
      const saved = localStorage.getItem('language');
      const hasManualSelection = localStorage.getItem('language_manual_selection');
      
      let initialLang = regionConfig.defaultLanguage;
      
      // If user has manually selected a language and it's supported by current domain
      if (hasManualSelection && saved && regionConfig.supportedLanguages.includes(saved)) {
        initialLang = saved;
      } else if (!hasManualSelection) {
        // Auto-suggest language based on location if no manual selection
        const getLocationData = () => {
          try {
            const { useLocationContext } = require('@/contexts/LocationContext');
            const { location } = useLocationContext();
            return location;
          } catch {
            return null;
          }
        };

        const location = getLocationData();
        
        if (location && location.countryCode) {
          const suggestedLang = getSuggestedLanguage(location.countryCode);
          if (suggestedLang && regionConfig.supportedLanguages.includes(suggestedLang)) {
            initialLang = suggestedLang;
          }
        }
      }
      
      // Ensure the selected language is supported by the current domain
      if (!regionConfig.supportedLanguages.includes(initialLang)) {
        initialLang = regionConfig.defaultLanguage;
      }
      
      setLanguage(initialLang);
      setIsInitialized(true);
    } catch (error) {
      console.error('LanguageProvider: Error during initialization:', error);
      setLanguage(regionConfig.defaultLanguage);
      setIsInitialized(true);
    }
  }, [regionConfig, isLoading]);

  const getSuggestedLanguage = (countryCode: string): string | null => {
    const countryToLanguage: Record<string, string> = {
      'RO': 'ro',
      'US': 'en',
      'GB': 'en',
      'CA': 'en',
      'AU': 'en',
      'FR': 'fr',
      'DE': 'de',
      'PL': 'pl',
      'IT': 'it',
    };
    
    return countryToLanguage[countryCode] || null;
  };

  const handleSetLanguage = (newLanguage: string) => {
    if (!regionConfig || !regionConfig.supportedLanguages.includes(newLanguage)) {
      console.warn('Language not supported by current domain:', newLanguage);
      return;
    }
    
    setLanguage(newLanguage);
    localStorage.setItem('language_manual_selection', 'true');
  };

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('language', language);
      } catch (error) {
        console.error('LanguageProvider: Error saving language to localStorage:', error);
      }
    }
  }, [language, isInitialized]);

  const t = (key: string, fallback?: string): string => {
    try {
      const currentLangTranslations = translations[language as keyof typeof translations];
      
      if (!currentLangTranslations) {
        console.warn('LanguageProvider: No translations found for language:', language);
        const englishTranslations = translations['en'];
        if (englishTranslations && englishTranslations[key]) {
          return englishTranslations[key];
        }
      }
      
      const translation = currentLangTranslations?.[key];
      
      if (translation) {
        return translation;
      }
      
      const englishFallback = translations['en']?.[key];
      if (englishFallback) {
        console.warn('LanguageProvider: Using English fallback for missing key:', key, 'Current language:', language);
        return englishFallback;
      }
      
      const finalFallback = fallback || key;
      console.warn('LanguageProvider: No translation found, using fallback:', finalFallback, 'Key:', key, 'Language:', language);
      return finalFallback;
      
    } catch (error) {
      console.error('LanguageProvider: Error in translation function:', error);
      return fallback || key;
    }
  };

  const contextValue: LanguageContextType = {
    language,
    setLanguage: handleSetLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  try {
    const context = useContext(LanguageContext);
    
    if (context === undefined) {
      console.error('useLanguage: Context is undefined, providing fallback');
      
      return {
        language: 'ro',
        setLanguage: (lang: string) => {
          console.warn('useLanguage: Fallback setLanguage called with:', lang);
        },
        t: (key: string, fallback?: string) => {
          try {
            const roTranslations = translations['ro'];
            const enTranslations = translations['en'];
            return roTranslations?.[key] || enTranslations?.[key] || fallback || key;
          } catch (error) {
            console.error('useLanguage: Error in fallback translation:', error);
            return fallback || key;
          }
        }
      };
    }
    
    return context;
  } catch (error) {
    console.error('useLanguage: Error accessing context:', error);
    
    return {
      language: 'ro',
      setLanguage: () => {},
      t: (key: string, fallback?: string) => fallback || key
    };
  }
};
