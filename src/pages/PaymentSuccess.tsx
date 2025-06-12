
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, Package, Clock, AlertCircle, FileText, Mail } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/utils/currencyUtils';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [quoteDetails, setQuoteDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const { toast } = useToast();

  // Handle multiple query parameters for different types
  const orderId = searchParams.get('orderId') || searchParams.get('order') || searchParams.get('order_id');
  const quoteId = searchParams.get('quoteId');
  const requestType = searchParams.get('type');
  const sessionId = searchParams.get('session_id');
  const revolutOrderId = searchParams.get('revolut_order_id');

  const isQuoteRequest = requestType === 'quote' || !!quoteId;

  useEffect(() => {
    const fetchDetails = async () => {
      if (isQuoteRequest && quoteId) {
        // Fetch quote request details
        try {
          const { data, error } = await supabase
            .from('quote_requests')
            .select('*')
            .eq('id', quoteId)
            .single();

          if (error) {
            console.error('Error fetching quote:', error);
            toast({
              title: 'Error loading quote details',
              description: 'Could not retrieve your quote request information.',
              variant: 'destructive'
            });
          } else {
            setQuoteDetails(data);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      } else if (orderId) {
        // Fetch order details for payment
        try {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

          if (error) {
            console.error('Error fetching order:', error);
            toast({
              title: 'Eroare la încărcarea detaliilor comenzii',
              description: 'Nu am putut prelua informațiile comenzii dumneavoastră.',
              variant: 'destructive'
            });
          } else {
            setOrderDetails(data);
            setPaymentVerified(data.payment_status === 'completed');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
      
      setLoading(false);
    };

    fetchDetails();

    // Poll for payment status updates in case webhook is delayed (only for orders)
    if (!isQuoteRequest && orderId) {
      const pollInterval = setInterval(() => {
        if (!paymentVerified) {
          fetchDetails();
        }
      }, 5000);

      // Clear interval after 2 minutes
      setTimeout(() => clearInterval(pollInterval), 120000);

      return () => clearInterval(pollInterval);
    }
  }, [orderId, quoteId, isQuoteRequest, toast, paymentVerified]);

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'stripe':
        return 'Stripe';
      case 'revolut':
        return 'Revolut Business';
      case 'smartbill':
        return 'SmartBill';
      default:
        return provider;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">
              {isQuoteRequest ? 'Se încarcă detaliile cererii de ofertă...' : 'Se încarcă detaliile comenzii...'}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Quote Request Success View
  if (isQuoteRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <FileText className="w-20 h-20 text-blue-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Cererea de ofertă a fost trimisă cu succes!
                    </h1>
                    <p className="text-gray-600 text-lg">
                      Vă mulțumim pentru interesul acordat. Echipa noastră va analiza cererea dumneavoastră și vă va contacta în scurt timp cu o ofertă personalizată.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-blue-800 mb-2">
                      <Mail className="w-5 h-5" />
                      <span className="font-semibold">Ce urmează?</span>
                    </div>
                    <ul className="text-sm text-blue-700 space-y-1 text-left">
                      <li>• Echipa noastră va analiza cererea dumneavoastră în detaliu</li>
                      <li>• Veți primi o ofertă personalizată în termen de 24-48 de ore</li>
                      <li>• Oferta va include toate detaliile și prețurile finale</li>
                      <li>• Veți putea să acceptați oferta și să continuați cu plata</li>
                    </ul>
                  </div>

                  {quoteDetails && (
                    <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                      <h3 className="font-semibold text-gray-900 mb-4">Detalii cerere ofertă</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">ID Cerere:</span>
                          <span className="font-mono">#{quoteDetails.id.slice(0, 8)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pachet:</span>
                          <span>{quoteDetails.package_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Client:</span>
                          <span>{quoteDetails.customer_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span>{quoteDetails.customer_email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Preț estimativ:</span>
                          <span className="font-semibold">
                            {formatCurrency(
                              quoteDetails.estimated_price, 
                              quoteDetails.currency || 'RON'
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="capitalize font-semibold text-blue-600">
                            În procesare
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Veți primi în scurt timp un email de confirmare cu toate detaliile cererii dumneavoastră de ofertă.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                        <Link to="/">
                          <Home className="w-4 h-4 mr-2" />
                          Înapoi la pagina principală
                        </Link>
                      </Button>
                      
                      <Button asChild variant="outline">
                        <Link to="/packages">
                          <Package className="w-4 h-4 mr-2" />
                          Vezi pachete
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  // Original Payment Success View
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-purple-50">
      <Navigation />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  {paymentVerified ? (
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                  ) : (
                    <Clock className="w-20 h-20 text-orange-500 mx-auto mb-4" />
                  )}
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {paymentVerified ? 'Plata a fost finalizată cu succes!' : 'Plata este în procesare'}
                  </h1>
                  <p className="text-gray-600 text-lg">
                    {paymentVerified 
                      ? 'Vă mulțumim pentru plată. Comanda dumneavoastră a fost confirmată.'
                      : 'Plata dumneavoastră este în curs de procesare. Vă vom informa când va fi confirmată.'
                    }
                  </p>
                </div>

                {!paymentVerified && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-orange-800 mb-2">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-semibold">Plata în procesare</span>
                    </div>
                    <p className="text-sm text-orange-700">
                      Plata dumneavoastră este în curs de verificare. Acest proces poate dura câteva minute. 
                      Veți primi un email de confirmare când plata va fi finalizată.
                    </p>
                  </div>
                )}

                {orderDetails && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                    <h3 className="font-semibold text-gray-900 mb-4">Detalii comandă</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">ID Comandă:</span>
                        <span className="font-mono">#{orderDetails.id.slice(0, 8)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pachet:</span>
                        <span>{orderDetails.package_name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Provider plată:</span>
                        <span>{getProviderName(orderDetails.payment_provider || 'smartbill')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sumă:</span>
                        <span className="font-semibold">
                          {formatCurrency(
                            orderDetails.total_price, 
                            orderDetails.currency || 'RON',
                            orderDetails.payment_provider
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status plată:</span>
                        <span className={`capitalize font-semibold ${
                          paymentVerified ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {orderDetails.payment_status === 'completed' ? 'Finalizată' : 
                           orderDetails.payment_status === 'pending' ? 'În procesare' : 
                           orderDetails.payment_status}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <p className="text-gray-600">
                    {paymentVerified 
                      ? 'Am primit plata dumneavoastră și comanda este acum în curs de procesare. Veți primi în scurt timp un email de confirmare cu toate detaliile.'
                      : 'Vă vom informa prin email când plata va fi confirmată și comanda va intra în procesare.'
                    }
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <Link to="/">
                        <Home className="w-4 h-4 mr-2" />
                        Înapoi la pagina principală
                      </Link>
                    </Button>
                    
                    <Button asChild variant="outline">
                      <Link to="/packages">
                        <Package className="w-4 h-4 mr-2" />
                        Vezi pachete
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
