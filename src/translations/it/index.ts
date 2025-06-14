
import { orderTranslations } from './order';
import { heroTranslations } from './hero';
import { collaborationTranslations } from './collaboration';
import { giftTranslations } from './gift';
import { packagesTranslations } from './packages';
import { commonTranslations } from './common';

export const itTranslations = {
  ...orderTranslations,
  ...heroTranslations,
  ...collaborationTranslations,
  ...giftTranslations,
  ...packagesTranslations,
  ...commonTranslations,
  // Add other translation modules here when they exist
};
