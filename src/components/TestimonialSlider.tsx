
import { FaStar, FaCheckCircle } from "react-icons/fa";
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from "framer-motion";
import { useState } from "react";
import { useTestimonials } from "@/hooks/useTestimonials";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, ExternalLink, Quote } from "lucide-react";

export default function TestimonialSlider() {
  const { t } = useLanguage();
  const { data: testimonials, isLoading, error } = useTestimonials();

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <Skeleton className="w-full h-64" />
                <div className="p-8">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-3" />
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
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl shadow-xl p-12">
            <p className="text-gray-600 text-lg">{t('error') || 'Error loading testimonials'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl shadow-xl p-12">
            <p className="text-gray-600 text-lg">{t('noTestimonialsYet') || 'No testimonials available yet'}</p>
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

  // Modern video component with enhanced play overlay
  const VideoWithOverlay = ({ src, type, title }: { src: string; type: 'upload' | 'youtube'; title: string }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    
    if (type === 'youtube') {
      return (
        <div className="relative group overflow-hidden rounded-2xl">
          <iframe
            className="w-full h-full"
            src={src}
            allowFullScreen
            loading="lazy"
            title={title}
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <ExternalLink className="w-4 h-4 text-gray-700" />
          </div>
        </div>
      );
    }

    return (
      <div className="relative group overflow-hidden rounded-2xl">
        <video
          className="w-full h-full object-cover"
          controls={isPlaying}
          preload="metadata"
          poster={src + '#t=0.5'}
          onPlay={() => setIsPlaying(true)}
        >
          <source src={src} type="video/mp4" />
        </video>
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/60 transition-all duration-300">
            <button
              onClick={() => setIsPlaying(true)}
              className="bg-white/95 backdrop-blur-sm rounded-full p-6 hover:bg-white hover:scale-110 transition-all duration-300 shadow-xl"
            >
              <Play className="w-8 h-8 text-purple-600 ml-1" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="py-16 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-pink-50/30 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Masonry-style grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => {
            const type = getTestimonialType(testimonial);
            
            return (
              <motion.div 
                key={testimonial.id}
                className="break-inside-avoid"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
              >
                {/* Text-only testimonial - enhanced card design */}
                {type === 'text-only' && (
                  <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 h-full flex flex-col relative overflow-hidden group">
                    {/* Quote decoration */}
                    <div className="absolute top-6 right-6 text-purple-100 group-hover:text-purple-200 transition-colors">
                      <Quote className="w-12 h-12" />
                    </div>
                    
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                          <FaCheckCircle className="text-green-500 text-sm" />
                        </div>
                        {testimonial.location && (
                          <p className="text-sm text-gray-500">{testimonial.location}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Star rating */}
                    <div className="flex justify-center mb-6">
                      <div className="flex gap-1 bg-yellow-50 rounded-full px-4 py-2">
                        {[...Array(testimonial.stars)].map((_, i) => (
                          <FaStar key={i} className="text-yellow-400 text-lg" />
                        ))}
                      </div>
                    </div>
                    
                    {/* Testimonial text */}
                    <blockquote className="text-gray-700 text-center flex-grow text-lg leading-relaxed italic">
                      "{testimonial.text}"
                    </blockquote>
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50/20 via-transparent to-pink-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                )}

                {/* Video testimonials - modern layout */}
                {type !== 'text-only' && (
                  <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group">
                    {/* Video section */}
                    <div className={`${type === 'both-videos' ? 'h-64' : 'h-80'} p-4`}>
                      {type === 'both-videos' && (
                        <div className="h-full">
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
                    <div className="p-6 bg-gradient-to-br from-purple-50/50 to-pink-50/50 relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold">
                            {testimonial.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                              <FaCheckCircle className="text-green-500 text-sm" />
                            </div>
                            {testimonial.location && (
                              <p className="text-sm text-gray-500">{testimonial.location}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center mb-4">
                        <div className="flex gap-1 bg-white rounded-full px-3 py-1 shadow-sm">
                          {[...Array(testimonial.stars)].map((_, i) => (
                            <FaStar key={i} className="text-yellow-400 text-sm" />
                          ))}
                        </div>
                      </div>
                      
                      {testimonial.text && (
                        <p className="text-sm text-gray-700 text-center italic">
                          "{testimonial.text}"
                        </p>
                      )}
                    </div>

                    {/* Second video for both-videos type */}
                    {type === 'both-videos' && (
                      <div className="h-64 p-4 pt-0">
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
            );
          })}
        </div>

        {/* Statistics section at the bottom */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Join Our Growing Community</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{testimonials.length}+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {(testimonials.reduce((acc, t) => acc + t.stars, 0) / testimonials.length).toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {testimonials.filter(t => t.video_url || t.youtube_link).length}
                </div>
                <div className="text-sm text-gray-600">Video Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">99%</div>
                <div className="text-sm text-gray-600">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
