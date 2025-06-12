
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePackages } from '@/hooks/usePackageData';

interface OrderFormData {
  email?: string;
  fullName?: string;
  phone?: string;
  recipientName?: string;
  occasion?: string;
  package?: string;
  invoiceType?: string;
  companyName?: string;
  vatCode?: string;
  registrationNumber?: string;
  companyAddress?: string;
  representativeName?: string;
  address?: string;
  city?: string;
  acceptMentionObligation?: boolean;
  acceptDistribution?: boolean;
  finalNote?: boolean;
  [key: string]: any;
}

interface UseOrderWizardStateProps {
  preselectedPackage?: string;
}

export const useOrderWizardState = ({ preselectedPackage }: UseOrderWizardStateProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OrderFormData>({});
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [addonFieldValues, setAddonFieldValues] = useState<Record<string, any>>({});
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<string>('smartbill');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Add discount state
  const [appliedGiftCard, setAppliedGiftCard] = useState<any>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number; type: string } | null>(null);
  
  const navigate = useNavigate();
  const { data: packages = [] } = usePackages();

  useEffect(() => {
    if (preselectedPackage && packages.length > 0) {
      if (preselectedPackage === 'gift') {
        navigate('/gift');
        return;
      }
      
      setFormData(prev => ({ ...prev, package: preselectedPackage }));
      setCurrentStep(1); // Go to first form step
    }
  }, [packages, preselectedPackage, navigate]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePackageSelect = (packageValue: string) => {
    if (packageValue === 'gift') {
      navigate('/gift');
      return;
    }
    
    const newFormData = { package: packageValue };
    setFormData(newFormData);
    setSelectedAddons([]);
    setAddonFieldValues({});
    // Reset discounts when package changes
    setAppliedGiftCard(null);
    setAppliedDiscount(null);
  };

  const handleAddonChange = (addonId: string, checked: boolean) => {
    setSelectedAddons(prev => {
      if (checked) {
        return [...prev, addonId];
      } else {
        return prev.filter(id => id !== addonId);
      }
    });
  };

  const handleAddonFieldChange = (addonKey: string, fieldValue: any) => {
    setAddonFieldValues(prev => ({ ...prev, [addonKey]: fieldValue }));
  };

  const handleGiftCardApplied = (giftCard: any) => {
    setAppliedGiftCard(giftCard);
  };

  const handleDiscountApplied = (discount: { code: string; amount: number; type: string }) => {
    setAppliedDiscount(discount);
  };

  const handleGiftCardRemoved = () => {
    setAppliedGiftCard(null);
  };

  const handleDiscountRemoved = () => {
    setAppliedDiscount(null);
  };

  return {
    currentStep,
    setCurrentStep,
    formData,
    selectedAddons,
    addonFieldValues,
    selectedPaymentProvider,
    setSelectedPaymentProvider,
    isSubmitting,
    setIsSubmitting,
    appliedGiftCard,
    appliedDiscount,
    handleInputChange,
    handlePackageSelect,
    handleAddonChange,
    handleAddonFieldChange,
    handleGiftCardApplied,
    handleDiscountApplied,
    handleGiftCardRemoved,
    handleDiscountRemoved
  };
};
