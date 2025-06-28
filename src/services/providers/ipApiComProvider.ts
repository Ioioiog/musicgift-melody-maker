
import type { LocationData, LocationProvider } from '@/types/location';

export const ipApiComProvider: LocationProvider = {
  name: 'ip-api.com',
  url: 'http://ip-api.com/json/',
  priority: 2,
  rateLimit: {
    requests: 1000,
    period: 'hour'
  },
  transform: (data: any): LocationData => ({
    ip: data.query || '',
    country: data.country || '',
    countryCode: data.countryCode || '',
    region: data.regionName || '',
    city: data.city || '',
    timezone: data.timezone || '',
    currency: data.currency || '',
    latitude: data.lat,
    longitude: data.lon,
    postalCode: data.zip,
    isp: data.isp,
    // ip-api.com doesn't provide utcOffset, accuracyRadius, or languages
  })
};

export const fetchFromIpApiCom = async (): Promise<LocationData> => {
  const response = await fetch(ipApiComProvider.url);

  if (!response.ok) {
    throw new Error(`ip-api.com error: ${response.status}`);
  }

  const data = await response.json();

  if (data.status === 'fail') {
    throw new Error(data.message || 'ip-api.com detection failed');
  }

  return ipApiComProvider.transform(data);
};
