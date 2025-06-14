
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';

const supportsWebM = (): boolean => {
  const video = document.createElement('video');
  return video.canPlayType('video/webm') !== '';
};

const isSafari = (): boolean => {
  const userAgent = navigator.userAgent;
  return /Safari/.test(userAgent) && !/Chrome/.test(userAgent) && !/Chromium/.test(userAgent);
};

const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

const VideoHero = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();
  const [hasAudio, setHasAudio] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSafariBrowser, setIsSafariBrowser] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [showMutedNotice, setShowMutedNotice] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const baseName = language === 'ro' ? 'musicgift_ro' : 'musicgift_eng';
  const videoSrc = `/uploads/${baseName}.mp4`;
  const videoWebM = `/uploads/${baseName}.webm`;
  const posterSrc = '/uploads/video_placeholder.png';

  // Detect browser and device early
  useEffect(() => {
    setIsMounted(true);
    setIsSafariBrowser(isSafari());
    setIsIOSDevice(isIOS());
    setIsPlaying(false);
    setHasAudio(false);
    setVideoError(null);
    setShowMutedNotice(false);
    setIsVideoLoading(true);
    setUserInteracted(false);
  }, [language]);

  // Handle user interaction for Safari
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true);
    };

    if (isSafariBrowser || isIOSDevice) {
      document.addEventListener('click', handleUserInteraction, { once: true });
      document.addEventListener('touchstart', handleUserInteraction, { once: true });
    }

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [isSafariBrowser, isIOSDevice]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isMounted) return;

    // Don't autoplay if navigating back
    try {
      const entries = performance.getEntriesByType('navigation');
      if (entries.length > 0) {
        const navEntry = entries[0] as PerformanceNavigationTiming;
        if (typeof navEntry.type === 'number' && navEntry.type === 2) {
          setIsVideoLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Performance API not available');
    }

    const attemptVideoPlay = async () => {
      try {
        // Safari-specific loading strategy
        if (isSafariBrowser || isIOSDevice) {
          // For Safari/iOS, start with muted and wait for user interaction
          video.muted = true;
          video.playsInline = true;
          
          // Load the video first
          if (video.readyState < 3) {
            video.load();
            await new Promise((resolve, reject) => {
              const onCanPlay = () => {
                video.removeEventListener('canplay', onCanPlay);
                video.removeEventListener('error', onError);
                resolve(true);
              };
              const onError = () => {
                video.removeEventListener('canplay', onCanPlay);
                video.removeEventListener('error', onError);
                reject(new Error('Video failed to load'));
              };
              video.addEventListener('canplay', onCanPlay, { once: true });
              video.addEventListener('error', onError, { once: true });
              
              // Timeout after 10 seconds
              setTimeout(() => {
                video.removeEventListener('canplay', onCanPlay);
                video.removeEventListener('error', onError);
                reject(new Error('Video load timeout'));
              }, 10000);
            });
          }

          // Try muted autoplay for Safari
          await video.play();
          setIsPlaying(true);
          setHasAudio(false);
          setShowMutedNotice(true);
          setIsVideoLoading(false);
          
        } else {
          // Non-Safari browsers - try normal autoplay flow
          if (video.readyState < 3) {
            video.load();
            await new Promise(resolve => {
              video.addEventListener('canplay', resolve, { once: true });
            });
          }
          
          // Try with sound first
          video.muted = false;
          await video.play();
          setIsPlaying(true);
          setHasAudio(true);
          setIsVideoLoading(false);
        }
        
      } catch (err) {
        console.warn('Video autoplay failed:', err);
        
        if (!isSafariBrowser && !isIOSDevice) {
          // For non-Safari, try muted fallback
          try {
            video.muted = true;
            await video.play();
            setIsPlaying(true);
            setHasAudio(false);
            setShowMutedNotice(true);
            setIsVideoLoading(false);
          } catch (e) {
            console.warn('Muted autoplay also failed:', e);
            setVideoError('Video cannot be played.');
            setIsVideoLoading(false);
          }
        } else {
          // For Safari, show poster and wait for user interaction
          setVideoError(null);
          setIsVideoLoading(false);
          setIsPlaying(false);
        }
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(attemptVideoPlay, 100);
    return () => clearTimeout(timer);
  }, [language, isMounted, isSafariBrowser, isIOSDevice]);

  const handleVideoError = useCallback((error: any) => {
    console.warn('Video loading error:', error);
    setVideoError('Video cannot be loaded');
    setIsVideoLoading(false);
    setIsPlaying(false);
  }, []);

  const handleTogglePlay = async () => {
    const video = videoRef.current;
    if (!video || videoError) return;
    
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      try {
        video.currentTime = 0;
        video.muted = !hasAudio;
        
        // For Safari/iOS with no user interaction, ensure muted playback
        if ((isSafariBrowser || isIOSDevice) && !userInteracted) {
          video.muted = true;
          setHasAudio(false);
        }
        
        await video.play();
        setIsPlaying(true);
      } catch (error) {
        handleVideoError(error);
      }
    }
  };

  const handleToggleAudio = useCallback(async () => {
    const video = videoRef.current;
    if (!video || videoError) return;
    
    // For Safari/iOS, user interaction is required for unmuted playback
    if ((isSafariBrowser || isIOSDevice) && !hasAudio && !userInteracted) {
      setUserInteracted(true);
    }
    
    try {
      video.muted = hasAudio;
      setHasAudio(!hasAudio);
      setShowMutedNotice(false);
      
      // If video is not playing and we're unmuting, try to play
      if (!hasAudio && !isPlaying) {
        await video.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.warn('Audio toggle failed:', error);
      // Fallback to muted if unmuting fails
      video.muted = true;
      setHasAudio(false);
    }
  }, [hasAudio, videoError, isPlaying, isSafariBrowser, isIOSDevice, userInteracted]);

  // Calculate 16:9 aspect ratio height for mobile
  const videoHeight = isMobile ? `${(window.innerWidth * 9) / 16}px` : undefined;

  if (!isMounted) return null;

  return (
    <>
      {/* Video Controls positioned after navbar */}
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
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${posterSrc})` }}
          aria-hidden="true"
        ></div>

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
          <video
            key={language}
            ref={videoRef}
            playsInline
            preload={isSafariBrowser || isIOSDevice ? "metadata" : "metadata"}
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
            {/* For Safari, only use MP4 to avoid any WebM conflicts */}
            {isSafariBrowser || isIOSDevice ? (
              <source src={videoSrc} type="video/mp4" />
            ) : (
              <>
                {supportsWebM() && <source src={videoWebM} type="video/webm" />}
                <source src={videoSrc} type="video/mp4" />
              </>
            )}
            
            {/* Add captions */}
            <track
              kind="captions"
              src={`/uploads/captions_${language === 'ro' ? 'ro' : 'eng'}.vtt`}
              srcLang={language === 'ro' ? 'ro' : 'en'}
              label={language === 'ro' ? 'Română' : 'English'}
              default
            />
          </video>
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

        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-black/50 z-5" aria-hidden="true"></div>

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
