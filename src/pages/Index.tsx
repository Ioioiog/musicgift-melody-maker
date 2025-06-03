
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import VideoHero from "@/components/VideoHero";
import ScenarioHero from "@/components/ScenarioHero";
import AnimatedStepFlow from "@/components/AnimatedStepFlow";
import TestimonialSlider from "@/components/TestimonialSlider";
import ImpactCards from "@/components/ImpactCards";
import ScenarioBanner from "@/components/ScenarioBanner";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Heart, Sparkles } from "lucide-react";

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Video Hero Section */}
      <VideoHero />

      {/* Scenario Hero Component */}
      <ScenarioHero />

      {/* Scenario Banner */}
      <ScenarioBanner />

      {/* Animated Step Flow */}
      <AnimatedStepFlow />

      {/* Impact Cards */}
      <ImpactCards />

      {/* Testimonials */}
      <TestimonialSlider />

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-600 to-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <Sparkles className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('heroCtaTitle')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('heroCtaSubtitle')}
          </p>
          <Link to="/packages">
            <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
              <Heart className="w-5 h-5 mr-2" />
              {t('getStarted')}
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
