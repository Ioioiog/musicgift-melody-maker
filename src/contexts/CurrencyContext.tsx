
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRegionConfig } from '@/hooks/useRegionConfig';

type Currency = 'EUR' | 'RON' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  suggestedCurrency: Currency | null;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('EUR'); // Default fallback
  const [suggestedCurrency, setSuggestedCurrency] = useState<Currency | null>(null);
  const { regionConfig, isLoading } = useRegionConfig();

  useEffect(() => {
    if (isLoading || !regionConfig) return;

    try {
      const saved = localStorage.getItem('currency') as Currency;
      const hasManualSelection = localStorage.getItem('currency_manual_selection');
      
      let initialCurrency = regionConfig.defaultCurrency as Currency;
      
      // If user has manually selected a currency and it's supported by current domain
      if (hasManualSelection && saved && regionConfig.supportedCurrencies.includes(saved)) {
        initialCurrency = saved;
      } else if (!hasManualSelection) {
        // Auto-suggest currency based on location if no manual selection
        const getLocationData = () => {
          try {
            const { useLocationContext } = require('@/contexts/LocationContext');
            const { location } = useLocationContext();
            return location;
          } catch {
            return null;
          }
        };

        const location = getLocationData();
        
        if (location && location.countryCode) {
          let suggested: Currency;
          
          if (location.countryCode === 'RO') {
            suggested = 'RON';
          } else if (location.countryCode === 'US') {
            suggested = 'USD';
          } else {
            suggested = 'EUR';
          }
          
          // Only use suggestion if it's supported by the current domain
          if (regionConfig.supportedCurrencies.includes(suggested)) {
            initialCurrency = suggested;
            setSuggestedCurrency(suggested);
          }
        }
      }
      
      // Ensure the selected currency is supported by the current domain
      if (!regionConfig.supportedCurrencies.includes(initialCurrency)) {
        initialCurrency = regionConfig.defaultCurrency as Currency;
      }
      
      setCurrency(initialCurrency);
    } catch (error) {
      console.error('CurrencyProvider: Error during initialization:', error);
      setCurrency(regionConfig.defaultCurrency as Currency);
    }
  }, [regionConfig, isLoading]);

  const handleSetCurrency = (newCurrency: Currency) => {
    if (!regionConfig || !regionConfig.supportedCurrencies.includes(newCurrency)) {
      console.warn('Currency not supported by current domain:', newCurrency);
      return;
    }
    
    setCurrency(newCurrency);
    localStorage.setItem('currency_manual_selection', 'true');
  };

  useEffect(() => {
    try {
      localStorage.setItem('currency', currency);
    } catch (error) {
      console.error('CurrencyProvider: Error saving currency to localStorage:', error);
    }
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      setCurrency: handleSetCurrency, 
      suggestedCurrency 
    }}>
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
