
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUnsubscribe } from '@/hooks/useNewsletter';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const Unsubscribe = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('pending');
  const unsubscribeMutation = useUnsubscribe();

  const id = searchParams.get('id');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!id || !token) {
      setStatus('error');
    }
  }, [id, token]);

  const handleUnsubscribe = () => {
    if (!id || !token) return;
    
    setStatus('loading');
    unsubscribeMutation.mutate({ id, token }, {
      onSuccess: () => setStatus('success'),
      onError: () => setStatus('error')
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{t('newsletterUnsubscribe')}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              {status === 'pending' && id && token && (
                <>
                  <p className="text-gray-600">
                    {t('confirmUnsubscribe')}
                  </p>
                  <Button 
                    onClick={handleUnsubscribe}
                    variant="destructive"
                    className="w-full"
                  >
                    {t('yesUnsubscribe')}
                  </Button>
                </>
              )}

              {status === 'loading' && (
                <>
                  <Loader2 className="w-12 h-12 animate-spin mx-auto text-purple-600" />
                  <p className="text-gray-600">{t('processingRequest')}</p>
                </>
              )}

              {status === 'success' && (
                <>
                  <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('successfullyUnsubscribed')}</h3>
                    <p className="text-gray-600">
                      {t('unsubscribeSuccessMessage')}
                    </p>
                  </div>
                </>
              )}

              {status === 'error' && (
                <>
                  <XCircle className="w-16 h-16 mx-auto text-red-600" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('unsubscribeFailed')}</h3>
                    <p className="text-gray-600">
                      {!id || !token 
                        ? t('invalidUnsubscribeLink')
                        : t('unsubscribeErrorMessage')
                      }
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Unsubscribe;
