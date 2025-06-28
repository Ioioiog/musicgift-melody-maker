
/**
 * Timezone utility functions for enhanced location features
 */

export const convertToTimezone = (date: Date, timezone: string): Date => {
  try {
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    return new Date(utc + getTimezoneOffset(timezone));
  } catch {
    return date;
  }
};

export const getTimezoneOffset = (timezone: string): number => {
  try {
    const now = new Date();
    const utc = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const target = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    return target.getTime() - utc.getTime();
  } catch {
    return 0;
  }
};

export const formatBusinessHours = (
  timezone: string, 
  startHour: number = 9, 
  endHour: number = 17
): string => {
  try {
    const start = new Date();
    start.setHours(startHour, 0, 0, 0);
    const end = new Date();
    end.setHours(endHour, 0, 0, 0);

    const formatTime = (date: Date) => 
      date.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

    return `${formatTime(start)} - ${formatTime(end)}`;
  } catch {
    return `${startHour}:00 AM - ${endHour}:00 PM`;
  }
};

export const isWithinBusinessHours = (
  timezone: string,
  startHour: number = 9,
  endHour: number = 17,
  workDays: number[] = [1, 2, 3, 4, 5] // Mon-Fri
): boolean => {
  try {
    const now = new Date();
    const localTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const hour = localTime.getHours();
    const day = localTime.getDay();

    return workDays.includes(day) && hour >= startHour && hour < endHour;
  } catch {
    return true; // Default to true if timezone conversion fails
  }
};

export const getNextBusinessDay = (timezone: string): Date => {
  try {
    const now = new Date();
    const localTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    
    let nextDay = new Date(localTime);
    nextDay.setDate(nextDay.getDate() + 1);
    
    // Skip weekends
    while (nextDay.getDay() === 0 || nextDay.getDay() === 6) {
      nextDay.setDate(nextDay.getDate() + 1);
    }
    
    return nextDay;
  } catch {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }
};
