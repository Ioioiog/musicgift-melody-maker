
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Gift, Check, AlertCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useValidateGiftCard } from '@/hooks/useGiftCards';
import { usePackages } from '@/hooks/usePackageData';
import { useGiftCardPricing } from '@/hooks/useGiftCardPricing';
import { useGiftCardRedemption } from '@/hooks/useGiftCardRedemption';
import { formatCurrency } from '@/utils/pricing';
import { motion } from 'framer-motion';
import { Package } from '@/types';
import PackageSelectionForGiftCard from './PackageSelectionForGiftCard';
import GiftCardRedemptionSummary from './GiftCardRedemptionSummary';

interface GiftRedemptionProps {
  onRedemption: (giftCard: any, selectedPackage: string, upgradeAmount?: number) => void;
}

const GiftRedemption: React.FC<GiftRedemptionProps> = ({
  onRedemption
}) => {
  const [giftCardCode, setGiftCardCode] = useState('');
  const [validatedGiftCard, setValidatedGiftCard] = useState<any>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [step, setStep] = useState<'validate' | 'select' | 'confirm'>('validate');
  
  const { toast } = useToast();
  const { t } = useLanguage();
  const { currency } = useCurrency();
  
  const { mutateAsync: validateGiftCard, isPending: isValidating } = useValidateGiftCard();
  const { data: packages, isLoading: isLoadingPackages } = usePackages();
  const redemptionMutation = useGiftCardRedemption();
  
  const pricing = useGiftCardPricing(validatedGiftCard, selectedPackage, currency);

  const handleValidateGiftCard = async () => {
    if (!giftCardCode.trim()) return;
    
    try {
      const result = await validateGiftCard(giftCardCode.trim());
      setValidatedGiftCard(result);
      setStep('select');
      
      const remainingText = result.remaining_balance ? 
        ` (${t('remainingBalance')}: ${formatCurrency(result.remaining_balance, currency)})` : '';
      
      toast({
        title: t('validGiftCard'),
        description: `${t('giftCardValue')}: ${formatCurrency(result.remaining_balance || result.gift_amount || result.amount_eur || result.amount_ron || 0, currency)}${remainingText}`
      });
    } catch (error: any) {
      console.error('Error validating gift card:', error);
      toast({
        title: "Error",
        description: error.message || t('invalidGiftCardCode'),
        variant: "destructive"
      });
      setValidatedGiftCard(null);
    }
  };

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
  };

  const handleProceedToConfirm = () => {
    if (selectedPackage) {
      setStep('confirm');
    }
  };

  const handleConfirmRedemption = async () => {
    if (!validatedGiftCard || !selectedPackage) return;

    try {
      // Calculate redemption amount (minimum of available balance and package price)
      const availableBalance = validatedGiftCard.remaining_balance || validatedGiftCard.gift_amount || validatedGiftCard.amount_eur || validatedGiftCard.amount_ron || 0;
      const redeemAmount = Math.min(availableBalance, pricing.packagePrice);
      const remainingBalance = Math.max(0, availableBalance - redeemAmount);

      // Create redemption record
      await redemptionMutation.mutateAsync({
        giftCardId: validatedGiftCard.id,
        packageValue: selectedPackage.value,
        packageName: t(selectedPackage.label_key),
        redeemAmount: redeemAmount,
        remainingBalance: remainingBalance,
      });

      // Call the parent callback to proceed to order flow
      onRedemption(
        validatedGiftCard, 
        selectedPackage.value, 
        pricing.additionalPaymentRequired > 0 ? pricing.additionalPaymentRequired : undefined
      );
    } catch (error) {
      console.error('Redemption error:', error);
    }
  };

  const renderValidationStep = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-4"
    >
      <div>
        <p className="text-sm mb-4 text-orange-500">
          {t('enterGiftCardCode')}
        </p>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="giftCardCode" className="text-sm font-medium text-orange-500">
              {t('giftCardCode')}
            </Label>
            <Input
              id="giftCardCode"
              type="text"
              value={giftCardCode}
              onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
              placeholder={t('enterCodeHere')}
              disabled={isValidating}
              className="mt-1 bg-white/10 border-white/30 text-purple-600 placeholder:text-white-100"
            />
          </div>
          
          <Button
            onClick={handleValidateGiftCard}
            disabled={!giftCardCode.trim() || isValidating}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            {isValidating ? t('validatingCode') : t('validateGiftCard')}
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const renderPackageSelection = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6"
    >
      <Card className="bg-green-50/10 border-green-200/30">
        <CardHeader className="p-3">
          <CardTitle className="flex items-center gap-2 text-sm text-orange-500">
            <Check className="w-4 h-4" />
            {t('giftCardDetails')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-50">{t('giftCardValue')}:</span>
            <span className="font-medium text-orange-500">
              {formatCurrency(validatedGiftCard.remaining_balance || validatedGiftCard.gift_amount || validatedGiftCard.amount_eur || validatedGiftCard.amount_ron || 0, currency)}
            </span>
          </div>
          
          {/* Show status information */}
          <div className="flex justify-between text-sm">
            <span className="text-slate-50">Status:</span>
            <Badge variant={validatedGiftCard.status === 'active' ? 'default' : 'secondary'}>
              {validatedGiftCard.status === 'active' ? 'Active' : 
               validatedGiftCard.status === 'partially_redeemed' ? 'Partially Used' :
               validatedGiftCard.status}
            </Badge>
          </div>

          {/* Show total redeemed if any */}
          {validatedGiftCard.total_redeemed > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-50">Previously Used:</span>
              <span className="text-slate-400">
                {formatCurrency(validatedGiftCard.total_redeemed, currency)}
              </span>
            </div>
          )}

          {validatedGiftCard.message_text && (
            <div className="space-y-1">
              <span className="text-sm text-gray-600">{t('messageFromSender')}:</span>
              <p className="text-sm text-purple-600 bg-purple-50/10 p-2 rounded">
                "{validatedGiftCard.message_text}"
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div>
        <h3 className="text-sm font-medium mb-3 text-orange-500">
          {t('choosePackage')}
        </h3>
        <p className="text-sm mb-4 text-orange-500">
          {t('selectPackageToRedeem')}
        </p>
        
        {isLoadingPackages ? (
          <div className="text-center py-8 text-purple-500">
            Loading packages...
          </div>
        ) : packages && packages.length > 0 ? (
          <PackageSelectionForGiftCard
            packages={packages}
            giftCard={validatedGiftCard}
            selectedPackage={selectedPackage}
            onPackageSelect={handlePackageSelect}
            onProceed={handleProceedToConfirm}
          />
        ) : (
          <div className="text-center py-8 text-purple-500">
            No packages available
          </div>
        )}
      </div>

      <div className="flex justify-start">
        <Button 
          variant="outline" 
          onClick={() => {
            setStep('validate');
            setValidatedGiftCard(null);
            setSelectedPackage(null);
            setGiftCardCode('');
          }}
          className="border-white/30 text-white hover:bg-white/10"
        >
          {t('back')}
        </Button>
      </div>
    </motion.div>
  );

  const renderConfirmation = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6"
    >
      <GiftCardRedemptionSummary
        giftCard={validatedGiftCard}
        selectedPackage={selectedPackage!}
        pricing={pricing}
      />

      {/* Warning for partial redemption */}
      {pricing.remainingBalance > 0 && (
        <Card className="bg-blue-50/10 border-blue-200/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-blue-300 font-medium mb-1">Partial Redemption Notice</p>
                <p className="text-blue-200">
                  After this redemption, you will have {formatCurrency(pricing.remainingBalance, currency)} remaining on your gift card. 
                  You can use this balance for future purchases.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => setStep('select')}
          className="border-white/30 text-white hover:bg-white/10"
        >
          {t('back')}
        </Button>
        
        <Button
          onClick={handleConfirmRedemption}
          disabled={redemptionMutation.isPending}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        >
          {redemptionMutation.isPending ? 'Processing...' : 'Confirm Redemption'}
        </Button>
      </div>
    </motion.div>
  );

  return (
    <Card className="bg-transparent border-transparent shadow-none">
      <CardHeader className="px-2 sm:px-3">
        <CardTitle className="flex items-center gap-2 text-lg text-orange-500">
          <Gift className="w-5 h-5" />
          {t('redeemYourGiftCard')}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-3 space-y-4">
        {step === 'validate' && renderValidationStep()}
        {step === 'select' && renderPackageSelection()}
        {step === 'confirm' && renderConfirmation()}
      </CardContent>
    </Card>
  );
};

export default GiftRedemption;
