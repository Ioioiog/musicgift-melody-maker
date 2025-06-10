
import { orderTranslations } from './order';
import { heroTranslations } from './hero';
import { collaborationTranslations } from './collaboration';

export const itTranslations = {
  ...orderTranslations,
  ...heroTranslations,
  ...collaborationTranslations,
  // Add other translation modules here when they exist
};
