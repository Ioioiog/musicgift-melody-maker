
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-purple text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Give the Gift of Music
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                A personalized song, created just for your special someone. 
                The most unique gift they'll ever receive.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/packages">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold">
                    See Packages
                  </Button>
                </Link>
                <Link to="/testimonials">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                    Listen to Samples
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative lg:pl-12">
              <div className="w-80 h-80 mx-auto flex items-center justify-center animate-float">
                <img 
                  src="/lovable-uploads/65518432-abfe-42fc-acc5-25014d321134.png" 
                  alt="Music Gift Box" 
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Floating music notes */}
              <div className="absolute top-10 right-10 text-4xl animate-bounce delay-75">🎵</div>
              <div className="absolute bottom-20 left-0 text-3xl animate-bounce delay-150">🎶</div>
              <div className="absolute top-32 left-10 text-2xl animate-bounce delay-300">♪</div>
              
              {/* Info Card */}
              <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs">
                <h3 className="font-semibold text-gray-900 mb-2">What is MusicGift for?</h3>
                <p className="text-purple-600 font-medium">Wedding Songs</p>
                <Link to="/testimonials">
                  <Button size="sm" className="mt-3 bg-gradient-purple">
                    See examples
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-4xl font-bold gradient-text">1,000+</h3>
              <p className="text-gray-600">Songs Created</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold gradient-text">5+</h3>
              <p className="text-gray-600">Years Experience</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold gradient-text">98%</h3>
              <p className="text-gray-600">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Package</h2>
            <p className="text-xl text-gray-600">Select the perfect music package that fits your needs and budget</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Personal Package */}
            <Card className="relative hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Personal</h3>
                <div className="text-4xl font-bold text-purple-600 mb-6">
                  300 <span className="text-lg text-gray-500">RON</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-600">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 text-xs">✓</span>
                    </span>
                    Custom lyrics based on your story
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 text-xs">✓</span>
                    </span>
                    Professional recording
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 text-xs">✓</span>
                    </span>
                    7-10 days delivery
                  </li>
                </ul>
                <Button className="w-full bg-gradient-purple hover:opacity-90">
                  Order Now
                </Button>
              </CardContent>
            </Card>

            {/* Business Package */}
            <Card className="relative hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Business</h3>
                <div className="text-4xl font-bold text-purple-600 mb-6">
                  900 <span className="text-lg text-gray-500">RON</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-600">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 text-xs">✓</span>
                    </span>
                    Custom jingle for your business
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 text-xs">✓</span>
                    </span>
                    Commercial license included
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 text-xs">✓</span>
                    </span>
                    Unlimited revisions
                  </li>
                </ul>
                <Button className="w-full bg-gradient-purple hover:opacity-90">
                  Order Now
                </Button>
              </CardContent>
            </Card>

            {/* Premium Package */}
            <Card className="relative hover:shadow-lg transition-shadow border-2 border-purple-200">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-purple text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
                <div className="text-4xl font-bold text-purple-600 mb-6">
                  1000 <span className="text-lg text-gray-500">RON</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-600">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 text-xs">✓</span>
                    </span>
                    Custom lyrics based on your story
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 text-xs">✓</span>
                    </span>
                    Lyric video included
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 text-xs">✓</span>
                    </span>
                    5-7 days delivery
                  </li>
                </ul>
                <Button className="w-full bg-gradient-purple hover:opacity-90">
                  Order Now
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/packages">
              <Button size="lg" variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                View All Packages
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-purple text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Create Something Special?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Let us help you create a personalized musical gift that will be treasured forever.
          </p>
          <Link to="/packages">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold">
              Start Your Order
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
