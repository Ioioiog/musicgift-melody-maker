
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Gift, Music, Star } from 'lucide-react';

const OrderHeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative py-16 px-4 text-white overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-black/50"></div>
      
      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              {t('createYourMusicGift', 'Create Your Music Gift')}
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl mb-8 text-white/90 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {t('orderPageSubtitle', 'Turn your emotions into a personalized song that will be treasured forever')}
          </p>
          
          {/* Features row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center space-x-2 text-white/80">
              <Gift className="w-5 h-5 text-purple-300" />
              <span className="text-sm sm:text-base">{t('perfectGift', 'Perfect Gift')}</span>
            </div>
            <div className="flex items-center space-x-2 text-white/80">
              <Music className="w-5 h-5 text-purple-300" />
              <span className="text-sm sm:text-base">{t('customMelody', 'Custom Melody')}</span>
            </div>
            <div className="flex items-center space-x-2 text-white/80">
              <Star className="w-5 h-5 text-purple-300" />
              <span className="text-sm sm:text-base">{t('professionalQuality', 'Professional Quality')}</span>
            </div>
          </div>
          
          {/* Trust indicators */}
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <p className="text-sm text-white/70 mb-2">
              {t('trustedByThousands', 'Trusted by thousands of customers')}
            </p>
            <div className="flex items-center justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-sm text-white/80">4.9/5</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-500/10 rounded-full blur-xl"></div>
    </section>
  );
};

export default OrderHeroSection;
