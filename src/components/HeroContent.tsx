
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, Sparkles } from 'lucide-react';

const HeroContent = () => {
  const { t } = useLanguage();

  return (
    <section className="py-8 px-4 text-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10 w-full">
        <div className="text-center bg-gradient-to-r from-white/10 via-white/15 to-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-3 sm:p-4 md:p-8 shadow-2xl">
          <p className="text-sm sm:text-lg md:text-xl text-white/90 mb-4 sm:mb-6 md:mb-8 max-w-4xl mx-auto leading-relaxed">
            {t('heroCtaSubtitle') || 'Let us help you create a personalized musical gift that will be treasured forever'}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-4 sm:mb-6">
            <a
              href="/order"
              className="group bg-orange-500 hover:to-pink-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full text-sm sm:text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2 sm:gap-3 min-w-[180px] sm:min-w-[200px] justify-center"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-pulse" />
              {t('getStarted') || 'Get Started'}
            </a>
            
            <a
              href="/packages"
              className="group border-2 border-white/60 hover:border-white text-white bg-white/10 hover:bg-white/20 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full text-sm sm:text-lg transition-all duration-300 flex items-center gap-2 sm:gap-3 min-w-[180px] sm:min-w-[200px] justify-center"
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-spin" />
              {t('viewPackages') || 'View Packages'}
            </a>
          </div>

          {/* Trust indicators */}
          <div className="flex justify-center items-center gap-4 text-white/70">
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroContent;
