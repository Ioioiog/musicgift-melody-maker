import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScenarioHero from "@/components/ScenarioHero";
import NewsletterForm from "@/components/NewsletterForm";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePackages } from "@/hooks/usePackageData";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslations";
import { VolumeX, Volume2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const Index = () => {
  const {
    data: packages = [],
    isLoading,
    error
  } = usePackages();
  const {
    t,
    language
  } = useLanguage();
  const {
    t: tDb
  } = useTranslation();

  // Video player state
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const allPackages = packages;

  // Get video source based on language
  const getVideoSource = () => {
    return language === 'ro' ? "/lovable-uploads/Jingle Musicgift master.mp4" : "/lovable-uploads/MusicGiftvideoENG.mp4";
  };

  // Auto-play video when component mounts or language changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load(); // Reload the video with new source
      videoRef.current.play().catch(error => {
        console.log("Auto-play failed:", error);
      });
    }
  }, [language]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section with Video Background - Mobile optimized */}
      <section className="relative h-[50vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh] flex items-end overflow-hidden bg-black">
        {/* Video Background */}
        <video 
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover z-0" 
          autoPlay 
          muted={isMuted}
          loop 
          playsInline 
          key={language}
        >
          <source src={getVideoSource()} type="video/mp4" />
        </video>
        
        {/* Hero Content - Mobile responsive positioning */}
        <div className="container mx-auto px-4 sm:px-6 relative z-30 text-white pb-6 sm:pb-8 md:pb-12 lg:pb-16">
          <motion.div className="max-w-xl lg:max-w-2xl text-left space-y-4 sm:space-y-6" initial={{
          opacity: 0,
          x: -30
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.8,
          ease: "easeOut"
        }}>
            {/* Main Title - Mobile responsive typography */}
            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                {t('heroCtaTitle')}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed">
                {t('heroCtaSubtitle')}
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Floating musical notes - Mobile responsive positioning */}
        <div className="absolute top-4 sm:top-6 md:top-10 right-4 sm:right-6 md:right-10 text-xl sm:text-2xl md:text-3xl lg:text-4xl animate-bounce delay-75 z-20">🎵</div>
        <div className="absolute bottom-8 sm:bottom-12 md:bottom-20 right-12 sm:right-20 md:right-32 text-lg sm:text-xl md:text-2xl lg:text-3xl animate-bounce delay-150 z-20">🎶</div>
        <div className="absolute top-12 sm:top-20 md:top-32 left-4 sm:left-6 md:left-10 text-base sm:text-lg md:text-xl lg:text-2xl animate-bounce delay-300 z-20">♪</div>
        
        {/* Mute/Unmute Button - Mobile responsive positioning */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 z-30">
          <Button onClick={toggleMute} size="icon" className="rounded-full bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md w-10 h-10 sm:w-12 sm:h-12 touch-manipulation min-h-[44px]">
            {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
          </Button>
        </div>
      </section>

      {/* ScenarioHero Banner */}
      <ScenarioHero />

      {/* Packages and CTA Section - Mobile optimized */}
      <section className="relative overflow-hidden py-6 sm:py-8 md:py-12 lg:py-16" style={{
      backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* CTA Content - Mobile responsive */}
          <motion.div className="text-center mb-6 sm:mb-8 md:mb-10 space-y-4 sm:space-y-6" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            <div className="space-y-3 sm:space-y-4 px-4 sm:px-8 md:px-16">
              <Link to="/packages">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold text-sm sm:text-base mb-3 sm:mb-0 sm:mr-4 w-full sm:w-auto touch-manipulation min-h-[44px]">
                  {t('startYourOrder')}
                </Button>
              </Link>
              <Link to="/packages">
                <Button size="lg" className="bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 backdrop-blur-md transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base w-full sm:w-auto touch-manipulation min-h-[44px]">
                  {t('viewAllPackages')}
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading && <div className="flex items-center justify-center min-h-[250px] sm:min-h-[300px] md:min-h-[400px]">
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 border-4 border-white/20 border-t-white/60 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white/80 text-sm sm:text-base">{t('loadingPackages')}</p>
              </div>
            </div>}

          {/* Error State */}
          {error && <div className="text-center py-6 sm:py-8 md:py-12 px-4">
              <p className="text-red-300 mb-4 text-sm sm:text-base">{t('failedToLoadPackages') || 'Failed to load packages. Please try again later.'}</p>
              <Button onClick={() => window.location.reload()} className="bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 backdrop-blur-md text-sm sm:text-base touch-manipulation min-h-[44px]">
                {t('reload') || 'Reload'}
              </Button>
            </div>}

          {/* Packages Grid - Mobile responsive */}
          {!isLoading && !error && allPackages.length > 0 && <motion.div className="max-w-6xl mx-auto" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {allPackages.map((pkg, index) => <motion.div key={pkg.id} className="flex" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.1 * index
            }}>
                    <Card className={`relative backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-xl flex flex-col w-full h-full ${pkg.tags?.some(tag => tag.tag_type === 'popular') || pkg.tag === 'popular' ? 'ring-2 ring-purple-300/50 scale-105' : ''}`}>
                      {(pkg.tags?.some(tag => tag.tag_type === 'popular') || pkg.tag === 'popular') && <div className="absolute -top-2 sm:-top-3 md:-top-4 left-1/2 transform -translate-x-1/2 z-20">
                          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 sm:px-3 md:px-6 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                            {t('mostPopular')}
                          </span>
                        </div>}
                      
                      <CardContent className="p-3 sm:p-4 md:p-6 lg:p-8 text-white flex flex-col h-full">
                        {/* Icon and Title - Mobile responsive */}
                        <div className="text-center mb-3 sm:mb-4 md:mb-6">
                          <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-2 sm:mb-3">
                            {pkg.value === 'personal' ? '🎁' : pkg.value === 'business' ? '💼' : pkg.value === 'premium' ? '🌟' : pkg.value === 'artist' ? '🎤' : pkg.value === 'instrumental' ? '🎶' : pkg.value === 'remix' ? '🔁' : '🎁'}
                          </div>
                          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 leading-tight">{tDb(pkg.label_key)}</h3>
                          {pkg.tagline_key && <p className="text-xs sm:text-sm text-purple-200 font-medium mb-2 sm:mb-3">{tDb(pkg.tagline_key)}</p>}
                        </div>

                        {/* Price - Mobile responsive */}
                        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 md:mb-6 text-center">
                          {pkg.price} <span className="text-xs sm:text-sm md:text-base lg:text-lg text-white/70">RON</span>
                        </div>

                        {/* Features - Mobile responsive */}
                        {pkg.includes && pkg.includes.length > 0 && <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 md:mb-8 flex-grow">
                            {pkg.includes.map((include, featureIndex) => <li key={featureIndex} className="flex items-start text-white/90 text-xs sm:text-sm md:text-base">
                                <span className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-green-400/20 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0 border border-green-400/30 mt-0.5">
                                  <span className="text-green-300 text-xs">✓</span>
                                </span>
                                <span className="leading-tight">{tDb(include.include_key)}</span>
                              </li>)}
                          </ul>}

                        <Link to="/order" className="mt-auto">
                          <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 backdrop-blur-md transition-all duration-300 hover:scale-105 shadow-lg text-xs sm:text-sm md:text-base touch-manipulation min-h-[44px]">
                            {t('orderNow')}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>)}
              </div>
            </motion.div>}

          {/* No Packages State */}
          {!isLoading && !error && allPackages.length === 0 && <div className="text-center py-6 sm:py-8 md:py-12 px-4">
              <p className="text-white/80 mb-4 text-sm sm:text-base">{t('noPackagesAvailable') || 'No packages available at the moment.'}</p>
              <p className="text-white/60 text-sm sm:text-base">{t('checkBackLater') || 'Please check back later.'}</p>
            </div>}
        </div>

        {/* Bottom border accent */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
      </section>

      {/* Newsletter Section */}
      <section 
        className="py-12 sm:py-16 md:py-20 text-white relative overflow-hidden"
        style={{
          backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 sm:mb-10"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              {t('stayUpdated') || 'Stay Updated'}
            </h2>
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed">
              {t('subscribeNewsletter') || 'Subscribe to our newsletter for the latest updates and exclusive offers'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md mx-auto"
          >
            <NewsletterForm />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>;
};

export default Index;
