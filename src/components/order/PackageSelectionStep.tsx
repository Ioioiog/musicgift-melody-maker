
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg';
      case 'premium':
        return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg';
      case 'new':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg';
      case 'gift':
        return 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg';
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
    <div className="space-y-2">
      <div className="text-center">
        <h2 className="text-lg font-bold mb-1 bg-orange-400 bg-clip-text text-transparent my-0 py-0">
          {t('selectYourPackage')}
        </h2>
        <p className="text-white/90 text-sm">{t('choosePackage')}</p>
      </div>

      {/* Compact Package Select Dropdown */}
      <div className="max-w-lg mx-auto">
        <Card className="bg-gradient-to-br from-indigo-500/30 via-purple-500/25 to-pink-500/30 backdrop-blur-lg border-2 border-white/30 shadow-xl hover:shadow-purple-500/25 transition-all duration-300">
          <CardContent className="p-2">
            <Select value={selectedPackage} onValueChange={onPackageSelect}>
              <SelectTrigger className="w-full h-10 text-left border-2 border-white/40 hover:border-purple-300/80 focus:border-purple-400 transition-all duration-300 bg-white/15 backdrop-blur-md shadow-lg hover:shadow-xl">
                <SelectValue placeholder={
                  <div className="flex items-center text-white/80 text-sm">
                    <span>{t('selectOption')}</span>
                  </div>
                }>
                  {selectedPackageData && (
                    <div className="flex items-center justify-between w-full pr-3">
                      <div className="flex items-center space-x-1.5">
                        {selectedPackageData.tag && (
                          <Badge className={`${getTagColor(selectedPackageData.tag)} text-xs px-1 py-0.5 font-medium`}>
                            <div className="flex items-center gap-0.5">
                              {getTagIcon(selectedPackageData.tag)}
                              <span>{t(selectedPackageData.tag)}</span>
                            </div>
                          </Badge>
                        )}
                        <div className="font-bold text-white text-sm">
                          {t(selectedPackageData.label_key)}
                        </div>
                      </div>
                      <div className="text-sm font-bold bg-gradient-to-r from-orange-300 to-yellow-300 bg-clip-text text-transparent">
                        {currency === 'EUR' ? '€' : ''}{getPackagePrice(selectedPackageData, currency)}{currency === 'RON' ? ' RON' : ''}
                      </div>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent 
                className="w-full bg-white/95 backdrop-blur-md border-2 border-purple-200/50 shadow-2xl z-[9999] rounded-xl"
                side="bottom"
                position="popper"
              >
                {packages.map(pkg => (
                  <SelectItem 
                    key={pkg.value} 
                    value={pkg.value} 
                    className="p-1 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 cursor-pointer border-b border-gray-100/80 last:border-b-0 rounded-lg mx-0.5 my-0 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-1 flex-1">
                        {pkg.tag && (
                          <Badge className={`${getTagColor(pkg.tag)} text-xs px-1 py-0.5 shrink-0 font-medium`}>
                            <div className="flex items-center gap-0.5">
                              {getTagIcon(pkg.tag)}
                              <span>{t(pkg.tag)}</span>
                            </div>
                          </Badge>
                        )}
                        <div className="font-medium text-gray-900 text-sm">
                          {t(pkg.label_key)}
                        </div>
                      </div>
                      <div className="text-right ml-2 shrink-0 flex items-center gap-1">
                        <div className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {currency === 'EUR' ? '€' : ''}{getPackagePrice(pkg, currency)}{currency === 'RON' ? ' RON' : ''}
                        </div>
                        {selectedPackage === pkg.value && (
                          <Check className="w-3 h-3 text-green-600" />
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

      {/* Compact Selected Package Summary */}
      {selectedPackageData && (
        <div className="max-w-lg mx-auto">
          <Card className="bg-gradient-to-br from-emerald-500/25 via-teal-500/20 to-cyan-500/25 backdrop-blur-lg border-2 border-emerald-300/40 shadow-xl hover:shadow-emerald-500/25 transition-all duration-300">
            <CardContent className="p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400 bg-emerald-400/20 rounded-full p-0.5" />
                  <div>
                    <span className="text-white font-bold text-sm bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                      {t('selected')}: {t(selectedPackageData.label_key)}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-white/80 mt-0.5">
                      <Clock className="w-2.5 h-2.5 text-emerald-400" />
                      <span>{t(selectedPackageData.delivery_time_key)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold bg-gradient-to-r from-orange-300 via-yellow-300 to-amber-300 bg-clip-text text-transparent">
                    {currency === 'EUR' ? '€' : ''}{getPackagePrice(selectedPackageData, currency)}{currency === 'RON' ? ' RON' : ''}
                  </div>
                  {selectedPackageData.tag && (
                    <Badge className={`${getTagColor(selectedPackageData.tag)} mt-0.5 text-xs px-1.5 py-0.5 font-medium`}>
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
