
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

      toast({
        title: t('orderSent'),
        description: t('orderThankYou')
      });
    } catch (error) {
      console.error("Error processing order:", error);
      toast({
        title: t('orderError'),
        description: t('orderErrorMessage'),
        variant: "destructive"
      });
    }
  };

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen">
        <Navigation />
        
        <section className="py-8 bg-gray-80">
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
