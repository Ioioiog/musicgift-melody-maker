
import { roTranslations } from './ro';
import { enTranslations } from './en';
import { frTranslations } from './fr';
import { plTranslations } from './pl';
import { deTranslations } from './de';
import type { Language } from '@/types/language';

export const translations: Record<Language, Record<string, string>> = {
  ro: roTranslations,
  en: enTranslations,
  fr: frTranslations,
  pl: plTranslations,
  de: deTranslations,
};

export { roTranslations, enTranslations, frTranslations, plTranslations, deTranslations };
