
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const OrderHeroSection: React.FC = () => {
  const { t } = useLanguage();
  
  const backgroundStyle = {
    backgroundImage: 'url(/uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };
  
  return (
    <section className="pt-16 md:pt-20 lg:pt-24 pb-6 text-white relative overflow-hidden" style={backgroundStyle}>
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Floating Musical Notes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl opacity-30" style={{
          transform: "translateX(35.2px) translateY(-17.6px) rotate(296.64deg)"
        }}>
          ♪
        </div>
        <div className="absolute bottom-10 right-10 text-6xl opacity-20" style={{
          transform: "translateX(-69.12px) translateY(34.56px) rotate(-77.76deg)"
        }}>
          🎵
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto text-center px-[14px] py-0 my-[24px] relative z-10">
        <motion.h1 
          className="text-2xl md:text-3xl font-bold text-white mb-2" 
          initial={{
            opacity: 0,
            y: 20
          }} 
          animate={{
            opacity: 1,
            y: 0
          }} 
          transition={{
            duration: 0.6
          }}
        >
          {t('orderDetails')}
        </motion.h1>
        <motion.p 
          className="text-base md:text-lg text-white/90 mb-4 max-w-2xl mx-auto" 
          initial={{
            opacity: 0,
            y: 20
          }} 
          animate={{
            opacity: 1,
            y: 0
          }} 
          transition={{
            duration: 0.6,
            delay: 0.2
          }}
        >
          {t('completeAllSteps')}
        </motion.p>
      </div>
    </section>
  );
};

export default OrderHeroSection;
