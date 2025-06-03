
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePackages } from "@/hooks/usePackageData";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Clock, Star } from "lucide-react";

const PackageDetails = () => {
  const { packageId } = useParams();
  const { data: packages = [], isLoading } = usePackages();
  const { t: tDb } = useLanguage();
  const { t } = useLanguage();

  const selectedPackage = packages.find(pkg => pkg.value === packageId);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">{t('loadingPackage')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!selectedPackage) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-gray-600 mb-4">{t('packageNotFound')}</p>
            <Link to="/packages">
              <Button variant="outline">{t('backToPackages')}</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Enhanced Hero Section with Package Details Grid */}
      <section 
        className="py-20 text-white relative overflow-hidden"
        style={{
          backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <Link to="/packages" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backToPackages')}
          </Link>
          
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-6">
              {selectedPackage.value === 'personal' ? '🎁' : 
               selectedPackage.value === 'business' ? '💼' : 
               selectedPackage.value === 'premium' ? '🌟' : 
               selectedPackage.value === 'artist' ? '🎤' : 
               selectedPackage.value === 'instrumental' ? '🎶' : 
               selectedPackage.value === 'remix' ? '🔁' : '🎁'}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {tDb(selectedPackage.label_key)}
            </h1>
            {selectedPackage.tagline_key && (
              <p className="text-xl md:text-2xl opacity-90">
                {tDb(selectedPackage.tagline_key)}
              </p>
            )}
          </motion.div>

          {/* Package Details Grid moved into Hero */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Package Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.6 }}
            >
              <Card className="backdrop-blur-md bg-white/10 border border-white/20">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="text-4xl font-bold text-white mb-2">
                      {selectedPackage.price} <span className="text-lg text-white/70">RON</span>
                    </div>
                    {selectedPackage.delivery_time_key && (
                      <div className="flex items-center justify-center text-white/80">
                        <Clock className="w-4 h-4 mr-2" />
                        {tDb(selectedPackage.delivery_time_key)}
                      </div>
                    )}
                  </div>

                  {selectedPackage.description_key && (
                    <div className="mb-8 p-4 bg-white/10 rounded-lg border-l-4 border-purple-300/50">
                      <h3 className="text-xl font-bold text-white mb-4">{t('description')}</h3>
                      <p className="text-white/90 leading-relaxed italic">
                        {tDb(selectedPackage.description_key)}
                      </p>
                    </div>
                  )}

                  <Link to="/order">
                    <Button className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 text-lg py-4 backdrop-blur-md">
                      {t('orderNow')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="backdrop-blur-md bg-white/10 border border-white/20">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Star className="w-6 h-6 text-yellow-400 mr-2" />
                    {t('whatsIncluded')}
                  </h3>
                  
                  {selectedPackage.includes && selectedPackage.includes.length > 0 ? (
                    <ul className="space-y-4">
                      {selectedPackage.includes.map((include, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-6 h-6 bg-green-400/20 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 border border-green-400/30">
                            <Check className="w-4 h-4 text-green-300" />
                          </div>
                          <span className="text-white/90 leading-relaxed">
                            {tDb(include.include_key)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-white/70">{t('noFeaturesListed')}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PackageDetails;
