
import type { Package } from '@/types';

export const getPackagePrice = (pkg: Package, currency: 'EUR' | 'RON'): number => {
  return currency === 'EUR' ? pkg.price_eur : pkg.price_ron;
};
