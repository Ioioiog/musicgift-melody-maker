
import type { LocationData } from '@/types/location';
import { LocationCache } from './locationCache';
import { fetchFromIpapi } from './providers/ipapiProvider';
import { fetchFromIpApiCom } from './providers/ipApiComProvider';
// Note: ipGeolocation requires API key, commented out for now
// import { fetchFromIpGeolocation } from './providers/ipGeolocationProvider';

type LocationProviderFn = () => Promise<LocationData>;

export class LocationService {
  private static instance: LocationService;
  private providers: LocationProviderFn[] = [
    fetchFromIpapi,
    fetchFromIpApiCom,
    // fetchFromIpGeolocation, // Requires API key
  ];
  
  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  async detectLocation(): Promise<LocationData> {
    // Check cache first
    const cachedLocation = LocationCache.get();
    if (cachedLocation) {
      return cachedLocation;
    }

    let lastError: Error | null = null;

    // Try each provider in order of priority
    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[i];
      const providerName = provider.name || `Provider ${i + 1}`;

      try {
        console.log(`LocationService: Trying ${providerName}...`);
        const locationData = await this.retryWithBackoff(provider, 2);
        
        // Cache successful result
        LocationCache.set(locationData, providerName);
        
        console.log(`LocationService: Successfully detected location using ${providerName}`);
        return locationData;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(`Provider ${providerName} failed`);
        console.warn(`LocationService: ${providerName} failed:`, lastError.message);
        
        // Continue to next provider
        continue;
      }
    }

    // If all providers failed, try browser geolocation as final fallback
    try {
      console.log('LocationService: Trying browser geolocation as fallback...');
      const browserLocation = await this.getBrowserLocation();
      LocationCache.set(browserLocation, 'browser');
      return browserLocation;
    } catch (browserError) {
      console.warn('LocationService: Browser geolocation failed:', browserError);
    }

    // All methods failed
    const error = lastError || new Error('All location detection methods failed');
    console.error('LocationService: Complete failure:', error);
    throw error;
  }

  private async retryWithBackoff(fn: LocationProviderFn, retries: number): Promise<LocationData> {
    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt === retries) {
          throw lastError;
        }

        // Exponential backoff: 1s, 2s, 4s...
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`LocationService: Retry attempt ${attempt + 1} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  private async getBrowserLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Use reverse geocoding to get location details
            // For now, return basic location data
            const basicLocation: LocationData = {
              ip: 'unknown',
              country: 'Unknown',
              countryCode: 'XX',
              region: 'Unknown Region',
              city: 'Unknown City',
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              currency: 'EUR', // Default fallback
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracyRadius: position.coords.accuracy,
            };
            resolve(basicLocation);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          timeout: 10000,
          enableHighAccuracy: false,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  clearCache(): void {
    LocationCache.clear();
  }

  clearExpiredCache(): void {
    LocationCache.clearExpired();
  }
}
