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
          
          {/* Trustpilot Button */}
          <motion.div 
            className="max-w-2xl mx-auto mb-8" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a 
              href="https://www.trustpilot.com/review/musicgift.ro" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block"
            >
              <div className="bg-white border-2 border-green-500 rounded-lg px-8 py-4 hover:bg-green-50 transition-colors duration-200 shadow-sm">
                <span className="text-gray-800 font-medium text-lg">
                  Review us on <span className="text-green-500">⭐</span> Trustpilot
                </span>
              </div>
            </a>
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
