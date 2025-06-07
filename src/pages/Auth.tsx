
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

      {/* Main content container with enhanced spacing */}
      <div className="w-full max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left side - Enhanced brand presentation */}
          <div className="text-center lg:text-left space-y-8">
            {/* MusicGift Logo with glow effect */}
            <div className="flex justify-center lg:justify-start mb-12">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <img 
                  src="/lovable-uploads/cb090c51-8b0c-4906-8ec4-8f0ca3583f84.png" 
                  alt="MusicGift Logo" 
                  className="relative w-56 h-auto drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                  {t('musicGift')}
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 leading-relaxed max-w-lg mx-auto lg:mx-0 font-light">
                {isLogin ? t('signInSubtitle') : t('signUpSubtitle')}
              </p>
            </div>
            
            {/* Enhanced feature highlights */}
            <div className="hidden lg:block space-y-6 mt-12">
              <div className="flex items-center text-white/80 group hover:text-white transition-colors">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-4 group-hover:scale-110 transition-transform"></div>
                <span className="text-lg">Create personalized musical experiences</span>
              </div>
              <div className="flex items-center text-white/80 group hover:text-white transition-colors">
                <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-indigo-400 rounded-full mr-4 group-hover:scale-110 transition-transform"></div>
                <span className="text-lg">Share the gift of music with loved ones</span>
              </div>
              <div className="flex items-center text-white/80 group hover:text-white transition-colors">
                <div className="w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mr-4 group-hover:scale-110 transition-transform"></div>
                <span className="text-lg">Professional quality compositions</span>
              </div>
            </div>
          </div>

          {/* Right side - Enhanced auth form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl overflow-hidden relative">
              {/* Enhanced decorative elements */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500"></div>
              <div className="absolute top-2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
              
              <CardHeader className="space-y-6 pb-8 pt-10">
                <CardTitle className="text-4xl font-bold text-center">
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                    {isLogin ? t('signInBtn') : t('signUpBtn')}
                  </span>
                </CardTitle>
                <CardDescription className="text-center text-gray-600 text-lg leading-relaxed">
                  {isLogin 
                    ? t('connectToContinue')
                    : t('createAccount')
                  }
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-8 pb-10">
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
                        className="h-14 border-2 border-gray-200 focus:border-purple-500 transition-all duration-300 rounded-xl text-lg bg-gray-50/50 focus:bg-white"
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
                      className="h-14 border-2 border-gray-200 focus:border-purple-500 transition-all duration-300 rounded-xl text-lg bg-gray-50/50 focus:bg-white"
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
                        className="h-14 pr-14 border-2 border-gray-200 focus:border-purple-500 transition-all duration-300 rounded-xl text-lg bg-gray-50/50 focus:bg-white"
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                    className="w-full h-14 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl relative overflow-hidden group"
                    disabled={isLoading}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {isLoading ? (
                      <div className="flex items-center relative z-10">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                        {isLogin ? t('signingIn') : t('signingUp')}
                      </div>
                    ) : (
                      <span className="relative z-10">
                        {isLogin ? t('signInBtn') : t('signUpBtn')}
                      </span>
                    )}
                  </Button>
                </form>
                
                <div className="mt-10 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-6 bg-white text-gray-500 font-medium">sau</span>
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
                    className="mt-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 font-semibold text-lg transition-all duration-300 hover:scale-105 relative group"
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
