
export type Language = 'ro' | 'en' | 'fr' | 'pl' | 'de' | 'it';

export interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, fallback?: string) => string;
}

export const languageNames: Record<Language, string> = {
  ro: 'Română',
  en: 'English',
  fr: 'Français',
  pl: 'Polski',
  de: 'Deutsch',
  it: 'Italiano'
};
