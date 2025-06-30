import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';
import PricingBadge from '@/components/PricingBadge';

const supportsWebM = (): boolean => {
  const video = document.createElement('video');
  return video.canPlayType('video/webm') !== '';
};

const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
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

  const baseName = language === 'ro' ? 'musicgift_ro' : 'musicgift_eng';
  const videoSrc = `/uploads/${baseName}.mp4`;
  const videoWebM = `/uploads/${baseName}.webm`;
  const posterSrc = '/uploads/video_placeholder.png';

  // Initialize video format support
  useEffect(() => {
    setUseWebM(supportsWebM());
    setIsMounted(true);
    
    // On mobile, show overlay for user interaction
    if (isMobileDevice()) {
      setShowPlayOverlay(true);
      setHasAudio(false);
    } else {
      setHasAudio(true);
    }
  }, []);

  const startVideoWithSound = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      video.muted = false;
      setHasAudio(true);
      video.currentTime = 0;
      
      await video.play();
      setIsPlaying(true);
      setShowPlayOverlay(false);
      setUserInteracted(true);
    } catch (error) {
      console.warn('Autoplay with sound failed, starting muted:', error);
      video.muted = true;
      setHasAudio(false);
      try {
        await video.play();
        setIsPlaying(true);
      } catch (mutedError) {
        console.warn('Even muted autoplay failed:', mutedError);
      }
    }
  }, []);

  const startVideoMuted = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      video.muted = true;
      setHasAudio(false);
      video.currentTime = 0;
      
      await video.play();
      setIsPlaying(true);
    } catch (error) {
      console.warn('Muted autoplay failed:', error);
    }
  }, []);

  // Handle language changes - restart video
  useEffect(() => {
    const video = videoRef.current;
    if (video && isMounted) {
      video.pause();
      setIsPlaying(false);
      
      if (isMobileDevice() && !userInteracted) {
        // On mobile without interaction, start muted
        startVideoMuted();
      } else {
        // On desktop or after user interaction, try with sound
        startVideoWithSound();
      }
    }
  }, [language, isMounted, userInteracted, startVideoMuted, startVideoWithSound]);

  // Handle route changes - pause when leaving home page
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (location.pathname !== '/') {
        video.pause();
        setIsPlaying(false);
      } else {
        if (isMobileDevice() && !userInteracted) {
          startVideoMuted();
        } else {
          startVideoWithSound();
        }
      }
    }
  }, [location.pathname, userInteracted, startVideoMuted, startVideoWithSound]);

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
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
    if (!video) return;
    
    if (hasAudio) {
      video.muted = true;
      setHasAudio(false);
    } else {
      video.muted = false;
      setHasAudio(true);
      setUserInteracted(true);
    }
  }, [hasAudio]);

  const handlePlayWithSound = () => {
    setUserInteracted(true);
    startVideoWithSound();
  };

  const mobileHeight = isMobile ? `${(window.innerWidth * 9) / 16}px` : undefined;

  if (!isMounted) return null;

  return (
    <section
      className={`video-hero relative overflow-hidden video-hero-optimized critical-resource ${isMobile ? '' : 'h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen'}`}
      style={isMobile && mobileHeight ? { height: mobileHeight } : {}}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${posterSrc})` }}
      ></div>

      <video
        key={language}
        ref={videoRef}
        autoPlay
        playsInline
        webkit-playsinline="true"
        preload="metadata"
        muted={!hasAudio}
        onEnded={handleVideoEnd}
        className={`absolute ${isMobile ? 'top-16' : 'top-0'} left-0 w-full ${isMobile ? 'h-auto' : 'h-full'} object-cover hw-accelerated`}
        poster={posterSrc}
      >
        {useWebM && <source src={videoWebM} type="video/webm" />}
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Mobile Play Overlay */}
      {showPlayOverlay && isMobileDevice() && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
          <Button
            onClick={handlePlayWithSound}
            size="lg"
            className="bg-white/90 text-black rounded-full shadow-lg hover:bg-white transform hover:scale-105 transition-all duration-300 animate-pulse"
          >
            <Play className="w-8 h-8 mr-3" />
            {t('tapToPlayWithSound', 'Tap to play with sound')}
          </Button>
        </div>
      )}

      {/* Video controls - Top position */}
      <div className="absolute top-24 right-4 sm:top-32 sm:right-6 z-30 flex gap-2 defer-load">
        <Button onClick={handleTogglePlay} size="icon" className="bg-white/80 text-black rounded-full shadow hw-accelerated">
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </Button>
        <Button onClick={handleToggleAudio} size="icon" className="bg-white/80 text-black rounded-full shadow hw-accelerated">
          {hasAudio ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </Button>
      </div>

      {/* Desktop Pricing Badge - Hidden on mobile */}
      <div className="absolute top-40 right-4 sm:top-48 sm:right-6 z-30 hidden lg:block">
        <PricingBadge />
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-black/50"></div>

      {/* Desktop Hero Title - Hidden on mobile */}
      <div className="absolute bottom-12 left-0 right-0 text-center text-white px-4 hidden sm:block">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent hw-accelerated">
          {t('heroTitle')}
        </h1>
      </div>
    </section>
  );
};

export default VideoHero;
