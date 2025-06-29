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
  return <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Compact Hero Section - Adjusted padding for seamless connection to navbar */}
      <section className="pt-16 md:pt-20 lg:pt-24 pb-6 text-white relative overflow-hidden" style={{
      backgroundImage: 'url(/uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
        <div className="absolute inset-0 bg-black/20 py-0"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 px-[14px] py-0 my-[24px]">
          <motion.h2 className="text-2xl md:text-3xl font-bold mb-2" initial={{
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
          <motion.p className="text-base md:text-lg opacity-90 mb-4" initial={{
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

      {/* Main Content - Flexible to fill remaining space with background */}
      <section className="flex-1 flex items-center py-4 relative" style={{
      backgroundImage: 'url(/uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 0.6
      }} className="w-full relative z-10 px-0 my-0 py-0">
          <AnimatedStepFlow />
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />
    </div>;
};
export default HowItWorks;
