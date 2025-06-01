
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const About = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Enhanced Hero Section with Purple Musical Background, Our Story Content and MusicGift Details */}
      <section 
        className="py-20 text-white relative overflow-hidden"
        style={{
          backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          {/* Hero Title */}
          <div className="text-center mb-16">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6 }}
            >
              {t('aboutTitle')}
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl opacity-90" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t('aboutSubtitle')}
            </motion.p>
          </div>

          {/* Our Story Content */}
          <div className="mb-20">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">{t('ourStory')}</h2>
            </motion.div>

            <div className="space-y-8">
              {/* Main Philosophy */}
              <motion.div 
                className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg border border-white/20 p-8"
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <p className="text-white/90 leading-relaxed text-lg text-center">
                  At MusicGift we believe that music is the purest form of emotion. In every personal story there is an unsung song, an emotion that deserves to come to life. We transform these emotions into real melodies, created by real artists, for real people.
                </p>
              </motion.div>

              {/* Company Story */}
              <motion.div 
                className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg border border-white/20 p-8"
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <p className="text-white/90 leading-relaxed mb-4">
                  MusicGift was born from the desire to bring people a unique gift: a song created especially for them. In a world where everything becomes fast and superficial, we have chosen to invest time, soul and passion in every musical creation.
                </p>
                <p className="text-white/90 leading-relaxed">
                  Founded by Mihai Gruia, music producer and former member of the international band Akcent, MusicGift combines stage and studio experience with the sincere emotion of personal stories.
                </p>
              </motion.div>

              {/* Our Creative Team Title and Cards */}
              <motion.div 
                className="mt-16"
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <h3 className="text-3xl font-bold text-white mb-12 text-center">Our Creative Team</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Mihai Gruia Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <Card className="h-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-xl">
                      <CardContent className="p-8">
                        <div className="text-center mb-6">
                          <div className="text-4xl mb-4">🎵</div>
                          <h4 className="text-xl font-bold text-white mb-3">Mihai Gruia</h4>
                        </div>
                        <p className="text-white/90 leading-relaxed text-sm">
                          Music producer and composer, founding member of Akcent – one of the most successful Romanian pop bands internationally, with famous hits like 'That's My Name', 'Kylie' and 'Stay with Me'. After Akcent's success, Mihai continued his artistic career through the TWO project and got involved in music production for top artists. Today, he coordinates the MusicGift and DOMG Studio team, bringing his expertise to every delivered project.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Mango Records Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.6, delay: 0.9 }}
                  >
                    <Card className="h-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-xl">
                      <CardContent className="p-8">
                        <div className="text-center mb-6">
                          <div className="text-4xl mb-4">🥭</div>
                          <h4 className="text-xl font-bold text-white mb-3">Mango Records</h4>
                        </div>
                        <p className="text-white/90 leading-relaxed text-sm">
                          Mango Records, founded and coordinated by Mihai Gruia, is an independent record label from Romania, specialized in launching and distributing original music internationally. It has promoted successful artists like TWO (ex-Akcent), DOMG, Mellina, Red Blonde, Pitt Leffer, Katerina and Vulgaris. With over 1000 tracks distributed globally on Spotify, Apple Music and YouTube, Mango Records actively contributes to the contemporary music scene.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* DOMG Studio Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.6, delay: 1.0 }}
                  >
                    <Card className="h-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-xl">
                      <CardContent className="p-8">
                        <div className="text-center mb-6">
                          <div className="text-4xl mb-4">🎚️</div>
                          <h4 className="text-xl font-bold text-white mb-3">DOMG Studio</h4>
                        </div>
                        <p className="text-white/90 leading-relaxed text-sm">
                          Premium music creation studio, with compositions for top Romanian and international artists: Akcent, Andra, Lora, Alina Eremia and others. Offers impeccable audio quality and professional composition, recording and mix-master processes.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Do Music for Good Band Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.6, delay: 1.1 }}
                  >
                    <Card className="h-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-xl">
                      <CardContent className="p-8">
                        <div className="text-center mb-6">
                          <div className="text-4xl mb-4">🎤</div>
                          <h4 className="text-xl font-bold text-white mb-3">Do Music for Good Band</h4>
                        </div>
                        <p className="text-white/90 leading-relaxed text-sm">
                          A team of professional performers who collaborate to bring MusicGift melodies to life. Each voice and each note are carefully chosen to authentically express the emotion conveyed by the client.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
