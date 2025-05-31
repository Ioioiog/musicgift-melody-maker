
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import OrderWizard from "@/components/OrderWizard";
import AuthGuard from "@/components/AuthGuard";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const Order = () => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleOrderComplete = async (orderData: any) => {
    try {
      console.log("Order completed:", orderData);

      // TODO: Integrate with SmartBill payment system
      toast({
        title: t('orderSuccess') || 'Order Created',
        description: t('orderSuccessMessage') || 'Your order has been created successfully. Payment integration will be available soon.',
        variant: "default"
      });

    } catch (error) {
      console.error("Error processing order:", error);
      toast({
        title: t('orderError'),
        description: error.message || t('orderErrorMessage'),
        variant: "destructive"
      });
    }
  };

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen">
        <Navigation />
        
        <section className="pt-24 py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <OrderWizard onComplete={handleOrderComplete} />
          </div>
        </section>

        <Footer />
      </div>
    </AuthGuard>
  );
};

export default Order;
