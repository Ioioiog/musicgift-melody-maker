
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Gift, Music } from 'lucide-react';

const VideoHero = () => {
  const { t, language } = useLanguage();

  // Select video based on language
  const videoSrc = language === 'ro' 
    ? '/lovable-uploads/Jingle Musicgift master.mp4'
    : '/lovable-uploads/MusicGiftvideoENG.mp4';

  return (
    <section className="video-hero relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
        key={videoSrc} // Force re-render when video changes
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen text-center text-white px-4">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-float">
            {t('heroTitle')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
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
              <Button size="lg" variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                <Music className="w-5 h-5 mr-2" />
                {t('listenToSamples')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 scroll-indicator">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default VideoHero;
