
import React from 'react';
import { CreditCard, Building2, Landmark, FileText } from 'lucide-react';

interface PaymentProviderIconProps {
  provider: string;
  className?: string;
}

const PaymentProviderIcon = ({ provider, className = "w-4 h-4" }: PaymentProviderIconProps) => {
  const getProviderInfo = (provider: string) => {
    switch (provider?.toLowerCase()) {
      case 'stripe':
        return {
          icon: <CreditCard className={`${className} text-blue-600`} />,
          name: 'Stripe',
          color: 'text-blue-600'
        };
      case 'revolut':
        return {
          icon: <Building2 className={`${className} text-blue-500`} />,
          name: 'Revolut',
          color: 'text-blue-500'
        };
      case 'smartbill':
        return {
          icon: <Landmark className={`${className} text-green-600`} />,
          name: 'Netopia Payments',
          color: 'text-green-600'
        };
      default:
        return {
          icon: <FileText className={`${className} text-gray-500`} />,
          name: 'Unknown',
          color: 'text-gray-500'
        };
    }
  };

  const providerInfo = getProviderInfo(provider);

  return (
    <div className="flex items-center gap-2">
      {providerInfo.icon}
      <span className={`text-sm font-medium ${providerInfo.color}`}>
        {providerInfo.name}
      </span>
    </div>
  );
};

export default PaymentProviderIcon;
