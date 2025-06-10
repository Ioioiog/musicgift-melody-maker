import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Gift, CheckCircle, ArrowRight, ArrowLeft, Star, Sparkles } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useCreateGiftCard, useGiftCardDesigns } from "@/hooks/useGiftCards";
import { useGiftCardPayment } from '@/hooks/useGiftCardPayment';
import GiftCardPreview from './GiftCardPreview';
import { motion, AnimatePresence } from 'framer-motion';
import StepIndicator from '@/components/order/StepIndicator';
import WizardNavigation from '@/components/order/WizardNavigation';

interface GiftPurchaseWizardProps {
  onComplete: (data: any) => void;
}

// Currency-specific amount options
const AmountOptionsRON = [299, 500, 7999];
const AmountOptionsEUR = [59, 99, 1599];

const GiftPurchaseWizard: React.FC<GiftPurchaseWizardProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAmountType, setSelectedAmountType] = useState<'preset' | 'custom'>('preset');
  const [selectedAmount, setSelectedAmount] = useState<number>(299);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedDesign, setSelectedDesign] = useState('');
  const [formData, setFormData] = useState({
    sender_name: '',
    sender_email: '',
    recipient_name: '',
    recipient_email: '',
    message_text: '',
    delivery_date: undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { currency } = useCurrency();
  const { mutateAsync: createGiftCard } = useCreateGiftCard();
  const { data: designs = [] } = useGiftCardDesigns();
  const { mutate: processPayment, isPending: isProcessingPayment } = useGiftCardPayment();

  const steps = [
    { number: 1, label: 'Amount', isCompleted: currentStep > 0, isCurrent: currentStep === 0 },
    { number: 2, label: 'Details', isCompleted: currentStep > 1, isCurrent: currentStep === 1 },
    { number: 3, label: 'Design', isCompleted: currentStep > 2, isCurrent: currentStep === 2 },
    { number: 4, label: 'Review', isCompleted: currentStep > 3, isCurrent: currentStep === 3 }
  ];

  const getAmountOptions = () => {
    return currency === 'EUR' ? AmountOptionsEUR : AmountOptionsRON;
  };

  const getActualAmount = () => {
    if (selectedAmountType === 'custom') {
      const parsed = parseFloat(customAmount);
      return isNaN(parsed) ? 0 : parsed;
    }
    return selectedAmount;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData(prevData => ({
      ...prevData,
      delivery_date: date,
    }));
  };

  const handleAmountSelection = (amount: number) => {
    setSelectedAmountType('preset');
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setSelectedAmountType('custom');
    setCustomAmount(value);
  };

  const validateCustomAmount = (amount: string): boolean => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) return false;
    
    const minAmount = currency === 'EUR' ? 59 : 299;
    const maxAmount = currency === 'EUR' ? 1000 : 7999;
    
    return parsed >= minAmount && parsed <= maxAmount;
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);

      const actualAmount = getActualAmount();
      const amountInCents = actualAmount * 100;

      const giftCardData = {
        ...formData,
        sender_user_id: user?.id || null,
        payment_status: 'pending',
        status: 'pending',
        currency: currency,
        gift_amount: amountInCents,
        amount_ron: currency === 'RON' ? amountInCents : null,
        amount_eur: currency === 'EUR' ? amountInCents : null,
        design_id: selectedDesign
      };

      const createdGiftCard = await createGiftCard(giftCardData);
      
      processPayment({
        giftCardId: createdGiftCard.id,
        returnUrl: `${window.location.origin}/gift?payment=success`
      });

    } catch (error) {
      console.error('Error creating gift card:', error);
      toast({
        title: "Error",
        description: "Failed to create gift card. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0:
        return selectedAmountType === 'preset' || (selectedAmountType === 'custom' && customAmount !== '' && validateCustomAmount(customAmount));
      case 1:
        return !!(formData.sender_name && formData.sender_email && formData.recipient_name && formData.recipient_email);
      case 2:
        return !!selectedDesign;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    handleFormSubmit(formData);
  };

  const renderStep0 = () => (
    <div className="space-y-1">
      <h3 className="text-base font-semibold text-white mb-1">Choose Gift Card Amount</h3>
      <p className="text-xs text-white/70 mb-4">Select the perfect value for your musical gift.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {getAmountOptions().map((amount, index) => (
          <Button
            key={amount}
            variant={selectedAmountType === 'preset' && selectedAmount === amount ? "default" : "outline"}
            onClick={() => handleAmountSelection(amount)}
            className={cn(
              "h-16 text-sm font-medium relative overflow-hidden group transition-all duration-200 w-full",
              selectedAmountType === 'preset' && selectedAmount === amount 
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500" 
                : "bg-white/10 border-white/30 text-white hover:bg-white/20"
            )}
          >
            <div className="flex flex-col items-center space-y-1">
              <span className="text-lg font-bold">{amount} {currency}</span>
              {index === 1 && (
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs">Popular</span>
                </div>
              )}
            </div>
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        <Button
          variant={selectedAmountType === 'custom' ? "default" : "outline"}
          onClick={() => setSelectedAmountType('custom')}
          className={cn(
            "w-full h-12 text-sm font-medium relative overflow-hidden group transition-all duration-200",
            selectedAmountType === 'custom' 
              ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500" 
              : "bg-white/10 border-white/30 text-white hover:bg-white/20"
          )}
        >
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>Enter Custom Amount</span>
          </div>
        </Button>
        
        <AnimatePresence>
          {selectedAmountType === 'custom' && (
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Label htmlFor="customAmount" className="text-xs font-medium text-white">Custom Amount ({currency})</Label>
              <div className="relative">
                <Input
                  id="customAmount"
                  type="number"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  placeholder={`Enter amount in ${currency}`}
                  min={currency === 'EUR' ? 59 : 299}
                  max={currency === 'EUR' ? 1000 : 7999}
                  step={currency === 'EUR' ? 1 : 10}
                  className="text-sm h-10 pr-12 bg-white/10 border-white/30 text-white placeholder:text-white/50"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 font-medium text-sm">
                  {currency}
                </span>
              </div>
              {customAmount && !validateCustomAmount(customAmount) && (
                <p className="text-xs text-red-400 bg-red-500/10 p-2 rounded">
                  Amount must be between {currency === 'EUR' ? '59-1000' : '299-7999'} {currency}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-1">
      <h3 className="text-base font-semibold text-white mb-1">Gift Details</h3>
      <p className="text-xs text-white/70 mb-4">Tell us who this special gift is for.</p>

      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="sender_name" className="text-xs font-medium text-white">Your Name</Label>
            <Input
              type="text"
              id="sender_name"
              name="sender_name"
              value={formData.sender_name}
              onChange={handleInputChange}
              required
              className="h-10 mt-1 bg-white/10 border-white/30 text-white placeholder:text-white/50"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <Label htmlFor="sender_email" className="text-xs font-medium text-white">Your Email</Label>
            <Input
              type="email"
              id="sender_email"
              name="sender_email"
              value={formData.sender_email}
              onChange={handleInputChange}
              required
              className="h-10 mt-1 bg-white/10 border-white/30 text-white placeholder:text-white/50"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <Label htmlFor="recipient_name" className="text-xs font-medium text-white">Recipient Name</Label>
            <Input
              type="text"
              id="recipient_name"
              name="recipient_name"
              value={formData.recipient_name}
              onChange={handleInputChange}
              required
              className="h-10 mt-1 bg-white/10 border-white/30 text-white placeholder:text-white/50"
              placeholder="Enter recipient's name"
            />
          </div>
          <div>
            <Label htmlFor="recipient_email" className="text-xs font-medium text-white">Recipient Email</Label>
            <Input
              type="email"
              id="recipient_email"
              name="recipient_email"
              value={formData.recipient_email}
              onChange={handleInputChange}
              required
              className="h-10 mt-1 bg-white/10 border-white/30 text-white placeholder:text-white/50"
              placeholder="recipient@email.com"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="message_text" className="text-xs font-medium text-white">Personal Message (Optional)</Label>
          <Textarea
            id="message_text"
            name="message_text"
            value={formData.message_text}
            onChange={handleInputChange}
            placeholder="Write a heartfelt message..."
            className="mt-1 bg-white/10 border-white/30 text-white placeholder:text-white/50 min-h-[80px]"
          />
        </div>

        <div>
          <Label className="text-xs font-medium text-white">Delivery Date (Optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-10 mt-1 justify-start text-left font-normal bg-white/10 border-white/30 text-white",
                  !formData.delivery_date && "text-white/50"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.delivery_date ? (
                  format(formData.delivery_date, "PPP")
                ) : (
                  <span>Choose delivery date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.delivery_date}
                onSelect={handleDateChange}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-1">
      <h3 className="text-base font-semibold text-white mb-1">Select a Design</h3>
      <p className="text-xs text-white/70 mb-4">Choose a design and see how your gift card will look.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-white mb-3">Available Designs</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {designs.map(design => (
              <Card
                key={design.id}
                className={cn(
                  "cursor-pointer transition-all bg-white/10 border-white/30",
                  selectedDesign === design.id ? 'border-orange-500 bg-orange-500/20' : 'hover:bg-white/20'
                )}
                onClick={() => setSelectedDesign(design.id)}
              >
                <CardHeader className="p-2">
                  <CardTitle className="text-xs font-medium text-white">{design.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  {design.preview_image_url ? (
                    <img src={design.preview_image_url} alt={design.name} className="w-full h-20 object-cover rounded" />
                  ) : (
                    <div className="w-full h-20 bg-white/10 rounded flex items-center justify-center text-white/50 text-xs">
                      {design.theme}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-white mb-3">Live Preview</h4>
          <GiftCardPreview
            design={designs.find(d => d.id === selectedDesign)}
            formData={formData}
            amount={getActualAmount()}
            currency={currency}
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const actualAmount = getActualAmount();
    
    return (
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-white mb-1">Review Your Gift Card</h3>
        <p className="text-xs text-white/70 mb-4">Confirm your details before proceeding to payment.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="bg-white/10 border-white/30">
            <CardHeader className="p-3">
              <CardTitle className="text-sm font-medium text-white">Gift Card Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-white/70">Amount:</span>
                <span className="font-medium text-white">{actualAmount} {currency}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/70">Design:</span>
                <span className="text-white">{designs.find(d => d.id === selectedDesign)?.name || 'Default'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/70">Recipient:</span>
                <span className="text-white">{formData.recipient_name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/70">Delivery:</span>
                <span className="text-white">{formData.delivery_date ? format(formData.delivery_date, "PPP") : 'Immediate'}</span>
              </div>
            </CardContent>
          </Card>

          <div>
            <h4 className="text-sm font-medium text-white mb-3">Final Preview</h4>
            <GiftCardPreview
              design={designs.find(d => d.id === selectedDesign)}
              formData={formData}
              amount={actualAmount}
              currency={currency}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-transparent border-transparent shadow-none">
      <CardHeader className="px-2 sm:px-3">
        <CardTitle className="flex items-center gap-2 text-lg text-white">
          <Gift className="w-5 h-5" />
          Purchase Gift Card
        </CardTitle>
        
        <StepIndicator steps={steps} />
      </CardHeader>

      <CardContent className="p-1.5">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentStep === 0 && renderStep0()}
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </motion.div>
        </AnimatePresence>

        <WizardNavigation
          currentStep={currentStep}
          totalSteps={4}
          canProceed={canProceed()}
          isSubmitting={isSubmitting || isProcessingPayment}
          onPrev={handlePrev}
          onNext={handleNext}
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  );
};

export default GiftPurchaseWizard;
