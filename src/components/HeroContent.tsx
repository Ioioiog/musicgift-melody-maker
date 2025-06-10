
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Gift, Music } from 'lucide-react';
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

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          {t('heroContentTitle') || 'Create Personalized Songs'}
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
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
      </div>
    </section>
  );
};

export default HeroContent;
