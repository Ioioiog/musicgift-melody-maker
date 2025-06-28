
import React, { useState, useCallback, useMemo } from 'react';
import { Music, Mail, User, Link, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLocalization } from '@/contexts/OptimizedLocalizationContext';
import { supabase } from '@/integrations/supabase/client';

// Debounce utility function
const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  
  return useCallback((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  }, [callback, delay]);
};

const OptimizedCollaborationSection = () => {
  const { toast } = useToast();
  const { t } = useLocalization();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    portfolioLink: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Debounced input handler to reduce state updates
  const debouncedInputChange = useDebounce((name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, 150);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    debouncedInputChange(name, value);
  }, [debouncedInputChange]);

  // Memoized text color calculation
  const getInputTextColor = useCallback((fieldName: string) => {
    return focusedField === fieldName ? 'text-black' : 'text-white';
  }, [focusedField]);

  // Memoized submit handler
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const emailSubject = `Collaboration Application from ${formData.name}`;
      const emailMessage = `
Collaboration Application Details:

Name: ${formData.name}
Email: ${formData.email}
Portfolio Link: ${formData.portfolioLink || 'Not provided'}

Message:
${formData.message}

---
This is a collaboration application submitted through the MusicGift website.
      `.trim();

      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          firstName: formData.name.split(' ')[0] || formData.name,
          lastName: formData.name.split(' ').slice(1).join(' ') || '',
          email: formData.email,
          subject: emailSubject,
          message: emailMessage
        }
      });

      if (error) throw error;

      toast({
        title: t('applicationSubmitted'),
        description: t('applicationSubmittedDescription')
      });

      setFormData({ name: '', email: '', portfolioLink: '', message: '' });

    } catch (error: any) {
      console.error('Error sending collaboration application:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, toast, t]);

  return (
    <section 
      className="py-8 relative overflow-hidden" 
      style={{
        backgroundImage: 'url(/uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        contain: 'layout style',
        contentVisibility: 'auto',
        containIntrinsicSize: '100vw 600px'
      }}
    >
      <div className="absolute inset-0 bg-black/30" />
      
      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-orange-500">
            {t('joinOurJourney')}
          </h2>
          <p className="text-base text-white/90 max-w-xl mx-auto leading-relaxed">
            {t('collaborationDescription')}
          </p>
        </div>

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
                    {t('fullName')} *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    defaultValue={formData.name}
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
                    {t('emailAddress')} *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={formData.email}
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
                  defaultValue={formData.portfolioLink}
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
                  {t('shortBioMessage')} *
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  defaultValue={formData.message}
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
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
      </div>
    </section>
  );
};

export default OptimizedCollaborationSection;
