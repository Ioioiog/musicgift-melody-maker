import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { motion } from "framer-motion";

const Contact = () => {
  const { t } = useLanguage();
  
  // SEO Meta Tags
  usePageMeta({
    title_en: t('contactTitle'),
    title_ro: t('contactTitle'),
    description_en: t('contactDescription'),
    description_ro: t('contactDescription'),
    keywords_en: t('contactKeywords'),
    keywords_ro: t('contactKeywords')
  });

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative" style={{
      backgroundImage: "url('/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png')"
    }}>
      {/* Enhanced background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-black/50" />
      
      {/* Animated background dots */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse" />
        <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-purple-300/30 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-pink-300/40 rounded-full animate-pulse delay-2000" />
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-blue-300/25 rounded-full animate-pulse delay-3000" />
      </div>
      
      <Navigation />
      
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            {/* Decorative gradient separator */}
            <div className="w-32 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mx-auto mb-8 rounded-full opacity-80" />
            
            <motion.div initial={{
            opacity: 0,
            y: 30,
            scale: 0.95
          }} animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }} transition={{
            duration: 0.8,
            delay: 0.2
          }}>
              <Card className="border-0 shadow-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:shadow-purple-500/10 transition-all duration-500">
                <CardContent className="p-8 md:p-12 relative overflow-hidden">
                  {/* Card decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full translate-y-12 -translate-x-12" />
                  
                  <div className="relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Contact Form */}
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                          {t('sendMessage')}
                        </h2>
                        <form className="space-y-4">
                          <div>
                            <Input type="text" placeholder={t('firstName')} className="bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder:text-white/60" />
                          </div>
                          <div>
                            <Input type="text" placeholder={t('lastName')} className="bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder:text-white/60" />
                          </div>
                          <div>
                            <Input type="email" placeholder={t('email')} className="bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder:text-white/60" />
                          </div>
                          <div>
                            <Input type="text" placeholder={t('subject')} className="bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder:text-white/60" />
                          </div>
                          <div>
                            <Textarea placeholder={t('message')} className="bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder:text-white/60 min-h-[120px]" />
                          </div>
                          <motion.div whileHover={{
                          scale: 1.05
                        }} whileTap={{
                          scale: 0.98
                        }}>
                            <Button className="w-full bg-orange-500 hover:bg-orange-600 shadow-xl hover:shadow-2xl transition-all duration-300">
                              <Send className="w-5 h-5 mr-2" />
                              {t('sendMessage')}
                            </Button>
                          </motion.div>
                        </form>
                      </div>

                      {/* Contact Info */}
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                          {t('getInTouch')}
                        </h2>
                        <p className="text-white/80 leading-relaxed mb-6">
                          {t('getInTouchContent')}
                        </p>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-white/80">
                            <Phone className="w-5 h-5 text-purple-300" />
                            <span>+40 721 234 567</span>
                          </div>
                          <div className="flex items-center gap-3 text-white/80">
                            <Mail className="w-5 h-5 text-purple-300" />
                            <span>info@musicgift.ro</span>
                          </div>
                          <div className="flex items-center gap-3 text-white/80">
                            <MapPin className="w-5 h-5 text-purple-300" />
                            <span>Str. Exemplu, Nr. 123, București, România</span>
                          </div>
                        </div>

                        {/* Business Hours */}
                        <div className="mt-8">
                          <h3 className="text-xl font-semibold text-white mb-3">
                            {t('businessHours')}
                          </h3>
                          <div className="space-y-2 text-white/70">
                            <div className="flex justify-between">
                              <span>{t('monday')}</span>
                              <span>9:00 - 18:00</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t('tuesday')}</span>
                              <span>9:00 - 18:00</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t('wednesday')}</span>
                              <span>9:00 - 18:00</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t('thursday')}</span>
                              <span>9:00 - 18:00</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t('friday')}</span>
                              <span>9:00 - 17:00</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t('saturday')}</span>
                              <span>{t('closed')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t('sunday')}</span>
                              <span>{t('closed')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Bottom decorative gradient separator */}
            <div className="w-32 h-1 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 mx-auto mt-8 rounded-full opacity-60" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
