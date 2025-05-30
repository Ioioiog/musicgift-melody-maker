
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const Testimonials = () => {
  const { t } = useLanguage();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const testimonials = [
    {
      quote: t('testimonial1'),
      author: t('author1'),
      location: t('location1')
    },
    {
      quote: t('testimonial2'),
      author: t('author2'), 
      location: t('location2')
    },
    {
      quote: t('testimonial3'),
      author: t('author3'),
      location: t('location3')
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-purple text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">{t('testimonialsTitle')}</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            {t('testimonialsSubtitle')}
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-8 shadow-xl">
              <CardContent className="p-12">
                <div className="text-center">
                  <div className="text-6xl text-purple-200 mb-6">"</div>
                  <blockquote className="text-xl text-gray-700 leading-relaxed mb-8 italic">
                    {testimonials[currentTestimonial].quote}
                  </blockquote>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-gray-900">
                      {testimonials[currentTestimonial].author}
                    </h4>
                    <p className="text-gray-600">
                      {testimonials[currentTestimonial].location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-center space-x-6">
              <Button 
                variant="outline" 
                size="icon"
                onClick={prevTestimonial}
                className="rounded-full border-purple-200 hover:bg-purple-50"
              >
                ←
              </Button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentTestimonial 
                        ? 'bg-purple-600' 
                        : 'bg-purple-200'
                    }`}
                    onClick={() => setCurrentTestimonial(index)}
                  />
                ))}
              </div>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={nextTestimonial}
                className="rounded-full border-purple-200 hover:bg-purple-50"
              >
                →
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Testimonials;
