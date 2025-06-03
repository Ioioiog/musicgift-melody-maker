import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Gift, Music, Play, Volume2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const VideoHero = () => {
  const { t, language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Select video based on language with fallback
  const videoSrc = language === 'ro' 
    ? '/lovable-uploads/Jingle Musicgift master.mp4'
    : '/lovable-uploads/MusicGiftvideoENG.mp4';

  console.log('VideoHero: Current language:', language, 'Video source:', videoSrc);

  // Cleanup function to stop video and reset states
  const cleanupVideo = () => {
    const video = videoRef.current;
    if (video) {
      console.log('VideoHero: Cleaning up video');
      video.pause();
      video.currentTime = 0;
      video.muted = true;
      setHasAudio(false);
      setShowPlayButton(false);
      setIsLoading(true);
    }
  };

  // Effect for language changes and initial setup
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log('VideoHero: Setting up video for language:', language);
    
    // Reset video state when language changes
    cleanupVideo();
    
    const handleCanPlay = () => {
      console.log('VideoHero: Video can play, attempting autoplay');
      setIsLoading(false);
      // Try to play with audio first
      video.muted = false;
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('VideoHero: Autoplay with audio succeeded');
            setHasAudio(true);
            setShowPlayButton(false);
          })
          .catch((error) => {
            console.log('VideoHero: Autoplay with audio blocked, falling back to muted:', error);
            // Autoplay with audio blocked, fall back to muted
            video.muted = true;
            video.play().then(() => {
              setShowPlayButton(true);
              setHasAudio(false);
            }).catch((muteError) => {
              console.log('VideoHero: Even muted autoplay failed:', muteError);
              setIsLoading(false);
            });
          });
      }
    };

    const handleError = () => {
      console.log('VideoHero: Video failed to load');
      setIsLoading(false);
    };

    const handleLoadStart = () => {
      console.log('VideoHero: Video load started');
      setIsLoading(true);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);

    // Force video to reload when language changes
    video.load();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
    };
  }, [videoSrc, language]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('VideoHero: Component unmounting, cleaning up');
      cleanupVideo();
    };
  }, []);

  const handlePlayWithAudio = () => {
    const video = videoRef.current;
    if (!video) return;

    console.log('VideoHero: User clicked play with audio');
    video.muted = false;
    video.play().then(() => {
      setHasAudio(true);
      setShowPlayButton(false);
    }).catch((error) => {
      console.log('VideoHero: Failed to play with audio:', error);
      // Keep the play button if it still fails
    });
  };

  const handleToggleAudio = () => {
    const video = videoRef.current;
    if (!video) return;

    console.log('VideoHero: Toggling audio, current hasAudio:', hasAudio);
    if (hasAudio) {
      video.muted = true;
      setHasAudio(false);
    } else {
      video.muted = false;
      setHasAudio(true);
    }
  };

  return (
    <section className="video-hero relative overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
        key={videoSrc}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-20">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}

      {/* Play Button Overlay */}
      {showPlayButton && !isLoading && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-20">
          <Button
            onClick={handlePlayWithAudio}
            size="lg"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
          >
            <Play className="w-8 h-8 mr-2" />
            {t('playWithSound', 'Play with Sound')}
          </Button>
        </div>
      )}

      {/* Audio Control Button */}
      {!showPlayButton && !isLoading && (
        <button
          onClick={handleToggleAudio}
          className="absolute top-4 right-4 z-30 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200"
          aria-label={hasAudio ? 'Mute video' : 'Unmute video'}
        >
          <Volume2 className={`w-5 h-5 ${hasAudio ? 'opacity-100' : 'opacity-50'}`} />
        </button>
      )}

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
