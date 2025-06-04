
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, User, Mail, Save, Package, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import UserOrderHistory from '@/components/user/UserOrderHistory';

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        toast({
          title: t('orderError'),
          description: t('loadError'),
          variant: "destructive",
        });
      } else if (data) {
        setFullName(data.full_name || '');
        setEmail(data.email || user?.email || '');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) {
        toast({
          title: t('orderError'),
          description: t('profileError'),
          variant: "destructive",
        });
      } else {
        toast({
          title: "Succes!",
          description: t('profileUpdated'),
        });
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

  if (isLoadingProfile) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-purple-600 hover:text-purple-700 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('backHome')}
            </Link>
            
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('accountSettingsTitle')}</h1>
              <p className="text-gray-600">
                {t('manageAccount')}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {t('profile')}
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  {t('orders')}
                </TabsTrigger>
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  {t('account')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                {/* Profile Information Card */}
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      {t('profileInfo')}
                    </CardTitle>
                    <CardDescription>
                      {t('updateProfile')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                          {t('fullName')}
                        </label>
                        <Input
                          id="fullName"
                          type="text"
                          placeholder={t('fullName')}
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="h-12"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">
                          {t('email')}
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            disabled
                            className="h-12 pl-10 bg-gray-50"
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          {t('emailCannotChange')}
                        </p>
                      </div>
                      
                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            {t('saving')}
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Save className="w-4 h-4 mr-2" />
                            {t('saveChanges')}
                          </div>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders">
                <UserOrderHistory />
              </TabsContent>

              <TabsContent value="account">
                {/* Account Information Card */}
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle>{t('accountInfo')}</CardTitle>
                    <CardDescription>
                      {t('accountDetails')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-700">{t('userId')}</span>
                      <span className="text-sm text-gray-500 font-mono">{user?.id}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-700">{t('registrationDate')}</span>
                      <span className="text-sm text-gray-500">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium text-gray-700">{t('lastUpdate')}</span>
                      <span className="text-sm text-gray-500">
                        {user?.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Settings;
