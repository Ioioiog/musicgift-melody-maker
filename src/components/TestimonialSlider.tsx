import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { FaStar, FaCheckCircle } from "react-icons/fa";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from "framer-motion";
import { useState } from "react";
import { useTestimonials } from "@/hooks/useTestimonials";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, ExternalLink } from "lucide-react";

export default function TestimonialSlider() {
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: testimonials, isLoading, error } = useTestimonials();

  if (isLoading) {
    return (
      <div className="py-0">
        <div className="container px-[17px] mx-0 py-0 my-0">
          <div className="max-w-5xl mx-auto relative z-10 px-[66px] py-[27px] my-[26px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white shadow-lg rounded-2xl overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <div className="p-4 md:p-6">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading testimonials:', error);
    return (
      <div className="py-0">
        <div className="container px-[17px] mx-0 py-0 my-0">
          <div className="max-w-5xl mx-auto relative z-10 px-[66px] py-[27px] my-[26px]">
            <div className="text-center text-white">
              <p>{t('error') || 'Error loading testimonials'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="py-0">
        <div className="container px-[17px] mx-0 py-0 my-0">
          <div className="max-w-5xl mx-auto relative z-10 px-[66px] py-[27px] my-[26px]">
            <div className="text-center text-white">
              <p>{t('noTestimonialsYet') || 'No testimonials available yet'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progress = (currentSlide + 1) / testimonials.length * 100;

  // Determine testimonial type
  const getTestimonialType = (testimonial: any) => {
    if (testimonial.video_url && testimonial.youtube_link) return 'both-videos'; // Type 4: Both videos
    if (testimonial.video_url) return 'uploaded-video'; // Type 3: Uploaded video
    if (testimonial.youtube_link) return 'youtube'; // Type 1: YouTube audio
    return 'text-only'; // Type 2: Text only
  };

  // Render uploaded video
  const renderUploadedVideo = (testimonial: any, heightClass = 'h-1/3') => {
    return (
      <div className={`relative ${heightClass} group flex-shrink-0`}>
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          controls
          preload="metadata"
          poster={testimonial.video_url + '#t=0.5'}
        >
          <source src={testimonial.video_url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    );
  };

  // Render YouTube audio player
  const renderYouTubeAudio = (testimonial: any) => {
    const handlePlayClick = () => {
      window.open(testimonial.youtube_link, '_blank');
    };

    return (
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-lg border border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayClick}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
            </button>
            <div>
              <p className="text-sm font-medium text-purple-800">Audio Testimonial</p>
              <p className="text-xs text-purple-600">Click to listen</p>
            </div>
          </div>
          <button
            onClick={handlePlayClick}
            className="text-purple-600 hover:text-purple-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Render text content with appropriate sizing
  const renderTextContent = (testimonial: any) => {
    const type = getTestimonialType(testimonial);
    let heightClass = 'h-full';
    let paddingClass = 'p-4 md:p-6';
    
    if (type === 'both-videos') {
      heightClass = 'h-1/3';
      paddingClass = 'p-3 md:p-4';
    } else if (type === 'youtube') {
      heightClass = 'h-4/5';
    } else if (type === 'uploaded-video') {
      heightClass = 'h-1/3';
      paddingClass = 'p-3 md:p-4';
    }
    
    const isFullHeight = type === 'text-only';
    
    return (
      <div className={`${paddingClass} text-center bg-gradient-to-br from-purple-50 to-pink-50 ${heightClass} flex flex-col justify-between`}>
        <div>
          <div className="flex items-center justify-center gap-2 mb-3 text-purple-600 font-semibold">
            <h4 className={`${isFullHeight ? 'text-lg' : 'text-base'}`}>{testimonial.name}</h4>
            <FaCheckCircle className="text-purple-500 text-sm" />
          </div>
          <div className="flex justify-center text-yellow-400 mb-3">
            {[...Array(testimonial.stars)].map((_, i) => (
              <FaStar key={i} className="text-sm" />
            ))}
          </div>
          {testimonial.text && (
            <p className={`text-sm italic text-gray-700 mb-2 leading-relaxed border-l-4 border-purple-300 pl-4 ${isFullHeight ? 'text-base' : ''}`}>
              "{testimonial.text}"
            </p>
          )}
        </div>
        {testimonial.location && (
          <span className="block text-xs text-gray-500 font-medium bg-white rounded-full px-3 py-1 inline-block mt-auto">
            {testimonial.location}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="py-0">
      <div className="container px-[17px] mx-0 py-0 my-0">
        <div className="mb-8 max-w-5xl mx-auto">
          
        </div>

        <div className="max-w-5xl mx-auto relative z-10 px-[66px] py-[27px] my-[26px]">
          <Carousel
            opts={{
              align: "start",
              loop: true
            }}
            className="w-full"
            setApi={(api) => {
              if (api) {
                api.on('select', () => {
                  setCurrentSlide(api.selectedScrollSnap());
                });
              }
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial, index) => {
                const type = getTestimonialType(testimonial);
                
                return (
                  <CarouselItem key={testimonial.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                    <motion.div 
                      className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 h-[500px] flex flex-col"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      {/* Type 4: Both videos - uploaded video at top */}
                      {type === 'both-videos' && renderUploadedVideo(testimonial, 'h-1/3')}
                      
                      {/* Type 3: Uploaded video only - video at top */}
                      {type === 'uploaded-video' && renderUploadedVideo(testimonial, 'h-2/3')}
                      
                      {/* Text content - positioned based on type */}
                      {renderTextContent(testimonial)}
                      
                      {/* YouTube audio player - positioned at bottom for both types that include YouTube */}
                      {(type === 'youtube' || type === 'both-videos') && (
                        <div className="p-3">
                          {renderYouTubeAudio(testimonial)}
                        </div>
                      )}
                    </motion.div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            {!isMobile && (
              <>
                <CarouselPrevious className="hidden md:flex -left-12 bg-white/80 backdrop-blur-sm hover:bg-white border-purple-200 text-purple-600 hover:text-purple-700" />
                <CarouselNext className="hidden md:flex -right-12 bg-white/80 backdrop-blur-sm hover:bg-white border-purple-200 text-purple-600 hover:text-purple-700" />
              </>
            )}
          </Carousel>
        </div>
      </div>
    </div>
  );
}
