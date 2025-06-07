
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Music, ArrowLeft, Music2, Music3, Music4 } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced Musical Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Musical Notes */}
        <div className="absolute top-20 left-16 w-8 h-8 text-white/20 animate-float">
          <Music className="w-full h-full" />
        </div>
        <div className="absolute top-1/4 right-20 w-6 h-6 text-purple-200/30 animate-float" style={{ animationDelay: '1s' }}>
          <Music2 className="w-full h-full" />
        </div>
        <div className="absolute bottom-1/3 left-1/4 w-10 h-10 text-indigo-200/25 animate-float" style={{ animationDelay: '2s' }}>
          <Music3 className="w-full h-full" />
        </div>
        <div className="absolute top-1/2 right-1/3 w-7 h-7 text-purple-300/20 animate-float" style={{ animationDelay: '3s' }}>
          <Music4 className="w-full h-full" />
        </div>
        <div className="absolute bottom-20 right-16 w-9 h-9 text-white/15 animate-float" style={{ animationDelay: '4s' }}>
          <Music className="w-full h-full" />
        </div>
        <div className="absolute top-32 left-1/3 w-5 h-5 text-indigo-300/30 animate-float" style={{ animationDelay: '0.5s' }}>
          <Music2 className="w-full h-full" />
        </div>
        
        {/* Enhanced Gradient Orbs */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-16 w-56 h-56 bg-indigo-400/15 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-1/4 w-32 h-32 bg-purple-300/25 rounded-full blur-2xl animate-pulse delay-300"></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-pink-400/20 rounded-full blur-xl animate-float delay-700"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Musical Staff Lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-300/20 to-transparent"></div>
        <div className="absolute top-1/4 mt-4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-300/15 to-transparent"></div>
        <div className="absolute top-1/4 mt-8 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-300/20 to-transparent"></div>
        <div className="absolute top-1/4 mt-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-300/15 to-transparent"></div>
        <div className="absolute top-1/4 mt-16 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-300/20 to-transparent"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            {t('backHome')}
          </Link>
          
          <div className="text-center">
            {/* Music Gift Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-white to-purple-100 rounded-2xl flex items-center justify-center shadow-2xl border border-white/20 backdrop-blur-sm">
                  <Music className="w-10 h-10 text-purple-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">{t('musicGift')}</h1>
            <p className="text-purple-100 text-lg leading-relaxed">
              {isLogin ? t('signInSubtitle') : t('signUpSubtitle')}
            </p>
          </div>
        </div>

        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 overflow-hidden">
          {/* Card Decorative Elements */}
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-lg"></div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-tr from-indigo-400/15 to-transparent rounded-full blur-md"></div>
          
          <CardHeader className="space-y-1 relative z-10 pb-8">
            <CardTitle className="text-3xl text-center font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {isLogin ? t('signInBtn') : t('signUpBtn')}
            </CardTitle>
            <CardDescription className="text-center text-gray-600 text-lg">
              {isLogin 
                ? t('connectToContinue')
                : t('createAccount')
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="relative z-10">
            <form onSubmit={handleAuth} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    {t('fullName')}
                  </label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder={t('fullName')}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isLogin}
                    className="h-12 border-2 border-gray-200 focus:border-purple-500 transition-colors duration-200"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  {t('email')}
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplu.ro"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 border-2 border-gray-200 focus:border-purple-500 transition-colors duration-200"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
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
                    className="h-12 pr-12 border-2 border-gray-200 focus:border-purple-500 transition-colors duration-200"
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
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
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
  );
};

export default Auth;
