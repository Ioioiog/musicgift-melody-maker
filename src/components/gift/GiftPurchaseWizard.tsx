
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Gift, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateGiftCard, useGiftCardDesigns } from '@/hooks/useGiftCards';
import { useToast } from '@/hooks/use-toast';
import GiftCardPreview from './GiftCardPreview';
import PaymentProviderSelection from '@/components/order/PaymentProviderSelection';
import { useGiftCardPayment } from '@/hooks/useGiftCardPayment';

interface GiftPurchaseWizardProps {
  onComplete: (data: any) => void;
}

const PRESET_AMOUNTS = {
  RON: [100, 200, 300, 500, 1000],
  EUR: [25, 50, 75, 100, 200]
};

const GiftPurchaseWizard: React.FC<GiftPurchaseWizardProps> = ({ onComplete }) => {
  const { t } = useLanguage();
  const { currency } = useCurrency();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [selectedDesignId, setSelectedDesignId] = useState<string>('');
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<string>('');
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>();
  
  const [formData, setFormData] = useState({
    sender_name: user?.user_metadata?.full_name || '',
    sender_email: user?.email || '',
    recipient_name: '',
    recipient_email: '',
    message_text: ''
  });

  const { data: designs = [] } = useGiftCardDesigns();
  const createGiftCard = useCreateGiftCard();
  const giftCardPayment = useGiftCardPayment();

  // Check authentication status
  if (!user) {
    return (
      <Card className="bg-transparent border-transparent shadow-none">
        <CardContent className="p-6 text-center">
          <Gift className="w-12 h-12 mx-auto mb-4 text-purple-400" />
          <h3 className="text-lg font-semibold text-purple-600 mb-2">
            {t('pleaseSignInToPurchase')}
          </h3>
          <p className="text-purple-500 mb-4">
            You need to be signed in to purchase gift cards.
          </p>
          <Button 
            onClick={() => window.location.href = '/auth'} 
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
          >
            {t('signIn')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const steps = [
    { key: 'amount', title: t('stepAmount') },
    { key: 'details', title: t('stepDetails') },
    { key: 'design', title: t('stepDesign') },
    { key: 'payment', title: t('stepPayment') },
    { key: 'review', title: t('stepReview') }
  ];

  const getMinMaxAmount = () => {
    return currency === 'EUR' ? { min: 10, max: 500 } : { min: 50, max: 2000 };
  };

  const getFinalAmount = () => {
    if (isCustomAmount) {
      return parseInt(customAmount) || 0;
    }
    return selectedAmount || 0;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustomAmount(false);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setIsCustomAmount(true);
    setSelectedAmount(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Amount step
        const amount = getFinalAmount();
        const { min, max } = getMinMaxAmount();
        return amount >= min && amount <= max;
      case 1: // Details step
        return formData.sender_name && formData.sender_email && 
               formData.recipient_name && formData.recipient_email;
      case 2: // Design step
        return selectedDesignId || designs.length === 0;
      case 3: // Payment provider step
        return selectedPaymentProvider;
      case 4: // Review step
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a gift card.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Step 1: Create the gift card
      const giftCardData = {
        sender_user_id: user.id,
        sender_name: formData.sender_name,
        sender_email: formData.sender_email,
        recipient_name: formData.recipient_name,
        recipient_email: formData.recipient_email,
        message_text: formData.message_text || null,
        currency,
        gift_amount: getFinalAmount(),
        amount_ron: currency === 'RON' ? getFinalAmount() : null,
        amount_eur: currency === 'EUR' ? getFinalAmount() : null,
        design_id: selectedDesignId || null,
        delivery_date: deliveryDate ? deliveryDate.toISOString() : null,
        status: 'active',
        payment_status: 'pending',
        code: '' // This will be auto-generated by the database trigger
      };

      console.log('Creating gift card...');
      const giftCard = await createGiftCard.mutateAsync(giftCardData);
      console.log('Gift card created:', giftCard);

      // Step 2: Initiate payment with selected provider
      console.log('Initiating payment for gift card:', giftCard.id, 'with provider:', selectedPaymentProvider);
      const returnUrl = `${window.location.origin}/gift?payment=success`;
      
      await giftCardPayment.mutateAsync({
        giftCardId: giftCard.id,
        returnUrl,
        paymentProvider: selectedPaymentProvider
      });

      // The payment hook will automatically redirect to the payment URL
      // onComplete will be called when the user returns from successful payment

    } catch (error) {
      console.error('Error in gift card purchase flow:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process gift card purchase. Please try again.",
        variant: "destructive"
      });
    }
  };

  const selectedDesign = designs.find(d => d.id === selectedDesignId);

  const isProcessing = createGiftCard.isPending || giftCardPayment.isPending;

  return (
    <Card className="bg-transparent border-transparent shadow-none">
      <CardHeader className="px-3 py-2">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="flex items-center gap-2 text-lg text-purple-600">
            <Gift className="w-5 h-5" />
            {t('purchaseGiftCard')}
          </CardTitle>
          <div className="text-sm text-purple-500">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
        
        {/* Step Indicator */}
        <div className="flex items-center space-x-2 mb-4">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= currentStep 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-purple-100 text-purple-400'
              }`}>
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 ${
                  index < currentStep ? 'bg-purple-600' : 'bg-purple-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step 0: Amount Selection */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-purple-600 mb-2">
                    {t('chooseGiftCardAmount')}
                  </h3>
                  <p className="text-sm text-purple-500">
                    {t('selectPerfectValue')}
                  </p>
                </div>

                {/* Preset Amounts */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {PRESET_AMOUNTS[currency as keyof typeof PRESET_AMOUNTS]?.map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount && !isCustomAmount ? "default" : "outline"}
                      onClick={() => handleAmountSelect(amount)}
                      className={`h-16 text-lg font-semibold ${
                        selectedAmount === amount && !isCustomAmount
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'border-purple-200 text-purple-600 hover:bg-purple-50'
                      }`}
                    >
                      {amount} {currency}
                    </Button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-purple-600">
                    {t('customAmountLabel')}
                  </Label>
                  <Input
                    type="number"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    placeholder={`${t('enterAmountIn')} ${currency}`}
                    className={`${
                      isCustomAmount 
                        ? 'border-purple-600 bg-purple-50' 
                        : 'border-purple-200'
                    }`}
                  />
                  <div className="text-xs text-purple-500">
                    {t('amountMustBeBetween')} {getMinMaxAmount().min}-{getMinMaxAmount().max} {currency}
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-purple-600 mb-2">
                    {t('enterGiftDetails')}
                  </h3>
                  <p className="text-sm text-purple-500">
                    {t('tellUsWhoGiftFor')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-purple-600">
                      {t('yourName')}
                    </Label>
                    <Input
                      value={formData.sender_name}
                      onChange={(e) => handleInputChange('sender_name', e.target.value)}
                      placeholder={t('enterYourFullName')}
                      className="border-purple-200"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-purple-600">
                      {t('yourEmail')}
                    </Label>
                    <Input
                      type="email"
                      value={formData.sender_email}
                      onChange={(e) => handleInputChange('sender_email', e.target.value)}
                      placeholder="your@email.com"
                      className="border-purple-200"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-purple-600">
                      {t('recipientName')}
                    </Label>
                    <Input
                      value={formData.recipient_name}
                      onChange={(e) => handleInputChange('recipient_name', e.target.value)}
                      placeholder={t('enterRecipientName')}
                      className="border-purple-200"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-purple-600">
                      {t('recipientEmail')}
                    </Label>
                    <Input
                      type="email"
                      value={formData.recipient_email}
                      onChange={(e) => handleInputChange('recipient_email', e.target.value)}
                      placeholder="recipient@email.com"
                      className="border-purple-200"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-purple-600">
                    {t('personalMessage')}
                  </Label>
                  <Textarea
                    value={formData.message_text}
                    onChange={(e) => handleInputChange('message_text', e.target.value)}
                    placeholder={t('writeHeartfeltMessage')}
                    className="border-purple-200 min-h-[80px]"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-purple-600">
                    {t('deliveryDate')}
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-purple-200"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deliveryDate ? format(deliveryDate, "PPP") : t('chooseDeliveryDate')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={deliveryDate}
                        onSelect={setDeliveryDate}
                        initialFocus
                        disabled={{ before: new Date() }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}

            {/* Step 2: Design Selection */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-purple-600 mb-2">
                    {t('selectDesign')}
                  </h3>
                  <p className="text-sm text-purple-500">
                    {t('chooseDesignPreview')}
                  </p>
                </div>

                {designs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {designs.filter(design => design.is_active).map((design) => (
                      <div
                        key={design.id}
                        className={`cursor-pointer rounded-lg border-2 p-3 transition-colors ${
                          selectedDesignId === design.id
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-purple-200 hover:border-purple-300'
                        }`}
                        onClick={() => setSelectedDesignId(design.id)}
                      >
                        <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded mb-2 flex items-center justify-center">
                          {design.preview_image_url ? (
                            <img 
                              src={design.preview_image_url} 
                              alt={design.name}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <Gift className="w-8 h-8 text-purple-400" />
                          )}
                        </div>
                        <h4 className="font-medium text-purple-600">{design.name}</h4>
                        <p className="text-sm text-purple-500">{design.theme}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Gift className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                    <p className="text-purple-500">No designs available. Using default design.</p>
                  </div>
                )}

                {/* Live Preview */}
                <div className="mt-6">
                  <h4 className="font-medium text-purple-600 mb-3">{t('livePreview')}</h4>
                  <div className="flex justify-center">
                    <GiftCardPreview
                      design={selectedDesign}
                      formData={formData}
                      amount={getFinalAmount()}
                      currency={currency}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment Provider Selection */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-purple-600 mb-2">
                    {t('choosePaymentMethod')}
                  </h3>
                  <p className="text-sm text-purple-500">
                    {t('selectPaymentProvider')}
                  </p>
                </div>

                <PaymentProviderSelection
                  selectedProvider={selectedPaymentProvider}
                  onProviderSelect={setSelectedPaymentProvider}
                />
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-purple-600 mb-2">
                    {t('reviewGiftCard')}
                  </h3>
                  <p className="text-sm text-purple-500">
                    {t('confirmDetailsBeforePayment')}
                  </p>
                </div>

                {/* Summary */}
                <div className="bg-purple-50 rounded-lg p-4 space-y-3">
                  <h4 className="font-medium text-purple-600">{t('giftCardSummary')}</h4>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-purple-600">{t('amount')}:</div>
                    <div className="font-medium">{getFinalAmount()} {currency}</div>
                    
                    <div className="text-purple-600">{t('recipient')}:</div>
                    <div className="font-medium">{formData.recipient_name}</div>
                    
                    <div className="text-purple-600">{t('from')}:</div>
                    <div className="font-medium">{formData.sender_name}</div>
                    
                    {selectedDesign && (
                      <>
                        <div className="text-purple-600">{t('design')}:</div>
                        <div className="font-medium">{selectedDesign.name}</div>
                      </>
                    )}
                    
                    <div className="text-purple-600">{t('paymentMethod')}:</div>
                    <div className="font-medium">{selectedPaymentProvider}</div>
                    
                    {deliveryDate && (
                      <>
                        <div className="text-purple-600">{t('deliveryDateLabel')}:</div>
                        <div className="font-medium">{format(deliveryDate, "PPP")}</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Final Preview */}
                <div className="flex justify-center">
                  <GiftCardPreview
                    design={selectedDesign}
                    formData={formData}
                    amount={getFinalAmount()}
                    currency={currency}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-4 border-t border-purple-200">
          <Button
            onClick={handlePrev}
            disabled={currentStep === 0}
            variant="outline"
            className="border-purple-200 text-purple-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('back')}
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              {t('next')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isProcessing}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              {isProcessing ? t('processing') : `${t('pay')} ${getFinalAmount()} ${currency}`}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GiftPurchaseWizard;
