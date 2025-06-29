import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';

const supportsWebM = (): boolean => {
  const video = document.createElement('video');
  return video.canPlayType('video/webm') !== '';
};

const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const isSafari = (): boolean => {
  return /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
};

const VideoHero = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();
  const [hasAudio, setHasAudio] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [useWebM, setUseWebM] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayOverlay, setShowPlayOverlay] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const baseName = language === 'ro' ? 'musicgift_ro' : 'musicgift_eng';
  const videoSrc = `/uploads/${baseName}.mp4`;
  const videoWebM = `/uploads/${baseName}.webm`;
  const posterSrc = '/uploads/video_placeholder.png';

  // Initialize video format support and Safari detection
  useEffect(() => {
    setUseWebM(supportsWebM() && !isSafari());
    setIsMounted(true);
    
    // Enhanced mobile/Safari handling
    if (isMobileDevice() || isSafari()) {
      setShowPlayOverlay(true);
      setHasAudio(false);
    } else {
      setHasAudio(true);
    }
  }, []);

  const startVideoWithSound = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !videoLoaded) return;

    try {
      // Safari-specific handling
      if (isSafari()) {
        video.load();
        await new Promise(resolve => {
          video.addEventListener('canplay', resolve, { once: true });
        });
      }

      video.muted = false;
      setHasAudio(true);
      video.currentTime = 0;
      
      await video.play();
      setIsPlaying(true);
      setShowPlayOverlay(false);
      setUserInteracted(true);
    } catch (error) {
      console.warn('Autoplay with sound failed, starting muted:', error);
      // Fallback to muted play
      try {
        video.muted = true;
        setHasAudio(false);
        await video.play();
        setIsPlaying(true);
        setShowPlayOverlay(false);
      } catch (mutedError) {
        console.warn('Even muted autoplay failed:', mutedError);
        // Keep overlay visible for manual interaction
      }
    }
  }, [videoLoaded]);

  const startVideoMuted = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !videoLoaded) return;

    try {
      // Safari-specific handling
      if (isSafari()) {
        video.load();
      }

      video.muted = true;
      setHasAudio(false);
      video.currentTime = 0;
      
      await video.play();
      setIsPlaying(true);
      setShowPlayOverlay(false);
    } catch (error) {
      console.warn('Muted autoplay failed:', error);
    }
  }, [videoLoaded]);

  // Video load handler
  const handleVideoCanPlay = useCallback(() => {
    setVideoLoaded(true);
  }, []);

  // Handle language changes - restart video
  useEffect(() => {
    if (!isMounted || !videoLoaded) return;
    
    const video = videoRef.current;
    if (video) {
      video.pause();
      setIsPlaying(false);
      
      if ((isMobileDevice() || isSafari()) && !userInteracted) {
        setShowPlayOverlay(true);
      } else {
        startVideoWithSound();
      }
    }
  }, [language, isMounted, videoLoaded, userInteracted, startVideoWithSound]);

  // Handle route changes - pause when leaving home page
  useEffect(() => {
    const video = videoRef.current;
    if (video && videoLoaded) {
      if (location.pathname !== '/') {
        video.pause();
        setIsPlaying(false);
      } else {
        if ((isMobileDevice() || isSafari()) && !userInteracted) {
          setShowPlayOverlay(true);
        } else {
          startVideoWithSound();
        }
      }
    }
  }, [location.pathname, userInteracted, videoLoaded, startVideoWithSound]);

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video || !videoLoaded) return;
    
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.currentTime = 0;
      video.muted = !hasAudio;
      video.play();
      setIsPlaying(true);
    }
  };

  const handleToggleAudio = useCallback(() => {
    const video = videoRef.current;
    if (!video || !videoLoaded) return;
    
    if (hasAudio) {
      video.muted = true;
      setHasAudio(false);
    } else {
      video.muted = false;
      setHasAudio(true);
      setUserInteracted(true);
    }
  }, [hasAudio, videoLoaded]);

  const handlePlayWithSound = useCallback(() => {
    setUserInteracted(true);
    startVideoWithSound();
  }, [startVideoWithSound]);

  // Enhanced mobile video interaction handlers
  const handleVideoTouch = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if ((isMobileDevice() || isSafari()) && !userInteracted) {
      handlePlayWithSound();
    }
  }, [userInteracted, handlePlayWithSound]);

  const handleVideoClick = useCallback(() => {
    if ((isMobileDevice() || isSafari()) && !userInteracted) {
      handlePlayWithSound();
    }
  }, [userInteracted, handlePlayWithSound]);

  if (!isMounted) {
    // Fixed skeleton to prevent CLS
    return (
      <section 
        className="fixed top-0 left-0 w-screen h-screen bg-black loading-skeleton"
        style={{ 
          aspectRatio: '16/9',
          contain: 'layout style paint',
          backgroundImage: `url(${posterSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
    );
  }

  return (
    <section
      className="fixed top-0 left-0 w-screen h-screen bg-black overflow-hidden"
      style={{ 
        aspectRatio: '16/9',
        contain: 'layout style paint',
        contentVisibility: 'auto',
        zIndex: 1
      }}
    >
      {/* Full-screen video background */}
      <video
        key={language}
        ref={videoRef}
        autoPlay={!isMobileDevice() && !isSafari()}
        playsInline
        webkit-playsinline="true"
        x-webkit-airplay="allow"
        preload="metadata"
        muted={!hasAudio}
        controls={false}
        disablePictureInPicture
        onEnded={handleVideoEnd}
        onCanPlay={handleVideoCanPlay}
        onClick={handleVideoClick}
        onTouchStart={handleVideoTouch}
        className="absolute inset-0 w-full h-full object-cover"
        poster={posterSrc}
        width="1920"
        height="1080"
        style={{ 
          contain: 'layout style paint',
          touchAction: 'manipulation'
        }}
      >
        {useWebM && <source src={videoWebM} type="video/webm" />}
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Enhanced Mobile/Safari Play Overlay */}
      {showPlayOverlay && (isMobileDevice() || isSafari()) && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
          <Button
            onClick={handlePlayWithSound}
            onTouchEnd={handlePlayWithSound}
            size="lg"
            className="bg-white/95 text-black rounded-full shadow-2xl hover:bg-white transform hover:scale-110 transition-all duration-300 animate-pulse min-w-[200px] min-h-[60px] text-lg font-semibold"
            style={{ touchAction: 'manipulation' }}
            aria-label="Redă videoul cu sunet"
          >
            <Play className="w-8 h-8 mr-3" />
            {t('tapToPlayWithSound', 'Tap to play with sound')}
          </Button>
        </div>
      )}

      {/* Video controls - positioned relative to viewport */}
      <div className="fixed top-24 right-4 z-30 flex gap-2">
        <Button 
          onClick={handleTogglePlay} 
          size="icon" 
          className="bg-white/90 text-black rounded-full shadow-lg backdrop-blur-sm min-w-[48px] min-h-[48px]"
          style={{ touchAction: 'manipulation' }}
          aria-label={isPlaying ? "Pauză video" : "Redă video"}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </Button>
        <Button 
          onClick={handleToggleAudio} 
          size="icon" 
          className="bg-white/90 text-black rounded-full shadow-lg backdrop-blur-sm min-w-[48px] min-h-[48px]"
          style={{ touchAction: 'manipulation' }}
          aria-label={hasAudio ? "Dezactivează sunetul" : "Activează sunetul"}
        >
          {hasAudio ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </Button>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/20 to-black/50 pointer-events-none" />

      {/* Hero title - positioned relative to viewport */}
      <div className="fixed bottom-12 left-0 right-0 text-center text-white px-4 z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
          {t('heroTitle')}
        </h1>
      </div>
    </section>
  );
};

export default VideoHero;
