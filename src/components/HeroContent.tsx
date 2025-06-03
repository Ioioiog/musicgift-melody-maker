
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Gift, Music } from 'lucide-react';

const HeroContent = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-4xl mx-auto text-center animate-fade-in">
        <p className="text-xl md:text-2xl mb-8 text-gray-600">
          {t('heroSubtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mobile-button-spacing">
          <Link to="/packages">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Gift className="w-5 h-5 mr-2" />
              {t('seePackages')}
            </Button>
          </Link>
          <Link to="/testimonials">
            <Button size="lg" variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
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
