
import React, { Suspense, lazy } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Heart, Gift as GiftIcon, Sparkles } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { useStructuredData } from '@/components/StructuredData';
import OptimizedImage from '@/components/OptimizedImage';

// Lazy load components for better performance
const GiftPurchaseWizard = lazy(() => import('@/components/gift/GiftPurchaseWizard'));
const GiftRedemption = lazy(() => import('@/components/gift/GiftRedemption'));
const Navigation = lazy(() => import('@/components/Navigation'));
const Footer = lazy(() => import('@/components/Footer'));

const Gift = () => {
  const { t } = useLanguage();
  const { serviceSchema } = useStructuredData();

  const giftPageSchema = {
    ...serviceSchema,
    "@type": "Product",
    "name": t('shareGiftOfMusic'),
    "description": t('givePersonalizedSong'),
    "image": "https://www.musicgift.ro/lovable-uploads/9d0d10ef-2340-4632-8df0-f5058547a0c9.png",
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "49",
      "highPrice": "299",
      "priceCurrency": "RON"
    }
  };

  return (
    <>
      <SEOHead
        title={t('shareGiftOfMusic') + ' - MusicGift.ro'}
        description={t('givePersonalizedSong') + ' ' + t('createDigitalGiftCard')}
        structuredData={giftPageSchema}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Suspense fallback={<div className="h-16 bg-black/20" />}>
          <Navigation />
        </Suspense>
        
        {/* Hero Section with optimized background */}
        <section className="relative py-16 px-4 overflow-hidden">
          {/* Optimized background image */}
          <div className="absolute inset-0 z-0">
            <OptimizedImage
              src="/lovable-uploads/9d0d10ef-2340-4632-8df0-f5058547a0c9.png"
              alt="Musical gift background"
              className="w-full h-full object-cover opacity-20"
              priority={true}
              width={1920}
              height={1080}
            />
          </div>
          
          {/* Floating elements for visual appeal */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-20 left-10"
              animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <Heart className="w-8 h-8 text-pink-300 opacity-60" />
            </motion.div>
            <motion.div
              className="absolute top-32 right-20"
              animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              <GiftIcon className="w-10 h-10 text-yellow-300 opacity-50" />
            </motion.div>
            <motion.div
              className="absolute bottom-32 left-20"
              animate={{ y: [-15, 15, -15], rotate: [0, 10, 0] }}
              transition={{ duration: 7, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 text-blue-300 opacity-70" />
            </motion.div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                {t('shareGiftOfMusic')}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                {t('givePersonalizedSong')}
              </p>
              <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto">
                {t('createDigitalGiftCard')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
              <Suspense fallback={
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              }>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                      <GiftIcon className="w-8 h-8 text-purple-600" />
                      {t('buyGiftCard')}
                    </h2>
                    <GiftPurchaseWizard />
                  </div>
                  
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                      <Sparkles className="w-8 h-8 text-blue-600" />
                      {t('redeemGiftCard')}
                    </h2>
                    <GiftRedemption />
                  </div>
                </div>
              </Suspense>
            </div>
          </div>
        </section>

        <Suspense fallback={<div className="h-64 bg-gray-900" />}>
          <Footer />
        </Suspense>
      </div>
    </>
  );
};

export default Gift;
