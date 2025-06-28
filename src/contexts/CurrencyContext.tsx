
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocationContext } from '@/contexts/LocationContext';

type Currency = 'EUR' | 'RON';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  suggestedCurrency: Currency | null;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('currency');
    return (saved as Currency) || 'EUR';
  });
  const [suggestedCurrency, setSuggestedCurrency] = useState<Currency | null>(null);
  const { location } = useLocationContext();

  // Auto-suggest currency based on location
  useEffect(() => {
    if (location && location.countryCode) {
      let suggested: Currency;
      
      // Map country codes to currencies
      if (location.countryCode === 'RO') {
        suggested = 'RON';
      } else {
        // Default to EUR for European countries and others
        suggested = 'EUR';
      }
      
      setSuggestedCurrency(suggested);
      
      // Only auto-set if user hasn't manually selected a currency
      const hasManualSelection = localStorage.getItem('currency_manual_selection');
      if (!hasManualSelection && suggested !== currency) {
        setCurrency(suggested);
      }
    }
  }, [location, currency]);

  const handleSetCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    localStorage.setItem('currency_manual_selection', 'true');
  };

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency, suggestedCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
