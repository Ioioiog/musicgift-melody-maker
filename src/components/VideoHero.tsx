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
  const [videoPlayedOnce, setVideoPlayedOnce] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [useWebM, setUseWebM] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shouldAutoplay, setShouldAutoplay] = useState(true);

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
  }, [language]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      setIsPlaying(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const video = videoRef.current;
    if (shouldAutoplay && video) {
      video.muted = false;
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setHasAudio(true);
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn('Autoplay with sound failed, falling back to muted:', err);
            video.muted = true;
            video.play().then(() => {
              setHasAudio(false);
              setIsPlaying(true);
            });
          });
      }
    }
  }, [shouldAutoplay, language]);

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setVideoPlayedOnce(true);
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

      {!shouldAutoplay && (
        <div className="absolute top-24 right-4 z-30 flex gap-2">
          <Button onClick={handleTogglePlay} size="icon" className="bg-white/80 text-black rounded-full shadow">
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          <Button onClick={handleToggleAudio} size="icon" className="bg-white/80 text-black rounded-full shadow">
            <Volume2 className="w-5 h-5" />
          </Button>
        </div>
      )}

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