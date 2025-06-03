
import type { Package } from '@/types';

export const getPackagePrice = (pkg: Package, currency: 'EUR' | 'RON'): number => {
  return currency === 'EUR' ? pkg.price_eur : pkg.price_ron;
};

// Updated addon pricing configuration
export const addonPricing = {
  rushDelivery: { ron: 99, eur: 19 },
  exclusiveMangoDistribution: { ron: 199, eur: 39 },
  customVideo: { ron: 149, eur: 29 },
  audioMessageFromSender: { ron: 99, eur: 19 },
  commercialRightsUpgrade: { ron: 399, eur: 79 },
  extendedSong: { ron: 49, eur: 9 }
};

export const getAddonPrice = (addonKey: string, currency: 'EUR' | 'RON'): number => {
  const pricing = addonPricing[addonKey as keyof typeof addonPricing];
  if (!pricing) return 0;
  return currency === 'EUR' ? pricing.eur : pricing.ron;
};
