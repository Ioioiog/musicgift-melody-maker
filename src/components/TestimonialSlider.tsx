
import { FaStar, FaCheckCircle } from "react-icons/fa";
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from "framer-motion";
import { useState } from "react";
import { useTestimonials } from "@/hooks/useTestimonials";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, ExternalLink, Quote, Star } from "lucide-react";

export default function TestimonialSlider() {
  const { t } = useLanguage();
  const { data: testimonials, isLoading, error } = useTestimonials();

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
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
          <div className="bg-white rounded-2xl border border-gray-100 p-12">
            <p className="text-gray-500">{t('error') || 'Error loading testimonials'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl border border-gray-100 p-12">
            <p className="text-gray-500">{t('noTestimonialsYet') || 'No testimonials available yet'}</p>
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
        <div className="relative group overflow-hidden rounded-xl bg-gray-50">
          <iframe
            className="w-full h-full"
            src={src}
            allowFullScreen
            loading="lazy"
            title={title}
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm">
            <ExternalLink className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      );
    }

    return (
      <div className="relative group overflow-hidden rounded-xl bg-gray-50">
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
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all duration-200">
            <button
              onClick={() => setIsPlaying(true)}
              className="bg-white rounded-full p-4 hover:scale-105 transition-transform duration-200 shadow-lg"
            >
              <Play className="w-6 h-6 text-gray-800 ml-0.5" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Modern grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => {
            const type = getTestimonialType(testimonial);
            
            return (
              <motion.div 
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                {/* Text-only testimonial - clean professional design */}
                {type === 'text-only' && (
                  <div className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-300 p-8 h-full flex flex-col group hover:shadow-lg">
                    {/* Quote icon */}
                    <div className="mb-6">
                      <Quote className="w-8 h-8 text-purple-500 opacity-60" />
                    </div>
                    
                    {/* Testimonial text */}
                    <blockquote className="text-gray-700 text-lg leading-relaxed mb-8 flex-grow">
                      "{testimonial.text}"
                    </blockquote>
                    
                    {/* Star rating */}
                    <div className="flex items-center justify-center mb-6">
                      <div className="flex gap-1">
                        {[...Array(testimonial.stars)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    
                    {/* Author info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                          <FaCheckCircle className="text-green-500 text-sm" />
                        </div>
                        {testimonial.location && (
                          <p className="text-sm text-gray-500">{testimonial.location}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Video testimonials - modern professional layout */}
                {type !== 'text-only' && (
                  <div className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-300 overflow-hidden group hover:shadow-lg">
                    {/* Video section */}
                    <div className={`${type === 'both-videos' ? 'h-48' : 'h-56'} p-4`}>
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
                    <div className="p-6 border-t border-gray-50">
                      {/* Author info */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900 text-sm">{testimonial.name}</h4>
                            <FaCheckCircle className="text-green-500 text-xs" />
                          </div>
                          {testimonial.location && (
                            <p className="text-xs text-gray-500">{testimonial.location}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Star rating */}
                      <div className="flex items-center justify-center mb-4">
                        <div className="flex gap-1">
                          {[...Array(testimonial.stars)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      
                      {/* Testimonial text */}
                      {testimonial.text && (
                        <p className="text-sm text-gray-600 text-center leading-relaxed">
                          "{testimonial.text}"
                        </p>
                      )}
                    </div>

                    {/* Second video for both-videos type */}
                    {type === 'both-videos' && (
                      <div className="h-48 p-4 pt-0">
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

        {/* Professional statistics section */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Trusted by Thousands Worldwide
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join our growing community of satisfied customers who have created unforgettable musical memories
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                  {testimonials.length}+
                </div>
                <div className="text-sm text-gray-600 font-medium">Happy Customers</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                  {(testimonials.reduce((acc, t) => acc + t.stars, 0) / testimonials.length).toFixed(1)}
                </div>
                <div className="text-sm text-gray-600 font-medium">Average Rating</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                  {testimonials.filter(t => t.video_url || t.youtube_link).length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Video Reviews</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">99%</div>
                <div className="text-sm text-gray-600 font-medium">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
