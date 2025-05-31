
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();
  
  const teamMembers = [
    {
      name: "Mihai Gruia",
      role: t('leadComposer'),
      color: "bg-purple-500"
    },
    {
      name: "Ionela Mirunescu", 
      role: t('leadVocalist'),
      color: "bg-purple-500"
    },
    {
      name: "Radu Popescu",
      role: t('soundEngineer'), 
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Page Title */}
      <section className="pt-24 pb-8 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{t('aboutTitle')}</h1>
        </div>
      </section>

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
                    {t('aboutDescription1')}
                  </p>
                  
                  <p>
                    {t('aboutDescription2')}
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

            {/* Right Content - Team */}
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-8">{t('ourTeam')}</h3>
              <div className="space-y-6">
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center space-x-4 bg-white p-6 rounded-lg shadow-sm">
                    <div className={`w-16 h-16 ${member.color} rounded-full flex items-center justify-center`}>
                      <span className="text-white font-bold text-xl">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">{member.name}</h4>
                      <p className="text-gray-600">{member.role}</p>
                    </div>
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

export default About;
