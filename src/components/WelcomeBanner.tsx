
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocationContext } from '@/contexts/LocationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCookieContext } from '@/contexts/CookieContext';

const WelcomeBanner: React.FC = () => {
  const { location, loading } = useLocationContext();
  const { t, language } = useLanguage();
  const { isCookieAllowed } = useCookieContext();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show banner if analytics cookies are allowed
    if (!isCookieAllowed('analytics')) {
      return;
    }

    // Show banner when location is loaded
    if (location && !loading) {
      setIsVisible(true);
    }
  }, [location, loading, isCookieAllowed]);

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

  if (loading) {
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
          className="relative w-full bg-white text-black shadow-xl border-b border-orange-500/30"
        >
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="bg-orange-500 rounded-full p-3 shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-lg md:text-xl lg:text-2xl mb-1 text-black">
                    {getWelcomeMessage()}
                  </p>
                  <p className="text-sm md:text-base text-gray-600">
                    {t('welcomeSubtitle', 'Create personalized musical gifts that touch hearts')}
                  </p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="text-black hover:bg-orange-500/20 hover:text-orange-600 h-10 w-10 shrink-0 border border-gray-300/50 hover:border-orange-500/50 transition-all duration-200"
                aria-label="Close welcome banner"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Orange accent line at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeBanner;
