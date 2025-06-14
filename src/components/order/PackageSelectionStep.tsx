
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Gift, Check, Sparkles, Star, Music, Headphones, Calendar } from 'lucide-react';
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
        return 'bg-orange-500 text-white shadow-sm border-orange-400';
      case 'premium':
        return 'bg-orange-600 text-white shadow-sm border-orange-500';
      case 'new':
        return 'bg-orange-400 text-white shadow-sm border-orange-300';
      case 'gift':
        return 'bg-orange-500 text-white shadow-sm border-orange-400';
      default:
        return 'bg-gray-500 text-white shadow-sm border-gray-400';
    }
  };

  const getTagIcon = (tag?: string) => {
    switch (tag) {
      case 'gift':
        return <Gift className="w-3 h-3 sm:block hidden" />;
      case 'popular':
        return <Sparkles className="w-3 h-3 sm:block hidden" />;
      default:
        return null;
    }
  };

  const selectedPackageData = packages.find(pkg => pkg.value === selectedPackage);

  return (
    <div className="space-y-6 my-0 py-0 bg-white/10 backdrop-blur-sm">
      <div className="text-center">
        <p className="text-white/90 text-base font-bold py-0 my-0">{t('choosePackage')}</p>
      </div>

      {/* Professional Package Selection Card */}
      <div className="max-w-lg mx-auto">
        <Card className="bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] hover:bg-white/15">
          <CardContent className="p-4">
            <Select value={selectedPackage} onValueChange={onPackageSelect}>
              <SelectTrigger className="w-full h-12 text-left border border-white/40 hover:border-orange-400 focus:border-orange-500 transition-all duration-300 bg-white/10 backdrop-blur-sm shadow-sm hover:shadow-md hover:bg-white/20">
                <SelectValue placeholder={<span className="text-gray-700 text-sm font-medium">{t('selectOption')}</span>}>
                  {selectedPackageData && (
                    <span className="font-semibold text-gray-900 text-sm">
                      {t(selectedPackageData.label_key)}
                    </span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent 
                className="w-full max-w-[calc(100vw-2rem)] sm:max-w-none bg-white/95 backdrop-blur-md border border-white/40 shadow-2xl rounded-lg overflow-hidden"
                side="bottom"
                sideOffset={4}
                style={{ zIndex: 99999 }}
              >
                <div className="max-h-[70vh] overflow-y-auto">
                  {packages.map(pkg => (
                    <SelectItem 
                      key={pkg.value} 
                      value={pkg.value} 
                      className="p-3 hover:bg-orange-50/80 focus:bg-orange-50/80 cursor-pointer border-b border-gray-100/50 last:border-b-0 mx-1 my-0.5 rounded-md transition-all duration-200 group min-h-[3rem]"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2 sm:gap-4">
                        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                          {pkg.tag && (
                            <Badge className={`${getTagColor(pkg.tag)} text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 shrink-0 font-medium transition-transform duration-200 group-hover:scale-105`}>
                              <div className="flex items-center gap-1">
                                {getTagIcon(pkg.tag)}
                                <span>{t(pkg.tag)}</span>
                              </div>
                            </Badge>
                          )}
                          <div className="font-medium text-gray-900 text-sm group-hover:text-gray-700 transition-colors duration-200 truncate">
                            {t(pkg.label_key)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0 justify-between sm:justify-end w-full sm:w-auto">
                          <div className="text-sm font-bold text-orange-600">
                            {currency === 'EUR' ? '€' : ''}{getPackagePrice(pkg, currency)}{currency === 'RON' ? ' RON' : ''}
                          </div>
                          {selectedPackage === pkg.value && <Check className="w-4 h-4 text-orange-600" />}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Selected Package Summary */}
      {selectedPackageData && (
        <div className="max-w-lg mx-auto">
          <Card className="bg-white/10 backdrop-blur-sm border-l-4 border-l-orange-500 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/15">
            <CardContent className="p-6 mx-0 my-0 px-[9px]">
              <div className="space-y-6">
                {/* Header with package name and price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100/80 backdrop-blur-sm rounded-full p-2">
                      <Check className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <span className="text-gray-900 font-semibold text-base">
                        {t(selectedPackageData.label_key)}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-gray-700 mt-1">
                        <Clock className="w-3 h-3 text-orange-500" />
                        <span>{t(selectedPackageData.delivery_time_key)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-orange-600">
                      {currency === 'EUR' ? '€' : ''}{getPackagePrice(selectedPackageData, currency)}{currency === 'RON' ? ' RON' : ''}
                    </div>
                    {selectedPackageData.tag && (
                      <Badge className={`${getTagColor(selectedPackageData.tag)} mt-2 text-xs px-2 py-1 font-medium`}>
                        <div className="flex items-center gap-1">
                          {getTagIcon(selectedPackageData.tag)}
                          <span>{t(selectedPackageData.tag)}</span>
                        </div>
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Package Description */}
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="flex items-start gap-2">
                    <Music className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {t(`${selectedPackageData.value}Description`)}
                    </p>
                  </div>
                </div>

                {/* Package Features */}
                {selectedPackageData.includes && selectedPackageData.includes.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-orange-600" />
                      <h4 className="text-sm font-semibold text-gray-900">{t('whatsIncluded')}</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedPackageData.includes.map((include, index) => (
                        <div key={include.id || index} className="flex items-start gap-2 text-xs text-gray-700 bg-white/20 p-2 rounded-md">
                          <Check className="w-3 h-3 text-green-600 mt-0.5 shrink-0" />
                          <span>{t(include.include_key)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Package Stats Grid */}
                
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PackageSelectionStep;
