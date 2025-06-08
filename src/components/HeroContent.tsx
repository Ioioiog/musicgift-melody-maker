
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Gift, Music } from 'lucide-react';
import { useEffect } from 'react';
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
  return <section className="py-20 px-4 text-white relative overflow-hidden" style={{
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
        
        {/* Trustpilot Widget */}
        <div className="max-w-md mx-auto mb-8">
          <div data-locale="en-US" data-template-id="56278e9abfbbba0bdcd568bc" data-businessunit-id="684414032f7e44f180176d5b" data-style-height="80px" data-style-width="100%" className="trustpilot-widget shadow-lg overflow-hidden bg-gradient-to-r from-green-50 to-blue-50 p-4 px-0 py-0 rounded-none">
            <a href="https://www.trustpilot.com/review/musicgift.ro" target="_blank" rel="noopener" className="text-green-600 font-semibold">
              View our Trustpilot reviews →
            </a>
          </div>
        </div>
        
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
              Asculta melodiile MusicGift
            </Button>
          </Link>
        </div>
      </div>
    </section>;
};
export default HeroContent;
