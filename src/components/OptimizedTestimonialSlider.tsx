
import { useState, useEffect, useRef, useMemo } from 'react';
import { Star, Quote } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { testimonials as staticTestimonials } from "@/data/testimonials";

const OptimizedTestimonialSlider = () => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Filter and prepare testimonials
  const testimonials = useMemo(() => 
    staticTestimonials
      .filter(t => t.approved)
      .sort((a, b) => a.display_order - b.display_order)
      .slice(0, 8), // Limit to 8 testimonials to reduce DOM
    []
  );

  // Auto-advance testimonials
  useEffect(() => {
    if (!isVisible || testimonials.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible, testimonials.length]);

  // Intersection observer for visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (testimonials.length === 0) {
    return (
      <div className="py-8 text-center text-white/70">
        {t('noTestimonialsYet', 'No testimonials yet.')}
      </div>
    );
  }

  // Calculate visible testimonials (show 3 on desktop, 1 on mobile)
  const getVisibleTestimonials = () => {
    const isMobile = window.innerWidth < 768;
    const itemsToShow = isMobile ? 1 : 3;
    const items = [];
    
    for (let i = 0; i < itemsToShow; i++) {
      const index = (currentIndex + i) % testimonials.length;
      items.push({ ...testimonials[index], displayIndex: i });
    }
    
    return items;
  };

  const visibleTestimonials = getVisibleTestimonials();

  return (
    <div ref={containerRef} className="py-4">
      <div className="max-w-6xl mx-auto px-4">
        {/* Simplified testimonial grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleTestimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.id}-${currentIndex}`}
              className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 transition-all duration-500 hover:bg-white/15"
              style={{
                transform: `translateX(${index * 0}px)`,
                opacity: isVisible ? 1 : 0,
                transitionDelay: `${index * 100}ms`
              }}
            >
              {/* Star rating - simplified */}
              <div className="flex gap-1 mb-3">
                {Array.from({ length: testimonial.stars }, (_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote icon */}
              <Quote className="w-5 h-5 text-white/60 mb-3" />

              {/* Message */}
              <blockquote className="text-white/90 text-sm leading-relaxed mb-4 line-clamp-4">
                "{testimonial.message}"
              </blockquote>

              {/* Author info - simplified */}
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-white font-medium text-sm">{testimonial.name}</div>
                  {testimonial.location && (
                    <div className="text-white/60 text-xs">{testimonial.location}</div>
                  )}
                </div>
                <div className="w-3 h-3 bg-green-400 rounded-full" title="Verified" />
              </div>
            </div>
          ))}
        </div>

        {/* Simplified navigation indicators */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex ? 'bg-white' : 'bg-white/30'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress indicator */}
        <div className="text-center mt-4">
          <span className="text-white/60 text-sm bg-white/10 rounded-full px-3 py-1">
            {currentIndex + 1} / {testimonials.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OptimizedTestimonialSlider;
