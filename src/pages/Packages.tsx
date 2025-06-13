
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Check, Music, Star, Crown, Heart, Gift } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useStructuredData } from "@/components/StructuredData";
import OptimizedImage from "@/components/OptimizedImage";
import { packages } from "@/data/packages";

const Packages = () => {
  const { t } = useLanguage();
  const { serviceSchema } = useStructuredData();

  const packagesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Music Gift Packages",
    "description": "Professional personalized song creation packages",
    "numberOfItems": packages.length,
    "itemListElement": packages.map((pkg, index) => ({
      "@type": "Product",
      "position": index + 1,
      "name": pkg.name,
      "description": pkg.description,
      "offers": {
        "@type": "Offer",
        "price": pkg.price,
        "priceCurrency": "RON"
      }
    }))
  };

  return (
    <>
      <SEOHead
        title={t('packages', 'Song Packages') + ' - MusicGift.ro'}
        description={t('packagesDescription', 'Choose from our professional personalized song packages. From basic to premium options, find the perfect musical gift for any occasion.')}
        structuredData={packagesSchema}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Navigation />
        
        <main className="pt-16">
          {/* Hero Section */}
          <section className="relative py-20 px-4 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <OptimizedImage
                src="/lovable-uploads/9d0d10ef-2340-4632-8df0-f5058547a0c9.png"
                alt="Musical packages background with instruments"
                className="w-full h-full object-cover opacity-20"
                priority={true}
                width={1920}
                height={1080}
              />
            </div>
            
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                {t('chooseYourPackage', 'Choose Your Package')}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                {t('packagesSubtitle', 'Professional personalized songs crafted to perfection for every occasion and budget')}
              </p>
            </div>
          </section>

          {/* Packages Grid */}
          <section className="py-16 px-4" aria-label="Available Song Packages">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {packages.map((pkg, index) => (
                  <Card 
                    key={pkg.id} 
                    className={`relative bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all duration-300 hover:scale-105 ${
                      pkg.popular ? 'ring-2 ring-orange-400' : ''
                    }`}
                  >
                    {pkg.popular && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1">
                        <Star className="w-4 h-4 mr-1" aria-hidden="true" />
                        {t('mostPopular', 'Most Popular')}
                      </Badge>
                    )}
                    
                    <CardHeader className="text-center pb-4">
                      <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 rounded-full">
                        {pkg.id === 'basic' && <Music className="w-8 h-8 text-white" aria-hidden="true" />}
                        {pkg.id === 'standard' && <Heart className="w-8 h-8 text-white" aria-hidden="true" />}
                        {pkg.id === 'premium' && <Crown className="w-8 h-8 text-white" aria-hidden="true" />}
                        {pkg.id === 'deluxe' && <Gift className="w-8 h-8 text-white" aria-hidden="true" />}
                      </div>
                      <CardTitle className="text-2xl font-bold mb-2">{pkg.name}</CardTitle>
                      <CardDescription className="text-white/80 text-lg">
                        {pkg.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-orange-400 mb-2">
                          {pkg.price} RON
                        </div>
                        <div className="text-white/60">{pkg.deliveryTime}</div>
                      </div>
                      
                      <ul className="space-y-3" role="list">
                        {pkg.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                            <span className="text-white/90">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    
                    <CardFooter className="pt-6">
                      <Link to={`/packages/${pkg.id}`} className="w-full">
                        <Button 
                          className={`w-full py-3 text-lg font-medium transition-all duration-300 focus:ring-2 ${
                            pkg.popular 
                              ? 'bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-300' 
                              : 'bg-white/20 hover:bg-white/30 text-white border border-white/30 focus:ring-white/50'
                          }`}
                          aria-label={`Select ${pkg.name} package - ${pkg.price} RON`}
                        >
                          {t('selectPackage', 'Select Package')}
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 px-4 bg-white/5 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                {t('frequentlyAskedQuestions', 'Frequently Asked Questions')}
              </h2>
              <p className="text-lg text-white/80 mb-8">
                {t('faqDescription', 'Have questions about our packages? We\'re here to help!')}
              </p>
              <Link to="/contact">
                <Button 
                  size="lg" 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 focus:ring-2 focus:ring-purple-300"
                  aria-label={t('contactUs', 'Contact Us') + ' - ' + t('getAnswers', 'Get answers to your questions')}
                >
                  {t('contactUs', 'Contact Us')}
                </Button>
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Packages;
