import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import OrderWizard from "@/components/OrderWizard";
import OrderHeroSection from "@/components/order/OrderHeroSection";
import OrderSidebarSummary from "@/components/order/OrderSidebarSummary";
import GiftPurchaseWizard from "@/components/gift/GiftPurchaseWizard";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { usePackages, useAddons } from "@/hooks/usePackageData";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGiftCardByCode } from "@/hooks/useGiftCards";
import { getPackagePrice, getAddonPrice } from "@/utils/pricing";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useIsMobile } from "@/hooks/use-mobile";

const Order = () => {
  const {
    toast
  } = useToast();
  const {
    t
  } = useLanguage();
  const {
    user
  } = useAuth();
  const {
    currency
  } = useCurrency();
  const navigate = useNavigate();
  const {
    data: packages = []
  } = usePackages();
  const {
    data: addons = []
  } = useAddons();
  const [searchParams] = useSearchParams();
  const [orderData, setOrderData] = useState<any>(null);
  const isMobile = useIsMobile();

  // Extract gift card parameters from URL
  const giftCardCode = searchParams.get('gift');
  const preselectedPackage = searchParams.get('package');

  // Fetch gift card data if code is provided
  const {
    data: giftCard,
    isLoading: isLoadingGift
  } = useGiftCardByCode(giftCardCode || '');

  // Check if the preselected package is the gift package
  const isGiftPackage = preselectedPackage === 'gift';
  useEffect(() => {
    if (giftCardCode && giftCard) {
      toast({
        title: t('giftCardApplied'),
        description: t('giftCardAppliedDesc', `Gift card ${giftCardCode} is ready to be used for your order.`)
      });
    }
  }, [giftCardCode, giftCard, toast, t]);
  const calculateTotalPrice = (packageValue: string, selectedAddons: string[]) => {
    const packageData = packages.find(pkg => pkg.value === packageValue);
    const packagePrice = packageData ? getPackagePrice(packageData, currency) : 0;
    const addonsPrice = selectedAddons.reduce((total, addonKey) => {
      const addon = addons.find(a => a.addon_key === addonKey);
      return total + (addon ? getAddonPrice(addon, currency) : 0);
    }, 0);
    return packagePrice + addonsPrice;
  };
  const handleOrderComplete = async (orderData: any) => {
    try {
      console.log("🔄 Processing order with selected payment provider:", orderData.paymentProvider);
      console.log("📦 Full order data:", orderData);

      // Find the selected package details
      const selectedPackage = packages.find(pkg => pkg.value === orderData.package);
      if (!selectedPackage) {
        throw new Error(`Package not found: ${orderData.package}`);
      }

      // Calculate total price
      const totalPrice = calculateTotalPrice(orderData.package, orderData.addons || []);

      // Calculate gift card application (keep in base monetary units)
      let giftCreditApplied = 0;
      let finalPrice = totalPrice;
      if (giftCard) {
        const giftBalance = (giftCard.gift_amount || 0) / 100; // Convert from cents to base units
        giftCreditApplied = Math.min(giftBalance, totalPrice);
        finalPrice = Math.max(0, totalPrice - giftCreditApplied);
      }

      // Get the selected payment provider
      const paymentProvider = orderData.paymentProvider || 'smartbill';
      console.log(`💳 Selected payment provider: ${paymentProvider}`);

      // Prepare base order payload (all prices in base monetary units)
      const baseOrderPayload = {
        form_data: {
          ...orderData,
          addons: orderData.addons || [],
          addonFieldValues: orderData.addonFieldValues || {}
        },
        selected_addons: orderData.addons || [],
        total_price: finalPrice,
        // Keep in base monetary units
        status: 'pending',
        payment_status: finalPrice > 0 ? 'pending' : 'completed',
        // Gift card fields (keep gift_credit_applied in cents for database consistency)
        gift_card_id: giftCard?.id || null,
        is_gift_redemption: !!giftCard,
        gift_credit_applied: giftCreditApplied * 100,
        // Convert to cents for database
        // Package detail columns
        package_value: selectedPackage.value,
        package_name: selectedPackage.label_key,
        package_price: getPackagePrice(selectedPackage, currency),
        package_delivery_time: selectedPackage.delivery_time_key,
        package_includes: selectedPackage.includes ? JSON.parse(JSON.stringify(selectedPackage.includes)) : [],
        currency: currency,
        user_id: user?.id || null,
        payment_provider: paymentProvider
      };
      let paymentResponse;
      let paymentError;

      // Route to the correct payment provider (no price conversion in frontend)
      if (paymentProvider === 'stripe') {
        console.log('🟣 Processing with Stripe');
        const {
          data,
          error
        } = await supabase.functions.invoke('stripe-create-payment', {
          body: {
            orderData: baseOrderPayload,
            // Stripe edge function will handle cents conversion
            returnUrl: `${window.location.origin}/payment/success`
          }
        });
        paymentResponse = data;
        paymentError = error;
      } else if (paymentProvider === 'revolut') {
        console.log('🟠 Processing with Revolut');
        const {
          data,
          error
        } = await supabase.functions.invoke('revolut-create-payment', {
          body: {
            orderData: baseOrderPayload,
            // Revolut edge function will handle cents conversion
            returnUrl: `${window.location.origin}/payment/success`
          }
        });
        paymentResponse = data;
        paymentError = error;
      } else if (paymentProvider === 'smartbill') {
        console.log('🔵 Processing with SmartBill');
        const {
          data,
          error
        } = await supabase.functions.invoke('smartbill-create-invoice', {
          body: {
            orderData: baseOrderPayload
          } // SmartBill uses base monetary units
        });
        paymentResponse = data;
        paymentError = error;
      } else {
        throw new Error(`Unsupported payment provider: ${paymentProvider}`);
      }

      // Handle payment provider errors
      if (paymentError) {
        console.error(`❌ ${paymentProvider.toUpperCase()} integration error:`, paymentError);
        throw new Error(`Failed to process order with ${paymentProvider.toUpperCase()}`);
      }
      console.log(`✅ ${paymentProvider.toUpperCase()} integration response:`, paymentResponse);

      // Check if payment provider operation failed
      if (!paymentResponse?.success) {
        const errorCode = paymentResponse?.errorCode || 'unknown';
        const errorMessage = paymentResponse?.message || paymentResponse?.error || 'Payment processing failed';
        console.error(`❌ ${paymentProvider.toUpperCase()} operation failed:`, errorCode, errorMessage);
        toast({
          title: t('orderError', 'Payment Error'),
          description: `${paymentProvider.toUpperCase()} payment failed: ${errorMessage}`,
          variant: "destructive"
        });

        // Navigate to payment error page
        navigate('/payment/error?orderId=' + paymentResponse?.orderId + '&error=' + errorCode);
        return;
      }

      // If gift card was used, create redemption record
      if (giftCard && giftCreditApplied > 0) {
        const {
          error: redemptionError
        } = await supabase.from('gift_redemptions').insert({
          gift_card_id: giftCard.id,
          order_id: paymentResponse.orderId,
          redeemed_amount: giftCreditApplied * 100,
          // Convert to cents for database
          remaining_balance: Math.max(0, (giftCard.gift_amount || 0) - giftCreditApplied * 100)
        });
        if (redemptionError) {
          console.error("Error creating gift redemption:", redemptionError);
        } else {
          console.log("Gift card redemption created successfully");
        }
      }

      // Show success message
      toast({
        title: t('orderSuccess'),
        description: t('orderSuccessMessage', `Your order has been created successfully. ID: ${paymentResponse.orderId?.slice(0, 8)}...`),
        variant: "default"
      });

      // Handle payment redirection based on provider
      if (paymentResponse?.paymentUrl && finalPrice > 0) {
        console.log(`🔗 Redirecting to ${paymentProvider.toUpperCase()} payment:`, paymentResponse.paymentUrl);
        window.location.href = paymentResponse.paymentUrl;
      } else {
        // If no payment needed or no payment URL, show completion
        console.log("✅ Order completed successfully - no payment required or direct completion");
        navigate('/payment/success?orderId=' + paymentResponse.orderId);
      }
    } catch (error) {
      console.error("💥 Error processing order:", error);
      toast({
        title: t('orderError'),
        description: error.message || t('orderErrorMessage'),
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
    return <div className="min-h-screen flex items-center justify-center" style={{
      backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">{t('loadingGiftCard')}</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen relative overflow-hidden" style={{
    backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}>
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10">
        <Navigation />
        
        <OrderHeroSection />
        
        <section className="py-2 sm:py-4 md:py-6 lg:py-8">
          <div className="container mx-auto px-2 sm:px-4 lg:px-6">
            {isGiftPackage ? <div className="max-w-4xl mx-auto">
                <GiftPurchaseWizard onComplete={handleGiftCardComplete} />
              </div> : <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6 lg:items-end">
                {/* Main content - Order Wizard */}
                <div className="flex-1 order-2 lg:order-1 my-0">
                  <OrderWizard onComplete={handleOrderComplete} giftCard={giftCard} preselectedPackage={preselectedPackage} onOrderDataChange={setOrderData} />
                </div>
                
                {/* Mobile Order Summary - Above wizard on mobile */}
                {isMobile && orderData?.selectedPackage && <div className="order-1 lg:hidden">
                    <OrderSidebarSummary orderData={orderData} giftCard={giftCard} />
                  </div>}
                
                {/* Desktop Sidebar - Order Summary */}
                <div className="hidden lg:block lg:w-80 xl:w-96 order-3 lg:order-2">
                  <OrderSidebarSummary orderData={orderData} giftCard={giftCard} />
                </div>
              </div>}
          </div>
        </section>

        <Footer />
      </div>
    </div>;
};

export default Order;
