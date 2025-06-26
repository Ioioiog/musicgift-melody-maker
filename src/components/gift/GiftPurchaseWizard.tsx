import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Gift, CreditCard, Loader2, Image } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useGiftCardDesigns } from '@/hooks/useGiftCards';
import { useGiftCardPayment } from '@/hooks/useGiftCardPayment';
import { useGiftCardPaymentState } from '@/hooks/useGiftCardPaymentState';
import GiftPaymentStatusChecker from './GiftPaymentStatusChecker';

interface GiftPurchaseWizardProps {
  onComplete?: (data: any) => void;
}

interface GiftCardFormData {
  sender_name: string;
  sender_email: string;
  recipient_name: string;
  recipient_email: string;
  gift_amount: number;
  currency: string;
  message_text?: string;
  delivery_date?: Date | null;
}

const GiftPurchaseWizard = ({ onComplete }: GiftPurchaseWizardProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: designs, isLoading: isLoadingDesigns } = useGiftCardDesigns();
  const initiatePayment = useGiftCardPayment();
  const { findReusablePendingCard } = useGiftCardPaymentState();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<GiftCardFormData>({
    sender_name: user?.user_metadata?.full_name || '',
    sender_email: user?.email || '',
    recipient_name: '',
    recipient_email: '',
    gift_amount: 50,
    currency: 'RON',
    message_text: '',
    delivery_date: null,
  });
  const [selectedDesign, setSelectedDesign] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showStatusChecker, setShowStatusChecker] = useState(false);
  const [paymentGiftCardId, setPaymentGiftCardId] = useState<string | null>(null);

  // Set default design when designs are loaded
  useEffect(() => {
    if (designs && designs.length > 0 && !selectedDesign) {
      setSelectedDesign(designs[0].id);
    }
  }, [designs, selectedDesign]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAmountChange = (amount: number) => {
    setFormData({ ...formData, gift_amount: amount });
  };

  const handleCurrencyChange = (currency: string) => {
    setFormData({ ...formData, currency: currency });
  };

  const handleDeliveryDateChange = (date: Date | undefined) => {
    setFormData({ ...formData, delivery_date: date || null });
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
      const { giftCardId } = event.detail;
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

  const handlePayment = async (paymentProvider: string = 'smartbill') => {
    const reusableCard = findReusablePendingCard(formData.gift_amount, formData.currency);

    if (reusableCard) {
      toast({
        title: "Pending Gift Card Found",
        description: "You have a pending gift card with the same amount. Please complete the payment for that card or it will be cancelled.",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      const selectedDesignObj = designs?.find(d => d.id === selectedDesign);
      
      const giftCardData = {
        sender_user_id: user?.id,
        sender_name: formData.sender_name,
        sender_email: formData.sender_email,
        recipient_name: formData.recipient_name,
        recipient_email: formData.recipient_email,
        message_text: formData.message_text,
        currency: formData.currency,
        gift_amount: formData.gift_amount,
        design_id: selectedDesignObj?.id,
        delivery_date: formData.delivery_date || null,
        status: 'active'
      };

      console.log('Creating gift card payment:', giftCardData);
      
      const result = await initiatePayment.mutateAsync({
        giftCardData,
        paymentProvider
      });

      console.log('Payment initiated:', result);
      
      // Store the gift card ID for status checking
      if (result.giftCardId) {
        setPaymentGiftCardId(result.giftCardId);
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
      description: "Your gift card has been created and sent to the recipient.",
    });
    onComplete?.(paymentGiftCardId);
  };

  const renderAmountStep = () => (
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-lg font-semibold">{t('chooseGiftCardAmount')}</h4>
        <p className="text-sm text-muted-foreground">{t('selectGiftCardValue')}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[50, 100, 200].map((amount) => (
          <Button
            key={amount}
            variant={formData.gift_amount === amount ? 'default' : 'outline'}
            onClick={() => handleAmountChange(amount)}
          >
            {amount} RON
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="customAmount">{t('enterCustomValue')}</Label>
        <Input
          type="number"
          id="customAmount"
          placeholder={t('enterAmountIn') + ' RON'}
          value={formData.gift_amount.toString()}
          onChange={(e) => handleAmountChange(Number(e.target.value))}
        />
        {/* <p className="text-sm text-muted-foreground">{t('amountMustBeBetween')} 10 - 1000 RON</p> */}
      </div>

      <Button onClick={nextStep}>{t('nextDetails')}</Button>
    </CardContent>
  );

  const renderDetailsStep = () => (
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-lg font-semibold">{t('enterGiftDetails')}</h4>
        <p className="text-sm text-muted-foreground">{t('tellUsWhoGiftFor')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sender_name">{t('yourName')}</Label>
          <Input
            type="text"
            id="sender_name"
            name="sender_name"
            placeholder={t('enterYourFullName')}
            value={formData.sender_name}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sender_email">{t('yourEmail')}</Label>
          <Input
            type="email"
            id="sender_email"
            name="sender_email"
            placeholder="Enter your email"
            value={formData.sender_email}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipient_name">{t('recipientName')}</Label>
          <Input
            type="text"
            id="recipient_name"
            name="recipient_name"
            placeholder={t('enterRecipientName')}
            value={formData.recipient_name}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipient_email">{t('recipientEmail')}</Label>
          <Input
            type="email"
            id="recipient_email"
            name="recipient_email"
            placeholder="Enter recipient's email"
            value={formData.recipient_email}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message_text">{t('personalMessage')}</Label>
        <Textarea
          id="message_text"
          name="message_text"
          placeholder={t('writeHeartfeltMessage')}
          value={formData.message_text}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label>{t('deliveryDate')}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-[240px] justify-start text-left font-normal',
                !formData.delivery_date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.delivery_date ? (
                format(formData.delivery_date, 'PPP')
              ) : (
                <span>{t('chooseDeliveryDate')}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center" side="bottom">
            <Calendar
              mode="single"
              selected={formData.delivery_date}
              onSelect={handleDeliveryDateChange}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          {t('back')}
        </Button>
        <Button onClick={nextStep}>{t('nextDesign')}</Button>
      </div>
    </CardContent>
  );

  const renderDesignStep = () => (
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-lg font-semibold">{t('selectDesign')}</h4>
        <p className="text-sm text-muted-foreground">{t('chooseDesignPreview')}</p>
      </div>

      {isLoadingDesigns ? (
        <div className="flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading designs...
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {designs?.map((design) => (
            <div
              key={design.id}
              className={cn(
                "relative cursor-pointer rounded-lg border-2 p-2 transition-all hover:shadow-md",
                selectedDesign === design.id
                  ? "border-primary bg-primary/10"
                  : "border-muted hover:border-primary/50"
              )}
              onClick={() => handleDesignSelect(design.id)}
            >
              <div className="aspect-[5/3] relative rounded-md overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500">
                {design.preview_image_url ? (
                  <img
                    src={design.preview_image_url}
                    alt={design.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to gradient background if image fails to load
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <div className="text-center">
                      <Gift className="w-8 h-8 mx-auto mb-2" />
                      <span className="text-sm font-medium">{design.name}</span>
                    </div>
                  </div>
                )}
                
                {selectedDesign === design.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-2 text-center">
                <p className="text-sm font-medium capitalize">{design.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          {t('back')}
        </Button>
        <Button onClick={nextStep} disabled={!selectedDesign}>
          {t('nextReview')}
        </Button>
      </div>
    </CardContent>
  );

  const renderReviewStep = () => (
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-lg font-semibold">{t('reviewGiftCard')}</h4>
        <p className="text-sm text-muted-foreground">{t('confirmDetailsBeforePayment')}</p>
      </div>

      <div className="space-y-2">
        <h5 className="text-md font-semibold">{t('giftCardSummary')}</h5>
        <p>
          <strong>{t('amount')}:</strong> {formData.gift_amount} {formData.currency}
        </p>
        <p>
          <strong>{t('design')}:</strong> {designs?.find(d => d.id === selectedDesign)?.name}
        </p>
        <p>
          <strong>{t('deliveryDateLabel')}:</strong> {formData.delivery_date ? format(formData.delivery_date, 'PPP') : t('immediate')}
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          {t('back')}
        </Button>
        <Button disabled={isProcessing} onClick={() => handlePayment('smartbill')}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('processing')}
            </>
          ) : (
            t('pay')
          )}
        </Button>
      </div>
    </CardContent>
  );

  if (showStatusChecker && paymentGiftCardId) {
    return (
      <div className="max-w-2xl mx-auto">
        <GiftPaymentStatusChecker
          giftCardId={paymentGiftCardId}
          onPaymentConfirmed={handlePaymentConfirmed}
          onManualCheck={() => {
            toast({
              title: "Status Checked",
              description: "Payment is still being processed. You'll be notified once it's complete.",
            });
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            Step {step} of 4: {step === 1 ? t('stepAmount') : step === 2 ? t('stepDetails') : step === 3 ? t('stepDesign') : t('stepReview')}
          </CardTitle>
        </CardHeader>
        {step === 1 && renderAmountStep()}
        {step === 2 && renderDetailsStep()}
        {step === 3 && renderDesignStep()}
        {step === 4 && renderReviewStep()}
      </Card>
    </div>
  );
};

export default GiftPurchaseWizard;
