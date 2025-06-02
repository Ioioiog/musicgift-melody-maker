
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language, LanguageContextType } from '@/types/language';
import { languageNames } from '@/types/language';
import { translations } from '@/translations';

export { Language, languageNames };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'ro';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    const translation = translations[language as keyof typeof translations]?.[key];
    return translation || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
