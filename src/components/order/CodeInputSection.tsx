import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Gift, Tag, X, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useGiftCardByCode } from '@/hooks/useGiftCards';
import { useValidateDiscountCode } from '@/hooks/useDiscountCodes';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
interface CodeInputSectionProps {
  onGiftCardApplied: (giftCard: any) => void;
  onDiscountApplied: (discount: {
    code: string;
    amount: number;
    type: string;
  }) => void;
  onGiftCardRemoved: () => void;
  onDiscountRemoved: () => void;
  appliedGiftCard?: any;
  appliedDiscount?: {
    code: string;
    amount: number;
    type: string;
  };
  orderTotal: number;
  disabled?: boolean;
}
const CodeInputSection: React.FC<CodeInputSectionProps> = ({
  onGiftCardApplied,
  onDiscountApplied,
  onGiftCardRemoved,
  onDiscountRemoved,
  appliedGiftCard,
  appliedDiscount,
  orderTotal,
  disabled = false
}) => {
  const {
    t
  } = useLanguage();
  const {
    currency
  } = useCurrency();
  const [codeInput, setCodeInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const {
    data: giftCard,
    isLoading: isLoadingGift
  } = useGiftCardByCode(codeInput.startsWith('GIFT-') ? codeInput : '');
  const validateDiscount = useValidateDiscountCode();
  const handleApplyCode = async () => {
    if (!codeInput.trim() || isValidating) return;
    setIsValidating(true);
    try {
      // Check if it's a gift card (starts with GIFT-)
      if (codeInput.toUpperCase().startsWith('GIFT-')) {
        if (giftCard) {
          onGiftCardApplied(giftCard);
          setCodeInput('');
        } else {
          throw new Error('Invalid gift card code');
        }
      } else {
        // Try as discount code
        const result = await validateDiscount.mutateAsync({
          code: codeInput,
          orderTotal
        });
        if (result.is_valid) {
          onDiscountApplied({
            code: codeInput.toUpperCase(),
            amount: result.discount_amount,
            type: result.discount_type
          });
          setCodeInput('');
        }
      }
    } catch (error) {
      console.error('Error applying code:', error);
    } finally {
      setIsValidating(false);
    }
  };
  const hasAppliedCodes = appliedGiftCard || appliedDiscount;
  const isLoading = isValidating || isLoadingGift || validateDiscount.isPending;
  return <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between text-white/80 hover:text-white hover:bg-white/10 p-3" disabled={disabled}>
          <span className="flex items-center gap-2">
            <Gift className="w-4 h-4" />
            {t('giftCardOrDiscount', 'Gift Card or Discount Code')}
            {hasAppliedCodes && <CheckCircle className="w-4 h-4 text-green-400" />}
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <Card className="bg-white/5 border-white/10 mt-2">
          <CardContent className="p-4 space-y-4">
            {/* Applied codes display */}
            {appliedGiftCard && <Alert className="bg-green-500/20 border-green-400/30">
                <Gift className="h-4 w-4 text-green-400" />
                <AlertDescription className="flex items-center justify-between">
                  <span className="text-green-300">
                    {t('giftCardApplied', 'Gift card applied')}: {appliedGiftCard.code}
                  </span>
                  <Button variant="ghost" size="sm" onClick={onGiftCardRemoved} className="text-green-300 hover:text-green-400 p-1" disabled={disabled}>
                    <X className="w-3 h-3" />
                  </Button>
                </AlertDescription>
              </Alert>}

            {appliedDiscount && <Alert className="bg-blue-500/20 border-blue-400/30">
                <Tag className="h-4 w-4 text-blue-400" />
                <AlertDescription className="flex items-center justify-between">
                  <span className="text-blue-300">
                    {t('discountApplied', 'Discount applied')}: {appliedDiscount.code} 
                    (-{currency} {appliedDiscount.amount.toFixed(2)})
                  </span>
                  <Button variant="ghost" size="sm" onClick={onDiscountRemoved} className="text-blue-300 hover:text-blue-400 p-1" disabled={disabled}>
                    <X className="w-3 h-3" />
                  </Button>
                </AlertDescription>
              </Alert>}

            {/* Input section */}
            <div className="space-y-2">
              <Label htmlFor="code-input" className="text-white/80 text-sm">
                {t('enterCode', 'Enter gift card or discount code')}
              </Label>
              <div className="flex gap-2">
                <Input id="code-input" value={codeInput} onChange={e => setCodeInput(e.target.value.toUpperCase())} placeholder={t('codePlaceholder', 'GIFT-XXXX-XXXX or DISCOUNT10')} disabled={disabled || isLoading} onKeyPress={e => {
                if (e.key === 'Enter') {
                  handleApplyCode();
                }
              }} className="border-black/20 text-white placeholder:text-black/40 bg-transparent" />
                <Button onClick={handleApplyCode} disabled={!codeInput.trim() || disabled || isLoading} size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                  {isLoading ? t('applying', 'Applying...') : t('apply', 'Apply')}
                </Button>
              </div>
            </div>

            <div className="text-xs text-white/60 space-y-1">
              <p>• {t('giftCardHelp', 'Gift cards start with GIFT-XXXX-XXXX')}</p>
              <p>• {t('discountHelp', 'Discount codes may have minimum order requirements')}</p>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>;
};
export default CodeInputSection;