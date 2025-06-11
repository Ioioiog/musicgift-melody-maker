
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Play, Volume2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

const VideoHero = () => {
  const {
    t,
    language
  } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentVideoSrc, setCurrentVideoSrc] = useState('');
  const [videoDimensions, setVideoDimensions] = useState({
    width: 0,
    height: 0
  });
  const isMobile = useIsMobile();

  // Select video based on language with fallback
  const videoSrc = language === 'ro' ? '/lovable-uploads/Jingle Musicgift master.mp4' : '/lovable-uploads/MusicGiftvideoENG.mp4';
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
    const handleLoadedMetadata = () => {
      console.log('VideoHero: Video metadata loaded');
      setVideoDimensions({
        width: video.videoWidth,
        height: video.videoHeight
      });
    };
    const handleCanPlay = () => {
      console.log('VideoHero: Video can play, attempting autoplay');
      setIsLoading(false);
      // Try to play with audio first
      video.muted = false;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('VideoHero: Autoplay with audio succeeded');
          setHasAudio(true);
          setShowPlayButton(false);
        }).catch(error => {
          console.log('VideoHero: Autoplay with audio blocked, falling back to muted:', error);
          // Autoplay with audio blocked, fall back to muted
          video.muted = true;
          video.play().then(() => {
            setShowPlayButton(true);
            setHasAudio(false);
          }).catch(muteError => {
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
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
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
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
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
    }).catch(error => {
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

  // Calculate mobile height for 16:9 aspect ratio
  const getMobileHeight = () => {
    if (!isMobile) {
      return undefined;
    }
    const screenWidth = window.innerWidth;
    // Force 16:9 aspect ratio on mobile
    const calculatedHeight = (screenWidth * 9) / 16;
    return `${calculatedHeight}px`;
  };

  const mobileHeight = getMobileHeight();
  const sectionStyle = isMobile && mobileHeight ? {
    height: mobileHeight,
    minHeight: 'auto'
  } : {};

  return (
    <section className={`video-hero relative overflow-hidden ${isMobile ? '' : 'h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen'}`} style={sectionStyle}>
      {/* Background image - Visible on desktop and mobile */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: 'url(/lovable-uploads/e53a847b-7672-4212-aa90-b31d0bc6d328.png)'
      }}></div>

      {/* Animated background particles - Mobile only */}
      <div className="absolute inset-0 overflow-hidden md:hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              scale: 0
            }}
            animate={{
              y: [null, -100, (typeof window !== 'undefined' ? window.innerHeight : 800) + 100],
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Video Background - Positioned below navbar on mobile */}
      <video
        ref={videoRef}
        loop
        playsInline
        className={`absolute ${isMobile ? 'top-16' : 'top-0'} left-0 w-full ${isMobile ? 'h-auto' : 'h-full'} object-cover object-center`}
        style={isMobile ? { height: mobileHeight } : {}}
        key={videoSrc}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Loading Overlay */}
      {isLoading && (
        <div className={`absolute ${isMobile ? 'top-16' : 'inset-0'} ${isMobile ? 'left-0 right-0' : ''} bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 flex items-center justify-center z-20`} style={isMobile ? { height: mobileHeight } : {}}>
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}

      {/* Play Button Overlay */}
      {showPlayButton && !isLoading && (
        <div className={`absolute ${isMobile ? 'top-16' : 'inset-0'} ${isMobile ? 'left-0 right-0' : ''} bg-black/30 flex items-center justify-center z-20`} style={isMobile ? { height: mobileHeight } : {}}>
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
          className={`absolute z-40 bg-white/90 hover:bg-white text-gray-800 hover:text-gray-900 rounded-full transition-all duration-200 shadow-2xl border-2 border-gray-200 backdrop-blur-sm ${
            isMobile 
              ? 'bottom-16 right-4 p-2' 
              : 'top-16 sm:top-20 md:top-24 right-4 p-3'
          }`}
          aria-label={hasAudio ? 'Mute video' : 'Unmute video'}
        >
          <Volume2 className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'} ${hasAudio ? 'opacity-100' : 'opacity-60'}`} />
        </button>
      )}

      {/* Dark Overlay */}
      <div className={`absolute ${isMobile ? 'top-16' : 'inset-0'} ${isMobile ? 'left-0 right-0' : ''} bg-gradient-to-br from-black/40 via-purple-900/30 to-black/50`} style={isMobile ? { height: mobileHeight } : {}}></div>

      {/* Title at Bottom */}
      <div className={`absolute ${isMobile ? 'bottom-4' : 'bottom-12 sm:bottom-16 md:bottom-20'} left-0 right-0 z-10 text-center text-white px-4`}>
        <h1 className={`${isMobile ? 'text-lg' : 'text-2xl sm:text-3xl md:text-4xl lg:text-6xl'} font-bold animate-float bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent`}>
          {t('heroTitle')}
        </h1>
      </div>
    </section>
  );
};

export default VideoHero;
