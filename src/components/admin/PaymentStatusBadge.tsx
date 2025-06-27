
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface PaymentStatusBadgeProps {
  status: string;
  type: 'payment' | 'proforma' | 'invoice';
}

const PaymentStatusBadge = ({ status, type }: PaymentStatusBadgeProps) => {
  const getStatusColor = (status: string, type: string) => {
    const normalizedStatus = status?.toLowerCase() || 'unknown';
    
    switch (normalizedStatus) {
      case 'completed':
      case 'paid':
      case 'generated':
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
      case 'error':
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'not_requested':
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string, type: string) => {
    if (!status) return 'Unknown';
    
    const normalizedStatus = status.toLowerCase();
    
    // Special handling for different types
    if (type === 'invoice' && normalizedStatus === 'not_requested') {
      return 'Not Created';
    }
    
    // Show the exact status from database
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Badge 
      variant="outline" 
      className={`text-xs ${getStatusColor(status, type)}`}
    >
      {getStatusLabel(status, type)}
    </Badge>
  );
};

export default PaymentStatusBadge;
