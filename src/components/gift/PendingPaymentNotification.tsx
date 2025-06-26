
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CreditCard, X, AlertTriangle } from 'lucide-react';
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

  // Show only the most recent one
  const mostRecentCard = pendingCards[0];

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-blue-800 mb-2">
              Gift Card în Așteptarea Plății
            </h4>
            <p className="text-sm text-blue-700 mb-3">
              Ai început să creezi un gift card cu aceeași sumă dar nu ai finalizat plata. 
              Poți continua cu plata acestuia sau crea unul nou.
            </p>
            
            <div className="bg-white rounded p-3 border border-blue-200 mb-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-blue-800">
                    {mostRecentCard.gift_amount} {mostRecentCard.currency} pentru {mostRecentCard.recipient_name}
                  </div>
                  <div className="text-sm text-blue-600">
                    Creat pe {new Date(mostRecentCard.created_at).toLocaleString('ro-RO')}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => onContinuePayment(mostRecentCard)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <CreditCard className="w-4 h-4 mr-1" />
                Continuă Plata
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onDismiss}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                Creează Nou Gift Card
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-blue-600 hover:text-blue-800"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingPaymentNotification;

