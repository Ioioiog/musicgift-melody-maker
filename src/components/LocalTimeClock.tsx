
import React from 'react';
import { useTimezone } from '@/hooks/useTimezone';
import { useLocationContext } from '@/contexts/LocationContext';
import { Clock } from 'lucide-react';

interface LocalTimeClockProps {
  className?: string;
  showIcon?: boolean;
  showTimezone?: boolean;
  format?: 'short' | 'long' | 'time' | 'date';
}

const LocalTimeClock: React.FC<LocalTimeClockProps> = ({
  className = '',
  showIcon = true,
  showTimezone = true,
  format = 'time'
}) => {
  // Get location data safely
  const { location } = useLocationContext();
  
  // Use timezone hook with location data
  const { formatLocalTime, getTimezoneName, timezone } = useTimezone({ location });

  if (!timezone) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && <Clock className="w-4 h-4 text-green-500" />}
      <div className="text-sm">
        <span className="font-mono text-gray-700">
          {formatLocalTime(format)}
        </span>
        {showTimezone && (
          <span className="text-xs text-gray-500 ml-2">
            ({getTimezoneName()})
          </span>
        )}
      </div>
    </div>
  );
};

export default LocalTimeClock;
