import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Gift, CheckCircle, AlertCircle } from 'lucide-react';
import { useGiftCardByCode, useGiftCardBalance } from '@/hooks/useGiftCards';
import { usePackages } from '@/hooks/usePackageData';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useNavigate } from 'react-router-dom';
import { getPackagePrice } from '@/utils/pricing';

interface GiftRedemptionProps {
  onRedemption: (giftCard: any, selectedPackage: string, upgradeAmount?: number) => void;
}

const GiftRedemption: React.FC<GiftRedemptionProps> = ({ onRedemption }) => {
  const [giftCode, setGiftCode] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const navigate = useNavigate();

  const { currency } = useCurrency();
  const { data: packages = [] } = usePackages();
  const { data: giftCard, isLoading: isLoadingGift, error: giftError } = useGiftCardByCode(giftCode);
  const { data: balance = 0 } = useGiftCardBalance(giftCard?.id || '');

  const handleValidateCode = () => {
    if (giftCode.length >= 10) {
      setIsValidating(true);
      // The query will automatically run when giftCode changes
      setTimeout(() => setIsValidating(false), 1000);
    }
  };

  const handleRedemption = () => {
    if (!giftCard || !selectedPackage) return;
    
    // Redirect to order page with gift card and package parameters
    navigate(`/order?gift=${giftCard.code}&package=${selectedPackage}`);
  };

  const getAvailableBalance = () => {
    if (giftCard?.gift_amount) {
      return giftCard.gift_amount / 100; // Convert from cents
    }
    return 0;
  };

  const canAffordPackage = (packagePrice: number) => {
    const packagePriceCents = packagePrice * 100;
    return balance >= packagePriceCents;
  };

  const getUpgradeAmount = (packagePrice: number) => {
    const packagePriceCents = packagePrice * 100;
    return packagePriceCents > balance ? (packagePriceCents - balance) / 100 : 0;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-6 h-6" />
            Redeem Gift Card
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="giftCode">Gift Card Code</Label>
            <div className="flex gap-2">
              <Input
                id="giftCode"
                value={giftCode}
                onChange={(e) => setGiftCode(e.target.value.toUpperCase())}
                placeholder="GIFT-XXXX-XXXX"
                className="font-mono"
              />
              <Button
                onClick={handleValidateCode}
                disabled={giftCode.length < 10 || isValidating || isLoadingGift}
              >
                {isValidating || isLoadingGift ? 'Validating...' : 'Validate'}
              </Button>
            </div>
          </div>

          {giftError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Invalid gift card code. Please check the code and try again.
              </AlertDescription>
            </Alert>
          )}

          {giftCard && (
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Gift card found! From: {giftCard.sender_name}
                </AlertDescription>
              </Alert>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Gift Details</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>From:</strong> {giftCard.sender_name}</div>
                  <div><strong>Message:</strong> {giftCard.message_text || 'No message'}</div>
                  <div><strong>Available Balance:</strong> {getAvailableBalance()} {currency}</div>
                  {giftCard.package_type && (
                    <div><strong>Pre-selected Package:</strong> {giftCard.package_type}</div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Choose Your Package</h3>
                <div className="grid gap-3">
                  {packages.map((pkg) => {
                    const packagePrice = getPackagePrice(pkg, currency);
                    const canAfford = canAffordPackage(packagePrice);
                    const upgradeAmount = getUpgradeAmount(packagePrice);

                    return (
                      <div
                        key={pkg.value}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedPackage === pkg.value
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedPackage(pkg.value)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{pkg.label_key}</h4>
                            <p className="text-sm text-gray-600">{packagePrice} {currency}</p>
                          </div>
                          <div className="text-right">
                            {canAfford ? (
                              <span className="text-green-600 text-sm font-medium">
                                ✓ Covered by gift
                              </span>
                            ) : (
                              <span className="text-orange-600 text-sm">
                                +{upgradeAmount} {currency} upgrade
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Button
                onClick={handleRedemption}
                disabled={!selectedPackage}
                className="w-full"
                size="lg"
              >
                {selectedPackage && !canAffordPackage(getPackagePrice(packages.find(p => p.value === selectedPackage)!, currency))
                  ? `Continue to Order (${getUpgradeAmount(getPackagePrice(packages.find(p => p.value === selectedPackage)!, currency))} ${currency} additional payment required)`
                  : 'Continue to Order'
                }
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GiftRedemption;
