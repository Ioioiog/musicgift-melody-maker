
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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
    return <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">{t('loadingPackages')}</p>
          </div>
        </div>
        <Footer />
      </div>;
  }

  return <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h1 className="text-3xl md:text-5xl font-bold mb-4" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            {t('packagesTitle')}
          </motion.h1>
          <motion.p className="text-lg md:text-xl opacity-90" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }}>
            {t('packagesSubtitle')}
          </motion.p>
        </div>
      </section>

      {/* Enhanced Packages Section */}
      <section className="bg-gradient-to-br from-gray-50 via-white to-purple-50 relative overflow-hidden py-16">
        <div className="container mx-auto relative z-10 px-[22px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-8xl mx-auto">
            {packages.map((pkg, index) => <Card key={pkg.id || pkg.value} className={`relative hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 backdrop-blur-sm bg-white/80 border-0 shadow-lg group ${pkg.tags?.some(tag => tag.tag_type === 'popular') || pkg.tag === 'popular' ? 'ring-2 ring-purple-200 scale-105 shadow-purple-100' : ''}`}>
                {(pkg.tags?.some(tag => tag.tag_type === 'popular') || pkg.tag === 'popular') && <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl animate-pulse">
                      ⭐ {t('mostPopular')}
                    </span>
                  </div>}
                
                {/* Gradient overlay for popular packages */}
                {(pkg.tags?.some(tag => tag.tag_type === 'popular') || pkg.tag === 'popular') && <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-yellow-500/5 rounded-lg"></div>}
                
                <CardContent className="p-8 relative z-10">
                  {/* Icon and Title */}
                  <div className="text-center mb-8">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {pkg.value === 'personal' ? '🎁' : pkg.value === 'business' ? '💼' : pkg.value === 'premium' ? '🌟' : pkg.value === 'artist' ? '🎤' : pkg.value === 'instrumental' ? '🎶' : pkg.value === 'remix' ? '🔁' : '🎁'}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                      {tDb(pkg.label_key)}
                    </h3>
                    {pkg.tagline_key && <p className="text-sm text-purple-600 font-semibold mb-4 bg-purple-50 px-3 py-1 rounded-full inline-block">
                        {tDb(pkg.tagline_key)}
                      </p>}
                    
                    {/* Enhanced Price Display */}
                    <div className="mb-6">
                      <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                        {pkg.price}
                        <span className="text-xl text-gray-500 ml-2">RON</span>
                      </div>
                      {pkg.delivery_time_key && <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block">
                          ⏱️ {tDb(pkg.delivery_time_key)}
                        </div>}
                    </div>
                  </div>

                  {/* Description */}
                  {pkg.description_key && <div className="mb-8 p-4 bg-gray-50 rounded-lg border-l-4 border-purple-200">
                      <p className="text-sm text-gray-700 leading-relaxed italic line-clamp-3">
                        {tDb(pkg.description_key)}
                      </p>
                    </div>}

                  {/* Enhanced Features Preview */}
                  {pkg.includes && pkg.includes.length > 0 && <div className="mb-8">
                      <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
                        <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                          <span className="text-green-600 text-xs">✨</span>
                        </span>
                        {t('whatsIncluded')}
                      </h4>
                      <ul className="space-y-2">
                        {pkg.includes.slice(0, 3).map((include, featureIndex) => <li key={featureIndex} className="flex items-start text-sm text-gray-600">
                            <span className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center mr-2 mt-1 flex-shrink-0 text-xs">✓</span>
                            <span className="line-clamp-2">{tDb(include.include_key)}</span>
                          </li>)}
                        {pkg.includes.length > 3 && <li className="text-sm text-purple-600 font-medium">
                            +{pkg.includes.length - 3} {t('moreFeatures') || 'more features'}
                          </li>}
                      </ul>
                    </div>}

                  <div className="space-y-3">
                    <Link to={`/packages/${pkg.value}`}>
                      <Button variant="outline" className="w-full text-purple-600 border-purple-600 hover:bg-purple-50 transition-all duration-300" size="lg">
                        {t('learnMore') || 'Learn More'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    
                    <Link to="/order">
                      <Button className={`w-full text-lg py-4 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg ${pkg.tags?.some(tag => tag.tag_type === 'popular') || pkg.tag === 'popular' ? 'bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 hover:from-purple-700 hover:via-purple-800 hover:to-blue-700 text-white shadow-purple-200' : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white'}`} size="lg">
                        <span className="mr-2">🚀</span>
                        {t('orderNow')}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};

export default Packages;
