
import { lazy, Suspense, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Music, ShoppingCart, Gift, Mic, Star, Rocket, PartyPopper, Disc, Trophy } from "lucide-react";
import EnhancedVoiceSearchStructuredData from "@/components/voice-search/EnhancedVoiceSearchStructuredData";

// Lazy load non-critical components
const Navigation = lazy(() => import("@/components/Navigation"));
const Footer = lazy(() => import("@/components/Footer"));
const VideoHero = lazy(() => import("@/components/VideoHero"));
const AnimatedStepFlow = lazy(() => import("@/components/AnimatedStepFlow"));
const OptimizedTestimonialSlider = lazy(() => import("@/components/OptimizedTestimonialSlider"));
const ImpactCards = lazy(() => import("@/components/ImpactCards"));
const CollaborationSection = lazy(() => import("@/components/CollaborationSection"));
const SEOHead = lazy(() => import("@/components/SEOHead"));
const WelcomeBanner = lazy(() => import("@/components/WelcomeBanner"));
const HeroCallToAction = lazy(() => import("@/components/HeroCallToAction"));
const EnhancedVoiceSearchSection = lazy(() => import("@/components/voice-search/EnhancedVoiceSearchSection"));

// Enhanced Loading fallback component with proper dimensions
const LoadingFallback = ({
  className = "",
  height = "h-32",
  aspectRatio
}: {
  className?: string;
  height?: string;
  aspectRatio?: string;
}) => (
  <div 
    className={`loading-skeleton bg-white/10 rounded-lg ${height} ${className}`} 
    style={{
      contain: 'layout style paint',
      aspectRatio: aspectRatio || 'auto',
      contentVisibility: 'auto'
    }} 
  />
);

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
    <div className="min-h-screen" style={{ contain: 'layout style' }}>
      {/* Enhanced Voice Search Structured Data */}
      <EnhancedVoiceSearchStructuredData />
      
      <Suspense fallback={<LoadingFallback className="h-4" />}>
        <SEOHead 
          title="MusicGift.ro - Cadouri Muzicale Personalizate" 
          description="Creează melodii personalizate și cadouri muzicale unice. Servicii profesionale de compoziție. Peste 2000 melodii create cu dragoste." 
        />
      </Suspense>
      
      {/* Skip Navigation for Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50"
      >
        Sari la conținutul principal
      </a>
      
      <Suspense fallback={
        <div 
          className="nav-critical bg-black/90 backdrop-blur-sm fixed top-0 left-0 right-0 z-50" 
          style={{ height: '4rem' }} 
        />
      }>
        <Navigation />
      </Suspense>
      
      {/* Video Hero Section - Enhanced with better mobile handling */}
      <Suspense fallback={
        <div 
          className="video-hero-critical w-full aspect-video loading-skeleton" 
          style={{
            backgroundImage: 'url(/uploads/video_placeholder.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} 
        />
      }>
        <VideoHero />
      </Suspense>

      {/* Main Content - Improved layout and spacing */}
      <main id="main-content" className="main-lcp-critical relative" style={{ contain: 'layout style', zIndex: 2 }}>
        {/* Welcome Banner - No reserved space to prevent layout jumps */}
        <Suspense fallback={null}>
          <WelcomeBanner />
        </Suspense>

        {/* Hero Call-to-Action Section - Enhanced component */}
        <Suspense fallback={<LoadingFallback height="h-64" />}>
          <HeroCallToAction />
        </Suspense>

        <div className="overlay-container" />

        <div className="relative z-10 space-y-8 md:space-y-12">
          {/* Impact Cards Section */}
          <section className="section-container" aria-labelledby="impact-heading">
            <h2 id="impact-heading" className="sr-only">Impactul Serviciilor Noastre Muzicale</h2>
            <Suspense fallback={<LoadingFallback height="h-48" />}>
              <ImpactCards />
            </Suspense>
          </section>

          {/* Process Flow Section */}
          <section className="section-container" aria-labelledby="process-heading">
            <h2 id="process-heading" className="sr-only">Cum Funcționează Procesul de Creare a Melodiilor Personalizate</h2>
            <Suspense fallback={<LoadingFallback height="h-64" />}>
              <AnimatedStepFlow />
            </Suspense>
          </section>

          {/* Optimized Testimonials Section */}
          <section className="section-container" aria-labelledby="testimonials-heading">
            <h2 id="testimonials-heading" className="sr-only">Mărturii ale Clienților Noștri Mulțumiți</h2>
            <Suspense fallback={<LoadingFallback height="h-48" />}>
              <OptimizedTestimonialSlider />
            </Suspense>
          </section>

          {/* Enhanced Statistics Section */}
          <section 
            className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden stats-section" 
            aria-labelledby="stats-heading"
            style={{ minHeight: '100px', contain: 'layout style', contentVisibility: 'auto' }}
          >
            <h2 id="stats-heading" className="sr-only">Statistici și Realizări MusicGift.ro</h2>
            <div className="bg-gradient-to-r from-white/5 via-white/25 to-white/5 backdrop-blur-md border-y border-white/20 py-6 relative z-10">
              <div className="flex space-x-12 md:space-x-20 whitespace-nowrap animate-scroll transform-gpu">
                <div className="flex items-center space-x-3 md:space-x-4 text-lg md:text-2xl font-bold">
                  <Music className="w-8 h-8 md:w-12 md:h-12 text-blue-300" />
                  <span className="text-2xl md:text-4xl text-white">2.000+</span>
                  <span className="opacity-90 text-base md:text-xl text-white">{t('personalizedSongs')}</span>
                </div>
                <div className="flex items-center space-x-3 md:space-x-4 text-lg md:text-2xl font-bold">
                  <Mic className="w-8 h-8 md:w-12 md:h-12 text-purple-300" />
                  <span className="text-2xl md:text-4xl text-white">20+</span>
                  <span className="opacity-90 text-base md:text-xl text-white">{t('yearsMusicalPassion')}</span>
                </div>
                <div className="flex items-center space-x-3 md:space-x-4 text-lg md:text-2xl font-bold">
                  <Star className="w-8 h-8 md:w-12 md:h-12 text-yellow-400" />
                  <span className="text-2xl md:text-4xl text-white">98%</span>
                  <span className="opacity-90 text-base md:text-xl text-white">{t('happyClients')}</span>
                </div>
                <div className="flex items-center space-x-3 md:space-x-4 text-lg md:text-2xl font-bold">
                  <Rocket className="w-8 h-8 md:w-12 md:h-12 text-orange-400" />
                  <span className="text-2xl md:text-4xl text-white">50+</span>
                  <span className="opacity-90 text-base md:text-xl text-white">{t('launchedArtists')}</span>
                </div>
                <div className="flex items-center space-x-3 md:space-x-4 text-lg md:text-2xl font-bold">
                  <PartyPopper className="w-8 h-8 md:w-12 md:h-12 text-red-200" />
                  <span className="text-2xl md:text-4xl text-white">400+</span>
                  <span className="opacity-90 text-base md:text-xl text-white">{t('memorableEvents')}</span>
                </div>
                <div className="flex items-center space-x-3 md:space-x-4 text-lg md:text-2xl font-bold">
                  <Disc className="w-8 h-8 md:w-12 md:h-12 text-indigo-300" />
                  <span className="text-2xl md:text-4xl text-white">100+</span>
                  <span className="opacity-90 text-base md:text-xl text-white">{t('releasedAlbums')}</span>
                </div>
                <div className="flex items-center space-x-3 md:space-x-4 text-lg md:text-2xl font-bold">
                  <Trophy className="w-8 h-8 md:w-12 md:h-12 text-orange-300" />
                  <span className="text-2xl md:text-4xl text-white">1 Milion+</span>
                  <span className="opacity-90 text-base md:text-xl text-white">{t('copiesSold')}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Enhanced Voice Search Section */}
      <Suspense fallback={<LoadingFallback height="h-64" />}>
        <EnhancedVoiceSearchSection />
      </Suspense>

      {/* Collaboration Section */}
      <Suspense fallback={<LoadingFallback height="h-48" />}>
        <CollaborationSection />
      </Suspense>

      {/* Simplified Final Call-to-Action */}
      <section className="py-8 md:py-12 px-4 text-white text-center relative overflow-hidden bg-gradient-to-r from-purple-900/50 to-blue-900/50" aria-labelledby="final-cta-heading">
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-purple-900/20 to-black/40" />
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 id="final-cta-heading" className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            {t('heroCtaTitle', 'Ready to Create Something Amazing?')}
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            {t('finalCtaSubtitle', 'Join thousands of happy customers who have turned their emotions into unforgettable melodies.')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/order" aria-label="Start your musical journey now">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white border-0 min-w-[200px] text-lg font-bold transform-gpu hover:scale-105 transition-all duration-300">
                <ShoppingCart className="w-5 h-5 mr-2" />
                {t('orderNow')}
              </Button>
            </Link>
            
            <Link to="/gift" aria-label="Purchase a musical gift card">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black min-w-[200px] text-lg font-bold transform-gpu hover:scale-105 transition-all duration-300">
                <Gift className="w-5 h-5 mr-2" />
                {t('buyGiftCard', 'Buy Gift Card')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Suspense fallback={<LoadingFallback height="h-32" />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
