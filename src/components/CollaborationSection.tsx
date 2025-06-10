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
  const {
    toast
  } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    portfolioLink: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
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
  return <section className="py-16 relative overflow-hidden" style={{
    backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}>
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }} className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Music className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Join Our Musical Journey
          </h2>
          
          <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            At MusicGift, we're always looking to collaborate with passionate vocalists. 
            If you have a unique voice and a love for creating personalized musical experiences, 
            we'd love to hear from you.
          </p>
        </motion.div>

        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 0.2
      }}>
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 transition-all duration-300 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <MessageSquare className="w-6 h-6 text-purple-400" />
                Apply to Collaborate
              </CardTitle>
              <p className="text-white/80">
                Share your talent with us and become part of our musical family
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2 text-white/90 font-medium">
                      <User className="w-4 h-4" />
                      Full Name
                    </Label>
                    <Input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} placeholder="Enter your full name" required className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-white/90 font-medium">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="your.email@example.com" required className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="portfolioLink" className="flex items-center gap-2 text-white/90 font-medium">
                    <Link className="w-4 h-4" />
                    Portfolio Link
                  </Label>
                  <Input id="portfolioLink" name="portfolioLink" type="url" value={formData.portfolioLink} onChange={handleInputChange} placeholder="Link to your vocal samples or portfolio (YouTube, SoundCloud, etc.)" className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40" />
                  <p className="text-sm text-white/70">
                    Share a link to your best vocal work or musical portfolio
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message" className="flex items-center gap-2 text-white/90 font-medium">
                    <MessageSquare className="w-4 h-4" />
                    Short Bio or Message
                  </Label>
                  <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} placeholder="Tell us about yourself, your musical background, and why you'd like to collaborate with MusicGift..." rows={4} required className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 resize-none" />
                  <p className="text-sm text-white/70">
                    Share your musical journey and what makes your voice unique
                  </p>
                </div>
                
                <div className="flex justify-center pt-4">
                  <Button type="submit" disabled={isSubmitting} className="bg-orange-500 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                    {isSubmitting ? <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Submitting...
                      </> : <>
                        <Send className="w-4 h-4" />
                        Submit Application
                      </>}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>;
};
export default CollaborationSection;