
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GiftPurchaseWizard from "@/components/gift/GiftPurchaseWizard";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { motion } from "framer-motion";

const Gift = () => {
  const { t } = useLanguage();
  
  // SEO Meta Tags
  usePageMeta({
    title_en: t('giftTitle'),
    title_ro: t('giftTitle'),
    description_en: t('giftDescription'),
    description_ro: t('giftDescription'),
    keywords_en: t('giftKeywords'),
    keywords_ro: t('giftKeywords')
  });

  const handleGiftComplete = () => {
    // Handle gift card completion
    console.log('Gift card completed');
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative" style={{
      backgroundImage: "url('/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png')"
    }}>
      {/* Enhanced background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-black/50" />
      
      {/* Animated background dots */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse" />
        <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-purple-300/30 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-pink-300/40 rounded-full animate-pulse delay-2000" />
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-yellow-300/25 rounded-full animate-pulse delay-3000" />
      </div>
      
      <Navigation />
      
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            {/* Decorative gradient separator */}
            <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 via-purple-500 to-pink-500 mx-auto mb-8 rounded-full opacity-80" />
            
            <motion.div initial={{
              opacity: 0,
              y: 30,
              scale: 0.95
            }} animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }} transition={{
              duration: 0.8,
              delay: 0.2
            }}>
              <GiftPurchaseWizard onComplete={handleGiftComplete} />
            </motion.div>
            
            {/* Bottom decorative gradient separator */}
            <div className="w-32 h-1 bg-gradient-to-r from-pink-400 via-purple-500 to-yellow-500 mx-auto mt-8 rounded-full opacity-60" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gift;
