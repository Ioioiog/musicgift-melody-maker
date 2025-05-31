
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const Contact = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
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
      description: t('messageThankYou') || 'Thank you for your message. We will get back to you soon.',
    });
    setFormData({ name: "", email: "", phone: "", message: "" });
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
      
      {/* Page Title */}
      <section className="pt-24 pb-8 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">{t('contactTitle') || 'Contact Us'}</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('contactSubtitle') || 'Get in touch with us for any questions or to start your musical journey'}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('getInTouch') || 'Get In Touch'}</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {t('contactDescription') || 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.'}
                </p>
              </div>

              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
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
                ))}
              </div>

              {/* Social Links */}
              <div className="pt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('followUs') || 'Follow Us'}</h3>
                <div className="flex space-x-4">
                  {["📘", "📷", "📺", "🎵"].map((icon, index) => (
                    <button 
                      key={index}
                      className="w-12 h-12 bg-purple-100 hover:bg-purple-200 rounded-full flex items-center justify-center text-xl transition-colors"
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('sendMessage') || 'Send Message'}</h3>
                
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
                    className="w-full bg-gradient-purple hover:opacity-90"
                    size="lg"
                  >
                    {t('sendMessageBtn') || 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
