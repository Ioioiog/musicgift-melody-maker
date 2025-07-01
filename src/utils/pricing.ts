
import type { Package } from '@/types';
import { formatCurrency, formatAmount, convertAmountForSmartBill, convertCurrency } from './currencyUtils';

export const getPackagePrice = (pkg: Package, currency: 'EUR' | 'RON' | 'USD'): number => {
  const basePrice = currency === 'EUR' ? pkg.price_eur : 
                   currency === 'RON' ? pkg.price_ron :
                   pkg.price_usd || 0; // USD support with fallback

  // If the package doesn't have a price in the requested currency, convert it
  if (currency === 'EUR' && (!pkg.price_eur || pkg.price_eur === 0) && pkg.price_ron) {
    return convertCurrency(pkg.price_ron, 'RON', 'EUR');
  }
  
  if (currency === 'RON' && (!pkg.price_ron || pkg.price_ron === 0) && pkg.price_eur) {
    return convertCurrency(pkg.price_eur, 'EUR', 'RON');
  }

  if (currency === 'USD' && (!pkg.price_usd || pkg.price_usd === 0)) {
    // Fallback to EUR first, then RON
    if (pkg.price_eur) {
      return convertCurrency(pkg.price_eur, 'EUR', 'USD');
    } else if (pkg.price_ron) {
      return convertCurrency(pkg.price_ron, 'RON', 'USD');
    }
  }
  
  return basePrice;
};

export const getAddonPrice = (addon: any, currency: 'EUR' | 'RON' | 'USD'): number => {
  const basePrice = currency === 'EUR' ? addon.price_eur : 
                   currency === 'RON' ? addon.price_ron :
                   addon.price_usd || 0; // USD support with fallback

  // If the addon doesn't have a price in the requested currency, convert it
  if (currency === 'EUR' && (!addon.price_eur || addon.price_eur === 0) && addon.price_ron) {
    return convertCurrency(addon.price_ron, 'RON', 'EUR');
  }
  
  if (currency === 'RON' && (!addon.price_ron || addon.price_ron === 0) && addon.price_eur) {
    return convertCurrency(addon.price_eur, 'EUR', 'RON');
  }

  if (currency === 'USD' && (!addon.price_usd || addon.price_usd === 0)) {
    // Fallback to EUR first, then RON
    if (addon.price_eur) {
      return convertCurrency(addon.price_eur, 'EUR', 'USD');
    } else if (addon.price_ron) {
      return convertCurrency(addon.price_ron, 'RON', 'USD');
    }
  }
  
  return basePrice;
};

// Export currency formatting functions for convenience
export { formatCurrency, formatAmount, convertAmountForSmartBill };
