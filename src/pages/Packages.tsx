
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { usePackages } from "@/hooks/usePackageData";
import { useLanguage } from "@/contexts/LanguageContext";

const Packages = () => {
  const { data: packages = [], isLoading } = usePackages();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">{t('loadingPackages')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Page Title */}
      <section className="pt-24 pb-8 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">{t('selectYourPackage')}</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('packagesSubtitle')}
          </p>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-8xl mx-auto">
            {packages.map((pkg, index) => (
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
                
                <CardContent className="p-6">
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
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{t(pkg.label_key)}</h3>
                    {pkg.tagline_key && (
                      <p className="text-sm text-purple-600 font-medium mb-3">{t(pkg.tagline_key)}</p>
                    )}
                    
                    {/* Price */}
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-purple-600">
                        {pkg.price}
                        <span className="text-lg text-gray-500 ml-1">RON</span>
                      </div>
                      {pkg.delivery_time_key && (
                        <div className="text-sm text-gray-500 mt-1">{t(pkg.delivery_time_key)}</div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {pkg.description_key && (
                    <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                      {t(pkg.description_key)}
                    </p>
                  )}

                  {/* Features */}
                  {pkg.includes && pkg.includes.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">{t('whatsIncluded')}</h4>
                      <ul className="space-y-3">
                        {pkg.includes.map((include, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <span className="text-xs font-bold">✓</span>
                            </span>
                            <span className="text-sm text-gray-700">{t(include.include_key)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Link to="/order">
                    <Button 
                      className={`w-full ${
                        pkg.tags?.some(tag => tag.tag_type === 'popular')
                          ? 'bg-gradient-purple hover:opacity-90 text-white' 
                          : 'bg-gradient-purple hover:opacity-90'
                      }`}
                      size="lg"
                    >
                      {t('orderNow')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Packages;
