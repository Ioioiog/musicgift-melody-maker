
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import OrderWizard from "@/components/OrderWizard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

const Order = () => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleOrderComplete = async (orderData: any) => {
    try {
      console.log("Order completed:", orderData);
      
      // Here you can save the order to Supabase if needed
      // For now, we'll just show the success message
      
      toast({
        title: t('orderSent'),
        description: t('orderThankYou')
      });
    } catch (error) {
      console.error("Error saving order:", error);
      toast({
        title: t('orderError'),
        description: t('orderErrorMessage'),
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-purple text-white px-0 py-0">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">{t('placeOrder')}</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            {t('orderSubtitle')}
          </p>
        </div>
      </section>

      {/* Order Wizard Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <OrderWizard onComplete={handleOrderComplete} />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Order;
