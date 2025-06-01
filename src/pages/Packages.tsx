
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScenarioHero from "@/components/ScenarioHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { usePackages } from "@/hooks/usePackageData";
import { useTranslation } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Packages = () => {
  const {
    data: packages = [],
    isLoading
  } = usePackages();
  const {
    t: tDb
  } = useTranslation();
  const {
    t
  } = useLanguage();

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
      
      {/* Dynamic Scenario Hero Section */}
      <ScenarioHero />

      {/* Enhanced Packages Section with Homepage Style */}
      <section className="relative overflow-hidden py-16" style={{
        backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="container mx-auto relative z-10 px-[22px]">
          {/* Section Title */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('chooseYourPackage')}</h2>
            <p className="text-lg md:text-xl text-white/90">{t('selectPerfectPackage')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id || pkg.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className={`relative backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-xl h-[400px] ${pkg.tags?.some(tag => tag.tag_type === 'popular') || pkg.tag === 'popular' ? 'ring-2 ring-purple-300/50 scale-105' : ''}`}>
                  {(pkg.tags?.some(tag => tag.tag_type === 'popular') || pkg.tag === 'popular') && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                      <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white py-2 rounded-full text-sm font-bold shadow-xl animate-pulse px-[14px] text-justify">
                        ⭐ {t('mostPopular')}
                      </span>
                    </div>
                  )}
                  
                  <CardContent className="p-4 relative z-10 text-white h-full flex flex-col justify-between">
                    {/* Icon and Title */}
                    <div className="text-center mb-4">
                      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                        {pkg.value === 'personal' ? '🎁' : pkg.value === 'business' ? '💼' : pkg.value === 'premium' ? '🌟' : pkg.value === 'artist' ? '🎤' : pkg.value === 'instrumental' ? '🎶' : pkg.value === 'remix' ? '🔁' : '🎁'}
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        {tDb(pkg.label_key)}
                      </h3>
                      {pkg.tagline_key && (
                        <p className="text-xs text-purple-200 font-semibold mb-3 bg-purple-500/20 px-2 py-1 rounded-full inline-block">
                          {tDb(pkg.tagline_key)}
                        </p>
                      )}
                      
                      {/* Enhanced Price Display */}
                      <div className="mb-4">
                        <div className="text-2xl font-bold text-white mb-1">
                          {pkg.price}
                          <span className="text-lg text-white/70 ml-1">RON</span>
                        </div>
                        {pkg.delivery_time_key && (
                          <div className="text-xs text-white/80 bg-white/10 px-2 py-1 rounded-full inline-block">
                            ⏱️ {tDb(pkg.delivery_time_key)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 mt-auto">
                      <Link to={`/packages/${pkg.value}`}>
                        <Button variant="outline" className="w-full text-white border-white/30 hover:bg-white/10 backdrop-blur-md transition-all duration-300 text-sm py-2" size="sm">
                          {t('learnMore') || 'Learn More'}
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                      
                      <Link to="/order">
                        <Button className={`w-full text-sm py-2 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg ${pkg.tags?.some(tag => tag.tag_type === 'popular') || pkg.tag === 'popular' ? 'bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 backdrop-blur-md' : 'bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 backdrop-blur-md'}`} size="sm">
                          <span className="mr-1">🚀</span>
                          {t('orderNow')}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom border accent */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
      </section>

      <Footer />
    </div>
  );
};

export default Packages;
