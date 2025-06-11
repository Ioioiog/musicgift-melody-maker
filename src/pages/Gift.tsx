
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift as GiftIcon, Heart, Users } from "lucide-react";
import GiftPurchaseWizard from "@/components/gift/GiftPurchaseWizard";
import GiftRedemption from "@/components/gift/GiftRedemption";
import GiftPaymentSuccess from "@/components/gift/GiftPaymentSuccess";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

const Gift = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  // Check if returning from payment
  const paymentStatus = searchParams.get('payment');

  const handleGiftPurchaseComplete = (data: any) => {
    console.log("Gift purchase completed:", data);
    // This will now be called only after successful payment
    // The payment flow will handle the redirection automatically
    toast({
      title: t('giftCardCreated'),
      description: `${t('giftCardCode')} ${data.code} ${t('giftCardWillBeDelivered')} ${data.recipient_email}`
    });
  };

  const handleGiftRedemption = (giftCard: any, selectedPackage: string, upgradeAmount?: number) => {
    console.log("Gift redemption:", {
      giftCard,
      selectedPackage,
      upgradeAmount
    });

    // Here we would redirect to the order flow with the gift card applied
    // For now, we'll show a success message
    toast({
      title: t('giftCardApplied'),
      description: `${t('proceedingToComplete')} ${selectedPackage} ${t('packageOrder')}`
    });

    // TODO: Redirect to order flow with gift card data
    // window.location.href = `/order?gift=${giftCard.code}&package=${selectedPackage}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Compact Hero Section - Adjusted padding for seamless connection to navbar */}
      <section className="pt-16 md:pt-20 lg:pt-24 pb-6 text-white relative overflow-hidden" style={{
        backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="absolute inset-0 bg-black/20 py-0"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div 
            className="flex justify-center mb-6" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
          >
          </motion.div>
          <motion.h2 
            className="text-2xl md:text-3xl font-bold mb-2" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {t('shareGiftOfMusic')}
          </motion.h2>
          <motion.p 
            className="text-base md:text-lg opacity-90 mb-4" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {t('givePersonalizedSong')} {t('createDigitalGiftCard')}
          </motion.p>
        </div>
      </section>

      {/* Main Content - Flexible to fill remaining space with background */}
      <section className="flex-1 flex items-center py-4 relative" style={{
        backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="absolute inset-0 bg-black/30 py-[22px]"></div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.6 }} 
          className="w-full relative z-10 px-4 py-[10px]"
        >
          <div className="max-w-4xl mx-auto">
            {paymentStatus === 'success' ? (
              <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-xl border border-purple-200/30 backdrop-blur-sm p-6">
                <GiftPaymentSuccess />
              </div>
            ) : (
              <Tabs defaultValue="purchase" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/10 backdrop-blur-sm border border-white/20 py-1 my-[26px] h-auto">
                  <TabsTrigger 
                    value="purchase" 
                    className="text-sm sm:text-base lg:text-lg data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80 py-2 sm:py-3 px-2 sm:px-4 h-auto min-h-[44px] leading-tight"
                  >
                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left">
                      <GiftIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm lg:text-base font-medium leading-tight">
                        {t('buyGiftCard')}
                      </span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="redeem" 
                    className="text-sm sm:text-base lg:text-lg data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80 py-2 sm:py-3 px-2 sm:px-4 h-auto min-h-[44px] leading-tight"
                  >
                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left">
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm lg:text-base font-medium leading-tight">
                        {t('redeemGiftCard')}
                      </span>
                    </div>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="purchase">
                  <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-xl border border-purple-200/30 backdrop-blur-sm overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-purple-400/15 to-transparent rounded-full blur-lg" />
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-tr from-indigo-400/10 to-transparent rounded-full blur-md" />
                    
                    <div className="relative z-10 p-6">
                      <GiftPurchaseWizard onComplete={handleGiftPurchaseComplete} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="redeem">
                  <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-xl border border-purple-200/30 backdrop-blur-sm overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-purple-400/15 to-transparent rounded-full blur-lg" />
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-tr from-indigo-400/10 to-transparent rounded-full blur-md" />
                    
                    <div className="relative z-10 p-6">
                      <GiftRedemption onRedemption={handleGiftRedemption} />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Gift;
