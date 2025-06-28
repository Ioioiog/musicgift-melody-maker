
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useLocation } from '@/hooks/useLocation';
import { translations } from '@/translations';
import type { Language } from '@/types/language';

interface LocalizationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: string;
  setCurrency: (curr: string) => void;
  t: (key: string, fallback?: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

const CURRENCY_MAP: Record<string, string> = {
  'ro': 'RON',
  'en': 'EUR',
  'fr': 'EUR', 
  'de': 'EUR',
  'pl': 'PLN'
};

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { country } = useLocation();
  const [language, setLanguageState] = useState<Language>('ro');
  const [currency, setCurrencyState] = useState('RON');

  // Memoized language detection
  const detectedLanguage = useMemo(() => {
    const savedLanguage = localStorage.getItem('preferred-language') as Language;
    if (savedLanguage && translations[savedLanguage]) return savedLanguage;

    const browserLang = navigator.language.split('-')[0] as Language;
    if (translations[browserLang]) return browserLang;

    return country === 'RO' ? 'ro' : 'en';
  }, [country]);

  // Initialize language and currency
  useEffect(() => {
    setLanguageState(detectedLanguage);
    setCurrencyState(CURRENCY_MAP[detectedLanguage] || 'EUR');
  }, [detectedLanguage]);

  // Memoized translation function
  const t = useMemo(() => {
    return (key: string, fallback?: string): string => {
      const keys = key.split('.');
      let value: any = translations[language];
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return fallback || key;
        }
      }
      
      return typeof value === 'string' ? value : fallback || key;
    };
  }, [language]);

  // Memoized setters with side effects
  const setLanguage = useMemo(() => {
    return (lang: Language) => {
      setLanguageState(lang);
      setCurrencyState(CURRENCY_MAP[lang] || 'EUR');
      localStorage.setItem('preferred-language', lang);
    };
  }, []);

  const setCurrency = useMemo(() => {
    return (curr: string) => {
      setCurrencyState(curr);
      localStorage.setItem('preferred-currency', curr);
    };
  }, []);

  // Memoized context value
  const value = useMemo(() => ({
    language,
    setLanguage,
    currency,
    setCurrency,
    t
  }), [language, setLanguage, currency, setCurrency, t]);

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
