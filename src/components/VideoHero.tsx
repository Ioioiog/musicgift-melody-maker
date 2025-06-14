
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, AlertCircle } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { isSafari, isIOSDevice, supportsWebM } from '@/utils/browserUtils';

const VideoHero = () => {
  const { t, language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const intersectionObserver = useRef<IntersectionObserver | null>(null);
  const isMobile = useIsMobile();
  const [hasAudio, setHasAudio] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [useWebM, setUseWebM] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [showMutedNotice, setShowMutedNotice] = useState(false);
  const [showClickToPlay, setShowClickToPlay] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  const baseName = language === 'ro' ? 'musicgift_ro' : 'musicgift_eng';
  const videoSrc = `/uploads/${baseName}.mp4`;
  const videoWebM = `/uploads/${baseName}.webm`;
  const posterSrc = '/uploads/video_placeholder.png';

  const safariDetected = isSafari();
  const iosDevice = isIOSDevice();

  useEffect(() => {
    setIsMounted(true);
    setIsPlaying(false);
    setHasAudio(false);
    setVideoError(null);
    setShowMutedNotice(false);
    setShowClickToPlay(false);
    setIsVideoLoading(true);
    setHasUserInteracted(false);
    
    // For Safari, prioritize MP4 format
    setUseWebM(supportsWebM() && !safariDetected);
  }, [language, safariDetected]);

  // Track user interaction for Safari audio enablement
  useEffect(() => {
    const handleUserInteraction = () => {
      setHasUserInteracted(true);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    intersectionObserver.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVideoVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    intersectionObserver.current.observe(video);

    return () => {
      if (intersectionObserver.current) {
        intersectionObserver.current.disconnect();
      }
    };
  }, []);

  // Safari-specific autoplay logic
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideoVisible) return;

    // Check if navigating back to avoid autoplay
    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0) {
      const navEntry = navigationEntries[0] as PerformanceNavigationTiming;
      if (navEntry.type === 'back_forward') return;
    }

    const attemptAutoplay = async () => {
      try {
        if (video.readyState < 3) {
          video.load();
          await new Promise(resolve => {
            video.addEventListener('canplay', resolve, { once: true });
          });
        }

        // For Safari, always start muted
        if (safariDetected) {
          video.muted = true;
          await video.play();
          setIsPlaying(true);
          setHasAudio(false);
          setShowMutedNotice(true);
        } else {
          // Try unmuted first for other browsers
          video.muted = false;
          await video.play();
          setIsPlaying(true);
          setHasAudio(true);
        }
      } catch (err) {
        console.warn('Autoplay failed, showing click-to-play:', err);
        setShowClickToPlay(true);
        setIsPlaying(false);
      }
    };

    attemptAutoplay();
  }, [language, isVideoVisible, safariDetected]);

  const handleVideoError = useCallback((error: any) => {
    console.warn('Video loading error:', error);
    setVideoError('Video cannot be loaded');
    setIsVideoLoading(false);
    setIsPlaying(false);
  }, []);

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video || videoError) return;
    
    setShowClickToPlay(false);
    
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.currentTime = 0;
      video.muted = !hasAudio;
      video.play().catch(handleVideoError);
      setIsPlaying(true);
    }
  };

  const handleToggleAudio = useCallback(() => {
    const video = videoRef.current;
    if (!video || videoError) return;
    
    // For Safari, require user interaction
    if (safariDetected && !hasUserInteracted) {
      setShowMutedNotice(true);
      return;
    }
    
    video.muted = hasAudio;
    setHasAudio(!hasAudio);
    setShowMutedNotice(false);
  }, [hasAudio, videoError, safariDetected, hasUserInteracted]);

  const mobileHeight = isMobile ? `${(window.innerWidth * 9) / 16}px` : undefined;

  if (!isMounted) return null;

  return (
    <section
      className={`video-hero relative overflow-hidden ${isMobile ? '' : 'h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen'}`}
      style={isMobile && mobileHeight ? { height: mobileHeight } : {}}
      role="banner"
      aria-label="Hero video section"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${posterSrc})` }}
        aria-hidden="true"
      ></div>

      {videoError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-black/70" role="alert">
          <div className="text-center text-white">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-white/80" />
            <h3 className="text-lg font-semibold mb-2">Video Unavailable</h3>
            <p className="text-sm opacity-90 mb-4">The video content is temporarily unavailable</p>
            <Button onClick={() => window.location.reload()} className="bg-orange-500 hover:bg-orange-600 text-white">
              Try Again
            </Button>
          </div>
        </div>
      ) : (
        <video
          key={language}
          ref={videoRef}
          playsInline
          preload="metadata"
          muted={!hasAudio}
          onError={handleVideoError}
          onLoadStart={() => setIsVideoLoading(true)}
          onCanPlay={() => setIsVideoLoading(false)}
          className={`absolute ${isMobile ? 'top-16' : 'top-0'} left-0 w-full ${isMobile ? 'h-auto' : 'h-full'} object-cover transition-opacity duration-300 ${isVideoLoading ? 'opacity-0' : 'opacity-100'}`}
          poster={posterSrc}
          aria-label={`MusicGift promotional video in ${language === 'ro' ? 'Romanian' : 'English'}`}
        >
          {/* For Safari, prioritize MP4 */}
          <source src={videoSrc} type="video/mp4" />
          {useWebM && <source src={videoWebM} type="video/webm" />}
        </video>
      )}

      {/* Click-to-play overlay */}
      {showClickToPlay && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer z-40"
          onClick={handleTogglePlay}
        >
          <div className="bg-white/90 hover:bg-white rounded-full p-6 shadow-xl">
            <Play className="w-12 h-12 text-black ml-1" />
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showMutedNotice && (
        <div className="absolute top-20 right-4 z-50 bg-black/80 text-white text-sm px-4 py-2 rounded-lg shadow-md flex items-start gap-2 max-w-xs">
          <span className="pt-0.5">🔇</span>
          <span className="flex-1">
            {safariDetected && !hasUserInteracted 
              ? 'Click anywhere to enable audio' 
              : t('mutedAutoplayNotice')
            }
          </span>
          <button
            onClick={() => setShowMutedNotice(false)}
            className="ml-2 text-white/70 hover:text-white font-bold"
            aria-label={t('closeNotice')}
          >
            ✕
          </button>
        </div>
      )}

      {/* Controls */}
      {!videoError && (
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          <Button
            onClick={handleTogglePlay}
            size="icon"
            className="bg-white/90 hover:bg-white text-black rounded-full shadow-lg border border-white/20 backdrop-blur-sm"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          <Button
            onClick={handleToggleAudio}
            size="icon"
            className={`rounded-full shadow-lg border backdrop-blur-sm ${hasAudio ? 'bg-white/90 hover:bg-white text-black border-white/20' : 'bg-red-500/90 hover:bg-red-600 text-white border-red-300/20'}`}
            aria-label={hasAudio ? 'Mute video' : 'Unmute video'}
          >
            <Volume2 className="w-5 h-5" />
          </Button>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-black/50" aria-hidden="true"></div>

      <div className="absolute bottom-12 left-0 right-0 text-center text-white px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
          {t('heroTitle')}
        </h1>
      </div>
    </section>
  );
};

export default VideoHero;
