
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
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading testimonials:', error);
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600">{t('error') || 'Error loading testimonials'}</p>
        </div>
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600">{t('noTestimonialsYet') || 'No testimonials available yet'}</p>
        </div>
      </div>
    );
  }

  // Determine testimonial type for modern layout
  const getTestimonialType = (testimonial: any) => {
    if (testimonial.video_url && testimonial.youtube_link) return 'both-videos';
    if (testimonial.video_url) return 'uploaded-video';
    if (testimonial.youtube_link) return 'youtube';
    return 'text-only';
  };

  // Modern video component with play overlay
  const VideoWithOverlay = ({ src, type, title }: { src: string; type: 'upload' | 'youtube'; title: string }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    
    if (type === 'youtube') {
      return (
        <div className="relative group">
          <iframe
            className="w-full h-full rounded-lg"
            src={src}
            allowFullScreen
            loading="lazy"
            title={title}
          />
          <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full p-2">
            <ExternalLink className="w-4 h-4 text-white" />
          </div>
        </div>
      );
    }

    return (
      <div className="relative group">
        <video
          className="w-full h-full object-cover rounded-lg"
          controls={isPlaying}
          preload="metadata"
          poster={src + '#t=0.5'}
          onPlay={() => setIsPlaying(true)}
        >
          <source src={src} type="video/mp4" />
        </video>
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg group-hover:bg-black/30 transition-colors">
            <button
              onClick={() => setIsPlaying(true)}
              className="bg-white/90 backdrop-blur-sm rounded-full p-4 hover:bg-white transition-colors shadow-lg"
            >
              <Play className="w-6 h-6 text-purple-600 ml-1" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
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
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial, index) => {
              const type = getTestimonialType(testimonial);
              
              return (
                <CarouselItem key={testimonial.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <motion.div 
                    className="h-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    {/* Text-only testimonial - clean card design */}
                    {type === 'text-only' && (
                      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {testimonial.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                              {testimonial.location && (
                                <p className="text-sm text-gray-500">{testimonial.location}</p>
                              )}
                            </div>
                          </div>
                          <FaCheckCircle className="text-green-500 text-lg" />
                        </div>
                        
                        <div className="flex justify-center mb-4">
                          {[...Array(testimonial.stars)].map((_, i) => (
                            <FaStar key={i} className="text-yellow-400 text-lg" />
                          ))}
                        </div>
                        
                        <blockquote className="text-gray-700 italic text-center flex-grow">
                          "{testimonial.text}"
                        </blockquote>
                      </div>
                    )}

                    {/* Video testimonials - modern layout */}
                    {type !== 'text-only' && (
                      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-[500px] flex flex-col">
                        {/* Video section */}
                        <div className={`${type === 'both-videos' ? 'h-1/2' : 'h-2/3'} p-4`}>
                          {type === 'both-videos' && (
                            <div className="grid grid-cols-1 gap-2 h-full">
                              <VideoWithOverlay
                                src={testimonial.video_url}
                                type="upload"
                                title={`Video testimonial from ${testimonial.name}`}
                              />
                            </div>
                          )}
                          
                          {type === 'uploaded-video' && (
                            <VideoWithOverlay
                              src={testimonial.video_url}
                              type="upload"
                              title={`Video testimonial from ${testimonial.name}`}
                            />
                          )}
                          
                          {type === 'youtube' && (
                            <VideoWithOverlay
                              src={testimonial.youtube_link}
                              type="youtube"
                              title={`Video testimonial from ${testimonial.name}`}
                            />
                          )}
                        </div>

                        {/* Content section */}
                        <div className={`p-6 ${type === 'both-videos' ? 'h-1/2' : 'h-1/3'} flex flex-col justify-between bg-gradient-to-br from-purple-50 to-pink-50`}>
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                                <FaCheckCircle className="text-green-500 text-sm" />
                              </div>
                            </div>
                            
                            <div className="flex justify-center mb-3">
                              {[...Array(testimonial.stars)].map((_, i) => (
                                <FaStar key={i} className="text-yellow-400 text-sm" />
                              ))}
                            </div>
                            
                            {testimonial.text && (
                              <p className="text-sm text-gray-700 text-center italic">
                                "{testimonial.text}"
                              </p>
                            )}
                          </div>
                          
                          {testimonial.location && (
                            <div className="text-center mt-3">
                              <span className="text-xs text-gray-500 bg-white rounded-full px-3 py-1">
                                {testimonial.location}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Second video for both-videos type */}
                        {type === 'both-videos' && (
                          <div className="h-1/2 p-4 pt-0">
                            <VideoWithOverlay
                              src={testimonial.youtube_link}
                              type="youtube"
                              title={`YouTube testimonial from ${testimonial.name}`}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          
          {!isMobile && (
            <>
              <CarouselPrevious className="hidden md:flex -left-12 bg-white/80 backdrop-blur-sm hover:bg-white border-purple-200 text-purple-600 hover:text-purple-700 shadow-lg" />
              <CarouselNext className="hidden md:flex -right-12 bg-white/80 backdrop-blur-sm hover:bg-white border-purple-200 text-purple-600 hover:text-purple-700 shadow-lg" />
            </>
          )}
        </Carousel>

        {/* Progress indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
