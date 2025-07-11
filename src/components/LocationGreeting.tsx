
import React from 'react';
import { MapPin } from 'lucide-react';

interface LocationGreetingProps {
  className?: string;
  showIcon?: boolean;
  format?: 'short' | 'long';
}

const LocationGreeting: React.FC<LocationGreetingProps> = ({ 
  className = '', 
  showIcon = true, 
  format = 'short' 
}) => {
  try {
    // Safely import and use location context
    const { useLocationContext } = require('@/contexts/LocationContext');
    const { useLanguage } = require('@/contexts/LanguageContext');
    
    const { location } = useLocationContext();
    const { t } = useLanguage();

    if (!location) return null;

    const getGreeting = (): string => {
      const { city, country, countryCode } = location;
      
      // Custom greetings based on language/country
      const greetings: Record<string, string> = {
        'RO': format === 'long' 
          ? `Bună ziua din ${city}, ${country}!`
          : `Salut din ${city}!`,
        'FR': format === 'long'
          ? `Bonjour de ${city}, ${country}!`
          : `Salut de ${city}!`,
        'DE': format === 'long'
          ? `Hallo aus ${city}, ${country}!`
          : `Hallo aus ${city}!`,
        'PL': format === 'long'
          ? `Cześć z ${city}, ${country}!`
          : `Cześć z ${city}!`,
        'default': format === 'long'
          ? `Hello from ${city}, ${country}!`
          : `Hello from ${city}!`
      };

      return greetings[countryCode] || greetings.default;
    };

    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {showIcon && <MapPin className="w-4 h-4 text-blue-500" />}
        <span className="text-sm text-gray-600">
          {getGreeting()}
        </span>
      </div>
    );
  } catch (error) {
    console.error('LocationGreeting: Error accessing context:', error);
    // Return null or a fallback greeting when contexts are not available
    return null;
  }
};

export default LocationGreeting;
