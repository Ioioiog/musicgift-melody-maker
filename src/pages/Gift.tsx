
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
      title: "Gift Card Created!",
      description: `Gift card ${data.code} has been created and will be delivered to ${data.recipient_email}`
    });
  };

  const handleGiftRedemption = (giftCard: any, selectedPackage: string, upgradeAmount?: number) => {
    console.log("Gift redemption:", { giftCard, selectedPackage, upgradeAmount });

    // Here we would redirect to the order flow with the gift card applied
    // For now, we'll show a success message
    toast({
      title: "Gift Card Applied!",
      description: `Proceeding to complete your ${selectedPackage} package order.`
    });

    // TODO: Redirect to order flow with gift card data
    // window.location.href = `/order?gift=${giftCard.code}&package=${selectedPackage}`;
  };

  const backgroundStyle = {
    backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={backgroundStyle}>
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10">
        <Navigation />
        
        <section className="pt-16 sm:pt-20 md:pt-24 py-8 sm:py-12">
          <div className="container mx-auto px-4">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                  <GiftIcon className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Share the Gift of Music
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Give someone special a personalized song they'll treasure forever. 
                Create a digital gift card and let them choose their perfect musical experience.
              </p>
            </div>

            {/* Features Cards */}
            

            {/* Main Content */}
            <div className="max-w-4xl mx-auto">
              {paymentStatus === 'success' ? (
                <GiftPaymentSuccess />
              ) : (
                <Tabs defaultValue="purchase" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="purchase" className="text-lg py-3">
                      <GiftIcon className="w-5 h-5 mr-2" />
                      Buy Gift Card
                    </TabsTrigger>
                    <TabsTrigger value="redeem" className="text-lg py-3">
                      <Heart className="w-5 h-5 mr-2" />
                      Redeem Gift Card
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="purchase">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6">
                      {user ? (
                        <GiftPurchaseWizard onComplete={handleGiftPurchaseComplete} />
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-lg text-gray-600 mb-6">
                            Please sign in to purchase a gift card
                          </p>
                          <a href="/auth" className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                            Sign In
                          </a>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="redeem">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6">
                      <GiftRedemption onRedemption={handleGiftRedemption} />
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Gift;
