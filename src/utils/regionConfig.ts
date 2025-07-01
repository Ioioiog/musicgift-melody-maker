export interface RegionConfig {
  domain: string;
  defaultLanguage: string;
  defaultCurrency: string;
  supportedLanguages: string[];
  supportedCurrencies: string[];
  region: string;
  countryCode: string;
  locale: string;
}

const REGION_CONFIGS: Record<string, RegionConfig> = {
  'musicgift.ro': {
    domain: 'musicgift.ro',
    defaultLanguage: 'ro',
    defaultCurrency: 'RON',
    supportedLanguages: ['ro', 'en', 'de', 'it', 'fr', 'pl'],
    supportedCurrencies: ['RON', 'EUR', 'USD'],
    region: 'RO',
    countryCode: 'RO',
    locale: 'ro-RO'
  },
  'musicgift.eu': {
    domain: 'musicgift.eu',
    defaultLanguage: 'en',
    defaultCurrency: 'EUR',
    supportedLanguages: ['en', 'ro', 'de', 'it', 'fr', 'pl'],
    supportedCurrencies: ['EUR', 'RON', 'USD'],
    region: 'EU',
    countryCode: 'GB', // Default to UK for EU domain
    locale: 'en-GB'
  },
  'musicgift.us': {
    domain: 'musicgift.us',
    defaultLanguage: 'en',
    defaultCurrency: 'USD',
    supportedLanguages: ['en'],
    supportedCurrencies: ['USD', 'EUR', 'RON'],
    region: 'US',
    countryCode: 'US',
    locale: 'en-US'
  }
};

export function getRegionConfig(hostname: string): RegionConfig {
  // Handle localhost development
  if (hostname === 'localhost' || hostname.includes('127.0.0.1') || hostname.includes('lovable.app')) {
    return REGION_CONFIGS['musicgift.eu']; // Default to EU for development
  }
  
  return REGION_CONFIGS[hostname] || REGION_CONFIGS['musicgift.eu'];
}

export function getCurrentRegionConfig(): RegionConfig {
  if (typeof window === 'undefined') {
    return REGION_CONFIGS['musicgift.eu']; // SSR fallback
  }
  
  return getRegionConfig(window.location.hostname);
}

export function getSupportedDomains(): string[] {
  return Object.keys(REGION_CONFIGS);
}

export function getHreflangUrls(currentPath: string = '/'): Record<string, string> {
  const urls: Record<string, string> = {};
  
  Object.entries(REGION_CONFIGS).forEach(([domain, config]) => {
    urls[config.defaultLanguage === 'ro' ? 'ro' : config.region === 'US' ? 'en-us' : 'en'] = 
      `https://${domain}${currentPath}`;
  });
  
  urls['x-default'] = `https://musicgift.eu${currentPath}`;
  
  return urls;
}
