
import React, { createContext, useContext, ReactNode } from 'react';
import { useCookieConsent, CookiePreferences } from '@/hooks/useCookieConsent';

interface CookieContextType {
  hasConsented: boolean;
  showBanner: boolean;
  preferences: CookiePreferences;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (prefs: CookiePreferences) => void;
  isCookieAllowed: (type: keyof CookiePreferences) => boolean;
  withdrawConsent: () => void;
  setShowBanner: (show: boolean) => void;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export const CookieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const cookieConsent = useCookieConsent();

  return (
    <CookieContext.Provider value={cookieConsent}>
      {children}
    </CookieContext.Provider>
  );
};

export const useCookieContext = () => {
  const context = useContext(CookieContext);
  if (context === undefined) {
    throw new Error('useCookieContext must be used within a CookieProvider');
  }
  return context;
};
