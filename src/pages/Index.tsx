
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import VideoHeroOptimized from "@/components/VideoHeroOptimized";
import HeroContent from "@/components/HeroContent";
import ScenarioHero from "@/components/ScenarioHero";
import LazyAnimatedStepFlow from "@/components/LazyAnimatedStepFlow";
import LazyTestimonialSlider from "@/components/LazyTestimonialSlider";
import OptimizedImpactCards from "@/components/OptimizedImpactCards";
import LazyCollaborationSection from "@/components/LazyCollaborationSection";
import SEOHead from "@/components/SEOHead";
import StructuredDataLoader from "@/components/StructuredDataLoader";
import WelcomeBanner from "@/components/WelcomeBanner";
import EnhancedPerformanceMonitor from "@/components/EnhancedPerformanceMonitor";
import CriticalCSS from "@/components/CriticalCSS";
import EnhancedStructuredData from "@/components/EnhancedStructuredData";
import FontOptimizer from "@/components/FontOptimizer";
import { Button } from "@/components/ui/button";
import { useLocalization } from "@/contexts/OptimizedLocalizationContext";
import { Link } from "react-router-dom";
import { Music, ShoppingCart, Gift } from "lucide-react";
import { useEffect } from "react";
import VoiceSearchFAQ from "@/components/VoiceSearchFAQ";
import VoiceSearchContent from "@/components/VoiceSearchContent";
import VoiceSearchStructuredData from "@/components/VoiceSearchStructuredData";
import FAQStructuredData from "@/components/FAQStructuredData";
import BreadcrumbStructuredData from "@/components/BreadcrumbStructuredData";

const Index = () => {
  const { t } = useLocalization();
  
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
      
      <FontOptimizer />
      <EnhancedPerformanceMonitor />
      <CriticalCSS />
      
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50">
        Sari la conținutul principal
      </a>
      
      <Navigation />
      
      <VideoHeroOptimized />
      <WelcomeBanner />

      <main id="main-content" className="relative overflow-hidden" style={{ contain: 'layout style' }}>
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10">
          <section className="py-4 md:py-0" aria-labelledby="hero-heading" style={{ contain: 'layout' }}>
            <div className="sr-only">
              <h2 id="hero-heading">Cadouri Muzicale Personalizate - MusicGift.ro</h2>
              <p>Transformă emoțiile în muzică cu serviciile noastre profesionale de compoziție muzicală personalizată. Creăm melodii unice pentru nunți, botezuri, aniversări și orice moment special din viața ta.</p>
            </div>
            <HeroContent />
          </section>

          <section className="py-2 md:py-4" aria-labelledby="impact-heading" style={{ contain: 'layout' }}>
            <h2 id="impact-heading" className="sr-only">Impactul Serviciilor Noastre Muzicale</h2>
            <OptimizedImpactCards />
          </section>

          <section className="py-2 md:py-4" aria-labelledby="process-heading" style={{ contain: 'layout' }}>
            <h2 id="process-heading" className="sr-only">Cum Funcționează Procesul de Creare a Melodiilor Personalizate</h2>
            <LazyAnimatedStepFlow />
          </section>

          <section aria-labelledby="voice-faq-heading" style={{ contain: 'layout' }}>
            <h2 id="voice-faq-heading" className="sr-only">Întrebări Frecvente pentru Căutări Vocale</h2>
            <VoiceSearchFAQ />
          </section>

          <section aria-labelledby="voice-content-heading" style={{ contain: 'layout' }}>
            <h2 id="voice-content-heading" className="sr-only">Conținut Optimizat pentru Căutări Vocale</h2>
            <VoiceSearchContent />
          </section>

          <section className="py-2 md:py-4" aria-labelledby="testimonials-heading" style={{ contain: 'layout' }}>
            <h2 id="testimonials-heading" className="sr-only">Mărturii ale Clienților Noștri Mulțumiți</h2>
            <LazyTestimonialSlider />
          </section>

          <div className="bg-gradient-to-r from-white/5 via-white/20 to-white/5 backdrop-blur-sm border-y border-white/10 py-[1px]" role="separator" aria-hidden="true" />
        </div>
      </main>

      <section aria-labelledby="collaboration-heading" style={{ contain: 'layout' }}>
        <h2 id="collaboration-heading" className="sr-only">Colaborarea Noastră cu Artiștii</h2>
        <LazyCollaborationSection />
      </section>

      <section 
        className="px-2 md:px-4 text-white text-center relative overflow-hidden py-4 md:py-8" 
        aria-labelledby="cta-heading"
        style={{ 
          contain: 'layout style',
          minHeight: '300px'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-black/50" />
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 id="cta-heading" className="text-base md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3">
            {t('heroCtaTitle')}
          </h2>
          <p className="text-sm md:text-xl mb-4 md:mb-6 opacity-90">
            {t('heroCtaSubtitle')}
          </p>
          
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
      
      <StructuredDataLoader />
      <EnhancedStructuredData />
      <FAQStructuredData />
      <BreadcrumbStructuredData />
      <VoiceSearchStructuredData />
    </div>
  );
};

export default Index;
