
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Gift, Music } from 'lucide-react';

const HeroContent = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 px-4 text-white relative overflow-hidden" style={{
      backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="max-w-4xl mx-auto text-center animate-fade-in relative z-10">
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          {t('heroSubtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mobile-button-spacing">
          <Link to="/packages">
            <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
              <Gift className="w-5 h-5 mr-2" />
              {t('seePackages')}
            </Button>
          </Link>
          <Link to="/testimonials">
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
              <Music className="w-5 h-5 mr-2" />
              {t('listenToSamples')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroContent;
