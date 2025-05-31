import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
const About = () => {
  const {
    t
  } = useLanguage();
  const entities = [{
    title: t('mihaiGruiaTitle'),
    description: t('mihaiGruiaDescription'),
    color: "bg-purple-500"
  }, {
    title: t('mangoRecordsTitle'),
    description: t('mangoRecordsDescription'),
    color: "bg-blue-500"
  }, {
    title: t('domgStudioTitle'),
    description: t('domgStudioDescription'),
    color: "bg-green-500"
  }, {
    title: t('doMusicForGoodTitle'),
    description: t('doMusicForGoodDescription'),
    color: "bg-orange-500"
  }];
  return <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Page Title */}
      

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-purple-600 mb-6">
                  {t('aboutSubtitle')}
                </h2>
                <div className="space-y-6 text-gray-600 leading-relaxed">
                  <p>
                    {t('aboutNewDescription1')}
                  </p>
                  
                  <p>
                    {t('aboutNewDescription2')}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-purple-600 mb-2">1,000+</h3>
                  <p className="text-gray-600">{t('songsCreated')}</p>
                </div>
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-purple-600 mb-2">3+</h3>
                  <p className="text-gray-600">{t('yearsExperience')}</p>
                </div>
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-purple-600 mb-2">98%</h3>
                  <p className="text-gray-600">{t('clientSatisfaction')}</p>
                </div>
              </div>
            </div>

            {/* Right Content - Who We Are */}
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-8">{t('whoWeAre')}</h3>
              <div className="space-y-8">
                {entities.map((entity, index) => <div key={index} className="bg-white p-8 rounded-lg shadow-sm border-l-4 border-purple-500">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${entity.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white font-bold text-lg">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-gray-900 mb-3">{entity.title}</h4>
                        <p className="text-gray-600 leading-relaxed text-sm">{entity.description}</p>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default About;