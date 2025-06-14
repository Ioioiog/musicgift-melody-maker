
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import NewsletterForm from '@/components/NewsletterForm';

const Newsletter = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{
      backgroundImage: 'url(/uploads/59966179-f008-4ec2-b3e6-5b45f100d21f.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Enhanced overlay with gradient for better depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-purple-900/30 to-black/60 backdrop-blur-sm"></div>
      
      {/* Floating particles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-purple-400/60 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-pink-400/60 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-32 w-3 h-3 bg-indigo-400/40 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-purple-300/50 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* Back to home link with enhanced styling */}
      <Link to="/" className="absolute top-6 left-6 inline-flex items-center text-white/90 hover:text-white transition-all duration-300 group z-20 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-white/20">
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        {t('backHome')}
      </Link>

      {/* Main content container with 2-column layout */}
      <div className="w-full max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[80vh] py-8">
          
          {/* Left side - Brand presentation */}
          <div className="text-center lg:text-left space-y-6 order-1 lg:order-1">
            {/* MusicGift Logo */}
            <div className="flex justify-center lg:justify-start mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-all duration-500 scale-110"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-all duration-300 scale-125 animate-pulse"></div>
                <img src="/uploads/logo_musicgift.webp" alt="MusicGift Logo" className="relative w-48 lg:w-56 h-auto drop-shadow-2xl group-hover:scale-105 transition-all duration-500" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent drop-shadow-lg">
                  {t('stayUpdated')}
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-white/95 leading-relaxed max-w-lg mx-auto lg:mx-0 font-light drop-shadow-md">
                {t('subscribeNewsletter')}
              </p>
            </div>
            
            {/* Feature highlights */}
            <div className="hidden lg:block space-y-4 mt-12">
              <div className="flex items-center text-white/85 group hover:text-white transition-all duration-300 cursor-default">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-4 group-hover:scale-125 transition-all duration-300 shadow-lg"></div>
                <span className="text-base font-medium">{t('getExclusiveOffers', 'Get exclusive offers and discounts')}</span>
              </div>
              <div className="flex items-center text-white/85 group hover:text-white transition-all duration-300 cursor-default">
                <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-indigo-400 rounded-full mr-4 group-hover:scale-125 transition-all duration-300 shadow-lg"></div>
                <span className="text-base font-medium">{t('beFirstToKnow', 'Be first to know about new packages')}</span>
              </div>
              <div className="flex items-center text-white/85 group hover:text-white transition-all duration-300 cursor-default">
                <div className="w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mr-4 group-hover:scale-125 transition-all duration-300 shadow-lg"></div>
                <span className="text-base font-medium">{t('weeklyMusicTips', 'Weekly music tips and inspiration')}</span>
              </div>
            </div>
          </div>

          {/* Right side - Newsletter form with Glassmorphism */}
          <div className="w-full max-w-md mx-auto order-2 lg:order-2">
            <Card className="bg-white/20 backdrop-blur-md border border-white/30 hover:border-white/40 shadow-2xl hover:shadow-3xl transition-all duration-300 group hover:bg-white/25 rounded-2xl overflow-hidden relative">
              {/* Enhanced glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardHeader className="space-y-4 pb-6 pt-8 relative z-10">
                <CardTitle className="text-2xl lg:text-3xl font-bold text-center">
                  <span className="text-white drop-shadow-lg">
                    {t('joinNewsletter', 'Join Our Newsletter')}
                  </span>
                </CardTitle>
                <CardDescription className="text-center text-base leading-relaxed px-2 text-white/80">
                  {t('newsletterDescription', 'Stay updated with the latest offers, new packages, and musical inspiration delivered to your inbox.')}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-6 pb-8 relative z-10">
                <NewsletterForm />
                
                <div className="mt-6 text-center">
                  <p className="text-xs text-white/70 leading-relaxed">
                    {t('unsubscribeAnytime', 'You can unsubscribe at any time. We respect your privacy and will never share your information.')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
