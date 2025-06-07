
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import AnimatedStepFlow from "@/components/AnimatedStepFlow";

const HowItWorks = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Compact Hero Section */}
      <section 
        className="py-8 text-white relative overflow-hidden" 
        style={{
          backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold mb-3" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {t('howItWorksProcessTitle')}
          </motion.h2>
          <motion.p 
            className="text-base md:text-lg opacity-90 mb-6" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {t('howItWorksProcessSubtitle')}
          </motion.p>
        </div>
      </section>

      {/* Viewport-Contained Step Flow */}
      <section className="min-h-[calc(100vh-200px)] flex items-center py-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.6 }} 
          className="w-full"
        >
          <AnimatedStepFlow />
        </motion.div>
      </section>
    </div>
  );
};

export default HowItWorks;
