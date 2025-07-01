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
import { useRegionConfig } from "@/hooks/useRegionConfig";
import { motion } from "framer-motion";
import { Clock, Download, Gift, Star, Music, Heart } from "lucide-react";
import { usePackages } from "@/hooks/usePackageData";
import { getPackagePrice } from "@/utils/pricing";

const English = () => {
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const { regionConfig } = useRegionConfig();
  const { data: packages = [], isLoading } = usePackages();

  // Set language and currency based on region config, but only if not manually selected
  useEffect(() => {
    if (!regionConfig) return;
    
    // Only auto-set if this is the region's default language and no manual selection
    const hasManualLanguageSelection = localStorage.getItem('language_manual_selection');
    const hasManualCurrencySelection = localStorage.getItem('currency_manual_selection');
    
    if (!hasManualLanguageSelection && language !== 'en' && regionConfig.supportedLanguages.includes('en')) {
      setLanguage('en');
    }
    
    if (!hasManualCurrencySelection && regionConfig.supportedCurrencies.includes(currency)) {
      // Use region default if current currency is not optimal for this region
      if (regionConfig.defaultCurrency !== currency && regionConfig.supportedCurrencies.includes(regionConfig.defaultCurrency as any)) {
        setCurrency(regionConfig.defaultCurrency as any);
      }
    }
  }, [language, currency, setLanguage, setCurrency, regionConfig]);

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
      return 'Instant';
    }
    const days = getEstimatedDeliveryDays(packageValue);
    if (days <= 1) {
      return '1 business day';
    }
    if (days <= 2) {
      return '1-2 business days';
    }
    if (days <= 3) {
      return '2-3 business days';
    }
    if (days <= 5) {
      return '3-5 business days';
    }
    if (days <= 7) {
      return '5-7 business days';
    }
    return '7-10 business days';
  };

  const getPackagePriceFormatted = (pkg: any) => {
    const price = getPackagePrice(pkg, currency as 'EUR' | 'RON');
    const locale = regionConfig?.locale || 'en-GB';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Music className="w-16 h-16 animate-spin mx-auto mb-4 text-orange-500" />
            <p className="text-lg">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const regionTitle = regionConfig?.region === 'RO' ? 'in Romania 🇷🇴' : 
                    regionConfig?.region === 'US' ? 'in the USA 🇺🇸' : 
                    'in Europe 🇪🇺';

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead 
        title={`Personalized Musical Gifts ${regionConfig?.region} | Custom Songs by Mihai Gruia`}
        description={`Create unique personalized songs ${regionConfig?.region === 'RO' ? 'in Romania' : regionConfig?.region === 'US' ? 'in the USA' : 'in Europe'}. Fast digital delivery, professional studio quality. Instant gift cards available.`}
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
              Personalized Musical Gifts
              <span className="block text-orange-400">{regionTitle}</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
              Create unique songs with Mihai Gruia from Akcent. 
              Fast digital delivery, professional studio quality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-lg px-8 py-6">
                <Link to="/order">
                  <Music className="w-5 h-5 mr-2" />
                  Create Your Song
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-white text-black hover:bg-white hover:text-black">
                <Link to="/gift">
                  <Gift className="w-5 h-5 mr-2" />
                  Instant Gift Card
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
              Premium Digital Music Service
            </h2>
            <p className="text-xl max-w-3xl mx-auto text-gray-600">
              Fast digital delivery, permanent access, professional studio quality
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
              <h3 className="text-xl font-semibold mb-2">High-Quality Downloads</h3>
              <p className="text-gray-600">Professional MP3 and WAV files, ready for all your needs</p>
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
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Instant gift cards, personalized songs in 1-5 days</p>
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
              <h3 className="text-xl font-semibold mb-2">Permanent Access</h3>
              <p className="text-gray-600">Your songs are yours forever, unlimited downloads</p>
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
              Our Music Packages
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect package for your personalized musical gift
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
                          Instant
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
                            +{pkg.includes.length - 3} more benefits
                          </li>
                        )}
                      </ul>
                    )}
                    <Button asChild className="w-full" variant={pkg.value === 'premium' ? 'default' : 'outline'}>
                      <Link to={pkg.value === 'gift' ? '/gift' : '/order'}>
                        {pkg.value === 'gift' ? 'Buy Now' : 'Choose This Package'}
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
                View All Detailed Packages
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
              Need express delivery? 🚀
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Add our "Rush Delivery" option to receive your song in 24-48h
            </p>
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
              <Link to="/order">
                Start Now
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default English;
