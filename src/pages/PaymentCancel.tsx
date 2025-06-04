
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, CreditCard, HelpCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const PaymentCancel = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      <Navigation />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <XCircle className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Plata a fost anulată
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Plata dumneavoastră a fost anulată. Nu au fost efectuate debităti din contul dumneavoastră.
                  </p>
                </div>

                <div className="bg-yellow-50 rounded-lg p-6 mb-6">
                  <p className="text-gray-700 mb-4">
                    Nu vă faceți griji! Comanda dumneavoastră este încă salvată și puteți finaliza plata mai târziu.
                  </p>
                  <div className="text-left text-sm text-gray-600 space-y-2">
                    <h4 className="font-semibold text-gray-800 mb-2">Motive posibile pentru anulare:</h4>
                    <ul className="space-y-1">
                      <li>• Ați închis fereastra de plată</li>
                      <li>• Ați apăsat butonul "Anulează" în procesul de plată</li>
                      <li>• A expirat timpul limită pentru finalizarea plății</li>
                      <li>• Probleme tehnice temporare</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <Link to="/order">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Încearcă din nou plata
                      </Link>
                    </Button>
                    
                    <Button asChild variant="outline">
                      <Link to="/packages">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Înapoi la pachete
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-2">
                      Aveți nevoie de ajutor?
                    </p>
                    <Button asChild variant="ghost" size="sm">
                      <Link to="/contact" className="text-purple-600 hover:underline">
                        <HelpCircle className="w-4 h-4 mr-2" />
                        Contactați echipa noastră de suport
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

export default PaymentCancel;
