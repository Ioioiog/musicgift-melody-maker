
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
      <section className="pt-24 pb-8 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">{t('testimonialsTitle')}</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('testimonialsSubtitle')}
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
