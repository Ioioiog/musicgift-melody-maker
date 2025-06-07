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
  const {
    t
  } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
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
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: t('authError'),
              description: t('invalidCredentials'),
              variant: "destructive"
            });
          } else {
            toast({
              title: t('orderError'),
              description: error.message,
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: t('signInSuccess'),
            description: t('welcomeBack')
          });
          navigate('/');
        }
      } else {
        const {
          error
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        });
        if (error) {
          if (error.message.includes('User already registered')) {
            toast({
              title: t('accountExists'),
              description: t('accountExistsMessage'),
              variant: "destructive"
            });
          } else {
            toast({
              title: t('orderError'),
              description: error.message,
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: t('accountCreated'),
            description: t('canSignIn')
          });
          setIsLogin(true);
          setFullName('');
        }
      }
    } catch (error) {
      toast({
        title: t('unexpectedError'),
        description: t('tryAgain'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{
      backgroundImage: 'url(/lovable-uploads/59966179-f008-4ec2-b3e6-5b45f100d21f.png)',
      backgroundSize: '20%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Scaled down overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-purple-900/6 to-black/12 backdrop-blur-xs"></div>
      
      {/* Scaled down floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-4 left-2 w-0.5 h-0.5 bg-purple-400/60 rounded-full animate-float" style={{
        animationDelay: '0s'
      }}></div>
        <div className="absolute top-8 right-4 w-0.25 h-0.25 bg-pink-400/60 rounded-full animate-float" style={{
        animationDelay: '2s'
      }}></div>
        <div className="absolute bottom-6 left-6 w-0.75 h-0.75 bg-indigo-400/40 rounded-full animate-float" style={{
        animationDelay: '4s'
      }}></div>
        <div className="absolute bottom-4 right-2 w-0.5 h-0.5 bg-purple-300/50 rounded-full animate-float" style={{
        animationDelay: '1s'
      }}></div>
      </div>
      
      {/* Back to home link with scaled down styling */}
      <Link to="/" className="absolute top-2 left-2 inline-flex items-center text-white/90 hover:text-white transition-all duration-300 group z-20 bg-white/10 backdrop-blur-sm rounded-full px-2 py-1 hover:bg-white/20 text-sm">
        <ArrowLeft className="w-3 h-3 mr-1 group-hover:-translate-x-1 transition-transform" />
        {t('backHome')}
      </Link>

      {/* Main content container with scaled down dimensions */}
      <div className="w-full max-w-5xl mx-auto px-2 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 items-center justify-items-center min-h-[60vh] md:min-h-[65vh] lg:min-h-[70vh] xl:min-h-[75vh] py-4 md:py-6 lg:py-8">
          
          {/* Left side - Scaled down brand presentation */}
          <div className="text-center xl:text-left space-y-4 lg:space-y-5 xl:space-y-6 order-2 xl:order-1 w-full max-w-xl xl:max-w-none">
            {/* MusicGift Logo with scaled down size */}
            <div className="flex justify-center xl:justify-start mb-6 lg:mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-all duration-500 scale-110"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-all duration-300 scale-125 animate-pulse"></div>
                <img src="/lovable-uploads/cb090c51-8b0c-4906-8ec4-8f0ca3583f84.png" alt="MusicGift Logo" className="relative w-32 h-auto lg:w-36 xl:w-40 2xl:w-48 drop-shadow-xl group-hover:scale-105 transition-all duration-500" />
              </div>
            </div>
            
            <div className="space-y-3 lg:space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white mb-3 tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent drop-shadow-lg">
                  {t('musicGift')}
                </span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-white/95 leading-relaxed max-w-xl mx-auto xl:mx-0 font-light drop-shadow-md">
                {isLogin ? t('signInSubtitle') : t('signUpSubtitle')}
              </p>
            </div>
            
            {/* Scaled down feature highlights */}
            <div className="hidden lg:block space-y-4 mt-8 xl:mt-10">
              <div className="flex items-center text-white/85 group hover:text-white transition-all duration-300 cursor-default">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-3 group-hover:scale-125 transition-all duration-300 shadow-md"></div>
                <span className="text-sm font-medium">Create personalized musical experiences</span>
              </div>
              <div className="flex items-center text-white/85 group hover:text-white transition-all duration-300 cursor-default">
                <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-indigo-400 rounded-full mr-3 group-hover:scale-125 transition-all duration-300 shadow-md"></div>
                <span className="text-sm font-medium">Share the gift of music with loved ones</span>
              </div>
              <div className="flex items-center text-white/85 group hover:text-white transition-all duration-300 cursor-default">
                <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mr-3 group-hover:scale-125 transition-all duration-300 shadow-md"></div>
                <span className="text-sm font-medium">Professional quality compositions</span>
              </div>
            </div>
          </div>

          {/* Right side - Scaled down auth form */}
          <div className="w-full max-w-xs sm:max-w-sm mx-auto xl:mx-0 order-1 xl:order-2 xl:justify-self-center 2xl:justify-self-start">
            <Card className="shadow-xl border-0 bg-white/96 backdrop-blur-xl overflow-hidden relative transform hover:scale-[1.01] transition-all duration-300">
              {/* Scaled down decorative elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
              <div className="absolute top-1 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              
              <CardHeader className="space-y-3 pb-4 pt-6">
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-center">
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-white">
                    {isLogin ? t('signInBtn') : t('signUpBtn')}
                  </span>
                </CardTitle>
                <CardDescription className="text-center text-sm lg:text-base leading-relaxed px-1 text-white">
                  {isLogin ? t('connectToContinue') : t('createAccount')}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-4 lg:px-5 pb-6">
                <form onSubmit={handleAuth} className="space-y-4 text-white">
                  {!isLogin && <div className="space-y-2">
                      <label htmlFor="fullName" className="text-xs font-semibold text-white block">
                        {t('fullName')}
                      </label>
                      <Input id="fullName" type="text" placeholder={t('fullName')} value={fullName} onChange={e => setFullName(e.target.value)} required={!isLogin} className="h-8 border-2 border-gray-200 focus:border-purple-500 transition-all duration-300 rounded-lg text-sm bg-gray-50/50 focus:bg-white shadow-sm text-black" />
                    </div>}
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-semibold text-white block bg-transparent">
                      {t('email')}
                    </label>
                    <Input id="email" type="email" placeholder="email@exemplu.ro" value={email} onChange={e => setEmail(e.target.value)} required className="h-8 border-2 border-gray-200 focus:border-purple-500 transition-all duration-300 rounded-lg text-sm bg-gray-50/50 focus:bg-white shadow-sm text-black" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-xs font-semibold text-white block">
                      {t('password')}
                    </label>
                    <div className="relative">
                      <Input id="password" type={showPassword ? "text" : "password"} placeholder={t('password')} value={password} onChange={e => setPassword(e.target.value)} required className="h-8 pr-8 border-2 border-gray-200 focus:border-purple-500 transition-all duration-300 rounded-lg text-sm bg-gray-50/50 focus:bg-white shadow-sm text-black" minLength={6} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors p-1 rounded hover:bg-gray-100">
                        {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    </div>
                    {!isLogin && <p className="text-xs text-white mt-1 ml-1">
                        {t('passwordMinLength')}
                      </p>}
                  </div>
                  
                  <Button type="submit" className="w-full h-8 relative overflow-hidden rounded-lg font-semibold text-sm lg:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 group
                    bg-white/10 backdrop-blur-md border border-white/20 text-white
                    hover:bg-white/20 hover:border-white/30
                    before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-600/30 before:via-pink-600/30 before:to-indigo-600/30 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100" disabled={isLoading}>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-pulse"></div>
                    {isLoading ? <div className="flex items-center relative z-10">
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-2" />
                        {isLogin ? t('signingIn') : t('signingUp')}
                      </div> : <span className="relative z-10">
                        {isLogin ? t('signInBtn') : t('signUpBtn')}
                      </span>}
                  </Button>
                </form>
                
                <div className="mt-6 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-4 bg-white text-gray-500 font-medium text-sm">sau</span>
                    </div>
                  </div>
                  
                  <button type="button" onClick={() => {
                  setIsLogin(!isLogin);
                  setFullName('');
                  setEmail('');
                  setPassword('');
                }} className="mt-5 bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 font-semibold text-sm transition-all duration-300 hover:scale-105 relative group bg-zinc-500 hover:bg-zinc-400 text-white">
                    <span className="relative z-10 text-white">
                      {isLogin ? t('noAccount') : t('haveAccount')}
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
