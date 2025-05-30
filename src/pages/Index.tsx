
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
      <section className="pt-24 pb-16 bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-gray-800">
                Give the Gift of Music
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                A personalized song, created just for your special someone. 
                The most unique gift they'll ever receive.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/packages">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-full">
                    See Packages
                  </Button>
                </Link>
                <Link to="/testimonials">
                  <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-full">
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
              <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg max-w-xs border border-purple-100">
                <h3 className="font-semibold text-gray-900 mb-2">What is MusicGift for?</h3>
                <p className="text-purple-600 font-medium">Cereri în căsătorie</p>
                <Link to="/testimonials">
                  <Button size="sm" className="mt-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full">
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
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">🎁</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Pachet Personal</h3>
                  <p className="text-sm text-purple-600 font-medium mb-3">Un cântec creat special pentru tine și cei dragi.</p>
                </div>
                <div className="text-4xl font-bold text-purple-600 mb-6 text-center">
                  300 <span className="text-lg text-gray-500">RON</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-600">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 text-xs">✓</span>
                    </span>
                    Cântec complet personalizat
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 text-xs">✓</span>
                    </span>
                    Voce profesionistă
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 text-xs">✓</span>
                    </span>
                    3-5 zile livrare
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
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">🌟</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Pachet Premium</h3>
                  <p className="text-sm text-purple-600 font-medium mb-3">Creează un impact. Lasă muzica să vorbească pentru tine.</p>
                </div>
                <div className="text-4xl font-bold text-purple-600 mb-6 text-center">
                  500 <span className="text-lg text-gray-500">RON</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-600">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 text-xs">✓</span>
                    </span>
                    Cântec original cu producție completă
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 text-xs">✓</span>
                    </span>
                    Videoclip animat inclus
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 text-xs">✓</span>
                    </span>
                    5-7 zile livrare
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
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">💼</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Pachet Business</h3>
                  <p className="text-sm text-purple-600 font-medium mb-3">Oferă brandului tău vocea pe care o merită.</p>
                </div>
                <div className="text-4xl font-bold text-purple-600 mb-6 text-center">
                  500 <span className="text-lg text-gray-500">RON</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-600">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 text-xs">✓</span>
                    </span>
                    Cântec compus pentru afacerea ta
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 text-xs">✓</span>
                    </span>
                    Producție premium
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 text-xs">✓</span>
                    </span>
                    Licență comercială limitată
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
