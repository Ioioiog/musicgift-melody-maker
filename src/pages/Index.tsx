
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { usePackages } from "@/hooks/usePackageData";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslations";

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

  // Limit to first 3 packages for homepage preview
  const previewPackages = packages.slice(0, 3);
  
  return <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-gray-800">
                {t('heroTitle') || 'Give the Gift of Music'}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {t('heroSubtitle') || 'A personalized song, created just for your special someone. The most unique gift they\'ll ever receive.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/packages">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-full">
                    {t('seePackages') || 'See Packages'}
                  </Button>
                </Link>
                <Link to="/testimonials">
                  <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-full">
                    {t('listenToSamples') || 'Listen to Samples'}
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative lg:pl-12">
              <div className="w-full max-w-lg mx-auto animate-float">
                <AspectRatio ratio={16 / 9}>
                  <video className="w-full h-full object-cover rounded-2xl shadow-lg" autoPlay muted loop playsInline>
                    <source src="/lovable-uploads/Jingle Musicgift master.mp4" type="video/mp4" />
                    {/* Fallback image if video doesn't load */}
                    <img src="/lovable-uploads/65518432-abfe-42fc-acc5-25014d321134.png" alt="Music Gift Box" className="w-full h-full object-contain" />
                  </video>
                </AspectRatio>
              </div>
              
              {/* Floating music notes */}
              <div className="absolute top-10 right-10 text-4xl animate-bounce delay-75">🎵</div>
              <div className="absolute bottom-20 left-0 text-3xl animate-bounce delay-150">🎶</div>
              <div className="absolute top-32 left-10 text-2xl animate-bounce delay-300">♪</div>
              
              {/* Info Card */}
              
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
