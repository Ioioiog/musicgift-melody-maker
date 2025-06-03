
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Heart, Gift, TreePine, Star } from 'lucide-react';
import { format } from 'date-fns';
import { useGiftCardDesigns, useCreateGiftCard } from '@/hooks/useGiftCards';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { usePackages } from '@/hooks/usePackageData';

interface GiftPurchaseData {
  designId: string;
  recipientName: string;
  recipientEmail: string;
  messageText: string;
  giftType: 'amount' | 'package';
  giftAmount?: number;
  packageType?: string;
  deliveryDate?: Date;
  instantDelivery: boolean;
}

interface GiftPurchaseWizardProps {
  onComplete: (data: GiftPurchaseData) => void;
}

const GiftPurchaseWizard: React.FC<GiftPurchaseWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<GiftPurchaseData>({
    designId: '',
    recipientName: '',
    recipientEmail: '',
    messageText: '',
    giftType: 'amount',
    instantDelivery: true,
  });

  const { user } = useAuth();
  const { t } = useLanguage();
  const { currency } = useCurrency();
  const { data: designs = [] } = useGiftCardDesigns();
  const { data: packages = [] } = usePackages();
  const createGiftCard = useCreateGiftCard();

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'love': return <Heart className="w-6 h-6" />;
      case 'birthday': return <Gift className="w-6 h-6" />;
      case 'christmas': return <TreePine className="w-6 h-6" />;
      default: return <Star className="w-6 h-6" />;
    }
  };

  const predefinedAmounts = currency === 'EUR' ? [25, 50, 75, 100] : [100, 200, 300, 500];

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!user) return;

    const giftCardData = {
      sender_user_id: user.id,
      sender_name: user.user_metadata?.full_name || 'Anonymous',
      sender_email: user.email!,
      recipient_name: formData.recipientName,
      recipient_email: formData.recipientEmail,
      message_text: formData.messageText,
      design_id: formData.designId,
      delivery_date: formData.instantDelivery ? null : formData.deliveryDate?.toISOString(),
      gift_amount: formData.giftType === 'amount' ? (formData.giftAmount! * 100) : null, // Convert to cents
      package_type: formData.giftType === 'package' ? formData.packageType : null,
    };

    try {
      const result = await createGiftCard.mutateAsync(giftCardData);
      onComplete({ ...formData, ...result });
    } catch (error) {
      console.error('Failed to create gift card:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            Create Gift Card - Step {step} of 5
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Choose Card Design</h3>
              <div className="grid grid-cols-2 gap-4">
                {designs.map((design) => (
                  <div
                    key={design.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.designId === design.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setFormData({ ...formData, designId: design.id })}
                  >
                    <div className="flex items-center space-x-3">
                      {getThemeIcon(design.theme)}
                      <div>
                        <h4 className="font-medium">{design.name}</h4>
                        <p className="text-sm text-gray-500 capitalize">{design.theme}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Recipient Details</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="recipientName">Recipient Name</Label>
                  <Input
                    id="recipientName"
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                    placeholder="Enter recipient's name"
                  />
                </div>
                <div>
                  <Label htmlFor="recipientEmail">Recipient Email</Label>
                  <Input
                    id="recipientEmail"
                    type="email"
                    value={formData.recipientEmail}
                    onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                    placeholder="Enter recipient's email"
                  />
                </div>
                <div>
                  <Label htmlFor="messageText">Personal Message</Label>
                  <Textarea
                    id="messageText"
                    value={formData.messageText}
                    onChange={(e) => setFormData({ ...formData, messageText: e.target.value })}
                    placeholder="Write a personal message for the recipient..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Gift Value</h3>
              <RadioGroup
                value={formData.giftType}
                onValueChange={(value: 'amount' | 'package') => setFormData({ ...formData, giftType: value })}
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="amount" id="amount" />
                    <Label htmlFor="amount">Fixed Amount</Label>
                  </div>
                  {formData.giftType === 'amount' && (
                    <div className="ml-6 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        {predefinedAmounts.map((amount) => (
                          <Button
                            key={amount}
                            variant={formData.giftAmount === amount ? "default" : "outline"}
                            onClick={() => setFormData({ ...formData, giftAmount: amount })}
                          >
                            {amount} {currency}
                          </Button>
                        ))}
                      </div>
                      <div>
                        <Label htmlFor="customAmount">Custom Amount</Label>
                        <Input
                          id="customAmount"
                          type="number"
                          value={formData.giftAmount || ''}
                          onChange={(e) => setFormData({ ...formData, giftAmount: Number(e.target.value) })}
                          placeholder={`Enter amount in ${currency}`}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="package" id="package" />
                    <Label htmlFor="package">Specific Package</Label>
                  </div>
                  {formData.giftType === 'package' && (
                    <div className="ml-6 space-y-2">
                      {packages.map((pkg) => (
                        <Button
                          key={pkg.value}
                          variant={formData.packageType === pkg.value ? "default" : "outline"}
                          onClick={() => setFormData({ ...formData, packageType: pkg.value })}
                          className="w-full justify-start"
                        >
                          {pkg.label_key} - {pkg.price} {currency}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </RadioGroup>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Delivery Options</h3>
              <RadioGroup
                value={formData.instantDelivery ? 'instant' : 'scheduled'}
                onValueChange={(value) => setFormData({ ...formData, instantDelivery: value === 'instant' })}
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="instant" id="instant" />
                    <Label htmlFor="instant">Send Immediately</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="scheduled" id="scheduled" />
                    <Label htmlFor="scheduled">Schedule for Later</Label>
                  </div>
                  
                  {!formData.instantDelivery && (
                    <div className="ml-6">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.deliveryDate ? format(formData.deliveryDate, "PPP") : "Pick a delivery date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.deliveryDate}
                            onSelect={(date) => setFormData({ ...formData, deliveryDate: date })}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>
              </RadioGroup>
            </div>
          )}

          {step === 5 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Review & Confirm</h3>
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div><strong>Design:</strong> {designs.find(d => d.id === formData.designId)?.name}</div>
                <div><strong>Recipient:</strong> {formData.recipientName} ({formData.recipientEmail})</div>
                <div><strong>Message:</strong> {formData.messageText || 'No message'}</div>
                <div>
                  <strong>Gift:</strong> {formData.giftType === 'amount' 
                    ? `${formData.giftAmount} ${currency}` 
                    : packages.find(p => p.value === formData.packageType)?.label_key
                  }
                </div>
                <div>
                  <strong>Delivery:</strong> {formData.instantDelivery 
                    ? 'Immediate' 
                    : `Scheduled for ${formData.deliveryDate ? format(formData.deliveryDate, "PPP") : 'Not set'}`
                  }
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              Back
            </Button>
            
            {step < 5 ? (
              <Button
                onClick={handleNext}
                disabled={
                  (step === 1 && !formData.designId) ||
                  (step === 2 && (!formData.recipientName || !formData.recipientEmail)) ||
                  (step === 3 && formData.giftType === 'amount' && !formData.giftAmount) ||
                  (step === 3 && formData.giftType === 'package' && !formData.packageType) ||
                  (step === 4 && !formData.instantDelivery && !formData.deliveryDate)
                }
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={createGiftCard.isPending}
              >
                {createGiftCard.isPending ? 'Creating...' : 'Create Gift Card'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GiftPurchaseWizard;
