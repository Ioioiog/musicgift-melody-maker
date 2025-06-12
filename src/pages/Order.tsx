
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import OrderHeroSection from '@/components/order/OrderHeroSection';
import OrderWizard from '@/components/OrderWizard';
import CodeInputSection from '@/components/order/CodeInputSection';
import OrderSidebarSummary from '@/components/order/OrderSidebarSummary';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { motion } from 'framer-motion';

const Order = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [orderData, setOrderData] = useState<any>(null);
  
  // SEO Meta Tags
  usePageMeta({
    title_en: t('orderTitle'),
    title_ro: t('orderTitle'),
    description_en: t('orderDescription'),
    description_ro: t('orderDescription'),
    keywords_en: t('orderKeywords'),
    keywords_ro: t('orderKeywords')
  });

  const preselectedPackage = searchParams.get('package');
  const giftCode = searchParams.get('code');

  const [isGiftCardValid, setIsGiftCardValid] = useState(false);
  const [giftCardDetails, setGiftCardDetails] = useState<any>(null);
  const [showCodeInput, setShowCodeInput] = useState(!!giftCode);

  useEffect(() => {
    if (giftCode) {
      // Validate gift card code
      const validateGiftCard = async () => {
        try {
          const { data, error } = await supabase
            .from('gift_cards')
            .select('*')
            .eq('code', giftCode)
            .single();

          if (error) {
            console.error('Error validating gift card:', error);
            setIsGiftCardValid(false);
            setGiftCardDetails(null);
          } else {
            setIsGiftCardValid(true);
            setGiftCardDetails(data);
          }
        } catch (error) {
          console.error('Error:', error);
          setIsGiftCardValid(false);
          setGiftCardDetails(null);
        }
      };

      validateGiftCard();
    }
  }, [giftCode]);

  const handleGiftCardSubmit = async (code: string) => {
    try {
      const { data, error } = await supabase
        .from('gift_cards')
        .select('*')
        .eq('code', code)
        .single();

      if (error) {
        console.error('Error validating gift card:', error);
        setIsGiftCardValid(false);
        setGiftCardDetails(null);
      } else {
        setIsGiftCardValid(true);
        setGiftCardDetails(data);
        setShowCodeInput(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsGiftCardValid(false);
      setGiftCardDetails(null);
    }
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
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-blue-300/25 rounded-full animate-pulse delay-3000" />
      </div>
      
      <Navigation />

      <OrderHeroSection />

      <section className="py-12 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.div initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.5,
                delay: 0.2
              }}>
                <OrderWizard
                  giftCard={giftCardDetails}
                  preselectedPackage={preselectedPackage}
                  onOrderDataChange={setOrderData}
                />
              </motion.div>
            </div>

            <div className="lg:col-span-1">
              <motion.div initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.5,
                delay: 0.4
              }}>
                <OrderSidebarSummary orderData={orderData} giftCard={giftCardDetails} />
              </motion.div>

              {!giftCode && <motion.div initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.5,
                delay: 0.6
              }}>
                <CodeInputSection />
              </motion.div>}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Order;
