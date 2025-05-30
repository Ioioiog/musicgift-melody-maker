import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import OrderWizard from "@/components/OrderWizard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
const Order = () => {
  const {
    toast
  } = useToast();
  const {
    t
  } = useLanguage();
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
  return <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      

      {/* Order Wizard Section */}
      <section className="py-1 bg-gray-80">
        <div className="container mx-auto px-4">
          <OrderWizard onComplete={handleOrderComplete} />
        </div>
      </section>

      <Footer />
    </div>;
};
export default Order;