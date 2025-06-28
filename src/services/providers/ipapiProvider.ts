
import type { LocationData, LocationProvider } from '@/types/location';

export const ipapiProvider: LocationProvider = {
  name: 'ipapi.co',
  url: 'https://ipapi.co/json/',
  priority: 1,
  rateLimit: {
    requests: 1000,
    period: 'day'
  },
  transform: (data: any): LocationData => ({
    ip: data.ip || '',
    country: data.country_name || '',
    countryCode: data.country_code || '',
    region: data.region || '',
    city: data.city || '',
    timezone: data.timezone || '',
    currency: data.currency || '',
    latitude: data.latitude,
    longitude: data.longitude,
    postalCode: data.postal,
    utcOffset: data.utc_offset,
    isp: data.org,
    accuracyRadius: data.accuracy,
    languages: data.languages ? data.languages.split(',') : undefined,
  })
};

export const fetchFromIpapi = async (): Promise<LocationData> => {
  const response = await fetch(ipapiProvider.url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`ipapi.co error: ${response.status}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.reason || 'ipapi.co detection failed');
  }

  return ipapiProvider.transform(data);
};
