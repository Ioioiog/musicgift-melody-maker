
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

      // Create NETOPIA payment session
      const response = await fetch('/functions/v1/create-netopia-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          orderId: orderData.orderId,
          amount: orderData.totalPrice,
          currency: 'RON',
          customerEmail: orderData.email || orderData.recipientEmail,
          customerName: orderData.fullName || orderData.recipientName,
          description: `Order for ${orderData.package} package`
        })
      });

      const result = await response.json();

      if (result.success && result.paymentUrl) {
        // Redirect to NETOPIA payment page
        window.location.href = result.paymentUrl;
      } else {
        throw new Error(result.error || 'Failed to create payment session');
      }

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
