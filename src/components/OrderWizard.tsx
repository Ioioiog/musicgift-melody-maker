
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import StepIndicator from './order/StepIndicator';
import FormFieldRenderer from './order/FormFieldRenderer';
import HelpSection from './order/HelpSection';
import TestimonialSection from './order/TestimonialSection';
import OrderSummary from './order/OrderSummary';
import { getStepsForPackage } from '@/utils/stepConfig';

interface OrderWizardProps {
  onComplete: (data: any) => void;
}

const OrderWizard: React.FC<OrderWizardProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [formData, setFormData] = useState<any>({
    package: '',
    fullName: '',
    email: '',
    phone: '',
    language: '',
    recipientName: '',
    occasion: '',
    story: '',
    keywords: '',
    originalTitle: '',
    style: '',
    label: '',
    brandName: '',
    campaignPurpose: '',
    artistName: '',
    songStyle: '',
    artistBio: '',
    linksReleases: '',
    linksMedia: '',
    message: '',
    recipientEmail: '',
    giftMessage: '',
    desiredStyle: '',
    instrumentalReference: '',
    acceptMention: false,
    acceptRights: false,
    acceptContact: false,
    acceptFlow: false
  });
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const { toast } = useToast();

  const allSteps = getStepsForPackage(selectedPackage);
  const maxSteps = Math.max(5, allSteps.length);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'package') {
      setSelectedPackage(value);
    }
  };

  const handleAddonChange = (addonId: string, checked: boolean) => {
    if (checked) {
      setSelectedAddons(prev => [...prev, addonId]);
    } else {
      setSelectedAddons(prev => prev.filter(id => id !== addonId));
    }
  };

  const canProceed = () => {
    const currentStepData = allSteps.find(step => step.step === currentStep);
    if (!currentStepData) return false;
    
    return currentStepData.fields.every(field => {
      if (!field.required) return true;
      if (field.type === 'checkbox-group') return true;
      
      const fieldValue = formData[field.name];
      return fieldValue && fieldValue !== '';
    });
  };

  const handleNext = () => {
    if (canProceed() && currentStep < maxSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const finalData = {
      ...formData,
      addons: selectedAddons,
      package: selectedPackage
    };
    onComplete(finalData);
  };

  const currentStepData = allSteps.find(step => step.step === currentStep);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button className="flex items-center text-purple-600 hover:text-purple-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Your Musical Gift</h1>
          <p className="text-gray-600">Transform your emotions into a personalized song with our simple step-by-step process</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <StepIndicator currentStep={currentStep} />

            {/* Form Content */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                {currentStepData && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {currentStep === 3 ? "Tell Us About the Recipient" : currentStepData.title}
                    </h2>
                    {currentStep === 3 && (
                      <p className="text-gray-600 mb-8">Help us understand who this special song is for and what occasion we're celebrating.</p>
                    )}

                    <div className="space-y-6">
                      {currentStepData.fields.map((field, index) => (
                        <FormFieldRenderer
                          key={index}
                          field={field}
                          formData={formData}
                          selectedAddons={selectedAddons}
                          updateFormData={updateFormData}
                          handleAddonChange={handleAddonChange}
                        />
                      ))}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-8 border-t mt-8">
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                        className="px-8"
                      >
                        PREVIOUS
                      </Button>

                      {currentStep === maxSteps ? (
                        <Button
                          onClick={handleSubmit}
                          disabled={!canProceed()}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
                        >
                          COMPLETE ORDER
                        </Button>
                      ) : (
                        <Button
                          onClick={handleNext}
                          disabled={!canProceed()}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
                        >
                          CONTINUE
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <HelpSection />
            <TestimonialSection />
            <OrderSummary selectedPackage={selectedPackage} selectedAddons={selectedAddons} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderWizard;
