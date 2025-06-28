
import type { LocationData } from '@/types/location';

/**
 * Utility functions for location-based features
 */

export const getDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

export const isEuropeanCountry = (countryCode: string): boolean => {
  const europeanCountries = [
    'AD', 'AL', 'AT', 'BA', 'BE', 'BG', 'BY', 'CH', 'CY', 'CZ', 'DE', 'DK',
    'EE', 'ES', 'FI', 'FR', 'GB', 'GE', 'GR', 'HR', 'HU', 'IE', 'IS', 'IT',
    'LI', 'LT', 'LU', 'LV', 'MC', 'MD', 'ME', 'MK', 'MT', 'NL', 'NO', 'PL',
    'PT', 'RO', 'RS', 'RU', 'SE', 'SI', 'SK', 'SM', 'UA', 'VA'
  ];
  return europeanCountries.includes(countryCode);
};

export const getRegionalCurrency = (countryCode: string): 'EUR' | 'RON' | 'USD' => {
  const currencyMap: Record<string, 'EUR' | 'RON' | 'USD'> = {
    'RO': 'RON',
    'US': 'USD',
    'CA': 'USD',
    // EU countries using EUR
    'AT': 'EUR', 'BE': 'EUR', 'CY': 'EUR', 'EE': 'EUR', 'FI': 'EUR',
    'FR': 'EUR', 'DE': 'EUR', 'GR': 'EUR', 'IE': 'EUR', 'IT': 'EUR',
    'LV': 'EUR', 'LT': 'EUR', 'LU': 'EUR', 'MT': 'EUR', 'NL': 'EUR',
    'PT': 'EUR', 'SK': 'EUR', 'SI': 'EUR', 'ES': 'EUR',
  };

  return currencyMap[countryCode] || 'EUR';
};

export const getRegionalLanguage = (countryCode: string): string => {
  const languageMap: Record<string, string> = {
    'RO': 'ro',
    'US': 'en', 'GB': 'en', 'CA': 'en', 'AU': 'en',
    'FR': 'fr',
    'DE': 'de',
    'PL': 'pl',
    'IT': 'it',
  };

  return languageMap[countryCode] || 'en';
};

export const formatLocationString = (location: LocationData, format: 'short' | 'medium' | 'long' = 'medium'): string => {
  const { city, region, country, postalCode } = location;

  switch (format) {
    case 'short':
      return city || country;
    case 'long':
      return [city, region, postalCode, country].filter(Boolean).join(', ');
    case 'medium':
    default:
      return [city, country].filter(Boolean).join(', ');
  }
};

export const getLocationAccuracy = (location: LocationData): 'high' | 'medium' | 'low' => {
  if (location.accuracyRadius) {
    if (location.accuracyRadius < 1000) return 'high';
    if (location.accuracyRadius < 10000) return 'medium';
    return 'low';
  }

  // Fallback based on available data
  if (location.postalCode && location.city) return 'high';
  if (location.city) return 'medium';
  return 'low';
};

export const shouldSuggestLocationBasedSettings = (location: LocationData): boolean => {
  // Only suggest if we have good accuracy and city-level data
  const accuracy = getLocationAccuracy(location);
  return accuracy !== 'low' && !!location.city && !!location.countryCode;
};
