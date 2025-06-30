
import React, { useEffect } from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import StructuredDataLoader from "@/components/StructuredDataLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { motion } from "framer-motion";
import { Clock, Download, Gift, Star, Music, Heart } from "lucide-react";
import { usePackages } from "@/hooks/usePackageData";
import { getPackagePrice } from "@/utils/pricing";

const Italy = () => {
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const { data: packages = [], isLoading } = usePackages();

  // Auto-set Italian language and EUR currency for Italian visitors
  useEffect(() => {
    if (language !== 'it') {
      setLanguage('it');
    }
    if (currency !== 'EUR') {
      setCurrency('EUR');
    }
  }, [language, currency, setLanguage, setCurrency]);

  const getEstimatedDeliveryDays = (packageValue: string) => {
    const deliveryMapping: { [key: string]: number } = {
      'gift': 0,
      'plus': 1.5,
      'personal': 4,
      'premium': 6,
      'business': 6,
      'artist': 8.5,
      'remix': 4,
      'instrumental': 4,
      'wedding': 6,
      'baptism': 4,
      'comingOfAge': 6,
      'dj': 8.5
    };
    return deliveryMapping[packageValue] || 5;
  };

  const getDeliveryTimeText = (packageValue: string) => {
    if (packageValue === 'gift') {
      return 'Istantaneo';
    }
    const days = getEstimatedDeliveryDays(packageValue);
    if (days <= 1) {
      return '1 giorno lavorativo';
    }
    if (days <= 2) {
      return '1-2 giorni lavorativi';
    }
    if (days <= 3) {
      return '2-3 giorni lavorativi';
    }
    if (days <= 5) {
      return '3-5 giorni lavorativi';
    }
    if (days <= 7) {
      return '5-7 giorni lavorativi';
    }
    return '7-10 giorni lavorativi';
  };

  const getPackagePriceFormatted = (pkg: any) => {
    const price = getPackagePrice(pkg, 'EUR');
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Music className="w-16 h-16 animate-spin mx-auto mb-4 text-orange-500" />
            <p className="text-lg">Caricamento...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title="Regali Musicali Personalizzati Italia | Canzoni su Misura di Mihai Gruia" 
        description="Crea canzoni personalizzate uniche in Italia. Consegna digitale veloce, qualità studio professionale. Carte regalo istantanee disponibili." 
        url="https://www.musicgift.ro/it" 
      />
      <StructuredDataLoader />
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 text-white relative overflow-hidden" style={{
        backgroundImage: 'url(/uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center my-[75px]"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Regali Musicali Personalizzati
              <span className="block text-orange-400">in Italia 🇮🇹</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
              Crea canzoni uniche con Mihai Gruia di Akcent. 
              Consegna digitale veloce, qualità studio professionale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-lg px-8 py-6">
                <Link to="/order">
                  <Music className="w-5 h-5 mr-2" />
                  Crea la tua canzone
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-white text-black hover:bg-white hover:text-black">
                <Link to="/gift">
                  <Gift className="w-5 h-5 mr-2" />
                  Carta regalo istantanea
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Digital Service Benefits */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Servizio Musicale Digitale Premium
            </h2>
            <p className="text-xl max-w-3xl mx-auto text-gray-600">
              Consegna digitale veloce, accesso permanente, qualità studio professionale
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Download di alta qualità</h3>
              <p className="text-gray-600">File MP3 e WAV professionali, pronti per tutte le tue esigenze</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Consegna veloce</h3>
              <p className="text-gray-600">Carte regalo istantanee, canzoni personalizzate in 1-5 giorni</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Accesso permanente</h3>
              <p className="text-gray-600">Le tue canzoni sono tue per sempre, download illimitati</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              I nostri pacchetti musicali
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Scegli il pacchetto perfetto per il tuo regalo musicale personalizzato
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl">{t(pkg.label_key)}</CardTitle>
                      {pkg.value === 'gift' && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Gift className="w-3 h-3 mr-1" />
                          Istantaneo
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-orange-500">
                        {getPackagePriceFormatted(pkg)}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {getDeliveryTimeText(pkg.value)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      {t(pkg.description_key)}
                    </p>
                    {pkg.includes && pkg.includes.length > 0 && (
                      <ul className="space-y-2 mb-4">
                        {pkg.includes.slice(0, 3).map((include: any) => (
                          <li key={include.id} className="flex items-center text-sm">
                            <Star className="w-3 h-3 mr-2 text-orange-500 flex-shrink-0" />
                            <span>{t(include.include_key)}</span>
                          </li>
                        ))}
                        {pkg.includes.length > 3 && (
                          <li className="text-sm text-gray-500">
                            +{pkg.includes.length - 3} altri vantaggi
                          </li>
                        )}
                      </ul>
                    )}
                    <Button asChild className="w-full" variant={pkg.value === 'premium' ? 'default' : 'outline'}>
                      <Link to={pkg.value === 'gift' ? '/gift' : '/order'}>
                        {pkg.value === 'gift' ? 'Acquista ora' : 'Scegli questo pacchetto'}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-12"
          >
            <Button asChild size="lg" variant="outline">
              <Link to="/packages">
                Visualizza tutti i pacchetti dettagliati
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Rush Delivery Section */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Hai bisogno di consegna express? 🚀
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Aggiungi la nostra opzione "Consegna Express" per ricevere la tua canzone in 24-48h
            </p>
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
              <Link to="/order">
                Inizia ora
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Italy;
