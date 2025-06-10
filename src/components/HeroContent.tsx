
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Gift, Music } from 'lucide-react';
import { useEffect } from 'react';

const HeroContent = () => {
  const { t } = useLanguage();

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

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          {t('heroContentTitle') || 'Create Personalized Songs'}
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          {t('heroContentSubtitle') || 'Transform your memories into beautiful, custom songs with our AI-powered music creation platform.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/order">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
              <Music className="w-5 h-5 mr-2" />
              {t('startCreating') || 'Start Creating'}
            </Button>
          </Link>
          <Link to="/packages">
            <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
              <Gift className="w-5 h-5 mr-2" />
              {t('viewPackages') || 'View Packages'}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroContent;
