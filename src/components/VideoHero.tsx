
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const VideoHero = () => {
  const { t, language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isMobile = useIsMobile();
  
  // Browser detection - done once at component mount
  const [isSafari] = useState(() => {
    if (typeof window === 'undefined') return false;
    const userAgent = navigator.userAgent;
    return /Safari/.test(userAgent) && !/Chrome/.test(userAgent) && !/Chromium/.test(userAgent);
  });
  
  const [isIOS] = useState(() => {
    if (typeof window === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  });

  // State management
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [showMutedNotice, setShowMutedNotice] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);

  const baseName = language === 'ro' ? 'musicgift_ro' : 'musicgift_eng';
  const videoSrc = `/uploads/${baseName}.mp4`;
  const posterSrc = '/uploads/video_placeholder.png';

  // Reset state when language changes
  useEffect(() => {
    setIsPlaying(false);
    setHasAudio(false);
    setVideoError(null);
    setShowMutedNotice(false);
    setShowPlayButton(false);
    setUserInteracted(false);
    setIsVideoLoading(true);
  }, [language]);

  // Handle user interaction for Safari
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true);
    };

    if (isSafari || isIOS) {
      document.addEventListener('click', handleUserInteraction, { once: true });
      document.addEventListener('touchstart', handleUserInteraction, { once: true });
      
      return () => {
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
      };
    }
  }, [isSafari, isIOS]);

  // Safari-specific autoplay attempt
  const attemptSafariAutoplay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return false;

    try {
      video.muted = true;
      video.playsInline = true;
      
      // Wait for video to be ready
      if (video.readyState < 2) {
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('Load timeout')), 5000);
          const onCanPlay = () => {
            clearTimeout(timeout);
            resolve(true);
          };
          video.addEventListener('canplay', onCanPlay, { once: true });
        });
      }

      await video.play();
      setIsPlaying(true);
      setHasAudio(false);
      setShowMutedNotice(true);
      setIsVideoLoading(false);
      return true;
    } catch (error) {
      console.log('Safari autoplay failed, showing play button');
      setShowPlayButton(true);
      setIsVideoLoading(false);
      return false;
    }
  }, []);

  // Standard autoplay attempt for other browsers
  const attemptStandardAutoplay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return false;

    try {
      // First try with sound
      video.muted = false;
      await video.play();
      setIsPlaying(true);
      setHasAudio(true);
      setIsVideoLoading(false);
      return true;
    } catch (error) {
      try {
        // Fallback to muted
        video.muted = true;
        await video.play();
        setIsPlaying(true);
        setHasAudio(false);
        setShowMutedNotice(true);
        setIsVideoLoading(false);
        return true;
      } catch (e) {
        console.warn('Autoplay failed completely');
        setShowPlayButton(true);
        setIsVideoLoading(false);
        return false;
      }
    }
  }, []);

  // Intersection Observer setup
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    observerRef.current.observe(video);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [language]);

  // Autoplay when video enters viewport
  useEffect(() => {
    if (!isInViewport || isPlaying || videoError) return;

    const timer = setTimeout(() => {
      if (isSafari || isIOS) {
        attemptSafariAutoplay();
      } else {
        attemptStandardAutoplay();
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [isInViewport, isPlaying, videoError, isSafari, isIOS, attemptSafariAutoplay, attemptStandardAutoplay]);

  const handleVideoError = useCallback(() => {
    setVideoError('Video cannot be loaded');
    setIsVideoLoading(false);
    setIsPlaying(false);
  }, []);

  const handleManualPlay = async () => {
    const video = videoRef.current;
    if (!video || videoError) return;
    
    try {
      video.currentTime = 0;
      video.muted = !hasAudio;
      
      if ((isSafari || isIOS) && !hasAudio) {
        video.muted = true;
      }
      
      await video.play();
      setIsPlaying(true);
      setShowPlayButton(false);
      setUserInteracted(true);
    } catch (error) {
      handleVideoError();
    }
  };

  const handleTogglePlay = async () => {
    const video = videoRef.current;
    if (!video || videoError) return;
    
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      await handleManualPlay();
    }
  };

  const handleToggleAudio = useCallback(async () => {
    const video = videoRef.current;
    if (!video || videoError) return;
    
    if ((isSafari || isIOS) && !hasAudio && !userInteracted) {
      setUserInteracted(true);
    }
    
    try {
      video.muted = hasAudio;
      setHasAudio(!hasAudio);
      setShowMutedNotice(false);
      
      if (!hasAudio && !isPlaying) {
        await video.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.warn('Audio toggle failed:', error);
      video.muted = true;
      setHasAudio(false);
    }
  }, [hasAudio, videoError, isPlaying, isSafari, isIOS, userInteracted]);

  const videoHeight = isMobile ? `${(window.innerWidth * 9) / 16}px` : undefined;

  return (
    <>
      {/* Video Controls */}
      {!videoError && (
        <div className="fixed top-16 right-4 z-[60] flex gap-3">
          <Button
            onClick={handleTogglePlay}
            size="icon"
            className="bg-black/80 hover:bg-black/90 text-white rounded-full shadow-xl border-2 border-white/30 backdrop-blur-md w-12 h-12 transition-all duration-200 hover:scale-105"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </Button>
          <Button
            onClick={handleToggleAudio}
            size="icon"
            className={`rounded-full shadow-xl border-2 backdrop-blur-md w-12 h-12 transition-all duration-200 hover:scale-105 ${
              hasAudio 
                ? 'bg-black/80 hover:bg-black/90 text-white border-white/30' 
                : 'bg-red-600/90 hover:bg-red-700/90 text-white border-red-400/50'
            }`}
            aria-label={hasAudio ? 'Mute video' : 'Unmute video'}
          >
            {hasAudio ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </Button>
        </div>
      )}

      <section
        className={`video-hero relative overflow-hidden ${isMobile ? '' : 'h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen'}`}
        style={isMobile && videoHeight ? { height: videoHeight } : {}}
        role="banner"
        aria-label="Hero video section"
      >
        {/* Background poster */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${posterSrc})` }}
          aria-hidden="true"
        />

        {videoError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-black/70 z-10" role="alert">
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
          <>
            <video
              key={language}
              ref={videoRef}
              playsInline
              preload={isSafari || isIOS ? "metadata" : "auto"}
              muted={!hasAudio}
              onError={handleVideoError}
              onLoadStart={() => setIsVideoLoading(true)}
              onCanPlay={() => setIsVideoLoading(false)}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${isVideoLoading ? 'opacity-0' : 'opacity-100'}`}
              style={isMobile ? { height: videoHeight } : {}}
              poster={posterSrc}
              aria-label={`MusicGift promotional video in ${language === 'ro' ? 'Romanian' : 'English'}`}
              webkit-playsinline="true"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>

            {/* Safari Play Button Overlay */}
            {showPlayButton && (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <Button
                  onClick={handleManualPlay}
                  size="lg"
                  className="bg-black/80 hover:bg-black/90 text-white rounded-full shadow-2xl border-4 border-white/50 backdrop-blur-md w-20 h-20 transition-all duration-200 hover:scale-110"
                  aria-label="Play video"
                >
                  <Play className="w-10 h-10 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}

        {/* Toast Notification */}
        {showMutedNotice && (
          <div className="absolute top-20 right-4 z-[60] bg-black/90 text-white text-sm px-4 py-2 rounded-lg shadow-lg flex items-start gap-2 max-w-xs border border-white/20">
            <span className="pt-0.5">🔇</span>
            <span className="flex-1">{t('mutedAutoplayNotice')}</span>
            <button
              onClick={() => setShowMutedNotice(false)}
              className="ml-2 text-white/70 hover:text-white font-bold"
              aria-label={t('closeNotice')}
            >
              ✕
            </button>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-black/50 z-5" aria-hidden="true" />

        <div className="absolute bottom-12 left-0 right-0 text-center text-white px-4 z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            {t('heroTitle')}
          </h1>
        </div>
      </section>
    </>
  );
};

export default VideoHero;
