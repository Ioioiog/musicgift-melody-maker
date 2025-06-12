import { FaStar, FaCheckCircle } from "react-icons/fa";
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import { useTestimonials } from "@/hooks/useTestimonials";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, ExternalLink, Quote, Star, Volume2, VolumeX, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import type { CarouselApi } from "@/components/ui/carousel";
import { convertToYouTubeEmbed, isValidYouTubeUrl } from "@/utils/youtubeUtils";

export default function TestimonialSlider() {
  const {
    t
  } = useLanguage();
  const {
    data: testimonials,
    isLoading,
    error
  } = useTestimonials();
  const [maximizedVideo, setMaximizedVideo] = useState<{
    src: string;
    type: 'upload' | 'youtube';
    title: string;
  } | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const autoplay = Autoplay({
    delay: 4000,
    stopOnInteraction: true,
    stopOnMouseEnter: true
  });
  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  if (isLoading) {
    return <div className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="overflow-hidden">
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 overflow-hidden shadow-lg flex-shrink-0 w-80">
                  <Skeleton className="w-full h-64" />
                  <div className="p-6">
                    <Skeleton className="h-5 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>;
  }
  if (error) {
    console.error('Error loading testimonials:', error);
    return <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 p-12 shadow-lg">
            <p className="text-white">{t('error') || 'Error loading testimonials'}</p>
          </div>
        </div>
      </div>;
  }
  if (!testimonials || testimonials.length === 0) {
    return <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 p-12 shadow-lg">
            <p className="text-white">{t('noTestimonialsYet') || 'No testimonials available yet'}</p>
          </div>
        </div>
      </div>;
  }

  // Determine testimonial type for modern layout
  const getTestimonialType = (testimonial: any) => {
    if (testimonial.video_url && testimonial.youtube_link) return 'both-videos';
    if (testimonial.video_url) return 'uploaded-video';
    if (testimonial.youtube_link) return 'youtube';
    return 'text-only';
  };

  // Process YouTube URL to ensure it's in proper embed format
  const getProcessedYouTubeUrl = (url: string) => {
    if (!url) return '';
    
    // If it's already a valid YouTube URL, convert it to embed format
    if (isValidYouTubeUrl(url)) {
      return convertToYouTubeEmbed(url);
    }
    
    // If it's already an embed URL, return as is
    if (url.includes('/embed/')) {
      return url;
    }
    
    // If we can't process it, return empty to avoid broken videos
    console.warn('Invalid YouTube URL found:', url);
    return '';
  };

  // Modern video component with enhanced play overlay and autoplay for uploads only
  const VideoWithOverlay = ({
    src,
    type,
    title
  }: {
    src: string;
    type: 'upload' | 'youtube';
    title: string;
  }) => {
    const [isMuted, setIsMuted] = useState(true);
    const [hasError, setHasError] = useState(false);
    const handleVideoClick = () => {
      setMaximizedVideo({
        src,
        type,
        title
      });
    };
    if (type === 'youtube') {
      const processedUrl = getProcessedYouTubeUrl(src);
      
      // Don't render if URL is invalid or empty
      if (!processedUrl) {
        return (
          <div className="relative group overflow-hidden rounded-xl bg-gray-100 h-full flex items-center justify-center">
            <p className="text-gray-500 text-sm">Video unavailable</p>
          </div>
        );
      }

      return (
        <div className="relative group overflow-hidden rounded-xl bg-gray-50 cursor-pointer" onClick={handleVideoClick}>
          <iframe className="w-full h-full pointer-events-none" src={processedUrl} allowFullScreen loading="lazy" title={title} onError={() => setHasError(true)} />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm">
            <ExternalLink className="w-4 h-4 text-red-600" />
          </div>
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
              <Play className="w-6 h-6 text-gray-800" />
            </div>
          </div>
          {hasError && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <p className="text-gray-500 text-sm">Video unavailable</p>
            </div>
          )}
        </div>
      );
    }
    return <div className="relative group overflow-hidden rounded-xl bg-gray-50 cursor-pointer" onClick={handleVideoClick}>
        <video className="w-full h-full object-cover pointer-events-none" autoPlay muted={isMuted} loop playsInline preload="metadata">
          <source src={src} type="video/mp4" />
        </video>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button onClick={e => {
          e.stopPropagation();
          setIsMuted(!isMuted);
        }} className="text-gray-600 hover:text-gray-800 transition-colors">
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
            <Play className="w-6 h-6 text-gray-800" />
          </div>
        </div>
      </div>;
  };

  // Maximized video modal
  const MaximizedVideoModal = () => {
    if (!maximizedVideo) return null;
    const processedSrc = maximizedVideo.type === 'youtube' 
      ? getProcessedYouTubeUrl(maximizedVideo.src)
      : maximizedVideo.src;

    if (maximizedVideo.type === 'youtube' && !processedSrc) {
      return null; // Don't show modal for invalid YouTube URLs
    }

    return <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden">
          <button onClick={() => setMaximizedVideo(null)} className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors">
            <X className="w-6 h-6 text-gray-800" />
          </button>
          
          <div className="aspect-video">
            {maximizedVideo.type === 'youtube' ? <iframe className="w-full h-full" src={processedSrc} allowFullScreen title={maximizedVideo.title} /> : <video className="w-full h-full object-cover" controls autoPlay preload="metadata">
                <source src={maximizedVideo.src} type="video/mp4" />
              </video>}
          </div>
        </div>
      </div>;
  };

  // Render testimonial card component
  const TestimonialCard = ({
    testimonial
  }: {
    testimonial: any;
  }) => {
    const type = getTestimonialType(testimonial);
    return <motion.div initial={{
      opacity: 0,
      y: 20
    }} whileInView={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.4
    }} className="h-full">
        {/* Text-only testimonial - glassmorphism design */}
        {type === 'text-only' && <div className="bg-white/20 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/30 hover:border-white/40 transition-all duration-300 p-3 md:p-6 h-full flex flex-col group hover:shadow-xl shadow-lg">
            {/* Quote icon */}
            <div className="mb-2 md:mb-4">
              <Quote className="w-4 h-4 md:w-6 md:h-6 text-white opacity-60" />
            </div>
            
            {/* Testimonial text */}
            <blockquote className="text-white text-sm md:text-base leading-relaxed mb-4 md:mb-6 flex-grow">
              "{testimonial.text}"
            </blockquote>
            
            {/* Star rating */}
            <div className="flex items-center justify-center mb-2 md:mb-4">
              <div className="flex gap-1">
                {[...Array(testimonial.stars)].map((_, i) => <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />)}
              </div>
            </div>
            
            {/* Author info */}
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-semibold text-sm md:text-base border border-white/30">
                {testimonial.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1 md:gap-2 mb-1">
                  <h4 className="font-semibold text-white text-xs md:text-sm">{testimonial.name}</h4>
                  <FaCheckCircle className="text-green-400 text-xs" />
                </div>
                {testimonial.location && <p className="text-xs text-white/70">{testimonial.location}</p>}
              </div>
            </div>
          </div>}

        {/* Video testimonials - glassmorphism design */}
        {type !== 'text-only' && <div className="bg-white/20 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/30 hover:border-white/40 transition-all duration-300 p-2 md:p-6 h-full flex flex-col group hover:shadow-xl shadow-lg px-3 py-2 md:px-[25px] md:py-[7px]">
            {/* Quote icon for consistency */}
            <div className="mb-2 md:mb-4">
              <Quote className="w-4 h-4 md:w-6 md:h-6 text-white opacity-60" />
            </div>

            {/* Testimonial text FIRST */}
            {testimonial.text && <blockquote className="text-white text-sm md:text-base leading-relaxed mb-3 md:mb-6 flex-grow">
                "{testimonial.text}"
              </blockquote>}

            {/* Video section AFTER text */}
            <div className="mb-2 md:mb-4 rounded-lg md:rounded-xl overflow-hidden">
              {type === 'uploaded-video' && <div className="h-32 md:h-48 flex items-center justify-center">
                  <div className="w-full max-w-sm">
                    <VideoWithOverlay src={testimonial.video_url} type="upload" title={`Video testimonial from ${testimonial.name}`} />
                  </div>
                </div>}
              
              {type === 'youtube' && <div className="h-28 md:h-40">
                  <VideoWithOverlay src={testimonial.youtube_link} type="youtube" title={`Video testimonial from ${testimonial.name}`} />
                </div>}

              {type === 'both-videos' && <div className="space-y-2 md:space-y-3">
                  <div className="h-24 md:h-32">
                    <VideoWithOverlay src={testimonial.video_url} type="upload" title={`Video testimonial from ${testimonial.name}`} />
                  </div>
                  <div className="h-24 md:h-32">
                    <VideoWithOverlay src={testimonial.youtube_link} type="youtube" title={`YouTube testimonial from ${testimonial.name}`} />
                  </div>
                </div>}
            </div>
            
            {/* Star rating */}
            <div className="flex items-center justify-center mb-2 md:mb-4">
              <div className="flex gap-1">
                {[...Array(testimonial.stars)].map((_, i) => <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />)}
              </div>
            </div>
            
            {/* Author info */}
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-semibold text-sm md:text-base border border-white/30">
                {testimonial.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1 md:gap-2 mb-1">
                  <h4 className="font-semibold text-white text-xs md:text-sm">{testimonial.name}</h4>
                  <FaCheckCircle className="text-green-400 text-xs" />
                </div>
                {testimonial.location && <p className="text-xs text-white/70">{testimonial.location}</p>}
              </div>
            </div>
          </div>}
      </motion.div>;
  };
  return <div className="py-[10px]">
      <div className="max-w-full mx-auto px-4">
        <Carousel setApi={setApi} className="w-full" opts={{
        align: "start",
        loop: true,
        slidesToScroll: 1
      }} plugins={[autoplay]}>
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map(testimonial => <CarouselItem key={testimonial.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="h-full">
                  <TestimonialCard testimonial={testimonial} />
                </div>
              </CarouselItem>)}
          </CarouselContent>
          
          {/* Custom Navigation Buttons */}
          <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 hover:text-white transition-all duration-200" />
          <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 hover:text-white transition-all duration-200" />
          
          {/* Enhanced Pagination Dots */}
          <div className="flex justify-center items-center gap-3 mt-8 px-4 my-[10px]">
            
            
            {/* Progress indicator */}
            <div className="text-white/60 text-sm font-medium bg-white/10 backdrop-blur-md rounded-full px-3 py-1 border border-white/20">
              {current} / {count}
            </div>
          </div>
        </Carousel>
      </div>

      {/* Maximized Video Modal */}
      <MaximizedVideoModal />
    </div>;
}
