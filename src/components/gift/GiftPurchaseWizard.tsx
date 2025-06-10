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

interface GiftPurchaseWizardProps {
  onComplete: (data: any) => void;
}

// Currency-specific amount options
const AmountOptionsRON = [299, 500, 7999];
const AmountOptionsEUR = [59, 99, 1599];

const GiftPurchaseWizard: React.FC<GiftPurchaseWizardProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
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

  const validateCustomAmount = (amount: string) => {
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

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const renderStep1 = () => (
    <motion.div 
      className="space-y-8"
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
            <Gift className="w-8 h-8 text-white" />
          </div>
        </div>
        <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Choose Gift Card Amount
        </h3>
        <p className="text-gray-600 text-lg">Select the perfect value for your musical gift.</p>
      </div>
      
      {/* Enhanced Preset Amount Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {getAmountOptions().map((amount, index) => (
          <motion.div
            key={amount}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant={selectedAmountType === 'preset' && selectedAmount === amount ? "default" : "outline"}
              onClick={() => handleAmountSelection(amount)}
              className={cn(
                "h-24 text-xl font-bold relative overflow-hidden group transition-all duration-300 w-full",
                selectedAmountType === 'preset' && selectedAmount === amount 
                  ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg scale-105" 
                  : "hover:scale-105 hover:shadow-lg border-2 border-gray-200 hover:border-purple-300"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex flex-col items-center space-y-1">
                <span className="text-2xl font-bold">{amount} {currency}</span>
                {index === 1 && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-xs font-medium">Popular</span>
                  </div>
                )}
              </div>
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Custom Amount Option */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant={selectedAmountType === 'custom' ? "default" : "outline"}
            onClick={() => setSelectedAmountType('custom')}
            className={cn(
              "w-full h-20 text-lg font-semibold relative overflow-hidden group transition-all duration-300",
              selectedAmountType === 'custom' 
                ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg" 
                : "hover:shadow-lg border-2 border-gray-200 hover:border-purple-300"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>Enter a Custom Value</span>
            </div>
          </Button>
        </motion.div>
        
        <AnimatePresence>
          {selectedAmountType === 'custom' && (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Label htmlFor="customAmount" className="text-base font-medium">Custom Amount ({currency})</Label>
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
                  className="text-lg h-14 pr-16 border-2 focus:border-purple-400 transition-colors"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold text-lg">
                  {currency}
                </span>
              </div>
              {customAmount && !validateCustomAmount(customAmount) && (
                <motion.p 
                  className="text-sm text-red-600 bg-red-50 p-2 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Amount must be between {currency === 'EUR' ? '59-1000' : '299-7999'} {currency}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button 
          onClick={() => setCurrentStep(2)} 
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          disabled={selectedAmountType === 'custom' && (!customAmount || !validateCustomAmount(customAmount))}
        >
          <span>Continue to Details</span>
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div 
      className="space-y-8"
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
        </div>
        <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Gift Details
        </h3>
        <p className="text-gray-600 text-lg">Tell us who this special gift is for.</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Label htmlFor="sender_name" className="text-base font-medium">Your Name</Label>
            <Input
              type="text"
              id="sender_name"
              name="sender_name"
              value={formData.sender_name}
              onChange={handleInputChange}
              required
              className="h-12 mt-2 border-2 focus:border-blue-400 transition-colors"
              placeholder="Enter your full name"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Label htmlFor="sender_email" className="text-base font-medium">Your Email</Label>
            <Input
              type="email"
              id="sender_email"
              name="sender_email"
              value={formData.sender_email}
              onChange={handleInputChange}
              required
              className="h-12 mt-2 border-2 focus:border-blue-400 transition-colors"
              placeholder="your@email.com"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Label htmlFor="recipient_name" className="text-base font-medium">Recipient Name</Label>
            <Input
              type="text"
              id="recipient_name"
              name="recipient_name"
              value={formData.recipient_name}
              onChange={handleInputChange}
              required
              className="h-12 mt-2 border-2 focus:border-blue-400 transition-colors"
              placeholder="Enter recipient's name"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Label htmlFor="recipient_email" className="text-base font-medium">Recipient Email</Label>
            <Input
              type="email"
              id="recipient_email"
              name="recipient_email"
              value={formData.recipient_email}
              onChange={handleInputChange}
              required
              className="h-12 mt-2 border-2 focus:border-blue-400 transition-colors"
              placeholder="recipient@email.com"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Label htmlFor="message_text" className="text-base font-medium">Personal Message (Optional)</Label>
          <Textarea
            id="message_text"
            name="message_text"
            value={formData.message_text}
            onChange={handleInputChange}
            placeholder="Write a heartfelt message to make this gift even more special..."
            className="mt-2 border-2 focus:border-blue-400 transition-colors min-h-[100px]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Label className="text-base font-medium">Delivery Date (Optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full h-12 mt-2 justify-start text-left font-normal border-2 hover:border-blue-400 transition-colors",
                  !formData.delivery_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-3 h-5 w-5" />
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
        </motion.div>
      </div>

      <motion.div 
        className="flex gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep(1)}
          className="flex-1 h-12 border-2 hover:border-gray-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <Button 
          onClick={() => setCurrentStep(3)} 
          className="flex-2 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Continue to Design
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </motion.div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4">Select a Design</h3>
        <p className="text-gray-600">Choose a design and see how your gift card will look.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-semibold mb-4">Available Designs</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {designs.map(design => (
              <Card
                key={design.id}
                className={`cursor-pointer transition-all ${selectedDesign === design.id ? 'border-2 border-purple-500 shadow-lg' : 'hover:shadow-md'}`}
                onClick={() => setSelectedDesign(design.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{design.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  {design.preview_image_url ? (
                    <img src={design.preview_image_url} alt={design.name} className="w-full h-24 object-cover rounded-md" />
                  ) : (
                    <div className="w-full h-24 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 text-sm">
                      {design.theme}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Live Preview</h4>
          <GiftCardPreview
            design={designs.find(d => d.id === selectedDesign)}
            formData={formData}
            amount={getActualAmount()}
            currency={currency}
          />
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium mb-2">Your card will include:</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Card value: {getActualAmount()} {currency}</li>
              <li>• Unique gift card code</li>
              {formData.recipient_name && <li>• Recipient: {formData.recipient_name}</li>}
              {formData.sender_name && <li>• From: {formData.sender_name}</li>}
              {formData.message_text && <li>• Personal message</li>}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setCurrentStep(2)}>
          Back
        </Button>
        <Button onClick={() => setCurrentStep(4)} className="flex-1" disabled={!selectedDesign}>
          Next: Review
        </Button>
      </div>
    </div>
  );

  const renderStep4 = () => {
    const actualAmount = getActualAmount();
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Review Your Gift Card</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Gift Card Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-semibold">{actualAmount} {currency}</span>
              </div>
              <div className="flex justify-between">
                <span>Design:</span>
                <span>{designs.find(d => d.id === selectedDesign)?.name || 'Default'}</span>
              </div>
              <div className="flex justify-between">
                <span>Recipient:</span>
                <span>{formData.recipient_name} ({formData.recipient_email})</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Date:</span>
                <span>{formData.delivery_date ? format(formData.delivery_date, "PPP") : 'Immediate'}</span>
              </div>
            </CardContent>
          </Card>

          <div>
            <h4 className="text-lg font-semibold mb-4">Final Preview</h4>
            <GiftCardPreview
              design={designs.find(d => d.id === selectedDesign)}
              formData={formData}
              amount={actualAmount}
              currency={currency}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(3)}
            disabled={isSubmitting || isProcessingPayment}
          >
            Back
          </Button>
          <Button 
            onClick={() => handleFormSubmit(formData)} 
            disabled={isSubmitting || isProcessingPayment}
            className="flex-1"
          >
            {isSubmitting || isProcessingPayment ? 'Processing...' : `Pay ${actualAmount} ${currency}`}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-blue-50/30 to-pink-50/50 rounded-2xl" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-2xl" />
      
      <Card className="relative bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden">
        {/* Enhanced Header with Progress */}
        <CardHeader className="bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-pink-600/10 border-b border-gray-200/50 pb-6">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Purchase Gift Card
            </span>
          </CardTitle>
          
          {/* Enhanced Step Indicator */}
          <div className="flex items-center gap-3 mt-6">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300",
                  currentStep >= step 
                    ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg" 
                    : "bg-gray-200 text-gray-500"
                )}>
                  {currentStep > step ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step
                  )}
                </div>
                {step < 4 && (
                  <div className={cn(
                    "w-12 h-1 mx-2 rounded-full transition-all duration-300",
                    currentStep > step 
                      ? "bg-gradient-to-r from-purple-600 to-pink-600" 
                      : "bg-gray-200"
                  )} />
                )}
              </div>
            ))}
          </div>
          
          {/* Step Labels */}
          <div className="flex justify-between mt-3 text-sm font-medium">
            <span className={currentStep >= 1 ? 'text-purple-600' : 'text-gray-500'}>Amount</span>
            <span className={currentStep >= 2 ? 'text-purple-600' : 'text-gray-500'}>Details</span>
            <span className={currentStep >= 3 ? 'text-purple-600' : 'text-gray-500'}>Design</span>
            <span className={currentStep >= 4 ? 'text-purple-600' : 'text-gray-500'}>Review</span>
          </div>
        </CardHeader>

        <CardContent className="p-8 relative">
          <AnimatePresence mode="wait">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default GiftPurchaseWizard;
