
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface OrderWizardProps {
  onComplete: (data: any) => void;
}

const OrderWizard: React.FC<OrderWizardProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [formData, setFormData] = useState<any>({});
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const { toast } = useToast();

  const packages = [
    { value: 'personal', label: 'Pachet Personal - 300 RON' },
    { value: 'business', label: 'Pachet Business - 500 RON' },
    { value: 'premium', label: 'Pachet Premium - 500 RON' },
    { value: 'artist', label: 'Pachet Artist - 8000 RON' },
    { value: 'instrumental', label: 'Pachet Instrumental - 500 RON' },
    { value: 'remix', label: 'Pachet Remix - 500 RON' },
    { value: 'gift', label: 'Pachet Cadou' },
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
    const commonSteps = [
      {
        step: 1,
        title: "Selectează pachetul",
        fields: [
          { name: "package", type: "select", placeholder: "Alege un pachet", required: true }
        ]
      },
      {
        step: 2,
        title: "Date despre client",
        fields: [
          { name: "fullName", type: "text", placeholder: "Nume complet", required: true },
          { name: "email", type: "email", placeholder: "Email", required: true },
          { name: "phone", type: "tel", placeholder: "Telefon", required: true },
          { name: "language", type: "select", placeholder: "Limba piesei (RO, EN, FR etc.)", required: true }
        ]
      }
    ];

    const packageSpecificSteps: any = {
      personal: [
        {
          step: 3,
          title: "Detalii despre destinatar",
          fields: [
            { name: "recipientName", type: "text", placeholder: "Numele destinatarului", required: true },
            { name: "occasion", type: "text", placeholder: "Ocazia (ex: aniversare, nuntă)", required: true },
            { name: "story", type: "textarea", placeholder: "Spune-ne povestea", required: true },
            { name: "keywords", type: "text", placeholder: "Cuvinte cheie importante", required: false },
            { name: "pronunciationAudio", type: "file", placeholder: "Încarcă pronunția (opțional)", required: false }
          ]
        },
        {
          step: 4,
          title: "Alege Add-ons",
          fields: [
            { name: "addons", type: "checkbox-group", options: ["rushDelivery", "commercialRights", "distributieMangoRecords", "customVideo", "audioMessageFromSender", "extendedSong"] }
          ]
        },
        {
          step: 5,
          title: "Confirmări",
          fields: [
            { name: "acceptMention", type: "checkbox", placeholder: "Accept să menționez MusicGift.ro by Mango Records dacă public melodia", required: true }
          ]
        }
      ],
      remix: [
        {
          step: 3,
          title: "Date despre piesa originală",
          fields: [
            { name: "originalTitle", type: "text", placeholder: "Numele piesei originale", required: true },
            { name: "originalWav", type: "file", placeholder: "Link sau fișier WAV", required: true },
            { name: "style", type: "text", placeholder: "Stil dorit pentru remix (ex: deep house)", required: true },
            { name: "label", type: "select", placeholder: "Alege eticheta: Mango Records / Mihai Gruia", required: true }
          ]
        },
        {
          step: 4,
          title: "Alege Add-ons",
          fields: [
            { name: "addons", type: "checkbox-group", options: ["rushDelivery", "customVideo", "distributieMangoRecords"] }
          ]
        },
        {
          step: 5,
          title: "Confirmări",
          fields: [
            { name: "acceptRights", type: "checkbox", placeholder: "Declar că dețin drepturile asupra piesei originale", required: true }
          ]
        }
      ],
      business: [
        {
          step: 3,
          title: "Detalii despre brand",
          fields: [
            { name: "brandName", type: "text", placeholder: "Nume companie / brand", required: true },
            { name: "campaignPurpose", type: "textarea", placeholder: "Scopul piesei (ex: branding, campanie promoțională)", required: true },
            { name: "story", type: "textarea", placeholder: "Povestea brandului / valori", required: false },
            { name: "keywords", type: "text", placeholder: "Cuvinte cheie importante", required: false },
            { name: "pronunciationAudio", type: "file", placeholder: "Încarcă pronunția (dacă este relevant)", required: false }
          ]
        },
        {
          step: 4,
          title: "Alege Add-ons",
          fields: [
            { name: "addons", type: "checkbox-group", options: ["rushDelivery", "customVideo", "audioMessageFromSender", "commercialRightsUpgrade", "extendedSong"] }
          ]
        },
        {
          step: 5,
          title: "Confirmări",
          fields: [
            { name: "acceptContact", type: "checkbox", placeholder: "Accept să fiu contactat în 24–48h pentru validare", required: true }
          ]
        }
      ],
      artist: [
        {
          step: 3,
          title: "Date despre cariera artistică",
          fields: [
            { name: "artistName", type: "text", placeholder: "Nume de scenă", required: true },
            { name: "songStyle", type: "text", placeholder: "Gen muzical dorit", required: true },
            { name: "artistBio", type: "textarea", placeholder: "Biografie / poveste artistică", required: false },
            { name: "linksReleases", type: "text", placeholder: "Linkuri către melodii lansate", required: false },
            { name: "linksMedia", type: "text", placeholder: "Linkuri apariții media / YouTube", required: false }
          ]
        },
        {
          step: 4,
          title: "Confirmări lansare",
          fields: [
            { name: "acceptContact", type: "checkbox", placeholder: "Accept să fiu contactat în 24–48h", required: true },
            { name: "acceptFlow", type: "checkbox", placeholder: "Am înțeles și accept procesul: 7 zile pentru piesa + instrumental → înregistrez vocea → în 5 zile primesc piesa finală → semnez acord 50/50 cu Mango Records", required: true }
          ]
        }
      ],
      premium: [
        {
          step: 3,
          title: "Informații pentru piesă și lansare",
          fields: [
            { name: "message", type: "textarea", placeholder: "Mesajul principal / povestea care vrei să fie transmisă", required: true },
            { name: "visualMaterial", type: "file", placeholder: "Încarcă poze/video pentru videoclip (opțional)", required: false }
          ]
        },
        {
          step: 4,
          title: "Alege Add-ons",
          fields: [
            { name: "addons", type: "checkbox-group", options: ["rushDelivery", "customVideo", "audioMessageFromSender", "extendedSong"] }
          ]
        }
      ],
      gift: [
        {
          step: 3,
          title: "Detalii pentru cadou",
          fields: [
            { name: "recipientName", type: "text", placeholder: "Prenume destinatar", required: true },
            { name: "recipientEmail", type: "email", placeholder: "Email destinatar", required: true },
            { name: "giftMessage", type: "textarea", placeholder: "Mesaj personalizat pentru cardul cadou", required: false }
          ]
        }
      ],
      instrumental: [
        {
          step: 3,
          title: "Detalii despre instrumental",
          fields: [
            { name: "artistName", type: "text", placeholder: "Numele artistului", required: true },
            { name: "desiredStyle", type: "text", placeholder: "Gen muzical dorit (ex: pop, trap, baladă)", required: true },
            { name: "instrumentalReference", type: "text", placeholder: "Link către o piesă de referință (opțional)", required: false },
            { name: "keywords", type: "text", placeholder: "Cuvinte cheie pentru mood/versuri (opțional)", required: false }
          ]
        },
        {
          step: 4,
          title: "Alege Add-ons",
          fields: [
            { name: "addons", type: "checkbox-group", options: ["rushDelivery", "customVideo", "distributieMangoRecords"] }
          ]
        }
      ]
    };

    return [...commonSteps, ...(packageSpecificSteps[selectedPackage] || [])];
  };

  const allSteps = getStepsForPackage();
  const maxSteps = allSteps.length;
  const currentStepData = allSteps.find(step => step.step === currentStep);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'package') {
      setSelectedPackage(value);
      if (currentStep > 2) {
        setCurrentStep(3);
      }
    }
  };

  const handleAddonChange = (addonId: string, checked: boolean) => {
    if (checked) {
      setSelectedAddons(prev => [...prev, addonId]);
    } else {
      setSelectedAddons(prev => prev.filter(id => id !== addonId));
    }
  };

  const renderField = (field: any) => {
    switch (field.type) {
      case 'select':
        if (field.name === 'package') {
          return (
            <Select onValueChange={(value) => updateFormData(field.name, value)} value={formData[field.name] || ''}>
              <SelectTrigger>
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
            <Select onValueChange={(value) => updateFormData(field.name, value)} value={formData[field.name] || ''}>
              <SelectTrigger>
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
        if (field.name === 'label') {
          return (
            <Select onValueChange={(value) => updateFormData(field.name, value)} value={formData[field.name] || ''}>
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mango">Mango Records</SelectItem>
                <SelectItem value="mihai">Mihai Gruia</SelectItem>
              </SelectContent>
            </Select>
          );
        }
        break;

      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => updateFormData(field.name, e.target.value)}
            className="min-h-[100px]"
          />
        );

      case 'file':
        return (
          <Input
            type="file"
            onChange={(e) => updateFormData(field.name, e.target.files?.[0])}
            accept={field.name === 'pronunciationAudio' ? 'audio/*' : field.name === 'visualMaterial' ? 'image/*,video/*' : '*/*'}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.name}
              checked={formData[field.name] || false}
              onCheckedChange={(checked) => updateFormData(field.name, checked)}
            />
            <Label htmlFor={field.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {field.placeholder}
            </Label>
          </div>
        );

      case 'checkbox-group':
        return (
          <div className="space-y-3">
            {field.options?.map((addonId: string) => {
              const addon = addons[addonId as keyof typeof addons];
              return addon ? (
                <div key={addonId} className="flex items-center space-x-2">
                  <Checkbox
                    id={addonId}
                    checked={selectedAddons.includes(addonId)}
                    onCheckedChange={(checked) => handleAddonChange(addonId, checked as boolean)}
                  />
                  <Label htmlFor={addonId} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {addon.label} (+{addon.price} RON)
                  </Label>
                </div>
              ) : null;
            })}
          </div>
        );

      default:
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => updateFormData(field.name, e.target.value)}
          />
        );
    }
  };

  const canProceed = () => {
    if (!currentStepData) return false;
    
    return currentStepData.fields.every(field => {
      if (!field.required) return true;
      if (field.type === 'checkbox-group') return true;
      return formData[field.name];
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

  if (!currentStepData) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-2xl">
            Pasul {currentStep} din {maxSteps}: {currentStepData.title}
          </CardTitle>
          <div className="text-sm text-gray-500">
            {Math.round((currentStep / maxSteps) * 100)}%
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(currentStep / maxSteps) * 100}%` }}
          ></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentStepData.fields.map((field, index) => (
          <div key={index} className="space-y-2">
            <Label className="text-sm font-medium">
              {field.placeholder} {field.required && <span className="text-red-500">*</span>}
            </Label>
            {renderField(field)}
          </div>
        ))}

        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Înapoi</span>
          </Button>

          {currentStep === maxSteps ? (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed()}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center space-x-2"
            >
              <span>Finalizează Comanda</span>
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center space-x-2"
            >
              <span>Următorul</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderWizard;
