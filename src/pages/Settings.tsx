
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, User, Mail, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

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
          title: "Eroare",
          description: "Nu s-au putut încărca datele profilului",
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
          title: "Eroare",
          description: "Nu s-au putut actualiza datele profilului",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Succes!",
          description: "Profilul a fost actualizat cu succes",
        });
      }
    } catch (error) {
      toast({
        title: "Eroare neașteptată",
        description: "A apărut o eroare. Încercați din nou.",
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
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-purple-600 hover:text-purple-700 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Înapoi acasă
            </Link>
            
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Setări cont</h1>
              <p className="text-gray-600">
                Gestionează informațiile contului tău
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Profile Information Card */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Informații profil
                </CardTitle>
                <CardDescription>
                  Actualizează informațiile tale personale
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                      Nume complet
                    </label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Numele tău complet"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email
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
                      Emailul nu poate fi modificat din această pagină
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
                        Se salvează...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Save className="w-4 h-4 mr-2" />
                        Salvează modificările
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Account Information Card */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle>Informații cont</CardTitle>
                <CardDescription>
                  Detalii despre contul tău
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">ID utilizator</span>
                  <span className="text-sm text-gray-500 font-mono">{user?.id}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">Data înregistrării</span>
                  <span className="text-sm text-gray-500">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('ro-RO') : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-700">Ultima actualizare</span>
                  <span className="text-sm text-gray-500">
                    {user?.updated_at ? new Date(user.updated_at).toLocaleDateString('ro-RO') : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Settings;
