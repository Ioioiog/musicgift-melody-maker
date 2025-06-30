
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
  const [userInteracted, setUserInterracted] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoFileExists, setVideoFileExists] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSafariBrowser, setIsSafariBrowser] = useState(false);

  // Debug translation context
  const heroTitle = t('heroTitle');
  const heroTitleFallback = 'Transformă Emoțiile în Muzică';
  
  // Add debug logging
  useEffect(() => {
    console.log('VideoHero Debug Info:');
    console.log('- Language:', language);
    console.log('- Hero Title from translation:', heroTitle);
    console.log('- Translation function type:', typeof t);
    console.log('- Is mounted:', isMounted);
    
    // Test if the title element exists in DOM
    setTimeout(() => {
      const titleElement = document.querySelector('.video-hero-title');
      if (titleElement) {
        console.log('- Title element found in DOM');
        console.log('- Title element text content:', titleElement.textContent);
        console.log('- Title element computed styles:', {
          color: window.getComputedStyle(titleElement).color,
          zIndex: window.getComputedStyle(titleElement).zIndex,
          position: window.getComputedStyle(titleElement).position,
          display: window.getComputedStyle(titleElement).display,
          opacity: window.getComputedStyle(titleElement).opacity,
          visibility: window.getComputedStyle(titleElement).visibility
        });
      } else {
        console.log('- Title element NOT found in DOM');
      }
    }, 1000);
  }, [language, heroTitle, t, isMounted]);

  const baseName = language === 'ro' ? 'musicgift_ro' : 'musicgift_eng';
  const videoSrc = `/uploads/${baseName}.mp4`;
  const videoWebM = `/uploads/${baseName}.webm`;
  const posterSrc = '/uploads/video_placeholder.png';

  // Enhanced video file existence check
  const checkVideoFile = useCallback(async (url: string) => {
    try {
      console.log(`Checking video file: ${url}`);
      const response = await fetch(url, { method: 'HEAD' });
      const exists = response.ok;
      console.log(`Video file ${url} exists: ${exists}`);
      return exists;
    } catch (error) {
      console.error(`Video file check failed for ${url}:`, error);
      return false;
    }
  }, []);

  // Initialize video settings and browser detection
  useEffect(() => {
    const safariDetected = isSafari();
    const mobileDetected = isMobileDevice();
    
    setIsSafariBrowser(safariDetected);
    setUseWebM(supportsWebM() && !safariDetected);
    setIsMounted(true);
    
    console.log(`Browser detection - Safari: ${safariDetected}, Mobile: ${mobileDetected}`);
    
    // Set initial audio and overlay state based on browser
    if (safariDetected || mobileDetected) {
      setShowPlayOverlay(true);
      setHasAudio(false);
      console.log('Safari/Mobile detected - showing play overlay, audio muted');
    } else {
      setShowPlayOverlay(false);
      setHasAudio(true);
      console.log('Non-Safari desktop detected - enabling autoplay with sound');
    }

    // Check video file existence
    const checkFiles = async () => {
      try {
        const mp4Exists = await checkVideoFile(videoSrc);
        console.log(`Video file status for ${language}: MP4 exists: ${mp4Exists}`);
        
        if (!mp4Exists) {
          console.warn(`Video file missing: ${videoSrc}`);
          setVideoError(true);
          setVideoFileExists(false);
          setErrorMessage(language === 'ro' 
            ? 'Videoul în română se încarcă în curând...' 
            : 'Video is loading, please try refreshing the page.'
          );
        } else {
          setVideoFileExists(true);
          setVideoError(false);
          setErrorMessage('');
        }
      } catch (error) {
        console.error('Error checking video files:', error);
        setVideoError(true);
        setVideoFileExists(false);
        setErrorMessage('Failed to load video files');
      }
    };

    checkFiles();
  }, [language, videoSrc, checkVideoFile]);

  // Attempt autoplay for non-Safari browsers
  const attemptAutoplay = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !videoFileExists || isSafariBrowser) {
      console.log('Skipping autoplay - Safari browser or video not available');
      return;
    }

    try {
      console.log('Attempting autoplay with sound for non-Safari browser');
      
      // Reset video to beginning
      video.currentTime = 0;
      video.muted = false;
      
      await video.play();
      setIsPlaying(true);
      setHasAudio(true);
      setUserInterracted(true);
      console.log('Autoplay with sound successful');
      
    } catch (error) {
      console.warn('Autoplay with sound failed, trying muted fallback:', error);
      
      // Fallback to muted autoplay
      try {
        video.muted = true;
        await video.play();
        setIsPlaying(true);
        setHasAudio(false);
        console.log('Fallback: Autoplay muted successful');
      } catch (mutedError) {
        console.error('Even muted autoplay failed:', mutedError);
        setShowPlayOverlay(true);
      }
    }
  }, [videoFileExists, isSafariBrowser]);

  // Simplified video play with sound function for Safari manual interaction
  const startVideoWithSound = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !videoFileExists) {
      console.warn('Cannot start video: video element or file not available');
      return;
    }

    try {
      console.log('Starting video with sound (manual interaction)');
      
      // Reset video to beginning
      video.currentTime = 0;
      video.muted = false;
      setHasAudio(true);
      
      await video.play();
      setIsPlaying(true);
      setShowPlayOverlay(false);
      setUserInterracted(true);
      setVideoError(false);
      console.log('Manual video start successful with sound');
      
    } catch (error) {
      console.warn('Manual video playback with sound failed, trying muted:', error);
      
      // Fallback to muted playback
      try {
        video.muted = true;
        setHasAudio(false);
        await video.play();
        setIsPlaying(true);
        setShowPlayOverlay(false);
        setUserInterracted(true);
        console.log('Fallback: Manual video started muted');
      } catch (mutedError) {
        console.error('Even muted video playback failed:', mutedError);
        setVideoError(true);
        setErrorMessage('Video playback failed. Please try refreshing the page.');
      }
    }
  }, [videoFileExists]);

  // Video event handlers
  const handleVideoCanPlay = useCallback(() => {
    console.log('Video can play - loaded successfully');
    setVideoLoaded(true);
    setVideoError(false);
    setErrorMessage('');
    
    // Attempt autoplay for non-Safari browsers once video is ready
    if (!isSafariBrowser && !userInteracted) {
      attemptAutoplay();
    }
  }, [isSafariBrowser, userInteracted, attemptAutoplay]);

  const handleVideoError = useCallback((e: any) => {
    console.error('Video failed to load:', e);
    setVideoError(true);
    setVideoLoaded(false);
    setVideoFileExists(false);
    setErrorMessage('Video failed to load. Please refresh the page.');
  }, []);

  // Handle language changes
  useEffect(() => {
    if (!isMounted) return;
    
    const video = videoRef.current;
    if (video) {
      video.pause();
      setIsPlaying(false);
      setVideoLoaded(false);
      setVideoError(false);
      setErrorMessage('');
      setUserInterracted(false);
      
      // Reset overlay for Safari/mobile
      if (isSafariBrowser || isMobileDevice()) {
        setShowPlayOverlay(true);
      }
    }
  }, [language, isMounted, isSafariBrowser]);

  // Handle route changes
  useEffect(() => {
    const video = videoRef.current;
    if (video && videoLoaded && location.pathname !== '/') {
      video.pause();
      setIsPlaying(false);
    }
  }, [location.pathname, videoLoaded]);

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video || !videoLoaded || !videoFileExists) return;
    
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
    if (!video || !videoLoaded || !videoFileExists) return;
    
    if (hasAudio) {
      video.muted = true;
      setHasAudio(false);
    } else {
      video.muted = false;
      setHasAudio(true);
      setUserInterracted(true);
    }
  }, [hasAudio, videoLoaded, videoFileExists]);

  // Simplified touch/click handlers for Safari
  const handlePlayButtonClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Play button clicked/touched');
    setUserInterracted(true);
    startVideoWithSound();
  }, [startVideoWithSound]);

  // Loading state
  if (!isMounted) {
    return (
      <section className="video-hero-container">
        <div 
          className="video-hero-placeholder"
          style={{ 
            backgroundImage: `url(${posterSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      </section>
    );
  }

  // Error state
  if (!videoFileExists || videoError) {
    return (
      <section className="video-hero-container">
        <div 
          className="video-hero-placeholder"
          style={{ 
            backgroundImage: `url(${posterSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="video-hero-error">
          <p className="text-white text-center bg-black/60 p-4 rounded max-w-md mx-auto">
            {errorMessage || (language === 'ro' 
              ? 'Videoul în română se încarcă în curând...' 
              : 'Video is loading, please try refreshing the page.'
            )}
          </p>
        </div>
        {/* Fixed content overlay with proper mobile navigation spacing */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-8">
          <div className="max-w-6xl mx-auto pt-32 sm:pt-24 md:pt-16">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight video-hero-title">
                {heroTitle || heroTitleFallback}
              </h1>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="video-hero-container">
      {/* Video with browser-specific autoplay settings */}
      <video
        key={`${language}-${videoFileExists}`}
        ref={videoRef}
        autoPlay={!isSafariBrowser}
        playsInline={true}
        preload="metadata"
        muted={isSafariBrowser ? true : !hasAudio}
        controls={false}
        disablePictureInPicture
        onEnded={handleVideoEnd}
        onCanPlay={handleVideoCanPlay}
        onError={handleVideoError}
        className="video-hero-element"
        poster={posterSrc}
        width="1920"
        height="1080"
      >
        {useWebM && videoFileExists && <source src={videoWebM} type="video/webm" />}
        {videoFileExists && <source src={videoSrc} type="video/mp4" />}
      </video>

      {/* Play overlay - only shown for Safari/mobile browsers */}
      {showPlayOverlay && (
        <div className="video-hero-overlay">
          <Button
            onClick={handlePlayButtonClick}
            onTouchStart={handlePlayButtonClick}
            size="lg"
            className="video-hero-play-button"
            aria-label="Play video with sound"
          >
            <Play className="w-8 h-8 mr-3" />
            {t('tapToPlayWithSound', 'Tap to play with sound')}
          </Button>
        </div>
      )}

      {/* Video controls */}
      <div className="video-hero-controls">
        <Button 
          onClick={handleTogglePlay} 
          size="icon" 
          className="video-hero-control-button"
          aria-label={isPlaying ? "Pause video" : "Play video"}
          disabled={!videoFileExists}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </Button>
        <Button 
          onClick={handleToggleAudio} 
          size="icon" 
          className="video-hero-control-button"
          aria-label={hasAudio ? "Mute audio" : "Unmute audio"}
          disabled={!videoFileExists}
        >
          {hasAudio ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </Button>
      </div>

      {/* Gradient overlay */}
      <div className="video-hero-gradient" />

      {/* Enhanced title overlay with proper mobile navigation spacing */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-8">
        <div className="max-w-6xl mx-auto pt-32 sm:pt-24 md:pt-16">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight video-hero-title">
              {heroTitle || heroTitleFallback}
            </h1>
          </div>
        </div>
      </div>

      {/* Runtime error display */}
      {videoError && videoFileExists && (
        <div className="video-hero-error">
          <p className="text-white text-center bg-red-600/80 p-4 rounded max-w-md mx-auto">
            {errorMessage || t('videoError', 'Video failed to load. Please refresh the page.')}
          </p>
        </div>
      )}
    </section>
  );
};

export default VideoHero;
