
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TestimonialSlider from "@/components/TestimonialSlider";
import { useLanguage } from "@/contexts/LanguageContext";

const Testimonials = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Page Title */}
      <section className="py-12 bg-purple-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("testimonials_page_title", "Customer Testimonials")}
          </h1>
          <p className="text-lg md:text-xl text-purple-100 max-w-3xl mx-auto">
            {t("testimonials_page_description", "Discover what our customers say about their personalized music experience")}
          </p>
        </div>
      </section>

      {/* Enhanced Testimonials Slider */}
      <TestimonialSlider />

      <Footer />
    </div>
  );
};

export default Testimonials;
