import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const About = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section with Purple Musical Background */}
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
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            {t('aboutTitle')}
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl opacity-90" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('aboutSubtitle')}
          </motion.p>
        </div>
      </section>

      {/* Rest of the About page content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('ourStory')}</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t('ourStoryContent')}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {t('ourStoryContent2')}
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="p-8">
                <div className="text-4xl mb-4">🎵</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('ourMission')}</h3>
                <p className="text-gray-600">
                  {t('ourMissionContent')}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('ourValues')}</h2>
            <p className="text-gray-600">{t('ourValuesSubtitle')}</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🎨", title: t('creativity'), content: t('creativityContent') },
              { icon: "❤️", title: t('passion'), content: t('passionContent') },
              { icon: "🎯", title: t('quality'), content: t('qualityContent') }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{value.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                    <p className="text-gray-600">{value.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
