

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
import { Heart, Music, ShoppingCart, Gift } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const { t } = useLanguage();

  const backgroundStyle = {
    backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Video Hero Section */}
      <VideoHero />

      {/* Hero Content Section - Now with background */}
      <div className="relative overflow-hidden" style={backgroundStyle}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <HeroContent />
        </div>
      </div>

      {/* Scenario Hero Component */}
      <div className="relative overflow-hidden" style={backgroundStyle}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <ScenarioHero />
        </div>
      </div>

      {/* Impact Cards - Already has background */}
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

      {/* Collaboration Section - Already has background */}
      <CollaborationSection />

      {/* CTA Section */}
      <section style={backgroundStyle} className="px-4 text-white text-center relative overflow-hidden my-0 py-[44px]">
        <div className="absolute inset-0 bg-black/20 py-0 my-0"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('heroCtaTitle')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('heroCtaSubtitle')}
          </p>
          
          {/* Three Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/order">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white border-0 min-w-[180px]">
                <ShoppingCart className="w-5 h-5 mr-2" />
                {t('orderNow')}
              </Button>
            </Link>
            
            <Link to="/gift">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white border-0 min-w-[180px]">
                <Gift className="w-5 h-5 mr-2" />
                {t('buyGiftCard', 'Buy a Gift Card')}
              </Button>
            </Link>
            
            <Link to="/packages">
              <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm min-w-[180px]">
                <Music className="w-5 h-5 mr-2" />
                {t('seePackages')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

