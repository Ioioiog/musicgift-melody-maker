
interface CacheEntry {
  data: any;
  timestamp: number;
  provider: string;
}

interface CacheOptions {
  ttl: number; // Time to live in milliseconds
  degradedTtl: number; // Extended TTL for degraded data
}

const DEFAULT_CACHE_OPTIONS: CacheOptions = {
  ttl: 24 * 60 * 60 * 1000, // 24 hours
  degradedTtl: 7 * 24 * 60 * 60 * 1000, // 7 days for basic location data
};

export class LocationCache {
  private static readonly CACHE_KEY = 'user_location';
  private static readonly CACHE_EXPIRY_KEY = 'location_cache_expiry';
  private static readonly DEGRADED_CACHE_KEY = 'user_location_degraded';
  private static readonly SESSION_CACHE_KEY = 'session_location_cache';

  private static sessionCache = new Map<string, CacheEntry>();

  static get(options: Partial<CacheOptions> = {}): any | null {
    const opts = { ...DEFAULT_CACHE_OPTIONS, ...options };

    // Check session cache first (fastest)
    const sessionEntry = this.sessionCache.get(this.SESSION_CACHE_KEY);
    if (sessionEntry && Date.now() - sessionEntry.timestamp < opts.ttl) {
      console.log('LocationCache: Hit from session cache');
      return sessionEntry.data;
    }

    // Check localStorage cache
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      const expiry = localStorage.getItem(this.CACHE_EXPIRY_KEY);
      
      if (cached && expiry) {
        const expiryTime = parseInt(expiry, 10);
        if (Date.now() < expiryTime) {
          console.log('LocationCache: Hit from localStorage');
          const data = JSON.parse(cached);
          // Update session cache
          this.sessionCache.set(this.SESSION_CACHE_KEY, {
            data,
            timestamp: Date.now(),
            provider: 'cache'
          });
          return data;
        }
      }

      // Check degraded cache as fallback
      const degradedCache = localStorage.getItem(this.DEGRADED_CACHE_KEY);
      if (degradedCache) {
        const degradedData = JSON.parse(degradedCache);
        const degradedExpiry = degradedData.timestamp + opts.degradedTtl;
        if (Date.now() < degradedExpiry) {
          console.log('LocationCache: Hit from degraded cache');
          return degradedData.data;
        }
      }
    } catch (error) {
      console.error('LocationCache: Error reading cache:', error);
    }

    return null;
  }

  static set(data: any, provider: string, options: Partial<CacheOptions> = {}): void {
    const opts = { ...DEFAULT_CACHE_OPTIONS, ...options };

    try {
      const expiry = Date.now() + opts.ttl;
      const entry: CacheEntry = {
        data,
        timestamp: Date.now(),
        provider
      };

      // Set main cache
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(this.CACHE_EXPIRY_KEY, expiry.toString());

      // Set session cache
      this.sessionCache.set(this.SESSION_CACHE_KEY, entry);

      // Set degraded cache (basic location data for extended period)
      const degradedData = {
        ip: data.ip,
        country: data.country,
        countryCode: data.countryCode,
        currency: data.currency,
        timezone: data.timezone
      };
      localStorage.setItem(this.DEGRADED_CACHE_KEY, JSON.stringify({
        data: degradedData,
        timestamp: Date.now(),
        provider
      }));

      console.log(`LocationCache: Cached data from ${provider}`);
    } catch (error) {
      console.error('LocationCache: Error setting cache:', error);
    }
  }

  static clear(): void {
    try {
      localStorage.removeItem(this.CACHE_KEY);
      localStorage.removeItem(this.CACHE_EXPIRY_KEY);
      localStorage.removeItem(this.DEGRADED_CACHE_KEY);
      this.sessionCache.clear();
      console.log('LocationCache: Cache cleared');
    } catch (error) {
      console.error('LocationCache: Error clearing cache:', error);
    }
  }

  static clearExpired(): void {
    try {
      const expiry = localStorage.getItem(this.CACHE_EXPIRY_KEY);
      if (expiry && Date.now() > parseInt(expiry, 10)) {
        localStorage.removeItem(this.CACHE_KEY);
        localStorage.removeItem(this.CACHE_EXPIRY_KEY);
        console.log('LocationCache: Expired cache cleared');
      }

      // Clear expired session cache
      const sessionEntry = this.sessionCache.get(this.SESSION_CACHE_KEY);
      if (sessionEntry && Date.now() - sessionEntry.timestamp > DEFAULT_CACHE_OPTIONS.ttl) {
        this.sessionCache.delete(this.SESSION_CACHE_KEY);
      }
    } catch (error) {
      console.error('LocationCache: Error clearing expired cache:', error);
    }
  }
}
