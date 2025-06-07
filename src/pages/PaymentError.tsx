
import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, CreditCard, Mail, RefreshCw } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const PaymentError = () => {
  const [searchParams] = useSearchParams();
  const errorCode = searchParams.get('errorCode');
  const errorMessage = searchParams.get('errorMessage');
  const orderId = searchParams.get('orderId');

  const getErrorDetails = () => {
    switch (errorCode) {
      case 'paymentConfigError':
        return {
          title: 'Configurare sistem de plată',
          description: 'Sistemul de plată nu este configurat corect. Vă rugăm să încercați din nou mai târziu.',
          suggestions: [
            'Contactați echipa de suport pentru asistență tehnică',
            'Încercați să folosiți o altă metodă de plată dacă este disponibilă',
            'Verificați din nou peste câteva minute'
          ]
        };
      case 'paymentUrlFailed':
        return {
          title: 'Link de plată indisponibil',
          description: 'Nu s-a putut genera linkul de plată. Documentul a fost creat dar sistemul de plăți nu este disponibil.',
          suggestions: [
            'Contactați administratorul sistemului pentru configurare',
            'Documentul dumneavoastră a fost salvat și poate fi plătit ulterior',
            'Încercați din nou mai târziu când sistemul va fi operațional',
            'Folosiți o altă metodă de plată dacă este disponibilă'
          ]
        };
      case 'orderCreationFailed':
        return {
          title: 'Eroare la crearea comenzii',
          description: 'Comanda nu a putut fi creată din cauza unei erori de sistem.',
          suggestions: [
            'Verificați datele introduse și încercați din nou',
            'Asigurați-vă că aveți o conexiune stabilă la internet',
            'Contactați echipa de suport dacă problema persistă',
            'Încercați să plasați comanda din nou'
          ]
        };
      case 'paymentFailed':
      default:
        return {
          title: 'Eroare de procesare plată',
          description: 'Plata nu a putut fi procesată din cauza unei erori tehnice sau de configurare.',
          suggestions: [
            'Verificați datele cardului și încercați din nou',
            'Asigurați-vă că aveți fonduri suficiente în cont',
            'Încercați să folosiți o altă metodă de plată',
            'Contactați banca dumneavoastră dacă problema persistă',
            'Contactați echipa noastră de suport pentru asistență'
          ]
        };
    }
  };

  const errorDetails = getErrorDetails();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <Navigation />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {errorDetails.title}
                  </h1>
                  <p className="text-gray-600 text-lg">
                    {errorDetails.description}
                  </p>
                </div>

                {(errorCode || errorMessage || orderId) && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6 text-left">
                    <h3 className="font-semibold text-red-800 mb-2">Detalii tehnice</h3>
                    {orderId && orderId !== 'unknown' && (
                      <p className="text-sm text-red-700 mb-1">
                        <strong>ID comandă:</strong> {orderId}
                      </p>
                    )}
                    {errorCode && (
                      <p className="text-sm text-red-700 mb-1">
                        <strong>Cod eroare:</strong> {errorCode}
                      </p>
                    )}
                    {errorMessage && (
                      <p className="text-sm text-red-700">
                        <strong>Mesaj:</strong> {decodeURIComponent(errorMessage)}
                      </p>
                    )}
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Ce puteți face?</h3>
                  <ul className="text-left text-gray-700 space-y-2 text-sm">
                    {errorDetails.suggestions.map((suggestion, index) => (
                      <li key={index}>• {suggestion}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <Link to="/order">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Încearcă din nou
                      </Link>
                    </Button>
                    
                    <Button asChild variant="outline">
                      <Link to="/contact">
                        <Mail className="w-4 h-4 mr-2" />
                        Contactează suportul
                      </Link>
                    </Button>
                  </div>
                  
                  <Button asChild variant="ghost">
                    <Link to="/">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Înapoi la pagina principală
                    </Link>
                  </Button>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      Nu au fost efectuate debităti din contul dumneavoastră din cauza acestei erori.
                    </p>
                    {orderId && orderId !== 'unknown' && (
                      <p className="text-sm text-gray-500 mt-1">
                        Comanda cu ID-ul {orderId.slice(0, 8)}... a fost salvată și poate fi finalizată mai târziu.
                      </p>
                    )}
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

export default PaymentError;
