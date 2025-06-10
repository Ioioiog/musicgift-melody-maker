
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Mail, User, Link, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const CollaborationSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    portfolioLink: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Application Submitted!",
      description: "Thank you for your interest in collaborating with MusicGift. We'll review your application and get back to you soon."
    });
    
    setFormData({
      name: '',
      email: '',
      portfolioLink: '',
      message: ''
    });
    setIsSubmitting(false);
  };

  return (
    <section className="py-8 relative overflow-hidden" style={{
      backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }} 
          className="text-center mb-6"
        >
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg bg-orange-500">
              <Music className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Join Our Musical Journey
          </h2>
          
          <p className="text-base text-white/90 max-w-xl mx-auto leading-relaxed">
            At MusicGift, we're always looking to collaborate with passionate vocalists. 
            If you have a unique voice and a love for creating personalized musical experiences, 
            we'd love to hear from you.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 transition-all duration-300 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold text-white flex items-center justify-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                Apply to Collaborate
              </CardTitle>
              <p className="text-white/80 text-sm">
                Share your talent with us and become part of our musical family
              </p>
            </CardHeader>
            
            <CardContent className="pt-0">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="flex items-center gap-2 text-white/90 font-medium text-sm">
                      <User className="w-3.5 h-3.5" />
                      Full Name
                    </Label>
                    <Input 
                      id="name" 
                      name="name" 
                      type="text" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      placeholder="Enter your full name" 
                      required 
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 h-10" 
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="flex items-center gap-2 text-white/90 font-medium text-sm">
                      <Mail className="w-3.5 h-3.5" />
                      Email Address
                    </Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      placeholder="your.email@example.com" 
                      required 
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 h-10" 
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="portfolioLink" className="flex items-center gap-2 text-white/90 font-medium text-sm">
                    <Link className="w-3.5 h-3.5" />
                    Portfolio Link
                  </Label>
                  <Input 
                    id="portfolioLink" 
                    name="portfolioLink" 
                    type="url" 
                    value={formData.portfolioLink} 
                    onChange={handleInputChange} 
                    placeholder="Link to your vocal samples or portfolio (YouTube, SoundCloud, etc.)" 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 h-10" 
                  />
                  <p className="text-xs text-white/70">
                    Share a link to your best vocal work or musical portfolio
                  </p>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="message" className="flex items-center gap-2 text-white/90 font-medium text-sm">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Short Bio or Message
                  </Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    value={formData.message} 
                    onChange={handleInputChange} 
                    placeholder="Tell us about yourself, your musical background, and why you'd like to collaborate with MusicGift..." 
                    rows={3} 
                    required 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 resize-none min-h-[80px]" 
                  />
                  <p className="text-xs text-white/70">
                    Share your musical journey and what makes your voice unique
                  </p>
                </div>
                
                <div className="flex justify-center pt-2">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 h-10"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default CollaborationSection;
