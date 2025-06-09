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
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
          {t('selectYourPackage')}
        </h2>
        <p className="text-white/90 text-lg">{t('choosePackage')}</p>
      </div>

      {/* Enhanced Package Select Dropdown with More Vivid Colors */}
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-to-br from-indigo-500/60 via-purple-500/50 to-pink-500/60 backdrop-blur-lg border-2 border-purple-300/60 shadow-2xl hover:shadow-purple-400/40 hover:border-purple-300/80 transition-all duration-300 hover:scale-[1.02] animate-pulse-slow">
          <CardContent className="p-6 py-[8px]">
            <Select value={selectedPackage} onValueChange={onPackageSelect}>
              <SelectTrigger className="w-full h-20 text-left border-2 border-white/50 hover:border-purple-200/90 focus:border-purple-300/90 transition-all duration-300 bg-white/20 backdrop-blur-md shadow-lg hover:shadow-xl hover:bg-white/25">
                <SelectValue placeholder={
                  <div className="flex items-center text-white/80 text-lg">
                    <span>{t('selectOption')}</span>
                  </div>
                }>
                  {selectedPackageData && (
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center space-x-4">
                        {selectedPackageData.tag && (
                          <Badge className={`${getTagColor(selectedPackageData.tag)} text-sm px-3 py-1.5 font-medium shadow-lg`}>
                            <div className="flex items-center gap-1.5">
                              {getTagIcon(selectedPackageData.tag)}
                              <span>{t(selectedPackageData.tag)}</span>
                            </div>
                          </Badge>
                        )}
                        <div>
                          <div className="font-bold text-white text-lg drop-shadow-md">
                            {t(selectedPackageData.label_key)}
                          </div>
                          <div className="text-sm text-white/90 mt-1 font-medium">
                            {t(selectedPackageData.tagline_key)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold bg-gradient-to-r from-orange-300 to-yellow-300 bg-clip-text text-transparent drop-shadow-md">
                          {currency === 'EUR' ? '€' : ''}{getPackagePrice(selectedPackageData, currency)}{currency === 'RON' ? ' RON' : ''}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-white/90 mt-1 font-medium">
                          <Clock className="w-4 h-4" />
                          {t(selectedPackageData.delivery_time_key)}
                        </div>
                      </div>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="w-full bg-white/95 backdrop-blur-md border-2 border-purple-200/50 shadow-2xl z-[9999] rounded-xl">
                {packages.map(pkg => (
                  <SelectItem
                    key={pkg.value}
                    value={pkg.value}
                    className="p-5 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 focus:bg-gradient-to-r focus:from-purple-50 focus:to-pink-50 cursor-pointer border-b border-gray-100/80 last:border-b-0 rounded-lg mx-1 my-1 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-4 flex-1">
                        {pkg.tag && (
                          <Badge className={`${getTagColor(pkg.tag)} text-sm px-3 py-1.5 shrink-0 font-medium`}>
                            <div className="flex items-center gap-1.5">
                              {getTagIcon(pkg.tag)}
                              <span>{t(pkg.tag)}</span>
                            </div>
                          </Badge>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-gray-900 text-lg">
                            {t(pkg.label_key)}
                          </div>
                          <div className="text-sm text-gray-700 mt-1 font-medium">
                            {t(pkg.tagline_key)}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600 mt-2">
                            <Clock className="w-4 h-4" />
                            {t(pkg.delivery_time_key)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4 shrink-0">
                        <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {currency === 'EUR' ? '€' : ''}{getPackagePrice(pkg, currency)}{currency === 'RON' ? ' RON' : ''}
                        </div>
                        {selectedPackage === pkg.value && (
                          <div className="flex items-center gap-1 text-green-600 text-sm mt-1 font-medium">
                            <Check className="w-4 h-4" />
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

      {/* Enhanced Selected Package Summary with More Vivid Colors */}
      {selectedPackageData && (
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gradient-to-br from-emerald-500/60 via-teal-500/50 to-cyan-500/60 backdrop-blur-lg border-2 border-emerald-300/70 shadow-2xl hover:shadow-emerald-400/40 hover:border-emerald-300/90 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
            {/* Add subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-teal-400/15 to-cyan-400/20 animate-pulse"></div>
            
            <CardHeader className="pb-3 my-[2px] relative z-10">
              <CardTitle className="text-xl flex items-center gap-3 text-white font-bold drop-shadow-md">
                <Check className="w-6 h-6 text-emerald-300 bg-emerald-300/30 rounded-full p-1 shadow-lg" />
                <span className="bg-gradient-to-r from-emerald-200 to-teal-200 bg-clip-text text-transparent">
                  {t('selected')}: {t(selectedPackageData.label_key)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 relative z-10">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-white/95 mb-3 text-lg font-medium drop-shadow-sm">{t(selectedPackageData.tagline_key)}</p>
                  <div className="flex items-center gap-2 text-sm text-white/90">
                    <Clock className="w-5 h-5 text-emerald-300 drop-shadow-sm" />
                    <span className="font-medium">{t(selectedPackageData.delivery_time_key)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-200 via-yellow-200 to-amber-200 bg-clip-text text-transparent mb-2 drop-shadow-md">
                    {currency === 'EUR' ? '€' : ''}{getPackagePrice(selectedPackageData, currency)}{currency === 'RON' ? ' RON' : ''}
                  </div>
                  {selectedPackageData.tag && (
                    <Badge className={`${getTagColor(selectedPackageData.tag)} mt-2 inline-flex text-sm px-3 py-1.5 font-medium shadow-lg`}>
                      <div className="flex items-center gap-1.5">
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
