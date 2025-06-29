
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
  const [errorMessage, setErrorMessage] = useState('');

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

  // Initialize video settings
  useEffect(() => {
    setUseWebM(supportsWebM() && !isSafari());
    setIsMounted(true);
    
    // Set initial audio state based on device
    const isMobileSafari = isMobileDevice() || isSafari();
    if (isMobileSafari) {
      setShowPlayOverlay(true);
      setHasAudio(false);
    } else {
      setHasAudio(true);
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

  // Simplified video play with sound function
  const startVideoWithSound = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !videoFileExists) {
      console.warn('Cannot start video: video element or file not available');
      return;
    }

    try {
      console.log('Starting video with sound');
      
      // Reset video to beginning
      video.currentTime = 0;
      video.muted = false;
      setHasAudio(true);
      
      // For Safari, ensure video is loaded before playing
      if (isSafari() && video.readyState < 2) {
        console.log('Safari: waiting for video to load...');
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Video load timeout'));
          }, 5000);

          const onCanPlay = () => {
            clearTimeout(timeout);
            video.removeEventListener('canplay', onCanPlay);
            resolve(true);
          };
          
          video.addEventListener('canplay', onCanPlay);
          video.load();
        });
      }
      
      await video.play();
      setIsPlaying(true);
      setShowPlayOverlay(false);
      setUserInteracted(true);
      setVideoError(false);
      console.log('Video started successfully with sound');
      
    } catch (error) {
      console.warn('Video playback with sound failed, trying muted:', error);
      
      // Fallback to muted playback
      try {
        video.muted = true;
        setHasAudio(false);
        await video.play();
        setIsPlaying(true);
        setShowPlayOverlay(false);
        setUserInteracted(true);
        console.log('Fallback: Video started muted');
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
  }, []);

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
      
      // Reset overlay for mobile/Safari
      if (isMobileDevice() || isSafari()) {
        setShowPlayOverlay(true);
      }
    }
  }, [language, isMounted]);

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
      setUserInteracted(true);
    }
  }, [hasAudio, videoLoaded, videoFileExists]);

  // Simplified touch/click handlers
  const handlePlayButtonClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Play button clicked/touched');
    setUserInteracted(true);
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
        <div className="video-hero-title">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            {t('heroTitle')}
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section className="video-hero-container">
      {/* Video with proper aspect ratio */}
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
        className="video-hero-element"
        poster={posterSrc}
        width="1920"
        height="1080"
      >
        {useWebM && videoFileExists && <source src={videoWebM} type="video/webm" />}
        {videoFileExists && <source src={videoSrc} type="video/mp4" />}
      </video>

      {/* Play overlay for mobile/Safari */}
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

      {/* Hero title */}
      <div className="video-hero-title">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
          {t('heroTitle')}
        </h1>
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
