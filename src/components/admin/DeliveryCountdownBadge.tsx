
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useDeliveryCalculation } from '@/hooks/useDeliveryCalculation';

interface DeliveryCountdownBadgeProps {
  orderCreatedAt: string;
  packageValue?: string;
  orderStatus: string;
}

const DeliveryCountdownBadge: React.FC<DeliveryCountdownBadgeProps> = ({
  orderCreatedAt,
  packageValue,
  orderStatus
}) => {
  const { remainingDays, isOverdue, status, deliveryDate } = useDeliveryCalculation(
    orderCreatedAt,
    packageValue
  );

  if (remainingDays === null) {
    return null;
  }

  // Don't show countdown for completed orders
  if (orderStatus === 'completed') {
    return (
      <Badge className="bg-green-100 text-green-800 border-green-300">
        <CheckCircle className="w-3 h-3 mr-1" />
        Delivered
      </Badge>
    );
  }

  const getBadgeStyles = () => {
    switch (status) {
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'urgent':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getIcon = () => {
    if (status === 'overdue' || status === 'urgent') {
      return <AlertTriangle className="w-3 h-3 mr-1" />;
    }
    return <Clock className="w-3 h-3 mr-1" />;
  };

  const getText = () => {
    if (isOverdue) {
      return `${remainingDays} day${remainingDays !== 1 ? 's' : ''} overdue`;
    }
    if (remainingDays === 0) {
      return 'Due today';
    }
    return `${remainingDays} day${remainingDays !== 1 ? 's' : ''} left`;
  };

  return (
    <Badge className={getBadgeStyles()} title={`Delivery due: ${deliveryDate}`}>
      {getIcon()}
      {getText()}
    </Badge>
  );
};

export default DeliveryCountdownBadge;
