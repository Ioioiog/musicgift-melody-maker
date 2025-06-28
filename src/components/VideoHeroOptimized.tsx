import { useLocalization } from '@/contexts/OptimizedLocalizationContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';

const VideoHeroOptimized = () => {
  const { t, language } = useLocalization();
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();
  const [hasAudio, setHasAudio] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayOverlay, setShowPlayOverlay] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const baseName = language === 'ro' ? 'musicgift_ro' : 'musicgift_eng';
  const videoSrc = `/uploads/${baseName}.mp4`;
  const videoWebM = `/uploads/${baseName}.webm`;
  const posterSrc = '/uploads/video_placeholder.png';

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      setShowPlayOverlay(true);
      setHasAudio(false);
    } else {
      setHasAudio(true);
    }
  }, []);

  const startVideoWithSound = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      video.muted = false;
      setHasAudio(true);
      video.currentTime = 0;
      await video.play();
      setIsPlaying(true);
      setShowPlayOverlay(false);
      setUserInteracted(true);
    } catch (error) {
      console.warn('Autoplay with sound failed, starting muted:', error);
      video.muted = true;
      setHasAudio(false);
      try {
        await video.play();
        setIsPlaying(true);
      } catch (mutedError) {
        console.warn('Even muted autoplay failed:', mutedError);
      }
    }
  }, []);

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
      setUserInteracted(true);
    }
  }, [hasAudio]);

  if (!isMounted) {
    return (
      <div 
        className="video-hero-skeleton relative overflow-hidden"
        style={{ 
          aspectRatio: '16/9',
          minHeight: isMobile ? '56.25vw' : '60vh',
          containIntrinsicSize: '100vw 56.25vw'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-purple-900 to-gray-900 animate-pulse" />
        <div className="absolute bottom-12 left-0 right-0 text-center px-4">
          <div className="h-12 bg-white/20 rounded-lg animate-pulse mx-auto max-w-md" />
        </div>
      </div>
    );
  }

  return (
    <section
      className="video-hero-optimized relative overflow-hidden"
      style={{
        aspectRatio: '16/9',
        minHeight: isMobile ? '56.25vw' : '60vh',
        maxHeight: isMobile ? '100vh' : '80vh',
        contain: 'layout style paint',
        contentVisibility: 'auto',
        containIntrinsicSize: '100vw 56.25vw'
      }}
    >
      {/* Fixed background to prevent CLS */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${posterSrc})`,
          contain: 'strict'
        }}
      />

      <video
        key={language}
        ref={videoRef}
        autoPlay
        playsInline
        preload="metadata"
        muted={!hasAudio}
        poster={posterSrc}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          contain: 'layout style',
          willChange: 'auto'
        }}
      >
        <source src={videoWebM} type="video/webm" />
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Play overlay with fixed positioning */}
      {showPlayOverlay && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
          <Button
            onClick={() => {
              setUserInteracted(true);
              startVideoWithSound();
            }}
            size="lg"
            className="bg-white/90 text-black rounded-full shadow-lg hover:bg-white transform hover:scale-105 transition-all duration-300"
          >
            <Play className="w-8 h-8 mr-3" />
            {t('tapToPlayWithSound', 'Tap to play with sound')}
          </Button>
        </div>
      )}

      {/* Video controls with fixed positioning */}
      <div className="absolute top-6 right-4 z-30 flex gap-2">
        <Button 
          onClick={handleTogglePlay} 
          size="icon" 
          className="bg-white/80 text-black rounded-full shadow"
          style={{ contain: 'layout' }}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </Button>
        <Button 
          onClick={handleToggleAudio} 
          size="icon" 
          className="bg-white/80 text-black rounded-full shadow"
          style={{ contain: 'layout' }}
        >
          {hasAudio ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </Button>
      </div>

      {/* Fixed gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-black/50 pointer-events-none" />

      {/* Fixed title positioning */}
      <div className="absolute bottom-12 left-0 right-0 text-center text-white px-4">
        <h1 
          className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent"
          style={{ contain: 'layout style' }}
        >
          {t('heroTitle')}
        </h1>
      </div>
    </section>
  );
};

export default VideoHeroOptimized;
