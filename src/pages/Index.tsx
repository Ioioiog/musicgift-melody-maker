
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import VideoHero from "@/components/VideoHero";
import HeroContent from "@/components/HeroContent";
import LazyComponent, { createLazyComponent } from "@/components/LazyComponent";
import SEOHead from "@/components/SEOHead";
import StructuredDataLoader from "@/components/StructuredDataLoader";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Music, ShoppingCart, Gift, Mic, Star, Rocket, PartyPopper, Disc, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

// Lazy load non-critical components
const LazyAnimatedStepFlow = createLazyComponent(() => import("@/components/AnimatedStepFlow"));
const LazyTestimonialSlider = createLazyComponent(() => import("@/components/LazyTestimonialSlider"));
const LazyImpactCards = createLazyComponent(() => import("@/components/ImpactCards"));
const LazyCollaborationSection = createLazyComponent(() => import("@/components/CollaborationSection"));

const Index = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [showBelowFold, setShowBelowFold] = useState(false);
  
  // Performance monitoring
  useEffect(() => {
    performance.mark('index-page-start');
    
    // Show below-fold content after critical render
    const timer = setTimeout(() => {
      setShowBelowFold(true);
    }, isMobile ? 300 : 200);
    
    return () => {
      clearTimeout(timer);
      performance.mark('index-page-end');
      performance.measure('index-page-load', 'index-page-start', 'index-page-end');
    };
  }, [isMobile]);

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="MusicGift.ro - Cadouri Muzicale Personalizate"
        description="Creează melodii personalizate și cadouri muzicale unice. Servicii profesionale de compoziție. Peste 2000 melodii create cu dragoste."
      />
      
      {/* Skip Navigation for Accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50">
        Sari la conținutul principal
      </a>
      
      <Navigation />
      
      {/* Mobile-Optimized Video Hero Section */}
      <div className="video-hero-mobile">
        <VideoHero />
      </div>

      {/* Mobile-Optimized Main Content for LCP */}
      <main 
        id="main-content" 
        className="main-mobile-critical"
      >
        <div className="relative z-10">
          
          {/* Hero Content Section - Mobile Critical */}
          <section className="py-2" aria-labelledby="hero-heading">
            <div className="sr-only">
              <h2 id="hero-heading">Cadouri Muzicale Personalizate - MusicGift.ro</h2>
              <p>Transformă emoțiile în muzică cu serviciile noastre profesionale de compoziție muzicală personalizată. Creăm melodii unice pentru nunți, botezuri, aniversări și orice moment special din viața ta.</p>
            </div>
            <HeroContent />
          </section>

          {/* Below-fold content - Lazy loaded for better performance */}
          {showBelowFold && (
            <>
              {/* Impact Cards Section */}
              <LazyComponent>
                <section className="py-2" aria-labelledby="impact-heading">
                  <h2 id="impact-heading" className="sr-only">Impactul Serviciilor Noastre Muzicale</h2>
                  <LazyImpactCards />
                </section>
              </LazyComponent>

              {/* Process Flow Section */}
              <LazyComponent>
                <section className="py-2" aria-labelledby="process-heading">
                  <h2 id="process-heading" className="sr-only">Cum Funcționează Procesul de Creare a Melodiilor Personalizate</h2>
                  <LazyAnimatedStepFlow />
                </section>
              </LazyComponent>

              {/* Testimonials Section */}
              <LazyComponent>
                <section className="py-2" aria-labelledby="testimonials-heading">
                  <h2 id="testimonials-heading" className="sr-only">Mărturii ale Clienților Noștri Mulțumiți</h2>
                  <LazyTestimonialSlider />
                </section>
              </LazyComponent>

              {/* Mobile-Optimized Statistics Section with Proper Scrolling */}
              <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] my-2 infinite-scroll-container" aria-labelledby="stats-heading">
                <h2 id="stats-heading" className="sr-only">Statistici și Realizări MusicGift.ro</h2>
                <div className="bg-gradient-to-r from-black/20 via-black/40 to-black/20 border-y border-white/10 py-1 relative z-10">
                  
                  <div className={`scroll-content ${isMobile ? 'mobile-scroll-optimized' : 'scroll-ultra-optimized'}`} role="marquee" aria-label="Company statistics and achievements">
                    
                    {/* First set of statistics */}
                    <div className="flex items-center space-x-2 text-sm font-bold">
                      <Music className="w-6 h-6 text-blue-300" aria-hidden="true" />
                      <span className="text-lg text-white">2.000+</span>
                      <span className="opacity-90 text-sm text-white">{t('personalizedSongs')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm font-bold">
                      <Mic className="w-6 h-6 text-purple-300" aria-hidden="true" />
                      <span className="text-lg text-white">20+</span>
                      <span className="opacity-90 text-sm text-white">{t('yearsMusicalPassion')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm font-bold">
                      <Star className="w-6 h-6 text-yellow-400" aria-hidden="true" />
                      <span className="text-lg text-white">98%</span>
                      <span className="opacity-90 text-sm text-white">{t('happyClients')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm font-bold">
                      <Rocket className="w-6 h-6 text-orange-400" aria-hidden="true" />
                      <span className="text-lg text-white">50+</span>
                      <span className="opacity-90 text-sm text-white">{t('launchedArtists')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm font-bold">
                      <PartyPopper className="w-6 h-6 text-red-200" aria-hidden="true" />
                      <span className="text-lg text-white">400+</span>
                      <span className="opacity-90 text-sm text-white">{t('memorableEvents')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm font-bold">
                      <Disc className="w-6 h-6 text-indigo-300" aria-hidden="true" />
                      <span className="text-lg text-white">100+</span>
                      <span className="opacity-90 text-sm text-white">{t('releasedAlbums')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm font-bold">
                      <Trophy className="w-6 h-6 text-orange-300" aria-hidden="true" />
                      <span className="text-lg text-white">1 Milion+</span>
                      <span className="opacity-90 text-sm text-white">{t('copiesSold')}</span>
                    </div>
                    
                    {/* Duplicate set for seamless infinite scrolling */}
                    <div className="flex items-center space-x-2 text-sm font-bold">
                      <Music className="w-6 h-6 text-blue-300" aria-hidden="true" />
                      <span className="text-lg text-white">2.000+</span>
                      <span className="opacity-90 text-sm text-white">{t('personalizedSongs')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm font-bold">
                      <Mic className="w-6 h-6 text-purple-300" aria-hidden="true" />
                      <span className="text-lg text-white">20+</span>
                      <span className="opacity-90 text-sm text-white">{t('yearsMusicalPassion')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm font-bold">
                      <Star className="w-6 h-6 text-yellow-400" aria-hidden="true" />
                      <span className="text-lg text-white">98%</span>
                      <span className="opacity-90 text-sm text-white">{t('happyClients')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm font-bold">
                      <Rocket className="w-6 h-6 text-orange-400" aria-hidden="true" />
                      <span className="text-lg text-white">50+</span>
                      <span className="opacity-90 text-sm text-white">{t('launchedArtists')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm font-bold">
                      <PartyPopper className="w-6 h-6 text-red-200" aria-hidden="true" />
                      <span className="text-lg text-white">400+</span>
                      <span className="opacity-90 text-sm text-white">{t('memorableEvents')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm font-bold">
                      <Disc className="w-6 h-6 text-indigo-300" aria-hidden="true" />
                      <span className="text-lg text-white">100+</span>
                      <span className="opacity-90 text-sm text-white">{t('releasedAlbums')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm font-bold">
                      <Trophy className="w-6 h-6 text-orange-300" aria-hidden="true" />
                      <span className="text-lg text-white">1 Milion+</span>
                      <span className="opacity-90 text-sm text-white">{t('copiesSold')}</span>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      {/* Below-fold sections - Lazy loaded */}
      {showBelowFold && (
        <>
          {/* Collaboration Section */}
          <LazyComponent>
            <section aria-labelledby="collaboration-heading">
              <h2 id="collaboration-heading" className="sr-only">Colaborarea Noastră cu Artiștii</h2>
              <LazyCollaborationSection />
            </section>
          </LazyComponent>

          {/* Call-to-Action Section */}
          <section 
            className="px-2 text-white text-center relative overflow-hidden py-4" 
            aria-labelledby="cta-heading"
            style={{
              background: isMobile ? '#1a1a1a' : 'url(/uploads/background.webp) center/cover no-repeat fixed'
            }}
          >
            
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-black/50" aria-hidden="true" />
            <div className="max-w-4xl mx-auto relative z-10">
              <h2 id="cta-heading" className="text-lg font-bold mb-2">
                {t('heroCtaTitle')}
              </h2>
              <p className="text-sm mb-4 opacity-90">
                {t('heroCtaSubtitle')}
              </p>
              
              {/* Mobile-Optimized Call-to-Action Buttons */}
              <div className="flex flex-col gap-2 justify-center items-center">
                <Link to="/order" aria-label="Comandă acum o melodie personalizată">
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white border-0 min-w-[160px] text-sm">
                    <ShoppingCart className="w-4 h-4 mr-2" aria-hidden="true" />
                    {t('orderNow')}
                  </Button>
                </Link>
                
                <Link to="/gift" aria-label="Cumpără un card cadou muzical">
                  <Button size="sm" className="border-red-200 min-w-[160px] bg-fuchsia-600 hover:bg-fuchsia-500 text-sm">
                    <Gift className="w-4 h-4 mr-2" aria-hidden="true" />
                    {t('buyGiftCard', 'Buy a Gift Card')}
                  </Button>
                </Link>
                
                <Link to="/packages" aria-label="Vezi toate pachetele muzicale disponibile">
                  <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm min-w-[160px] text-sm">
                    <Music className="w-4 h-4 mr-2" aria-hidden="true" />
                    {t('seePackages')}
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <Footer />
        </>
      )}
      
      {/* Load structured data at the end for better performance */}
      {showBelowFold && <StructuredDataLoader />}
    </div>
  );
};

export default Index;
