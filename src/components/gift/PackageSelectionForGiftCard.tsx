
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useGiftCardPricing } from '@/hooks/useGiftCardPricing';
import { formatCurrency } from '@/utils/pricing';
import { Check, Plus, Minus } from 'lucide-react';

interface PackageSelectionForGiftCardProps {
  packages: Package[];
  giftCard: any;
  selectedPackage: Package | null;
  onPackageSelect: (pkg: Package) => void;
  onProceed: () => void;
}

const PackageSelectionForGiftCard: React.FC<PackageSelectionForGiftCardProps> = ({
  packages,
  giftCard,
  selectedPackage,
  onPackageSelect,
  onProceed,
}) => {
  const { t } = useLanguage();
  const { currency } = useCurrency();
  const pricing = useGiftCardPricing(giftCard, selectedPackage, currency);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map((pkg) => {
          const pkgPricing = useGiftCardPricing(giftCard, pkg, currency);
          const isSelected = selectedPackage?.id === pkg.id;
          
          return (
            <Card 
              key={pkg.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-orange-500 bg-orange-50/10' : ''
              }`}
              onClick={() => onPackageSelect(pkg)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-orange-500">
                    {t(pkg.label_key)}
                  </CardTitle>
                  {isSelected && (
                    <Check className="w-5 h-5 text-orange-500" />
                  )}
                </div>
                <p className="text-sm text-slate-200">
                  {formatCurrency(pkgPricing.packagePrice, currency)}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {pkg.includes?.slice(0, 3).map((include: any, idx: number) => (
                    <div key={idx} className="flex items-center text-sm text-slate-300">
                      <Check className="w-3 h-3 mr-2 text-green-400" />
                      {include.title}
                    </div>
                  ))}
                  {pkg.includes && pkg.includes.length > 3 && (
                    <p className="text-xs text-slate-400">
                      +{pkg.includes.length - 3} more features
                    </p>
                  )}
                </div>

                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Package Price:</span>
                    <span className="text-slate-200">
                      {formatCurrency(pkgPricing.packagePrice, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Gift Card Credit:</span>
                    <span className="text-green-400">
                      -{formatCurrency(pkgPricing.giftCardValue, currency)}
                    </span>
                  </div>
                  
                  {pkgPricing.additionalPaymentRequired > 0 ? (
                    <div className="flex justify-between text-sm border-t pt-2">
                      <span className="text-orange-400 flex items-center">
                        <Plus className="w-3 h-3 mr-1" />
                        Additional Payment:
                      </span>
                      <span className="text-orange-400 font-medium">
                        {formatCurrency(pkgPricing.additionalPaymentRequired, currency)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-sm border-t pt-2">
                      <span className="text-green-400 flex items-center">
                        <Minus className="w-3 h-3 mr-1" />
                        Refund:
                      </span>
                      <span className="text-green-400 font-medium">
                        {formatCurrency(pkgPricing.refundAmount, currency)}
                      </span>
                    </div>
                  )}
                </div>
                
                <Badge 
                  variant={pkgPricing.canAfford ? "default" : "secondary"}
                  className="w-full justify-center"
                >
                  {pkgPricing.canAfford ? "Fully Covered" : "Additional Payment Required"}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedPackage && (
        <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-orange-500">
                  Ready to proceed with {t(selectedPackage.label_key)}
                </h4>
                <p className="text-sm text-slate-300">
                  {pricing.additionalPaymentRequired > 0 
                    ? `Additional payment of ${formatCurrency(pricing.additionalPaymentRequired, currency)} required`
                    : pricing.refundAmount > 0
                    ? `You will receive a refund of ${formatCurrency(pricing.refundAmount, currency)}`
                    : "Package fully covered by gift card"
                  }
                </p>
              </div>
              <Button 
                onClick={onProceed}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {t('proceedWithPackage')} {t(selectedPackage.label_key)}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PackageSelectionForGiftCard;
