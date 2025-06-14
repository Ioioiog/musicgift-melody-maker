
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const VideoHero = () => {
  const { t, language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();
  const [hasAudio, setHasAudio] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  const baseName = language === 'ro' ? 'musicgift_ro' : 'musicgift_eng';
  const videoSrc = `/uploads/${baseName}.mp4`;
  const posterSrc = '/uploads/video_placeholder.png';

  const mobileHeight = isMobile ? `${(window.innerWidth * 9) / 16}px` : undefined;

  // Simple autoplay with sound
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const attemptAutoplay = async () => {
      try {
        video.muted = false; // Try with sound first
        await video.play();
        setIsPlaying(true);
        setHasAudio(true);
      } catch (err) {
        // Fallback to muted autoplay
        try {
          video.muted = true;
          await video.play();
          setIsPlaying(true);
          setHasAudio(false);
        } catch (mutedErr) {
          console.log('Autoplay failed, user interaction required');
          setIsPlaying(false);
        }
      }
    };

    const handleCanPlay = () => {
      setIsVideoLoading(false);
      attemptAutoplay();
    };

    video.addEventListener('canplay', handleCanPlay);
    
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [language]);

  const handleVideoError = () => {
    setVideoError('Video cannot be loaded');
    setIsVideoLoading(false);
    setIsPlaying(false);
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

  const handleToggleAudio = () => {
    const video = videoRef.current;
    if (!video || videoError) return;
    
    video.muted = hasAudio;
    setHasAudio(!hasAudio);
  };

  return (
    <div className="relative">
      {/* Video Hero Section */}
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
            onCanPlay={() => setIsVideoLoading(false)}
            className={`absolute ${isMobile ? 'top-16' : 'top-0'} left-0 w-full ${isMobile ? 'h-auto' : 'h-full'} object-cover transition-opacity duration-300 ${isVideoLoading ? 'opacity-0' : 'opacity-100'}`}
            poster={posterSrc}
            aria-label={`MusicGift promotional video in ${language === 'ro' ? 'Romanian' : 'English'}`}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}

        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-black/50" aria-hidden="true"></div>

        <div className="absolute bottom-12 left-0 right-0 text-center text-white px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            {t('heroTitle')}
          </h1>
        </div>
      </section>

      {/* Controls moved after navbar */}
      {!videoError && (
        <div className="absolute top-20 right-4 z-50 flex gap-2">
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
            {hasAudio ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoHero;
