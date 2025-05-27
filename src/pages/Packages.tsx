
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Packages = () => {
  const packages = [
    {
      name: "Personal",
      price: "300",
      features: [
        { text: "Custom lyrics based on your story", included: true },
        { text: "Professional recording", included: true },
        { text: "High-quality digital delivery", included: true },
        { text: "7-10 days delivery", included: true },
        { text: "Video production", included: false },
        { text: "Commercial rights", included: false }
      ],
      popular: false
    },
    {
      name: "Business", 
      price: "900",
      features: [
        { text: "Custom jingle for your business", included: true },
        { text: "Professional recording", included: true },
        { text: "Multiple format delivery", included: true },
        { text: "Commercial license included", included: true },
        { text: "Unlimited revisions", included: true },
        { text: "Rush delivery available", included: true }
      ],
      popular: false
    },
    {
      name: "Premium",
      price: "1000", 
      features: [
        { text: "Custom lyrics based on your story", included: true },
        { text: "Professional recording", included: true },
        { text: "High-quality digital delivery", included: true },
        { text: "5-7 days delivery", included: true },
        { text: "Lyric video included", included: true },
        { text: "2 revisions included", included: true }
      ],
      popular: true
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-purple text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">Choose Your Package</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Select the perfect music package that fits your needs and budget
          </p>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {packages.map((pkg, index) => (
              <Card 
                key={index} 
                className={`relative hover:shadow-xl transition-all duration-300 ${
                  pkg.popular ? 'border-2 border-purple-200 scale-105' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{pkg.name}</h3>
                    <div className="text-5xl font-bold text-purple-600 mb-2">
                      {pkg.price}
                      <span className="text-lg text-gray-500 ml-2">RON</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                          feature.included 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          <span className="text-xs font-bold">
                            {feature.included ? '✓' : '✕'}
                          </span>
                        </span>
                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full ${
                      pkg.popular 
                        ? 'bg-gradient-purple hover:opacity-90 text-white' 
                        : 'bg-gradient-purple hover:opacity-90'
                    }`}
                    size="lg"
                  >
                    Order Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Packages;
