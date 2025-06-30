import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Building2, Landmark } from 'lucide-react';
import { useEnabledPaymentProviders } from '@/hooks/usePaymentProviders';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface PaymentProviderSelectionProps {
  selectedProvider?: string;
  onProviderSelect: (provider: string) => void;
}

const PaymentProviderSelection: React.FC<PaymentProviderSelectionProps> = ({
  selectedProvider,
  onProviderSelect
}) => {
  const { data: providers = [], isLoading } = useEnabledPaymentProviders();
  const { currency } = useCurrency();
  const { t } = useLanguage();

  const getProviderIcon = (providerName: string) => {
    switch (providerName) {
      case 'stripe':
        return <CreditCard className="w-6 h-6" />;
      case 'revolut':
        return <Building2 className="w-6 h-6" />;
      case 'smartbill':
        return <Landmark className="w-6 h-6" />;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  const getProviderDescription = (providerName: string) => {
    switch (providerName) {
      case 'stripe':
        return 'Credit/Debit Cards, Apple Pay, Google Pay, Link';
      case 'revolut':
        return 'Revolut Business Payments';
      case 'smartbill':
        return 'Netopia Payments - Secure Online Payment Processing';
      default:
        return 'Payment Processing';
    }
  };

  const isProviderComingSoon = (providerName: string) => {
    return providerName === 'revolut';
  };

  const getProviderOrder = (providerName: string) => {
    switch (providerName) {
      case 'smartbill':
        return 1;
      // Netopia first
      case 'stripe':
        return 2;
      // Stripe second
      case 'revolut':
        return 3;
      // Revolut third
      default:
        return 999;
      // Others last
    }
  };

  const getNetopiaLogo = () => {
    return "/uploads/3862e26e-cb46-45d9-8e43-4fd26ad7cf96.png";
  };

  const getStripeLogo = () => {
    return "/uploads/c2fa4958-8447-4873-81b0-7c4ce43e678b.png";
  };

  const getRevolutLogo = () => {
    return "/uploads/351bae23-e0e6-4f76-97c1-140c628569bf.png";
  };

  if (isLoading) {
    return <Card className="bg-white/10 backdrop-blur-sm border border-white/30">
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>;
  }

  const supportedProviders = providers.filter(provider => provider.supported_currencies.includes(currency)).sort((a, b) => getProviderOrder(a.provider_name) - getProviderOrder(b.provider_name));

  return (
    <Card className="bg-white/10 backdrop-blur-sm border border-white/30">
      <CardHeader>
        <CardTitle className="text-slate-950">{t('choosePaymentMethod', 'Choose Payment Method')}</CardTitle>
        <p className="text-sm text-zinc-950">
          {t('selectPaymentProvider', 'Select how you\'d like to pay for your order')}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {supportedProviders.map(provider => {
          const isComingSoon = isProviderComingSoon(provider.provider_name);
          const isDisabled = isComingSoon;
          return <Card key={provider.id} className={`transition-all bg-white/10 backdrop-blur-sm border border-white/20 ${isDisabled ? 'opacity-60 cursor-not-allowed' : `cursor-pointer hover:shadow-md hover:bg-white/20 ${selectedProvider === provider.provider_name ? 'border-2 border-orange-400 shadow-lg bg-white/20' : ''}`}`} onClick={() => !isDisabled && onProviderSelect(provider.provider_name)}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {provider.provider_name === 'smartbill' ? <img src={getNetopiaLogo()} alt="Netopia Payments" className="w-20 h-20 object-contain rounded" onError={e => {
                      // Fallback to icon if image fails to load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }} /> : provider.provider_name === 'stripe' ? <img src={getStripeLogo()} alt="Stripe" className="w-20 h-20 object-contain" onError={e => {
                      // Fallback to icon if image fails to load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }} /> : provider.provider_name === 'revolut' ? <img src={getRevolutLogo()} alt="Revolut" className="w-20 h-20 object-contain" onError={e => {
                      // Fallback to icon if image fails to load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }} /> : provider.logo_url ? <img src={provider.logo_url} alt={provider.display_name} className="w-20 h-20 object-contain" /> : getProviderIcon(provider.provider_name)}
                    {(provider.provider_name === 'smartbill' || provider.provider_name === 'stripe' || provider.provider_name === 'revolut') && <div className="hidden text-white">
                      {getProviderIcon(provider.provider_name)}
                    </div>}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg text-gray-950">{provider.display_name}</h3>
                      {isComingSoon && <Badge variant="outline" className="text-orange-300 border-orange-400/30 bg-orange-500">
                        Coming Soon
                      </Badge>}
                    </div>
                    <p className="text-sm text-zinc-950">
                      {getProviderDescription(provider.provider_name)}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {provider.supported_currencies.map(curr => <Badge key={curr} variant="outline" className="text-xs text-white/80 border-white/20 bg-zinc-950">
                        {curr}
                      </Badge>)}
                    </div>
                  </div>
                </div>
                {selectedProvider === provider.provider_name && !isDisabled && <Badge className="bg-orange-500/80 text-white">
                  {t('selected', 'Selected')}
                </Badge>}
              </div>
            </CardContent>
          </Card>;
        })}

        {supportedProviders.length === 0 && <div className="text-center py-8">
          <p className="text-white/70">
            {t('noPaymentProviders', `No payment providers available for ${currency}`)}
          </p>
        </div>}
      </CardContent>
    </Card>
  );
};

export default PaymentProviderSelection;
