import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Play, Volume2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const VideoHero = () => {
  const { t, language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentVideoSrc, setCurrentVideoSrc] = useState('');

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
    }
  };

  // Effect for language changes and initial setup
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Only cleanup and reload if the video source actually changed
    if (currentVideoSrc && currentVideoSrc !== videoSrc) {
      console.log('VideoHero: Video source changed, cleaning up and reloading');
      cleanupVideo();
      setIsLoading(true);
    }

    console.log('VideoHero: Setting up video for language:', language);
    setCurrentVideoSrc(videoSrc);
    
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

    // Add timeout fallback to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        console.log('VideoHero: Loading timeout, hiding loading screen');
        setIsLoading(false);
      }
    }, 10000); // 10 second timeout

    // Force video to reload only if source changed
    if (currentVideoSrc !== videoSrc) {
      video.load();
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
      clearTimeout(loadingTimeout);
    };
  }, [videoSrc, language, currentVideoSrc, isLoading]);

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
    <section className="video-hero relative overflow-hidden h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen">
      {/* Video Background */}
      <video
        ref={videoRef}
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover sm:object-center"
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

      {/* Audio Control Button - Positioned below navbar */}
      {!showPlayButton && !isLoading && (
        <button
          onClick={handleToggleAudio}
          className="absolute top-16 sm:top-20 md:top-24 right-4 z-40 bg-white/90 hover:bg-white text-gray-800 hover:text-gray-900 p-3 rounded-full transition-all duration-200 shadow-2xl border-2 border-gray-200 backdrop-blur-sm"
          aria-label={hasAudio ? 'Mute video' : 'Unmute video'}
        >
          <Volume2 className={`w-6 h-6 ${hasAudio ? 'opacity-100' : 'opacity-60'}`} />
        </button>
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Title at Bottom */}
      <div className="absolute bottom-12 sm:bottom-16 md:bottom-20 left-0 right-0 z-10 text-center text-white px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold animate-float bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
          {t('heroTitle')}
        </h1>
      </div>
    </section>
  );
};

export default VideoHero;
