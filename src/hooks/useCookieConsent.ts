
import { useState, useEffect, useCallback } from 'react';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

interface CookieConsentData {
  hasConsented: boolean;
  preferences: CookiePreferences;
  timestamp: number;
  version: string;
}

const COOKIE_CONSENT_KEY = 'musicgift_cookie_consent';
const CONSENT_VERSION = '1.0';
const CONSENT_EXPIRY_DAYS = 365;

export const useCookieConsent = () => {
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  // Load consent data from localStorage
  useEffect(() => {
    const loadConsentData = () => {
      try {
        const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (stored) {
          const data: CookieConsentData = JSON.parse(stored);
          
          // Check if consent is still valid (not expired and same version)
          const isExpired = Date.now() - data.timestamp > CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
          const isOldVersion = data.version !== CONSENT_VERSION;
          
          if (!isExpired && !isOldVersion) {
            setHasConsented(data.hasConsented);
            setPreferences(data.preferences);
            setShowBanner(false);
            return;
          }
        }
        
        // No valid consent found, show banner
        setShowBanner(true);
      } catch (error) {
        console.error('Error loading cookie consent:', error);
        setShowBanner(true);
      }
    };

    loadConsentData();
  }, []);

  // Save consent data to localStorage
  const saveConsentData = useCallback((consented: boolean, prefs: CookiePreferences) => {
    try {
      const data: CookieConsentData = {
        hasConsented: consented,
        preferences: prefs,
        timestamp: Date.now(),
        version: CONSENT_VERSION,
      };
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving cookie consent:', error);
    }
  }, []);

  // Accept all cookies
  const acceptAll = useCallback(() => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setPreferences(allAccepted);
    setHasConsented(true);
    setShowBanner(false);
    saveConsentData(true, allAccepted);
  }, [saveConsentData]);

  // Reject all non-essential cookies
  const rejectAll = useCallback(() => {
    const essentialOnly: CookiePreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    setPreferences(essentialOnly);
    setHasConsented(true);
    setShowBanner(false);
    saveConsentData(true, essentialOnly);
  }, [saveConsentData]);

  // Save custom preferences
  const savePreferences = useCallback((customPrefs: CookiePreferences) => {
    setPreferences(customPrefs);
    setHasConsented(true);
    setShowBanner(false);
    saveConsentData(true, customPrefs);
  }, [saveConsentData]);

  // Check if a specific cookie type is allowed
  const isCookieAllowed = useCallback((type: keyof CookiePreferences) => {
    return hasConsented && preferences[type];
  }, [hasConsented, preferences]);

  // Withdraw consent (show banner again)
  const withdrawConsent = useCallback(() => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    setHasConsented(false);
    setShowBanner(true);
    setPreferences({
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false,
    });
  }, []);

  return {
    hasConsented,
    showBanner,
    preferences,
    acceptAll,
    rejectAll,
    savePreferences,
    isCookieAllowed,
    withdrawConsent,
    setShowBanner,
  };
};
