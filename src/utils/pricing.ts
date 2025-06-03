

import type { Package } from '@/types';

export const getPackagePrice = (pkg: Package, currency: 'EUR' | 'RON'): number => {
  return currency === 'EUR' ? pkg.price_eur : pkg.price_ron;
};

export const getAddonPrice = (addon: any, currency: 'EUR' | 'RON'): number => {
  return currency === 'EUR' ? addon.price_eur : addon.price_ron;
};

