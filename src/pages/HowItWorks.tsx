import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import AnimatedStepFlow from "@/components/AnimatedStepFlow";
const HowItWorks = () => {
  const {
    t
  } = useLanguage();
  return <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section with Purple Musical Background */}
      <section className="py-30 text-white relative overflow-hidden" style={{
      backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
        <div className="absolute inset-0 bg-black/20 py-0"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          
          
          <motion.h2 className="text-3xl md:text-4xl font-bold mb-4" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }}>
            {t('howItWorksProcessTitle')}
          </motion.h2>
          <motion.p className="text-lg md:text-xl opacity-90" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.5
        }}>
            {t('howItWorksProcessSubtitle')}
          </motion.p>
        </div>
      </section>

      {/* Animated Steps Section */}
      <section className="bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/20 relative overflow-hidden py-[5px]">
        {/* Background decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-100/10 to-blue-100/10 rounded-full blur-3xl" />
        
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 0.3
      }} className="relative z-10">
          <AnimatedStepFlow />
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-[6px]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
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
    </div>;
};
export default HowItWorks;