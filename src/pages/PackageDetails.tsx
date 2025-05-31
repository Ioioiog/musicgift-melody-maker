
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePackages } from "@/hooks/usePackageData";
import { useTranslation } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Star, Clock, CheckCircle } from "lucide-react";

const PackageDetails = () => {
  const { packageValue } = useParams<{ packageValue: string }>();
  const { data: packages = [], isLoading } = usePackages();
  const { t: tDb } = useTranslation();
  const { t } = useLanguage();

  const packageData = packages.find(pkg => pkg.value === packageValue);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-600 text-sm">{t('loadingPackages')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Package Not Found</h1>
            <p className="text-gray-600 mb-6">The package you're looking for doesn't exist.</p>
            <Link to="/packages">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Packages
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isPopular = packageData.tags?.some(tag => tag.tag_type === 'popular');

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Compact Hero Section */}
      <section className="pt-20 pb-8 bg-gradient-to-br from-purple-50 via-white to-blue-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="mb-4">
            <Link to="/packages" className="inline-flex items-center text-purple-600 hover:text-purple-800 text-sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              {t('backToPackages') || 'Back to Packages'}
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center mb-3">
                <div className="text-4xl mr-3">
                  {packageData.value === 'personal' ? '🎁' : 
                   packageData.value === 'business' ? '💼' : 
                   packageData.value === 'premium' ? '🌟' : 
                   packageData.value === 'artist' ? '🎤' : 
                   packageData.value === 'instrumental' ? '🎶' : 
                   packageData.value === 'remix' ? '🔁' : '🎁'}
                </div>
                {isPopular && (
                  <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    <Star className="w-3 h-3 inline mr-1" />
                    {t('mostPopular')}
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
                {tDb(packageData.label_key)}
              </h1>
              
              {packageData.tagline_key && (
                <p className="text-base text-purple-600 font-semibold mb-4 bg-purple-50 px-3 py-1 rounded-lg inline-block">
                  {tDb(packageData.tagline_key)}
                </p>
              )}
              
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                {packageData.price}
                <span className="text-lg text-gray-500 ml-2">RON</span>
              </div>
              
              {packageData.delivery_time_key && (
                <div className="flex items-center text-gray-600 mb-4">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">{tDb(packageData.delivery_time_key)}</span>
                </div>
              )}
            </div>
            
            <div className="lg:text-right">
              <Link to="/order">
                <Button 
                  size="lg" 
                  className="text-lg py-4 px-8 bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 hover:from-purple-700 hover:via-purple-800 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <span className="mr-2">🚀</span>
                  {t('orderNow')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Compact Description and Features in one section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Description */}
              {packageData.description_key && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {t('aboutThisPackage') || 'About This Package'}
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-purple-500">
                    <p className="text-sm text-gray-700 leading-relaxed italic">
                      {tDb(packageData.description_key)}
                    </p>
                  </div>
                </div>
              )}

              {/* Features */}
              {packageData.includes && packageData.includes.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {t('whatsIncluded')}
                  </h2>
                  
                  <div className="space-y-3">
                    {packageData.includes.map((include, index) => (
                      <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white flex items-center justify-center mr-3 flex-shrink-0 shadow-md">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{tDb(include.include_key)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Compact CTA Section */}
      <section className="py-8 bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">
            {t('readyToOrder') || 'Ready to Order?'}
          </h2>
          <p className="text-base mb-6 opacity-90">
            {t('startYourJourney') || 'Start your musical journey today!'}
          </p>
          <Link to="/order">
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg py-4 px-8 bg-white text-purple-700 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <span className="mr-2">🎵</span>
              {t('orderNow')}
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PackageDetails;
