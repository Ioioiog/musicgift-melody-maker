
import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroCallToAction = () => {
  const { t } = useLanguage();

  return (
    <section className="py-6 md:py-12 px-4 relative z-10 bg-gradient-to-b from-black/80 to-black/60">
      <div className="max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-br from-white/15 via-white/20 to-white/10 backdrop-blur-xl rounded-3xl border border-white/30 p-6 md:p-10 shadow-2xl">
          {/* Enhanced subtitle with better mobile readability */}
          <p className="text-lg md:text-xl lg:text-2xl text-white/95 mb-8 max-w-4xl mx-auto leading-relaxed font-medium">
            {t('heroCtaSubtitle') || 'Let us help you create a personalized musical gift that will be treasured forever'}
          </p>
          
          {/* Improved call-to-action buttons with better spacing */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-6">
            <Link
              to="/order"
              className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-3 min-w-[220px] justify-center transform-gpu"
              aria-label="Start creating your personalized music gift"
            >
              <Heart className="w-6 h-6 group-hover:animate-pulse" />
              <span>{t('getStarted') || 'Get Started'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/packages"
              className="group border-2 border-white/70 hover:border-white text-white hover:bg-white/15 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 backdrop-blur-sm flex items-center gap-3 min-w-[220px] justify-center transform-gpu"
              aria-label="View all available music packages"
            >
              <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              <span>{t('viewPackages') || 'View Packages'}</span>
            </Link>
          </div>

          {/* Trust indicators with better mobile layout */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-white/80 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-medium">{t('trustedByThousands', 'Trusted by thousands')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="font-medium">{t('customCompositions', 'Custom compositions')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="font-medium">{t('perfectGifts', 'Perfect gifts')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCallToAction;
