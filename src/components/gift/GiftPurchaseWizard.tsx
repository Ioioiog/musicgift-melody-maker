import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Gift, CreditCard, Loader2, Image, X, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useGiftCardDesigns } from '@/hooks/useGiftCards';
import { useGiftCardPayment } from '@/hooks/useGiftCardPayment';
import { useGiftCardPaymentState } from '@/hooks/useGiftCardPaymentState';
import { useNavigate } from 'react-router-dom';
import GiftPaymentStatusChecker from './GiftPaymentStatusChecker';
import GiftCardPreview from './GiftCardPreview';
import PaymentProviderSelection from '@/components/order/PaymentProviderSelection';
interface GiftPurchaseWizardProps {
  onComplete?: (data: any) => void;
}
interface GiftCardFormData {
  sender_name: string;
  sender_email: string;
  recipient_name: string;
  recipient_email: string;
  gift_amount: number;
  message_text?: string;
  delivery_date?: Date | null;
}
const GiftPurchaseWizard = ({
  onComplete
}: GiftPurchaseWizardProps) => {
  const {
    t
  } = useLanguage();
  const {
    currency
  } = useCurrency();
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const {
    data: designs,
    isLoading: isLoadingDesigns
  } = useGiftCardDesigns();
  const initiatePayment = useGiftCardPayment();
  const {
    loadPendingGiftCards
  } = useGiftCardPaymentState();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<GiftCardFormData>({
    sender_name: user?.user_metadata?.full_name || '',
    sender_email: user?.email || '',
    recipient_name: '',
    recipient_email: '',
    gift_amount: 50,
    message_text: '',
    delivery_date: null
  });
  const [selectedDesign, setSelectedDesign] = useState<string>('');
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showStatusChecker, setShowStatusChecker] = useState(false);
  const [paymentGiftCardId, setPaymentGiftCardId] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Set default design when designs are loaded
  useEffect(() => {
    if (designs && designs.length > 0 && !selectedDesign) {
      setSelectedDesign(designs[0].id);
    }
  }, [designs, selectedDesign]);

  // Set default payment provider based on currency
  useEffect(() => {
    if (currency === 'RON' && !selectedPaymentProvider) {
      setSelectedPaymentProvider('smartbill');
    } else if (currency === 'EUR' && !selectedPaymentProvider) {
      setSelectedPaymentProvider('stripe');
    }
  }, [currency, selectedPaymentProvider]);

  // Single cleanup effect that runs only once when component mounts and user is available
  useEffect(() => {
    if (!user) return;
    let cleanupExecuted = false;
    const performCleanup = async () => {
      if (cleanupExecuted) return;
      cleanupExecuted = true;
      try {
        // Load pending cards - this will auto-cleanup old ones
        await loadPendingGiftCards();
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    };
    performCleanup();
  }, [user?.id]); // Only depend on user ID to avoid infinite loops

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleAmountChange = (amount: number) => {
    setFormData({
      ...formData,
      gift_amount: amount
    });
  };
  const handleDeliveryDateChange = (date: Date | undefined) => {
    setFormData({
      ...formData,
      delivery_date: date || null
    });
  };
  const handleDesignSelect = (designId: string) => {
    setSelectedDesign(designId);
  };
  const nextStep = () => {
    setStep(step + 1);
  };
  const prevStep = () => {
    setStep(step - 1);
  };

  // Listen for payment window events
  useEffect(() => {
    const handlePaymentWindowClosed = (event: CustomEvent) => {
      const {
        giftCardId
      } = event.detail;
      if (giftCardId) {
        setPaymentGiftCardId(giftCardId);
        setShowStatusChecker(true);
      }
    };
    window.addEventListener('paymentWindowClosed', handlePaymentWindowClosed as EventListener);
    return () => {
      window.removeEventListener('paymentWindowClosed', handlePaymentWindowClosed as EventListener);
    };
  }, []);
  const handlePayment = async (paymentProvider?: string) => {
    try {
      setIsProcessing(true);
      const selectedDesignObj = designs?.find(d => d.id === selectedDesign);
      const providerToUse = paymentProvider || selectedPaymentProvider;
      const giftCardData = {
        sender_user_id: user?.id,
        sender_name: formData.sender_name,
        sender_email: formData.sender_email,
        recipient_name: formData.recipient_name,
        recipient_email: formData.recipient_email,
        message_text: formData.message_text,
        currency: currency,
        gift_amount: formData.gift_amount,
        design_id: selectedDesignObj?.id,
        delivery_date: formData.delivery_date || null,
        status: 'active'
      };
      console.log('Creating gift card payment:', giftCardData, 'with provider:', providerToUse);
      const result = await initiatePayment.mutateAsync({
        giftCardData,
        paymentProvider: providerToUse
      });
      console.log('Payment initiated:', result);

      // Store the gift card ID and immediately show status checker
      if (result.giftCardId) {
        setPaymentGiftCardId(result.giftCardId);
        setShowStatusChecker(true);
      }
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  const handlePaymentConfirmed = () => {
    setShowStatusChecker(false);
    toast({
      title: "Gift Card Ready!",
      description: "Your gift card has been created and sent to the recipient."
    });

    // Redirect to payment success page with gift card details
    navigate(`/payment/success?type=gift&giftCardId=${paymentGiftCardId}`);
  };
  const renderAmountStep = () => <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-lg font-semibold text-white">{t('chooseGiftCardAmount')}</h4>
        <p className="text-sm text-white/70">{t('selectGiftCardValue')}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {currency === 'RON' ? 
          [299, 499, 799].map(amount => <Button key={amount} variant={formData.gift_amount === amount ? 'default' : 'outline'} onClick={() => handleAmountChange(amount)} className={cn(formData.gift_amount === amount ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-white/10 border-white/30 text-white hover:bg-white/20")}>
            {amount} {currency}
          </Button>) :
          [50, 100, 200].map(amount => <Button key={amount} variant={formData.gift_amount === amount ? 'default' : 'outline'} onClick={() => handleAmountChange(amount)} className={cn(formData.gift_amount === amount ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-white/10 border-white/30 text-white hover:bg-white/20")}>
            {amount} {currency}
          </Button>)
        }
      </div>

      <div className="space-y-2">
        <Label htmlFor="customAmount" className="text-white/90">{t('enterCustomValue')}</Label>
        <Input type="number" id="customAmount" placeholder={`${t('enterAmountIn')} ${currency}`} value={formData.gift_amount.toString()} onChange={e => handleAmountChange(Number(e.target.value))} className="bg-white/10 border-white/30 text-black placeholder:text-gray-500 focus:border-orange-400" />
      </div>

      <Button onClick={nextStep} className="bg-orange-500 hover:bg-orange-600 text-white w-full">
        {t('nextDetails')}
      </Button>
    </div>;
  const renderDetailsStep = () => <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-lg font-semibold text-white">{t('enterGiftDetails')}</h4>
        <p className="text-sm text-white/70">{t('tellUsWhoGiftFor')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sender_name" className="text-white/90">{t('yourName')}</Label>
          <Input type="text" id="sender_name" name="sender_name" placeholder={t('enterYourFullName')} value={formData.sender_name} onChange={handleInputChange} className="bg-white/10 border-white/30 text-black placeholder:text-gray-500 focus:border-orange-400" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sender_email" className="text-white/90">{t('yourEmail')}</Label>
          <Input type="email" id="sender_email" name="sender_email" placeholder="Enter your email" value={formData.sender_email} onChange={handleInputChange} className="bg-white/10 border-white/30 text-black placeholder:text-gray-500 focus:border-orange-400" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipient_name" className="text-white/90">{t('recipientName')}</Label>
          <Input type="text" id="recipient_name" name="recipient_name" placeholder={t('enterRecipientName')} value={formData.recipient_name} onChange={handleInputChange} className="bg-white/10 border-white/30 text-black placeholder:text-gray-500 focus:border-orange-400" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipient_email" className="text-white/90">{t('recipientEmail')}</Label>
          <Input type="email" id="recipient_email" name="recipient_email" placeholder="Enter recipient's email" value={formData.recipient_email} onChange={handleInputChange} className="bg-white/10 border-white/30 text-black placeholder:text-gray-500 focus:border-orange-400" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message_text" className="text-white/90">{t('personalMessage')}</Label>
        <Textarea id="message_text" name="message_text" placeholder={t('writeHeartfeltMessage')} value={formData.message_text} onChange={handleInputChange} className="bg-white/10 border-white/30 text-black placeholder:text-gray-500 focus:border-orange-400 resize-none" rows={3} />
      </div>

      <div className="space-y-2">
        <Label className="text-white/90">{t('deliveryDate')}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal bg-white/10 border-white/30 text-white hover:bg-white/20', !formData.delivery_date && 'text-white/50')}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.delivery_date ? format(formData.delivery_date, 'PPP') : <span>{t('chooseDeliveryDate')}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white/10 backdrop-blur-sm border-white/30" align="center" side="bottom">
            <Calendar mode="single" selected={formData.delivery_date} onSelect={handleDeliveryDateChange} disabled={date => date < new Date()} initialFocus className="bg-white/10 text-white" />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} className="bg-white/10 border-white/30 text-white hover:bg-white/20">
          {t('back')}
        </Button>
        <Button onClick={nextStep} className="bg-orange-500 hover:bg-orange-600 text-white">
          {t('nextDesign')}
        </Button>
      </div>
    </div>;
  const renderDesignStep = () => <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-lg font-semibold text-white">{t('selectDesign')}</h4>
        <p className="text-sm text-white/70">{t('chooseDesignPreview')}</p>
      </div>

      {isLoadingDesigns ? <div className="flex items-center justify-center text-white">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading designs...
        </div> : <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {designs?.map(design => <div key={design.id} className={cn("relative cursor-pointer rounded-lg border-2 p-2 transition-all hover:shadow-md", selectedDesign === design.id ? "border-orange-400 bg-orange-500/10" : "border-white/30 hover:border-orange-400/50 bg-white/5")} onClick={() => setSelectedDesign(design.id)}>
                <div className="aspect-[5/3] relative rounded-md overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500">
                  {design.preview_image_url ? <img src={design.preview_image_url} alt={design.name} className="w-full h-full object-cover" onError={e => {
              e.currentTarget.style.display = 'none';
            }} /> : <div className="w-full h-full flex items-center justify-center text-white">
                      <div className="text-center">
                        <Gift className="w-8 h-8 mx-auto mb-2" />
                        <span className="text-sm font-medium">{design.name}</span>
                      </div>
                    </div>}
                  
                  {selectedDesign === design.id && <div className="absolute inset-0 flex items-center justify-center bg-orange-500/20">
                      <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>}
                </div>
                
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium capitalize text-white">{design.name}</p>
                </div>
              </div>)}
          </div>

          {/* Dynamic Gift Card Preview */}
          {selectedDesign && <div className="space-y-4">
              <div className="border-t pt-6 border-white/20">
                <h5 className="text-md font-semibold mb-3 text-white">{t('giftCardPreviewTitle')}</h5>
                <p className="text-sm text-white/70 mb-4">
                  {t('howGiftCardWillLook')}
                </p>
                <div className="flex justify-center">
                  <GiftCardPreview design={designs?.find(d => d.id === selectedDesign)} formData={{
              sender_name: formData.sender_name,
              recipient_name: formData.recipient_name,
              message_text: formData.message_text
            }} amount={formData.gift_amount} currency={currency} deliveryDate={formData.delivery_date ? formData.delivery_date.toISOString() : undefined} />
                </div>
              </div>
            </div>}
        </>}

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(step - 1)} className="bg-white/10 border-white/30 text-white hover:bg-white/20">
          {t('back')}
        </Button>
        <Button onClick={() => setStep(step + 1)} disabled={!selectedDesign} className="bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50">
          {t('nextReview')}
        </Button>
      </div>
    </div>;
  const renderReviewStep = () => <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-lg font-semibold text-white">{t('reviewGiftCard')}</h4>
        <p className="text-sm text-white/70">{t('confirmDetailsBeforePayment')}</p>
      </div>

      <Alert className="border-orange-400/30 bg-orange-500">
        <AlertTriangle className="h-4 w-4 text-orange-400" />
        <AlertDescription className="text-white/90">
          <strong>{t('warningAfterConfirmation')}</strong>
        </AlertDescription>
      </Alert>

      {/* Visual Preview */}
      <div className="space-y-4">
        <h5 className="text-md font-semibold text-white">{t('finalGiftCardPreview')}</h5>
        <div className="flex justify-center">
          <GiftCardPreview design={designs?.find(d => d.id === selectedDesign)} formData={{
          sender_name: formData.sender_name,
          recipient_name: formData.recipient_name,
          message_text: formData.message_text
        }} amount={formData.gift_amount} currency={currency} deliveryDate={formData.delivery_date ? formData.delivery_date.toISOString() : undefined} />
        </div>
      </div>

      {/* Detailed Information */}
      <div className="space-y-4">
        <h5 className="text-md font-semibold text-white">{t('completeGiftCardDetails')}</h5>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 space-y-3 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h6 className="font-medium text-sm text-white/70 mb-2">{t('senderInformation')}</h6>
              <div className="space-y-1 text-white">
                <p><strong>{t('name')}</strong> {formData.sender_name}</p>
                <p><strong>{t('email')}</strong> {formData.sender_email}</p>
              </div>
            </div>
            
            <div>
              <h6 className="font-medium text-sm text-white/70 mb-2">{t('recipientInformation')}</h6>
              <div className="space-y-1 text-white">
                <p><strong>{t('name')}</strong> {formData.recipient_name}</p>
                <p><strong>{t('email')}</strong> {formData.recipient_email}</p>
              </div>
            </div>
          </div>

          <Separator className="bg-white/20" />

          <div>
            <h6 className="font-medium text-sm text-white/70 mb-2">{t('giftCardDetailsSection')}</h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 text-white">
                <p><strong>{t('value')}</strong> {formData.gift_amount} {currency}</p>
                <p><strong>{t('design')}</strong> {designs?.find(d => d.id === selectedDesign)?.name || 'Design selectat'}</p>
              </div>
              <div className="space-y-1 text-white">
                <p><strong>{t('deliveryDateLabel')}</strong> {formData.delivery_date ? format(formData.delivery_date, 'dd/MM/yyyy') : t('immediate')}</p>
                {formData.message_text && <p><strong>{t('personalMessage')}</strong> "{formData.message_text}"</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Provider Selection */}
      <div className="space-y-4">
        <h5 className="text-md font-semibold text-white">{t('choosePaymentMethod')}</h5>
        <PaymentProviderSelection selectedProvider={selectedPaymentProvider} onProviderSelect={setSelectedPaymentProvider} />
      </div>

      {/* Confirmation Checkbox */}
      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox id="confirm-details" checked={isConfirmed} onCheckedChange={checked => setIsConfirmed(checked === true)} className="border-white/30 focus:ring-orange-500 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500" />
          <div className="grid gap-1.5 leading-none">
            <label htmlFor="confirm-details" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-white">
              {t('confirmAllCorrect')}
            </label>
            <p className="text-xs text-white/60">
              {t('understandAfterConfirmation')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} className="bg-white/10 border-white/30 text-white hover:bg-white/20">
          {t('back')}
        </Button>
        <Button disabled={isProcessing || !isConfirmed || !selectedPaymentProvider} onClick={() => handlePayment()} className={cn("bg-orange-500 hover:bg-orange-600 text-white", (!isConfirmed || !selectedPaymentProvider) && "opacity-50 cursor-not-allowed")}>
          {isProcessing ? <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('processing')}
            </> : <>
              <CreditCard className="mr-2 h-4 w-4" />
              {t('pay')} - {formData.gift_amount} {currency}
            </>}
        </Button>
      </div>
    </div>;
  if (showStatusChecker && paymentGiftCardId) {
    return <div className="max-w-2xl mx-auto">
        <GiftPaymentStatusChecker giftCardId={paymentGiftCardId} onPaymentConfirmed={handlePaymentConfirmed} onManualCheck={() => {
        toast({
          title: "Status Checked",
          description: "Payment is still being processed. You'll be notified once it's complete."
        });
      }} />
      </div>;
  }
  return <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 rounded-lg p-6 border border-white/30">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">
            {t('step')} {step} {t('of')} 4 - {step === 1 ? t('stepAmount') : step === 2 ? t('stepDetails') : step === 3 ? t('stepDesign') : t('stepReview')}
          </h3>
          <Separator className="bg-white/20" />
        </div>
        
        {step === 1 && renderAmountStep()}
        {step === 2 && renderDetailsStep()}
        {step === 3 && renderDesignStep()}
        {step === 4 && renderReviewStep()}
      </div>
    </div>;
};
export default GiftPurchaseWizard;
