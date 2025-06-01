import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import NewsletterForm from "@/components/NewsletterForm";

const Contact = () => {
  const {
    toast
  } = useToast();
  const {
    t
  } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t('messageSent') || 'Message sent!',
      description: t('messageThankYou') || 'Thank you for your message. We will get back to you soon.'
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: ""
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  const contactMethods = [
    {
      icon: "📧",
      title: t('emailUs') || 'Email Us',
      details: "info@musicgift.ro"
    },
    {
      icon: "📞", 
      title: t('callUs') || 'Call Us',
      details: "+40 721 234 567"
    },
    {
      icon: "📍",
      title: t('visitUs') || 'Visit Us',
      details: "Strada Muzicii 42, București"
    }
  ];
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h1 
            className="text-3xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t('contactTitle') || 'Contact Us'}
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl opacity-90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('contactSubtitle') || 'Get in touch with us for any questions or to start your musical journey'}
          </motion.p>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden py-16">
        {/* Floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            className="absolute top-10 left-0 text-6xl text-purple-300 opacity-20"
            animate={{ x: [0, 100] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            ♪
          </motion.div>
          <motion.div 
            className="absolute bottom-10 right-0 text-4xl text-orange-300 opacity-20"
            animate={{ x: [0, -100] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            🎵
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {t('getInTouch') || 'Get In Touch'}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {t('contactDescription') || 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.'}
                </p>
              </div>

              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="text-3xl">{method.icon}</div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{method.title}</h3>
                            <p className="text-gray-600">{method.details}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    {t('sendMessage') || 'Send Message'}
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('yourName') || 'Your Name'}
                      </label>
                      <Input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                        className="w-full" 
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('yourEmail') || 'Your Email'}
                      </label>
                      <Input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                        className="w-full" 
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('phoneNumber') || 'Phone Number'}
                      </label>
                      <Input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        className="w-full" 
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('yourMessage') || 'Your Message'}
                      </label>
                      <Textarea 
                        id="message" 
                        name="message" 
                        value={formData.message} 
                        onChange={handleChange} 
                        rows={4} 
                        required 
                        className="w-full" 
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold transition-all duration-300 hover:scale-105" 
                      size="lg"
                    >
                      {t('sendMessageBtn') || 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Newsletter Subscription */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-4">📬</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {t('stayUpdated') || 'Stay Updated'}
                    </h3>
                    <p className="text-gray-600">
                      {t('newsletterDescription') || 'Subscribe to get special offers, new packages, and exclusive musical content delivered to your inbox.'}
                    </p>
                  </div>
                  <NewsletterForm />
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card className="shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                    {t('followUs') || 'Follow Us'}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: "📘", label: "Facebook", color: "bg-blue-100 hover:bg-blue-200" },
                      { icon: "📷", label: "Instagram", color: "bg-pink-100 hover:bg-pink-200" },
                      { icon: "📺", label: "YouTube", color: "bg-red-100 hover:bg-red-200" },
                      { icon: "🎵", label: "TikTok", color: "bg-gray-100 hover:bg-gray-200" }
                    ].map((social, index) => (
                      <motion.button
                        key={index}
                        className={`${social.color} rounded-lg p-4 flex flex-col items-center space-y-2 transition-all duration-300 hover:scale-105`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="text-2xl">{social.icon}</span>
                        <span className="text-sm font-medium text-gray-700">{social.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
