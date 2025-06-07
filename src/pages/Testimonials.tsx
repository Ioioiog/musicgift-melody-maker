
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TestimonialSlider from "@/components/TestimonialSlider";
import TestimonialSubmissionForm from "@/components/TestimonialSubmissionForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Star, Users, Award, Shield } from "lucide-react";

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

  const backgroundStyle = {
    backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Enhanced Hero Section with Purple Musical Background */}
      <section 
        className="py-20 text-white relative overflow-hidden"
        style={backgroundStyle}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Floating Musical Notes */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute top-10 left-10 text-4xl opacity-30" 
            style={{
              transform: "translateX(35.2px) translateY(-17.6px) rotate(296.64deg)"
            }}
          >
            ♪
          </div>
          <div 
            className="absolute bottom-10 right-10 text-6xl opacity-20" 
            style={{
              transform: "translateX(-69.12px) translateY(34.56px) rotate(-77.76deg)"
            }}
          >
            🎵
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            {t('testimonialsTitle')}
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('testimonialsSubtitle')}
          </motion.p>
          
          {/* Trustpilot Widget in Hero */}
          <motion.div 
            className="max-w-2xl mx-auto mb-8" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div 
              className="trustpilot-widget shadow-lg rounded-lg overflow-hidden bg-gradient-to-r from-green-50 to-blue-50 p-4" 
              data-locale="en-US" 
              data-template-id="56278e9abfbbba0bdcd568bc" 
              data-businessunit-id="684414032f7e44f180176d5b" 
              data-style-height="80px" 
              data-style-width="100%"
            >
              <a 
                href="https://www.trustpilot.com/review/musicgift.ro" 
                target="_blank" 
                rel="noopener" 
                className="text-green-600 font-semibold"
              >
                View our Trustpilot reviews →
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Showcase */}
      <section className="relative overflow-hidden" style={backgroundStyle}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4">
            <TestimonialSlider />
          </div>
        </div>
      </section>

      {/* Testimonial Submission Section */}
      <section className="py-16 relative overflow-hidden" style={backgroundStyle}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          
        </div>
      </section>

      {/* CTA Section */}
      

      <Footer />
    </div>
  );
};

export default Testimonials;
