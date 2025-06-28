
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocationContext } from '@/contexts/LocationContext';
import { useLocalization } from '@/contexts/OptimizedLocalizationContext';
import { useCookieContext } from '@/contexts/CookieContext';

const WelcomeBanner: React.FC = () => {
  const { location, loading } = useLocationContext();
  const { t, language } = useLocalization();
  const { isCookieAllowed } = useCookieContext();
  const [isVisible, setIsVisible] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // Only show banner if analytics cookies are allowed
    if (!isCookieAllowed('analytics')) {
      return;
    }

    // Check if this is first visit
    const hasVisited = localStorage.getItem('musicgift_first_visit');
    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem('musicgift_first_visit', 'true');
    }
  }, [isCookieAllowed]);

  useEffect(() => {
    // Show banner when location is loaded and it's first visit
    if (isFirstVisit && location && !loading) {
      setIsVisible(true);
      
      // Auto-dismiss after 10 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [isFirstVisit, location, loading]);

  const getWelcomeMessage = (): string => {
    if (!location) return t('welcomeDefault', 'Welcome to MusicGift!');

    const { city, country, countryCode } = location;
    
    // Custom messages based on country/language
    const welcomeKey = `welcomeFrom${countryCode}`;
    const fallbackKey = 'welcomeFromCity';
    
    // Try country-specific message first, then fallback
    const countryMessage = t(welcomeKey, '');
    if (countryMessage) {
      return countryMessage.replace('{city}', city).replace('{country}', country);
    }
    
    // Fallback to generic city message
    return t(fallbackKey, 'Welcome to MusicGift from {city}!').replace('{city}', city);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isFirstVisit || loading) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg"
        >
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-full p-2">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm md:text-base">
                    {getWelcomeMessage()}
                  </p>
                  <p className="text-xs text-white/80">
                    {t('welcomeSubtitle', 'Create personalized musical gifts that touch hearts')}
                  </p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="text-white hover:bg-white/20 h-8 w-8 shrink-0"
                aria-label="Close welcome banner"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeBanner;
