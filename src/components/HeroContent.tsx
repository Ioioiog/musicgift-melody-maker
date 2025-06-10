
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

const HeroContent = () => {
  const { t } = useLanguage();

  useEffect(() => {
    // Load Trustpilot widget script
    const script = document.createElement('script');
    script.src = '//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const backgroundStyle = {
    backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <section className="py-20 px-4 text-white relative overflow-hidden" style={backgroundStyle}>
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          className="text-center bg-gradient-to-r from-white/10 to-white/20 backdrop-blur-md rounded-2xl border border-white/30 p-6" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('heroContentTitle') || 'Create Personalized Songs'}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            {t('heroContentSubtitle') || 'Transform your memories into beautiful, custom songs with our AI-powered music creation platform.'}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.a 
              href="/order" 
              className="bg-white text-purple-800 font-bold py-3 px-6 rounded-full text-base hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl" 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              {t('startYourSong') || 'Start Your Song'}
            </motion.a>
            <motion.a 
              href="/packages" 
              className="border-2 border-white text-white font-bold py-3 px-6 rounded-full text-base hover:bg-white hover:text-purple-800 transition-all duration-300" 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              {t('viewPackages') || 'View Packages'}
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 scroll-indicator">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroContent;
