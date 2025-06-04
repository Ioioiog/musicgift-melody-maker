
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Building2, Landmark, Settings } from 'lucide-react';
import { usePaymentProviders, useUpdatePaymentProvider } from '@/hooks/usePaymentProviders';
import { Button } from '@/components/ui/button';

const PaymentProvidersManagement = () => {
  const { data: providers = [], isLoading } = usePaymentProviders();
  const { mutate: updateProvider } = useUpdatePaymentProvider();

  const getProviderIcon = (providerName: string) => {
    switch (providerName) {
      case 'stripe':
        return <CreditCard className="w-6 h-6 text-blue-600" />;
      case 'revolut':
        return <Building2 className="w-6 h-6 text-blue-500" />;
      case 'smartbill':
        return <Landmark className="w-6 h-6 text-green-600" />;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  const handleToggleProvider = (id: string, enabled: boolean) => {
    updateProvider({
      id,
      updates: { is_enabled: enabled }
    });
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Payment Providers
        </CardTitle>
        <p className="text-sm text-gray-600">
          Manage available payment methods for your customers
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {providers.map((provider) => (
          <Card key={provider.id} className="border border-gray-200">
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
                    <p className="text-sm text-gray-600 capitalize">
                      Provider: {provider.provider_name}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {provider.supported_currencies.map((currency) => (
                        <Badge key={currency} variant="outline" className="text-xs">
                          {currency}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {provider.is_enabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <Switch
                      checked={provider.is_enabled}
                      onCheckedChange={(checked) => 
                        handleToggleProvider(provider.id, checked)
                      }
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default PaymentProvidersManagement;
