
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import OrderWizard from "@/components/OrderWizard";
import GiftPurchaseWizard from "@/components/gift/GiftPurchaseWizard";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { usePackages, useAddons } from "@/hooks/usePackageData";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGiftCardByCode } from "@/hooks/useGiftCards";

const Order = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: packages = [] } = usePackages();
  const { data: addons = [] } = useAddons();
  const [searchParams] = useSearchParams();
  
  // Extract gift card parameters from URL
  const giftCardCode = searchParams.get('gift');
  const preselectedPackage = searchParams.get('package');
  
  // Fetch gift card data if code is provided
  const { data: giftCard, isLoading: isLoadingGift } = useGiftCardByCode(giftCardCode || '');

  // Check if the preselected package is the gift package
  const isGiftPackage = preselectedPackage === 'gift';

  useEffect(() => {
    if (giftCardCode && giftCard) {
      toast({
        title: "Gift Card Applied",
        description: `Gift card ${giftCardCode} is ready to be used for your order.`,
      });
    }
  }, [giftCardCode, giftCard, toast]);

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
      
      // Calculate gift card application
      let giftCreditApplied = 0;
      let finalPrice = totalPrice;
      
      if (giftCard) {
        const giftBalance = giftCard.gift_amount || 0;
        giftCreditApplied = Math.min(giftBalance, totalPrice * 100); // Convert to cents
        finalPrice = Math.max(0, (totalPrice * 100 - giftCreditApplied) / 100); // Convert back to currency units
      }

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
        payment_status: finalPrice > 0 ? 'pending' : 'completed',
        // Gift card fields
        gift_card_id: giftCard?.id || null,
        is_gift_redemption: !!giftCard,
        gift_credit_applied: giftCreditApplied,
        // Package detail columns
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

      // If gift card was used, create redemption record
      if (giftCard && giftCreditApplied > 0) {
        const { error: redemptionError } = await supabase
          .from('gift_redemptions')
          .insert({
            gift_card_id: giftCard.id,
            order_id: savedOrder.id,
            redeemed_amount: giftCreditApplied,
            remaining_balance: Math.max(0, (giftCard.gift_amount || 0) - giftCreditApplied)
          });

        if (redemptionError) {
          console.error("Error creating gift redemption:", redemptionError);
        } else {
          console.log("Gift card redemption created successfully");
        }
      }

      // Show success message
      toast({
        title: t('orderSuccess') || 'Comandă creată cu succes',
        description: t('orderSuccessMessage') || `Comanda ta a fost creată cu succes. ID: ${savedOrder.id.slice(0, 8)}...`,
        variant: "default"
      });

      // TODO: Redirect to payment if needed (when finalPrice > 0)
      if (finalPrice > 0) {
        console.log("Payment required:", finalPrice);
        // In the future, integrate with Netopia payment gateway for regular orders
      }

    } catch (error) {
      console.error("Error saving order:", error);
      toast({
        title: t('orderError') || 'Eroare',
        description: error.message || t('orderErrorMessage') || 'A apărut o eroare la salvarea comenzii',
        variant: "destructive"
      });
    }
  };

  const handleGiftCardComplete = (data: any) => {
    console.log("Gift card purchase completed:", data);
    // The GiftPurchaseWizard handles its own completion flow with payment redirection
    // No additional handling needed here
  };

  if (isLoadingGift && giftCardCode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gift card...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      backgroundImage: 'url(/lovable-uploads/65cd14fb-1e9c-4df4-a6e6-9e84a68b90f8.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* White glass overlay for glassmorphism effect */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="relative z-10">
        <Navigation />
        
        <section className="pt-16 sm:pt-20 md:pt-24 py-4 sm:py-6 md:py-8">
          <div className="container mx-auto px-2 sm:px-4">
            {isGiftPackage ? (
              <GiftPurchaseWizard onComplete={handleGiftCardComplete} />
            ) : (
              <OrderWizard 
                onComplete={handleOrderComplete} 
                giftCard={giftCard}
                preselectedPackage={preselectedPackage}
              />
            )}
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Order;
