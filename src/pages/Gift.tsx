
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
      <section className="pt-16 md:pt-20 lg:pt-24 pb-4 text-white relative overflow-hidden" style={{
        backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="absolute inset-0 bg-black/25"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div 
            className="flex justify-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            
          </motion.div>
          <motion.h2 
            className="text-xl md:text-2xl lg:text-3xl font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {t('shareGiftOfMusic')}
          </motion.h2>
          <motion.p 
            className="text-sm md:text-base lg:text-lg opacity-90 mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {t('givePersonalizedSong')} {t('createDigitalGiftCard')}
          </motion.p>
        </div>
      </section>

      {/* Main Content - Enhanced styling with more compact layout */}
      <section className="flex-1 flex items-center py-6 relative" style={{
        backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/35"></div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full relative z-10 px-4 py-4"
        >
          <div className="max-w-5xl mx-auto">
            {paymentStatus === 'success' ? (
              <div className="bg-gradient-to-br from-white/95 to-gray-50/90 rounded-2xl shadow-2xl border border-white/30 backdrop-blur-md p-6">
                <GiftPaymentSuccess />
              </div>
            ) : (
              <Tabs defaultValue="purchase" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/15 backdrop-blur-md border border-white/25 rounded-xl shadow-lg">
                  <TabsTrigger value="purchase" className="text-base py-3 px-4 data-[state=active]:bg-white/25 data-[state=active]:text-white data-[state=active]:shadow-md text-white/80 rounded-lg transition-all duration-300">
                    <GiftIcon className="w-4 h-4 mr-2" />
                    {t('buyGiftCard')}
                  </TabsTrigger>
                  <TabsTrigger value="redeem" className="text-base py-3 px-4 data-[state=active]:bg-white/25 data-[state=active]:text-white data-[state=active]:shadow-md text-white/80 rounded-lg transition-all duration-300">
                    <Heart className="w-4 h-4 mr-2" />
                    {t('redeemGiftCard')}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="purchase">
                  <div className="bg-gradient-to-br from-white/95 to-gray-50/90 rounded-2xl shadow-2xl border border-white/30 backdrop-blur-md overflow-hidden relative">
                    {/* Enhanced decorative elements with animation */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/15 rounded-full blur-2xl animate-pulse" />
                    <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-tr from-indigo-400/15 to-blue-400/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-gradient-to-br from-purple-300/10 to-pink-300/5 rounded-full blur-lg animate-pulse" style={{ animationDelay: '2s' }} />
                    
                    <div className="relative z-10 p-4">
                      {user ? (
                        <GiftPurchaseWizard onComplete={handleGiftPurchaseComplete} />
                      ) : (
                        <div className="text-center py-8">
                          <div className="mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
                              <GiftIcon className="w-8 h-8 text-purple-600" />
                            </div>
                          </div>
                          <p className="text-lg text-gray-700 mb-6 font-medium">
                            {t('pleaseSignInToPurchase')}
                          </p>
                          <a href="/auth" className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium">
                            {t('signIn')}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="redeem">
                  <div className="bg-gradient-to-br from-white/95 to-gray-50/90 rounded-2xl shadow-2xl border border-white/30 backdrop-blur-md overflow-hidden relative">
                    {/* Enhanced decorative elements with animation */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-400/15 rounded-full blur-2xl animate-pulse" />
                    <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-tr from-blue-400/15 to-cyan-400/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
                    
                    <div className="relative z-10 p-4">
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
