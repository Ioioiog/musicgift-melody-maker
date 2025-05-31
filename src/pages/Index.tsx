
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePackages } from "@/hooks/usePackageData";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslations";

const Index = () => {
  const { data: packages = [], isLoading, error } = usePackages();
  const { t } = useLanguage(); // Frontend translations for static UI
  const { t: tDb } = useTranslation(); // Database translations for package content

  // Limit to first 3 packages for homepage preview
  const previewPackages = packages.slice(0, 3);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section - New Layout */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          {/* Main Hero Content */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-gray-800 mb-6">
              {t('heroTitle') || 'Give the Gift of Music'}
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto mb-8">
              {t('heroSubtitle') || 'A personalized song, created just for your special someone. The most unique gift they\'ll ever receive.'}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/packages">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-full text-lg">
                  {t('seePackages') || 'See Packages'}
                </Button>
              </Link>
              <Link to="/testimonials">
                <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-4 rounded-full text-lg">
                  {t('listenToSamples') || 'Listen to Samples'}
                </Button>
              </Link>
            </div>
          </div>

          {/* Video Section - Centered and Prominent */}
          <div className="flex justify-center mb-16">
            <div className="relative max-w-4xl w-full">
              {/* Main Video Container */}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-lg animate-float">
                  <video 
                    className="w-full h-full object-cover"
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                  >
                    <source src="/lovable-uploads/Jingle Musicgift master.mp4" type="video/mp4" />
                    {/* Fallback image if video doesn't load */}
                    <img src="/lovable-uploads/65518432-abfe-42fc-acc5-25014d321134.png" alt="Music Gift Box" className="w-full h-full object-cover" />
                  </video>
                </div>
                
                {/* Floating Elements Around Video */}
                <div className="absolute -top-4 -left-4 text-4xl animate-bounce delay-75">🎵</div>
                <div className="absolute -bottom-4 -right-4 text-3xl animate-bounce delay-150">🎶</div>
                <div className="absolute -top-2 right-8 text-2xl animate-bounce delay-300">♪</div>
                <div className="absolute -bottom-2 left-8 text-2xl animate-bounce delay-500">♬</div>
              </div>

              {/* Info Cards - Positioned Around Video */}
              <div className="absolute -top-8 -right-8 hidden lg:block">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl max-w-xs border border-purple-100 animate-fade-in">
                  <h3 className="font-semibold text-gray-900 mb-2">{t('whatIsMusicGiftFor') || 'What is MusicGift for?'}</h3>
                  <p className="text-purple-600 font-medium mb-3">{t('marriageProposals') || 'Cereri în căsătorie'}</p>
                  <Link to="/testimonials">
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full">
                      {t('seeExamples') || 'See examples'}
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="absolute -bottom-8 -left-8 hidden lg:block">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl max-w-xs border border-orange-100 animate-fade-in">
                  <h3 className="font-semibold text-gray-900 mb-2">🎤 Professional Quality</h3>
                  <p className="text-orange-600 font-medium">Studio-recorded songs with professional musicians</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white/30 backdrop-blur-sm rounded-2xl border border-white/40">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="font-bold text-lg mb-2">Personalized</h3>
              <p className="text-gray-600">Custom lyrics written just for your special someone</p>
            </div>
            <div className="text-center p-6 bg-white/30 backdrop-blur-sm rounded-2xl border border-white/40">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="font-bold text-lg mb-2">Professional</h3>
              <p className="text-gray-600">Studio quality recording with talented musicians</p>
            </div>
            <div className="text-center p-6 bg-white/30 backdrop-blur-sm rounded-2xl border border-white/40">
              <div className="text-4xl mb-4">💝</div>
              <h3 className="font-bold text-lg mb-2">Memorable</h3>
              <p className="text-gray-600">A unique gift they'll treasure forever</p>
            </div>
          </div>
        </div>

        {/* Background Decorations */}
        <div className="absolute top-20 left-10 text-6xl text-purple-200 animate-pulse opacity-20">🎼</div>
        <div className="absolute bottom-20 right-10 text-5xl text-orange-200 animate-pulse opacity-20">🎹</div>
        <div className="absolute top-1/2 left-5 text-4xl text-purple-300 animate-bounce opacity-30">🎺</div>
        <div className="absolute top-1/3 right-5 text-4xl text-orange-300 animate-bounce opacity-30">🎸</div>
      </section>

      {/* Packages Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('chooseYourPackage') || 'Choose Your Package'}</h2>
            <p className="text-xl text-gray-600">{t('selectPerfectPackage') || 'Select the perfect music package that fits your needs and budget'}</p>
          </div>
          
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">{t('loadingPackages') || 'Loading packages...'}</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{t('failedToLoadPackages') || 'Failed to load packages. Please try again later.'}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                {t('reload') || 'Reload'}
              </Button>
            </div>
          )}

          {/* Packages Grid */}
          {!isLoading && !error && previewPackages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {previewPackages.map((pkg) => (
                <Card 
                  key={pkg.id} 
                  className={`relative hover:shadow-xl transition-all duration-300 ${
                    pkg.tags?.some(tag => tag.tag_type === 'popular') ? 'border-2 border-purple-200 scale-105' : ''
                  }`}
                >
                  {pkg.tags?.some(tag => tag.tag_type === 'popular') && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                        {t('mostPopular')}
                      </span>
                    </div>
                  )}
                  
                  <CardContent className="p-8">
                    {/* Icon and Title */}
                    <div className="text-center mb-6">
                      <div className="text-4xl mb-3">
                        {pkg.value === 'personal' ? '🎁' : 
                         pkg.value === 'business' ? '💼' : 
                         pkg.value === 'premium' ? '🌟' : 
                         pkg.value === 'artist' ? '🎤' : 
                         pkg.value === 'instrumental' ? '🎶' : 
                         pkg.value === 'remix' ? '🔁' : '🎁'}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{tDb(pkg.label_key)}</h3>
                      {pkg.tagline_key && (
                        <p className="text-sm text-purple-600 font-medium mb-3">{tDb(pkg.tagline_key)}</p>
                      )}
                    </div>

                    {/* Price */}
                    <div className="text-4xl font-bold text-purple-600 mb-6 text-center">
                      {pkg.price} <span className="text-lg text-gray-500">RON</span>
                    </div>

                    {/* Features */}
                    {pkg.includes && pkg.includes.length > 0 && (
                      <ul className="space-y-3 mb-8">
                        {pkg.includes.map((include, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-gray-600">
                            <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-green-600 text-xs">✓</span>
                            </span>
                            {tDb(include.include_key)}
                          </li>
                        ))}
                      </ul>
                    )}

                    <Link to="/order">
                      <Button className="w-full bg-gradient-purple hover:opacity-90">
                        {t('orderNow')}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No Packages State */}
          {!isLoading && !error && previewPackages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">{t('noPackagesAvailable') || 'No packages available at the moment.'}</p>
              <p className="text-gray-500">{t('checkBackLater') || 'Please check back later.'}</p>
            </div>
          )}
          
          {/* View All Packages Button */}
          {!isLoading && !error && previewPackages.length > 0 && (
            <div className="text-center mt-12">
              <Link to="/packages">
                <Button size="lg" variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                  {t('viewAllPackages') || 'View All Packages'}
                </Button>
              </Link>
            </div>
          )}
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
    </div>
  );
};

export default Index;
