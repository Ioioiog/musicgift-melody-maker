
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
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-4 md:p-6 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading testimonials:', error);
    return (
      <div className="w-full text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-600">{t('error') || 'Error loading testimonials'}</p>
        </div>
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-gray-600">{t('noTestimonialsYet') || 'No testimonials available yet'}</p>
        </div>
      </div>
    );
  }

  // Determine testimonial type
  const getTestimonialType = (testimonial: any) => {
    if (testimonial.video_url && testimonial.youtube_link) return 'both-videos';
    if (testimonial.video_url) return 'uploaded-video';
    if (testimonial.youtube_link) return 'youtube';
    return 'text-only';
  };

  // Render video section with modern styling
  const renderVideoSection = (testimonial: any) => {
    const type = getTestimonialType(testimonial);
    
    if (type === 'text-only') return null;

    return (
      <div className="relative">
        {/* Uploaded Video */}
        {(type === 'uploaded-video' || type === 'both-videos') && (
          <div className="relative group">
            <video
              className="w-full h-48 object-cover rounded-t-xl"
              controls
              preload="metadata"
              poster={testimonial.video_url + '#t=0.5'}
            >
              <source src={testimonial.video_url} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-t-xl flex items-center justify-center">
              <Play className="w-12 h-12 text-white" />
            </div>
          </div>
        )}

        {/* YouTube Video */}
        {(type === 'youtube' || type === 'both-videos') && (
          <div className="relative group">
            <iframe
              className="w-full h-48 rounded-t-xl"
              src={testimonial.youtube_link}
              allowFullScreen
              loading="lazy"
              title={`Video testimonial from ${testimonial.name}`}
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ExternalLink className="w-4 h-4 text-white" />
            </div>
          </div>
        )}

        {/* Both videos indicator */}
        {type === 'both-videos' && (
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            Multiple videos
          </div>
        )}
      </div>
    );
  };

  // Render testimonial content
  const renderContent = (testimonial: any) => {
    const type = getTestimonialType(testimonial);
    const hasVideo = type !== 'text-only';

    return (
      <div className={`p-4 md:p-6 ${hasVideo ? '' : 'rounded-t-xl'} bg-white flex flex-col justify-between h-full`}>
        {/* Header with name and rating */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900 text-sm md:text-base">{testimonial.name}</h4>
              <FaCheckCircle className="text-green-500 text-xs flex-shrink-0" />
            </div>
            <div className="flex items-center gap-1">
              {[...Array(testimonial.stars)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400 text-xs" />
              ))}
            </div>
          </div>
          
          {testimonial.location && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block">
              {testimonial.location}
            </span>
          )}
        </div>

        {/* Testimonial text */}
        {testimonial.text && (
          <div className="flex-1">
            <p className="text-gray-700 text-sm md:text-base leading-relaxed italic">
              "{testimonial.text}"
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      <Carousel
        opts={{
          align: "start",
          loop: true,
          slidesToScroll: isMobile ? 1 : 2
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
          {testimonials.map((testimonial, index) => (
            <CarouselItem 
              key={testimonial.id} 
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <motion.div 
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden h-full flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {renderVideoSection(testimonial)}
                {renderContent(testimonial)}
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {!isMobile && testimonials.length > 3 && (
          <>
            <CarouselPrevious className="hidden md:flex -left-4 lg:-left-6 bg-white shadow-lg border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-800" />
            <CarouselNext className="hidden md:flex -right-4 lg:-right-6 bg-white shadow-lg border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-800" />
          </>
        )}
      </Carousel>

      {/* Progress indicators for mobile */}
      {isMobile && testimonials.length > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {testimonials.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                Math.floor(currentSlide) === index
                  ? 'bg-purple-600 w-6'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
