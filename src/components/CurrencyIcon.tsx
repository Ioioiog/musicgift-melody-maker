
import React from 'react';
import { Euro } from 'lucide-react';

interface CurrencyIconProps {
  currency: 'EUR' | 'RON';
  className?: string;
}

const CurrencyIcon: React.FC<CurrencyIconProps> = ({ currency, className }) => {
  if (currency === 'EUR') {
    return <Euro className={className} />;
  }
  
  // RON icon using text
  return (
    <div className={`font-bold text-center flex items-center justify-center ${className}`}>
      RO
    </div>
  );
};

export default CurrencyIcon;
