import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, AlertCircle } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';
import { isSafari, isIOSDevice, supportsWebM } from '@/utils/browserUtils';

const VideoHero = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isMobile = useIsMobile();
  
  const [hasAudio, setHasAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Browser detection - do once
  const browserIsSafari = isSafari();
  const browserIsIOS = isIOSDevice();
  const browserSupportsWebM = supportsWebM();

  const baseName = language === 'ro' ? 'musicgift_ro' : 'musicgift_eng';
  const videoSrc = `/uploads/${baseName}.mp4`;
  const videoWebM = `/uploads/${baseName}.webm`;
  const posterSrc = '/uploads/video_placeholder.png';

  // Check if video should autoplay based on session storage
  const shouldAutoplay = useCallback(() => {
    const playedLangKey = `played-${language}`;
    const sessionHasPlayed = sessionStorage.getItem(playedLangKey) === 'true';
    return !sessionHasPlayed;
  }, [language]);

  // Setup intersection observer
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    observerRef.current.observe(video);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Reset video state when language changes
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      setIsPlaying(false);
      setHasAudio(false);
      setVideoError(null);
      setIsVideoLoading(true);
      setShowPlayButton(false);
    }
  }, [language]);

  // Pause video when navigating away
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      setIsPlaying(false);
    }
  }, [location.pathname]);

  // Safari-specific autoplay strategy
  const attemptSafariAutoplay = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !browserIsSafari) return;

    try {
      // Always start muted for Safari
      video.muted = true;
      video.currentTime = 0;
      
      await video.play();
      setIsPlaying(true);
      setHasAudio(false);
      setShowPlayButton(false);
      
      // Mark as played in session
      const playedLangKey = `played-${language}`;
      sessionStorage.setItem(playedLangKey, 'true');
      
    } catch (error) {
      console.warn('Safari autoplay failed:', error);
      setShowPlayButton(true);
      setIsPlaying(false);
    }
  }, [language, browserIsSafari]);

  // Standard autoplay strategy for other browsers
  const attemptStandardAutoplay = useCallback(async () => {
    const video = videoRef.current;
    if (!video || browserIsSafari) return;

    try {
      // Try with sound first
      video.muted = false;
      video.currentTime = 0;
      
      await video.play();
      setIsPlaying(true);
      setHasAudio(true);
      setShowPlayButton(false);
      
      // Mark as played in session
      const playedLangKey = `played-${language}`;
      sessionStorage.setItem(playedLangKey, 'true');
      
    } catch (error) {
      console.warn('Autoplay with sound failed, trying muted:', error);
      try {
        video.muted = true;
        await video.play();
        setIsPlaying(true);
        setHasAudio(false);
        setShowPlayButton(false);
      } catch (mutedError) {
        console.warn('Muted autoplay failed:', mutedError);
        setShowPlayButton(true);
        setIsPlaying(false);
      }
    }
  }, [language, browserIsSafari]);

  // Attempt autoplay when conditions are met
  useEffect(() => {
    if (!isInView || isVideoLoading || videoError || !shouldAutoplay()) {
      return;
    }

    const timer = setTimeout(() => {
      if (browserIsSafari) {
        attemptSafariAutoplay();
      } else {
        attemptStandardAutoplay();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isInView, isVideoLoading, videoError, language, browserIsSafari, attemptSafariAutoplay, attemptStandardAutoplay]);

  const handleVideoError = useCallback((error: any) => {
    console.warn('Video loading error:', error);
    setVideoError('Video cannot be loaded');
    setIsVideoLoading(false);
    setIsPlaying(false);
    setShowPlayButton(false);
  }, []);

  const handleVideoLoad = useCallback(() => {
    setIsVideoLoading(false);
    setVideoError(null);
  }, []);

  const handleVideoEnd = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleTogglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || videoError) return;
    
    setHasUserInteracted(true);
    
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.currentTime = 0;
      // For Safari, keep muted unless user has explicitly enabled audio
      if (browserIsSafari && !hasUserInteracted) {
        video.muted = true;
        setHasAudio(false);
      } else {
        video.muted = !hasAudio;
      }
      
      video.play().then(() => {
        setIsPlaying(true);
        setShowPlayButton(false);
      }).catch(handleVideoError);
    }
  }, [isPlaying, hasAudio, videoError, browserIsSafari, hasUserInteracted, handleVideoError]);

  const handleToggleAudio = useCallback(() => {
    const video = videoRef.current;
    if (!video || videoError) return;
    
    setHasUserInteracted(true);
    
    if (hasAudio) {
      video.muted = true;
      setHasAudio(false);
    } else {
      video.muted = false;
      setHasAudio(true);
    }
  }, [hasAudio, videoError]);

  const mobileHeight = isMobile ? `${(window.innerWidth * 9) / 16}px` : undefined;

  return (
    <section
      className={`video-hero relative overflow-hidden video-hero-optimized critical-resource ${isMobile ? '' : 'h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen'}`}
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
        <div className="absolute inset-0 video-error-fallback flex items-center justify-center" role="alert">
          <div className="text-center text-white">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-white/80" aria-hidden="true" />
            <h3 className="text-lg font-semibold mb-2">Video Unavailable</h3>
            <p className="text-sm opacity-90">The video content is temporarily unavailable</p>
          </div>
        </div>
      ) : (
        <>
          <video
            key={language}
            ref={videoRef}
            playsInline={browserIsIOS}
            preload="metadata"
            muted={!hasAudio}
            onEnded={handleVideoEnd}
            onError={handleVideoError}
            onLoadedData={handleVideoLoad}
            onCanPlay={handleVideoLoad}
            className={`absolute ${isMobile ? 'top-16' : 'top-0'} left-0 w-full ${isMobile ? 'h-auto' : 'h-full'} object-cover hw-accelerated ${isVideoLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            poster={posterSrc}
            aria-label={`MusicGift promotional video in ${language === 'ro' ? 'Romanian' : 'English'}`}
          >
            {/* For Safari, prioritize MP4. For others, try WebM first if supported */}
            {browserIsSafari ? (
              <>
                <source src={videoSrc} type="video/mp4" onError={handleVideoError} />
                {browserSupportsWebM && <source src={videoWebM} type="video/webm" onError={handleVideoError} />}
              </>
            ) : (
              <>
                {browserSupportsWebM && <source src={videoWebM} type="video/webm" onError={handleVideoError} />}
                <source src={videoSrc} type="video/mp4" onError={handleVideoError} />
              </>
            )}
            <track 
              kind="captions" 
              src={`/uploads/captions_${language}.vtt`} 
              srcLang={language} 
              label={language === 'ro' ? 'Română' : 'English'}
              default 
            />
          </video>

          {/* Safari play button overlay */}
          {showPlayButton && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-20">
              <Button 
                onClick={handleTogglePlay}
                size="icon"
                className="w-16 h-16 bg-white/90 text-black rounded-full shadow-lg hover:bg-white"
                aria-label="Play video"
              >
                <Play className="w-8 h-8 ml-1" aria-hidden="true" />
              </Button>
            </div>
          )}

          {/* Control buttons */}
          {(isPlaying || hasUserInteracted) && !showPlayButton && (
            <div className="absolute top-24 right-4 z-30 flex gap-2">
              <Button 
                onClick={handleTogglePlay} 
                size="icon" 
                className="bg-white/80 text-black rounded-full shadow"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? <Pause className="w-5 h-5" aria-hidden="true" /> : <Play className="w-5 h-5" aria-hidden="true" />}
              </Button>
              {hasUserInteracted && (
                <Button 
                  onClick={handleToggleAudio} 
                  size="icon" 
                  className={`${hasAudio ? 'bg-white/80 text-black' : 'bg-white/40 text-white'} rounded-full shadow`}
                  aria-label={hasAudio ? 'Mute video' : 'Unmute video'}
                >
                  <Volume2 className="w-5 h-5" aria-hidden="true" />
                </Button>
              )}
            </div>
          )}
        </>
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-black/50" aria-hidden="true"></div>

      <div className="absolute bottom-12 left-0 right-0 text-center text-white px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent hw-accelerated">
          {t('heroTitle')}
        </h1>
      </div>
    </section>
  );
};

export default VideoHero;
