
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Mail, User, Link, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const CollaborationSection = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    portfolioLink: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
      title: t('applicationSubmitted'),
      description: t('applicationSubmittedDescription')
    });

    setFormData({
      name: '',
      email: '',
      portfolioLink: '',
      message: ''
    });
    setIsSubmitting(false);
  };

  const getInputTextColor = (fieldName: string) => {
    return focusedField === fieldName ? 'text-black' : 'text-white';
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
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-orange-500">
            {t('joinOurJourney')}
          </h2>
          
          <p className="text-base text-white/90 max-w-xl mx-auto leading-relaxed">
            {t('collaborationDescription')}
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
                {t('applyToCollaborate')}
              </CardTitle>
              <p className="text-white/80 text-sm">
                {t('shareYourTalent')}
              </p>
            </CardHeader>
            
            <CardContent className="pt-0">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="flex items-center gap-2 text-white/90 font-medium text-sm">
                      <User className="w-3.5 h-3.5" />
                      {t('fullName')}
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      placeholder={t('enterFullName')}
                      required
                      className={`bg-white/10 border-white/20 ${getInputTextColor('name')} placeholder:text-white/60 focus:border-white/40 h-10`}
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="flex items-center gap-2 text-white/90 font-medium text-sm">
                      <Mail className="w-3.5 h-3.5" />
                      {t('emailAddress')}
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder={t('emailPlaceholder')}
                      required
                      className={`bg-white/10 border-white/20 ${getInputTextColor('email')} placeholder:text-white/60 focus:border-white/40 h-10`}
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="portfolioLink" className="flex items-center gap-2 text-white/90 font-medium text-sm">
                    <Link className="w-3.5 h-3.5" />
                    {t('portfolioLink')}
                  </Label>
                  <Input
                    id="portfolioLink"
                    name="portfolioLink"
                    type="url"
                    value={formData.portfolioLink}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('portfolioLink')}
                    onBlur={() => setFocusedField(null)}
                    placeholder={t('portfolioPlaceholder')}
                    className={`bg-white/10 border-white/20 ${getInputTextColor('portfolioLink')} placeholder:text-white/60 focus:border-white/40 h-10`}
                  />
                  <p className="text-xs text-white/70">
                    {t('portfolioHelper')}
                  </p>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="message" className="flex items-center gap-2 text-white/90 font-medium text-sm">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {t('shortBioMessage')}
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    placeholder={t('bioPlaceholder')}
                    rows={3}
                    required
                    className={`bg-white/10 border-white/20 ${getInputTextColor('message')} placeholder:text-white/60 focus:border-white/40 resize-none min-h-[80px]`}
                  />
                  <p className="text-xs text-white/70">
                    {t('bioHelper')}
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
                        {t('submitting')}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {t('submitApplication')}
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
