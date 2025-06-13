import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2 } from 'lucide-react';
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
  const [videoPlayed, setVideoPlayed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [useWebM, setUseWebM] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const videoKey = `videoPlayed-${language}`;
  const baseName = language === 'ro' ? 'musicgift_ro' : 'musicgift_eng';
  const videoSrc = `/uploads/${baseName}.mp4`;
  const videoWebM = `/uploads/${baseName}.webm`;
  const posterSrc = '/uploads/video_placeholder.png';

  useEffect(() => {
    const alreadyPlayed = sessionStorage.getItem(videoKey) === 'true';
    setVideoPlayed(alreadyPlayed);
    setUseWebM(supportsWebM());
    setIsMounted(true);
  }, [language]);

  // Stop video when navigating away
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      setIsPlaying(false);
    }
  }, [location.pathname]);

  const handleVideoEnd = () => {
    sessionStorage.setItem(videoKey, 'true');
    setIsPlaying(false);
    setVideoPlayed(true);
  };

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.currentTime = 0;
      video.muted = false;
      video.play();
      setIsPlaying(true);
      setVideoPlayed(false);
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
    }
  }, [hasAudio]);

  const mobileHeight = isMobile ? `${(window.innerWidth * 9) / 16}px` : undefined;

  if (!isMounted) return null;

  return (
    <section
      className={`video-hero relative overflow-hidden ${isMobile ? '' : 'h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen'}`}
      style={isMobile && mobileHeight ? { height: mobileHeight } : {}}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${posterSrc})` }}
      ></div>

      <video
        key={language}
        ref={videoRef}
        playsInline
        preload="metadata"
        muted={!hasAudio}
        onEnded={handleVideoEnd}
        className={`absolute ${isMobile ? 'top-16' : 'top-0'} left-0 w-full ${isMobile ? 'h-auto' : 'h-full'} object-cover`}
        poster={posterSrc}
      >
        {useWebM && <source src={videoWebM} type="video/webm" />}
        <source src={videoSrc} type="video/mp4" />
      </video>

      <div className="absolute inset-0 flex items-center justify-center z-20">
        <Button onClick={handleTogglePlay} size="lg" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
          {isPlaying ? <Pause className="w-6 h-6 mr-2" /> : <Play className="w-6 h-6 mr-2" />}
          {isPlaying ? t('pause', 'Pause') : t('play', 'Play')}
        </Button>
      </div>

      <button
        onClick={handleToggleAudio}
        className="absolute z-40 top-4 right-4 bg-white text-black p-2 rounded-full shadow"
      >
        <Volume2 className="w-5 h-5" />
      </button>

      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-black/50"></div>

      <div className="absolute bottom-12 left-0 right-0 text-center text-white px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
          {t('heroTitle')}
        </h1>
      </div>
    </section>
  );
};

export default VideoHero;