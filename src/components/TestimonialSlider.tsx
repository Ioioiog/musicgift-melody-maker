import { FaStar, FaCheckCircle } from "react-icons/fa";
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Play, ExternalLink, Quote, Star, Volume2, VolumeX, X } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import type { CarouselApi } from "@/components/ui/carousel";
import { convertToYouTubeEmbed, isValidYouTubeUrl } from "@/utils/youtubeUtils";
import { testimonials as staticTestimonials } from "@/data/testimonials";

export default function TestimonialSlider() {
  const { t } = useLanguage();
  const testimonials = staticTestimonials
    .filter(t => t.approved)
    .sort((a, b) => a.display_order - b.display_order);

  const [maximizedVideo, setMaximizedVideo] = useState(null);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [loadedVideos, setLoadedVideos] = useState(new Set());
  const [playingVideos, setPlayingVideos] = useState(new Set());
  const [loadingVideos, setLoadingVideos] = useState(new Set());
  const [clickedVideos, setClickedVideos] = useState(new Set());
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

  const getProcessedYouTubeUrl = (url) => {
    if (!url) return '';
    if (isValidYouTubeUrl(url)) return convertToYouTubeEmbed(url);
    if (url.includes('/embed/')) return url;
    console.warn('Invalid YouTube URL found:', url);
    return '';
  };

  const handleVideoClick = (testimonialId, type) => {
    setClickedVideos(prev => new Set([...prev, testimonialId]));
    
    if (type === 'youtube') {
      const testimonial = testimonials.find(t => t.id === testimonialId);
      setMaximizedVideo({ 
        src: testimonial?.youtube_link, 
        type: 'youtube', 
        title: `${testimonial?.name} testimonial` 
      });
    }
  };

  const handleVideoPlay = async (testimonialId, type) => {
    if (type === 'youtube') {
      const testimonial = testimonials.find(t => t.id === testimonialId);
      setMaximizedVideo({ 
        src: testimonial?.youtube_link, 
        type: 'youtube', 
        title: `${testimonial?.name} testimonial` 
      });
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
    const isClicked = clickedVideos.has(testimonialId);

    // Show preview image until user clicks
    if (!isClicked) {
      return (
        <div 
          className="relative group overflow-hidden rounded-xl bg-gray-50 cursor-pointer h-full" 
          onClick={() => handleVideoClick(testimonialId, type)}
        >
          {/* Preview Image */}
          <img 
            src="/uploads/youtube_placeholder.webp"
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <Play className="w-8 h-8 text-gray-800" fill="currentColor" />
            </div>
          </div>

          {/* Type Indicator */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm">
            {type === 'youtube' ? (
              <ExternalLink className="w-4 h-4 text-red-600" />
            ) : (
              <Play className="w-4 h-4 text-purple-600" />
            )}
          </div>
        </div>
      );
    }

    // Show actual video after click
    if (type === 'youtube') {
      const processedSrc = getProcessedYouTubeUrl(src);
      
      return (
        <div className="relative group overflow-hidden rounded-xl bg-gray-50 h-full">
          <iframe 
            src={processedSrc}
            className="w-full h-full"
            allowFullScreen
            title={title}
            loading="lazy"
          />
        </div>
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
          autoPlay
        >
          <source src={src} type="video/mp4" />
        </video>
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
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

        {/* Maximize button */}
        {isLoaded && (
          <div 
            className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setMaximizedVideo({ src, type: 'uploaded', title });
            }}
          >
            <ExternalLink className="w-4 h-4 text-gray-600" />
          </div>
        )}
      </div>
    );
  };

  const MaximizedVideoModal = () => {
    if (!maximizedVideo) return null;
    const processedSrc = maximizedVideo.type === 'youtube'
      ? getProcessedYouTubeUrl(maximizedVideo.src)
      : maximizedVideo.src;

    if (maximizedVideo.type === 'youtube' && !processedSrc) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden">
          <button 
            onClick={() => setMaximizedVideo(null)} 
            className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
          >
            <X className="w-6 h-6 text-gray-800" />
          </button>
          <div className="aspect-video">
            {maximizedVideo.type === 'youtube'
              ? <iframe 
                  className="w-full h-full" 
                  src={processedSrc} 
                  allowFullScreen 
                  title={maximizedVideo.title}
                  loading="lazy"
                />
              : <video 
                  className="w-full h-full object-cover" 
                  controls 
                  autoPlay 
                  preload="metadata"
                >
                  <source src={maximizedVideo.src} type="video/mp4" />
                </video>
            }
          </div>
        </div>
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
      <MaximizedVideoModal />
    </div>
  );
}
