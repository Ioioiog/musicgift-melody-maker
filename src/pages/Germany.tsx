
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

const Germany = () => {
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const { data: packages = [], isLoading } = usePackages();

  // Auto-set German language and EUR currency for German visitors
  useEffect(() => {
    if (language !== 'de') {
      setLanguage('de');
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
      return 'Sofort';
    }
    const days = getEstimatedDeliveryDays(packageValue);
    if (days <= 1) {
      return '1 Werktag';
    }
    if (days <= 2) {
      return '1-2 Werktage';
    }
    if (days <= 3) {
      return '2-3 Werktage';
    }
    if (days <= 5) {
      return '3-5 Werktage';
    }
    if (days <= 7) {
      return '5-7 Werktage';
    }
    return '7-10 Werktage';
  };

  const getPackagePriceFormatted = (pkg: any) => {
    const price = getPackagePrice(pkg, 'EUR');
    return new Intl.NumberFormat('de-DE', {
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
            <p className="text-lg">Laden...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title="Personalisierte Musikgeschenke Deutschland | Individuelle Lieder von Mihai Gruia" 
        description="Erstellen Sie einzigartige personalisierte Lieder in Deutschland. Schnelle digitale Lieferung, professionelle Studioqualität. Sofortige Geschenkkarten verfügbar." 
        url="https://www.musicgift.ro/de" 
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
              Personalisierte Musikgeschenke
              <span className="block text-orange-400">in Deutschland 🇩🇪</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
              Erstellen Sie einzigartige Lieder mit Mihai Gruia von Akcent. 
              Schnelle digitale Lieferung, professionelle Studioqualität.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-lg px-8 py-6">
                <Link to="/order">
                  <Music className="w-5 h-5 mr-2" />
                  Ihr Lied erstellen
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-white text-black hover:bg-white hover:text-black">
                <Link to="/gift">
                  <Gift className="w-5 h-5 mr-2" />
                  Sofortige Geschenkkarte
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
              Premium Digitaler Musikservice
            </h2>
            <p className="text-xl max-w-3xl mx-auto text-gray-600">
              Schnelle digitale Lieferung, dauerhafter Zugang, professionelle Studioqualität
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
              <h3 className="text-xl font-semibold mb-2">Hochwertige Downloads</h3>
              <p className="text-gray-600">Professionelle MP3- und WAV-Dateien, bereit für all Ihre Bedürfnisse</p>
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
              <h3 className="text-xl font-semibold mb-2">Schnelle Lieferung</h3>
              <p className="text-gray-600">Sofortige Geschenkkarten, personalisierte Lieder in 1-5 Tagen</p>
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
              <h3 className="text-xl font-semibold mb-2">Dauerhafter Zugang</h3>
              <p className="text-gray-600">Ihre Lieder gehören Ihnen für immer, unbegrenzte Downloads</p>
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
              Unsere Musikpakete
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Wählen Sie das perfekte Paket für Ihr personalisiertes Musikgeschenk
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
                          Sofort
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
                            +{pkg.includes.length - 3} weitere Vorteile
                          </li>
                        )}
                      </ul>
                    )}
                    <Button asChild className="w-full" variant={pkg.value === 'premium' ? 'default' : 'outline'}>
                      <Link to={pkg.value === 'gift' ? '/gift' : '/order'}>
                        {pkg.value === 'gift' ? 'Jetzt kaufen' : 'Dieses Paket wählen'}
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
                Alle detaillierten Pakete anzeigen
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
              Brauchen Sie Express-Lieferung? 🚀
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Fügen Sie unsere "Express-Lieferung" Option hinzu, um Ihr Lied in 24-48h zu erhalten
            </p>
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
              <Link to="/order">
                Jetzt starten
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Germany;
