
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section with Purple Musical Background */}
      <section 
        className="py-20 text-white relative overflow-hidden"
        style={{
          backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Hero Title Section */}
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 mb-12">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            {t('contactTitle')}
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl opacity-90" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('contactSubtitle')}
          </motion.p>
        </div>

        {/* Contact Form and Info inside hero */}
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white/95 backdrop-blur-md border border-white/20 shadow-xl">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('sendMessage')}</h2>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">{t('firstName')}</Label>
                        <Input id="firstName" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">{t('lastName')}</Label>
                        <Input id="lastName" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">{t('email')}</Label>
                      <Input id="email" type="email" />
                    </div>
                    <div>
                      <Label htmlFor="subject">{t('subject')}</Label>
                      <Input id="subject" />
                    </div>
                    <div>
                      <Label htmlFor="message">{t('message')}</Label>
                      <Textarea id="message" rows={6} />
                    </div>
                    <Button className="w-full bg-gradient-purple">{t('sendMessage')}</Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.6, delay: 0.2 }}
            >
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
                      <p className="opacity-90">contact@musicgift.ro</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{t('phone')}</h3>
                      <p className="opacity-90">+40 XXX XXX XXX</p>
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

                <Card className="bg-white/95 backdrop-blur-md border border-white/20 shadow-xl">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 mb-4">{t('businessHours')}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>{t('monday')} - {t('friday')}</span>
                        <span>9:00 - 18:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('saturday')}</span>
                        <span>10:00 - 16:00</span>
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

      <Footer />
    </div>
  );
};

export default Contact;
