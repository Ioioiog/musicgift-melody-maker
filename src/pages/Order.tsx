
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import OrderWizard from "@/components/OrderWizard";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { usePackages, useAddons } from "@/hooks/usePackageData";

const Order = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { data: packages = [] } = usePackages();
  const { data: addons = [] } = useAddons();

  const calculateTotalPrice = (packageValue: string, selectedAddons: string[]) => {
    const packagePrice = packages.find(pkg => pkg.value === packageValue)?.price || 0;
    const addonsPrice = selectedAddons.reduce((total, addonKey) => {
      const addon = addons.find(a => a.addon_key === addonKey);
      return total + (addon?.price || 0);
    }, 0);
    return packagePrice + addonsPrice;
  };

  const handleOrderComplete = async (orderData: any) => {
    try {
      console.log("Processing order:", orderData);

      // Find the selected package details
      const selectedPackage = packages.find(pkg => pkg.value === orderData.package);
      if (!selectedPackage) {
        throw new Error(`Package not found: ${orderData.package}`);
      }

      // Calculate total price
      const totalPrice = calculateTotalPrice(orderData.package, orderData.addons || []);

      // Prepare order data for database with package details
      const orderPayload = {
        user_id: user?.id || null,
        form_data: {
          ...orderData,
          addons: orderData.addons || [],
          addonFieldValues: orderData.addonFieldValues || {},
        },
        selected_addons: orderData.addons || [],
        total_price: totalPrice,
        status: 'pending',
        payment_status: 'pending',
        // New package detail columns
        package_value: selectedPackage.value,
        package_name: selectedPackage.label_key,
        package_price: selectedPackage.price,
        package_delivery_time: selectedPackage.delivery_time_key,
        package_includes: selectedPackage.includes ? JSON.parse(JSON.stringify(selectedPackage.includes)) : []
      };

      console.log("Saving order to database:", orderPayload);

      // Save order to Supabase
      const { data: savedOrder, error } = await supabase
        .from('orders')
        .insert(orderPayload)
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log("Order saved successfully:", savedOrder);

      // Show success message
      toast({
        title: t('orderSuccess') || 'Comandă creată cu succes',
        description: t('orderSuccessMessage') || `Comanda ta a fost creată cu succes. ID: ${savedOrder.id.slice(0, 8)}...`,
        variant: "default"
      });

      // TODO: Redirect to payment if needed
      // For now, we'll just show the success message
      // In the future, integrate with Netopia payment gateway

    } catch (error) {
      console.error("Error saving order:", error);
      toast({
        title: t('orderError') || 'Eroare',
        description: error.message || t('orderErrorMessage') || 'A apărut o eroare la salvarea comenzii',
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="pt-16 sm:pt-20 md:pt-24 py-4 sm:py-6 md:py-8 bg-gray-50">
        <div className="container mx-auto px-2 sm:px-4">
          <OrderWizard onComplete={handleOrderComplete} />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Order;
