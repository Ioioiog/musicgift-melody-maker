
import type { Package } from '@/types';
import { formatCurrency, formatAmount, convertAmountForSmartBill, convertCurrency } from './currencyUtils';

export const getPackagePrice = (pkg: Package, currency: 'EUR' | 'RON' | 'USD'): number => {
  // Try to get direct price in requested currency first
  if (currency === 'EUR' && pkg.price_eur) {
    return pkg.price_eur;
  }
  
  if (currency === 'RON' && pkg.price_ron) {
    return pkg.price_ron;
  }
  
  if (currency === 'USD' && pkg.price_usd) {
    return pkg.price_usd;
  }

  // Fallback conversion logic when direct price is not available
  if (currency === 'EUR' && pkg.price_ron) {
    return convertCurrency(pkg.price_ron, 'RON', 'EUR');
  }
  
  if (currency === 'RON' && pkg.price_eur) {
    return convertCurrency(pkg.price_eur, 'EUR', 'RON');
  }

  if (currency === 'USD') {
    // For USD, try EUR first, then RON
    if (pkg.price_eur) {
      return convertCurrency(pkg.price_eur, 'EUR', 'USD');
    } else if (pkg.price_ron) {
      return convertCurrency(pkg.price_ron, 'RON', 'USD');
    }
  }
  
  // Final fallback - return the first available price
  return pkg.price_eur || pkg.price_ron || 0;
};

export const getAddonPrice = (addon: any, currency: 'EUR' | 'RON' | 'USD'): number => {
  // Try to get direct price in requested currency first
  if (currency === 'EUR' && addon.price_eur) {
    return addon.price_eur;
  }
  
  if (currency === 'RON' && addon.price_ron) {
    return addon.price_ron;
  }
  
  if (currency === 'USD' && addon.price_usd) {
    return addon.price_usd;
  }

  // Fallback conversion logic when direct price is not available
  if (currency === 'EUR' && addon.price_ron) {
    return convertCurrency(addon.price_ron, 'RON', 'EUR');
  }
  
  if (currency === 'RON' && addon.price_eur) {
    return convertCurrency(addon.price_eur, 'EUR', 'RON');
  }

  if (currency === 'USD') {
    // For USD, try EUR first, then RON
    if (addon.price_eur) {
      return convertCurrency(addon.price_eur, 'EUR', 'USD');
    } else if (addon.price_ron) {
      return convertCurrency(addon.price_ron, 'RON', 'USD');
    }
  }
  
  // Final fallback - return the first available price
  return addon.price_eur || addon.price_ron || 0;
};

// Export currency formatting functions for convenience
export { formatCurrency, formatAmount, convertAmountForSmartBill };
