
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NODE_ENV === 'production' 
  ? 'pk_live_...' // Your live publishable key
  : 'pk_test_51QVCrwHNOTOzMnfP8x9C8L1u2mT3gOYqQgYlmGhYm4lmKf0mXkGWmHr5XKjN0qL7HlKm3C5mJ8Kf9Kg8L1mQ0P2Q0' // Your test publishable key
);

interface EmbeddedStripeCheckoutProps {
  clientSecret: string;
  onBack?: () => void;
  onComplete?: (sessionId: string) => void;
}

const EmbeddedStripeCheckout: React.FC<EmbeddedStripeCheckoutProps> = ({
  clientSecret,
  onBack,
  onComplete
}) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);

  const handleComplete = () => {
    if (onComplete) {
      // Extract session ID from client secret
      const sessionId = clientSecret.split('_secret_')[0];
      onComplete(sessionId);
    }
  };

  const options = {
    clientSecret,
    onComplete: handleComplete,
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('back', 'Back')}
            </Button>
          )}
          <CardTitle className="text-xl font-bold">
            {t('completePayment', 'Complete Your Payment')}
          </CardTitle>
        </div>
        <p className="text-gray-600">
          {t('secureCheckout', 'Secure checkout powered by Stripe')}
        </p>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <span className="ml-2 text-gray-600">
              {t('loadingCheckout', 'Loading secure checkout...')}
            </span>
          </div>
        )}
        <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
          <EmbeddedCheckout 
            onLoadError={(error) => {
              console.error('Embedded checkout load error:', error);
              setIsLoading(false);
            }}
            onLoad={() => setIsLoading(false)}
          />
        </EmbeddedCheckoutProvider>
      </CardContent>
    </Card>
  );
};

export default EmbeddedStripeCheckout;
