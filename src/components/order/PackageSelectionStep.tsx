
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Gift, Check } from 'lucide-react';
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

  const selectedPackageData = packages.find(pkg => pkg.value === selectedPackage);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 text-white">{t('selectYourPackage')}</h2>
        <p className="text-white/80">{t('choosePackage')}</p>
      </div>

      {/* Enhanced Package Select Dropdown */}
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-white/20">
          <CardContent className="p-4">
            <Select value={selectedPackage} onValueChange={onPackageSelect}>
              <SelectTrigger className="w-full h-16 text-left border-2 border-white/30 hover:border-purple-300 focus:border-purple-400 transition-colors bg-white/10 backdrop-blur-sm">
                <SelectValue placeholder={
                  <div className="flex items-center text-white/70">
                    <span>{t('selectOption')}</span>
                  </div>
                }>
                  {selectedPackageData && (
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center space-x-3">
                        {selectedPackageData.tag && (
                          <Badge className={`${getTagColor(selectedPackageData.tag)} text-xs px-2 py-1`}>
                            <div className="flex items-center gap-1">
                              {getTagIcon(selectedPackageData.tag)}
                              <span>{t(selectedPackageData.tag)}</span>
                            </div>
                          </Badge>
                        )}
                        <div>
                          <div className="font-semibold text-white">
                            {t(selectedPackageData.label_key)}
                          </div>
                          <div className="text-sm text-white/70">
                            {t(selectedPackageData.tagline_key)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-orange-300">
                          {currency === 'EUR' ? '€' : ''}{getPackagePrice(selectedPackageData, currency)}{currency === 'RON' ? ' RON' : ''}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-white/70">
                          <Clock className="w-3 h-3" />
                          {t(selectedPackageData.delivery_time_key)}
                        </div>
                      </div>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="w-full bg-white border border-gray-200 shadow-xl z-[9999]">
                {packages.map((pkg) => (
                  <SelectItem 
                    key={pkg.value} 
                    value={pkg.value}
                    className="p-4 hover:bg-purple-50 focus:bg-purple-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-3 flex-1">
                        {pkg.tag && (
                          <Badge className={`${getTagColor(pkg.tag)} text-xs px-2 py-1 shrink-0`}>
                            <div className="flex items-center gap-1">
                              {getTagIcon(pkg.tag)}
                              <span>{t(pkg.tag)}</span>
                            </div>
                          </Badge>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-base">
                            {t(pkg.label_key)}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {t(pkg.tagline_key)}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                            <Clock className="w-3 h-3" />
                            {t(pkg.delivery_time_key)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4 shrink-0">
                        <div className="text-lg font-bold text-purple-600">
                          {currency === 'EUR' ? '€' : ''}{getPackagePrice(pkg, currency)}{currency === 'RON' ? ' RON' : ''}
                        </div>
                        {selectedPackage === pkg.value && (
                          <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                            <Check className="w-3 h-3" />
                            <span>{t('selected')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Selected Package Summary */}
      {selectedPackageData && (
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-green-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <Check className="w-5 h-5 text-green-400" />
                {t('selected')}: {t(selectedPackageData.label_key)}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-white/80 mb-2">{t(selectedPackageData.tagline_key)}</p>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Clock className="w-4 h-4" />
                    <span>{t(selectedPackageData.delivery_time_key)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-300">
                    {currency === 'EUR' ? '€' : ''}{getPackagePrice(selectedPackageData, currency)}{currency === 'RON' ? ' RON' : ''}
                  </div>
                  {selectedPackageData.tag && (
                    <Badge className={`${getTagColor(selectedPackageData.tag)} mt-2 inline-flex`}>
                      <div className="flex items-center gap-1">
                        {getTagIcon(selectedPackageData.tag)}
                        <span>{t(selectedPackageData.tag)}</span>
                      </div>
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PackageSelectionStep;
