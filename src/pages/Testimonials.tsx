
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TestimonialSlider from "@/components/TestimonialSlider";
import TestimonialSubmissionForm from "@/components/TestimonialSubmissionForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useEffect } from "react";

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
      document.head.removeChild(script);
    };
  }, []);
  
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Enhanced Hero Section with TestimonialSlider inside */}
      <section 
        className="py-12 text-white relative overflow-hidden"
        style={{
          backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Hero Title Section */}
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 mb-8">
          <motion.h1 
            className="text-3xl md:text-5xl font-bold mb-4" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            {t('testimonialsTitle')}
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl opacity-90 mb-8" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('testimonialsSubtitle')}
          </motion.p>
          
          {/* TrustBox widget */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
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
          
          {/* Add testimonial submission form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <TestimonialSubmissionForm />
          </motion.div>
        </div>

        {/* TestimonialSlider inside hero */}
        <div className="relative z-10">
          {/* Floating elements */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div 
              className="absolute top-10 left-0 text-6xl text-purple-300 opacity-20" 
              animate={{ x: [0, 100] }} 
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              ♪
            </motion.div>
            <motion.div 
              className="absolute bottom-10 right-0 text-4xl text-orange-300 opacity-20" 
              animate={{ x: [0, -100] }} 
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              🎵
            </motion.div>
          </div>

          <TestimonialSlider />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Testimonials;
