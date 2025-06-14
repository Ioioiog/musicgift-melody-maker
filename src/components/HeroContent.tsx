
import { useLanguage } from '@/contexts/LanguageContext';
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
              className="group bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full text-sm sm:text-lg shadow-xl hover:shadow-2xl flex items-center gap-2 sm:gap-3 min-w-[180px] sm:min-w-[200px] justify-center transform translate3d(0,0,0)"
              style={{ transition: 'all 0.2s ease-out' }}
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              {t('getStarted') || 'Get Started'}
            </a>
            
            <a
              href="/packages"
              className="group border-2 border-white/60 hover:border-white text-white hover:bg-white/10 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full text-sm sm:text-lg backdrop-blur-sm flex items-center gap-2 sm:gap-3 min-w-[180px] sm:min-w-[200px] justify-center transform translate3d(0,0,0)"
              style={{ transition: 'all 0.2s ease-out' }}
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              {t('viewPackages') || 'View Packages'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroContent;
