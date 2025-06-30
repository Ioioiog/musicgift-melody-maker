
import React from 'react';
import { Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { motion } from 'framer-motion';

const PricingBadge: React.FC = () => {
  const { t, language } = useLanguage();
  const { currency } = useCurrency();
  
  const priceRON = 299;
  const priceEUR = 59;
  const currentPrice = currency === 'RON' ? priceRON : priceEUR;
  
  // Direct delivery time translations for each language
  const getDeliveryTime = () => {
    const deliveryTimes = {
      'ro': 'Livrare: 3-5 zile',
      'en': 'Delivery: 3-5 days',
      'fr': 'Livraison: 3-5 jours',
      'de': 'Lieferung: 3-5 Tage',
      'pl': 'Dostawa: 3-5 dni'
    };
    
    // Get the delivery time for current language, fallback to English, then default
    return deliveryTimes[language as keyof typeof deliveryTimes] || 
           deliveryTimes['en'] || 
           'Delivery: 3-5 days';
  };

  // Direct pricing text translations for each language
  const getPricingText = () => {
    const pricingTexts = {
      'ro': `Prețuri începând de la ${currentPrice} ${currency}`,
      'en': `Prices starting from ${currentPrice} ${currency}`,
      'fr': `Prix à partir de ${currentPrice} ${currency}`,
      'de': `Preise ab ${currentPrice} ${currency}`,
      'pl': `Ceny od ${currentPrice} ${currency}`
    };
    
    return pricingTexts[language as keyof typeof pricingTexts] || 
           pricingTexts['en'] || 
           `Prices starting from ${currentPrice} ${currency}`;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="relative"
    >
      {/* Main Badge */}
      <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-2xl shadow-2xl border-2 border-orange-400/50 backdrop-blur-sm overflow-hidden group hover:scale-105 transition-all duration-300">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content */}
        <div className="relative z-10 px-4 py-3 text-white">
          {/* Delivery Time Row */}
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-orange-100" />
            <span className="text-sm font-semibold text-orange-50">
              {getDeliveryTime()}
            </span>
          </div>
          
          {/* Price Row - without currency icon */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">
              {getPricingText()}
            </span>
          </div>
        </div>
        
        {/* Decorative Border */}
        <div className="absolute inset-0 rounded-2xl border border-orange-300/30 pointer-events-none" />
      </div>
      
      {/* Pulse Animation Ring */}
      <div className="absolute inset-0 rounded-2xl border-2 border-orange-400/50 animate-pulse" />
    </motion.div>
  );
};

export default PricingBadge;
