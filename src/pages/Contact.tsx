import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
const Contact = () => {
  const {
    t
  } = useLanguage();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const getInputTextColor = (fieldName: string) => {
    return focusedField === fieldName ? 'text-black' : 'text-white';
  };
  return <div className="min-h-screen">
      <Navigation />
      
      {/* Contact Form and Info Section */}
      <section className="py-20 text-white relative overflow-hidden" style={{
      backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
        <div className="absolute inset-0 bg-black/20 py-0"></div>

        {/* Contact Form and Info */}
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 py-[80px]">
            {/* Contact Form */}
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6
          }}>
              <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 transition-all duration-300 shadow-xl h-full">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">{t('sendMessage')}</h2>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-white/90">{t('firstName')}</Label>
                        <Input id="firstName" onFocus={() => setFocusedField('firstName')} onBlur={() => setFocusedField(null)} className={`bg-white/10 border-white/20 ${getInputTextColor('firstName')} placeholder:text-white/60 focus:border-white/40`} />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-white/90">{t('lastName')}</Label>
                        <Input id="lastName" onFocus={() => setFocusedField('lastName')} onBlur={() => setFocusedField(null)} className={`bg-white/10 border-white/20 ${getInputTextColor('lastName')} placeholder:text-white/60 focus:border-white/40`} />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white/90">{t('email')}</Label>
                      <Input id="email" type="email" onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} className={`bg-white/10 border-white/20 ${getInputTextColor('email')} placeholder:text-white/60 focus:border-white/40`} />
                    </div>
                    <div>
                      <Label htmlFor="subject" className="text-white/90">{t('subject')}</Label>
                      <Input id="subject" onFocus={() => setFocusedField('subject')} onBlur={() => setFocusedField(null)} className={`bg-white/10 border-white/20 ${getInputTextColor('subject')} placeholder:text-white/60 focus:border-white/40`} />
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-white/90">{t('message')}</Label>
                      <Textarea id="message" rows={6} onFocus={() => setFocusedField('message')} onBlur={() => setFocusedField(null)} className={`bg-white/10 border-white/20 ${getInputTextColor('message')} placeholder:text-white/60 focus:border-white/40`} />
                    </div>
                    <Button className="w-full bg-gradient-purple hover:bg-white/30 transition-all duration-300">{t('sendMessage')}</Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6,
            delay: 0.2
          }}>
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">{t('getInTouch')}</h2>
                  <p className="opacity-90 mb-8">{t('getInTouchContent')}</p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{t('email')}</h3>
                      <p className="opacity-90">info@musicgift.ro</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{t('phone')}</h3>
                      <p className="opacity-90">+40 723 141 501</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{t('location')}</h3>
                      <p className="opacity-90">Romania</p>
                    </div>
                  </div>
                </div>

                <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 transition-all duration-300 shadow-xl">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-white mb-4">{t('businessHours')}</h3>
                    <div className="space-y-2 text-sm text-white/80">
                      <div className="flex justify-between">
                        <span>{t('monday')} - {t('friday')}</span>
                        <span>9:00 - 18:00</span>
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
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 sm:py-16 md:py-20 text-white relative overflow-hidden" style={{
      backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
        <div className="absolute inset-0 bg-black/50 py-0"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              {t('stayUpdated') || 'Stay Updated'}
            </h2>
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed">
              {t('subscribeNewsletter') || 'Subscribe to our newsletter for the latest updates and exclusive offers'}
            </p>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="max-w-md mx-auto">
            <NewsletterForm />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Contact;