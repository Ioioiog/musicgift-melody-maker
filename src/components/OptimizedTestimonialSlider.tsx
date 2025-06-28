
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, Play } from "lucide-react";
import { testimonials } from '@/data/testimonials';
import { AspectRatio } from "@/components/ui/aspect-ratio";

const OptimizedTestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Filter approved testimonials
  const approvedTestimonials = testimonials.filter(testimonial => testimonial.approved);

  useEffect(() => {
    setIsLoaded(true);
    
    if (approvedTestimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % approvedTestimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [approvedTestimonials.length]);

  if (!isLoaded) {
    return (
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-white/20 rounded-lg animate-pulse mb-4 mx-auto max-w-xs" />
          <div className="h-4 bg-white/10 rounded animate-pulse mb-8 mx-auto max-w-md" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-white/90 backdrop-blur-sm animate-pulse">
                <CardContent className="p-6">
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4" />
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="w-4 h-4 bg-gray-200 rounded" />
                    ))}
                  </div>
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (approvedTestimonials.length === 0) {
    return null;
  }

  return (
    <section 
      className="py-8 px-4 relative"
      style={{
        contain: 'layout style',
        contentVisibility: 'auto',
        containIntrinsicSize: '100vw 400px'
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Ce spun clienții noștri
          </h2>
          <p className="text-white/80 text-sm md:text-base">
            Mărturii reale de la persoane care au trăit experiența MusicGift
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedTestimonials.slice(currentIndex, currentIndex + 3).map((testimonial, index) => (
            <Card 
              key={`${currentIndex}-${index}`} 
              className="bg-white/90 backdrop-blur-sm hover:bg-white/95 transition-all duration-300 hover:scale-105 shadow-lg"
              style={{ contain: 'layout style' }}
            >
              <CardContent className="p-6">
                {/* Video thumbnail with fixed aspect ratio */}
                {testimonial.youtube_link && (
                  <div className="mb-4">
                    <AspectRatio ratio={16 / 9}>
                      <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={`https://img.youtube.com/vi/${testimonial.youtube_link.split('/').pop()?.split('?')[0]}/maxresdefault.jpg`}
                          alt={`${testimonial.name} testimonial`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/uploads/youtube_placeholder.webp';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                            <Play className="w-4 h-4 text-white ml-1" fill="currentColor" />
                          </div>
                        </div>
                      </div>
                    </AspectRatio>
                  </div>
                )}

                {/* Fixed height content area */}
                <div className="min-h-[120px] flex flex-col">
                  {/* Stars with fixed layout */}
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.stars
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Message with quote icon */}
                  <div className="relative flex-1 mb-4">
                    <Quote className="absolute -top-1 -left-1 w-4 h-4 text-purple-600/30" />
                    <p className="text-gray-700 text-sm leading-relaxed pl-4">
                      {testimonial.message}
                    </p>
                  </div>

                  {/* Author info with badges */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {testimonial.name}
                      </p>
                      {testimonial.location && (
                        <p className="text-gray-500 text-xs">
                          {testimonial.location}
                        </p>
                      )}
                    </div>
                    
                    {testimonial.youtube_link && (
                      <Badge className="bg-red-500 text-white text-xs">
                        Video
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation dots with fixed positioning */}
        {approvedTestimonials.length > 3 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: Math.ceil(approvedTestimonials.length / 3) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * 3)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex / 3) === index
                    ? 'bg-white w-6'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                style={{ contain: 'layout' }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OptimizedTestimonialSlider;
