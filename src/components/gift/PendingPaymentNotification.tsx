
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

  // Filter for cards that can be reused and are from the last hour
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000));
  
  const recentReusableCards = pendingCards.filter(card => {
    const cardCreatedAt = new Date(card.created_at);
    return card.canReuse && cardCreatedAt >= oneHourAgo;
  });

  // Show only the most recent one
  if (recentReusableCards.length === 0) return null;
  
  const mostRecentCard = recentReusableCards[0]; // Already sorted by created_at desc

  return (
    <Card className="border-orange-200 bg-orange-50 mb-6">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-orange-800 mb-2">
              You have a pending gift card
            </h4>
            <p className="text-sm text-orange-700 mb-3">
              You started creating a gift card but didn't complete the payment. You can continue with it or create a new one.
            </p>
            
            <div className="bg-white rounded p-3 border border-orange-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-orange-800">
                    {mostRecentCard.gift_amount} {mostRecentCard.currency} for {mostRecentCard.recipient_name}
                  </div>
                  <div className="text-sm text-orange-600">
                    Created {new Date(mostRecentCard.created_at).toLocaleString()}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => onContinuePayment(mostRecentCard)}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <CreditCard className="w-4 h-4 mr-1" />
                  Continue Payment
                </Button>
              </div>
            </div>
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
