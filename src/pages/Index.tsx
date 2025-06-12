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
import { Heart, Music, ShoppingCart, Gift, Mic, Star, Rocket, PartyPopper, Disc, Trophy } from "lucide-react";
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

      {/* Main content with unified background and minimal gaps */}
      <div className="relative overflow-hidden" style={backgroundStyle}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          
          {/* Hero Content Section */}
          <div className="py-4 md:py-8">
            <HeroContent />
          </div>

          {/* Scenario Hero Component */}
          <div className="py-2 md:py-4">
            <ScenarioHero />
          </div>

          {/* Impact Cards */}
          <div className="py-2 md:py-4">
            <ImpactCards />
          </div>

          {/* Animated Step Flow */}
          <div className="py-2 md:py-4">
            <AnimatedStepFlow />
          </div>

          {/* Professional Full-Screen Scrolling Statistics Section */}
          <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] my-2 md:my-4 overflow-hidden">
            <div className="bg-gradient-to-r from-white/5 via-white/20 to-white/5 backdrop-blur-sm border-y border-white/10 py-[2px] relative z-10">
              <div className="flex space-x-8 md:space-x-16 whitespace-nowrap animate-[scroll_5s_linear_infinite]">
                {/* First set of statistics */}
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
                
                {/* Duplicate set for seamless scrolling */}
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
                  <Star className="w-6 h-6 md:w-12 md:h-12 text-yellow-300" />
                  <span className="text-lg md:text-3xl text-white">98%</span>
                  <span className="opacity-90 text-sm md:text-xl text-white">{t('happyClients')}</span>
                </div>
                <div className="flex items-center space-x-2 md:space-x-4 text-sm md:text-xl font-bold">
                  <Rocket className="w-6 h-6 md:w-12 md:h-12 text-green-300" />
                  <span className="text-lg md:text-3xl text-white">50+</span>
                  <span className="opacity-90 text-sm md:text-xl text-white">{t('launchedArtists')}</span>
                </div>
                <div className="flex items-center space-x-2 md:space-x-4 text-sm md:text-xl font-bold">
                  <PartyPopper className="w-6 h-6 md:w-12 md:h-12 text-pink-300" />
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

          {/* Testimonials */}
          <div className="py-2 md:py-4">
            <TestimonialSlider />
          </div>

          {/* CTA Section */}
          <section className="px-2 md:px-4 text-white text-center relative overflow-hidden py-4 md:py-8">
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

        </div>
      </div>

      {/* Collaboration Section - Keep separate background */}
      <CollaborationSection />

      <Footer />
    </div>
  );
};

export default Index;
