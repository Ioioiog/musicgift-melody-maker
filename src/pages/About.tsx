
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Music, Award, Users, Clock, Target } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useStructuredData } from "@/components/StructuredData";
import OptimizedImage from "@/components/OptimizedImage";

const About = () => {
  const { t } = useLanguage();
  const { organizationSchema } = useStructuredData();

  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About MusicGift.ro",
    "description": t('aboutDescription', 'Learn about MusicGift.ro - the premier personalized song creation service'),
    "mainEntity": organizationSchema
  };

  return (
    <>
      <SEOHead
        title={t('aboutUs', 'About Us') + ' - MusicGift.ro'}
        description={t('aboutDescription', 'Learn about MusicGift.ro - the premier personalized song creation service with over 20 years of musical experience')}
        structuredData={aboutPageSchema}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Navigation />
        
        <main className="pt-16">
          {/* Hero Section */}
          <section className="relative py-20 px-4 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <OptimizedImage
                src="/lovable-uploads/9d0d10ef-2340-4632-8df0-f5058547a0c9.png"
                alt="Musical instruments and musical notes background"
                className="w-full h-full object-cover opacity-20"
                priority={true}
                width={1920}
                height={1080}
              />
            </div>
            
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                {t('aboutUs')}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                {t('aboutHeroDescription', 'Creating personalized musical memories for over 20 years')}
              </p>
            </div>
          </section>

          {/* Story Section */}
          <section className="py-16 px-4 bg-white/10 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    {t('ourStory', 'Our Story')}
                  </h2>
                  <p className="text-lg text-white/90 mb-6 leading-relaxed">
                    {t('storyDescription', 'MusicGift.ro was born from a passion for music and the belief that every special moment deserves its own unique soundtrack.')}
                  </p>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-400 mb-2">2000+</div>
                      <div className="text-white/80">{t('personalizedSongs', 'Personalized Songs')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-2">20+</div>
                      <div className="text-white/80">{t('yearsExperience', 'Years Experience')}</div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <OptimizedImage
                    src="/lovable-uploads/b4c3e4f4-7bf8-4e27-9293-dbbd3de72dc2.png"
                    alt="Musicians creating personalized songs in studio"
                    className="rounded-2xl shadow-2xl"
                    width={600}
                    height={400}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
                {t('ourValues', 'Our Values')}
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <Heart className="w-16 h-16 text-red-400 mx-auto mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-bold text-white mb-4">{t('passion', 'Passion')}</h3>
                  <p className="text-white/80">{t('passionDescription', 'Every song we create is infused with genuine emotion and care')}</p>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-bold text-white mb-4">{t('quality', 'Quality')}</h3>
                  <p className="text-white/80">{t('qualityDescription', 'Professional production standards ensure every song is perfect')}</p>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <Users className="w-16 h-16 text-blue-400 mx-auto mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-bold text-white mb-4">{t('community', 'Community')}</h3>
                  <p className="text-white/80">{t('communityDescription', 'Building connections through the universal language of music')}</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 px-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {t('readyToStart', 'Ready to Create Your Musical Memory?')}
              </h2>
              <p className="text-xl text-white/90 mb-8">
                {t('ctaDescription', 'Join thousands of satisfied customers who have created unforgettable musical gifts')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/order">
                  <Button 
                    size="lg" 
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg focus:ring-2 focus:ring-orange-300"
                    aria-label={t('orderNow', 'Order Now') + ' - ' + t('createPersonalizedSong', 'Create a personalized song')}
                  >
                    <Music className="w-5 h-5 mr-2" aria-hidden="true" />
                    {t('orderNow', 'Order Now')}
                  </Button>
                </Link>
                <Link to="/packages">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg focus:ring-2 focus:ring-white/50"
                    aria-label={t('viewPackages', 'View Packages') + ' - ' + t('exploreOptions', 'Explore our song packages and options')}
                  >
                    {t('viewPackages', 'View Packages')}
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default About;
