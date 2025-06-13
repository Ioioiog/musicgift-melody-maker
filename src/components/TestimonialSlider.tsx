
import { FaStar, FaCheckCircle } from "react-icons/fa";
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Play, Quote, Star, Volume2, VolumeX } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import type { CarouselApi } from "@/components/ui/carousel";
import { isValidYouTubeUrl } from "@/utils/youtubeUtils";
import { testimonials as staticTestimonials } from "@/data/testimonials";
import YouTubeThumbnail from "@/components/YouTubeThumbnail";

export default function TestimonialSlider() {
  const { t } = useLanguage();
  const testimonials = staticTestimonials
    .filter(t => t.approved)
    .sort((a, b) => a.display_order - b.display_order);

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [loadedVideos, setLoadedVideos] = useState(new Set());
  const [playingVideos, setPlayingVideos] = useState(new Set());
  const [loadingVideos, setLoadingVideos] = useState(new Set());
  const videoRefs = useRef(new Map());
  
  const autoplay = Autoplay({
    delay: 4000,
    stopOnInteraction: true,
    stopOnMouseEnter: true
  });

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));
  }, [api]);

  const getTestimonialType = (testimonial) => {
    if (testimonial.video_url && testimonial.youtube_link) return 'both-videos';
    if (testimonial.video_url) return 'uploaded-video';
    if (testimonial.youtube_link) return 'youtube';
    return 'text-only';
  };

  const handleVideoPlay = async (testimonialId, type) => {
    if (type === 'youtube') {
      // YouTube videos now open in new tab - no action needed here
      return;
    }

    setLoadingVideos(prev => new Set([...prev, testimonialId]));
    
    const video = videoRefs.current.get(testimonialId);
    if (video && !loadedVideos.has(testimonialId)) {
      try {
        await video.load();
        setLoadedVideos(prev => new Set([...prev, testimonialId]));
      } catch (error) {
        console.error('Error loading video:', error);
      }
    }
    
    setLoadingVideos(prev => {
      const newSet = new Set(prev);
      newSet.delete(testimonialId);
      return newSet;
    });
    
    if (video) {
      await video.play();
      setPlayingVideos(prev => new Set([...prev, testimonialId]));
    }
  };

  const handleVideoPause = (testimonialId) => {
    setPlayingVideos(prev => {
      const newSet = new Set(prev);
      newSet.delete(testimonialId);
      return newSet;
    });
  };

  const VideoWithOverlay = ({ src, type, title, testimonialId }) => {
    const [isMuted, setIsMuted] = useState(true);
    const isLoading = loadingVideos.has(testimonialId);
    const isPlaying = playingVideos.has(testimonialId);
    const isLoaded = loadedVideos.has(testimonialId);

    if (type === 'youtube') {
      return (
        <YouTubeThumbnail 
          url={src} 
          title={title}
          className="h-full"
          openInNewTab={true}
        />
      );
    }

    return (
      <div className="relative group overflow-hidden rounded-xl bg-gray-50 h-full">
        <video 
          ref={(el) => {
            if (el) videoRefs.current.set(testimonialId, el);
          }}
          className="w-full h-full object-cover"
          muted={isMuted}
          loop
          playsInline
          preload="none"
          onPlay={() => setPlayingVideos(prev => new Set([...prev, testimonialId]))}
          onPause={() => handleVideoPause(testimonialId)}
          onEnded={() => handleVideoPause(testimonialId)}
        >
          <source src={src} type="video/mp4" />
        </video>
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
        
        {/* Play button overlay - shown when not playing */}
        {!isPlaying && !isLoading && (
          <div 
            className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center cursor-pointer"
            onClick={() => handleVideoPlay(testimonialId, 'uploaded')}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 group-hover:scale-110 transition-transform duration-200">
              <Play className="w-6 h-6 text-gray-800" />
            </div>
          </div>
        )}

        {/* Controls overlay - shown when playing and loaded */}
        {isPlaying && isLoaded && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                setIsMuted(!isMuted); 
              }} 
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    );
  };

  const TestimonialCard = ({ testimonial }) => {
    const type = getTestimonialType(testimonial);
    
    const renderStars = (rating) => {
      return Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`w-4 h-4 ${
            index < rating 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'fill-gray-300 text-gray-300'
          }`}
        />
      ));
    };

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4 }} 
        className="h-full"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 h-full flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/15">
          {/* Video Section */}
          {type !== 'text-only' && (
            <div className="aspect-video mb-4 rounded-xl overflow-hidden">
              {testimonial.youtube_link && (
                <VideoWithOverlay 
                  src={testimonial.youtube_link} 
                  type="youtube" 
                  title={`${testimonial.name} testimonial`}
                  testimonialId={testimonial.id}
                />
              )}
              {testimonial.video_url && !testimonial.youtube_link && (
                <VideoWithOverlay 
                  src={testimonial.video_url} 
                  type="uploaded" 
                  title={`${testimonial.name} testimonial`}
                  testimonialId={testimonial.id}
                />
              )}
            </div>
          )}

          {/* Content Section */}
          <div className="flex-1 flex flex-col">
            {/* Stars Rating */}
            <div className="flex items-center gap-1 mb-3">
              {renderStars(testimonial.stars)}
            </div>

            {/* Quote Icon */}
            <div className="mb-3">
              <Quote className="w-6 h-6 text-white/60" />
            </div>

            {/* Testimonial Message */}
            <blockquote className="text-white/90 text-sm leading-relaxed mb-4 flex-1">
              "{testimonial.message}"
            </blockquote>

            {/* Context (if available) */}
            {testimonial.context && (
              <p className="text-white/70 text-xs italic mb-3 bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                {testimonial.context}
              </p>
            )}

            {/* Author Info */}
            <div className="mt-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium text-sm">
                    {testimonial.name}
                  </h4>
                  {testimonial.location && (
                    <p className="text-white/60 text-xs">
                      {testimonial.location}
                    </p>
                  )}
                </div>
                <div className="text-white/40">
                  <FaCheckCircle className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (testimonials.length === 0) {
    return <p className="text-white text-center py-20">{t('noTestimonialsYet') || 'No testimonials yet.'}</p>;
  }

  return (
    <div className="py-[10px]">
      <div className="max-w-full mx-auto px-4">
        <Carousel setApi={setApi} opts={{ align: "start", loop: true, slidesToScroll: 1 }} plugins={[autoplay as any]} className="w-full py-[44px]">
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map(testimonial => (
              <CarouselItem key={testimonial.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="h-full">
                  <TestimonialCard testimonial={testimonial} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 hover:text-white transition-all duration-200" />
          <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 hover:text-white transition-all duration-200" />
          <div className="flex justify-center items-center gap-3 mt-8 px-4 my-[10px]">
            <div className="text-white/60 text-sm font-medium bg-white/10 backdrop-blur-md rounded-full px-3 py-1 border border-white/20">
              {current} / {count}
            </div>
          </div>
        </Carousel>
      </div>
    </div>
  );
}
