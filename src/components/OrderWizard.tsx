import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Phone, Mail, Clock, Check } from 'lucide-react';

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

  const packages = [
    { 
      value: 'personal', 
      label: 'Pachet Personal',
      price: 300,
      details: {
        price: '300 RON',
        deliveryTime: '7-10 zile',
        includes: [
          'Melodie personalizată compusă special pentru tine',
          'Producție audio profesională',
          'Voce înregistrată de artist profesionist',
          'Mix și master final',
          'Fișier audio de înaltă calitate (WAV + MP3)'
        ]
      }
    },
    { 
      value: 'business', 
      label: 'Pachet Business',
      price: 500,
      details: {
        price: '500 RON',
        deliveryTime: '5-7 zile',
        includes: [
          'Melodie comercială pentru brand/companie',
          'Producție audio profesională',
          'Voce înregistrată de artist profesionist',
          'Mix și master final',
          'Drepturi comerciale de bază incluse',
          'Fișiere audio multiple (WAV, MP3, instrumental)'
        ]
      }
    },
    { 
      value: 'premium', 
      label: 'Premium Package',
      price: 1000,
      details: {
        price: '1000 RON',
        deliveryTime: '7-10 zile',
        includes: [
          'Melodie premium cu producție avansată',
          'Distribuție automată pe platforme digitale',
          'Videoclip lyric inclus',
          'Mix și master profesional',
          'Promovare pe rețelele sociale Mango Records'
        ]
      }
    },
    { 
      value: 'artist', 
      label: 'Pachet Artist',
      price: 8000,
      details: {
        price: '8000 RON',
        deliveryTime: '14-21 zile',
        includes: [
          'Colaborare artistică completă',
          'Producția unei melodii originale',
          'Înregistrare vocală profesională',
          'Videoclip muzical profesional',
          'Distribuție pe toate platformele',
          'Contract 50/50 cu Mango Records',
          'Promovare și marketing profesional'
        ]
      }
    },
    { 
      value: 'instrumental', 
      label: 'Pachet Instrumental',
      price: 500,
      details: {
        price: '500 RON',
        deliveryTime: '5-7 zile',
        includes: [
          'Instrumental personalizat în genul dorit',
          'Producție audio profesională',
          'Mix și master final',
          'Fișiere audio multiple (WAV, MP3)',
          'Stems separate pentru mixing'
        ]
      }
    },
    { 
      value: 'remix', 
      label: 'Pachet Remix',
      price: 500,
      details: {
        price: '500 RON',
        deliveryTime: '5-7 zile',
        includes: [
          'Remix profesional al piesei tale',
          'Producție în stilul dorit',
          'Mix și master final',
          'Versiune extended și radio edit',
          'Fișiere audio de înaltă calitate'
        ]
      }
    },
    { 
      value: 'gift', 
      label: 'Pachet Cadou',
      price: 0,
      details: {
        price: 'Variabil',
        deliveryTime: 'Conform pachetului ales',
        includes: [
          'Card cadou digital personalizat',
          'Mesaj personalizat pentru destinatar',
          'Trimitere automată la data dorită',
          'Toate beneficiile pachetului selectat'
        ]
      }
    },
  ];

  const languages = [
    { value: 'ro', label: 'Română' },
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'pl', label: 'Polski' },
  ];

  const addons = {
    rushDelivery: { label: 'Livrare rapidă (24–48h)', price: 100 },
    commercialRights: { label: 'Drepturi comerciale', price: 100 },
    distributieMangoRecords: { label: 'Distribuție Mango Records', price: 200 },
    customVideo: { label: 'Videoclip personalizat', price: 149 },
    audioMessageFromSender: { label: 'Mesaj audio de la expeditor', price: 100 },
    commercialRightsUpgrade: { label: 'Upgrade drepturi comerciale', price: 400 },
    extendedSong: { label: 'Melodie extinsă (3 strofe)', price: 49 },
  };

  const getStepsForPackage = () => {
    const stepTitles = {
      1: "Package",
      2: "Details", 
      3: "Story",
      4: "Preferences",
      5: "Contact"
    };

    const commonSteps = [
      {
        step: 1,
        title: stepTitles[1],
        fields: [
          { name: "package", type: "select", placeholder: "Alege un pachet", required: true }
        ]
      },
      {
        step: 2,
        title: stepTitles[2],
        fields: [
          { name: "fullName", type: "text", placeholder: "Nume complet", required: true },
          { name: "email", type: "email", placeholder: "Email", required: true },
          { name: "phone", type: "tel", placeholder: "Telefon", required: true },
          { name: "language", type: "select", placeholder: "Limba piesei", required: true }
        ]
      }
    ];

    const packageSpecificSteps: any = {
      personal: [
        {
          step: 3,
          title: stepTitles[3],
          fields: [
            { name: "recipientName", type: "text", placeholder: "Recipient's Name", required: true },
            { name: "occasion", type: "select", placeholder: "Occasion", required: true, options: ["Birthday", "Anniversary", "Wedding", "Valentine's Day", "Graduation", "Other"] },
            { name: "story", type: "textarea", placeholder: "Tell us your story...", required: true }
          ]
        },
        {
          step: 4,
          title: stepTitles[4],
          fields: [
            { name: "addons", type: "checkbox-group", options: ["rushDelivery", "commercialRights", "distributieMangoRecords", "customVideo", "audioMessageFromSender", "extendedSong"] }
          ]
        },
        {
          step: 5,
          title: stepTitles[5],
          fields: [
            { name: "acceptMention", type: "checkbox", placeholder: "Accept să menționez MusicGift.ro by Mango Records dacă public melodia", required: true }
          ]
        }
      ]
    };

    return [...commonSteps, ...(packageSpecificSteps[selectedPackage] || [])];
  };

  const allSteps = getStepsForPackage();
  const maxSteps = Math.max(5, allSteps.length);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    }
  };

  const getSelectedPackageDetails = () => {
    const packageDetails = packages.find(pkg => pkg.value === selectedPackage);
    console.log('Selected package details:', packageDetails);
    return packageDetails;
  };

  const calculateTotal = () => {
    const selectedPackageDetails = getSelectedPackageDetails();
    const basePrice = selectedPackageDetails?.price || 0;
    const addonsPrice = selectedAddons.reduce((total, addonId) => {
      const addon = addons[addonId as keyof typeof addons];
      return total + (addon?.price || 0);
    }, 0);
    return basePrice + addonsPrice;
  };

  const renderField = (field: any) => {
    switch (field.type) {
      case 'select':
        if (field.name === 'package') {
          return (
            <Select onValueChange={(value) => updateFormData(field.name, value)} value={formData[field.name]}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {packages.map((pkg) => (
                  <SelectItem key={pkg.value} value={pkg.value}>
                    {pkg.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        if (field.name === 'language') {
          return (
            <Select onValueChange={(value) => updateFormData(field.name, value)} value={formData[field.name]}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        if (field.name === 'occasion') {
          return (
            <Select onValueChange={(value) => updateFormData(field.name, value)} value={formData[field.name]}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option: string) => (
                  <SelectItem key={option} value={option.toLowerCase()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        break;

      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={(e) => updateFormData(field.name, e.target.value)}
            className="min-h-[120px] resize-none"
          />
        );

      case 'checkbox-group':
        return (
          <div className="space-y-4">
            {field.options?.map((addonId: string) => {
              const addon = addons[addonId as keyof typeof addons];
              return addon ? (
                <div key={addonId} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id={addonId}
                    checked={selectedAddons.includes(addonId)}
                    onCheckedChange={(checked) => handleAddonChange(addonId, checked as boolean)}
                  />
                  <Label htmlFor={addonId} className="flex-1 cursor-pointer">
                    <span className="font-medium">{addon.label}</span>
                    <span className="text-gray-600 ml-2">+{addon.price} RON</span>
                  </Label>
                </div>
              ) : null;
            })}
          </div>
        );

      case 'checkbox':
        return (
          <div className="flex items-start space-x-3">
            <Checkbox
              id={field.name}
              checked={formData[field.name]}
              onCheckedChange={(checked) => updateFormData(field.name, checked)}
              className="mt-1"
            />
            <Label htmlFor={field.name} className="text-sm leading-relaxed cursor-pointer">
              {field.placeholder}
            </Label>
          </div>
        );

      default:
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={(e) => updateFormData(field.name, e.target.value)}
            className="h-12"
          />
        );
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
  const selectedPackageDetails = getSelectedPackageDetails();

  console.log('Current selected package:', selectedPackage);
  console.log('Package details:', selectedPackageDetails);

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
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      step < currentStep ? 'bg-green-500 text-white' :
                      step === currentStep ? 'bg-purple-600 text-white' :
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {step < currentStep ? <Check className="w-5 h-5" /> : step}
                    </div>
                    {step < 5 && (
                      <div className={`h-1 w-16 mx-2 ${
                        step < currentStep ? 'bg-green-500' :
                        step === currentStep ? 'bg-purple-200' :
                        'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Package</span>
                <span>Details</span>
                <span>Story</span>
                <span>Preferences</span>
                <span>Contact</span>
              </div>
            </div>

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
                        <div key={index} className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            {field.placeholder} {field.required && <span className="text-red-500">*</span>}
                          </Label>
                          {renderField(field)}
                        </div>
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
            {/* Help Section */}
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-purple-900">Need Help?</h3>
                </div>
                <div className="space-y-3 text-sm text-purple-700">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    +40 721 234 567
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    info@musicgift.ro
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Mon-Fri: 9AM-6PM
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial */}
            <Card className="border-purple-200">
              <CardContent className="p-6">
                <blockquote className="text-sm text-gray-600 italic mb-4">
                  "Working with MusicGift was amazing. They understood our story perfectly and created something magical!"
                </blockquote>
                <cite className="text-purple-600 font-medium">— Radu & Elena</cite>
              </CardContent>
            </Card>

            {/* Order Summary */}
            {selectedPackageDetails && (
              <Card className="border-purple-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Package:</span>
                      <span className="font-medium">{selectedPackageDetails.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Price:</span>
                      <span className="font-medium">{selectedPackageDetails.details.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Time:</span>
                      <span className="font-medium">{selectedPackageDetails.details.deliveryTime}</span>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="text-sm text-gray-600 mb-2">Package includes:</div>
                      <ul className="text-xs text-gray-500 space-y-1">
                        {selectedPackageDetails.details.includes.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    {selectedAddons.length > 0 && (
                      <div className="pt-2 border-t">
                        <div className="text-sm text-gray-600 mb-2">Add-ons:</div>
                        {selectedAddons.map(addonId => {
                          const addon = addons[addonId as keyof typeof addons];
                          return addon ? (
                            <div key={addonId} className="flex justify-between text-sm">
                              <span>{addon.label}</span>
                              <span>+{addon.price} RON</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}
                    <div className="flex justify-between pt-3 border-t font-semibold text-lg">
                      <span>Total:</span>
                      <span>{calculateTotal()} RON</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderWizard;
