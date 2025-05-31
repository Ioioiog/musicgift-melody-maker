
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

  if (!packageData) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Package Not Found</h1>
            <p className="text-gray-600 mb-8">The package you're looking for doesn't exist.</p>
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
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-purple-50 via-white to-blue-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link to="/packages" className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('backToPackages') || 'Back to Packages'}
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <div className="text-6xl mr-4">
                  {packageData.value === 'personal' ? '🎁' : 
                   packageData.value === 'business' ? '💼' : 
                   packageData.value === 'premium' ? '🌟' : 
                   packageData.value === 'artist' ? '🎤' : 
                   packageData.value === 'instrumental' ? '🎶' : 
                   packageData.value === 'remix' ? '🔁' : '🎁'}
                </div>
                {isPopular && (
                  <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                    <Star className="w-4 h-4 inline mr-1" />
                    {t('mostPopular')}
                  </span>
                )}
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
                {tDb(packageData.label_key)}
              </h1>
              
              {packageData.tagline_key && (
                <p className="text-xl text-purple-600 font-semibold mb-6 bg-purple-50 px-4 py-2 rounded-lg inline-block">
                  {tDb(packageData.tagline_key)}
                </p>
              )}
              
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-8">
                {packageData.price}
                <span className="text-2xl text-gray-500 ml-2">RON</span>
              </div>
              
              {packageData.delivery_time_key && (
                <div className="flex items-center text-gray-600 mb-8">
                  <Clock className="w-5 h-5 mr-2" />
                  {tDb(packageData.delivery_time_key)}
                </div>
              )}
            </div>
            
            <div className="lg:text-right">
              <Link to="/order">
                <Button 
                  size="lg" 
                  className="text-xl py-6 px-12 bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 hover:from-purple-700 hover:via-purple-800 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <span className="mr-2">🚀</span>
                  {t('orderNow')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      {packageData.description_key && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                {t('aboutThisPackage') || 'About This Package'}
              </h2>
              <div className="bg-gray-50 rounded-xl p-8 border-l-4 border-purple-500">
                <p className="text-lg text-gray-700 leading-relaxed italic text-center">
                  {tDb(packageData.description_key)}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {packageData.includes && packageData.includes.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                {t('whatsIncluded')}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {packageData.includes.map((include, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white flex items-center justify-center mr-4 flex-shrink-0 shadow-md">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-gray-700 leading-relaxed">{tDb(include.include_key)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            {t('readyToOrder') || 'Ready to Order?'}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('startYourJourney') || 'Start your musical journey today!'}
          </p>
          <Link to="/order">
            <Button 
              size="lg" 
              variant="secondary"
              className="text-xl py-6 px-12 bg-white text-purple-700 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
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
