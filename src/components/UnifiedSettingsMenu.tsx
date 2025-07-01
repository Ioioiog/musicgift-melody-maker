
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useLanguage, languageNames, Language } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLocationContext } from '@/contexts/LocationContext';
import { useRegionConfig } from '@/hooks/useRegionConfig';
import { useTimezone } from '@/hooks/useTimezone';
import { Settings, Check, Globe, MapPin, Clock, RefreshCw } from 'lucide-react';
import CurrencyIcon from '@/components/CurrencyIcon';
import LocationGreeting from '@/components/LocationGreeting';
import LocalTimeClock from '@/components/LocalTimeClock';

const UnifiedSettingsMenu = () => {
  const { language, setLanguage } = useLanguage();
  const { currency, setCurrency, suggestedCurrency } = useCurrency();
  const { location, refreshLocation, loading } = useLocationContext();
  const { regionConfig } = useRegionConfig();
  const { isBusinessHours } = useTimezone();

  const languages: Language[] = ["en", "ro", "fr", "pl", "de"];

  const handleRefreshLocation = async () => {
    try {
      await refreshLocation();
    } catch (error) {
      console.error('Failed to refresh location:', error);
    }
  };

  // Get supported currencies from region config
  const supportedCurrencies = regionConfig?.supportedCurrencies || ['EUR', 'RON'];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="relative overflow-hidden group bg-white/80 backdrop-blur-sm border-2 border-gray-200/50 hover:border-gray-300 text-gray-700 hover:text-gray-800 transition-all duration-300 rounded-xl px-3 py-2 shadow-lg hover:shadow-xl hover:bg-white/90 flex items-center space-x-1 min-h-[40px] touch-manipulation"
        >
          <Settings className="w-4 h-4" />
          {location && (
            <span className="text-xs opacity-70">
              {location.countryCode}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-72 bg-white/95 backdrop-blur-md border-2 border-gray-200 shadow-2xl z-50 rounded-xl p-2 animate-in slide-in-from-top-2 duration-200"
      >
        {/* Enhanced Location Info */}
        {location && (
          <>
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Location Details
            </div>
            <div className="px-3 py-2 space-y-1">
              <LocationGreeting format="long" showIcon={false} className="text-sm font-medium text-gray-700" />
              <div className="text-xs text-gray-500 space-y-1">
                <div>IP: {location.ip}</div>
                {location.postalCode && <div>Postal: {location.postalCode}</div>}
                {location.isp && <div>ISP: {location.isp}</div>}
              </div>
              <LocalTimeClock className="mt-2" showTimezone={true} />
              {!isBusinessHours() && (
                <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                  Outside business hours
                </div>
              )}
            </div>
            <div className="px-3 py-1 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefreshLocation}
                disabled={loading}
                className="text-xs h-6 px-2"
              >
                <RefreshCw className={`w-3 h-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            <DropdownMenuSeparator className="bg-gray-200 my-2" />
          </>
        )}

        {/* Currency Section */}
        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Currency
        </div>
        
        {/* EUR Option */}
        {supportedCurrencies.includes('EUR') && (
          <DropdownMenuItem 
            onClick={() => setCurrency('EUR')} 
            className={`hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-50 transition-all duration-300 rounded-lg mx-1 px-3 py-2 cursor-pointer transform hover:scale-105 min-h-[40px] touch-manipulation flex items-center justify-between ${currency === 'EUR' ? "bg-gradient-to-r from-orange-100 to-orange-100 text-orange-700 font-semibold shadow-sm" : "text-gray-700"}`}
          >
            <div className="flex items-center space-x-2">
              <CurrencyIcon currency="EUR" className="w-4 h-4" />
              <span>EUR</span>
              {suggestedCurrency === 'EUR' && (
                <span className="text-xs bg-blue-100 text-blue-600 px-1 rounded">suggested</span>
              )}
            </div>
            {currency === 'EUR' && <Check className="w-4 h-4" />}
          </DropdownMenuItem>
        )}
        
        {/* RON Option */}
        {supportedCurrencies.includes('RON') && (
          <DropdownMenuItem 
            onClick={() => setCurrency('RON')} 
            className={`hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-50 transition-all duration-300 rounded-lg mx-1 px-3 py-2 cursor-pointer transform hover:scale-105 min-h-[40px] touch-manipulation flex items-center justify-between ${currency === 'RON' ? "bg-gradient-to-r from-orange-100 to-orange-100 text-orange-700 font-semibold shadow-sm" : "text-gray-700"}`}
          >
            <div className="flex items-center space-x-2">
              <CurrencyIcon currency="RON" className="w-4 h-4" />
              <span>RON</span>
              {suggestedCurrency === 'RON' && (
                <span className="text-xs bg-blue-100 text-blue-600 px-1 rounded">suggested</span>
              )}
            </div>
            {currency === 'RON' && <Check className="w-4 h-4" />}
          </DropdownMenuItem>
        )}
        
        {/* USD Option */}
        {supportedCurrencies.includes('USD') && (
          <DropdownMenuItem 
            onClick={() => setCurrency('USD')} 
            className={`hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-50 transition-all duration-300 rounded-lg mx-1 px-3 py-2 cursor-pointer transform hover:scale-105 min-h-[40px] touch-manipulation flex items-center justify-between ${currency === 'USD' ? "bg-gradient-to-r from-orange-100 to-orange-100 text-orange-700 font-semibold shadow-sm" : "text-gray-700"}`}
          >
            <div className="flex items-center space-x-2">
              <CurrencyIcon currency="USD" className="w-4 h-4" />
              <span>USD</span>
              {suggestedCurrency === 'USD' && (
                <span className="text-xs bg-blue-100 text-blue-600 px-1 rounded">suggested</span>
              )}
            </div>
            {currency === 'USD' && <Check className="w-4 h-4" />}
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className="bg-gray-200 my-2" />

        {/* Language Section */}
        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Language
        </div>
        {languages.map(lang => (
          <DropdownMenuItem 
            key={lang} 
            onClick={() => setLanguage(lang)} 
            className={`hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 rounded-lg mx-1 px-3 py-2 cursor-pointer transform hover:scale-105 min-h-[40px] touch-manipulation flex items-center justify-between ${language === lang ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-semibold shadow-sm" : "text-gray-700"}`}
          >
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>{languageNames[lang]}</span>
            </div>
            {language === lang && <Check className="w-4 h-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UnifiedSettingsMenu;
