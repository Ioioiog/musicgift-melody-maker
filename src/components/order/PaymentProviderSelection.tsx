
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Building2, Landmark } from 'lucide-react';
import { useEnabledPaymentProviders } from '@/hooks/usePaymentProviders';
import { useCurrency } from '@/contexts/CurrencyContext';

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
        return 'Credit/Debit Cards, Apple Pay, Google Pay';
      case 'revolut':
        return 'Revolut Business Payments';
      case 'smartbill':
        return 'Romanian Invoice & Payment System';
      default:
        return 'Payment Processing';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter providers that support current currency
  const supportedProviders = providers.filter(provider => 
    provider.supported_currencies.includes(currency)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Payment Method</CardTitle>
        <p className="text-sm text-gray-600">
          Select how you'd like to pay for your order
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {supportedProviders.map((provider) => (
          <Card
            key={provider.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedProvider === provider.provider_name
                ? 'border-2 border-purple-500 shadow-lg'
                : 'border border-gray-200'
            }`}
            onClick={() => onProviderSelect(provider.provider_name)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {provider.logo_url ? (
                      <img 
                        src={provider.logo_url} 
                        alt={provider.display_name}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      getProviderIcon(provider.provider_name)
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{provider.display_name}</h3>
                    <p className="text-sm text-gray-600">
                      {getProviderDescription(provider.provider_name)}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {provider.supported_currencies.map((curr) => (
                        <Badge key={curr} variant="outline" className="text-xs">
                          {curr}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                {selectedProvider === provider.provider_name && (
                  <Badge className="bg-purple-100 text-purple-700">
                    Selected
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {supportedProviders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No payment providers available for {currency}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentProviderSelection;
