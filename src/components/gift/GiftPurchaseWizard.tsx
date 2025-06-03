
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

interface GiftPurchaseWizardProps {
  onComplete: (data: any) => void;
}

interface DesignOption {
  id: string;
  name: string;
  preview_image_url?: string;
}

// Currency-specific amount options with different prices
const AmountOptionsRON = [299, 499, 999];
const AmountOptionsEUR = [79, 119, 199];

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

  // Calculate equivalent amount in the other currency for display
  const getEquivalentAmount = (amount: number, fromCurrency: string) => {
    if (fromCurrency === 'EUR') {
      return Math.round(amount * 4.2); // 1 EUR ≈ 4.2 RON (different exchange rate)
    } else {
      return Math.round(amount / 4.2); // 1 RON ≈ 0.24 EUR
    }
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
    
    const minAmount = currency === 'EUR' ? 10 : 50;
    const maxAmount = currency === 'EUR' ? 1000 : 5000;
    
    return parsed >= minAmount && parsed <= maxAmount;
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);

      const actualAmount = getActualAmount();
      const amountInCents = actualAmount * 100;

      // Calculate amounts for both currencies
      const amountRon = currency === 'RON' ? amountInCents : getEquivalentAmount(actualAmount, 'EUR') * 100;
      const amountEur = currency === 'EUR' ? amountInCents : getEquivalentAmount(actualAmount, 'RON') * 100;

      // Create gift card with multi-currency support
      const giftCardData = {
        ...formData,
        sender_user_id: user?.id || null,
        payment_status: 'pending',
        status: 'pending',
        currency: currency,
        gift_amount: amountInCents, // Amount in selected currency
        amount_ron: amountRon,
        amount_eur: amountEur,
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
        <p className="text-sm text-gray-500 mt-2">
          Prices are optimized for {currency} payments
        </p>
      </div>
      
      {/* Preset Amount Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {getAmountOptions().map(amount => {
          const equivalentAmount = getEquivalentAmount(amount, currency);
          const otherCurrency = currency === 'EUR' ? 'RON' : 'EUR';
          
          return (
            <Button
              key={amount}
              variant={selectedAmountType === 'preset' && selectedAmount === amount ? "default" : "outline"}
              onClick={() => handleAmountSelection(amount)}
              className="h-20 text-lg font-semibold flex flex-col"
            >
              <span>{amount} {currency}</span>
              <span className="text-xs opacity-70">
                (~{equivalentAmount} {otherCurrency})
              </span>
            </Button>
          );
        })}
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
                min={currency === 'EUR' ? 10 : 50}
                max={currency === 'EUR' ? 1000 : 5000}
                step={currency === 'EUR' ? 1 : 10}
                className="text-lg"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                {currency}
              </span>
            </div>
            {customAmount && (
              <div className="text-sm text-gray-600">
                Equivalent: ~{getEquivalentAmount(parseFloat(customAmount) || 0, currency)} {currency === 'EUR' ? 'RON' : 'EUR'}
              </div>
            )}
            {customAmount && !validateCustomAmount(customAmount) && (
              <p className="text-sm text-red-600">
                Amount must be between {currency === 'EUR' ? '10-1000' : '50-5000'} {currency}
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
        Next: Design
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4">Select a Design</h3>
        <p className="text-gray-600">Choose a design for your gift card.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {designs.map(design => (
          <Card
            key={design.id}
            className={`cursor-pointer ${selectedDesign === design.id ? 'border-2 border-purple-500' : ''}`}
            onClick={() => setSelectedDesign(design.id)}
          >
            <CardHeader>
              <CardTitle className="text-sm font-medium">{design.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              {design.preview_image_url ? (
                <img src={design.preview_image_url} alt={design.name} className="w-full h-32 object-cover rounded-md" />
              ) : (
                <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
                  No Preview
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setCurrentStep(1)}>
          Back
        </Button>
        <Button onClick={() => setCurrentStep(3)} className="flex-1">
          Next: Details
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
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
        <Button variant="outline" onClick={() => setCurrentStep(2)}>
          Back
        </Button>
        <Button onClick={() => setCurrentStep(4)} className="flex-1">
          Next: Review
        </Button>
      </div>
    </div>
  );

  const renderStep4 = () => {
    const actualAmount = getActualAmount();
    const equivalentAmount = getEquivalentAmount(actualAmount, currency);
    const otherCurrency = currency === 'EUR' ? 'RON' : 'EUR';
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Review Your Gift Card</h3>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Gift Card Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Amount:</span>
              <div className="text-right">
                <div className="font-semibold">{actualAmount} {currency}</div>
                <div className="text-sm text-gray-500">
                  (~{equivalentAmount} {otherCurrency})
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <span>Payment Currency:</span>
              <span className="font-semibold">{currency}</span>
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
