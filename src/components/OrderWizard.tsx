import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ChevronRight, CheckCircle, Clock, Star, Shield } from 'lucide-react';
import StepIndicator from './order/StepIndicator';
import FormFieldRenderer from './order/FormFieldRenderer';
import HelpSection from './order/HelpSection';
import TestimonialSection from './order/TestimonialSection';
import OrderSummary from './order/OrderSummary';
import { getStepsForPackage } from '@/utils/stepConfig';
import { packages } from '@/data/packages';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    toast
  } = useToast();
  const allSteps = getStepsForPackage(selectedPackage);
  const maxSteps = Math.max(5, allSteps.length);
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      toast({
        title: "Please complete all required fields",
        description: "Make sure to fill in all required information before proceeding.",
        variant: "destructive"
      });
    }
  };
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };
  const handleSubmit = async () => {
    if (!canProceed()) {
      toast({
        title: "Please complete all required fields",
        description: "Make sure to fill in all required information before submitting.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const finalData = {
        ...formData,
        addons: selectedAddons,
        package: selectedPackage
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      onComplete(finalData);
      toast({
        title: "Order submitted successfully!",
        description: "Thank you for your order. We'll contact you soon with next steps."
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact support if the problem persists.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const currentStepData = allSteps.find(step => step.step === currentStep);
  const completionPercentage = currentStep / maxSteps * 100;
  const selectedPackageDetails = packages.find(pkg => pkg.value === selectedPackage);
  return <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="max-w-7xl py-[5px] my-0 mx-0 px-[21px]">
        {/* Enhanced Header */}
        <div className="mb-12">
          <button className="flex items-center text-purple-600 hover:text-purple-700 mb-6 transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </button>
          
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Enhanced Main Content */}
          <div className="lg:col-span-3">
            <StepIndicator currentStep={currentStep} />

            {/* Enhanced Form Content */}
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 lg:p-10">
                {currentStepData && (
                  <>
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {currentStep}
                          </div>
                          <div>
                            <h2 className="text-3xl font-bold text-gray-900">
                              {currentStep === 3 ? "Tell Us About the Recipient" : currentStepData.title}
                            </h2>
                            <p className="text-purple-600 font-medium">
                              Step {currentStep} of {maxSteps}
                            </p>
                          </div>
                        </div>
                        <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-500">
                          <span>Progress:</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${completionPercentage}%` }} 
                            />
                          </div>
                          <span>{Math.round(completionPercentage)}%</span>
                        </div>
                      </div>
                      
                      {currentStep === 3 && (
                        <p className="text-lg text-gray-600 leading-relaxed">
                          Help us understand who this special song is for and what occasion we're celebrating.
                        </p>
                      )}
                    </div>

                    {/* Package Details Section - Show when package is selected */}
                    {selectedPackageDetails && currentStep === 1 && (
                      <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                        <div className="flex items-start space-x-4">
                          <div className="text-4xl">{selectedPackageDetails.value === 'personal' ? '🎁' : selectedPackageDetails.value === 'business' ? '💼' : selectedPackageDetails.value === 'premium' ? '🌟' : selectedPackageDetails.value === 'artist' ? '🎤' : selectedPackageDetails.value === 'instrumental' ? '🎶' : selectedPackageDetails.value === 'remix' ? '🔁' : '🎁'}</div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedPackageDetails.label}</h3>
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="flex items-center space-x-2">
                                <span className="text-3xl font-bold text-purple-600">{selectedPackageDetails.details.price}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">{selectedPackageDetails.details.deliveryTime}</span>
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                                What's included:
                              </h4>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {selectedPackageDetails.details.includes.map((item, index) => (
                                  <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="flex items-center space-x-2 text-sm text-green-600 font-medium">
                              <Shield className="w-4 h-4" />
                              <span>Professional quality guaranteed</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-8">
                      {currentStepData.fields.map((field, index) => (
                        <div key={index} className="transform transition-all duration-200 hover:scale-[1.02]">
                          <FormFieldRenderer 
                            field={field} 
                            formData={formData} 
                            selectedAddons={selectedAddons} 
                            updateFormData={updateFormData} 
                            handleAddonChange={handleAddonChange} 
                          />
                        </div>
                      ))}
                    </div>

                    {/* Enhanced Navigation Buttons */}
                    <div className="flex justify-between items-center pt-10 border-t mt-10">
                      <Button 
                        variant="outline" 
                        onClick={handlePrevious} 
                        disabled={currentStep === 1}
                        className="px-8 py-3 font-semibold border-2 hover:bg-gray-50 disabled:opacity-50 transition-all duration-200"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        PREVIOUS
                      </Button>

                      <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                        {Array.from({ length: maxSteps }, (_, i) => (
                          <div 
                            key={i} 
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              i + 1 <= currentStep ? 'bg-purple-500' : 'bg-gray-300'
                            }`} 
                          />
                        ))}
                      </div>

                      {currentStep === maxSteps ? (
                        <Button 
                          onClick={handleSubmit} 
                          disabled={!canProceed() || isSubmitting}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              SUBMITTING...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              COMPLETE ORDER
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleNext} 
                          disabled={!canProceed()}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                        >
                          CONTINUE
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-8 space-y-6">
              <HelpSection />
              <TestimonialSection />
              <OrderSummary selectedPackage={selectedPackage} selectedAddons={selectedAddons} />
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default OrderWizard;
