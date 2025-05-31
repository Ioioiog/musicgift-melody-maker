
import { useRef, useEffect, useState } from "react";
import { motion, PanInfo } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaPlay, FaStar, FaCheckCircle, FaPause } from "react-icons/fa";

const rawTestimonials = [
  {
    name: "Ana M.",
    location: "București",
    videoUrl: "https://www.youtube.com/embed/Abk3kceKgP4",
    review: "Cea mai frumoasă surpriză de aniversare.",
  },
  {
    name: "Nati G.",
    location: "Cluj-Napoca",
    videoUrl: "https://www.youtube.com/embed/guBBAoM-dZQ",
    review: "Un cadou emoționant pentru ziua de naștere.",
  },
  {
    name: "TechCorp",
    location: "Timișoara",
    videoUrl: "https://www.youtube.com/embed/b_2CFQztmww",
    review: "Jingle-ul perfect pentru brandul nostru.",
  },
  {
    name: "Maria P.",
    location: "Iași",
    videoUrl: "https://www.youtube.com/embed/b-NYGzKSBiE",
    review: "Melodie perfectă pentru copilul nostru.",
  },
  {
    name: "Alex R.",
    location: "Brașov",
    videoUrl: "https://www.youtube.com/embed/aZMaYjnKLHA",
    review: "Serviciu profesionist și rezultat excelent.",
  },
];

const getClonedTestimonials = () => {
  const clonedStart = rawTestimonials.slice(-3);
  const clonedEnd = rawTestimonials.slice(0, 3);
  return [...clonedStart, ...rawTestimonials, ...clonedEnd];
};

