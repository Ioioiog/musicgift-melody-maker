import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TestimonialSlider from "@/components/TestimonialSlider";
import { useLanguage } from "@/contexts/LanguageContext";
const Testimonials = () => {
  const {
    t
  } = useLanguage();
  return <div className="min-h-screen">
      <Navigation />
      
      {/* Page Title */}
      

      {/* Enhanced Testimonials Slider */}
      <TestimonialSlider />

      <Footer />
    </div>;
};
export default Testimonials;