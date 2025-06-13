
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useStructuredData } from "@/components/StructuredData";
import OptimizedImage from "@/components/OptimizedImage";
import { useState } from "react";

const Contact = () => {
  const { t } = useLanguage();
  const { organizationSchema } = useStructuredData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact MusicGift.ro",
    "description": "Get in touch with MusicGift.ro for personalized song creation services",
    "mainEntity": organizationSchema
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', formData);
  };

  return (
    <>
      <SEOHead
        title={t('contactUs', 'Contact Us') + ' - MusicGift.ro'}
        description={t('contactDescription', 'Get in touch with MusicGift.ro for personalized song creation services. Professional support and custom music solutions.')}
        structuredData={contactPageSchema}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Navigation />
        
        <main className="pt-16">
          {/* Hero Section */}
          <section className="relative py-20 px-4 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <OptimizedImage
                src="/lovable-uploads/9d0d10ef-2340-4632-8df0-f5058547a0c9.png"
                alt="Contact us background with musical elements"
                className="w-full h-full object-cover opacity-20"
                priority={true}
                width={1920}
                height={1080}
              />
            </div>
            
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                {t('contactUs', 'Contact Us')}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                {t('contactSubtitle', 'Ready to create your personalized song? Let\'s discuss your musical vision!')}
              </p>
            </div>
          </section>

          {/* Contact Content */}
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <MessageCircle className="w-8 h-8 text-purple-400" aria-hidden="true" />
                      {t('sendMessage', 'Send us a message')}
                    </CardTitle>
                    <CardDescription className="text-white/80">
                      {t('formDescription', 'Fill out the form below and we\'ll get back to you as soon as possible')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-white">
                            {t('fullName', 'Full Name')} *
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400"
                            placeholder={t('enterFullName', 'Enter your full name')}
                            aria-describedby="name-error"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-white">
                            {t('emailAddress', 'Email Address')} *
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400"
                            placeholder={t('enterEmail', 'Enter your email address')}
                            aria-describedby="email-error"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-white">
                          {t('subject', 'Subject')} *
                        </Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400"
                          placeholder={t('enterSubject', 'What can we help you with?')}
                          aria-describedby="subject-error"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-white">
                          {t('message', 'Message')} *
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={5}
                          className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400 resize-none"
                          placeholder={t('enterMessage', 'Tell us about your project or question...')}
                          aria-describedby="message-error"
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-medium focus:ring-2 focus:ring-orange-300"
                        aria-label={t('sendMessage', 'Send Message')}
                      >
                        {t('sendMessage', 'Send Message')}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <div className="space-y-8">
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center gap-3">
                        <Mail className="w-8 h-8 text-blue-400" aria-hidden="true" />
                        {t('getInTouch', 'Get in Touch')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center gap-4">
                        <Mail className="w-6 h-6 text-purple-400 flex-shrink-0" aria-hidden="true" />
                        <div>
                          <div className="font-medium">{t('email', 'Email')}</div>
                          <a 
                            href="mailto:contact@musicgift.ro" 
                            className="text-white/80 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300 rounded"
                          >
                            contact@musicgift.ro
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Phone className="w-6 h-6 text-green-400 flex-shrink-0" aria-hidden="true" />
                        <div>
                          <div className="font-medium">{t('phone', 'Phone')}</div>
                          <a 
                            href="tel:+40123456789" 
                            className="text-white/80 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 rounded"
                          >
                            +40 123 456 789
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Clock className="w-6 h-6 text-yellow-400 flex-shrink-0" aria-hidden="true" />
                        <div>
                          <div className="font-medium">{t('businessHours', 'Business Hours')}</div>
                          <div className="text-white/80">
                            {t('mondayFriday', 'Monday - Friday')}: 9:00 - 18:00<br />
                            {t('weekends', 'Weekends')}: 10:00 - 16:00
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <MapPin className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" aria-hidden="true" />
                        <div>
                          <div className="font-medium">{t('location', 'Location')}</div>
                          <div className="text-white/80">
                            Bucharest, Romania<br />
                            {t('onlineServices', 'Online services available worldwide')}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                    <CardHeader>
                      <CardTitle className="text-xl">
                        {t('responseTime', 'Response Time')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/80">
                        {t('responseDescription', 'We typically respond to all inquiries within 24 hours during business days. For urgent requests, please call us directly.')}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
