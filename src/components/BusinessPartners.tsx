
import { useLanguage } from "@/contexts/LanguageContext";
import { Briefcase, Handshake, BriefcaseBusiness } from "lucide-react";

const BusinessPartners = () => {
  const { t } = useLanguage();

  const partners = [
    {
      name: "Stripe",
      logo: "https://seeklogo.com/images/S/stripe-logo-8D1337D8CE-seeklogo.com.png",
      description: "Payment Processing",
      url: "https://stripe.com",
    },
    {
      name: "Revolut Business",
      logo: "https://www.logo.wine/a/logo/Revolut/Revolut-Business-Logo.wine.svg",
      description: "Banking Solutions",
      url: "https://www.revolut.com/business/",
    },
    {
      name: "Supabase",
      logo: "https://supabase.com/brand-assets/supabase-logo-icon.png",
      description: "Database & Backend",
      url: "https://supabase.com",
    },
  ];

  const backgroundStyle = {
    backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden" style={backgroundStyle}>
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <BriefcaseBusiness className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('businessPartners')}
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {t('businessPartnersDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center mb-4 h-16">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-12 max-w-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {partner.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {partner.description}
              </p>
              <a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium"
              >
                <Handshake className="w-4 h-4 mr-2" />
                {t('learnMore')}
              </a>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
            <h3 className="text-xl font-bold text-white mb-2">
              {t('partnerWithUs')}
            </h3>
            <p className="text-white/80">
              {t('partnerWithUsDescription')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessPartners;
