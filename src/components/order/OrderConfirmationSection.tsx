
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface OrderConfirmationSectionProps {
  isConfirmed: boolean;
  onConfirmationChange: (confirmed: boolean) => void;
}

const OrderConfirmationSection: React.FC<OrderConfirmationSectionProps> = ({
  isConfirmed,
  onConfirmationChange
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {/* Attention Warning Box */}
      <Card className="bg-orange-500/10 border-orange-400/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-orange-300 font-medium mb-1">
                {t('attentionOrderReview', 'Attention: Please Review Carefully')}
              </h4>
              <p className="text-orange-200 text-sm">
                {t('attentionOrderReviewText', 'Please review all the information above carefully. Once you confirm and proceed to payment, you will not be able to modify your order details.')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Checkbox */}
      <Card className="bg-white/5 border-white/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="order-confirmation"
              checked={isConfirmed}
              onCheckedChange={onConfirmationChange}
              className="mt-1"
            />
            <div className="flex-1">
              <label 
                htmlFor="order-confirmation" 
                className="text-white text-sm cursor-pointer"
              >
                <span className="font-medium">{t('confirmOrderAccuracy', 'I confirm that all the information provided is correct')}</span>
                <br />
                <span className="text-white/70 text-xs">
                  {t('confirmOrderAccuracyText', 'I have reviewed all my entries including song details, personal information, contact details, and legal agreements.')}
                </span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderConfirmationSection;
