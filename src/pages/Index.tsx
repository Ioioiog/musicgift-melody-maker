import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import VideoHero from "@/components/VideoHero";
import HeroContent from "@/components/HeroContent";
import ScenarioHero from "@/components/ScenarioHero";
import AnimatedStepFlow from "@/components/AnimatedStepFlow";
import LazyTestimonialSlider from "@/components/LazyTestimonialSlider";
import ImpactCards from "@/components/ImpactCards";
import CollaborationSection from "@/components/CollaborationSection";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Heart, Music, ShoppingCart, Gift, Mic, Star, Rocket, PartyPopper, Disc, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

const Index = () => {
  const {
    t
  } = useLanguage();
  
  // Performance monitoring
  useEffect(() => {
    performance.mark('index-page-start');
    return () => {
      performance.mark('index-page-end');
      performance.measure('index-page-load', 'index-page-start', 'index-page-end');
    };
  }, []);

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

      {/* Main content with unified background, particles, and minimal gaps */}
      <div className="relative overflow-hidden will-change-transform" style={backgroundStyle}>
        {/* Enhanced overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-black/50"></div>
        
        {/* Reduced unified animated background particles (reduced from 30 to 15) */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => <motion.div key={i} className="absolute w-2 h-2 bg-white/20 rounded-full will-change-transform" initial={{
          x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
          y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
          scale: 0
        }} animate={{
          y: [null, -100, (typeof window !== 'undefined' ? window.innerHeight : 800) + 100],
          scale: [0, 1, 0],
          opacity: [0, 0.8, 0]
        }} transition={{
          duration: Math.random() * 15 + 15,
          repeat: Infinity,
          delay: Math.random() * 10
        }} />)}
        </div>

        <div className="relative z-10">
          
          {/* Hero Content Section */}
          <div className="py-4 md:py-0">
            <HeroContent />
          </div>

          {/* Impact Cards */}
          <div className="py-2 md:py-4">
            <ImpactCards />
          </div>

          {/* Animated Step Flow */}
          <div className="py-2 md:py-4">
            <AnimatedStepFlow />
          </div>

          {/* Testimonials - Lazy loaded for better performance */}
          <div className="py-2 md:py-4">
            <LazyTestimonialSlider />
          </div>

          {/* Optimized Scrolling Statistics Section with CSS animation */}
          <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] my-2 md:my-4 overflow-hidden">
            <div className="bg-gradient-to-r from-white/5 via-white/20 to-white/5 backdrop-blur-sm border-y border-white/10 py-[2px] relative z-10">
              {/* Single set with CSS animation for better performance */}
              <div className="flex space-x-8 md:space-x-16 whitespace-nowrap" style={{
                animation: 'scroll 30s linear infinite',
                transform: 'translateX(0)'
              }}>
                <div className="flex items-center space-x-2 md:space-x-4 text-sm md:text-xl font-bold">
                  <Music className="w-6 h-6 md:w-12 md:h-12 text-blue-300" />
                  <span className="text-lg md:text-3xl text-white">2.000+</span>
                  <span className="opacity-90 text-sm md:text-xl text-white">{t('personalizedSongs')}</span>
                </div>
                <div className="flex items-center space-x-2 md:space-x-4 text-sm md:text-xl font-bold">
                  <Mic className="w-6 h-6 md:w-12 md:h-12 text-purple-300" />
                  <span className="text-lg md:text-3xl text-white">20+</span>
                  <span className="opacity-90 text-sm md:text-xl text-white">{t('yearsMusicalPassion')}</span>
                </div>
                <div className="flex items-center space-x-2 md:space-x-4 text-sm md:text-xl font-bold">
                  <Star className="w-6 h-6 md:w-12 md:h-12 text-yellow-400" />
                  <span className="text-lg md:text-3xl text-white">98%</span>
                  <span className="opacity-90 text-sm md:text-xl text-white">{t('happyClients')}</span>
                </div>
                <div className="flex items-center space-x-2 md:space-x-4 text-sm md:text-xl font-bold">
                  <Rocket className="w-6 h-6 md:w-12 md:h-12 text-orange-400" />
                  <span className="text-lg md:text-3xl text-white">50+</span>
                  <span className="opacity-90 text-sm md:text-xl text-white">{t('launchedArtists')}</span>
                </div>
                <div className="flex items-center space-x-2 md:space-x-4 text-sm md:text-xl font-bold">
                  <PartyPopper className="w-6 h-6 md:w-12 md:h-12 text-red-200" />
                  <span className="text-lg md:text-3xl text-white">400+</span>
                  <span className="opacity-90 text-sm md:text-xl text-white">{t('memorableEvents')}</span>
                </div>
                <div className="flex items-center space-x-2 md:space-x-4 text-sm md:text-xl font-bold">
                  <Disc className="w-6 h-6 md:w-12 md:h-12 text-indigo-300" />
                  <span className="text-lg md:text-3xl text-white">100+</span>
                  <span className="opacity-90 text-sm md:text-xl text-white">{t('releasedAlbums')}</span>
                </div>
                <div className="flex items-center space-x-2 md:space-x-4 text-sm md:text-xl font-bold">
                  <Trophy className="w-6 h-6 md:w-12 md:h-12 text-orange-300" />
                  <span className="text-lg md:text-3xl text-white">1 Milion+</span>
                  <span className="opacity-90 text-sm md:text-xl text-white">{t('copiesSold')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative separator element */}
          <div className="bg-gradient-to-r from-white/5 via-white/20 to-white/5 backdrop-blur-sm border-y border-white/10 py-[1px]"></div>

        </div>
      </div>

      {/* Collaboration Section - Keep separate background */}
      <CollaborationSection />

      {/* CTA Section - Moved here after CollaborationSection */}
      <section className="px-2 md:px-4 text-white text-center relative overflow-hidden py-4 md:py-8" style={backgroundStyle}>
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-black/50 py-0"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-base md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3">
            {t('heroCtaTitle')}
          </h2>
          <p className="text-sm md:text-xl mb-4 md:mb-6 opacity-90">
            {t('heroCtaSubtitle')}
          </p>
          
          {/* Three Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <Link to="/order">
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white border-0 min-w-[140px] md:min-w-[180px] text-sm md:text-base">
                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                {t('orderNow')}
              </Button>
            </Link>
            
            <Link to="/gift">
              <Button size="sm" className="border-red-200 min-w-[140px] md:min-w-[180px] bg-fuchsia-600 hover:bg-fuchsia-500 text-sm md:text-base">
                <Gift className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                {t('buyGiftCard', 'Buy a Gift Card')}
              </Button>
            </Link>
            
            <Link to="/packages">
              <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm min-w-[140px] md:min-w-[180px] text-sm md:text-base">
                <Music className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                {t('seePackages')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};

export default Index;
