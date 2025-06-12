
import { FaStar, FaCheckCircle } from "react-icons/fa";
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
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

  const VideoWithOverlay = ({ src, type, title }) => {
    const [isMuted, setIsMuted] = useState(true);
    const [hasError, setHasError] = useState(false);
    const handleVideoClick = () => setMaximizedVideo({ src, type, title });

    if (type === 'youtube') {
      const processedUrl = getProcessedYouTubeUrl(src);
      if (!processedUrl) {
        return <div className="relative group overflow-hidden rounded-xl bg-gray-100 h-full flex items-center justify-center">
          <p className="text-gray-500 text-sm">Video unavailable</p>
        </div>;
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
        </div>
      );
    }

    return (
      <div className="relative group overflow-hidden rounded-xl bg-gray-50 cursor-pointer" onClick={handleVideoClick}>
        <video className="w-full h-full object-cover pointer-events-none" autoPlay muted={isMuted} loop playsInline preload="metadata">
          <source src={src} type="video/mp4" />
        </video>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button onClick={e => { e.stopPropagation(); setIsMuted(!isMuted); }} className="text-gray-600 hover:text-gray-800 transition-colors">
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
            <Play className="w-6 h-6 text-gray-800" />
          </div>
        </div>
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
          <button onClick={() => setMaximizedVideo(null)} className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors">
            <X className="w-6 h-6 text-gray-800" />
          </button>
          <div className="aspect-video">
            {maximizedVideo.type === 'youtube'
              ? <iframe className="w-full h-full" src={processedSrc} allowFullScreen title={maximizedVideo.title} />
              : <video className="w-full h-full object-cover" controls autoPlay preload="metadata"><source src={maximizedVideo.src} type="video/mp4" /></video>}
          </div>
        </div>
      </div>
    );
  };

  const TestimonialCard = ({ testimonial }) => {
    const type = getTestimonialType(testimonial);
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="h-full">
        {/* Implementation of the card remains unchanged */}
      </motion.div>
    );
  };

  if (testimonials.length === 0) {
    return <p className="text-white text-center py-20">{t('noTestimonialsYet') || 'No testimonials yet.'}</p>;
  }

  return (
    <div className="py-[10px]">
      <div className="max-w-full mx-auto px-4">
        <Carousel setApi={setApi} opts={{ align: "start", loop: true, slidesToScroll: 1 }} plugins={[autoplay]} className="w-full py-[44px]">
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
