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
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) navigate('/');
    };
    checkUser();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          toast({
            title: t('authError'),
            description: error.message.includes('Invalid login credentials') ? t('invalidCredentials') : error.message,
            variant: "destructive"
          });
        } else {
          toast({ title: t('signInSuccess'), description: t('welcomeBack') });
          navigate('/');
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } }
        });
        if (error) {
          toast({
            title: t('orderError'),
            description: error.message.includes('User already registered') ? t('accountExistsMessage') : error.message,
            variant: "destructive"
          });
        } else {
          toast({ title: t('accountCreated'), description: t('canSignIn') });
          setIsLogin(true);
          setFullName('');
        }
      }
    } catch (error) {
      toast({ title: t('unexpectedError'), description: t('tryAgain'), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{
      backgroundImage: 'url(/lovable-uploads/59966179-f008-4ec2-b3e6-5b45f100d21f.png)',
      backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'
    }}>
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-purple-900/30 to-black/60 backdrop-blur-sm"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-purple-400/60 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-pink-400/60 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-32 w-3 h-3 bg-indigo-400/40 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-purple-300/50 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
      <Link to="/" className="absolute top-6 left-6 inline-flex items-center text-white/90 hover:text-white transition-all duration-300 group z-20 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-white/20">
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        {t('backHome')}
      </Link>
      <div className="transform scale-[0.8] origin-top w-full max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 md:gap-16 lg:gap-20 xl:gap-24 2xl:gap-32 items-center justify-items-center min-h-[75vh] py-8 md:py-12 lg:py-16">
          <div className="text-center xl:text-left space-y-6 order-2 xl:order-1 w-full max-w-2xl">
            <div className="flex justify-center xl:justify-start mb-10">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-full blur-2xl opacity-40"></div>
                <img src="/lovable-uploads/cb090c51-8b0c-4906-8ec4-8f0ca3583f84.png" alt="MusicGift Logo" className="relative w-48 h-auto drop-shadow-2xl" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white">
              <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                {t('musicGift')}
              </span>
            </h1>
            <p className="text-base lg:text-xl text-white/90">
              {isLogin ? t('signInSubtitle') : t('signUpSubtitle')}
            </p>
          </div>
          <div className="w-full max-w-sm xl:justify-self-center">
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-xl">
              <CardHeader className="pt-10 pb-6">
                <CardTitle className="text-3xl font-bold text-center text-slate-800">
                  {isLogin ? t('signInBtn') : t('signUpBtn')}
                </CardTitle>
                <CardDescription className="text-center text-base text-gray-600">
                  {isLogin ? t('connectToContinue') : t('createAccount')}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-8">
                <form onSubmit={handleAuth} className="space-y-6">
                  {!isLogin && (
                    <div>
                      <label htmlFor="fullName" className="text-sm font-semibold text-gray-700 block">
                        {t('fullName')}
                      </label>
                      <Input id="fullName" type="text" value={fullName} onChange={e => setFullName(e.target.value)} required={!isLogin} className="h-12 text-base rounded-lg border-gray-300" />
                    </div>
                  )}
                  <div>
                    <label htmlFor="email" className="text-sm font-semibold text-gray-700 block">
                      {t('email')}
                    </label>
                    <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="h-12 text-base rounded-lg border-gray-300" />
                  </div>
                  <div>
                    <label htmlFor="password" className="text-sm font-semibold text-gray-700 block">
                      {t('password')}
                    </label>
                    <div className="relative">
                      <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required className="h-12 pr-12 text-base rounded-lg border-gray-300" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12 text-base rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white" disabled={isLoading}>
                    {isLoading ? (isLogin ? t('signingIn') : t('signingUp')) : (isLogin ? t('signInBtn') : t('signUpBtn'))}
                  </Button>
                </form>
                <div className="mt-6 text-center">
                  <button type="button" onClick={() => {
                    setIsLogin(!isLogin);
                    setFullName('');
                    setEmail('');
                    setPassword('');
                  }} className="text-sm text-purple-700 hover:text-purple-900 font-medium">
                    {isLogin ? t('noAccount') : t('haveAccount')}
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