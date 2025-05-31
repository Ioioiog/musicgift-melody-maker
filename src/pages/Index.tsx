import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePackages } from "@/hooks/usePackageData";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslations";
import { VolumeX, Volume2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const Index = () => {
  const {
    data: packages = [],
    isLoading,
    error
  } = usePackages();
  const {
    t
  } = useLanguage(); // Frontend translations for static UI
  const {
    t: tDb
  } = useTranslation(); // Database translations for package content

  // Audio player state
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

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
  
  return <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section with Video Background */}
      <section className="relative h-[70vh] flex items-center overflow-hidden">
        {/* Video Background */}
        <video 
          className="absolute top-0 left-0 w-full h-full object-cover z-0" 
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src="/lovable-uploads/Jingle Musicgift master.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay for better text readability */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10"></div>
        
        {/* Floating musical notes */}
        <div className="absolute top-10 right-10 text-4xl animate-bounce delay-75 z-20">🎵</div>
        <div className="absolute bottom-20 left-0 text-3xl animate-bounce delay-150 z-20">🎶</div>
        <div className="absolute top-32 left-10 text-2xl animate-bounce delay-300 z-20">♪</div>
        
        {/* Mute/Unmute Button - Bottom Right */}
        <div className="absolute bottom-8 right-8 z-30">
          <Button
            onClick={toggleMute}
            size="icon"
            className="rounded-full bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
          <audio
            ref={audioRef}
            loop
            muted={isMuted}
          >
            <source src="/lovable-uploads/Jingle Musicgift master.mp4" type="audio/mp4" />
          </audio>
        </div>
        
        {/* Hero Content - Left Aligned */}
        <div className="container mx-auto px-4 relative z-30 text-white">
          <div className="max-w-4xl space-y-6 animate-fade-in">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              {t('heroTitle') || 'Give the Gift of Music'}
            </h1>
            <p className="text-lg lg:text-xl leading-relaxed text-white/90 max-w-2xl">
              {t('heroSubtitle') || 'A personalized song, created just for your special someone. The most unique gift they\'ll ever receive.'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/packages">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-full text-lg backdrop-blur-sm">
                  {t('seePackages') || 'See Packages'}
                </Button>
              </Link>
              <Link to="/testimonials">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 px-8 py-4 rounded-full text-lg backdrop-blur-sm">
                  {t('listenToSamples') || 'Listen to Samples'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll down indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('chooseYourPackage') || 'Choose Your Package'}</h2>
            <p className="text-xl text-gray-600">{t('selectPerfectPackage') || 'Select the perfect music package that fits your needs and budget'}</p>
          </div>
          
          {/* Loading State */}
          {isLoading && <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">{t('loadingPackages') || 'Loading packages...'}</p>
              </div>
            </div>}

          {/* Error State */}
          {error && <div className="text-center py-12">
              <p className="text-red-600 mb-4">{t('failedToLoadPackages') || 'Failed to load packages. Please try again later.'}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                {t('reload') || 'Reload'}
              </Button>
            </div>}

          {/* Packages Grid */}
          {!isLoading && !error && previewPackages.length > 0 && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {previewPackages.map(pkg => <Card key={pkg.id} className={`relative hover:shadow-xl transition-all duration-300 ${pkg.tags?.some(tag => tag.tag_type === 'popular') ? 'border-2 border-purple-200 scale-105' : ''}`}>
                  {pkg.tags?.some(tag => tag.tag_type === 'popular') && <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                        {t('mostPopular')}
                      </span>
                    </div>}
                  
                  <CardContent className="p-8">
                    {/* Icon and Title */}
                    <div className="text-center mb-6">
                      <div className="text-4xl mb-3">
                        {pkg.value === 'personal' ? '🎁' : pkg.value === 'business' ? '💼' : pkg.value === 'premium' ? '🌟' : pkg.value === 'artist' ? '🎤' : pkg.value === 'instrumental' ? '🎶' : pkg.value === 'remix' ? '🔁' : '🎁'}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{tDb(pkg.label_key)}</h3>
                      {pkg.tagline_key && <p className="text-sm text-purple-600 font-medium mb-3">{tDb(pkg.tagline_key)}</p>}
                    </div>

                    {/* Price */}
                    <div className="text-4xl font-bold text-purple-600 mb-6 text-center">
                      {pkg.price} <span className="text-lg text-gray-500">RON</span>
                    </div>

                    {/* Features */}
                    {pkg.includes && pkg.includes.length > 0 && <ul className="space-y-3 mb-8">
                        {pkg.includes.map((include, featureIndex) => <li key={featureIndex} className="flex items-center text-gray-600">
                            <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-green-600 text-xs">✓</span>
                            </span>
                            {tDb(include.include_key)}
                          </li>)}
                      </ul>}

                    <Link to="/order">
                      <Button className="w-full bg-gradient-purple hover:opacity-90">
                        {t('orderNow')}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>)}
            </div>}

          {/* No Packages State */}
          {!isLoading && !error && previewPackages.length === 0 && <div className="text-center py-12">
              <p className="text-gray-600 mb-4">{t('noPackagesAvailable') || 'No packages available at the moment.'}</p>
              <p className="text-gray-500">{t('checkBackLater') || 'Please check back later.'}</p>
            </div>}
          
          {/* View All Packages Button */}
          {!isLoading && !error && previewPackages.length > 0 && <div className="text-center mt-12">
              <Link to="/packages">
                <Button size="lg" variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                  {t('viewAllPackages') || 'View All Packages'}
                </Button>
              </Link>
            </div>}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-purple text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">{t('readyToCreateSpecial') || 'Ready to Create Something Special?'}</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t('helpCreatePersonalized') || 'Let us help you create a personalized musical gift that will be treasured forever.'}
          </p>
          <Link to="/packages">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold">
              {t('startYourOrder') || 'Start Your Order'}
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>;
};

export default Index;
