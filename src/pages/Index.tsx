// src/components/VideoHero.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const VideoHero = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { pathname } = useLocation();
  const { language } = useLanguage();
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const baseName = language === 'ro' ? 'musicgift_ro' : 'musicgift_eng';
  const videoSrcMP4 = `/uploads/${baseName}.mp4`;
  const videoSrcWEBM = `/uploads/${baseName}.webm`;
  const posterSrc = '/uploads/video_placeholder.png';

  const storageKey = `visited_${language}`;

  useEffect(() => {
    const isFirstVisit = sessionStorage.getItem(storageKey) !== 'true';
    const video = videoRef.current;
    if (!video) return;

    if (isFirstVisit) {
      video.muted = false;
      video.play()
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
        })
        .catch(() => {
          video.muted = true;
          video.play().then(() => {
            setIsPlaying(true);
            setIsMuted(true);
          });
        });
      sessionStorage.setItem(storageKey, 'true');
    } else {
      video.load();
    }

    return () => {
      video.pause();
    };
  }, [language]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.pause();
  }, [pathname]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div className="relative w-full h-[100vh] overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        controls={false}
        poster={posterSrc}
      >
        <source src={videoSrcWEBM} type="video/webm" />
        <source src={videoSrcMP4} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button
          onClick={togglePlay}
          className="bg-white/70 rounded-full p-2"
        >
          {isPlaying ? '❚❚' : '▶️'}
        </button>
        <button
          onClick={toggleMute}
          className="bg-white/70 rounded-full p-2"
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>
    </div>
  );
};

export default VideoHero;