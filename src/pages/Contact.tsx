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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });

  const getInputTextColor = (fieldName: string) => {
    return focusedField === fieldName ? 'text-black' : 'text-white';
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success!",
        description: "Your message has been sent successfully. We'll get back to you soon!",
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
      });

    } catch (error: any) {
      console.error('Error sending contact form:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Contact Form and Info Section */}
      <section className="py-20 text-white relative overflow-hidden" style={{
        backgroundImage: 'url(/uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="absolute inset-0 bg-black/20 py-0"></div>

        {/* Contact Form and Info */}
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 py-[80px]">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 transition-all duration-300 shadow-xl h-full">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">{t('sendMessage')}</h2>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-white/90">{t('firstName')}</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          onFocus={() => setFocusedField('firstName')}
                          onBlur={() => setFocusedField(null)}
                          className={`bg-white/10 border-white/20 ${getInputTextColor('firstName')} placeholder:text-white/60 focus:border-white/40`}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-white/90">{t('lastName')}</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          onFocus={() => setFocusedField('lastName')}
                          onBlur={() => setFocusedField(null)}
                          className={`bg-white/10 border-white/20 ${getInputTextColor('lastName')} placeholder:text-white/60 focus:border-white/40`}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white/90">{t('email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className={`bg-white/10 border-white/20 ${getInputTextColor('email')} placeholder:text-white/60 focus:border-white/40`}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject" className="text-white/90">{t('subject')}</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        onFocus={() => setFocusedField('subject')}
                        onBlur={() => setFocusedField(null)}
                        className={`bg-white/10 border-white/20 ${getInputTextColor('subject')} placeholder:text-white/60 focus:border-white/40`}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-white/90">{t('message')}</Label>
                      <Textarea
                        id="message"
                        rows={6}
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField(null)}
                        className={`bg-white/10 border-white/20 ${getInputTextColor('message')} placeholder:text-white/60 focus:border-white/40`}
                        required
                      />
                    </div>
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-purple hover:bg-white/30 transition-all duration-300"
                    >
                      {isSubmitting ? 'Sending...' : t('sendMessage')}
                    </Button>
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
    </div>
  );
};

export default Contact;
