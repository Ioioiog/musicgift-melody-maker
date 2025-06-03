
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Gift } from "lucide-react";
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

  // Get currency-specific amount options
  const getAmountOptions = () => {
    return currency === 'EUR' ? AmountOptionsEUR : AmountOptionsRON;
  };

  // Get the actual amount to use (preset or custom)
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

      // Create gift card with currency-specific amounts
      const giftCardData = {
        ...formData,
        sender_user_id: user?.id || null,
        payment_status: 'pending',
        status: 'pending',
        currency: currency,
        gift_amount: amountInCents, // Amount in selected currency
        amount_ron: currency === 'RON' ? amountInCents : null,
        amount_eur: currency === 'EUR' ? amountInCents : null,
        design_id: selectedDesign
      };

      const createdGiftCard = await createGiftCard(giftCardData);
      
      // Process payment
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

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4">Choose Gift Card Amount</h3>
        <p className="text-gray-600">Select the value of the gift card you want to send.</p>
      </div>
      
      {/* Preset Amount Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {getAmountOptions().map(amount => (
          <Button
            key={amount}
            variant={selectedAmountType === 'preset' && selectedAmount === amount ? "default" : "outline"}
            onClick={() => handleAmountSelection(amount)}
            className="h-20 text-lg font-semibold"
          >
            {amount} {currency}
          </Button>
        ))}
      </div>

      {/* Custom Amount Option */}
      <div className="space-y-3">
        <Button
          variant={selectedAmountType === 'custom' ? "default" : "outline"}
          onClick={() => setSelectedAmountType('custom')}
          className="w-full h-16 text-lg font-semibold"
        >
          Enter a Custom Value
        </Button>
        
        {selectedAmountType === 'custom' && (
          <div className="space-y-2">
            <Label htmlFor="customAmount">Custom Amount ({currency})</Label>
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
                className="text-lg"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                {currency}
              </span>
            </div>
            {customAmount && !validateCustomAmount(customAmount) && (
              <p className="text-sm text-red-600">
                Amount must be between {currency === 'EUR' ? '59-1000' : '299-7999'} {currency}
              </p>
            )}
          </div>
        )}
      </div>

      <Button 
        onClick={() => setCurrentStep(2)} 
        className="w-full"
        disabled={selectedAmountType === 'custom' && (!customAmount || !validateCustomAmount(customAmount))}
      >
        Next: Details
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4">Enter Gift Details</h3>
        <p className="text-gray-600">Tell us who this gift is for.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sender_name">Your Name</Label>
          <Input
            type="text"
            id="sender_name"
            name="sender_name"
            value={formData.sender_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="sender_email">Your Email</Label>
          <Input
            type="email"
            id="sender_email"
            name="sender_email"
            value={formData.sender_email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="recipient_name">Recipient Name</Label>
          <Input
            type="text"
            id="recipient_name"
            name="recipient_name"
            value={formData.recipient_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="recipient_email">Recipient Email</Label>
          <Input
            type="email"
            id="recipient_email"
            name="recipient_email"
            value={formData.recipient_email}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="message_text">Personal Message (Optional)</Label>
        <Textarea
          id="message_text"
          name="message_text"
          value={formData.message_text}
          onChange={handleInputChange}
          placeholder="Write a personal message to the recipient"
        />
      </div>
      <div>
        <Label>Delivery Date (Optional)</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !formData.delivery_date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.delivery_date ? (
                format(formData.delivery_date, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.delivery_date}
              onSelect={handleDateChange}
              disabled={(date) =>
                date < new Date()
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setCurrentStep(1)}>
          Back
        </Button>
        <Button onClick={() => setCurrentStep(3)} className="flex-1">
          Next: Design
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4">Select a Design</h3>
        <p className="text-gray-600">Choose a design and see how your gift card will look.</p>
      </div>

      {/* Design Selection Grid */}
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
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-6 h-6" />
          Purchase Gift Card
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className={`px-2 py-1 rounded ${currentStep >= 1 ? 'bg-purple-100 text-purple-600' : 'bg-gray-100'}`}>
            1. Amount
          </span>
          <span className={`px-2 py-1 rounded ${currentStep >= 2 ? 'bg-purple-100 text-purple-600' : 'bg-gray-100'}`}>
            2. Details
          </span>
          <span className={`px-2 py-1 rounded ${currentStep >= 3 ? 'bg-purple-100 text-purple-600' : 'bg-gray-100'}`}>
            3. Design
          </span>
          <span className={`px-2 py-1 rounded ${currentStep >= 4 ? 'bg-purple-100 text-purple-600' : 'bg-gray-100'}`}>
            4. Review
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </CardContent>
    </Card>
  );
};

export default GiftPurchaseWizard;
