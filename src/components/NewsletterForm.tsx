
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNewsletterSubscribe } from '@/hooks/useNewsletter';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2 } from 'lucide-react';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const { t } = useLanguage();
  const subscribeMutation = useNewsletterSubscribe();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      return;
    }

    subscribeMutation.mutate({
      email: email.trim(),
      name: name.trim() || undefined
    });

    // Reset form on success
    if (subscribeMutation.isSuccess) {
      setEmail('');
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      <div className="flex flex-col space-y-3">
        <Input
          type="text"
          placeholder={t('enterName')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 bg-white/10 border-white/20 text-black placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 text-sm sm:text-base"
          disabled={subscribeMutation.isPending}
        />
        <Input
          type="email"
          placeholder={t('enterEmail')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 bg-white/10 border-white/20 text-black placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 text-sm sm:text-base"
          disabled={subscribeMutation.isPending}
        />
        <Button
          type="submit"
          disabled={subscribeMutation.isPending || !email}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-orange-700 text-white font-semibold px-4 sm:px-6 transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {subscribeMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t('subscribing')}
            </>
          ) : (
            t('subscribe')
          )}
        </Button>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed">
        {t('subscribeDisclaimer')}
      </p>
    </form>
  );
};

export default NewsletterForm;
