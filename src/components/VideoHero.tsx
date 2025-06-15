
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

const VideoHero = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();
  const [hasAudio, setHasAudio] = useState(true); // Start with audio enabled
  const [isMounted, setIsMounted] = useState(false);
  const [useWebM, setUseWebM] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const baseName = language === 'ro' ? 'musicgift_ro' : 'musicgift_eng';
  const videoSrc = `/uploads/${baseName}.mp4`;
  const videoWebM = `/uploads/${baseName}.webm`;
  const posterSrc = '/uploads/video_placeholder.png';

  // Initialize video format support
  useEffect(() => {
    setUseWebM(supportsWebM());
    setIsMounted(true);
  }, []);

  // Handle language changes - restart video
  useEffect(() => {
    const video = videoRef.current;
    if (video && isMounted) {
      video.pause();
      setIsPlaying(false);
      // Reset video and restart with sound
      video.currentTime = 0;
      video.muted = false;
      setHasAudio(true);
      
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn('Autoplay with sound failed, falling back to muted:', err);
            video.muted = true;
            setHasAudio(false);
            video.play().then(() => {
              setIsPlaying(true);
            });
          });
      }
    }
  }, [language, isMounted]);

  // Handle route changes - pause when leaving home page
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (location.pathname !== '/') {
        // Pause video when navigating away from home
        video.pause();
        setIsPlaying(false);
      } else {
        // Restart video with sound when returning to home page
        video.currentTime = 0;
        video.muted = false;
        setHasAudio(true);
        
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((err) => {
              console.warn('Autoplay with sound failed, falling back to muted:', err);
              video.muted = true;
              setHasAudio(false);
              video.play().then(() => {
                setIsPlaying(true);
              });
            });
        }
      }
    }
  }, [location.pathname]);

  const handleVideoEnd = () => {
    setIsPlaying(false);
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
      className={`video-hero relative overflow-hidden video-hero-optimized critical-resource ${isMobile ? '' : 'h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen'}`}
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
        className={`absolute ${isMobile ? 'top-16' : 'top-0'} left-0 w-full ${isMobile ? 'h-auto' : 'h-full'} object-cover hw-accelerated`}
        poster={posterSrc}
      >
        {useWebM && <source src={videoWebM} type="video/webm" />}
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Always show video controls */}
      <div className="absolute top-24 right-4 z-30 flex gap-2 defer-load">
        <Button onClick={handleTogglePlay} size="icon" className="bg-white/80 text-black rounded-full shadow hw-accelerated">
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </Button>
        <Button onClick={handleToggleAudio} size="icon" className="bg-white/80 text-black rounded-full shadow hw-accelerated">
          {hasAudio ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </Button>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-black/50"></div>

      <div className="absolute bottom-12 left-0 right-0 text-center text-white px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent hw-accelerated">
          {t('heroTitle')}
        </h1>
      </div>
    </section>
  );
};

export default VideoHero;
