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
          
          {/* Impact Stats */}
          
        </div>
      </section>

      {/* Enhanced Trust Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div className="text-center mb-12" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            
            
            
            {/* Enhanced Trustpilot Widget */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="trustpilot-widget shadow-lg rounded-lg overflow-hidden bg-gradient-to-r from-green-50 to-blue-50 p-4" data-locale="en-US" data-template-id="56278e9abfbbba0bdcd568bc" data-businessunit-id="684414032f7e44f180176d5b" data-style-height="80px" data-style-width="100%">
                <a href="https://www.trustpilot.com/review/musicgift.ro" target="_blank" rel="noopener" className="text-green-600 font-semibold">
                  View our Trustpilot reviews →
                </a>
              </div>
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.3
        }}>
            <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <Star className="w-12 h-12 text-yellow-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">5-Star Reviews</h3>
              <p className="text-sm text-gray-600">Consistently rated excellent by our customers</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <Users className="w-12 h-12 text-blue-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">10K+ Customers</h3>
              <p className="text-sm text-gray-600">Growing community of satisfied clients</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 py-0 px-[5px] rounded-none">
              <Award className="w-12 h-12 text-green-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Award Winning</h3>
              <p className="text-sm text-gray-600">Recognized for excellence in personalized music</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
              <Shield className="w-12 h-12 text-orange-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Secure & Safe</h3>
              <p className="text-sm text-gray-600">Your data and payments are always protected</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Showcase */}
      <section className="py-16 bg-gradient-to-br from-purple-50 via-white to-pink-50">
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