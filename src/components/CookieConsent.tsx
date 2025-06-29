
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Cookie, Settings, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCookieContext } from '@/contexts/CookieContext';
import CookieSettings from './CookieSettings';

const CookieConsent: React.FC = () => {
  const { t } = useLanguage();
  const { 
    showBanner, 
    preferences, 
    acceptAll, 
    rejectAll, 
    savePreferences,
    setShowBanner 
  } = useCookieContext();
  const [showSettings, setShowSettings] = useState(false);

  if (!showBanner) return null;

  return (
    <>
      {/* Fixed container with reserved space to prevent CLS */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 cookie-banner-container" style={{ contain: 'layout style paint' }}>
        <AnimatePresence>
          {showBanner && (
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="transform-gpu"
              style={{ contain: 'layout style' }}
            >
              <Card className="mx-auto max-w-6xl bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                    {/* Icon and Content */}
                    <div className="flex items-start gap-3 flex-1">
                      <div className="bg-orange-100 rounded-full p-2 shrink-0">
                        <Cookie className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {t('cookieConsentTitle', 'We use cookies')}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {t('cookieConsentMessage', 'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.')}
                        </p>
                        <button
                          onClick={() => setShowSettings(true)}
                          className="text-xs text-orange-600 hover:text-orange-700 underline mt-1 font-medium"
                        >
                          {t('learnMoreAboutCookies', 'Learn more about our cookies')}
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                      <Button
                        variant="outline"
                        onClick={rejectAll}
                        className="text-sm px-4 py-2 min-w-[120px] border-gray-300 hover:bg-gray-50"
                      >
                        {t('rejectAll', 'Reject All')}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowSettings(true)}
                        className="text-sm px-4 py-2 min-w-[120px] border-orange-200 text-orange-600 hover:bg-orange-50"
                      >
                        <Settings className="w-4 h-4 mr-1" />
                        {t('customize', 'Customize')}
                      </Button>
                      <Button
                        onClick={acceptAll}
                        className="text-sm px-4 py-2 min-w-[120px] bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        {t('acceptAll', 'Accept All')}
                      </Button>
                    </div>

                    {/* Close Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowBanner(false)}
                      className="shrink-0 h-8 w-8 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cookie Settings Modal */}
      <CookieSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        preferences={preferences}
        onSave={savePreferences}
      />
    </>
  );
};

export default CookieConsent;
