
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaPlay, FaStar, FaCheckCircle } from "react-icons/fa";

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
  const [currentIndex, setCurrentIndex] = useState(3); // account for cloned head
  const [cardsPerView, setCardsPerView] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);

  const testimonials = getClonedTestimonials();

  // Responsive detection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setCardsPerView(width < 576 ? 1 : width < 992 ? 2 : 3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev - 1);
  };

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
    }, 600);
    return () => clearTimeout(timeout);
  }, [currentIndex]);

  const slideWidth = 100 / cardsPerView;

  return (
    <section className="py-16 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-purple-800">
          What Our Customers Say
        </h2>
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-6"
            ref={containerRef}
            style={{
              width: `${testimonials.length * slideWidth}%`,
            }}
            animate={{ x: `-${currentIndex * slideWidth}%` }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="w-full"
                style={{ width: `${100 / testimonials.length}%`, flexShrink: 0 }}
              >
                <motion.div
                  className="bg-white shadow-xl rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.03]"
                >
                  <div className="relative pb-[56.25%]">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={t.videoUrl}
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                    <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white opacity-0 hover:opacity-100 transition">
                      <FaPlay className="text-4xl mb-2" />
                      <span className="text-xs font-bold tracking-widest">CHECK THIS SONG</span>
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2 text-purple-600 font-semibold">
                      <h4 className="text-md">{t.name}</h4>
                      <FaCheckCircle className="text-purple-500" />
                    </div>
                    <div className="flex justify-center text-yellow-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                    <p className="text-sm italic text-gray-700">"{t.review}"</p>
                    <span className="block text-xs mt-2 text-gray-500">{t.location}</span>
                  </div>
                </motion.div>
              </div>
            ))}
          </motion.div>

          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10">
            <button
              onClick={handlePrev}
              className="bg-white p-3 rounded-full shadow hover:bg-purple-100 transition"
            >
              <FaChevronLeft className="text-purple-700" />
            </button>
          </div>
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10">
            <button
              onClick={handleNext}
              className="bg-white p-3 rounded-full shadow hover:bg-purple-100 transition"
            >
              <FaChevronRight className="text-purple-700" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
