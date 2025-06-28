
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language, LanguageContextType } from '@/types/language';
import { languageNames } from '@/types/language';
import { translations } from '@/translations';

export { Language, languageNames };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>('ro'); // Default fallback
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('language');
      let initialLang = saved && Object.keys(translations).includes(saved) ? saved : 'ro';
      
      // Auto-suggest language based on location if no manual selection - made location-safe
      const hasManualSelection = localStorage.getItem('language_manual_selection');
      if (!hasManualSelection) {
        // Safely access location context without throwing errors
        const getLocationData = () => {
          try {
            // Import the context hook dynamically to avoid circular dependencies
            const { useLocationContext } = require('@/contexts/LocationContext');
            const { location } = useLocationContext();
            return location;
          } catch {
            // If location context is not available, return null
            return null;
          }
        };

        const location = getLocationData();
        
        if (location && location.countryCode) {
          const suggestedLang = getSuggestedLanguage(location.countryCode);
          if (suggestedLang && Object.keys(translations).includes(suggestedLang)) {
            initialLang = suggestedLang;
          }
        }
      }
      
      setLanguage(initialLang);
      setIsInitialized(true);
    } catch (error) {
      console.error('LanguageProvider: Error during initialization:', error);
      // Fallback to default language
      setLanguage('ro');
      setIsInitialized(true);
    }
  }, []);

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
      // Get the current language translations
      const currentLangTranslations = translations[language as keyof typeof translations];
      
      if (!currentLangTranslations) {
        console.warn('LanguageProvider: No translations found for language:', language);
        // Fallback to English if current language translations are missing
        const englishTranslations = translations['en'];
        if (englishTranslations && englishTranslations[key]) {
          return englishTranslations[key];
        }
      }
      
      // Try to get the translation
      const translation = currentLangTranslations?.[key];
      
      if (translation) {
        return translation;
      }
      
      // If no translation found, try English fallback
      const englishFallback = translations['en']?.[key];
      if (englishFallback) {
        console.warn('LanguageProvider: Using English fallback for missing key:', key);
        return englishFallback;
      }
      
      // Final fallback
      const finalFallback = fallback || key;
      console.warn('LanguageProvider: No translation found, using fallback:', finalFallback);
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
      
      // Provide a fallback context to prevent app crashes
      return {
        language: 'ro',
        setLanguage: (lang: string) => {
          console.warn('useLanguage: Fallback setLanguage called with:', lang);
        },
        t: (key: string, fallback?: string) => {
          // Try to get translation directly from translations object
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
    
    // Emergency fallback
    return {
      language: 'ro',
      setLanguage: () => {},
      t: (key: string, fallback?: string) => fallback || key
    };
  }
};
