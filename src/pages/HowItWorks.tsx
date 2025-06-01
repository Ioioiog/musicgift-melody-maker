
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { ShoppingCart, MessageSquare, Music, Gift } from "lucide-react";

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: ShoppingCart,
      title: t('step1Title'),
      description: t('step1Description'),
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: MessageSquare,
      title: t('step2Title'),
      description: t('step2Description'),
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Music,
      title: t('step3Title'),
      description: t('step3Description'),
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: Gift,
      title: t('step4Title'),
      description: t('step4Description'),
      color: "bg-orange-100 text-orange-600"
    }
  ];
  
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
            {t('howItWorksTitle')}
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl opacity-90" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('howItWorksSubtitle')}
          </motion.p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center mx-auto mb-4`}>
                      <step.icon className="w-8 h-8" />
                    </div>
                    <div className="text-lg font-bold text-purple-600 mb-2">
                      {t('step')} {index + 1}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('readyToStart')}</h2>
            <p className="text-xl text-gray-600 mb-8">{t('readyToStartContent')}</p>
            <Link to="/packages">
              <Button size="lg" className="bg-gradient-purple">
                {t('startYourOrder')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;
