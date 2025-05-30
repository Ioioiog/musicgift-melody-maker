
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ChevronRight, CheckCircle, Clock, Star, Shield } from 'lucide-react';
import StepIndicator from './order/StepIndicator';
import FormFieldRenderer from './order/FormFieldRenderer';
import HelpSection from './order/HelpSection';
import TestimonialSection from './order/TestimonialSection';
import OrderSummary from './order/OrderSummary';
import { usePackages, usePackageSteps, useAddons } from '@/hooks/usePackageData';
import { useTranslation } from '@/hooks/useTranslations';
import { supabase } from '@/integrations/supabase/client';

interface OrderWizardProps {
  onComplete: (data: any) => void;
}

const OrderWizard: React.FC<OrderWizardProps> = ({ onComplete }) => {
  const { t } = useTranslation();
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
  const [addonFieldValues, setAddonFieldValues] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch dynamic data
  const { data: packages = [], isLoading: packagesLoading } = usePackages();
  const { data: packageSteps = [], isLoading: stepsLoading } = usePackageSteps(selectedPackage);
  const { data: addons = [] } = useAddons();

  // Calculate total steps from database steps only
  const totalSteps = packageSteps.length;

  console.log('Current step:', currentStep);
  console.log('Selected package:', selectedPackage);
  console.log('Package steps:', packageSteps);
  console.log('Total steps:', totalSteps);
  console.log('Steps loading:', stepsLoading);

  const updateFormData = (field: string, value: any) => {
    console.log('Updating form data:', field, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'package') {
      setSelectedPackage(value);
      console.log('Package selected:', value);
    }
  };

  const handleAddonChange = (addonId: string, checked: boolean) => {
    if (checked) {
      setSelectedAddons(prev => [...prev, addonId]);
    } else {
      setSelectedAddons(prev => prev.filter(id => id !== addonId));
      // Clear addon field value when unchecked
      setAddonFieldValues(prev => {
        const updated = { ...prev };
        delete updated[addonId];
        return updated;
      });
    }
  };

  const handleAddonFieldChange = (addonKey: string, fieldValue: any) => {
    setAddonFieldValues(prev => ({
      ...prev,
      [addonKey]: fieldValue
    }));
  };

  const canProceed = () => {
    console.log('Checking if can proceed from step:', currentStep);
    
    // Get current step data from database
    const currentStepData = packageSteps.find(step => step.step_number === currentStep);
    console.log('Current step data for validation:', currentStepData);
    
    if (!currentStepData) {
      console.log('No step data found for step:', currentStep);
      return false;
    }

    const validation = currentStepData.fields.every(field => {
      if (!field.required) return true;
      if (field.field_type === 'checkbox-group') return true;
      const fieldValue = formData[field.field_name];
      const isValid = fieldValue && fieldValue !== '';
      console.log(`Field ${field.field_name} validation:`, isValid, 'Value:', fieldValue);
      return isValid;
    });

    console.log('Step validation result:', validation);
    return validation;
  };

  const handleNext = () => {
    console.log('Attempting to go to next step from:', currentStep);
    
    if (canProceed() && currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      console.log('Moving to step:', nextStep);
      setCurrentStep(nextStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      console.log('Cannot proceed - validation failed or at last step');
      toast({
        title: t('completeRequiredFields', 'Please complete all required fields'),
        description: t('completeRequiredFieldsDesc', 'Make sure all required fields are filled out before proceeding.'),
        variant: "destructive"
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) {
      toast({
        title: t('completeRequiredFields', 'Please complete all required fields'),
        description: t('completeRequiredFieldsDesc', 'Make sure all required fields are filled out before proceeding.'),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Get package ID for database storage
      const selectedPackageData = packages.find(pkg => pkg.value === selectedPackage);
      
      const finalData = {
        ...formData,
        addons: selectedAddons,
        addonFieldValues,
        package: selectedPackage
      };

      // Save order to database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          package_id: selectedPackageData?.id,
          form_data: finalData,
          selected_addons: selectedAddons,
          total_price: calculateTotalPrice(),
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Save addon field data if any
      if (Object.keys(addonFieldValues).length > 0) {
        const addonFormData = Object.entries(addonFieldValues).map(([addonKey, fieldValue]) => {
          const addon = addons.find(a => a.addon_key === addonKey);
          return {
            order_id: orderData.id,
            addon_key: addonKey,
            field_type: addon?.trigger_field_type || 'unknown',
            field_data: fieldValue instanceof File ? { fileName: fieldValue.name } : (fieldValue as any),
            file_url: fieldValue instanceof File ? null : null // File upload handling would go here
          };
        });

        if (addonFormData.length > 0) {
          const { error: addonDataError } = await supabase
            .from('addon_form_data')
            .insert(addonFormData);

          if (addonDataError) {
            console.error('Addon data save error:', addonDataError);
          }
        }
      }

      onComplete(finalData);
      toast({
        title: t('orderSubmittedSuccess', 'Order submitted successfully!'),
        description: t('orderSubmittedDesc', 'We have received your order and will get back to you soon.')
      });
    } catch (error) {
      console.error('Order submission error:', error);
      toast({
        title: t('somethingWentWrong', 'Something went wrong'),
        description: t('tryAgainSupport', 'Please try again or contact support if the problem persists.'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotalPrice = () => {
    const packagePrice = packages.find(pkg => pkg.value === selectedPackage)?.price || 0;
    const addonsPrice = selectedAddons.reduce((total, addonKey) => {
      const addon = addons.find(a => a.addon_key === addonKey);
      return total + (addon?.price || 0);
    }, 0);
    return packagePrice + addonsPrice;
  };

  // Get current step data from database steps
  const getCurrentStepData = () => {
    console.log('Getting current step data for step:', currentStep);
    
    const dbStep = packageSteps.find(step => step.step_number === currentStep);
    console.log('Database step found:', dbStep);
    
    if (!dbStep) return dbStep;
    
    // Transform all fields to ensure options are in the correct format
    const enhancedStep = {
      ...dbStep,
      fields: dbStep.fields.map(field => {
        // Handle package field specifically - inject package options
        if (field.field_name === 'package' && field.field_type === 'select') {
          return {
            ...field,
            options: packages.map(pkg => ({
              value: pkg.value,
              label_key: pkg.label_key
            }))
          };
        }
        
        // For ALL other fields with options, ensure they're in FieldOption format
        if (field.options && Array.isArray(field.options)) {
          return {
            ...field,
            options: field.options.map((option: any) => {
              // If it's already a FieldOption object, return as is
              if (typeof option === 'object' && option.value && option.label_key) {
                return option;
              }
              // If it's a string, transform to FieldOption
              if (typeof option === 'string') {
                return { value: option, label_key: option };
              }
              // Fallback for any other format
              return { value: String(option), label_key: String(option) };
            })
          };
        }
        
        return field;
      })
    };
    
    console.log('Enhanced step with transformed options:', enhancedStep);
    return enhancedStep;
  };

  const currentStepData = getCurrentStepData();
  const completionPercentage = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
  const selectedPackageDetails = packages.find(pkg => pkg.value === selectedPackage);

  // Show loading state for packages
  if (packagesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loadingPackages', 'Loading packages...')}</p>
        </div>
      </div>
    );
  }

  // Show loading state for steps (when package is selected but steps are loading)
  if (selectedPackage && stepsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loadingSteps', 'Loading steps...')}</p>
        </div>
      </div>
    );
  }

  // If we don't have step data and not loading, show error
  if (!currentStepData && !stepsLoading && totalSteps === 0) {
    console.error('No step data available and no steps configured');
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">No steps configured. Please select a package first or contact support.</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Reload Page
          </Button>
        </div>
      </div>
    );
  }

  // If we're trying to access a step that doesn't exist
  if (!currentStepData && !stepsLoading && totalSteps > 0) {
    console.error('No step data available for step:', currentStep);
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error: Step {currentStep} not found</p>
          <Button onClick={() => setCurrentStep(1)} className="mt-4">
            Return to Step 1
          </Button>
        </div>
      </div>
    );
  }

  // If we don't have current step data but we're still loading, show loading
  if (!currentStepData && stepsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loadingSteps', 'Loading steps...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="max-w-7xl mx-0 my-[6px] py-0 px-[4px]">
        <div className="mb-12"></div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <StepIndicator currentStep={currentStep} />

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
                              {t(currentStepData.title_key)}
                            </h2>
                            <p className="text-purple-600 font-medium">
                              {t('stepPackage', 'Step')} {currentStep} {t('of', 'of')} {totalSteps}
                            </p>
                          </div>
                        </div>
                        <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-500">
                          <span>{t('progress', 'Progress')}:</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${completionPercentage}%` }} 
                            />
                          </div>
                          <span>{Math.round(completionPercentage)}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Package Details Section - Show when package is selected and it's step 1 */}
                    {selectedPackageDetails && currentStep === 1 && (
                      <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                        <div className="flex items-start space-x-4">
                          <div className="text-4xl">
                            {selectedPackageDetails.value === 'personal' ? '🎁' : 
                             selectedPackageDetails.value === 'business' ? '💼' : 
                             selectedPackageDetails.value === 'premium' ? '🌟' : 
                             selectedPackageDetails.value === 'artist' ? '🎤' : 
                             selectedPackageDetails.value === 'instrumental' ? '🎶' : 
                             selectedPackageDetails.value === 'remix' ? '🔁' : 
                             selectedPackageDetails.value === 'pachet-personal' ? '🎁' : '🎁'}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                              {t(selectedPackageDetails.label_key)}
                            </h3>
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="flex items-center space-x-2">
                                <span className="text-3xl font-bold text-purple-600">
                                  {selectedPackageDetails.price} RON
                                </span>
                              </div>
                              {selectedPackageDetails.delivery_time_key && (
                                <div className="flex items-center space-x-1 text-gray-600">
                                  <Clock className="w-4 h-4" />
                                  <span className="text-sm">{t(selectedPackageDetails.delivery_time_key)}</span>
                                </div>
                              )}
                            </div>
                            
                            {selectedPackageDetails.includes && selectedPackageDetails.includes.length > 0 && (
                              <div className="mb-4">
                                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                                  <Star className="w-4 h-4 mr-2 text-yellow-500" />
                                  {t('whatsIncluded', "What's Included")}
                                </h4>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {selectedPackageDetails.includes.map((include, index) => (
                                    <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                                      <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                                      <span>{t(include.include_key)}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="flex items-center space-x-2 text-sm text-green-600 font-medium">
                              <Shield className="w-4 h-4" />
                              <span>{t('professionalQuality', 'Professional Quality')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-8">
                      {currentStepData.fields && currentStepData.fields.map((field, index) => (
                        <div key={index} className="transform transition-all duration-200 hover:scale-[1.02]">
                          <FormFieldRenderer 
                            field={field} 
                            value={formData[field.field_name]} 
                            onChange={(value) => updateFormData(field.field_name, value)}
                            selectedAddons={selectedAddons}
                            onAddonChange={handleAddonChange}
                            availableAddons={addons}
                            addonFieldValues={addonFieldValues}
                            onAddonFieldChange={handleAddonFieldChange}
                            selectedPackage={selectedPackage}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-10 border-t mt-10">
                      <Button 
                        variant="outline" 
                        onClick={handlePrevious} 
                        disabled={currentStep === 1} 
                        className="px-8 py-3 font-semibold border-2 hover:bg-gray-50 disabled:opacity-50 transition-all duration-200"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t('previous', 'Previous')}
                      </Button>

                      <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                        {Array.from({ length: totalSteps }, (_, i) => (
                          <div 
                            key={i} 
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              i + 1 <= currentStep ? 'bg-purple-500' : 'bg-gray-300'
                            }`} 
                          />
                        ))}
                      </div>

                      {currentStep === totalSteps ? (
                        <Button 
                          onClick={handleSubmit} 
                          disabled={!canProceed() || isSubmitting} 
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              {t('submitting', 'Submitting...')}
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              {t('completeOrder', 'Complete Order')}
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleNext} 
                          disabled={!canProceed()} 
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                        >
                          {t('continue', 'Continue')}
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-8 space-y-6">
              <HelpSection />
              <TestimonialSection />
              {selectedPackage && (
                <OrderSummary selectedPackage={selectedPackage} selectedAddons={selectedAddons} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderWizard;
