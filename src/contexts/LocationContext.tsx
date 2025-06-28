
import React, { createContext, useContext, useState, useEffect } from 'react';
import { LocationService } from '@/services/locationService';
import { useCookieContext } from '@/contexts/CookieContext';
import type { LocationData, LocationContextType } from '@/types/location';

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isCookieAllowed } = useCookieContext();

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

  // Calculate timezone and localTime from location
  const timezone = location?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [localTime, setLocalTime] = useState<Date>(new Date());

  useEffect(() => {
    // Update local time every second
    const interval = setInterval(() => {
      setLocalTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const contextValue: LocationContextType = {
    location,
    loading,
    error,
    refreshLocation,
    timezone,
    localTime,
  };

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};
