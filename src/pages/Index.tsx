import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScenarioHero from "@/components/ScenarioHero";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { usePackages } from "@/hooks/usePackageData";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslations";
import { VolumeX, Volume2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const {
    data: packages = [],
    isLoading,
    error
  } = usePackages();
  const {
    t,
    language
  } = useLanguage(); // Frontend translations for static UI
  const {
    t: tDb
  } = useTranslation(); // Database translations for package content
  const isMobile = useIsMobile();

  // Audio player state
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Get video source based on language
  const getVideoSource = () => {
    return language === 'ro' ? "/lovable-uploads/Jingle Musicgift master.mp4" : "/lovable-uploads/MusicGiftvideoENG.mp4";
  };

  // Auto-play audio when component mounts
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.log("Auto-play failed:", error);
      });
    }
  }, []);
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Limit to first 3 packages for homepage preview
  const previewPackages = packages.slice(0, 3);
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section with Video Background - Mobile Optimized - No margin/gap */}
      <section className="relative h-[60vh] sm:h-[65vh] md:h-[70vh] flex flex-col justify-center overflow-hidden bg-black">
        {/* Video Background */}
        <video className="absolute top-0 left-0 w-full h-full object-cover z-0" autoPlay muted loop playsInline key={language}>
          <source src={getVideoSource()} type="video/mp4" />
        </video>
        
        {/* Hero Content - Redesigned Layout */}
        <div className="container mx-auto px-4 sm:px-6 relative z-30 text-white">
          <motion.div 
            className="max-w-5xl mx-auto text-center space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Main Title with Enhanced Typography */}
            <div className="space-y-4">
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {t('heroTitle')}
              </motion.h1>
              
              <motion.div 
                className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"
                initial={{ width: 0 }}
                animate={{ width: 96 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
            </div>

            {/* Subtitle with Better Spacing */}
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl leading-relaxed text-white/90 max-w-3xl mx-auto font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {t('heroSubtitle')}
            </motion.p>
            
            {/* Enhanced Button Layout */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Link to="/packages" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 font-semibold px-8 sm:px-12 py-4 sm:py-6 rounded-full transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-purple-500/25 w-full sm:w-auto text-base sm:text-lg"
                >
                  <span className="relative z-10">{t('seePackages')}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </Link>
              
              <Link to="/testimonials" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="group relative overflow-hidden bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 font-semibold px-8 sm:px-12 py-4 sm:py-6 rounded-full transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-white/10 w-full sm:w-auto text-base sm:text-lg"
                >
                  <span className="relative z-10">{t('listenToSamples')}</span>
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </Link>
            </motion.div>

            {/* Feature Highlights */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 sm:gap-6 pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              {[
                { icon: "🎵", text: t('personalizedSongs') || "Personalized Songs" },
                { icon: "⚡", text: t('fastDelivery') || "Fast Delivery" },
                { icon: "🎁", text: t('perfectGift') || "Perfect Gift" }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm sm:text-base"
                >
                  <span className="text-lg">{feature.icon}</span>
                  <span className="font-medium">{feature.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
        
        {/* Floating musical notes - responsive positioning */}
        <div className="absolute top-6 sm:top-10 right-6 sm:right-10 text-2xl sm:text-3xl md:text-4xl animate-bounce delay-75 z-20">🎵</div>
        <div className="absolute bottom-12 sm:bottom-20 left-0 text-xl sm:text-2xl md:text-3xl animate-bounce delay-150 z-20">🎶</div>
        <div className="absolute top-20 sm:top-32 left-6 sm:left-10 text-lg sm:text-xl md:text-2xl animate-bounce delay-300 z-20">♪</div>
        
        {/* Mute/Unmute Button - Mobile responsive positioning */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 z-30">
          <Button onClick={toggleMute} size="icon" className="rounded-full bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md w-10 h-10 sm:w-12 sm:h-12">
            {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
          </Button>
          <audio ref={audioRef} loop muted={isMuted} key={language}>
            <source src={getVideoSource()} type="audio/mp4" />
          </audio>
        </div>
        
        {/* Scroll down indicator - hidden on very small screens */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-30 hidden sm:block">
          <div className="animate-bounce">
            
          </div>
        </div>
      </section>

      {/* ScenarioHero Banner */}
      <ScenarioHero />

      {/* Combined Packages and CTA Section */}
      <section className="relative overflow-hidden py-8 sm:py-12 md:py-16" style={{
      backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div className="text-center mb-8 sm:mb-12" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">{t('chooseYourPackage')}</h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 px-4">{t('selectPerfectPackage')}</p>
          </motion.div>
          
          {/* Loading State */}
          {isLoading && <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-white/20 border-t-white/60 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white/80 text-sm sm:text-base">{t('loadingPackages')}</p>
              </div>
            </div>}

          {/* Error State */}
          {error && <div className="text-center py-8 sm:py-12 px-4">
              <p className="text-red-300 mb-4 text-sm sm:text-base">{t('failedToLoadPackages') || 'Failed to load packages. Please try again later.'}</p>
              <Button onClick={() => window.location.reload()} className="bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 backdrop-blur-md text-sm sm:text-base">
                {t('reload') || 'Reload'}
              </Button>
            </div>}

          {/* Packages Carousel - ScenarioHero Style */}
          {!isLoading && !error && previewPackages.length > 0 && <motion.div className="max-w-6xl mx-auto" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }}>
              <Carousel opts={{
            align: "start",
            loop: true
          }} className="w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {previewPackages.map((pkg, index) => <CarouselItem key={pkg.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                      <motion.div initial={{
                  opacity: 0,
                  y: 20
                }} animate={{
                  opacity: 1,
                  y: 0
                }} transition={{
                  duration: 0.6,
                  delay: 0.1 * index
                }}>
                        <Card className={`relative backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-xl ${pkg.tags?.some(tag => tag.tag_type === 'popular') || pkg.tag === 'popular' ? 'ring-2 ring-purple-300/50 scale-105' : ''}`}>
                          {(pkg.tags?.some(tag => tag.tag_type === 'popular') || pkg.tag === 'popular') && <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 z-20">
                              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 sm:px-6 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                                {t('mostPopular')}
                              </span>
                            </div>}
                          
                          <CardContent className="p-4 sm:p-6 md:p-8 text-white">
                            {/* Icon and Title */}
                            <div className="text-center mb-4 sm:mb-6">
                              <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">
                                {pkg.value === 'personal' ? '🎁' : pkg.value === 'business' ? '💼' : pkg.value === 'premium' ? '🌟' : pkg.value === 'artist' ? '🎤' : pkg.value === 'instrumental' ? '🎶' : pkg.value === 'remix' ? '🔁' : '🎁'}
                              </div>
                              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">{tDb(pkg.label_key)}</h3>
                              {pkg.tagline_key && <p className="text-xs sm:text-sm text-purple-200 font-medium mb-2 sm:mb-3">{tDb(pkg.tagline_key)}</p>}
                            </div>

                            {/* Price */}
                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 text-center">
                              {pkg.price} <span className="text-sm sm:text-base md:text-lg text-white/70">RON</span>
                            </div>

                            {/* Features */}
                            {pkg.includes && pkg.includes.length > 0 && <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                                {pkg.includes.map((include, featureIndex) => <li key={featureIndex} className="flex items-center text-white/90 text-sm sm:text-base">
                                    <span className="w-4 h-4 sm:w-5 sm:h-5 bg-green-400/20 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0 border border-green-400/30">
                                      <span className="text-green-300 text-xs">✓</span>
                                    </span>
                                    <span className="leading-tight">{tDb(include.include_key)}</span>
                                  </li>)}
                              </ul>}

                            <Link to="/order">
                              <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 backdrop-blur-md transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base">
                                {t('orderNow')}
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </CarouselItem>)}
                </CarouselContent>
                {!isMobile && <>
                    <CarouselPrevious className="hidden md:flex -left-12 bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 backdrop-blur-md" />
                    <CarouselNext className="hidden md:flex -right-12 bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 backdrop-blur-md" />
                  </>}
              </Carousel>
            </motion.div>}

          {/* No Packages State */}
          {!isLoading && !error && previewPackages.length === 0 && <div className="text-center py-8 sm:py-12 px-4">
              <p className="text-white/80 mb-4 text-sm sm:text-base">{t('noPackagesAvailable') || 'No packages available at the moment.'}</p>
              <p className="text-white/60 text-sm sm:text-base">{t('checkBackLater') || 'Please check back later.'}</p>
            </div>}
          
          {/* CTA Content - Now integrated into the packages section */}
          {!isLoading && !error && previewPackages.length > 0 && <motion.div className="text-center mt-12 sm:mt-16 space-y-6 sm:space-y-8" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }}>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                  {t('readyToCreateSpecial')}
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto px-4">
                  {t('helpCreatePersonalized')}
                </p>
              </div>
              
              <div className="space-y-4">
                <Link to="/packages">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold text-sm sm:text-base mr-4">
                    {t('startYourOrder')}
                  </Button>
                </Link>
                <Link to="/packages">
                  <Button size="lg" className="bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 backdrop-blur-md transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base">
                    {t('viewAllPackages')}
                  </Button>
                </Link>
              </div>
            </motion.div>}
        </div>

        {/* Bottom border accent */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
