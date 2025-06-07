
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
      {/* Enhanced overlay for better contrast */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      {/* Back to home link */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 inline-flex items-center text-white/90 hover:text-white transition-colors group z-20"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        {t('backHome')}
      </Link>

      {/* Main content container */}
      <div className="w-full max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left side - Brand and description */}
          <div className="text-center lg:text-left">
            {/* MusicGift Logo */}
            <div className="flex justify-center lg:justify-start mb-8">
              <div className="relative">
                <img 
                  src="/lovable-uploads/cb090c51-8b0c-4906-8ec4-8f0ca3583f84.png" 
                  alt="MusicGift Logo" 
                  className="w-48 h-auto"
                />
              </div>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              {t('musicGift')}
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
              {isLogin ? t('signInSubtitle') : t('signUpSubtitle')}
            </p>
            
            {/* Feature highlights */}
            <div className="hidden lg:block space-y-4">
              <div className="flex items-center text-white/80">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                <span>Create personalized musical experiences</span>
              </div>
              <div className="flex items-center text-white/80">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                <span>Share the gift of music with loved ones</span>
              </div>
              <div className="flex items-center text-white/80">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                <span>Professional quality compositions</span>
              </div>
            </div>
          </div>

          {/* Right side - Auth form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-lg overflow-hidden">
              {/* Decorative gradient bar */}
              <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500"></div>
              
              <CardHeader className="space-y-4 pb-8 pt-8">
                <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {isLogin ? t('signInBtn') : t('signUpBtn')}
                </CardTitle>
                <CardDescription className="text-center text-gray-600 text-lg">
                  {isLogin 
                    ? t('connectToContinue')
                    : t('createAccount')
                  }
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-8 pb-8">
                <form onSubmit={handleAuth} className="space-y-6">
                  {!isLogin && (
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="text-sm font-semibold text-gray-700">
                        {t('fullName')}
                      </label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder={t('fullName')}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required={!isLogin}
                        className="h-12 border-2 border-gray-200 focus:border-purple-500 transition-colors duration-200 rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                      {t('email')}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@exemplu.ro"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 border-2 border-gray-200 focus:border-purple-500 transition-colors duration-200 rounded-lg"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-semibold text-gray-700">
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
                        className="h-12 pr-12 border-2 border-gray-200 focus:border-purple-500 transition-colors duration-200 rounded-lg"
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors p-1"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {!isLogin && (
                      <p className="text-xs text-gray-500 mt-1">
                        {t('passwordMinLength')}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 rounded-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                        {isLogin ? t('signingIn') : t('signingUp')}
                      </div>
                    ) : (
                      isLogin ? t('signInBtn') : t('signUpBtn')
                    )}
                  </Button>
                </form>
                
                <div className="mt-8 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">sau</span>
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
                    className="mt-6 text-purple-600 hover:text-purple-700 font-semibold text-lg transition-colors duration-200 hover:underline"
                  >
                    {isLogin 
                      ? t('noAccount')
                      : t('haveAccount')
                    }
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
