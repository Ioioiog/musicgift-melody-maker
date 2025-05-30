
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ro' | 'fr' | 'pl' | 'de';

interface LanguageContextType {
  currentLanguage: Language;
  setCurrentLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    home: 'Home',
    about: 'About Us',
    packages: 'Packages',
    howItWorks: 'How It Works',
    testimonials: 'Testimonials',
    contact: 'Contact',
    orderNow: 'Order Now',
    signIn: 'Sign In',
    user: 'User',
    accountSettings: 'Account Settings',
    signOut: 'Sign Out'
  },
  ro: {
    home: 'Acasă',
    about: 'Despre Noi',
    packages: 'Pachete',
    howItWorks: 'Cum Funcționează',
    testimonials: 'Testimoniale',
    contact: 'Contact',
    orderNow: 'Comandă Acum',
    signIn: 'Conectează-te',
    user: 'Utilizator',
    accountSettings: 'Setări cont',
    signOut: 'Deconectează-te'
  },
  fr: {
    home: 'Accueil',
    about: 'À Propos',
    packages: 'Forfaits',
    howItWorks: 'Comment Ça Marche',
    testimonials: 'Témoignages',
    contact: 'Contact',
    orderNow: 'Commander',
    signIn: 'Se connecter',
    user: 'Utilisateur',
    accountSettings: 'Paramètres du compte',
    signOut: 'Se déconnecter'
  },
  pl: {
    home: 'Strona Główna',
    about: 'O Nas',
    packages: 'Pakiety',
    howItWorks: 'Jak To Działa',
    testimonials: 'Opinie',
    contact: 'Kontakt',
    orderNow: 'Zamów Teraz',
    signIn: 'Zaloguj się',
    user: 'Użytkownik',
    accountSettings: 'Ustawienia konta',
    signOut: 'Wyloguj się'
  },
  de: {
    home: 'Startseite',
    about: 'Über Uns',
    packages: 'Pakete',
    howItWorks: 'Wie Es Funktioniert',
    testimonials: 'Bewertungen',
    contact: 'Kontakt',
    orderNow: 'Jetzt Bestellen',
    signIn: 'Anmelden',
    user: 'Benutzer',
    accountSettings: 'Kontoeinstellungen',
    signOut: 'Abmelden'
  }
};

const languageNames = {
  en: 'EN',
  ro: 'RO',
  fr: 'FR',
  pl: 'PL',
  de: 'DE'
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ro');

  const t = (key: string): string => {
    return translations[currentLanguage][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export { languageNames };
