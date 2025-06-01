
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import OrderWizard from "@/components/OrderWizard";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const Order = () => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleOrderComplete = async (orderData: any) => {
    try {
      console.log("Order completed:", orderData);

      // For demonstration purposes with sample data
      toast({
        title: t('orderSuccess') || 'Order Created',
        description: t('orderSuccessMessage') || 'Your order has been created successfully. This is using sample data for demonstration.',
        variant: "default"
      });

    } catch (error) {
      console.error("Error processing order:", error);
      toast({
        title: t('orderError') || 'Error',
        description: error.message || t('orderErrorMessage') || 'An error occurred',
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="pt-24 py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <OrderWizard onComplete={handleOrderComplete} />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Order;
