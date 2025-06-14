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
import { motion } from 'framer-motion';
const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [quoteDetails, setQuoteDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const {
    toast
  } = useToast();

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
          const {
            data,
            error
          } = await supabase.from('quote_requests').select('*').eq('id', quoteId).single();
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
          const {
            data,
            error
          } = await supabase.from('orders').select('*').eq('id', orderId).single();
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
    return <div className="min-h-screen bg-cover bg-center bg-no-repeat relative" style={{
      backgroundImage: "url('/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png')"
    }}>
        {/* Enhanced background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-black/50" />
        
        {/* Animated background dots */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse" />
          <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-purple-300/30 rounded-full animate-pulse delay-1000" />
          <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-pink-300/40 rounded-full animate-pulse delay-2000" />
        </div>
        
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh] relative z-10">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/90 text-lg font-medium">
              {isQuoteRequest ? 'Se încarcă detaliile cererii de ofertă...' : 'Se încarcă detaliile comenzii...'}
            </p>
          </div>
        </div>
        <Footer />
      </div>;
  }

  // Quote Request Success View
  if (isQuoteRequest) {
    return <div className="min-h-screen bg-cover bg-center bg-no-repeat relative" style={{
      backgroundImage: "url('/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png')"
    }}>
        {/* Enhanced background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-black/50" />
        
        {/* Animated background dots */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse" />
          <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-purple-300/30 rounded-full animate-pulse delay-1000" />
          <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-pink-300/40 rounded-full animate-pulse delay-2000" />
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-blue-300/25 rounded-full animate-pulse delay-3000" />
        </div>
        
        <Navigation />
        
        <section className="py-16 px-4 relative z-10">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              {/* Decorative gradient separator */}
              <div className="w-32 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mx-auto mb-8 rounded-full opacity-80" />
              
              <motion.div initial={{
              opacity: 0,
              y: 30,
              scale: 0.95
            }} animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }} transition={{
              duration: 0.8,
              delay: 0.2
            }}>
                <Card className="border-0 shadow-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:shadow-purple-500/10 transition-all duration-500">
                  <CardContent className="p-8 md:p-12 text-center relative overflow-hidden">
                    {/* Card decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full translate-y-12 -translate-x-12" />
                    
                    <div className="relative z-10">
                      <div className="mb-8">
                        <motion.div initial={{
                        scale: 0
                      }} animate={{
                        scale: 1
                      }} transition={{
                        duration: 0.6,
                        delay: 0.4
                      }} className="inline-flex items-center justify-center w-24 h-24 bg-orange-500 rounded-full shadow-2xl mb-6 ">
                          <FileText className="w-12 h-12 text-white" />
                        </motion.div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                          Cererea de ofertă a fost trimisă cu succes!
                        </h1>
                        <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                          Vă mulțumim pentru interesul acordat. Echipa noastră va analiza cererea dumneavoastră și vă va contacta în scurt timp cu o ofertă personalizată.
                        </p>
                      </div>

                      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-300/20 rounded-xl p-6 mb-8">
                        <div className="flex items-center gap-3 text-blue-200 mb-4">
                          <Mail className="w-6 h-6" />
                          <span className="font-semibold text-lg">Ce urmează?</span>
                        </div>
                        <ul className="text-sm text-blue-100/90 space-y-2 text-left">
                          <li className="flex items-start gap-2">
                            <span className="text-blue-300">•</span>
                            <span>Echipa noastră va analiza cererea dumneavoastră în detaliu</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-300">•</span>
                            <span>Veți primi o ofertă personalizată în termen de 24-48 de ore</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-300">•</span>
                            <span>Oferta va include toate detaliile și prețurile finale</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-300">•</span>
                            <span>Veți putea să acceptați oferta și să continuați cu plata</span>
                          </li>
                        </ul>
                      </div>

                      {quoteDetails && <motion.div initial={{
                      opacity: 0,
                      y: 20
                    }} animate={{
                      opacity: 1,
                      y: 0
                    }} transition={{
                      duration: 0.6,
                      delay: 0.6
                    }} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8 text-left">
                          <h3 className="font-semibold text-white mb-6 text-lg">Detalii cerere ofertă</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex justify-between items-center py-2 border-b border-white/10">
                              <span className="text-white/70">ID Cerere:</span>
                              <span className="font-mono text-white bg-white/10 px-2 py-1 rounded">#{quoteDetails.id.slice(0, 8)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/10">
                              <span className="text-white/70">Pachet:</span>
                              <span className="text-white">{quoteDetails.package_name}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/10">
                              <span className="text-white/70">Client:</span>
                              <span className="text-white">{quoteDetails.customer_name}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/10">
                              <span className="text-white/70">Email:</span>
                              <span className="text-white">{quoteDetails.customer_email}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/10">
                              <span className="text-white/70">Preț estimativ:</span>
                              <span className="font-semibold text-blue-300">
                                {formatCurrency(quoteDetails.estimated_price, quoteDetails.currency || 'RON')}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/10">
                              <span className="text-white/70">Status:</span>
                              <span className="capitalize font-semibold text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full">
                                În procesare
                              </span>
                            </div>
                          </div>
                        </motion.div>}

                      <div className="space-y-6">
                        <p className="text-white/70 leading-relaxed">
                          Veți primi în scurt timp un email de confirmare cu toate detaliile cererii dumneavoastră de ofertă.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <motion.div whileHover={{
                          scale: 1.05
                        }} whileTap={{
                          scale: 0.98
                        }}>
                            <Button asChild className="bg-orange-500 hover:bg-orange-600 shadow-xl hover:shadow-2xl transition-all duration-300">
                              <Link to="/">
                                <Home className="w-5 h-5 mr-2" />
                                Înapoi la pagina principală
                              </Link>
                            </Button>
                          </motion.div>
                          
                          <motion.div whileHover={{
                          scale: 1.05
                        }} whileTap={{
                          scale: 0.98
                        }}>
                            <Button asChild variant="outline" className="border-white/30 text-black hover:bg-white/10 backdrop-blur-sm">
                              <Link to="/packages">
                                <Package className="w-5 h-5 mr-2" />
                                Vezi pachete
                              </Link>
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Bottom decorative gradient separator */}
              <div className="w-32 h-1 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 mx-auto mt-8 rounded-full opacity-60" />
            </div>
          </div>
        </section>

        <Footer />
      </div>;
  }

  // Original Payment Success View
  return <div className="min-h-screen bg-cover bg-center bg-no-repeat relative" style={{
    backgroundImage: "url('/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png')"
  }}>
      {/* Enhanced background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-black/50" />
      
      {/* Animated background dots */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse" />
        <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-purple-300/30 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-pink-300/40 rounded-full animate-pulse delay-2000" />
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-green-300/25 rounded-full animate-pulse delay-3000" />
      </div>
      
      <Navigation />
      
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            {/* Decorative gradient separator */}
            <div className="w-32 h-1 bg-gradient-to-r from-green-400 via-purple-500 to-pink-500 mx-auto mb-8 rounded-full opacity-80" />
            
            <motion.div initial={{
            opacity: 0,
            y: 30,
            scale: 0.95
          }} animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }} transition={{
            duration: 0.8,
            delay: 0.2
          }}>
              <Card className="border-0 shadow-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:shadow-green-500/10 transition-all duration-500">
                <CardContent className="p-8 md:p-12 text-center relative overflow-hidden">
                  {/* Card decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-500/10 to-transparent rounded-full translate-y-12 -translate-x-12" />
                  
                  <div className="relative z-10">
                    <div className="mb-8">
                      <motion.div initial={{
                      scale: 0
                    }} animate={{
                      scale: 1
                    }} transition={{
                      duration: 0.6,
                      delay: 0.4
                    }} className="inline-flex items-center justify-center w-24 h-24 rounded-full shadow-2xl mb-6" style={{
                      background: paymentVerified ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #f59e0b, #d97706)'
                    }}>
                        {paymentVerified ? <CheckCircle className="w-12 h-12 text-white" /> : <Clock className="w-12 h-12 text-white" />}
                      </motion.div>
                      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-green-300 to-purple-300 bg-clip-text text-transparent">
                        {paymentVerified ? 'Plata a fost finalizată cu succes!' : 'Plata este în procesare'}
                      </h1>
                      <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                        {paymentVerified ? 'Vă mulțumim pentru plată. Comanda dumneavoastră a fost confirmată.' : 'Plata dumneavoastră este în curs de procesare. Vă vom informa când va fi confirmată.'}
                      </p>
                    </div>

                    {!paymentVerified && <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 backdrop-blur-sm border border-orange-300/20 rounded-xl p-6 mb-8">
                        <div className="flex items-center gap-3 text-orange-200 mb-4">
                          <AlertCircle className="w-6 h-6" />
                          <span className="font-semibold text-lg">Plata în procesare</span>
                        </div>
                        <p className="text-sm text-orange-100/90">
                          Plata dumneavoastră este în curs de verificare. Acest proces poate dura câteva minute. 
                          Veți primi un email de confirmare când plata va fi finalizată.
                        </p>
                      </div>}

                    {orderDetails && <motion.div initial={{
                    opacity: 0,
                    y: 20
                  }} animate={{
                    opacity: 1,
                    y: 0
                  }} transition={{
                    duration: 0.6,
                    delay: 0.6
                  }} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8 text-left">
                        <h3 className="font-semibold text-white mb-6 text-lg">Detalii comandă</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between items-center py-2 border-b border-white/10">
                            <span className="text-white/70">ID Comandă:</span>
                            <span className="font-mono text-white bg-white/10 px-2 py-1 rounded">#{orderDetails.id.slice(0, 8)}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-white/10">
                            <span className="text-white/70">Pachet:</span>
                            <span className="text-white">{orderDetails.package_name || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-white/10">
                            <span className="text-white/70">Provider plată:</span>
                            <span className="text-white">{getProviderName(orderDetails.payment_provider || 'smartbill')}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-white/10">
                            <span className="text-white/70">Sumă:</span>
                            <span className="font-semibold text-green-300">
                              {formatCurrency(orderDetails.total_price, orderDetails.currency || 'RON', orderDetails.payment_provider)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-white/10 md:col-span-2">
                            <span className="text-white/70">Status plată:</span>
                            <span className={`capitalize font-semibold px-3 py-1 rounded-full ${paymentVerified ? 'text-green-300 bg-green-500/20' : 'text-orange-300 bg-orange-500/20'}`}>
                              {orderDetails.payment_status === 'completed' ? 'Finalizată' : orderDetails.payment_status === 'pending' ? 'În procesare' : orderDetails.payment_status}
                            </span>
                          </div>
                        </div>
                      </motion.div>}

                    <div className="space-y-6">
                      <p className="text-white/70 leading-relaxed">
                        {paymentVerified ? 'Am primit plata dumneavoastră și comanda este acum în curs de procesare. Veți primi în scurt timp un email de confirmare cu toate detaliile.' : 'Vă vom informa prin email când plata va fi confirmată și comanda va intra în procesare.'}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.div whileHover={{
                        scale: 1.05
                      }} whileTap={{
                        scale: 0.98
                      }}>
                          <Button asChild className="bg-orange-500 hover:bg-orange-600 shadow-xl hover:shadow-2xl transition-all duration-300">
                            <Link to="/">
                              <Home className="w-5 h-5 mr-2" />
                              Înapoi la pagina principală
                            </Link>
                          </Button>
                        </motion.div>
                        
                        <motion.div whileHover={{
                        scale: 1.05
                      }} whileTap={{
                        scale: 0.98
                      }}>
                          <Button asChild variant="outline" className="border-white/30 text-black hover:bg-white/10 backdrop-blur-sm">
                            <Link to="/packages">
                              <Package className="w-5 h-5 mr-2" />
                              Vezi pachete
                            </Link>
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Bottom decorative gradient separator */}
            <div className="w-32 h-1 bg-gradient-to-r from-pink-400 via-purple-500 to-green-500 mx-auto mt-8 rounded-full opacity-60" />
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default PaymentSuccess;