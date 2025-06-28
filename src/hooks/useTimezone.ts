
import { useState, useEffect } from 'react';
import { useLocationContext } from '@/contexts/LocationContext';

export const useTimezone = () => {
  const { location } = useLocationContext();
  const [localTime, setLocalTime] = useState<Date>(new Date());
  const [timezone, setTimezone] = useState<string>('');

  useEffect(() => {
    // Set timezone from location or browser default
    const tz = location?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(tz);

    // Update local time every second
    const interval = setInterval(() => {
      setLocalTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [location]);

  const formatLocalTime = (format: 'short' | 'long' | 'time' | 'date' = 'short'): string => {
    if (!timezone) return localTime.toLocaleString();

    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      ...(format === 'short' && {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      ...(format === 'long' && {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      ...(format === 'time' && {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      ...(format === 'date' && {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };

    return localTime.toLocaleString('en-US', options);
  };

  const getTimezoneName = (): string => {
    if (!timezone) return '';
    
    try {
      const formatter = new Intl.DateTimeFormat('en', {
        timeZone: timezone,
        timeZoneName: 'long'
      });
      const parts = formatter.formatToParts(new Date());
      const timeZonePart = parts.find(part => part.type === 'timeZoneName');
      return timeZonePart?.value || timezone;
    } catch {
      return timezone;
    }
  };

  const isBusinessHours = (startHour = 9, endHour = 17): boolean => {
    if (!timezone) return true;

    try {
      const localHour = parseInt(formatLocalTime('time').split(':')[0]);
      return localHour >= startHour && localHour < endHour;
    } catch {
      return true;
    }
  };

  return {
    timezone,
    localTime,
    formatLocalTime,
    getTimezoneName,
    isBusinessHours,
  };
};
