import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, AlertCircle } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';

const supportsWebM = (): boolean => {
  const video = document.createElement('video');
  return video.canPlayType('video/webm') !== '';
};

const VideoHero = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();
  const [hasAudio, setHasAudio] = useState(false);
  const [videoPlayedOnce, setVideoPlayedOnce] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [useWebM, setUseWebM] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shouldAutoplay, setShouldAutoplay] = useState(true);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  const baseName = language === 'ro' ? 'musicgift_ro' : 'musicgift_eng';
  const videoSrc = `/uploads/${baseName}.mp4`;
  const videoWebM = `/uploads/${baseName}.webm`;
  const posterSrc = '/uploads/video_placeholder.png';

  useEffect(() => {
    const playedLangKey = `played-${language}`;
    const sessionHasPlayed = sessionStorage.getItem(playedLangKey) === 'true';

    if (!sessionHasPlayed) {
      setShouldAutoplay(true);
      sessionStorage.setItem(playedLangKey, 'true');
    } else {
      setShouldAutoplay(false);
    }

    setUseWebM(supportsWebM());
    setIsMounted(true);
    setVideoPlayedOnce(false);
    setIsPlaying(false);
    setVideoError(null);
    setIsVideoLoading(true);
  }, [language]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      setIsPlaying(false);
    }
  }, [location.pathname]);

  const handleVideoError = useCallback((error: any) => {
    console.warn('Video loading error:', error);
    setVideoError('Video cannot be loaded');
    setIsVideoLoading(false);
    setIsPlaying(false);
  }, []);

  const handleVideoLoad = useCallback(() => {
    setIsVideoLoading(false);
    setVideoError(null);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldAutoplay || videoError) return;

    const attemptPlay = async () => {
      try {
        video.muted = false;
        await video.play();
        setHasAudio(true);
        setIsPlaying(true);
      } catch (err) {
        console.warn('Autoplay with sound failed, falling back to muted:', err);
        try {
          video.muted = true;
          await video.play();
          setHasAudio(false);
          setIsPlaying(true);
        } catch (mutedErr) {
          console.warn('Muted autoplay also failed:', mutedErr);
          handleVideoError(mutedErr);
        }
      }
    };

    if (!isVideoLoading) {
      attemptPlay();
    }
  }, [shouldAutoplay, language, isVideoLoading, videoError, handleVideoError]);

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setVideoPlayedOnce(true);
  };

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video || videoError) return;
    
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
    
    if (hasAudio) {
      video.muted = true;
      setHasAudio(false);
    } else {
      video.muted = false;
      setHasAudio(true);
    }
  }, [hasAudio, videoError]);

  const mobileHeight = isMobile ? `${(window.innerWidth * 9) / 16}px` : undefined;

  if (!isMounted) return null;

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
        <div className="absolute inset-0 video-error-fallback" role="alert">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-white/80" aria-hidden="true" />
            <h3 className="text-lg font-semibold mb-2">Video Unavailable</h3>
            <p className="text-sm opacity-90">The video content is temporarily unavailable</p>
          </div>
        </div>
      ) : (
        <video
          key={language}
          ref={videoRef}
          playsInline
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
          {useWebM && <source src={videoWebM} type="video/webm" onError={handleVideoError} />}
          <source src={videoSrc} type="video/mp4" onError={handleVideoError} />
          <track 
            kind="captions" 
            src={`/uploads/captions_${language}.vtt`} 
            srcLang={language} 
            label={language === 'ro' ? 'Română' : 'English'}
            default 
          />
        </video>
      )}

      {!shouldAutoplay && !videoError && (
        <div className="absolute top-24 right-4 z-30 flex gap-2 defer-load">
          <Button 
            onClick={handleTogglePlay} 
            size="icon" 
            className="bg-white/80 text-black rounded-full shadow hw-accelerated"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? <Pause className="w-5 h-5" aria-hidden="true" /> : <Play className="w-5 h-5" aria-hidden="true" />}
          </Button>
          <Button 
            onClick={handleToggleAudio} 
            size="icon" 
            className="bg-white/80 text-black rounded-full shadow hw-accelerated"
            aria-label={hasAudio ? 'Mute video' : 'Unmute video'}
          >
            <Volume2 className="w-5 h-5" aria-hidden="true" />
          </Button>
        </div>
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
