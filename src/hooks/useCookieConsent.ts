
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
      console.log('🍪 Loading cookie consent data...');
      
      try {
        const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
        console.log('🍪 Stored consent data:', stored);
        
        if (stored) {
          const data: CookieConsentData = JSON.parse(stored);
          console.log('🍪 Parsed consent data:', data);
          
          // Check if consent is still valid (not expired and same version)
          const isExpired = Date.now() - data.timestamp > CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
          const isOldVersion = data.version !== CONSENT_VERSION;
          
          console.log('🍪 Consent validation:', {
            isExpired,
            isOldVersion,
            timestamp: data.timestamp,
            currentTime: Date.now(),
            version: data.version,
            currentVersion: CONSENT_VERSION
          });
          
          if (!isExpired && !isOldVersion) {
            console.log('🍪 Valid consent found, setting state');
            setHasConsented(data.hasConsented);
            setPreferences(data.preferences);
            setShowBanner(false);
            return;
          } else {
            console.log('🍪 Consent expired or old version, removing stored data');
            localStorage.removeItem(COOKIE_CONSENT_KEY);
          }
        }
        
        // No valid consent found, show banner
        console.log('🍪 No valid consent found - showing banner');
        setHasConsented(false);
        setShowBanner(true);
        
      } catch (error) {
        console.error('🍪 Error loading cookie consent:', error);
        console.log('🍪 Error occurred - showing banner as fallback');
        setHasConsented(false);
        setShowBanner(true);
      }
    };

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(loadConsentData, 100);
    
    return () => clearTimeout(timer);
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
      
      console.log('🍪 Saving consent data:', data);
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(data));
      console.log('🍪 Consent data saved successfully');
    } catch (error) {
      console.error('🍪 Error saving cookie consent:', error);
    }
  }, []);

  // Accept all cookies
  const acceptAll = useCallback(() => {
    console.log('🍪 Accept all cookies triggered');
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
    console.log('🍪 All cookies accepted and banner hidden');
  }, [saveConsentData]);

  // Reject all non-essential cookies
  const rejectAll = useCallback(() => {
    console.log('🍪 Reject all cookies triggered');
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
    console.log('🍪 All non-essential cookies rejected and banner hidden');
  }, [saveConsentData]);

  // Save custom preferences
  const savePreferences = useCallback((customPrefs: CookiePreferences) => {
    console.log('🍪 Save custom preferences triggered:', customPrefs);
    setPreferences(customPrefs);
    setHasConsented(true);
    setShowBanner(false);
    saveConsentData(true, customPrefs);
    console.log('🍪 Custom preferences saved and banner hidden');
  }, [saveConsentData]);

  // Check if a specific cookie type is allowed
  const isCookieAllowed = useCallback((type: keyof CookiePreferences) => {
    const allowed = hasConsented && preferences[type];
    console.log(`🍪 Cookie check for ${type}:`, { hasConsented, preference: preferences[type], allowed });
    return allowed;
  }, [hasConsented, preferences]);

  // Withdraw consent (show banner again)
  const withdrawConsent = useCallback(() => {
    console.log('🍪 Withdraw consent triggered');
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    setHasConsented(false);
    setShowBanner(true);
    setPreferences({
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false,
    });
    console.log('🍪 Consent withdrawn and banner shown');
  }, []);

  // Enhanced setShowBanner with logging
  const setShowBannerWithLogging = useCallback((show: boolean) => {
    console.log(`🍪 Setting banner visibility to: ${show}`);
    setShowBanner(show);
  }, []);

  // Debug logging for state changes
  useEffect(() => {
    console.log('🍪 Cookie consent state changed:', {
      hasConsented,
      showBanner,
      preferences
    });
  }, [hasConsented, showBanner, preferences]);

  return {
    hasConsented,
    showBanner,
    preferences,
    acceptAll,
    rejectAll,
    savePreferences,
    isCookieAllowed,
    withdrawConsent,
    setShowBanner: setShowBannerWithLogging,
  };
};
