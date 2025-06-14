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

const isSafari = (): boolean => {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
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
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [showMutedNotice, setShowMutedNotice] = useState(false);

  const baseName = language === 'ro' ? 'musicgift_ro' : 'musicgift_eng';
  const videoSrc = `/uploads/${baseName}.mp4`;
  const videoWebM = `/uploads/${baseName}.webm`;
  const posterSrc = '/uploads/video_placeholder.png';

  useEffect(() => {
    setIsMounted(true);
    setIsPlaying(false);
    setHasAudio(false);
    setVideoError(null);
    setShowMutedNotice(false);
    setIsVideoLoading(true);
    const safariDetected = isSafari();
    setUseWebM(supportsWebM() && !safariDetected);
  }, [language]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Don't autoplay if navigating back
    if (performance.getEntriesByType('navigation')[0]?.type === 'back_forward') return;

    const playVideo = async () => {
      try {
        if (video.readyState < 3) {
          video.load();
          await new Promise(resolve => {
            video.addEventListener('canplay', resolve, { once: true });
          });
        }
        video.muted = false;
        await video.play();
        setIsPlaying(true);
        setHasAudio(true);
      } catch (err) {
        console.warn('Autoplay with sound failed, retrying muted...', err);
        try {
          video.muted = true;
          await video.play();
          setIsPlaying(true);
          setHasAudio(false);
          setShowMutedNotice(true);
        } catch (e) {
          console.warn('Muted autoplay also failed:', e);
          setVideoError('Video cannot be played.');
        }
      }
    };

    playVideo();
  }, [language]);

  const handleVideoError = useCallback((error: any) => {
    console.warn('Video loading error:', error);
    setVideoError('Video cannot be loaded');
    setIsVideoLoading(false);
    setIsPlaying(false);
  }, []);

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
    video.muted = hasAudio;
    setHasAudio(!hasAudio);
  }, [hasAudio, videoError]);

  const mobileHeight = isMobile ? `${(window.innerWidth * 9) / 16}px` : undefined;

  if (!isMounted) return null;

  return (
    <section
      className={`video-hero relative overflow-hidden ${isMobile ? '' : 'h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen'}`}
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
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-black/70" role="alert">
          <div className="text-center text-white">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-white/80" />
            <h3 className="text-lg font-semibold mb-2">Video Unavailable</h3>
            <p className="text-sm opacity-90 mb-4">The video content is temporarily unavailable</p>
            <Button onClick={() => window.location.reload()} className="bg-orange-500 hover:bg-orange-600 text-white">
              Try Again
            </Button>
          </div>
        </div>
      ) : (
        <video
          key={language}
          ref={videoRef}
          playsInline
          preload="metadata"
          muted={!hasAudio}
          onError={handleVideoError}
          onLoadStart={() => setIsVideoLoading(true)}
          className={`absolute ${isMobile ? 'top-16' : 'top-0'} left-0 w-full ${isMobile ? 'h-auto' : 'h-full'} object-cover transition-opacity duration-300 ${isVideoLoading ? 'opacity-0' : 'opacity-100'}`}
          poster={posterSrc}
          aria-label={`MusicGift promotional video in ${language === 'ro' ? 'Romanian' : 'English'}`}
        >
          {useWebM && <source src={videoWebM} type="video/webm" />}
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Toast Notification */}
      {showMutedNotice && (
        <div className="absolute top-20 right-4 z-50 bg-black/80 text-white text-sm px-4 py-2 rounded-lg shadow-md flex items-start gap-2 max-w-xs">
          <span className="pt-0.5">🔇</span>
          <span className="flex-1">{t('mutedAutoplayNotice')}</span>
          <button
            onClick={() => setShowMutedNotice(false)}
            className="ml-2 text-white/70 hover:text-white font-bold"
            aria-label={t('closeNotice')}
          >
            ✕
          </button>
        </div>
      )}

      {/* Controls */}
      {!videoError && (
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          <Button
            onClick={handleTogglePlay}
            size="icon"
            className="bg-white/90 hover:bg-white text-black rounded-full shadow-lg border border-white/20 backdrop-blur-sm"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          <Button
            onClick={handleToggleAudio}
            size="icon"
            className={`rounded-full shadow-lg border backdrop-blur-sm ${hasAudio ? 'bg-white/90 hover:bg-white text-black border-white/20' : 'bg-red-500/90 hover:bg-red-600 text-white border-red-300/20'}`}
            aria-label={hasAudio ? 'Mute video' : 'Unmute video'}
          >
            <Volume2 className="w-5 h-5" />
          </Button>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-black/50" aria-hidden="true"></div>

      <div className="absolute bottom-12 left-0 right-0 text-center text-white px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
          {t('heroTitle')}
        </h1>
      </div>
    </section>
  );
};

export default VideoHero;
