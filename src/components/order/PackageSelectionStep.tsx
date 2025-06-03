
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Clock, Gift } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { usePackages } from '@/hooks/usePackageData';
import { getPackagePrice } from '@/utils/pricing';

interface PackageSelectionStepProps {
  selectedPackage?: string;
  onPackageSelect: (packageValue: string) => void;
}

const PackageSelectionStep: React.FC<PackageSelectionStepProps> = ({
  selectedPackage,
  onPackageSelect
}) => {
  const { t } = useLanguage();
  const { currency } = useCurrency();
  const { data: packages = [] } = usePackages();

  const getTagColor = (tag?: string) => {
    switch (tag) {
      case 'popular':
        return 'bg-blue-500 text-white';
      case 'premium':
        return 'bg-purple-500 text-white';
      case 'new':
        return 'bg-green-500 text-white';
      case 'gift':
        return 'bg-pink-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getTagIcon = (tag?: string) => {
    switch (tag) {
      case 'gift':
        return <Gift className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{t('selectYourPackage')}</h2>
        <p className="text-gray-600">{t('choosePackage')}</p>
      </div>

      {/* Package Select Dropdown */}
      <div className="max-w-md mx-auto">
        <Select value={selectedPackage} onValueChange={onPackageSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('selectOption')} />
          </SelectTrigger>
          <SelectContent>
            {packages.map((pkg) => (
              <SelectItem key={pkg.value} value={pkg.value}>
                <div className="flex items-center justify-between w-full">
                  <span>{t(pkg.label_key)}</span>
                  <span className="ml-2 text-purple-600 font-semibold">
                    {currency === 'EUR' ? '€' : 'RON'} {getPackagePrice(pkg, currency)}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <Card
            key={pkg.value}
            className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedPackage === pkg.value
                ? 'ring-2 ring-purple-500 shadow-lg'
                : 'hover:shadow-md'
            }`}
            onClick={() => onPackageSelect(pkg.value)}
          >
            {pkg.tag && (
              <Badge
                className={`absolute -top-2 -right-2 z-10 ${getTagColor(pkg.tag)}`}
              >
                <div className="flex items-center gap-1">
                  {getTagIcon(pkg.tag)}
                  <span className="text-xs font-semibold">
                    {t(pkg.tag)}
                  </span>
                </div>
              </Badge>
            )}

            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {t(pkg.label_key)}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {t(pkg.tagline_key)}
              </p>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {currency === 'EUR' ? '€' : 'RON'} {getPackagePrice(pkg, currency)}
                </div>
                <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mt-1">
                  <Clock className="w-4 h-4" />
                  {t(pkg.delivery_time_key)}
                </div>
              </div>

              <Button
                className={`w-full ${
                  selectedPackage === pkg.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-purple-50'
                }`}
                variant={selectedPackage === pkg.value ? 'default' : 'outline'}
              >
                {selectedPackage === pkg.value ? (
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    {t('selected')}
                  </div>
                ) : (
                  t('selectOption')
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PackageSelectionStep;
