import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ImpactCards from "@/components/ImpactCards";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
const About = () => {
  const {
    t,
    language
  } = useLanguage();
  const stats = [{
    icon: "🎵",
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
    },
    desc: {
      ro: "Emoții transformate în muzică.",
      en: "Emotions turned into music.",
      fr: "Des émotions transformées en musique.",
      de: "Emotionen in Musik verwandelt.",
      pl: "Emocje przekształcone w muzykę."
    }
  }, {
    icon: "🎤",
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
    },
    desc: {
      ro: "Două decenii de creație și inspirație.",
      en: "Two decades of creation and inspiration.",
      fr: "Deux décennies de création et d'inspiration.",
      de: "Zwei Jahrzehnte Kreativität und Inspiration.",
      pl: "Dwie dekady twórczości i inspiracji."
    }
  }, {
    icon: "🌟",
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
    },
    desc: {
      ro: "Mii de recenzii care ne-au confirmat misiunea.",
      en: "Thousands of reviews confirming our mission.",
      fr: "Des milliers d'avis qui confirment notre mission.",
      de: "Tausende Bewertungen, die unsere Mission bestätigen.",
      pl: "Tysiące opinii potwierdzających naszą misję."
    }
  }, {
    icon: "🚀",
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
    },
    desc: {
      ro: "Reflectoare puse pe talente care inspiră.",
      en: "Spotlights on talents that inspire.",
      fr: "Lumières sur des talents inspirants.",
      de: "Scheinwerfer auf inspirierende Talente.",
      pl: "Reflektory skierowane na inspirujące talenty."
    }
  }, {
    icon: "🎉",
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
    },
    desc: {
      ro: "Fiecare spectacol, o poveste unică.",
      en: "Each show, a unique story.",
      fr: "Chaque spectacle, une histoire unique.",
      de: "Jede Show, eine einzigartige Geschichte.",
      pl: "Każdy występ to wyjątkowa historia."
    }
  }, {
    icon: "💿",
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
    },
    desc: {
      ro: "Suntem parte din discografia lor.",
      en: "We are part of their discography.",
      fr: "Nous faisons partie de leur discographie.",
      de: "Wir sind Teil ihrer Diskografie.",
      pl: "Jesteśmy częścią ich dyskografii."
    }
  }, {
    icon: "🏆",
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
    },
    desc: {
      ro: "Album premiat, reper în industrie.",
      en: "Award-winning album, industry benchmark.",
      fr: "Album primé, référence dans l'industrie.",
      de: "Ausgezeichnetes Album, Branchenmaßstab.",
      pl: "Album nagrodzony, wzór w branży."
    }
  }];
  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const [featuredStats, setFeaturedStats] = useState([0, 1, 2]);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatIndex(prev => (prev + 1) % stats.length);
      setFeaturedStats(prev => {
        const newStats = [...prev];
        newStats[0] = (newStats[0] + 1) % stats.length;
        newStats[1] = (newStats[1] + 1) % stats.length;
        newStats[2] = (newStats[2] + 1) % stats.length;
        return newStats;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [stats.length]);
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
  return <div className="min-h-screen">
      <Navigation />
      
      {/* Dynamic Motion Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white overflow-hidden">
        {/* Floating animations */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute top-10 left-10 text-4xl opacity-30" animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          rotate: [0, 180, 360]
        }} transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}>
            ♪
          </motion.div>
          <motion.div className="absolute bottom-10 right-10 text-6xl opacity-20" animate={{
          x: [0, -80, 0],
          y: [0, 40, 0],
          rotate: [0, -90, 0]
        }} transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear"
        }}>
            🎵
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          {/* Main Title */}
          

          {/* Featured Stats Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {featuredStats.map((statIndex, index) => {
            const stat = stats[statIndex];
            const title = stat.title[language as keyof typeof stat.title] || stat.title.ro;
            const subtitle = stat.subtitle[language as keyof typeof stat.subtitle] || stat.subtitle.ro;
            const desc = stat.desc[language as keyof typeof stat.desc] || stat.desc.ro;
            return <AnimatePresence key={`${statIndex}-${index}`} mode="wait">
                  <motion.div initial={{
                opacity: 0,
                scale: 0.8,
                y: 20
              }} animate={{
                opacity: 1,
                scale: 1,
                y: 0
              }} exit={{
                opacity: 0,
                scale: 0.8,
                y: -20
              }} transition={{
                duration: 0.6,
                delay: index * 0.1
              }} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20">
                    <motion.div className="text-4xl mb-3" animate={{
                  rotate: [0, 10, -10, 0]
                }} transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}>
                      {stat.icon}
                    </motion.div>
                    <motion.h3 className="text-3xl font-extrabold mb-2" initial={{
                  scale: 0
                }} animate={{
                  scale: 1
                }} transition={{
                  duration: 0.5,
                  delay: 0.2
                }}>
                      {title}
                    </motion.h3>
                    <p className="text-lg font-semibold mb-1 opacity-90">{subtitle}</p>
                    <p className="text-sm opacity-75">{desc}</p>
                  </motion.div>
                </AnimatePresence>;
          })}
          </div>

          {/* Animated Stats Ticker */}
          <motion.div className="flex justify-center space-x-4 mb-8" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 1,
          delay: 0.5
        }}>
            {stats.map((_, index) => <motion.div key={index} className={`w-3 h-3 rounded-full transition-all duration-300 ${featuredStats.includes(index) ? 'bg-white scale-125' : 'bg-white/40'}`} animate={{
            scale: featuredStats.includes(index) ? 1.25 : 1,
            opacity: featuredStats.includes(index) ? 1 : 0.4
          }} />)}
          </motion.div>

          {/* Scrolling Stats Banner */}
          <motion.div className="overflow-hidden bg-white/10 rounded-full py-4 mb-8" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.8
        }}>
            <motion.div className="flex space-x-12 whitespace-nowrap" animate={{
            x: ["0%", "-100%"]
          }} transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}>
              {[...stats, ...stats].map((stat, index) => {
              const title = stat.title[language as keyof typeof stat.title] || stat.title.ro;
              const subtitle = stat.subtitle[language as keyof typeof stat.subtitle] || stat.subtitle.ro;
              return <div key={index} className="flex items-center space-x-3 text-lg font-semibold">
                    <span className="text-2xl">{stat.icon}</span>
                    <span>{title}</span>
                    <span className="opacity-75">{subtitle}</span>
                  </div>;
            })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Remove ImpactCards since stats are now in header */}

      {/* Enhanced Content Section */}
      <section className="relative bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden py-20">
        {/* Floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute top-10 left-0 text-6xl text-purple-300 opacity-20" animate={{
          x: [0, 100]
        }} transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}>
            ♪
          </motion.div>
          <motion.div className="absolute bottom-10 right-0 text-4xl text-orange-300 opacity-20" animate={{
          x: [0, -100]
        }} transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}>
            🎵
          </motion.div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-6 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
              <motion.div className="space-y-6 sm:space-y-8" initial={{
              opacity: 0,
              x: -20
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.6
            }}>
                <div>
                  <div className="space-y-4 sm:space-y-6 text-gray-600 leading-relaxed text-sm sm:text-base">
                    <p>
                      {t('aboutNewDescription2')}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div className="mt-8 lg:mt-0" initial={{
              opacity: 0,
              x: 20
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.6,
              delay: 0.3
            }}>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">{t('whoWeAre')}</h3>
                <div className="space-y-6 sm:space-y-8">
                  {entities.map((entity, index) => <motion.div key={index} className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 transform hover:scale-105" initial={{
                  opacity: 0,
                  y: 20
                }} animate={{
                  opacity: 1,
                  y: 0
                }} transition={{
                  duration: 0.6,
                  delay: index * 0.1
                }}>
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${entity.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <span className="text-white font-bold text-sm sm:text-base md:text-lg">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{entity.title}</h4>
                          <p className="text-gray-600 leading-relaxed text-xs sm:text-sm break-words">{entity.description}</p>
                        </div>
                      </div>
                    </motion.div>)}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default About;