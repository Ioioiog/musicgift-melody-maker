
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ImpactCards from "@/components/ImpactCards";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const About = () => {
  const { t } = useLanguage();
  
  const entities = [{
    title: t('mihaiGruiaTitle'),
    description: t('mihaiGruiaDescription'),
    color: "bg-purple-500"
  }, {
    title: t('mangoRecordsTitle'),
    description: t('mangoRecordsDescription'),
    color: "bg-blue-500"
  }, {
    title: t('domgStudioTitle'),
    description: t('domgStudioDescription'),
    color: "bg-green-500"
  }, {
    title: t('doMusicForGoodTitle'),
    description: t('doMusicForGoodDescription'),
    color: "bg-orange-500"
  }];
  
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h1 
            className="text-3xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t('aboutSubtitle')}
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl opacity-90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('aboutNewDescription1')}
          </motion.p>
        </div>
      </section>

      {/* Impact Cards Section */}
      <ImpactCards />

      {/* Enhanced Content Section */}
      <section className="relative bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden py-20">
        {/* Floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            className="absolute top-10 left-0 text-6xl text-purple-300 opacity-20"
            animate={{ x: [0, 100] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            ♪
          </motion.div>
          <motion.div 
            className="absolute bottom-10 right-0 text-4xl text-orange-300 opacity-20"
            animate={{ x: [0, -100] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            🎵
          </motion.div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Enhanced Container */}
          <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-6 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
              {/* Left Content */}
              <motion.div 
                className="space-y-6 sm:space-y-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div>
                  <div className="space-y-4 sm:space-y-6 text-gray-600 leading-relaxed text-sm sm:text-base">
                    <p>
                      {t('aboutNewDescription2')}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Right Content - Who We Are */}
              <motion.div 
                className="mt-8 lg:mt-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">{t('whoWeAre')}</h3>
                <div className="space-y-6 sm:space-y-8">
                  {entities.map((entity, index) => (
                    <motion.div 
                      key={index} 
                      className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${entity.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <span className="text-white font-bold text-sm sm:text-base md:text-lg">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{entity.title}</h4>
                          <p className="text-gray-600 leading-relaxed text-xs sm:text-sm break-words">{entity.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
