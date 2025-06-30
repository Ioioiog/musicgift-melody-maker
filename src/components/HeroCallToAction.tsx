
import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, Sparkles } from 'lucide-react';

const HeroCallToAction = () => {
  const { t } = useLanguage();

  return (
    <section className="py-8 md:py-12 px-4 relative z-10">
      <div className="text-center max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-white/10 via-white/15 to-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 md:p-8 shadow-2xl mb-8">
          <p className="text-lg md:text-xl text-white/90 mb-6 max-w-4xl mx-auto leading-relaxed">
            {t('heroCtaSubtitle') || 'Let us help you create a personalized musical gift that will be treasured forever'}
          </p>
          
          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/order"
              className="group bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-3 min-w-[200px] justify-center"
              style={{ color: '#ffffff' }}
            >
              <Heart className="w-6 h-6 group-hover:animate-pulse" />
              <span className="text-white font-bold">
                {t('getStarted') || 'Get Started'}
              </span>
            </a>
            
            <a
              href="/packages"
              className="group border-2 border-white/60 hover:border-white text-white hover:bg-white/10 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 backdrop-blur-sm flex items-center gap-3 min-w-[200px] justify-center"
              style={{ color: '#ffffff' }}
            >
              <Sparkles className="w-6 h-6 group-hover:animate-spin" />
              <span className="text-white font-bold">
                {t('viewPackages') || 'View Packages'}
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCallToAction;
