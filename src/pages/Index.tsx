import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import VideoHero from "@/components/VideoHero";
import HeroContent from "@/components/HeroContent";
import ScenarioHero from "@/components/ScenarioHero";
import AnimatedStepFlow from "@/components/AnimatedStepFlow";
import TestimonialSlider from "@/components/TestimonialSlider";
import ImpactCards from "@/components/ImpactCards";
import CollaborationSection from "@/components/CollaborationSection";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Heart, Sparkles, Music } from "lucide-react";
import { motion } from "framer-motion";
const Index = () => {
  const {
    t
  } = useLanguage();
  const backgroundStyle = {
    backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };
  return <div className="min-h-screen">
      <Navigation />
      
      {/* Video Hero Section */}
      <VideoHero />

      {/* Hero Content Section - Now contains the main call to action */}
      <HeroContent />

      {/* Scenario Hero Component */}
      <div className="relative overflow-hidden" style={backgroundStyle}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <ScenarioHero />
        </div>
      </div>

      {/* Impact Cards - Moved before steps */}
      <div className="relative overflow-hidden" style={backgroundStyle}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <ImpactCards />
        </div>
      </div>

      {/* Animated Step Flow */}
      <div className="relative overflow-hidden" style={backgroundStyle}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <AnimatedStepFlow />
        </div>
      </div>

      {/* Testimonials */}
      <div className="relative overflow-hidden" style={backgroundStyle}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <TestimonialSlider />
        </div>
      </div>

      {/* Collaboration Section */}
      <CollaborationSection />

      {/* CTA Section */}
      <section style={backgroundStyle} className="px-4 text-white text-center relative overflow-hidden my-0 py-[44px]">
        <div className="absolute inset-0 bg-black/20 my-[33px] py-0"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <Sparkles className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('heroCtaTitle')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('heroCtaSubtitle')}
          </p>
          <Link to="/packages">
            <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
              <Heart className="w-5 h-5 mr-2" />
              {t('getStarted')}
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Index;