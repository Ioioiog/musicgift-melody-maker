
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
      console.log('LanguageProvider: Initializing...');
      const saved = localStorage.getItem('language');
      const initialLang = saved && Object.keys(translations).includes(saved) ? saved : 'ro';
      console.log('LanguageProvider: Setting language to:', initialLang);
      setLanguage(initialLang);
      setIsInitialized(true);
    } catch (error) {
      console.error('LanguageProvider: Error during initialization:', error);
      // Fallback to default language
      setLanguage('ro');
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('language', language);
        console.log('LanguageProvider: Language saved to localStorage:', language);
      } catch (error) {
        console.error('LanguageProvider: Error saving language to localStorage:', error);
      }
    }
  }, [language, isInitialized]);

  const t = (key: string, fallback?: string): string => {
    try {
      console.log('Translation requested for key:', key, 'language:', language);
      
      // Get the current language translations
      const currentLangTranslations = translations[language as keyof typeof translations];
      
      if (!currentLangTranslations) {
        console.warn('LanguageProvider: No translations found for language:', language);
        // Fallback to English if current language translations are missing
        const englishTranslations = translations['en'];
        if (englishTranslations && englishTranslations[key]) {
          console.log('LanguageProvider: Using English fallback for key:', key);
          return englishTranslations[key];
        }
      }
      
      // Try to get the translation
      const translation = currentLangTranslations?.[key];
      
      if (translation) {
        console.log('Translation found:', translation);
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
    setLanguage,
    t
  };

  console.log('LanguageProvider: Rendering with context value:', contextValue);

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
          console.warn('useLanguage: Fallback translation for key:', key);
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
    
    console.log('useLanguage: Context found:', context);
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
