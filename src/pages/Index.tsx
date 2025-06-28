
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
import StructuredDataLoader from "@/components/StructuredDataLoader";
import WelcomeBanner from "@/components/WelcomeBanner";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import CriticalCSS from "@/components/CriticalCSS";
import EnhancedStructuredData from "@/components/EnhancedStructuredData";
import OptimizedImage from "@/components/OptimizedImage";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Music, ShoppingCart, Gift, Mic, Star, Rocket, PartyPopper, Disc, Trophy } from "lucide-react";
import { useEffect } from "react";
import VoiceSearchFAQ from "@/components/VoiceSearchFAQ";
import VoiceSearchContent from "@/components/VoiceSearchContent";
import VoiceSearchStructuredData from "@/components/VoiceSearchStructuredData";

const Index = () => {
  const { t } = useLanguage();
  
  // Performance monitoring
  useEffect(() => {
    performance.mark('index-page-start');
    return () => {
      performance.mark('index-page-end');
      performance.measure('index-page-load', 'index-page-start', 'index-page-end');
    };
  }, []);

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="MusicGift.ro - Cadouri Muzicale Personalizate"
        description="Creează melodii personalizate și cadouri muzicale unice. Servicii profesionale de compoziție. Peste 2000 melodii create cu dragoste."
      />
      
      {/* Performance and Critical CSS Components */}
      <PerformanceMonitor />
      <CriticalCSS />
      
      {/* Skip Navigation for Accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50">
        Sari la conținutul principal
      </a>
      
      <Navigation />
      
      {/* Video Hero Section with LCP optimizations */}
      <div className="video-hero-optimized">
        <VideoHero />
      </div>

      {/* Welcome Banner for First-Time Visitors - positioned after video header */}
      <WelcomeBanner />

      {/* Main Content with Semantic HTML and SEO Optimizations - Simplified for LCP */}
      <main id="main-content" className="main-lcp-critical relative overflow-hidden critical-resource">
        {/* Simplified overlay for better LCP */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10">
          
          {/* Hero Content Section */}
          <section className="py-4 md:py-0 critical-resource" aria-labelledby="hero-heading">
            <div className="sr-only">
              <h2 id="hero-heading">Cadouri Muzicale Personalizate - MusicGift.ro</h2>
              <p>Transformă emoțiile în muzică cu serviciile noastre profesionale de compoziție muzicală personalizată. Creăm melodii unice pentru nunți, botezuri, aniversări și orice moment special din viața ta.</p>
            </div>
            <HeroContent />
          </section>

          {/* Impact Cards Section - Deferred for LCP */}
          <section className="py-2 md:py-4 defer-load" aria-labelledby="impact-heading">
            <h2 id="impact-heading" className="sr-only">Impactul Serviciilor Noastre Muzicale</h2>
            <ImpactCards />
          </section>

          {/* Process Flow Section - Deferred for LCP */}
          <section className="py-2 md:py-4 defer-load" aria-labelledby="process-heading">
            <h2 id="process-heading" className="sr-only">Cum Funcționează Procesul de Creare a Melodiilor Personalizate</h2>
            <AnimatedStepFlow />
          </section>

          {/* Voice Search FAQ Section - New for Voice Search SEO */}
          <section className="defer-load" aria-labelledby="voice-faq-heading">
            <h2 id="voice-faq-heading" className="sr-only">Întrebări Frecvente pentru Căutări Vocale</h2>
            <VoiceSearchFAQ />
          </section>

          {/* Voice Search Content Section - New for Voice Search SEO */}
          <section className="defer-load" aria-labelledby="voice-content-heading">
            <h2 id="voice-content-heading" className="sr-only">Conținut Optimizat pentru Căutări Vocale</h2>
            <VoiceSearchContent />
          </section>

          {/* Testimonials Section - Deferred for LCP */}
          <section className="py-2 md:py-4 defer-load" aria-labelledby="testimonials-heading">
            <h2 id="testimonials-heading" className="sr-only">Mărturii ale Clienților Noștri Mulțumiți</h2>
            <LazyTestimonialSlider />
          </section>

          {/* Statistics Section with Enhanced SEO - Deferred for LCP */}
          <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] my-2 md:my-4 overflow-hidden defer-load" aria-labelledby="stats-heading">
            <h2 id="stats-heading" className="sr-only">Statistici și Realizări MusicGift.ro</h2>
            <div className="bg-gradient-to-r from-white/5 via-white/20 to-white/5 backdrop-blur-sm border-y border-white/10 py-[2px] relative z-10">
              {/* Single set with CSS animation for better performance */}
              <div className="flex space-x-8 md:space-x-16 whitespace-nowrap hw-accelerated" style={{
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
          <div className="bg-gradient-to-r from-white/5 via-white/20 to-white/5 backdrop-blur-sm border-y border-white/10 py-[1px]" role="separator" aria-hidden="true" />
        </div>
      </main>

      {/* Collaboration Section - Keep separate background - Deferred for LCP */}
      <section aria-labelledby="collaboration-heading" className="defer-load">
        <h2 id="collaboration-heading" className="sr-only">Colaborarea Noastră cu Artiștii</h2>
        <CollaborationSection />
      </section>

      {/* Call-to-Action Section - Deferred for LCP with optimized images */}
      <section className="main-lcp-critical px-2 md:px-4 text-white text-center relative overflow-hidden py-4 md:py-8 defer-load" aria-labelledby="cta-heading">
        
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-black/50 py-0" />
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 id="cta-heading" className="text-base md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3">
            {t('heroCtaTitle')}
          </h2>
          <p className="text-sm md:text-xl mb-4 md:mb-6 opacity-90">
            {t('heroCtaSubtitle')}
          </p>
          
          {/* Three Call-to-Action Buttons with Enhanced Accessibility */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <Link to="/order" aria-label="Comandă acum o melodie personalizată">
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white border-0 min-w-[140px] md:min-w-[180px] text-sm md:text-base focus:ring-2 focus:ring-orange-400 focus:ring-offset-2">
                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2" aria-hidden="true" />
                {t('orderNow')}
              </Button>
            </Link>
            
            <Link to="/gift" aria-label="Cumpără un card cadou muzical">
              <Button size="sm" className="border-red-200 min-w-[140px] md:min-w-[180px] bg-fuchsia-600 hover:bg-fuchsia-500 text-sm md:text-base focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2">
                <Gift className="w-4 h-4 md:w-5 md:h-5 mr-2" aria-hidden="true" />
                {t('buyGiftCard', 'Buy a Gift Card')}
              </Button>
            </Link>
            
            <Link to="/packages" aria-label="Vezi toate pachetele muzicale disponibile">
              <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm min-w-[140px] md:min-w-[180px] text-sm md:text-base focus:ring-2 focus:ring-white/50 focus:ring-offset-2">
                <Music className="w-4 h-4 md:w-5 md:h-5 mr-2" aria-hidden="true" />
                {t('seePackages')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Load structured data at the end for better performance */}
      <StructuredDataLoader />
      <EnhancedStructuredData />
      
      {/* Voice Search Structured Data */}
      <VoiceSearchStructuredData />
    </div>
  );
};

export default Index;
