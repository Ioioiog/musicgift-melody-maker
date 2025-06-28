
import { useState, useEffect } from 'react';
import { LocationService } from '@/services/locationService';
import { useCookieContext } from '@/contexts/CookieContext';
import { useTimezone } from '@/hooks/useTimezone';
import type { LocationData } from '@/types/location';

export const useLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isCookieAllowed } = useCookieContext();
  const { timezone, localTime } = useTimezone();

  const detectLocation = async () => {
    // Only detect location if user has consented to analytics cookies
    if (!isCookieAllowed('analytics')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const locationService = LocationService.getInstance();
      
      // Clear expired cache before detection
      locationService.clearExpiredCache();
      
      const locationData = await locationService.detectLocation();
      setLocation(locationData);
      
      console.log('Location detected:', {
        city: locationData.city,
        country: locationData.country,
        timezone: locationData.timezone,
        provider: 'enhanced'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to detect location';
      setError(errorMessage);
      console.error('Enhanced location detection failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshLocation = async () => {
    const locationService = LocationService.getInstance();
    locationService.clearCache();
    await detectLocation();
  };

  useEffect(() => {
    detectLocation();
  }, [isCookieAllowed('analytics')]);

  return {
    location,
    loading,
    error,
    refreshLocation,
    timezone,
    localTime,
  };
};
