
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Music, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Auth = () => {
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: t('authError'),
              description: t('invalidCredentials'),
              variant: "destructive",
            });
          } else {
            toast({
              title: t('orderError'),
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: t('signInSuccess'),
            description: t('welcomeBack'),
          });
          navigate('/');
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) {
          if (error.message.includes('User already registered')) {
            toast({
              title: t('accountExists'),
              description: t('accountExistsMessage'),
              variant: "destructive",
            });
          } else {
            toast({
              title: t('orderError'),
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: t('accountCreated'),
            description: t('canSignIn'),
          });
          setIsLogin(true);
          setFullName('');
        }
      }
    } catch (error) {
      toast({
        title: t('unexpectedError'),
        description: t('tryAgain'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: 'url(/lovable-uploads/59966179-f008-4ec2-b3e6-5b45f100d21f.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
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
      <Link 
        to="/" 
        className="absolute top-6 left-6 inline-flex items-center text-white/90 hover:text-white transition-all duration-300 group z-20 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-white/20"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        {t('backHome')}
      </Link>

      {/* Main content container with enhanced responsive design and animations */}
      <div className="w-full max-w-8xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-12 lg:gap-16 xl:gap-20 2xl:gap-24 items-center justify-items-center min-h-[80vh] md:min-h-[85vh] lg:min-h-[90vh] xl:min-h-[95vh] py-6 md:py-8 lg:py-12 xl:py-16 2xl:py-20 relative">
          
          {/* Enhanced geometric background elements */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/20 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
            <div className="absolute bottom-1/3 right-1/3 w-24 h-24 border border-purple-300/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-pink-300/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          
          {/* Left side - Enhanced brand presentation with improved grid positioning */}
          <div className="xl:col-span-7 2xl:col-span-8 text-center xl:text-left space-y-8 lg:space-y-10 xl:space-y-12 2xl:space-y-16 order-2 xl:order-1 w-full max-w-3xl xl:max-w-none animate-fade-in">
            {/* MusicGift Logo with enhanced glow effect */}
            <div className="flex justify-center xl:justify-start mb-8 lg:mb-12 xl:mb-16">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-full blur-3xl opacity-40 group-hover:opacity-70 transition-all duration-700 scale-110 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition-all duration-500 scale-125"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-purple-300/10 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-all duration-300 scale-150"></div>
                <img 
                  src="/lovable-uploads/cb090c51-8b0c-4906-8ec4-8f0ca3583f84.png" 
                  alt="MusicGift Logo" 
                  className="relative w-56 h-auto sm:w-64 lg:w-72 xl:w-80 2xl:w-96 3xl:w-[28rem] drop-shadow-2xl group-hover:scale-105 transition-all duration-700 filter brightness-110"
                />
              </div>
            </div>
            
            <div className="space-y-6 lg:space-y-8 xl:space-y-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl 3xl:text-9xl font-bold text-white mb-4 lg:mb-6 tracking-tight leading-[0.9] transform transition-all duration-1000">
                <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent drop-shadow-2xl inline-block animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  {t('musicGift')}
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-white/95 leading-relaxed max-w-4xl mx-auto xl:mx-0 font-light drop-shadow-lg animate-fade-in" style={{ animationDelay: '0.4s' }}>
                {isLogin ? t('signInSubtitle') : t('signUpSubtitle')}
              </p>
            </div>
            
            {/* Enhanced feature highlights with staggered animations */}
            <div className="hidden lg:block space-y-6 xl:space-y-8 mt-12 xl:mt-16 2xl:mt-20">
              <div className="flex items-center text-white/85 group hover:text-white transition-all duration-500 cursor-default transform hover:translate-x-2 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <div className="w-3 h-3 lg:w-4 lg:h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-4 lg:mr-6 group-hover:scale-150 transition-all duration-500 shadow-lg group-hover:shadow-purple-400/50"></div>
                <span className="text-lg xl:text-xl 2xl:text-2xl font-medium">Create personalized musical experiences</span>
              </div>
              <div className="flex items-center text-white/85 group hover:text-white transition-all duration-500 cursor-default transform hover:translate-x-2 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                <div className="w-3 h-3 lg:w-4 lg:h-4 bg-gradient-to-r from-pink-400 to-indigo-400 rounded-full mr-4 lg:mr-6 group-hover:scale-150 transition-all duration-500 shadow-lg group-hover:shadow-pink-400/50"></div>
                <span className="text-lg xl:text-xl 2xl:text-2xl font-medium">Share the gift of music with loved ones</span>
              </div>
              <div className="flex items-center text-white/85 group hover:text-white transition-all duration-500 cursor-default transform hover:translate-x-2 animate-fade-in" style={{ animationDelay: '1s' }}>
                <div className="w-3 h-3 lg:w-4 lg:h-4 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mr-4 lg:mr-6 group-hover:scale-150 transition-all duration-500 shadow-lg group-hover:shadow-indigo-400/50"></div>
                <span className="text-lg xl:text-xl 2xl:text-2xl font-medium">Professional quality compositions</span>
              </div>
            </div>
          </div>

          {/* Right side - Enhanced auth form with improved grid positioning */}
          <div className="xl:col-span-5 2xl:col-span-4 w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-none mx-auto xl:mx-0 order-1 xl:order-2 xl:justify-self-center 2xl:justify-self-end animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Card className="shadow-2xl border-0 bg-white/97 backdrop-blur-2xl overflow-hidden relative transform hover:scale-[1.01] transition-all duration-500 hover:shadow-purple-500/20">
              {/* Enhanced decorative elements */}
              <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 shadow-lg"></div>
              <div className="absolute top-4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white/60 via-transparent to-white/60"></div>
              
              <CardHeader className="space-y-6 pb-8 pt-16 px-8 lg:px-12">
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-4xl 2xl:text-5xl font-bold text-center">
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
                    {isLogin ? t('signInBtn') : t('signUpBtn')}
                  </span>
                </CardTitle>
                <CardDescription className="text-center text-gray-600 text-base lg:text-lg xl:text-xl leading-relaxed px-2 font-medium">
                  {isLogin 
                    ? t('connectToContinue')
                    : t('createAccount')
                  }
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-8 lg:px-10 pb-12">
                <form onSubmit={handleAuth} className="space-y-8">
                  {!isLogin && (
                    <div className="space-y-3">
                      <label htmlFor="fullName" className="text-sm font-semibold text-gray-700 block">
                        {t('fullName')}
                      </label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder={t('fullName')}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required={!isLogin}
                        className="h-16 border-2 border-gray-200 focus:border-purple-500 transition-all duration-300 rounded-xl text-lg bg-gray-50/50 focus:bg-white shadow-sm"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <label htmlFor="email" className="text-sm font-semibold text-gray-700 block">
                      {t('email')}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@exemplu.ro"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-16 border-2 border-gray-200 focus:border-purple-500 transition-all duration-300 rounded-xl text-lg bg-gray-50/50 focus:bg-white shadow-sm"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label htmlFor="password" className="text-sm font-semibold text-gray-700 block">
                      {t('password')}
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t('password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-16 pr-16 border-2 border-gray-200 focus:border-purple-500 transition-all duration-300 rounded-xl text-lg bg-gray-50/50 focus:bg-white shadow-sm"
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors p-3 rounded-lg hover:bg-gray-100"
                      >
                        {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                      </button>
                    </div>
                    {!isLogin && (
                      <p className="text-xs text-gray-500 mt-2 ml-1">
                        {t('passwordMinLength')}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full h-16 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white font-semibold text-lg lg:text-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl relative overflow-hidden group"
                    disabled={isLoading}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {isLoading ? (
                      <div className="flex items-center relative z-10">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                        {isLogin ? t('signingIn') : t('signingUp')}
                      </div>
                    ) : (
                      <span className="relative z-10">
                        {isLogin ? t('signInBtn') : t('signUpBtn')}
                      </span>
                    )}
                  </Button>
                </form>
                
                <div className="mt-12 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-8 bg-white text-gray-500 font-medium text-base">sau</span>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setFullName('');
                      setEmail('');
                      setPassword('');
                    }}
                    className="mt-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 font-semibold text-xl transition-all duration-300 hover:scale-105 relative group"
                  >
                    <span className="relative z-10">
                      {isLogin 
                        ? t('noAccount')
                        : t('haveAccount')
                      }
                    </span>
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
