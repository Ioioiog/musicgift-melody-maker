import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import { addDays, format } from 'date-fns';
import GiftCardPreview from './GiftCardPreview';
import PaymentProviderSelection from '@/components/order/PaymentProviderSelection';
import { useToast } from '@/hooks/use-toast';
import { useGiftCardDesigns } from '@/hooks/useGiftCards';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface GiftPurchaseWizardProps {
  onComplete: (data: any) => void;
}

const GiftPurchaseWizard: React.FC<GiftPurchaseWizardProps> = ({
  onComplete
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: designs, isLoading: designsLoading } = useGiftCardDesigns();

  const [step, setStep] = useState(1);
  const [giftAmount, setGiftAmount] = useState(50);
  const [currency, setCurrency] = useState('RON');
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [giftData, setGiftData] = useState({
    sender_name: user?.user_metadata?.full_name || user?.email || '',
    sender_email: user?.email || '',
    recipient_name: '',
    recipient_email: '',
    message_text: '',
    delivery_date: undefined as Date | undefined
  });
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const amountOptions = [299, 499, 799, 999];

  // Get active designs only
  const activeDesigns = designs?.filter(design => design.is_active) || [];

  // Sync date with giftData.delivery_date
  useEffect(() => {
    setGiftData(prevData => ({
      ...prevData,
      delivery_date: date
    }));
  }, [date]);

  // Update giftData when user changes
  useEffect(() => {
    if (user) {
      setGiftData(prevData => ({
        ...prevData,
        sender_name: user.user_metadata?.full_name || user.email || '',
        sender_email: user.email || ''
      }));
    }
  }, [user]);

  // Auto-select first design when designs are loaded
  useEffect(() => {
    if (activeDesigns.length > 0 && !selectedDesign) {
      setSelectedDesign(activeDesigns[0]);
    }
  }, [activeDesigns, selectedDesign]);

  const nextStep = () => {
    setStep(step + 1);
  };
  const prevStep = () => {
    setStep(step - 1);
  };
  const handleAmountChange = (amount: number) => {
    setGiftAmount(amount);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGiftData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  const handleDesignSelect = (design: any) => {
    setSelectedDesign(design);
  };
  const handlePaymentProviderSelect = (provider: string) => {
    setSelectedPaymentProvider(provider);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: t('pleaseSignInToPurchase')
      });
      return;
    }
    if (!selectedPaymentProvider) {
      toast({
        title: 'Error',
        description: 'Please select a payment provider',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessingPayment(true);
    try {
      console.log('Initiating payment with gift card data:', {
        giftAmount,
        currency,
        giftData,
        selectedDesign: selectedDesign?.id
      });

      // Prepare gift card data for payment initiation
      const giftCardData = {
        sender_user_id: user.id,
        sender_name: giftData.sender_name,
        sender_email: giftData.sender_email,
        recipient_name: giftData.recipient_name,
        recipient_email: giftData.recipient_email,
        message_text: giftData.message_text || '',
        currency: currency,
        gift_amount: giftAmount,
        design_id: selectedDesign?.id || null,
        delivery_date: giftData.delivery_date?.toISOString() || null,
        status: 'active',
        payment_status: 'pending'
      };

      // Initiate payment with form data instead of pre-created gift card
      const functionName = selectedPaymentProvider === 'stripe' 
        ? 'gift-card-stripe-payment'
        : 'gift-card-smartbill-payment';
      
      const { data: paymentResponse, error } = await supabase.functions.invoke(functionName, {
        body: { 
          giftCardData,
          returnUrl: `${window.location.origin}/gift?payment=success`
        }
      });

      if (error) throw error;

      console.log('Payment initiated:', paymentResponse);

      // Open payment URL in new tab
      if (paymentResponse.paymentUrl || paymentResponse.url) {
        const paymentUrl = paymentResponse.paymentUrl || paymentResponse.url;
        window.open(paymentUrl, '_blank');
        toast({
          title: 'Payment Initiated',
          description: 'Please complete the payment in the new tab'
        });

        // Call onComplete with the form data (no gift card created yet)
        onComplete({
          amount: giftAmount,
          currency: currency,
          recipient_email: giftData.recipient_email,
          payment_initiated: true
        });
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to initiate payment. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="max-w-4xl mx-0 px-[22px]">
      {/* Step Indicator */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          {t('purchaseGiftCard')}
        </h2>
        <p className="text-sm text-gray-300">
          {t('stepXOfY').replace('{{current}}', step.toString()).replace('{{total}}', '5')}
        </p>
        <div className="flex items-center justify-between">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              style={{ width: `${(step / 5) * 100}%` }}
              className="h-2.5 rounded-full bg-orange-500"
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Area */}
        <div className="lg:col-span-2 px-0">
          {step === 1 && (
            <div className="px-0">
              <h3 className="text-lg font-semibold mb-4 text-white">{t('chooseGiftCardAmount')}</h3>
              <p className="text-sm text-gray-300 mb-4">{t('selectGiftCardValue')}</p>
              <div className="flex flex-wrap gap-4 mb-6">
                {amountOptions.map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    className={`rounded-full ${
                      giftAmount === amount
                        ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600'
                        : 'text-orange-500 border-white hover:bg-orange-500 hover:text-white hover:border-orange-500'
                    }`}
                    onClick={() => handleAmountChange(amount)}
                  >
                    {amount} {currency}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  className={`rounded-full ${
                    giftAmount === 0
                      ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600'
                      : 'text-orange-500 border-white hover:bg-orange-500 hover:text-white hover:border-orange-500'
                  }`}
                  onClick={() => setGiftAmount(0)}
                >
                  {t('customAmount')}
                </Button>
              </div>

              {giftAmount === 0 && (
                <div className="mb-6">
                  <Label htmlFor="customAmount" className="block text-sm font-medium text-white">
                    {t('enterCustomAmount')}
                  </Label>
                  <Input
                    type="number"
                    id="customAmount"
                    className="mt-1"
                    placeholder={`${t('enterAmountIn')} ${currency}`}
                    onChange={(e) => handleAmountChange(parseInt(e.target.value))}
                  />
                </div>
              )}

              <div className="flex justify-end px-0 mx-[39px]">
                <Button
                  onClick={nextStep}
                  className="bg-orange-500 text-white hover:bg-orange-600 border-orange-500"
                >
                  {t('nextDetails')}
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">{t('enterGiftDetails')}</h3>
              <p className="text-sm text-gray-300 mb-4">{t('tellUsWhoGiftFor')}</p>

              <div className="mb-4">
                <Label htmlFor="sender_name" className="block text-sm font-medium text-white">{t('yourName')}</Label>
                <Input type="text" id="sender_name" name="sender_name" className="mt-1" placeholder={t('enterYourFullName')} value={giftData.sender_name} onChange={handleInputChange} />
              </div>

              <div className="mb-4">
                <Label htmlFor="sender_email" className="block text-sm font-medium text-white">{t('yourEmail')}</Label>
                <Input type="email" id="sender_email" name="sender_email" className="mt-1" placeholder="you@example.com" value={giftData.sender_email} onChange={handleInputChange} />
              </div>

              <div className="mb-4">
                <Label htmlFor="recipient_name" className="block text-sm font-medium text-white">{t('recipientName')}</Label>
                <Input type="text" id="recipient_name" name="recipient_name" className="mt-1" placeholder={t('enterRecipientName')} value={giftData.recipient_name} onChange={handleInputChange} />
              </div>

              <div className="mb-4">
                <Label htmlFor="recipient_email" className="block text-sm font-medium text-white">{t('recipientEmail')}</Label>
                <Input type="email" id="recipient_email" name="recipient_email" className="mt-1" placeholder="recipient@example.com" value={giftData.recipient_email} onChange={handleInputChange} />
              </div>

              <div className="mb-4">
                <Label htmlFor="message_text" className="block text-sm font-medium text-white">{t('personalMessage')} (Optional)</Label>
                <Input id="message_text" name="message_text" className="mt-1" placeholder={t('writeHeartfeltMessage')} value={giftData.message_text} onChange={handleInputChange} />
              </div>

              <div className="mb-4">
                <Label className="block text-sm font-medium text-white">{t('deliveryDate')} (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>{t('pickDate')}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < addDays(new Date(), 0)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>{t('back')}</Button>
                <Button
                  onClick={nextStep}
                  className="bg-orange-500 text-white hover:bg-orange-600 border-orange-500"
                >
                  {t('nextDesign')}
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">{t('selectDesign')}</h3>
              <p className="text-sm text-gray-300 mb-4">{t('chooseDesignPreview')}</p>

              {designsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <Skeleton className="h-32 mb-2 rounded-md" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              ) : activeDesigns.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white mb-4">No gift card designs available at the moment.</p>
                  <p className="text-gray-300 text-sm">Please contact support or try again later.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeDesigns.map((design) => (
                    <div
                      key={design.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-blue-400 ${
                        selectedDesign?.id === design.id
                          ? 'border-blue-500 bg-blue-50/10'
                          : 'border-gray-300'
                      }`}
                      onClick={() => handleDesignSelect(design)}
                    >
                      {design.preview_image_url ? (
                        <img
                          src={design.preview_image_url}
                          alt={design.name}
                          className="w-full h-32 object-cover rounded-md mb-2"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md mb-2 flex items-center justify-center">
                          <span className="text-white font-semibold">{design.name}</span>
                        </div>
                      )}
                      <h4 className="text-sm font-semibold text-white">{design.name}</h4>
                      <p className="text-xs text-gray-300 mt-1">{design.theme}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={prevStep}>{t('back')}</Button>
                <Button
                  onClick={nextStep}
                  disabled={!selectedDesign}
                  className="bg-orange-500 text-white hover:bg-orange-600 border-orange-500 disabled:bg-gray-400 disabled:hover:bg-gray-400"
                >
                  {t('nextPayment', 'Next: Payment')}
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">{t('selectPaymentMethod', 'Select Payment Method')}</h3>
              <p className="text-sm text-gray-300 mb-4">{t('choosePaymentProvider', 'Choose how you\'d like to pay for your gift card')}</p>

              <PaymentProviderSelection
                selectedProvider={selectedPaymentProvider}
                onProviderSelect={handlePaymentProviderSelect}
              />

              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={prevStep}>{t('back')}</Button>
                <Button
                  onClick={nextStep}
                  disabled={!selectedPaymentProvider}
                  className="bg-orange-500 text-white hover:bg-orange-600 border-orange-500 disabled:bg-gray-400 disabled:hover:bg-gray-400"
                >
                  {t('nextReview')}
                </Button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">{t('reviewGiftCard')}</h3>
              <p className="text-sm text-gray-300 mb-4">{t('confirmDetailsBeforePayment')}</p>

              <div className="mb-4 space-y-2">
                <h4 className="text-sm font-semibold text-white">{t('giftCardSummary')}</h4>
                <p className="text-gray-300">{t('amount')}: {giftAmount} {currency}</p>
                <p className="text-gray-300">{t('design')}: {selectedDesign?.name || t('default')}</p>
                <p className="text-gray-300">{t('deliveryDateLabel')}: {giftData.delivery_date ? format(giftData.delivery_date, 'PPP') : t('immediate')}</p>
                <p className="text-gray-300">{t('paymentMethod', 'Payment Method')}: {selectedPaymentProvider}</p>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>{t('back')}</Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isProcessingPayment}
                  className="bg-orange-500 text-white hover:bg-orange-600 border-orange-500 disabled:bg-gray-400 disabled:hover:bg-gray-400"
                >
                  {isProcessingPayment ? 'Processing...' : t('pay')}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Preview Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="sticky top-4 space-y-4 p-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">{t('livePreview')}</h3>
                <GiftCardPreview
                  design={selectedDesign}
                  formData={giftData}
                  amount={giftAmount}
                  currency={currency}
                  deliveryDate={giftData.delivery_date?.toISOString()}
                />
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4">
                <h4 className="text-sm font-semibold text-white mb-2">{t('yourCardWillInclude')}</h4>
                <ul className="list-disc list-inside text-sm text-gray-300">
                  <li>{t('cardValue')}: {giftAmount} {currency}</li>
                  <li>{t('uniqueGiftCardCode')}</li>
                  <li>{t('recipient')}: {giftData.recipient_name}</li>
                  <li>{t('from')}: {giftData.sender_name}</li>
                  <li>{t('personalMessageIncluded')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftPurchaseWizard;
