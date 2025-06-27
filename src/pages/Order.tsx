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
import { FileMetadata } from "@/types/order";

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
  const [appliedGiftCard, setAppliedGiftCard] = useState<any>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    amount: number;
    type: string;
  } | null>(null);
  const [paymentResponse, setPaymentResponse] = useState<any>(null);
  const isMobile = useIsMobile();

  // Extract gift card parameters from URL
  const giftCardCode = searchParams.get('gift');
  const preselectedPackage = searchParams.get('package');

  // Fetch gift card data if code is provided
  const {
    data: urlGiftCard,
    isLoading: isLoadingGift
  } = useGiftCardByCode(giftCardCode || '');

  // Check if the preselected package is the gift package
  const isGiftPackage = preselectedPackage === 'gift';

  useEffect(() => {
    // First check for sessionStorage redemption data
    const redemptionData = sessionStorage.getItem('giftCardRedemption');
    
    if (redemptionData) {
      try {
        const parsedRedemption = JSON.parse(redemptionData);
        console.log('Found gift card redemption data in sessionStorage:', parsedRedemption);
        
        // Create a gift card object from the redemption data
        const giftCardFromRedemption = {
          id: parsedRedemption.giftCardId,
          code: parsedRedemption.giftCardCode,
          gift_amount: parsedRedemption.giftCardValue * 100, // Convert to cents for consistency
          remaining_balance: parsedRedemption.giftCardValue,
          currency: parsedRedemption.currency,
          status: 'active'
        };
        
        setAppliedGiftCard(giftCardFromRedemption);
        
        toast({
          title: t('giftCardApplied'),
          description: `Gift card ${parsedRedemption.giftCardCode} applied with ${parsedRedemption.redeemAmount} ${parsedRedemption.currency} credit`
        });
        
        // Clear the sessionStorage after applying
        sessionStorage.removeItem('giftCardRedemption');
        
      } catch (error) {
        console.error('Error parsing gift card redemption data:', error);
        sessionStorage.removeItem('giftCardRedemption'); // Clear corrupted data
      }
    }
    // Fallback to URL-based gift card loading
    else if (giftCardCode && urlGiftCard) {
      setAppliedGiftCard(urlGiftCard);
      toast({
        title: t('giftCardApplied'),
        description: t('giftCardAppliedDesc', `Gift card ${giftCardCode} is ready to be used for your order.`)
      });
    }
  }, [giftCardCode, urlGiftCard, toast, t]);

  // Calculate total price
  const calculateTotalPrice = (packageValue: string, selectedAddons: string[]) => {
    const packageData = packages.find(pkg => pkg.value === packageValue);
    const packagePrice = packageData ? getPackagePrice(packageData, currency) : 0;
    const addonsPrice = selectedAddons.reduce((total, addonKey) => {
      const addon = addons.find(a => a.addon_key === addonKey);
      return total + (addon ? getAddonPrice(addon, currency) : 0);
    }, 0);
    return packagePrice + addonsPrice;
  };

  // Extract file metadata from addonFieldValues
  const extractFileData = (addonFieldValues: Record<string, any>) => {
    const fileData: Record<string, any> = {};

    // Go through all addon field values
    Object.entries(addonFieldValues).forEach(([key, value]) => {
      // Check if the value has a url property (single file/audio)
      if (value && typeof value === 'object' && 'url' in value) {
        fileData[key] = value;
      }
      // Check if it's an array of file objects
      else if (Array.isArray(value) && value.length > 0 && 'url' in value[0]) {
        fileData[key] = value;
      }
    });
    return fileData;
  };

  // Associate uploaded files with the order after creation
  const associateFilesWithOrder = async (orderId: string, addonFieldValues: Record<string, any>) => {
    const fileData = extractFileData(addonFieldValues);

    // Skip if no files to associate
    if (Object.keys(fileData).length === 0) {
      return;
    }
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('associate-files-with-order', {
        body: {
          orderId,
          fileData
        }
      });
      if (error) {
        console.error('Error associating files with order:', error);
      } else {
        console.log(`✅ Files associated with order:`, data);
      }
    } catch (error) {
      console.error('Error invoking associate-files function:', error);
    }
  };

  // Function to send order notification email
  const sendOrderNotificationEmail = async (orderData: any, orderId: string, totalPrice: number) => {
    try {
      const selectedPackage = packages.find(pkg => pkg.value === orderData.package);
      const selectedAddonsList = orderData.addons?.map((addonKey: string) => {
        const addon = addons.find(a => a.addon_key === addonKey);
        return addon ? addon.addon_key : addonKey;
      }) || [];
      const emailSubject = `New Order Received - ${orderId.slice(0, 8)}`;
      const emailMessage = `
New Order Notification:

Order ID: ${orderId}
Customer: ${orderData.fullName || 'N/A'}
Email: ${orderData.email || 'N/A'}
Phone: ${orderData.phone || 'Not provided'}

Package: ${selectedPackage?.label_key || orderData.package}
Selected Add-ons: ${selectedAddonsList.length > 0 ? selectedAddonsList.join(', ') : 'None'}
Total Price: ${totalPrice} ${currency}
Payment Provider: ${orderData.paymentProvider || 'N/A'}

${appliedGiftCard ? `Gift Card Applied: ${appliedGiftCard.code} (${(appliedGiftCard.gift_amount || 0) / 100} ${currency})` : ''}
${appliedDiscount ? `Discount Applied: ${appliedDiscount.code} (${appliedDiscount.amount} ${currency})` : ''}

Customer Details:
${orderData.invoiceType === 'company' ? `Company: ${orderData.companyName || 'N/A'}` : 'Individual'}
${orderData.address ? `Address: ${orderData.address}` : ''}
${orderData.city ? `City: ${orderData.city}` : ''}

---
This order was submitted through the MusicGift website.
Order Management: View full details in the admin panel.
      `.trim();
      await supabase.functions.invoke('send-contact-email', {
        body: {
          firstName: 'Order',
          lastName: 'Notification',
          email: 'system@musicgift.ro',
          subject: emailSubject,
          message: emailMessage
        }
      });
      console.log('Order notification email sent successfully');
    } catch (error) {
      console.error('Failed to send order notification email:', error);
      // Don't throw - this shouldn't block the order process
    }
  };

  // Handle order completion
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
      if (appliedGiftCard) {
        const giftBalance = (appliedGiftCard.gift_amount || 0) / 100; // Convert from cents to base units
        giftCreditApplied = Math.min(giftBalance, totalPrice);
        finalPrice = Math.max(0, totalPrice - giftCreditApplied);
      }

      // Apply discount
      let discountApplied = 0;
      if (appliedDiscount) {
        discountApplied = Math.min(appliedDiscount.amount, finalPrice);
        finalPrice = Math.max(0, finalPrice - discountApplied);
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
        status: 'pending',
        payment_status: finalPrice > 0 ? 'pending' : 'completed',
        // Gift card fields (keep gift_credit_applied in cents for database consistency)
        gift_card_id: appliedGiftCard?.id || null,
        is_gift_redemption: !!appliedGiftCard,
        gift_credit_applied: giftCreditApplied * 100,
        // Convert to cents for database
        // Discount fields
        discount_code: appliedDiscount?.code || null,
        discount_amount: discountApplied * 100,
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

      // Handle zero-total orders (fully covered by gift card/discount)
      if (paymentProvider === 'gift_card' || finalPrice === 0) {
        console.log("🔄 Processing zero-total order (fully covered by gift card/discount)");
        
        // Create order directly with completed payment status
        const { data: orderResponse, error: orderError } = await supabase
          .from('orders')
          .insert({
            ...baseOrderPayload,
            payment_status: 'completed',
            status: 'completed'
          })
          .select()
          .single();

        if (orderError) {
          console.error('❌ Zero-total order creation error:', orderError);
          throw new Error(`Failed to create zero-total order: ${orderError.message}`);
        }

        console.log('✅ Zero-total order created successfully:', orderResponse.id);

        // Associate files with the created order
        await associateFilesWithOrder(orderResponse.id, orderData.addonFieldValues || {});

        // Send order notification email
        await sendOrderNotificationEmail(orderData, orderResponse.id, finalPrice);

        // Create gift card redemption record AFTER successful order creation
        if (appliedGiftCard && giftCreditApplied > 0) {
          const remainingBalance = Math.max(0, (appliedGiftCard.gift_amount || 0) - giftCreditApplied * 100);
          
          const { error: redemptionError } = await supabase
            .from('gift_redemptions')
            .insert({
              gift_card_id: appliedGiftCard.id,
              order_id: orderResponse.id,
              redeemed_amount: giftCreditApplied * 100,
              remaining_balance: remainingBalance
            });

          if (redemptionError) {
            console.error("Error creating gift redemption:", redemptionError);
          } else {
            console.log("Gift card redemption created successfully");
            
            // Update gift card status based on remaining balance
            let newStatus = 'active';
            if (remainingBalance === 0) {
              newStatus = 'fully_redeemed';
            } else if (remainingBalance > 0) {
              newStatus = 'partially_redeemed';
            }

            await supabase
              .from('gift_cards')
              .update({ 
                status: newStatus,
                updated_at: new Date().toISOString()
              })
              .eq('id', appliedGiftCard.id);
          }
        }

        // Show success message
        toast({
          title: t('orderSuccess'),
          description: t('orderSuccessMessage', `Your order has been created successfully. ID: ${orderResponse.id?.slice(0, 8)}...`),
          variant: "default"
        });

        // Navigate to success page
        navigate('/payment/success?orderId=' + orderResponse.id);
        return;
      }

      let paymentResponse;
      let paymentError;

      // Route to the correct payment provider (no price conversion in frontend)
      if (paymentProvider === 'stripe') {
        console.log('🟣 Creating Stripe payment session');
        const { data, error } = await supabase.functions.invoke('stripe-create-payment', {
          body: {
            orderData: baseOrderPayload,
            returnUrl: `${window.location.origin}/payment/success`
          }
        });
        paymentResponse = data;
        paymentError = error;
      } else if (paymentProvider === 'revolut') {
        console.log('🟠 Creating Revolut payment session');
        const { data, error } = await supabase.functions.invoke('revolut-create-payment', {
          body: {
            orderData: baseOrderPayload,
            returnUrl: `${window.location.origin}/payment/success`
          }
        });
        paymentResponse = data;
        paymentError = error;
      } else if (paymentProvider === 'smartbill') {
        console.log('🔵 Creating SmartBill payment session');
        const { data, error } = await supabase.functions.invoke('smartbill-create-invoice', {
          body: {
            orderData: baseOrderPayload
          }
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
        navigate('/payment/error?orderId=' + paymentResponse?.orderId + '&error=' + errorCode);
        return;
      }

      // Associate files with the created order
      await associateFilesWithOrder(paymentResponse.orderId, orderData.addonFieldValues || {});

      // Send order notification email to info@musicgift.ro
      await sendOrderNotificationEmail(orderData, paymentResponse.orderId, finalPrice);

      // Show success message
      toast({
        title: t('orderSuccess'),
        description: t('orderSuccessMessage', `Your order has been created successfully. ID: ${paymentResponse.orderId?.slice(0, 8)}...`),
        variant: "default"
      });

      // Pass payment response to OrderWizard to handle URL opening
      setPaymentResponse({
        ...paymentResponse,
        provider: paymentProvider
      });
      
      console.log("✅ Order creation completed - payment URL will be opened by OrderWizard");
      
    } catch (error) {
      console.error("💥 Error processing order:", error);
      toast({
        title: t('orderError'),
        description: error.message || t('orderErrorMessage'),
        variant: "destructive"
      });
    }
  };

  // Handle gift card purchase completion
  const handleGiftCardComplete = (data: any) => {
    console.log("Gift card purchase completed:", data);
  };

  // Loading state
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
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10">
        <Navigation />
        
        <OrderHeroSection />
        
        <section className="py-2 sm:py-4 md:py-6 lg:py-8 px-[16px]">
          <div className="container mx-auto px-2 sm:px-4 lg:px-6">
            {isGiftPackage ? (
              <div className="max-w-4xl mx-auto">
                <GiftPurchaseWizard onComplete={handleGiftCardComplete} />
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6 lg:items-end">
                {/* Main content - Order Wizard */}
                <div className="flex-1 order-2 lg:order-1 my-0">
                  <OrderWizard 
                    onComplete={handleOrderComplete} 
                    giftCard={appliedGiftCard}
                    appliedDiscount={appliedDiscount}
                    preselectedPackage={preselectedPackage} 
                    onOrderDataChange={setOrderData}
                    paymentResponse={paymentResponse}
                    onPaymentResponseHandled={() => setPaymentResponse(null)}
                  />
                </div>
                
                {/* Mobile Order Summary - Above wizard on mobile */}
                {isMobile && orderData?.selectedPackage && (
                  <div className="order-1 lg:hidden">
                    <OrderSidebarSummary 
                      orderData={orderData} 
                      giftCard={appliedGiftCard} 
                      onGiftCardChange={setAppliedGiftCard} 
                      onDiscountChange={setAppliedDiscount} 
                    />
                  </div>
                )}
                
                {/* Desktop Sidebar - Order Summary */}
                <div className="hidden lg:block lg:w-80 xl:w-96 order-3 lg:order-2">
                  <OrderSidebarSummary 
                    orderData={orderData} 
                    giftCard={appliedGiftCard} 
                    onGiftCardChange={setAppliedGiftCard} 
                    onDiscountChange={setAppliedDiscount} 
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </div>;
};

export default Order;
