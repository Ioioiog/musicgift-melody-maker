
import { roTranslations } from './ro';
import { enTranslations } from './en';
import type { Language } from '@/types/language';

export const translations: Record<Language, Record<string, string>> = {
  ro: roTranslations,
  en: enTranslations,
  // Placeholder for other languages - can be expanded later
  fr: enTranslations, // TODO: Add French translations
  pl: enTranslations, // TODO: Add Polish translations
  de: enTranslations, // TODO: Add German translations
};

export { roTranslations, enTranslations };
