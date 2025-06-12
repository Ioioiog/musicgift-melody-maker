
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, ArrowDown, Music } from 'lucide-react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
const HeroContent = () => {
  const {
    t
  } = useLanguage();
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
  return <section className="py-8 px-4 text-white relative overflow-hidden">
      {/* Enhanced overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-black/50"></div>
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => <motion.div key={i} className="absolute w-2 h-2 bg-white/20 rounded-full" initial={{
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        scale: 0
      }} animate={{
        y: [null, -100, window.innerHeight + 100],
        scale: [0, 1, 0],
        opacity: [0, 0.8, 0]
      }} transition={{
        duration: Math.random() * 10 + 10,
        repeat: Infinity,
        delay: Math.random() * 5
      }} />)}
      </div>

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        <motion.div className="text-center bg-gradient-to-r from-white/10 via-white/15 to-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-3 sm:p-4 md:p-8 shadow-2xl" initial={{
        opacity: 0,
        y: 30,
        scale: 0.95
      }} animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }} transition={{
        duration: 0.8,
        delay: 0.4
      }}>
          <motion.p className="text-sm sm:text-lg md:text-xl text-white/90 mb-4 sm:mb-6 md:mb-8 max-w-4xl mx-auto leading-relaxed" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 1.0
        }}>
            {t('heroCtaSubtitle') || 'Let us help you create a personalized musical gift that will be treasured forever'}
          </motion.p>
          
          <motion.div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-4 sm:mb-6" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 1.2
        }}>
            <motion.a href="/order" whileHover={{
            scale: 1.05,
            y: -2
          }} whileTap={{
            scale: 0.98
          }} className="group bg-orange-500 hover:to-pink-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full text-sm sm:text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2 sm:gap-3 min-w-[180px] sm:min-w-[200px] justify-center">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-pulse" />
              {t('getStarted') || 'Get Started'}
            </motion.a>
            
            <motion.a href="/packages" className="group border-2 border-white/60 hover:border-white text-white hover:bg-white/10 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full text-sm sm:text-lg transition-all duration-300 backdrop-blur-sm flex items-center gap-2 sm:gap-3 min-w-[180px] sm:min-w-[200px] justify-center" whileHover={{
            scale: 1.05,
            y: -2
          }} whileTap={{
            scale: 0.98
          }}>
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-spin" />
              {t('viewPackages') || 'View Packages'}
            </motion.a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div className="flex justify-center items-center gap-4 text-white/70" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 0.6,
          delay: 1.4
        }}>
            
            
            
          </motion.div>
        </motion.div>
      </div>
    </section>;
};
export default HeroContent;
