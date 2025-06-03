import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { FaStar, FaCheckCircle } from "react-icons/fa";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from "framer-motion";
import { useState, useCallback, useEffect } from "react";

export default function TestimonialSlider() {
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
  const testimonials = [
    {
      name: t("testimonial1Name"),
      location: t("testimonial1Location"),
      videoUrl: "https://www.youtube.com/embed/Abk3kceKgP4",
      review: t("testimonial1Review")
    },
    {
      name: t("testimonial2Name"),
      location: t("testimonial2Location"),
      videoUrl: "https://www.youtube.com/embed/guBBAoM-dZQ",
      review: t("testimonial2Review")
    },
    {
      name: t("testimonial3Name"),
      location: t("testimonial3Location"),
      videoUrl: "https://www.youtube.com/embed/b_2CFQztmww",
      review: t("testimonial3Review")
    },
    {
      name: t("testimonial4Name"),
      location: t("testimonial4Location"),
      videoUrl: "https://www.youtube.com/embed/b-NYGzKSBiE",
      review: t("testimonial4Review")
    },
    {
      name: t("testimonial5Name"),
      location: t("testimonial5Location"),
      videoUrl: "https://www.youtube.com/embed/aZMaYjnKLHA",
      review: t("testimonial5Review")
    }
  ];

  const progress = (currentSlide + 1) / testimonials.length * 100;

  return (
    <div className="py-0">
      <div className="container px-[17px] mx-0 py-0 my-0">
        {/* Progress Bar */}
        <div className="mb-8 max-w-5xl mx-auto">
          
        </div>

        {/* Container without background since it's now inside hero */}
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
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <motion.div 
                    className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="relative pb-[56.25%] group">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={testimonial.videoUrl}
                        allowFullScreen
                        loading="lazy"
                        title={`Video testimonial from ${testimonial.name}`}
                      />
                      {/* Video overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                    <div className="p-4 md:p-6 text-center bg-gradient-to-br from-purple-50 to-pink-50">
                      <div className="flex items-center justify-center gap-2 mb-3 text-purple-600 font-semibold">
                        <h4 className="text-lg">{testimonial.name}</h4>
                        <FaCheckCircle className="text-purple-500 text-sm" />
                      </div>
                      <div className="flex justify-center text-yellow-400 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="text-sm" />
                        ))}
                      </div>
                      <p className="text-sm italic text-gray-700 mb-2 leading-relaxed border-l-4 border-purple-300 pl-4">
                        "{testimonial.review}"
                      </p>
                      <span className="block text-xs text-gray-500 font-medium bg-white rounded-full px-3 py-1 inline-block">
                        {testimonial.location}
                      </span>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
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
