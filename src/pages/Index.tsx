
import { lazy, Suspense, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Music, ShoppingCart, Gift, Mic, Star, Rocket, PartyPopper, Disc, Trophy } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Lazy load non-critical components
const Navigation = lazy(() => import("@/components/Navigation"));
const Footer = lazy(() => import("@/components/Footer"));
const VideoHero = lazy(() => import("@/components/VideoHero"));
const HeroContent = lazy(() => import("@/components/HeroContent"));
const AnimatedStepFlow = lazy(() => import("@/components/AnimatedStepFlow"));
const OptimizedTestimonialSlider = lazy(() => import("@/components/OptimizedTestimonialSlider"));
const ImpactCards = lazy(() => import("@/components/ImpactCards"));
const CollaborationSection = lazy(() => import("@/components/CollaborationSection"));
const SEOHead = lazy(() => import("@/components/SEOHead"));
const OptimizedVoiceSearchSection = lazy(() => import("@/components/OptimizedVoiceSearchSection"));
const WelcomeBanner = lazy(() => import("@/components/WelcomeBanner"));
const MobileHeroSection = lazy(() => import("@/components/MobileHeroSection"));

// Loading fallback component
const LoadingFallback = ({
  className = ""
}: {
  className?: string;
}) => <div className={`animate-pulse bg-white/10 rounded-lg ${className}`} />;

const Index = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

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
      <Suspense fallback={<LoadingFallback className="h-4" />}>
        <SEOHead title="MusicGift.ro - Cadouri Muzicale Personalizate" description="Creează melodii personalizate și cadouri muzicale unice. Servicii profesionale de compoziție. Peste 2000 melodii create cu dragoste." />
      </Suspense>
      
      {/* Skip Navigation for Accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50">
        Sari la conținutul principal
      </a>
      
      <Suspense fallback={<LoadingFallback className="h-16" />}>
        <Navigation />
      </Suspense>
      
      {/* Video Hero Section */}
      <div className="video-hero-optimized">
        <Suspense fallback={<LoadingFallback className="h-96" />}>
          <VideoHero />
        </Suspense>
      </div>

      {/* Welcome Banner - High z-index to stay above overlays */}
      <Suspense fallback={<LoadingFallback className="h-12" />}>
        <WelcomeBanner />
      </Suspense>

      {/* Mobile Hero Section - Shows only on mobile after welcome banner */}
      <Suspense fallback={<LoadingFallback className="h-24" />}>
        <MobileHeroSection />
      </Suspense>

      {/* Main Content - Restructured overlay to not interfere with welcome banner */}
      <main id="main-content" className="main-lcp-critical relative overflow-hidden">
        <div className="relative z-10">
          
          {/* Hero Content Section */}
          <section className="py-4 md:py-0 relative" aria-labelledby="hero-heading">
            {!isMobile && <div className="absolute inset-0 bg-black/30" />}
            <div className="sr-only">
              <h2 id="hero-heading">Cadouri Muzicale Personalizate - MusicGift.ro</h2>
              <p>Transformă emoțiile în muzică cu serviciile noastre profesionale de compoziție muzicală personalizată.</p>
            </div>
            <div className="relative z-10">
              <Suspense fallback={<LoadingFallback className="h-64" />}>
                <HeroContent />
              </Suspense>
            </div>
          </section>

          {/* Process Flow Section */}
          <section className="py-2 md:py-4 relative" aria-labelledby="process-heading">
            {!isMobile && <div className="absolute inset-0 bg-black/20" />}
            <h2 id="process-heading" className="sr-only">Cum Funcționează Procesul de Creare a Melodiilor Personalizate</h2>
            <div className="relative z-10">
              <Suspense fallback={<LoadingFallback className="h-64" />}>
                <AnimatedStepFlow />
              </Suspense>
            </div>
          </section>

          {/* Optimized Testimonials Section */}
          <section className="py-2 md:py-4 relative" aria-labelledby="testimonials-heading">
            {!isMobile && <div className="absolute inset-0 bg-black/20" />}
            <h2 id="testimonials-heading" className="sr-only">Mărturii ale Clienților Noștri Mulțumiți</h2>
            <div className="relative z-10">
              <Suspense fallback={<LoadingFallback className="h-48" />}>
                <OptimizedTestimonialSlider />
              </Suspense>
            </div>
          </section>

          {/* Simplified Statistics Section */}
          <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] my-2 md:my-4 overflow-hidden" aria-labelledby="stats-heading">
            <h2 id="stats-heading" className="sr-only">Statistici și Realizări MusicGift.ro</h2>
            <div className="bg-gradient-to-r from-white/5 via-white/20 to-white/5 backdrop-blur-sm border-y border-white/10 py-[2px] relative z-10">
              <div className="flex space-x-8 md:space-x-16 whitespace-nowrap animate-scroll">
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
          </section>
        </div>
      </main>

      {/* Optimized Voice Search Section */}
      <Suspense fallback={<LoadingFallback className="h-64" />}>
        <OptimizedVoiceSearchSection />
      </Suspense>

      {/* Collaboration Section */}
      <Suspense fallback={<LoadingFallback className="h-48" />}>
        <CollaborationSection />
      </Suspense>

      {/* Impact Cards Section - moved here before CTA */}
      <section aria-labelledby="impact-heading" className="py-2 md:py-0">
        <h2 id="impact-heading" className="sr-only">Impactul Serviciilor Noastre Muzicale</h2>
        <Suspense fallback={<LoadingFallback className="h-48" />}>
          <ImpactCards />
        </Suspense>
      </section>

      {/* Call-to-Action Section */}
      <section className="main-lcp-critical px-2 md:px-4 text-white text-center relative overflow-hidden py-4 md:py-8" aria-labelledby="cta-heading">
        {!isMobile && <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-black/50" />}
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 id="cta-heading" className="text-base md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3">
            {t('heroCtaTitle')}
          </h2>
          <p className="text-sm md:text-xl mb-4 md:mb-6 opacity-90">
            {t('heroCtaSubtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <Link to="/order" aria-label="Comandă acum o melodie personalizată">
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white border-0 min-w-[140px] md:min-w-[180px] text-sm md:text-base">
                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                {t('orderNow')}
              </Button>
            </Link>
            
            <Link to="/gift" aria-label="Cumpără un card cadou muzical">
              <Button size="sm" className="border-red-200 min-w-[140px] md:min-w-[180px] bg-fuchsia-600 hover:bg-fuchsia-500 text-sm md:text-base">
                <Gift className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                {t('buyGiftCard', 'Buy a Gift Card')}
              </Button>
            </Link>
            
            <Link to="/packages" aria-label="Vezi toate pachetele muzicale disponibile">
              <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm min-w-[140px] md:min-w-[180px] text-sm md:text-base">
                <Music className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                {t('seePackages')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Suspense fallback={<LoadingFallback className="h-32" />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
