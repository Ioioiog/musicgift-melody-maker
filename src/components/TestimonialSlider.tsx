import { FaStar, FaCheckCircle } from "react-icons/fa";
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from "framer-motion";
import { useState } from "react";
import { useTestimonials } from "@/hooks/useTestimonials";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, ExternalLink, Quote, Star, Volume2, VolumeX, X } from "lucide-react";

export default function TestimonialSlider() {
  const { t } = useLanguage();
  const { data: testimonials, isLoading, error } = useTestimonials();
  const [maximizedVideo, setMaximizedVideo] = useState<{ src: string; type: 'upload' | 'youtube'; title: string } | null>(null);

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-6">
                  <Skeleton className="h-5 w-3/4 mb-3" />
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
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-12">
            <p className="text-white">{t('error') || 'Error loading testimonials'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-12">
            <p className="text-white">{t('noTestimonialsYet') || 'No testimonials available yet'}</p>
          </div>
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

  // Modern video component with enhanced play overlay and autoplay for uploads only
  const VideoWithOverlay = ({ src, type, title }: { src: string; type: 'upload' | 'youtube'; title: string }) => {
    const [isMuted, setIsMuted] = useState(true);

    const handleVideoClick = () => {
      setMaximizedVideo({ src, type, title });
    };

    if (type === 'youtube') {
      return (
        <div className="relative group overflow-hidden rounded-xl bg-gray-50 cursor-pointer" onClick={handleVideoClick}>
          <iframe 
            className="w-full h-full pointer-events-none" 
            src={src} 
            allowFullScreen 
            loading="lazy" 
            title={title} 
          />
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
        <video 
          className="w-full h-full object-cover pointer-events-none" 
          autoPlay 
          muted={isMuted} 
          loop 
          playsInline 
          preload="metadata"
        >
          <source src={src} type="video/mp4" />
        </video>
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
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
            <Play className="w-6 h-6 text-gray-800" />
          </div>
        </div>
      </div>
    );
  };

  // Maximized video modal
  const MaximizedVideoModal = () => {
    if (!maximizedVideo) return null;

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
            {maximizedVideo.type === 'youtube' ? (
              <iframe 
                className="w-full h-full" 
                src={maximizedVideo.src} 
                allowFullScreen 
                title={maximizedVideo.title}
              />
            ) : (
              <video 
                className="w-full h-full object-cover" 
                controls
                autoPlay
                preload="metadata"
              >
                <source src={maximizedVideo.src} type="video/mp4" />
              </video>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Modern grid layout with smaller gap */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((testimonial, index) => {
            const type = getTestimonialType(testimonial);
            
            return (
              <motion.div 
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                {/* Text-only testimonial - glassmorphism design */}
                {type === 'text-only' && (
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300 p-6 h-full flex flex-col group hover:shadow-lg">
                    {/* Quote icon */}
                    <div className="mb-4">
                      <Quote className="w-6 h-6 text-white opacity-60" />
                    </div>
                    
                    {/* Testimonial text */}
                    <blockquote className="text-white text-base leading-relaxed mb-6 flex-grow">
                      "{testimonial.text}"
                    </blockquote>
                    
                    {/* Star rating */}
                    <div className="flex items-center justify-center mb-4">
                      <div className="flex gap-1">
                        {[...Array(testimonial.stars)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    
                    {/* Author info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-semibold text-base border border-white/30">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white text-sm">{testimonial.name}</h4>
                          <FaCheckCircle className="text-green-400 text-xs" />
                        </div>
                        {testimonial.location && (
                          <p className="text-xs text-white/70">{testimonial.location}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Video testimonials - glassmorphism design */}
                {type !== 'text-only' && (
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300 p-6 h-full flex flex-col group hover:shadow-lg">
                    {/* Quote icon for consistency */}
                    <div className="mb-4">
                      <Quote className="w-6 h-6 text-white opacity-60" />
                    </div>

                    {/* Testimonial text FIRST */}
                    {testimonial.text && (
                      <blockquote className="text-white text-base leading-relaxed mb-6 flex-grow">
                        "{testimonial.text}"
                      </blockquote>
                    )}

                    {/* Video section AFTER text */}
                    <div className="mb-4 rounded-xl overflow-hidden">
                      {type === 'uploaded-video' && (
                        <div className="h-48 flex items-center justify-center">
                          <div className="w-full max-w-sm">
                            <VideoWithOverlay 
                              src={testimonial.video_url} 
                              type="upload" 
                              title={`Video testimonial from ${testimonial.name}`} 
                            />
                          </div>
                        </div>
                      )}
                      
                      {type === 'youtube' && (
                        <div className="h-40">
                          <VideoWithOverlay 
                            src={testimonial.youtube_link} 
                            type="youtube" 
                            title={`Video testimonial from ${testimonial.name}`} 
                          />
                        </div>
                      )}

                      {type === 'both-videos' && (
                        <div className="space-y-3">
                          <div className="h-32">
                            <VideoWithOverlay 
                              src={testimonial.video_url} 
                              type="upload" 
                              title={`Video testimonial from ${testimonial.name}`} 
                            />
                          </div>
                          <div className="h-32">
                            <VideoWithOverlay 
                              src={testimonial.youtube_link} 
                              type="youtube" 
                              title={`YouTube testimonial from ${testimonial.name}`} 
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Star rating */}
                    <div className="flex items-center justify-center mb-4">
                      <div className="flex gap-1">
                        {[...Array(testimonial.stars)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    
                    {/* Author info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-semibold text-base border border-white/30">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white text-sm">{testimonial.name}</h4>
                          <FaCheckCircle className="text-green-400 text-xs" />
                        </div>
                        {testimonial.location && (
                          <p className="text-xs text-white/70">{testimonial.location}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Professional statistics section */}
        <motion.div 
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          
        </motion.div>
      </div>

      {/* Maximized Video Modal */}
      <MaximizedVideoModal />
    </div>
  );
}
