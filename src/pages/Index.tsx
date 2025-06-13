import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import VideoHero from "@/components/VideoHero";
import HeroContent from "@/components/HeroContent";
import ScenarioHero from "@/components/ScenarioHero";
import AnimatedStepFlow from "@/components/AnimatedStepFlow";
import LazyTestimonialSlider from "@/components/LazyTestimonialSlider";
import ImpactCards from "@/components/ImpactCards";
import CollaborationSection from "@/components/CollaborationSection";
import SEOHead from "@/components/SEOHead";
import { useStructuredData } from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Heart, Music, ShoppingCart, Gift, Mic, Star, Rocket, PartyPopper, Disc, Trophy } from "lucide-react";
import { useEffect } from "react";

const Index = () => {
  const { t } = useLanguage();
  const { websiteSchema, organizationSchema, serviceSchema } = useStructuredData();
  
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

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [websiteSchema, organizationSchema, serviceSchema]
  };

  return (
    <>
      <SEOHead
        title={t('heroTitle') + ' - MusicGift.ro'}
        description={t('heroSubtitle') + ' ' + t('heroCtaSubtitle')}
        structuredData={combinedSchema}
      />
      
      <div className="min-h-screen">
        <Navigation />
        
        {/* Video Hero Section */}
        <VideoHero />

        {/* Main content with unified background and minimal animations */}
        <main className="relative overflow-hidden" style={backgroundStyle}>
          {/* Enhanced overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-black/50" />
          
          {/* Minimal CSS-only background animation - Only 3 elements for performance */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse" style={{
              top: '10%',
              left: '20%',
              animationDelay: '0s',
              animationDuration: '4s'
            }} />
            <div className="absolute w-1 h-1 bg-white/15 rounded-full animate-pulse" style={{
              top: '70%',
              right: '25%',
              animationDelay: '2s',
              animationDuration: '6s'
            }} />
            <div className="absolute w-1 h-1 bg-white/10 rounded-full animate-pulse" style={{
              bottom: '20%',
              left: '60%',
              animationDelay: '4s',
              animationDuration: '5s'
            }} />
          </div>

          <div className="relative z-10">
            
            {/* Hero Content Section */}
            <section className="py-4 md:py-0">
              <HeroContent />
            </section>

            {/* Impact Cards */}
            <section className="py-2 md:py-4">
              <ImpactCards />
            </section>

            {/* Animated Step Flow */}
            <section className="py-2 md:py-4" aria-label={t('howItWorks', 'How It Works')}>
              <AnimatedStepFlow />
            </section>

            {/* Testimonials - Lazy loaded for better performance */}
            <section className="py-2 md:py-4" aria-label={t('testimonials', 'Customer Testimonials')}>
              <LazyTestimonialSlider />
            </section>

            {/* Optimized Scrolling Statistics Section with CSS animation */}
            <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] my-2 md:my-4 overflow-hidden" aria-label="Company Statistics">
              <div className="bg-gradient-to-r from-white/5 via-white/20 to-white/5 backdrop-blur-sm border-y border-white/10 py-[2px] relative z-10">
                {/* Single set with CSS animation for better performance */}
                <div className="flex space-x-8 md:space-x-16 whitespace-nowrap" style={{
                  animation: 'scroll 30s linear infinite',
                  transform: 'translate3d(0,0,0)' // Hardware acceleration
                }}>
                  <div className="flex items-center space-x-2 md:space-x-4 text-sm md:text-xl font-bold">
                    <Music className="w-6 h-6 md:w-12 md:h-12 text-blue-300" aria-hidden="true" />
                    <span className="text-lg md:text-3xl text-white">2.000+</span>
                    <span className="opacity-90 text-sm md:text-xl text-white">{t('personalizedSongs')}</span>
                  </div>
                  <div className="flex items-center space-x-2 md:space-x-4 text-sm md:text-xl font-bold">
                    <Mic className="w-6 h-6 md:w-12 md:h-12 text-purple-300" aria-hidden="true" />
                    <span className="text-lg md:text-3xl text-white">20+</span>
                    <span className="opacity-90 text-sm md:text-xl text-white">{t('yearsMusicalPassion')}</span>
                  </div>
                  <div className="flex items-center space-x-2 md:space-x-4 text-sm md:text-xl font-bold">
                    <Star className="w-6 h-6 md:w-12 md:h-12 text-yellow-400" aria-hidden="true" />
                    <span className="text-lg md:text-3xl text-white">98%</span>
                    <span className="opacity-90 text-sm md:text-xl text-white">{t('happyClients')}</span>
                  </div>
                  <div className="flex items-center space-x-2 md:space-x-4 text-sm md:text-xl font-bold">
                    <Rocket className="w-6 h-6 md:w-12 md:h-12 text-orange-400" aria-hidden="true" />
                    <span className="text-lg md:text-3xl text-white">50+</span>
                    <span className="opacity-90 text-sm md:text-xl text-white">{t('launchedArtists')}</span>
                  </div>
                  <div className="flex items-center space-x-2 md:space-x-4 text-sm md:text-xl font-bold">
                    <PartyPopper className="w-6 h-6 md:w-12 md:h-12 text-red-200" aria-hidden="true" />
                    <span className="text-lg md:text-3xl text-white">400+</span>
                    <span className="opacity-90 text-sm md:text-xl text-white">{t('memorableEvents')}</span>
                  </div>
                  <div className="flex items-center space-x-2 md:space-x-4 text-sm md:text-xl font-bold">
                    <Disc className="w-6 h-6 md:w-12 md:h-12 text-indigo-300" aria-hidden="true" />
                    <span className="text-lg md:text-3xl text-white">100+</span>
                    <span className="opacity-90 text-sm md:text-xl text-white">{t('releasedAlbums')}</span>
                  </div>
                  <div className="flex items-center space-x-2 md:space-x-4 text-sm md:text-xl font-bold">
                    <Trophy className="w-6 h-6 md:w-12 md:h-12 text-orange-300" aria-hidden="true" />
                    <span className="text-lg md:text-3xl text-white">1 Milion+</span>
                    <span className="opacity-90 text-sm md:text-xl text-white">{t('copiesSold')}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Decorative separator element */}
            <div className="bg-gradient-to-r from-white/5 via-white/20 to-white/5 backdrop-blur-sm border-y border-white/10 py-[1px]" />
          </div>
        </main>

        {/* Collaboration Section - Keep separate background */}
        <CollaborationSection />

        {/* CTA Section - Moved here after CollaborationSection */}
        <section className="px-2 md:px-4 text-white text-center relative overflow-hidden py-4 md:py-8" style={backgroundStyle}>
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-black/50 py-0" />
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
                <Button 
                  size="sm" 
                  className="bg-orange-500 hover:bg-orange-600 text-white border-0 min-w-[140px] md:min-w-[180px] text-sm md:text-base focus:ring-2 focus:ring-orange-300"
                  aria-label={t('orderNow', 'Order Now') + ' - ' + t('createPersonalizedSong', 'Create a personalized song')}
                >
                  <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2" aria-hidden="true" />
                  {t('orderNow')}
                </Button>
              </Link>
              
              <Link to="/gift">
                <Button 
                  size="sm" 
                  className="border-red-200 min-w-[140px] md:min-w-[180px] bg-fuchsia-600 hover:bg-fuchsia-500 text-sm md:text-base focus:ring-2 focus:ring-fuchsia-300"
                  aria-label={t('buyGiftCard', 'Buy a Gift Card') + ' - ' + t('givePersonalizedSong', 'Give a personalized song as a gift')}
                >
                  <Gift className="w-4 h-4 md:w-5 md:h-5 mr-2" aria-hidden="true" />
                  {t('buyGiftCard', 'Buy a Gift Card')}
                </Button>
              </Link>
              
              <Link to="/packages">
                <Button 
                  size="sm" 
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm min-w-[140px] md:min-w-[180px] text-sm md:text-base focus:ring-2 focus:ring-white/50"
                  aria-label={t('seePackages', 'See Packages') + ' - ' + t('viewAvailablePackages', 'View available song packages')}
                >
                  <Music className="w-4 h-4 md:w-5 md:h-5 mr-2" aria-hidden="true" />
                  {t('seePackages')}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Index;
