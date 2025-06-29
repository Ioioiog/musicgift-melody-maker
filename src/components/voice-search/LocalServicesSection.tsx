
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Star, Phone } from 'lucide-react';

const LocalServicesSection = () => {
  const { t, language } = useLanguage();

  const getExtendedCities = () => {
    switch (language) {
      case 'en':
        return [
          { name: "London", description: "Professional music services in the capital", region: "Central London", phone: "+44-20-7XXX-XXXX" },
          { name: "Manchester", description: "Personalized musical gifts in Northern England", region: "Greater Manchester", phone: "+44-161-XXX-XXXX" },
          { name: "Birmingham", description: "Custom songs in England's second city", region: "West Midlands", phone: "+44-121-XXX-XXXX" },
          { name: "Liverpool", description: "Musical heritage city compositions", region: "Merseyside", phone: "+44-151-XXX-XXXX" },
          { name: "Leeds", description: "Yorkshire personalized music services", region: "West Yorkshire", phone: "+44-113-XXX-XXXX" },
          { name: "Glasgow", description: "Scottish musical gift specialists", region: "Scotland", phone: "+44-141-XXX-XXXX" },
          { name: "Edinburgh", description: "Capital city music compositions", region: "Scotland", phone: "+44-131-XXX-XXXX" },
          { name: "Bristol", description: "Creative music hub services", region: "South West", phone: "+44-117-XXX-XXXX" },
          { name: "Newcastle", description: "North East England music gifts", region: "Tyne and Wear", phone: "+44-191-XXX-XXXX" },
          { name: "Cardiff", description: "Welsh capital music services", region: "Wales", phone: "+44-29-XXXX-XXXX" }
        ];
      case 'de':
        return [
          { name: "Berlin", description: "Professionelle Musikdienste in der Hauptstadt", region: "Berlin-Mitte", phone: "+49-30-XXX-XXXX" },
          { name: "München", description: "Bayerische Musikgeschenke", region: "Bayern", phone: "+49-89-XXX-XXXX" },
          { name: "Hamburg", description: "Hanseatische Musikcompositionen", region: "Hamburg", phone: "+49-40-XXX-XXXX" },
          { name: "Köln", description: "Rheinische Musikdienste", region: "Nordrhein-Westfalen", phone: "+49-221-XXX-XXXX" },
          { name: "Frankfurt", description: "Mainmetropole Musikgeschenke", region: "Hessen", phone: "+49-69-XXX-XXXX" },
          { name: "Stuttgart", description: "Schwäbische Musikcompositionen", region: "Baden-Württemberg", phone: "+49-711-XXX-XXXX" },
          { name: "Düsseldorf", description: "Kunststadt Musikdienste", region: "Nordrhein-Westfalen", phone: "+49-211-XXX-XXXX" },
          { name: "Leipzig", description: "Musikstadt Kompositionen", region: "Sachsen", phone: "+49-341-XXX-XXXX" }
        ];
      case 'fr':
        return [
          { name: "Paris", description: "Services musicaux professionnels dans la capitale", region: "Île-de-France", phone: "+33-1-XX-XX-XX-XX" },
          { name: "Lyon", description: "Cadeaux musicaux dans la capitale gastronomique", region: "Auvergne-Rhône-Alpes", phone: "+33-4-XX-XX-XX-XX" },
          { name: "Marseille", description: "Compositions musicales méditerranéennes", region: "Provence-Alpes-Côte d'Azur", phone: "+33-4-XX-XX-XX-XX" },
          { name: "Toulouse", description: "Ville rose compositions musicales", region: "Occitanie", phone: "+33-5-XX-XX-XX-XX" },
          { name: "Nice", description: "Riviera musicale personnalisée", region: "Provence-Alpes-Côte d'Azur", phone: "+33-4-XX-XX-XX-XX" },
          { name: "Bordeaux", description: "Capitale du vin et de la musique", region: "Nouvelle-Aquitaine", phone: "+33-5-XX-XX-XX-XX" },
          { name: "Lille", description: "Nord de la France services musicaux", region: "Hauts-de-France", phone: "+33-3-XX-XX-XX-XX" },
          { name: "Strasbourg", description: "Alsace compositions personnalisées", region: "Grand Est", phone: "+33-3-XX-XX-XX-XX" }
        ];
      default: // Romanian
        return [
          { name: "București", description: "Servicii profesionale în Capitală", region: "Sectorul 1-6", phone: "+40-21-XXX-XX-XX" },
          { name: "Cluj-Napoca", description: "Cadouri muzicale în Transilvania", region: "Cluj", phone: "+40-264-XXX-XXX" },
          { name: "Timișoara", description: "Melodii personalizate în orașul florilor", region: "Timiș", phone: "+40-256-XXX-XXX" },
          { name: "Iași", description: "Compoziții în orașul celor șapte coline", region: "Iași", phone: "+40-232-XXX-XXX" },
          { name: "Constanța", description: "Muzică la malul mării", region: "Constanța", phone: "+40-241-XXX-XXX" },
          { name: "Craiova", description: "Oltenia servicii muzicale", region: "Dolj", phone: "+40-251-XXX-XXX" },
          { name: "Brașov", description: "Servicii muzicale la poalele Tâmpei", region: "Brașov", phone: "+40-268-XXX-XXX" },
          { name: "Galați", description: "Dunărea melodiilor personalizate", region: "Galați", phone: "+40-236-XXX-XXX" },
          { name: "Ploiești", description: "Prahova compositii muzicale", region: "Prahova", phone: "+40-244-XXX-XXX" },
          { name: "Oradea", description: "Bihor cadouri muzicale", region: "Bihor", phone: "+40-259-XXX-XXX" }
        ];
    }
  };

  const cities = getExtendedCities();

  return (
    <Card className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-blue-200 mb-12">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">
          {t('servicesInCountry')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cities.map((city, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-white/60 rounded-lg hover:bg-white/80 transition-colors">
              <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 voice-search-content">{city.name}</h4>
                <p className="text-sm text-gray-600 mb-1 voice-search-content">{city.description}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {city.region}
                </p>
                <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                  <Phone className="w-3 h-3" />
                  {city.phone}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LocalServicesSection;
