
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const OrderHeroSection: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-purple-800/20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Detalii Comandă
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            Completează toți pașii pentru a finaliza comanda.
          </p>
        </div>
      </div>
    </section>
  );
};

export default OrderHeroSection;
