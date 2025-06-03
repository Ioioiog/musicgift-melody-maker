
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const stats = [
  {
    icon: "🎵",
    title: { ro: "2.000+", en: "2,000+", fr: "2 000+", de: "2.000+", pl: "2 000+" },
    subtitle: {
      ro: "Cântece Personalizate",
      en: "Custom Songs",
      fr: "Chansons Personnalisées",
      de: "Personalisierte Songs",
      pl: "Piosenki na Zamówienie"
    },
    desc: {
      ro: "Emoții transformate în muzică.",
      en: "Emotions turned into music.",
      fr: "Des émotions transformées en musique.",
      de: "Emotionen in Musik verwandelt.",
      pl: "Emocje przekształcone w muzykę."
    }
  },
  {
    icon: "🎤",
    title: { ro: "20+", en: "20+", fr: "20+", de: "20+", pl: "20+" },
    subtitle: {
      ro: "Ani de Pasiune Muzicală",
      en: "Years of Musical Passion",
      fr: "Années de Passion Musicale",
      de: "Jahre Musikalischer Leidenschaft",
      pl: "Lata Muzycznej Pasji"
    },
    desc: {
      ro: "Două decenii de creație și inspirație.",
      en: "Two decades of creation and inspiration.",
      fr: "Deux décennies de création et d'inspiration.",
      de: "Zwei Jahrzehnte Kreativität und Inspiration.",
      pl: "Dwie dekady twórczości i inspiracji."
    }
  },
  {
    icon: "🌟",
    title: { ro: "98%", en: "98%", fr: "98%", de: "98%", pl: "98%" },
    subtitle: {
      ro: "Clienți Fericiți",
      en: "Happy Clients",
      fr: "Clients Satisfaits",
      de: "Zufriedene Kunden",
      pl: "Zadowoleni Klienci"
    },
    desc: {
      ro: "Mii de recenzii care ne-au confirmat misiunea.",
      en: "Thousands of reviews confirming our mission.",
      fr: "Des milliers d'avis qui confirment notre mission.",
      de: "Tausende Bewertungen, die unsere Mission bestätigen.",
      pl: "Tysiące opinii potwierdzających naszą misję."
    }
  },
  {
    icon: "🚀",
    title: { ro: "50+", en: "50+", fr: "50+", de: "50+", pl: "50+" },
    subtitle: {
      ro: "Artiști Lansați",
      en: "Artists Launched",
      fr: "Artistes Lancés",
      de: "Künstler Entdeckt",
      pl: "Wypromowanych Artystów"
    },
    desc: {
      ro: "Reflectoare puse pe talente care inspiră.",
      en: "Spotlights on talents that inspire.",
      fr: "Lumières sur des talents inspirants.",
      de: "Scheinwerfer auf inspirierende Talente.",
      pl: "Reflektory skierowane na inspirujące talenty."
    }
  },
  {
    icon: "🎉",
    title: { ro: "400+", en: "400+", fr: "400+", de: "400+", pl: "400+" },
    subtitle: {
      ro: "Evenimente Memorabile",
      en: "Memorable Events",
      fr: "Événements Mémorables",
      de: "Unvergessliche Events",
      pl: "Niezapomniane Wydarzenia"
    },
    desc: {
      ro: "Fiecare spectacol, o poveste unică.",
      en: "Each show, a unique story.",
      fr: "Chaque spectacle, une histoire unique.",
      de: "Jede Show, eine einzigartige Geschichte.",
      pl: "Każdy występ to wyjątkowa historia."
    }
  },
  {
    icon: "💿",
    title: { ro: "100+", en: "100+", fr: "100+", de: "100+", pl: "100+" },
    subtitle: {
      ro: "Albume Lansate",
      en: "Albums Released",
      fr: "Albums Sortis",
      de: "Veröffentlichte Alben",
      pl: "Wydanych Albumów"
    },
    desc: {
      ro: "Suntem parte din discografia lor.",
      en: "We are part of their discography.",
      fr: "Nous faisons partie de leur discographie.",
      de: "Wir sind Teil ihrer Diskografie.",
      pl: "Jesteśmy częścią ich dyskografii."
    }
  },
  {
    icon: "🏆",
    title: { ro: "1 Milion+", en: "1 Million+", fr: "1 Million+", de: "1 Million+", pl: "1 Milion+" },
    subtitle: {
      ro: "Exemplare Vândute",
      en: "Copies Sold",
      fr: "Exemplaires Vendus",
      de: "Verkaufte Exemplare",
      pl: "Sprzedanych Egzemplarzy"
    },
    desc: {
      ro: "Album premiat, reper în industrie.",
      en: "Award-winning album, industry benchmark.",
      fr: "Album primé, référence dans l'industrie.",
      de: "Ausgezeichnetes Album, Branchenmaßstab.",
      pl: "Album nagrodzony, wzór w branży."
    }
  }
];

const ImpactCards = () => {
  const { language } = useLanguage();

  const backgroundStyle = {
    backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <section className="py-16 relative overflow-hidden" style={backgroundStyle}>
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="max-w-full mx-auto px-0 relative z-10">
        <div className="overflow-hidden">
          <div 
            className="flex gap-4 animate-scroll"
            style={{ 
              minWidth: 'max-content',
              animation: 'scroll 30s linear infinite'
            }}
          >
            {/* First set of cards */}
            {stats.map((item, idx) => {
              const title = item.title[language as keyof typeof item.title] || item.title.ro;
              const subtitle = item.subtitle[language as keyof typeof item.subtitle] || item.subtitle.ro;
              const desc = item.desc[language as keyof typeof item.desc] || item.desc.ro;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg text-center hover:scale-105 transition-transform flex-shrink-0 w-48"
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h3 className="text-2xl font-extrabold text-purple-600 mb-1">{title}</h3>
                  <p className="text-sm font-semibold text-gray-900 mb-1">{subtitle}</p>
                  <p className="text-xs text-gray-600">{desc}</p>
                </motion.div>
              );
            })}
            {/* Duplicate set for seamless scrolling */}
            {stats.map((item, idx) => {
              const title = item.title[language as keyof typeof item.title] || item.title.ro;
              const subtitle = item.subtitle[language as keyof typeof item.subtitle] || item.subtitle.ro;
              const desc = item.desc[language as keyof typeof item.desc] || item.desc.ro;

              return (
                <motion.div
                  key={`duplicate-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg text-center hover:scale-105 transition-transform flex-shrink-0 w-48"
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h3 className="text-2xl font-extrabold text-purple-600 mb-1">{title}</h3>
                  <p className="text-sm font-semibold text-gray-900 mb-1">{subtitle}</p>
                  <p className="text-xs text-gray-600">{desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default ImpactCards;
