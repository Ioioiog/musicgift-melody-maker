
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import PricingBadge from '@/components/PricingBadge';
import { motion } from 'framer-motion';

const MobileHeroSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="block sm:hidden bg-gradient-to-br from-purple-900/10 via-black/20 to-purple-900/10 py-8 px-4"
    >
      <div className="max-w-lg mx-auto text-center">
        {/* Mobile Hero Title */}
        <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent leading-tight">
          {t('heroTitle')}
        </h1>
        
        {/* Mobile Pricing Badge */}
        <div className="flex justify-center">
          <div className="transform scale-110">
            <PricingBadge />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default MobileHeroSection;
