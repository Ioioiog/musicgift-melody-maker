import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gift, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useValidateGiftCard } from '@/hooks/useGiftCards';
import { motion } from 'framer-motion';
interface GiftRedemptionProps {
  onRedemption: (giftCard: any, selectedPackage: string, upgradeAmount?: number) => void;
}
const GiftRedemption: React.FC<GiftRedemptionProps> = ({
  onRedemption
}) => {
  const [giftCardCode, setGiftCardCode] = useState('');
  const [validatedGiftCard, setValidatedGiftCard] = useState<any>(null);
  const {
    toast
  } = useToast();
  const {
    t
  } = useLanguage();
  const {
    mutateAsync: validateGiftCard,
    isPending: isValidating
  } = useValidateGiftCard();
  const handleValidateGiftCard = async () => {
    if (!giftCardCode.trim()) return;
    try {
      const result = await validateGiftCard(giftCardCode.trim());
      setValidatedGiftCard(result);
      toast({
        title: t('validGiftCard'),
        description: `${t('giftCardValue')}: ${result.amount_eur || result.gift_amount} ${result.currency}`
      });
    } catch (error) {
      console.error('Error validating gift card:', error);
      toast({
        title: "Error",
        description: t('invalidGiftCardCode'),
        variant: "destructive"
      });
      setValidatedGiftCard(null);
    }
  };
  return <Card className="bg-transparent border-transparent shadow-none">
      <CardHeader className="px-2 sm:px-3">
        <CardTitle className="flex items-center gap-2 text-lg text-orange-500">
          <Gift className="w-5 h-5" />
          {t('redeemYourGiftCard')}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-3 space-y-4">
        {!validatedGiftCard ? <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="space-y-4">
            <div>
              <p className="text-sm mb-4 text-orange-500">
                {t('enterGiftCardCode')}
              </p>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="giftCardCode" className="text-sm font-medium text-orange-500 bg-transparent">
                    {t('giftCardCode')}
                  </Label>
                  <Input id="giftCardCode" type="text" value={giftCardCode} onChange={e => setGiftCardCode(e.target.value.toUpperCase())} placeholder={t('enterCodeHere')} disabled={isValidating} className="mt-1 bg-white/10 border-white/30 text-purple-600 placeholder:text-white-100" />
                </div>
                
                <Button onClick={handleValidateGiftCard} disabled={!giftCardCode.trim() || isValidating} className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 bg-orange-500 hover:bg-orange-400">
                  {isValidating ? t('validatingCode') : t('validateGiftCard')}
                </Button>
              </div>
            </div>
          </motion.div> : <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="space-y-4">
            <Card className="bg-green-50/10 border-green-200/30">
              <CardHeader className="p-3">
                <CardTitle className="flex items-center gap-2 text-sm text-orange-500">
                  <Check className="w-4 h-4" />
                  {t('giftCardDetails')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-50">{t('giftCardValue')}:</span>
                  <span className="font-medium text-orange-500">
                    {validatedGiftCard.amount_eur || validatedGiftCard.gift_amount} {validatedGiftCard.currency}
                  </span>
                </div>
                {validatedGiftCard.message_text && <div className="space-y-1">
                    <span className="text-sm text-gray-600">{t('messageFromSender')}:</span>
                    <p className="text-sm text-purple-600 bg-purple-50/10 p-2 rounded">
                      "{validatedGiftCard.message_text}"
                    </p>
                  </div>}
              </CardContent>
            </Card>
            
            <div>
              <h3 className="text-sm font-medium mb-3 text-orange-500">
                {t('choosePackage')}
              </h3>
              <p className="text-sm mb-4 text-orange-500">
                {t('selectPackageToRedeem')}
              </p>
              
              {/* Package selection would go here */}
              <div className="text-center py-8 text-purple-500">
                Package selection coming soon...
              </div>
            </div>
          </motion.div>}
      </CardContent>
    </Card>;
};
export default GiftRedemption;