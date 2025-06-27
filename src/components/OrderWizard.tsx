
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOrderWizardState } from "@/hooks/useOrderWizardState";
import { usePackages, useAddons } from "@/hooks/usePackageData";
import { useNavigate } from 'react-router-dom';
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormFieldRenderer from './order/FormFieldRenderer';
import PackageSelectionStep from './order/PackageSelectionStep';
import { getPackagePrice, getAddonPrice } from '@/utils/pricing';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useOrderPayment } from '@/hooks/useOrderPayment';
import OrderPaymentStatusChecker from './order/OrderPaymentStatusChecker';

interface OrderWizardProps {
  onComplete: (orderData: any) => void;
  giftCard?: any;
  appliedDiscount?: any;
  preselectedPackage?: string;
  onOrderDataChange?: (orderData: any) => void;
  paymentResponse?: any;
  onPaymentResponseHandled?: () => void;
}

const OrderWizard: React.FC<OrderWizardProps> = ({
  onComplete,
  giftCard,
  appliedDiscount,
  preselectedPackage,
  onOrderDataChange,
  paymentResponse,
  onPaymentResponseHandled
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currency } = useCurrency();
  const { data: packages = [] } = usePackages();
  const { data: addons = [] } = useAddons();

  const {
    currentStep,
    setCurrentStep,
    formData,
    selectedAddons,
    addonFieldValues,
    selectedPaymentProvider,
    setSelectedPaymentProvider,
    isSubmitting,
    setIsSubmitting,
    handleInputChange,
    handlePackageSelect,
    handleAddonChange,
    handleAddonFieldChange
  } = useOrderWizardState({ preselectedPackage });
  const { openPaymentWindow, isPaymentProcessing, paymentProvider } = useOrderPayment();

  // Handle payment response when received
  useEffect(() => {
    if (paymentResponse?.paymentUrl && paymentResponse?.provider && paymentResponse?.orderId) {
      console.log('🔗 Opening payment URL in new tab:', paymentResponse.paymentUrl);
      
      try {
        openPaymentWindow(
          paymentResponse.paymentUrl, 
          paymentResponse.provider, 
          paymentResponse.orderId
        );
        
        // Clear the payment response after handling
        if (onPaymentResponseHandled) {
          onPaymentResponseHandled();
        }
      } catch (error) {
        console.error('❌ Error opening payment window:', error);
      }
    }
  }, [paymentResponse, openPaymentWindow, onPaymentResponseHandled]);

  useEffect(() => {
    if (onOrderDataChange) {
      onOrderDataChange({
        ...formData,
        addons: selectedAddons,
        addonFieldValues: addonFieldValues,
        paymentProvider: selectedPaymentProvider
      });
    }
  }, [formData, selectedAddons, addonFieldValues, selectedPaymentProvider, onOrderDataChange]);

  const selectedPackage = packages.find(pkg => pkg.value === formData.package);
  const steps = selectedPackage?.steps || [];

  const validationSchema = React.useMemo(() => {
    // Don't create validation schema for step 0 (package selection)
    if (currentStep === 0) {
      return z.object({});
    }

    const shape: { [key: string]: z.ZodTypeAny } = {};

    // Only validate current step fields for steps 1 to steps.length
    if (currentStep > 0 && currentStep <= steps.length) {
      const currentStepData = steps[currentStep - 1];
      if (currentStepData && currentStepData.fields) {
        currentStepData.fields.forEach((field: any) => {
          let fieldSchema: z.ZodTypeAny = z.string().optional();

          if (field.required) {
            fieldSchema = z.string().min(1, { message: t('fieldRequired', 'This field is required') });
          }

          if (field.type === 'email') {
            if (field.required) {
              fieldSchema = z.string().min(1, { message: t('fieldRequired', 'This field is required') }).email({ message: t('invalidEmail', 'Please enter a valid email address') });
            } else {
              fieldSchema = z.string().email({ message: t('invalidEmail', 'Please enter a valid email address') }).optional();
            }
          }

          if (field.type === 'url') {
            if (field.required) {
              fieldSchema = z.string().min(1, { message: t('fieldRequired', 'This field is required') }).url({ message: t('invalidUrl', 'Please enter a valid URL') });
            } else {
              fieldSchema = z.string().url({ message: t('invalidUrl', 'Please enter a valid URL') }).optional();
            }
          }

          shape[field.key] = fieldSchema;
        });
      }
    }

    // Add validation for final step (contact details & legal)
    if (currentStep > steps.length) {
      shape['invoiceType'] = z.string().min(1, { message: t('fieldRequired', 'This field is required') });
      if (formData.invoiceType === 'company') {
        shape['companyName'] = z.string().min(1, { message: t('fieldRequired', 'This field is required') });
        shape['vatCode'] = z.string().optional();
        shape['registrationNumber'] = z.string().optional();
        shape['companyAddress'] = z.string().min(1, { message: t('fieldRequired', 'This field is required') });
        shape['representativeName'] = z.string().min(1, { message: t('fieldRequired', 'This field is required') });
      } else {
        shape['address'] = z.string().min(1, { message: t('fieldRequired', 'This field is required') });
        shape['city'] = z.string().min(1, { message: t('fieldRequired', 'This field is required') });
      }

      // Add terms and conditions fields to the schema
      shape['acceptMentionObligation'] = z.boolean().refine(value => value === true, {
        message: t('fieldRequired', 'This field is required'),
      });
      shape['acceptDistribution'] = z.boolean().refine(value => value === true, {
        message: t('fieldRequired', 'This field is required'),
      });
      shape['finalNote'] = z.boolean().refine(value => value === true, {
        message: t('fieldRequired', 'This field is required'),
      });
    }

    return z.object(shape);
  }, [steps, formData.invoiceType, t, currentStep]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(validationSchema),
    mode: "onChange",
    defaultValues: formData
  });

  const onSubmit = async (data: any) => {
    console.log('Form submitted, current step:', currentStep);
    
    // Handle package selection step (step 0)
    if (currentStep === 0) {
      if (!formData.package) {
        toast({
          title: t('selectPackageFirst'),
          description: t('pleaseSelectPackage', 'Please select a package to continue'),
          variant: "destructive"
        });
        return;
      }
      // Move to first form step after package selection
      setCurrentStep(1);
      return;
    }

    // Handle form steps (steps 1 to steps.length)
    if (currentStep > 0 && currentStep < steps.length) {
      console.log('Moving to next step:', currentStep + 1);
      setCurrentStep(currentStep + 1);
      return;
    }

    // Handle moving from last form step to final step
    if (currentStep === steps.length) {
      console.log('Moving to final step (contact & legal)');
      setCurrentStep(currentStep + 1);
      return;
    }

    // Handle final submission (contact details & legal step)
    if (currentStep > steps.length) {
      console.log('Final submission');
      setIsSubmitting(true);
      try {
        const orderData = {
          ...formData,
          ...data,
          addons: selectedAddons,
          addonFieldValues: addonFieldValues,
          paymentProvider: selectedPaymentProvider
        };
        await onComplete(orderData);
      } catch (error: any) {
        toast({
          title: t('orderError'),
          description: error.message || t('orderErrorMessage'),
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePaymentProviderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPaymentProvider(event.target.value);
  };

  const totalPrice = selectedPackage ? getPackagePrice(selectedPackage, currency) : 0;
  const addonsPrice = selectedAddons.reduce((total, addonKey) => {
    const addon = addons.find(a => a.addon_key === addonKey);
    return total + (addon ? getAddonPrice(addon, currency) : 0);
  }, 0);
  const totalOrderPrice = totalPrice + addonsPrice;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white/30">
      {/* Show payment status checker when payment is processing */}
      {isPaymentProcessing && (
        <div className="mb-6">
          <OrderPaymentStatusChecker
            orderId={paymentResponse?.orderId}
            provider={paymentProvider}
            onClose={() => {
              // Handle close if needed
            }}
          />
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {currentStep === 0 ? (
          // Package Selection Step
          <PackageSelectionStep
            selectedPackage={formData.package}
            onPackageSelect={handlePackageSelect}
          />
        ) : currentStep <= steps.length ? (
          <>
            <h2 className="text-lg font-semibold text-white">{t('stepPackage', 'Step')} {currentStep} {t('of', 'of')} {steps.length}</h2>
            <Separator className="my-2 bg-white/20" />

            {steps[currentStep - 1] && steps[currentStep - 1].fields.map((field: any) => (
              <FormFieldRenderer
                key={field.key}
                field={field}
                value={formData[field.key]}
                onChange={(value) => handleInputChange(field.key, value)}
                selectedAddons={selectedAddons}
                onAddonChange={handleAddonChange}
                availableAddons={addons}
                addonFieldValues={addonFieldValues}
                onAddonFieldChange={handleAddonFieldChange}
                selectedPackage={formData.package}
                selectedPackageData={selectedPackage}
                formData={formData}
              />
            ))}
          </>
        ) : (
          // Contact Details & Legal Step
          <>
            <h2 className="text-lg font-semibold text-white">{t('contactDetailsStep', 'Contact Details & Legal')}</h2>
            <Separator className="my-2 bg-white/20" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoiceType" className="text-white/80">{t('invoiceType', 'Invoice Type')}</Label>
                <select
                  id="invoiceType"
                  className="w-full bg-white/10 border-white/30 rounded px-3 py-2 text-white/80 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.invoiceType || ''}
                  {...register('invoiceType')}
                  onChange={(e) => {
                    handleInputChange('invoiceType', e.target.value);
                  }}
                >
                  <option value="individual">{t('individual', 'Individual')}</option>
                  <option value="company">{t('company', 'Company')}</option>
                </select>
                {errors.invoiceType && <p className="text-red-500 text-sm mt-1">{errors.invoiceType.message}</p>}
              </div>

              {formData.invoiceType === 'company' ? (
                <>
                  <div>
                    <Label htmlFor="companyName" className="text-white/80">{t('companyName', 'Company Name')}</Label>
                    <Input
                      type="text"
                      id="companyName"
                      className="bg-white/10 border-white/30 text-white/80"
                      {...register('companyName')}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                    />
                    {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="vatCode" className="text-white/80">{t('vatCode', 'VAT Code')}</Label>
                    <Input
                      type="text"
                      id="vatCode"
                      className="bg-white/10 border-white/30 text-white/80"
                      {...register('vatCode')}
                      onChange={(e) => handleInputChange('vatCode', e.target.value)}
                    />
                    {errors.vatCode && <p className="text-red-500 text-sm mt-1">{errors.vatCode.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="registrationNumber" className="text-white/80">{t('registrationNumber', 'Registration Number')}</Label>
                    <Input
                      type="text"
                      id="registrationNumber"
                      className="bg-white/10 border-white/30 text-white/80"
                      {...register('registrationNumber')}
                      onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                    />
                    {errors.registrationNumber && <p className="text-red-500 text-sm mt-1">{errors.registrationNumber.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="companyAddress" className="text-white/80">{t('companyAddress', 'Company Address')}</Label>
                    <Input
                      type="text"
                      id="companyAddress"
                      className="bg-white/10 border-white/30 text-white/80"
                      {...register('companyAddress')}
                      onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                    />
                    {errors.companyAddress && <p className="text-red-500 text-sm mt-1">{errors.companyAddress.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="representativeName" className="text-white/80">{t('representativeName', 'Representative Name')}</Label>
                    <Input
                      type="text"
                      id="representativeName"
                      className="bg-white/10 border-white/30 text-white/80"
                      {...register('representativeName')}
                      onChange={(e) => handleInputChange('representativeName', e.target.value)}
                    />
                    {errors.representativeName && <p className="text-red-500 text-sm mt-1">{errors.representativeName.message}</p>}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="address" className="text-white/80">{t('address', 'Address')}</Label>
                    <Input
                      type="text"
                      id="address"
                      className="bg-white/10 border-white/30 text-white/80"
                      {...register('address')}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-white/80">{t('city', 'City')}</Label>
                    <Input
                      type="text"
                      id="city"
                      className="bg-white/10 border-white/30 text-white/80"
                      {...register('city')}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                  </div>
                </>
              )}
            </div>

            <h2 className="text-lg font-semibold text-white mt-6">{t('selectAddons', 'Select Add-ons')}</h2>
            <Separator className="my-2 bg-white/20" />

            {addons.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {addons.map(addon => (
                  <Card key={addon.addon_key} className="bg-white/05 backdrop-blur-sm border border-white/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={addon.addon_key} className="text-white/80">{addon.label_key}</Label>
                        <Checkbox
                          id={addon.addon_key}
                          checked={selectedAddons.includes(addon.addon_key)}
                          onCheckedChange={(checked) => handleAddonChange(addon.addon_key, Boolean(checked))}
                          className="border-white/30 focus:ring-orange-500"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-white/80">{t('noAddonsAvailable', 'No add-ons available for this package')}</p>
            )}

            <h2 className="text-lg font-semibold text-white mt-6">{t('confirmation', 'Confirmation')}</h2>
            <Separator className="my-2 bg-white/20" />

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptMentionObligation"
                  className="border-white/30 focus:ring-orange-500"
                  {...register('acceptMentionObligation')}
                />
                <Label htmlFor="acceptMentionObligation" className="text-white/80">{t('acceptMentionObligation', 'I accept the mention obligation')}</Label>
                {errors.acceptMentionObligation && <p className="text-red-500 text-sm mt-1">{errors.acceptMentionObligation.message}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptDistribution"
                  className="border-white/30 focus:ring-orange-500"
                  {...register('acceptDistribution')}
                />
                <Label htmlFor="acceptDistribution" className="text-white/80">{t('acceptDistribution', 'I accept distribution')}</Label>
                {errors.acceptDistribution && <p className="text-red-500 text-sm mt-1">{errors.acceptDistribution.message}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="finalNote"
                  className="border-white/30 focus:ring-orange-500"
                  {...register('finalNote')}
                />
                <Label htmlFor="finalNote" className="text-white/80">{t('finalNote', 'I agree to final terms')}</Label>
                {errors.finalNote && <p className="text-red-500 text-sm mt-1">{errors.finalNote.message}</p>}
              </div>
            </div>

            <h2 className="text-lg font-semibold text-white mt-6">{t('choosePaymentMethod', 'Choose Payment Method')}</h2>
            <Separator className="my-2 bg-white/20" />

            <div className="space-y-2">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="smartbill"
                    checked={selectedPaymentProvider === 'smartbill'}
                    onChange={handlePaymentProviderChange}
                    className="focus:ring-orange-500"
                  />
                  <span className="text-white/80">SmartBill</span>
                </label>
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="stripe"
                    checked={selectedPaymentProvider === 'stripe'}
                    onChange={handlePaymentProviderChange}
                    className="focus:ring-orange-500"
                  />
                  <span className="text-white/80">Stripe</span>
                </label>
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="revolut"
                    checked={selectedPaymentProvider === 'revolut'}
                    onChange={handlePaymentProviderChange}
                    className="focus:ring-orange-500"
                  />
                  <span className="text-white/80">Revolut</span>
                </label>
              </div>
              {giftCard && totalOrderPrice === 0 && (
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="gift_card"
                      checked={selectedPaymentProvider === 'gift_card'}
                      onChange={handlePaymentProviderChange}
                      className="focus:ring-orange-500"
                    />
                    <span className="text-white/80">{t('fullyCoveredByGiftCard', 'Fully covered by gift card')}</span>
                  </label>
                </div>
              )}
            </div>
          </>
        )}

        <div className="flex justify-between mt-6">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handlePrevious} className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              {t('previous', 'Previous')}
            </Button>
          )}
          <Button
            type="submit"
            className={cn(
              "bg-orange-500 hover:bg-orange-600 text-white",
              isSubmitting && "animate-pulse"
            )}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('submitting', 'Submitting...') : 
             currentStep === 0 ? t('continue', 'Continue') :
             currentStep <= steps.length ? t('continue', 'Continue') : 
             t('completeOrder', 'Complete order')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OrderWizard;
