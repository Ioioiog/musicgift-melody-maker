
import { orderTranslations } from './order';
import { heroTranslations } from './hero';
import { collaborationTranslations } from './collaboration';
import { giftTranslations } from './gift';

export const itTranslations = {
  ...orderTranslations,
  ...heroTranslations,
  ...collaborationTranslations,
  ...giftTranslations,
  // Add other translation modules here when they exist
};
