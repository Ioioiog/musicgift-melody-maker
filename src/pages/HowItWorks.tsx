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
      
      {/* Hero Section with Purple Musical Background and Animated Steps */}
      <section className="py-40 text-white relative overflow-hidden" style={{
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
          <motion.p className="text-lg md:text-xl opacity-90 mb-12" initial={{
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

          {/* Animated Steps inside Hero */}
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.6
        }} className="relative z-10">
            <AnimatedStepFlow />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      

      <Footer />
    </div>;
};
export default HowItWorks;