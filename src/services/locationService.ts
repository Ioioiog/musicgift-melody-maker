
import type { LocationData } from '@/types/location';

const LOCATION_CACHE_KEY = 'user_location';
const CACHE_EXPIRY_KEY = 'location_cache_expiry';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export class LocationService {
  private static instance: LocationService;
  
  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  async detectLocation(): Promise<LocationData> {
    // Check cache first
    const cachedLocation = this.getCachedLocation();
    if (cachedLocation) {
      return cachedLocation;
    }

    try {
      // Using ipapi.co for IP geolocation
      const response = await fetch('https://ipapi.co/json/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.reason || 'Location detection failed');
      }

      const locationData: LocationData = {
        ip: data.ip || '',
        country: data.country_name || '',
        countryCode: data.country_code || '',
        region: data.region || '',
        city: data.city || '',
        timezone: data.timezone || '',
        currency: data.currency || '',
        latitude: data.latitude,
        longitude: data.longitude,
      };

      // Cache the result
      this.cacheLocation(locationData);
      
      return locationData;
    } catch (error) {
      console.error('Location detection error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to detect location');
    }
  }

  private getCachedLocation(): LocationData | null {
    try {
      const cached = localStorage.getItem(LOCATION_CACHE_KEY);
      const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);
      
      if (!cached || !expiry) {
        return null;
      }

      const expiryTime = parseInt(expiry, 10);
      if (Date.now() > expiryTime) {
        // Cache expired
        localStorage.removeItem(LOCATION_CACHE_KEY);
        localStorage.removeItem(CACHE_EXPIRY_KEY);
        return null;
      }

      return JSON.parse(cached);
    } catch (error) {
      console.error('Error reading location cache:', error);
      return null;
    }
  }

  private cacheLocation(location: LocationData): void {
    try {
      const expiry = Date.now() + CACHE_DURATION;
      localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(location));
      localStorage.setItem(CACHE_EXPIRY_KEY, expiry.toString());
    } catch (error) {
      console.error('Error caching location:', error);
    }
  }

  clearCache(): void {
    localStorage.removeItem(LOCATION_CACHE_KEY);
    localStorage.removeItem(CACHE_EXPIRY_KEY);
  }
}