export default function TestimonialSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(3);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [autoplaySpeed, setAutoplaySpeed] = useState(3000);

  const testimonials = getClonedTestimonials();

  // Responsive detection with improved breakpoints
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setCardsPerView(1);
        setAutoplaySpeed(4000); // Slower on mobile
      } else if (width < 1024) {
        setCardsPerView(2);
        setAutoplaySpeed(3500);
      } else {
        setCardsPerView(3);
        setAutoplaySpeed(3000);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Enhanced autoplay with user interaction awareness
  useEffect(() => {
    if (isPaused || isUserInteracting) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, autoplaySpeed);

    return () => clearInterval(interval);
  }, [isPaused, isUserInteracting, currentIndex, autoplaySpeed]);

  // Reset user interaction flag after a delay
  useEffect(() => {
    if (!isUserInteracting) return;
    
    const timeout = setTimeout(() => {
      setIsUserInteracting(false);
    }, 8000); // Resume autoplay after 8 seconds of no interaction

    return () => clearTimeout(timeout);
  }, [isUserInteracting]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev + 1);
    setIsUserInteracting(true);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev - 1);
    setIsUserInteracting(true);
  };

  const handleDotClick = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(index + 3);
    setIsUserInteracting(true);
  };

  const toggleAutoplay = () => {
    setIsPaused(!isPaused);
    setIsUserInteracting(true);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    setIsUserInteracting(true);
    
    if (info.offset.x > threshold) {
      handlePrev();
    } else if (info.offset.x < -threshold) {
      handleNext();
    }
  };

  // Infinite loop logic with smoother transitions
  useEffect(() => {
    const total = rawTestimonials.length;
    const timeout = setTimeout(() => {
      if (currentIndex >= total + 3) {
        setIsAnimating(false);
        setCurrentIndex(3);
      } else if (currentIndex < 3) {
        setIsAnimating(false);
        setCurrentIndex(total + 2);
      } else {
        setIsAnimating(false);
      }
    }, 500); // Slightly faster transition
    return () => clearTimeout(timeout);
  }, [currentIndex]);

  const slideWidth = 100 / cardsPerView;
  const realCurrentIndex = ((currentIndex - 3) % rawTestimonials.length + rawTestimonials.length) % rawTestimonials.length;

  return (
    <section 
      className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-purple-800">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Real testimonials from satisfied customers who love their personalized songs
          </p>
          
          {/* Autoplay Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={toggleAutoplay}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-purple-700 hover:text-purple-800"
              aria-label={isPaused ? "Resume autoplay" : "Pause autoplay"}
            >
              {isPaused ? <FaPlay className="text-sm" /> : <FaPause className="text-sm" />}
              <span className="text-sm font-medium">
                {isPaused ? 'Resume' : 'Pause'} Autoplay
              </span>
            </button>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className={`w-2 h-2 rounded-full ${isUserInteracting ? 'bg-orange-400' : isPaused ? 'bg-red-400' : 'bg-green-400'} animate-pulse`}></div>
              <span>
                {isUserInteracting ? 'User Control' : isPaused ? 'Paused' : 'Auto-playing'}
              </span>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-4 lg:gap-6 cursor-grab active:cursor-grabbing"
            ref={containerRef}
            style={{
              width: `${testimonials.length * slideWidth}%`,
            }}
            animate={{ x: `-${currentIndex * slideWidth}%` }}
            transition={{ 
              duration: 0.5, 
              ease: [0.25, 0.46, 0.45, 0.94],
              type: "tween"
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            dragElastic={0.2}
            whileDrag={{ scale: 0.98 }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="w-full"
                style={{ width: `${100 / testimonials.length}%`, flexShrink: 0 }}
              >
                <motion.div
                  className="bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] mx-2"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative pb-[56.25%] group">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={t.videoUrl}
                      allowFullScreen
                      loading="lazy"
                      title={`Video testimonial from ${t.name}`}
                    ></iframe>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-center items-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FaPlay className="text-3xl lg:text-4xl mb-2 transform group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold tracking-widest px-2 py-1 bg-purple-600 rounded">
                        WATCH TESTIMONIAL
                      </span>
                    </div>
                  </div>
                  <div className="p-4 lg:p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3 text-purple-600 font-semibold">
                      <h4 className="text-lg">{t.name}</h4>
                      <FaCheckCircle className="text-purple-500 text-sm" />
                    </div>
                    <div className="flex justify-center text-yellow-400 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-sm" />
                      ))}
                    </div>
                    <p className="text-sm italic text-gray-700 mb-2 leading-relaxed">"{t.review}"</p>
                    <span className="block text-xs text-gray-500 font-medium">{t.location}</span>
                  </div>
                </motion.div>
              </div>
            ))}
          </motion.div>

          {/* Enhanced Navigation Arrows */}
          <div className="absolute top-1/2 left-2 lg:left-4 transform -translate-y-1/2 z-10">
            <button
              onClick={handlePrev}
              className="bg-white/90 backdrop-blur-sm p-3 lg:p-4 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 opacity-80 hover:opacity-100 group"
              aria-label="Previous testimonial"
            >
              <FaChevronLeft className="text-purple-700 group-hover:text-purple-800 transition-colors" />
            </button>
          </div>
          <div className="absolute top-1/2 right-2 lg:right-4 transform -translate-y-1/2 z-10">
            <button
              onClick={handleNext}
              className="bg-white/90 backdrop-blur-sm p-3 lg:p-4 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 opacity-80 hover:opacity-100 group"
              aria-label="Next testimonial"
            >
              <FaChevronRight className="text-purple-700 group-hover:text-purple-800 transition-colors" />
            </button>
          </div>
        </div>

        {/* Enhanced Dot Pagination */}
        <div className="flex justify-center mt-8 gap-3">
          {rawTestimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`transition-all duration-300 rounded-full ${
                realCurrentIndex === index
                  ? 'w-8 h-3 bg-purple-600 shadow-lg' 
                  : 'w-3 h-3 bg-purple-300 hover:bg-purple-400 hover:scale-110'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-6">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">
              Testimonial {realCurrentIndex + 1} of {rawTestimonials.length}
            </div>
            <div className="w-48 h-1 bg-gray-200 rounded-full mx-auto">
              <div 
                className="h-full bg-purple-600 rounded-full transition-all duration-300"
                style={{ width: `${((realCurrentIndex + 1) / rawTestimonials.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
