
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CreditCard, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { PendingGiftCard } from '@/hooks/useGiftCardPaymentState';

interface PendingPaymentNotificationProps {
  pendingCards: PendingGiftCard[];
  onContinuePayment: (card: PendingGiftCard) => void;
  onDismiss: () => void;
}

const PendingPaymentNotification: React.FC<PendingPaymentNotificationProps> = ({
  pendingCards,
  onContinuePayment,
  onDismiss
}) => {
  const { t } = useLanguage();
  
  if (pendingCards.length === 0) return null;

  const reusableCards = pendingCards.filter(card => card.canReuse);
  if (reusableCards.length === 0) return null;

  return (
    <Card className="border-orange-200 bg-orange-50 mb-6">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-orange-800 mb-2">
              You have {reusableCards.length} pending gift card{reusableCards.length > 1 ? 's' : ''}
            </h4>
            <p className="text-sm text-orange-700 mb-3">
              You started creating gift cards but didn't complete the payment. You can continue with an existing one or create a new one.
            </p>
            
            <div className="space-y-2">
              {reusableCards.slice(0, 3).map(card => (
                <div key={card.id} className="flex items-center justify-between bg-white rounded p-3 border border-orange-200">
                  <div className="flex-1">
                    <div className="font-medium text-orange-800">
                      {card.gift_amount} {card.currency} for {card.recipient_name}
                    </div>
                    <div className="text-sm text-orange-600">
                      Created {new Date(card.created_at).toLocaleString()}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onContinuePayment(card)}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <CreditCard className="w-4 h-4 mr-1" />
                    Continue Payment
                  </Button>
                </div>
              ))}
            </div>

            {reusableCards.length > 3 && (
              <p className="text-xs text-orange-600 mt-2">
                ...and {reusableCards.length - 3} more pending gift cards
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-orange-600 hover:text-orange-800"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingPaymentNotification;
