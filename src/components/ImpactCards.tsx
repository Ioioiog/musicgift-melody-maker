
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Music, Mic, Star, Rocket, PartyPopper, Disc, Trophy } from "lucide-react";

const stats = [
  {
    icon: Music,
    title: {
      ro: "2.000+",
      en: "2,000+",
      fr: "2 000+",
      de: "2.000+",
      pl: "2 000+"
    },
    subtitle: {
      ro: "Cântece Personalizate",
      en: "Custom Songs",
      fr: "Chansons Personnalisées",
      de: "Personalisierte Songs",
      pl: "Piosenki na Zamówienie"
    }
  },
  {
    icon: Mic,
    title: {
      ro: "20+",
      en: "20+",
      fr: "20+",
      de: "20+",
      pl: "20+"
    },
    subtitle: {
      ro: "Ani de Pasiune Muzicală",
      en: "Years of Musical Passion",
      fr: "Années de Passion Musicale",
      de: "Jahre Musikalischer Leidenschaft",
      pl: "Lata Muzycznej Pasji"
    }
  },
  {
    icon: Star,
    title: {
      ro: "98%",
      en: "98%",
      fr: "98%",
      de: "98%",
      pl: "98%"
    },
    subtitle: {
      ro: "Clienți Fericiți",
      en: "Happy Clients",
      fr: "Clients Satisfaits",
      de: "Zufriedene Kunden",
      pl: "Zadowoleni Klienci"
    }
  },
  {
    icon: Rocket,
    title: {
      ro: "50+",
      en: "50+",
      fr: "50+",
      de: "50+",
      pl: "50+"
    },
    subtitle: {
      ro: "Artiști Lansați",
      en: "Artists Launched",
      fr: "Artistes Lancés",
      de: "Künstler Entdeckt",
      pl: "Wypromowanych Artystów"
    }
  },
  {
    icon: PartyPopper,
    title: {
      ro: "400+",
      en: "400+",
      fr: "400+",
      de: "400+",
      pl: "400+"
    },
    subtitle: {
      ro: "Evenimente Memorabile",
      en: "Memorable Events",
      fr: "Événements Mémorables",
      de: "Unvergessliche Events",
      pl: "Niezapomniane Wydarzenia"
    }
  },
  {
    icon: Disc,
    title: {
      ro: "100+",
      en: "100+",
      fr: "100+",
      de: "100+",
      pl: "100+"
    },
    subtitle: {
      ro: "Albume Lansate",
      en: "Albums Released",
      fr: "Albums Sortis",
      de: "Veröffentlichte Alben",
      pl: "Wydanych Albumów"
    }
  },
  {
    icon: Trophy,
    title: {
      ro: "1 Milion+",
      en: "1 Million+",
      fr: "1 Million+",
      de: "1 Million+",
      pl: "1 Milion+"
    },
    subtitle: {
      ro: "Exemplare Vândute",
      en: "Copies Sold",
      fr: "Exemplaires Vendus",
      de: "Verkaufte Exemplare",
      pl: "Sprzedanych Egzemplarzy"
    }
  }
];

const ImpactCards = () => {
  const { language } = useLanguage();

  return (
    <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] my-2 md:my-4 overflow-hidden">
      <div className="bg-gradient-to-r from-white/5 via-white/20 to-white/5 backdrop-blur-sm border-y border-white/10 py-[2px] relative z-10">
        <div className="flex space-x-8 md:space-x-16 whitespace-nowrap animate-scroll">
          {/* First set of stats */}
          {stats.map((item, idx) => {
            const IconComponent = item.icon;
            const title = item.title[language as keyof typeof item.title] || item.title.ro;
            const subtitle = item.subtitle[language as keyof typeof item.subtitle] || item.subtitle.ro;

            return (
              <div key={idx} className="flex items-center space-x-2 md:space-x-4 text-sm md:text-xl font-bold">
                <IconComponent className="w-6 h-6 md:w-12 md:h-12 text-blue-300" />
                <span className="text-lg md:text-3xl text-white">{title}</span>
                <span className="opacity-90 text-sm md:text-xl text-white">{subtitle}</span>
              </div>
            );
          })}
          {/* Duplicate set for seamless scrolling */}
          {stats.map((item, idx) => {
            const IconComponent = item.icon;
            const title = item.title[language as keyof typeof item.title] || item.title.ro;
            const subtitle = item.subtitle[language as keyof typeof item.subtitle] || item.subtitle.ro;

            return (
              <div key={`duplicate-${idx}`} className="flex items-center space-x-2 md:space-x-4 text-sm md:text-xl font-bold">
                <IconComponent className="w-6 h-6 md:w-12 md:h-12 text-purple-300" />
                <span className="text-lg md:text-3xl text-white">{title}</span>
                <span className="opacity-90 text-sm md:text-xl text-white">{subtitle}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ImpactCards;
