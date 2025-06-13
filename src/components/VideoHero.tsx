import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Play, Volume2 } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const VideoHero = () => {
  const { t, language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();
  const [hasAudio, setHasAudio] = useState(false);
  const [showReplayButton, setShowReplayButton] = useState(false);
  const [videoPlayed, setVideoPlayed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const videoSrc = language === 'ro' ? '/uploads/musicgift_ro.mp4' : '/uploads/musicgift_eng.mp4';
  const posterSrc = '/uploads/e53a847b-7672-4212-aa90-b31d0bc6d328.png';

  useEffect(() => {
    const alreadyPlayed = sessionStorage.getItem('videoPlayed') === 'true';
    setVideoPlayed(alreadyPlayed);
    setIsMounted(true);
  }, []);

  const handleVideoEnd = () => {
    sessionStorage.setItem('videoPlayed', 'true');
    setShowReplayButton(true);
  };

  const handleReplay = () => {
    setShowReplayButton(false);
    setVideoPlayed(false);
    setTimeout(() => {
      const video = videoRef.current;
      if (video) {
        video.currentTime = 0;
        video.muted = false;
        video.play();
      }
    }, 100);
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

      {!videoPlayed && (
        <video
          ref={videoRef}
          playsInline
          preload="metadata"
          muted
          autoPlay
          onEnded={handleVideoEnd}
          className={`absolute ${isMobile ? 'top-16' : 'top-0'} left-0 w-full ${isMobile ? 'h-auto' : 'h-full'} object-cover`}
          poster={posterSrc}
        >
          <source src={videoSrc.replace('.mp4', '.webm')} type="video/webm" />
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {videoPlayed && showReplayButton && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20">
          <Button onClick={handleReplay} size="lg" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
            <Play className="w-6 h-6 mr-2" />
            {t('replay', 'Replay')}
          </Button>
        </div>
      )}

      {!videoPlayed && (
        <button
          onClick={handleToggleAudio}
          className="absolute z-40 top-4 right-4 bg-white text-black p-2 rounded-full shadow"
        >
          <Volume2 className="w-5 h-5" />
        </button>
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