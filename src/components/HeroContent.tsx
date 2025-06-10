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
  const backgroundStyle = {
    backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };
  return <section className="py-20 px-4 text-white relative overflow-hidden min-h-screen flex items-center" style={backgroundStyle}>
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
        <motion.div className="text-center bg-gradient-to-r from-white/10 via-white/15 to-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 md:p-12 shadow-2xl" initial={{
        opacity: 0,
        y: 30,
        scale: 0.95
      }} animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }} transition={{
        duration: 0.8,
        delay: 0.2
      }}>
          {/* Floating music icon */}
          <motion.div className="flex justify-center mb-6" initial={{
          opacity: 0,
          y: -20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }}>
            
          </motion.div>

          <motion.h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.6
        }}>
            
          </motion.h2>
          
          <motion.p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.8
        }}>
            {t('heroCtaSubtitle') || 'Let us help you create a personalized musical gift that will be treasured forever'}
          </motion.p>
          
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 1.0
        }}>
            <motion.a href="/order" whileHover={{
            scale: 1.05,
            y: -2
          }} whileTap={{
            scale: 0.98
          }} className="group bg-orange-500 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-3 min-w-[200px] justify-center">
              <Heart className="w-6 h-6 group-hover:animate-pulse" />
              {t('getStarted') || 'Get Started'}
            </motion.a>
            
            <motion.a href="/packages" className="group border-2 border-white/60 hover:border-white text-white hover:bg-white/10 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 backdrop-blur-sm flex items-center gap-3 min-w-[200px] justify-center" whileHover={{
            scale: 1.05,
            y: -2
          }} whileTap={{
            scale: 0.98
          }}>
              <Sparkles className="w-6 h-6 group-hover:animate-spin" />
              {t('viewPackages') || 'View Packages'}
            </motion.a>
          </motion.div>

          {/* Trust indicators */}
          
        </motion.div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 scroll-indicator" initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.6,
      delay: 1.4
    }}>
        <motion.div className="flex flex-col items-center gap-2 text-white/80" animate={{
        y: [0, -8, 0]
      }} transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}>
          <span className="text-sm font-medium">Scroll to explore</span>
          <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center relative overflow-hidden">
            <motion.div className="w-1.5 h-3 bg-white/70 rounded-full mt-2" animate={{
            y: [0, 16, 0],
            opacity: [1, 0, 1]
          }} transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }} />
          </div>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </motion.div>
      </motion.div>
    </section>;
};
export default HeroContent;