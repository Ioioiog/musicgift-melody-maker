
import type { LocationData, LocationProvider } from '@/types/location';

export const ipGeolocationProvider: LocationProvider = {
  name: 'ipgeolocation.io',
  url: 'https://api.ipgeolocation.io/ipgeo',
  priority: 3,
  rateLimit: {
    requests: 1000,
    period: 'month'
  },
  transform: (data: any): LocationData => ({
    ip: data.ip || '',
    country: data.country_name || '',
    countryCode: data.country_code2 || '',
    region: data.state_prov || '',
    city: data.city || '',
    timezone: data.time_zone?.name || '',
    currency: data.currency?.code || '',
    latitude: parseFloat(data.latitude) || undefined,
    longitude: parseFloat(data.longitude) || undefined,
    postalCode: data.zipcode,
    utcOffset: data.time_zone?.offset,
    isp: data.isp,
    // ipgeolocation.io doesn't provide accuracyRadius or languages in free tier
  })
};

export const fetchFromIpGeolocation = async (): Promise<LocationData> => {
  // Note: This would require an API key for production use
  const response = await fetch(`${ipGeolocationProvider.url}?apiKey=YOUR_API_KEY`);

  if (!response.ok) {
    throw new Error(`ipgeolocation.io error: ${response.status}`);
  }

  const data = await response.json();

  if (data.message) {
    throw new Error(data.message);
  }

  return ipGeolocationProvider.transform(data);
};
