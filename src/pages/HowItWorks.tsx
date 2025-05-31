
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const HowItWorks = () => {
  const { t } = useLanguage();
  
  const steps = [
    {
      number: "1",
      title: t('choosePackage'),
      description: t('choosePackageDesc'),
      color: "bg-green-500"
    },
    {
      number: "2", 
      title: t('tellYourStory'),
      description: t('tellYourStoryDesc'),
      color: "bg-gradient-purple"
    },
    {
      number: "3",
      title: t('weCreate'),
      description: t('weCreateDesc'),
      color: "bg-gray-400"
    },
    {
      number: "4",
      title: t('deliverDelight'), 
      description: t('deliverDelightDesc'),
      color: "bg-gray-300"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Page Title */}
      <section className="pt-24 pb-8 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">{t('howItWorksTitle')}</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('howItWorksSubtitle')}
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2 hidden lg:block"></div>
              <div className="absolute top-1/2 left-0 w-3/4 h-1 bg-gradient-purple transform -translate-y-1/2 hidden lg:block"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {steps.map((step, index) => (
                  <div key={index} className="relative">
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-8 text-center">
                        <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl relative z-10`}>
                          {step.number}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{step.description}</p>
                      </CardContent>
                    </Card>
                    
                    {/* Connecting dots for mobile */}
                    {index < steps.length - 1 && (
                      <div className="lg:hidden flex justify-center my-4">
                        <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;
