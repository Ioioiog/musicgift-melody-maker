
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

      {/* Call to Action Section - Moved from About page */}
      <section className="py-20 px-4 text-white relative overflow-hidden" style={backgroundStyle}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            className="text-center bg-gradient-to-r from-white/10 to-white/20 backdrop-blur-md rounded-2xl border border-white/30 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Music className="w-12 h-12 text-white mx-auto mb-3 opacity-80" />
            <h2 className="text-2xl font-bold text-white mb-3">{t('readyToStart') || 'Ready to Create Your Song?'}</h2>
            <p className="text-base text-white/90 mb-4 max-w-xl mx-auto leading-relaxed">
              {t('readyToStartDesc') || 'Join thousands of satisfied customers who have turned their stories into beautiful, personalized songs.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.a
                href="/order"
                className="bg-white text-purple-800 font-bold py-3 px-6 rounded-full text-base hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('startYourSong') || 'Start Your Song'}
              </motion.a>
              <motion.a
                href="/packages"
                className="border-2 border-white text-white font-bold py-3 px-6 rounded-full text-base hover:bg-white hover:text-purple-800 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('viewPackages') || 'View Packages'}
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hero Content Section */}
      <HeroContent />

      {/* Scenario Hero Component */}
      <div className="relative overflow-hidden" style={backgroundStyle}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <ScenarioHero />
        </div>
      </div>

      {/* Animated Step Flow */}
      <div className="relative overflow-hidden" style={backgroundStyle}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <AnimatedStepFlow />
        </div>
      </div>

      {/* Impact Cards */}
      <div className="relative overflow-hidden" style={backgroundStyle}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <ImpactCards />
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
      <section className="py-20 px-4 text-white text-center relative overflow-hidden" style={backgroundStyle}>
        <div className="absolute inset-0 bg-black/20"></div>
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
    </div>
  );
};

export default Index;
