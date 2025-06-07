import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TestimonialSlider from "@/components/TestimonialSlider";
import TestimonialSubmissionForm from "@/components/TestimonialSubmissionForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Star, Users, Award, Shield } from "lucide-react";
const Testimonials = () => {
  const {
    t
  } = useLanguage();
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
  return <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Navigation />
      
      {/* Clean Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            {t('testimonialsTitle')}
          </motion.h1>
          <motion.p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }}>
            {t('testimonialsSubtitle')}
          </motion.p>
          
          {/* Trustpilot Widget in Hero */}
          <motion.div className="max-w-2xl mx-auto mb-8" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }}>
            <div className="trustpilot-widget shadow-lg rounded-lg overflow-hidden bg-gradient-to-r from-green-50 to-blue-50 p-4" data-locale="en-US" data-template-id="56278e9abfbbba0bdcd568bc" data-businessunit-id="684414032f7e44f180176d5b" data-style-height="80px" data-style-width="100%">
              <a href="https://www.trustpilot.com/review/musicgift.ro" target="_blank" rel="noopener" className="text-green-600 font-semibold">
                View our Trustpilot reviews →
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Trust Section */}
      

      {/* Testimonials Showcase */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-pink-50 py-0">
        <div className="max-w-7xl mx-auto px-4">
          <TestimonialSlider />
        </div>
      </section>

      {/* Testimonial Submission Section */}
      <section className="py-16 bg-white">
        
      </section>

      {/* CTA Section */}
      

      <Footer />
    </div>;
};
export default Testimonials;