
export type Language = "en" | "ro" | "fr" | "pl" | "de";

export const languageNames: Record<Language, string> = {
  en: "English",
  ro: "Română", 
  fr: "Français",
  pl: "Polski",
  de: "Deutsch"
};

export interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, fallback?: string) => string;
}
