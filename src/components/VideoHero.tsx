
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
  const [videoError, setVideoError] = useState(false);
  const [videoFileExists, setVideoFileExists] = useState(true);

  const baseName = language === 'ro' ? 'musicgift_ro' : 'musicgift_eng';
  const videoSrc = `/uploads/${baseName}.mp4`;
  const videoWebM = `/uploads/${baseName}.webm`;
  const posterSrc = '/uploads/video_placeholder.png';

  // Check if video file exists
  const checkVideoFile = useCallback(async (url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.warn(`Video file check failed for ${url}:`, error);
      return false;
    }
  }, []);

  // Initialize video format support and Safari detection
  useEffect(() => {
    setUseWebM(supportsWebM() && !isSafari());
    setIsMounted(true);
    
    // Always show play overlay on mobile Safari or mobile devices
    if (isMobileDevice() || isSafari()) {
      setShowPlayOverlay(true);
      setHasAudio(false);
    } else {
      setHasAudio(true);
    }

    // Check if video files exist
    const checkFiles = async () => {
      const mp4Exists = await checkVideoFile(videoSrc);
      console.log(`Video file exists for ${language}:`, mp4Exists, videoSrc);
      
      if (!mp4Exists) {
        console.warn(`Romanian video file missing: ${videoSrc}`);
        setVideoError(true);
        setVideoFileExists(false);
      } else {
        setVideoFileExists(true);
      }
    };

    checkFiles();
  }, [language, videoSrc, checkVideoFile]);

  const startVideoWithSound = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !videoFileExists) return;

    try {
      console.log('Starting video with sound on Safari mobile');
      
      // Safari-specific preparation
      if (isSafari()) {
        video.load();
        
        // Wait for video to be ready with timeout
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            video.removeEventListener('canplay', onCanPlay);
            video.removeEventListener('error', onError);
            reject(new Error('Video load timeout'));
          }, 5000);

          const onCanPlay = () => {
            clearTimeout(timeout);
            video.removeEventListener('canplay', onCanPlay);
            video.removeEventListener('error', onError);
            resolve(true);
          };
          
          const onError = () => {
            clearTimeout(timeout);
            video.removeEventListener('canplay', onCanPlay);
            video.removeEventListener('error', onError);
            reject(new Error('Video failed to load'));
          };
          
          video.addEventListener('canplay', onCanPlay);
          video.addEventListener('error', onError);
        });
      }

      video.muted = false;
      setHasAudio(true);
      video.currentTime = 0;
      
      await video.play();
      setIsPlaying(true);
      setShowPlayOverlay(false);
      setUserInteracted(true);
      setVideoError(false);
      console.log('Video started successfully with sound');
    } catch (error) {
      console.warn('Video playback with sound failed:', error);
      
      // Fallback to muted play
      try {
        const video = videoRef.current;
        if (video) {
          video.muted = true;
          setHasAudio(false);
          await video.play();
          setIsPlaying(true);
          setShowPlayOverlay(false);
          setUserInteracted(true);
          console.log('Fallback: Video started muted');
        }
      } catch (mutedError) {
        console.error('Even muted video playback failed:', mutedError);
        setVideoError(true);
      }
    }
  }, [videoFileExists]);

  // Video load handler
  const handleVideoCanPlay = useCallback(() => {
    console.log('Video can play - loaded successfully');
    setVideoLoaded(true);
    setVideoError(false);
  }, []);

  const handleVideoError = useCallback((e: any) => {
    console.error('Video failed to load:', e);
    setVideoError(true);
    setVideoLoaded(false);
    setVideoFileExists(false);
  }, []);

  // Handle language changes - restart video
  useEffect(() => {
    if (!isMounted) return;
    
    const video = videoRef.current;
    if (video) {
      video.pause();
      setIsPlaying(false);
      setVideoLoaded(false);
      setVideoError(false);
      
      // Always show overlay on mobile/Safari for new video
      if (isMobileDevice() || isSafari()) {
        setShowPlayOverlay(true);
      }
    }
  }, [language, isMounted]);

  // Handle route changes - pause when leaving home page
  useEffect(() => {
    const video = videoRef.current;
    if (video && videoLoaded) {
      if (location.pathname !== '/') {
        video.pause();
        setIsPlaying(false);
      }
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
      setUserInteracted(true);
    }
  }, [hasAudio, videoLoaded, videoFileExists]);

  const handlePlayWithSound = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Play button touched');
    setUserInteracted(true);
    startVideoWithSound();
  }, [startVideoWithSound]);

  // Enhanced mobile video interaction handlers
  const handleVideoTouch = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if ((isMobileDevice() || isSafari()) && showPlayOverlay) {
      handlePlayWithSound(e);
    }
  }, [showPlayOverlay, handlePlayWithSound]);

  const handleVideoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if ((isMobileDevice() || isSafari()) && showPlayOverlay) {
      handlePlayWithSound(e);
    }
  }, [showPlayOverlay, handlePlayWithSound]);

  if (!isMounted) {
    return (
      <section className="mobile-video-hero">
        <div 
          className="mobile-video-placeholder"
          style={{ 
            backgroundImage: `url(${posterSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      </section>
    );
  }

  // Show error state if video file doesn't exist
  if (!videoFileExists && videoError) {
    return (
      <section className="mobile-video-hero">
        <div 
          className="mobile-video-placeholder"
          style={{ 
            backgroundImage: `url(${posterSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="mobile-video-error">
          <p className="text-white text-center bg-black/60 p-4 rounded">
            {language === 'ro' 
              ? 'Videoul în română se încarcă în curând...' 
              : 'Video is loading, please try refreshing the page.'
            }
          </p>
        </div>
        {/* Hero title overlay */}
        <div className="mobile-video-title">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            {t('heroTitle')}
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section className="mobile-video-hero">
      {/* Video with proper 16:9 aspect ratio on mobile */}
      <video
        key={`${language}-${videoFileExists}`}
        ref={videoRef}
        autoPlay={false}
        playsInline={true}
        preload="metadata"
        muted={!hasAudio}
        controls={false}
        disablePictureInPicture
        onEnded={handleVideoEnd}
        onCanPlay={handleVideoCanPlay}
        onError={handleVideoError}
        onClick={handleVideoClick}
        onTouchStart={handleVideoTouch}
        className="mobile-video-element"
        poster={posterSrc}
        width="1920"
        height="1080"
      >
        {useWebM && videoFileExists && <source src={videoWebM} type="video/webm" />}
        {videoFileExists && <source src={videoSrc} type="video/mp4" />}
      </video>

      {/* Mobile/Safari Play Overlay */}
      {showPlayOverlay && (
        <div className="mobile-video-overlay">
          <Button
            onClick={handlePlayWithSound}
            onTouchStart={handlePlayWithSound}
            size="lg"
            className="mobile-play-button"
            aria-label="Redă videoul cu sunet"
          >
            <Play className="w-8 h-8 mr-3" />
            {t('tapToPlayWithSound', 'Tap to play with sound')}
          </Button>
        </div>
      )}

      {/* Video controls */}
      <div className="mobile-video-controls">
        <Button 
          onClick={handleTogglePlay} 
          size="icon" 
          className="mobile-control-button"
          aria-label={isPlaying ? "Pauză video" : "Redă video"}
          disabled={!videoFileExists}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </Button>
        <Button 
          onClick={handleToggleAudio} 
          size="icon" 
          className="mobile-control-button"
          aria-label={hasAudio ? "Dezactivează sunetul" : "Activează sunetul"}
          disabled={!videoFileExists}
        >
          {hasAudio ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </Button>
      </div>

      {/* Gradient overlay */}
      <div className="mobile-video-gradient" />

      {/* Hero title */}
      <div className="mobile-video-title">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
          {t('heroTitle')}
        </h1>
      </div>

      {/* Error state */}
      {videoError && videoFileExists && (
        <div className="mobile-video-error">
          <p className="text-white text-center">
            {t('videoError', 'Video failed to load. Please refresh the page.')}
          </p>
        </div>
      )}
    </section>
  );
};

export default VideoHero;
