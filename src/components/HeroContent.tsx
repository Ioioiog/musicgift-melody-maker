
import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroContent = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <section className="py-4 px-4 text-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10 w-full">
        <div className={`text-center rounded-2xl p-4 ${
          isMobile 
            ? 'hero-content-mobile' 
            : 'bg-gradient-to-r from-white/10 via-white/15 to-white/10 backdrop-blur-lg border border-white/20 shadow-2xl'
        }`}>
          <p className="text-sm text-white/90 mb-4 max-w-4xl mx-auto leading-relaxed">
            {t('heroCtaSubtitle') || 'Let us help you create a personalized musical gift that will be treasured forever'}
          </p>
          
          <div className="flex flex-col gap-3 justify-center items-center mb-4">
            <a
              href="/order"
              className={`group flex items-center gap-2 justify-center font-bold text-sm rounded-full shadow-lg ${
                isMobile
                  ? 'button-mobile-critical button-orange'
                  : 'bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 min-w-[180px] transform translate3d(0,0,0) transition-all duration-200'
              }`}
            >
              <Heart className="w-5 h-5" />
              {t('getStarted') || 'Get Started'}
            </a>
            
            <a
              href="/packages"
              className={`group flex items-center gap-2 justify-center font-bold text-sm rounded-full ${
                isMobile
                  ? 'button-mobile-critical button-white'
                  : 'border-2 border-white/60 hover:border-white text-white hover:bg-white/10 py-3 px-6 backdrop-blur-sm min-w-[180px] transform translate3d(0,0,0) transition-all duration-200'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              {t('viewPackages') || 'View Packages'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroContent;
