
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TestimonialSlider from "@/components/TestimonialSlider";
import TestimonialSubmissionForm from "@/components/TestimonialSubmissionForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Star, Users, Quote } from "lucide-react";

const Testimonials = () => {
  const { t } = useLanguage();
  
  useEffect(() => {
    // Load Trustpilot widget script
    const script = document.createElement('script');
    script.src = '//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Navigation />
      
      {/* Clean Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600">
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-10 left-4 md:left-10 text-4xl md:text-6xl text-white/20" 
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }} 
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            ♪
          </motion.div>
          <motion.div 
            className="absolute bottom-20 right-4 md:right-10 text-3xl md:text-5xl text-white/20" 
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, -5, 0]
            }} 
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            🎵
          </motion.div>
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl md:text-4xl text-white/10" 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1]
            }} 
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <Quote className="w-20 h-20 md:w-32 md:h-32" />
          </motion.div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 md:space-y-8"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {t('testimonialsTitle')}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {t('testimonialsSubtitle')}
            </p>
            
            {/* Stats Section */}
            <motion.div 
              className="flex flex-wrap justify-center gap-6 md:gap-12 mt-8 md:mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="flex items-center gap-2 text-white/90">
                <Users className="w-5 h-5" />
                <span className="text-sm md:text-base font-medium">1000+ Happy Customers</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm md:text-base font-medium">4.9/5 Rating</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trustpilot Section */}
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
              Trusted by thousands of music lovers
            </h2>
            <div 
              className="trustpilot-widget" 
              data-locale="en-US" 
              data-template-id="56278e9abfbbba0bdcd568bc" 
              data-businessunit-id="684414032f7e44f180176d5b" 
              data-style-height="52px" 
              data-style-width="100%"
            >
              <a href="https://www.trustpilot.com/review/musicgift.ro" target="_blank" rel="noopener">
                Trustpilot
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Showcase Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Real stories from real people who have experienced the magic of personalized music gifts
            </p>
          </motion.div>
          
          <TestimonialSlider />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 md:space-y-8"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Share Your Experience
            </h2>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Help others discover the joy of personalized music gifts by sharing your story
            </p>
            <TestimonialSubmissionForm />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Testimonials;
