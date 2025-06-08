
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Music, Mic, Star, Rocket, PartyPopper, Disc, Trophy, Heart, Shield, Clock, Award, Users, Globe, Headphones, Zap, CheckCircle } from "lucide-react";

const About = () => {
  const {
    t
  } = useLanguage();
  return <div className="min-h-screen">
      <Navigation />
      
      {/* Enhanced Hero Section with Purple Musical Background, Our Story Content and MusicGift Details */}
      <section className="py-20 text-white relative overflow-hidden" style={{
      backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Floating Musical Notes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 text-4xl opacity-30" style={{
          transform: "translateX(35.2px) translateY(-17.6px) rotate(296.64deg)"
        }}>♪</div>
          <div className="absolute bottom-10 right-10 text-6xl opacity-20" style={{
          transform: "translateX(-69.12px) translateY(34.56px) rotate(-77.76deg)"
        }}>🎵</div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          {/* Hero Title with Professional Scrolling Statistics */}
          <div className="text-center mb-16">
            {/* Professional Full-Screen Scrolling Statistics Section */}
            <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-8 my-[48px] overflow-hidden">
              <div className="bg-gradient-to-r from-white/5 via-white/20 to-white/5 backdrop-blur-sm border-y border-white/10 py-[2px]">
                <div className="flex space-x-16 whitespace-nowrap animate-[scroll_5s_linear_infinite]">
                  {/* First set of statistics */}
                  <div className="flex items-center space-x-4 text-xl font-bold">
                    <Music className="w-12 h-12 text-blue-300" />
                    <span className="text-3xl text-white">2.000+</span>
                    <span className="opacity-90 text-xl">{t('personalizedSongs')}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xl font-bold">
                    <Mic className="w-12 h-12 text-purple-300" />
                    <span className="text-3xl text-white">20+</span>
                    <span className="opacity-90 text-xl">{t('yearsMusicalPassion')}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xl font-bold">
                    <Star className="w-12 h-12 text-yellow-400" />
                    <span className="text-3xl text-white">98%</span>
                    <span className="opacity-90 text-xl">{t('happyClients')}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xl font-bold">
                    <Rocket className="w-12 h-12 text-orange-400" />
                    <span className="text-3xl text-white">50+</span>
                    <span className="opacity-90 text-xl">{t('launchedArtists')}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xl font-bold">
                    <PartyPopper className="w-12 h-12 text-red-200" />
                    <span className="text-3xl text-white">400+</span>
                    <span className="opacity-90 text-xl">{t('memorableEvents')}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xl font-bold">
                    <Disc className="w-12 h-12 text-indigo-300" />
                    <span className="text-3xl text-white">100+</span>
                    <span className="opacity-90 text-xl">{t('releasedAlbums')}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xl font-bold">
                    <Trophy className="w-12 h-12 text-orange-300" />
                    <span className="text-3xl text-white">1 Milion+</span>
                    <span className="opacity-90 text-xl">{t('copiesSold')}</span>
                  </div>
                  
                  {/* Duplicate set for seamless scrolling */}
                  <div className="flex items-center space-x-4 text-xl font-bold">
                    <Music className="w-12 h-12 text-blue-300" />
                    <span className="text-3xl text-white">2.000+</span>
                    <span className="opacity-90 text-xl">{t('personalizedSongs')}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xl font-bold">
                    <Mic className="w-12 h-12 text-purple-300" />
                    <span className="text-3xl text-white">20+</span>
                    <span className="opacity-90 text-xl">{t('yearsMusicalPassion')}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xl font-bold">
                    <Star className="w-12 h-12 text-yellow-300" />
                    <span className="text-3xl text-white">98%</span>
                    <span className="opacity-90 text-xl">{t('happyClients')}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xl font-bold">
                    <Rocket className="w-12 h-12 text-green-300" />
                    <span className="text-3xl text-white">50+</span>
                    <span className="opacity-90 text-xl">{t('launchedArtists')}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xl font-bold">
                    <PartyPopper className="w-12 h-12 text-pink-300" />
                    <span className="text-3xl text-white">400+</span>
                    <span className="opacity-90 text-xl">{t('memorableEvents')}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xl font-bold">
                    <Disc className="w-12 h-12 text-indigo-300" />
                    <span className="text-3xl text-white">100+</span>
                    <span className="opacity-90 text-xl">{t('releasedAlbums')}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xl font-bold">
                    <Trophy className="w-12 h-12 text-orange-300" />
                    <span className="text-3xl text-white">1 Milion+</span>
                    <span className="opacity-90 text-xl">{t('copiesSold')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Layout: Our Story & Creative Team */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Left Column: Our Story */}
            <div>
              <motion.div className="mb-8" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.4
            }}>
                <h2 className="text-3xl font-bold text-white mb-6">{t('ourStory')}</h2>
              </motion.div>

              <div className="space-y-6">
                {/* Main Philosophy */}
                <motion.div className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg border border-white/20 p-6" initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.6,
                delay: 0.5
              }}>
                  <p className="text-white/90 leading-relaxed">
                    {t('aboutMainPhilosophy')}
                  </p>
                </motion.div>

                {/* Company Story */}
                <motion.div className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg border border-white/20 p-6" initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.6,
                delay: 0.6
              }}>
                  <p className="text-white/90 leading-relaxed mb-4">
                    {t('aboutCompanyStory1')}
                  </p>
                  <p className="text-white/90 leading-relaxed">
                    {t('aboutCompanyStory2')}
                  </p>
                </motion.div>

                {/* Awards & Recognition Section */}
                <motion.div className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg border border-white/20 p-6" initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.6,
                delay: 0.7
              }}>
                  <h3 className="text-xl font-bold text-white mb-4">{t('awardsRecognition') || 'Awards & Recognition'}</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Award className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white text-sm">{t('internationalSuccess') || 'International Success'}</h4>
                        <p className="text-white/80 text-sm">{t('internationalSuccessDesc') || 'Akcent achieved worldwide recognition with hits reaching top charts in over 20 countries'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white text-sm">{t('industryExperience') || 'Industry Experience'}</h4>
                        <p className="text-white/80 text-sm">{t('industryExperienceDesc') || 'Over 20 years of professional music production and artist development experience'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Globe className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white text-sm">{t('globalReach') || 'Global Reach'}</h4>
                        <p className="text-white/80 text-sm">{t('globalReachDesc') || 'Music distributed worldwide through major platforms and streaming services'}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Mission & Values Section */}
                <motion.div className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg border border-white/20 p-6" initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.6,
                delay: 0.8
              }}>
                  <h3 className="text-xl font-bold text-white mb-4">{t('missionValues') || 'Our Mission & Values'}</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Heart className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white text-sm">{t('passion') || 'Passion'}</h4>
                        <p className="text-white/80 text-sm">{t('passionDesc') || 'Every song we create is infused with genuine passion and emotional depth, ensuring your story is told with authenticity.'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Shield className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white text-sm">{t('quality') || 'Quality'}</h4>
                        <p className="text-white/80 text-sm">{t('qualityDesc') || 'Professional studio production, experienced musicians, and meticulous attention to detail in every project.'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white text-sm">{t('dedication') || 'Dedication'}</h4>
                        <p className="text-white/80 text-sm">{t('dedicationDesc') || 'We invest time and care into understanding your story to create music that truly represents your emotions.'}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Why Choose Us Section */}
                <motion.div className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg border border-white/20 p-6" initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.6,
                delay: 0.9
              }}>
                  <h3 className="text-xl font-bold text-white mb-4">{t('whyChooseUs') || 'Why Choose Us'}</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Headphones className="w-6 h-6 text-cyan-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white text-sm">{t('uniqueApproach') || 'Unique Approach'}</h4>
                        <p className="text-white/80 text-sm">{t('uniqueApproachDesc') || 'We combine personal storytelling with professional music production to create truly one-of-a-kind songs.'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Zap className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white text-sm">{t('fastDelivery') || 'Fast Delivery'}</h4>
                        <p className="text-white/80 text-sm">{t('fastDeliveryDesc') || 'Professional quality music delivered within 7-14 days, perfect for special occasions and gift-giving.'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white text-sm">{t('satisfactionGuarantee') || 'Satisfaction Guarantee'}</h4>
                        <p className="text-white/80 text-sm">{t('satisfactionGuaranteeDesc') || '100% satisfaction guarantee with unlimited revisions until your song perfectly captures your story.'}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right Column: Our Creative Team */}
            <div>
              <motion.div className="mb-8" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.7
            }}>
                <h3 className="text-3xl font-bold text-white mb-6">{t('ourCreativeTeam')}</h3>
              </motion.div>
              
              <div className="space-y-6">
                {/* Mihai Gruia Card */}
                <motion.div initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.6,
                delay: 0.8
              }}>
                  <Card className="group bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-xl cursor-pointer overflow-hidden">
                    <CardContent className="p-6 flex flex-col h-full transition-all duration-300">
                      <div className="text-center transition-all duration-300 group-hover:flex-1 group-hover:flex group-hover:flex-col group-hover:justify-center">
                        <div className="w-24 h-24 group-hover:w-32 group-hover:h-32 rounded-full mx-auto mb-3 overflow-hidden transition-all duration-300">
                          <img src="/lovable-uploads/23e06586-3da9-43f2-9b3c-9ae8bb17fa42.png" alt="Mihai Gruia" className="w-full h-full object-cover" />
                        </div>
                        <h4 className="text-lg group-hover:text-xl font-bold text-white mb-2 transition-all duration-300">Mihai Gruia</h4>
                      </div>
                      <p className="text-white/90 leading-relaxed text-sm group-hover:opacity-0 group-hover:h-0 group-hover:mb-0 transition-all duration-300 overflow-hidden">
                        {t('mihaiGruiaDescription')}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Mango Records Card */}
                <motion.div initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.6,
                delay: 0.9
              }}>
                  <Card className="group bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-xl cursor-pointer overflow-hidden">
                    <CardContent className="p-6 flex flex-col h-full transition-all duration-300">
                      <div className="text-center transition-all duration-300 group-hover:flex-1 group-hover:flex group-hover:flex-col group-hover:justify-center">
                        <div className="w-24 h-24 group-hover:w-32 group-hover:h-32 rounded-full mx-auto mb-3 overflow-hidden transition-all duration-300">
                          <img src="/lovable-uploads/47cac880-f533-4319-bdcb-58c2b7147f23.png" alt="Mango Records" className="w-full h-full object-cover" />
                        </div>
                        <h4 className="text-lg group-hover:text-xl font-bold text-white mb-2 transition-all duration-300">Mango Records</h4>
                      </div>
                      <p className="text-white/90 leading-relaxed text-sm group-hover:opacity-0 group-hover:h-0 group-hover:mb-0 transition-all duration-300 overflow-hidden">
                        {t('mangoRecordsDescription')}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* DOMG Studio Card */}
                <motion.div initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.6,
                delay: 1.0
              }}>
                  <Card className="group bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-xl cursor-pointer overflow-hidden">
                    <CardContent className="p-6 flex flex-col h-full transition-all duration-300">
                      <div className="text-center transition-all duration-300 group-hover:flex-1 group-hover:flex group-hover:flex-col group-hover:justify-center">
                        <div className="w-24 h-24 group-hover:w-32 group-hover:h-32 rounded-full mx-auto mb-3 overflow-hidden transition-all duration-300">
                          <img src="/lovable-uploads/b4c3e4f4-7bf8-4e27-9293-dbbd3de72dc2.png" alt="DOMG Studio" className="w-full h-full object-cover" />
                        </div>
                        <h4 className="text-lg group-hover:text-xl font-bold text-white mb-2 transition-all duration-300">DOMG Studio</h4>
                      </div>
                      <p className="text-white/90 leading-relaxed text-sm group-hover:opacity-0 group-hover:h-0 group-hover:mb-0 transition-all duration-300 overflow-hidden">
                        {t('domgStudioDescription')}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Do Music for Good Band Card */}
                <motion.div initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.6,
                delay: 1.1
              }}>
                  <Card className="group bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-xl cursor-pointer overflow-hidden">
                    <CardContent className="p-6 flex flex-col h-full transition-all duration-300">
                      <div className="text-center transition-all duration-300 group-hover:flex-1 group-hover:flex group-hover:flex-col group-hover:justify-center">
                        <div className="w-24 h-24 group-hover:w-32 group-hover:h-32 rounded-full mx-auto mb-3 overflow-hidden transition-all duration-300">
                          <img alt="Do Music for Good Band" className="w-full h-full object-cover" src="/lovable-uploads/147370e9-f8dd-43f1-8124-9d8f3a541805.png" />
                        </div>
                        <h4 className="text-lg group-hover:text-xl font-bold text-white mb-2 transition-all duration-300">Do Music for Good Band</h4>
                      </div>
                      <p className="text-white/90 leading-relaxed text-sm group-hover:opacity-0 group-hover:h-0 group-hover:mb-0 transition-all duration-300 overflow-hidden">
                        {t('doMusicForGoodDescription')}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Call to Action Section */}
          <motion.div 
            className="text-center bg-gradient-to-r from-white/10 to-white/20 backdrop-blur-md rounded-3xl border border-white/30 p-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Music className="w-20 h-20 text-white mx-auto mb-6 opacity-80" />
            <h2 className="text-4xl font-bold text-white mb-6">{t('readyToStart') || 'Ready to Create Your Song?'}</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              {t('readyToStartDesc') || 'Join thousands of satisfied customers who have turned their stories into beautiful, personalized songs. Let us help you create a musical memory that will last forever.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/order"
                className="bg-white text-purple-800 font-bold py-4 px-8 rounded-full text-lg hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('startYourSong') || 'Start Your Song'}
              </motion.a>
              <motion.a
                href="/packages"
                className="border-2 border-white text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-white hover:text-purple-800 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('viewPackages') || 'View Packages'}
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default About;
