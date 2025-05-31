
import React, { createContext, useContext, useState } from 'react';

export type Language = "en" | "ro" | "fr" | "pl" | "de";

export const languageNames: Record<Language, string> = {
  en: "English",
  ro: "Română", 
  fr: "Français",
  pl: "Polski",
  de: "Deutsch"
};

interface LanguageContextType {
  currentLanguage: Language;
  setCurrentLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  ro: {
    // Navigation
    home: "Acasă",
    about: "Despre",
    packages: "Pachete",
    howItWorks: "Cum funcționează",
    contact: "Contact",
    testimonials: "Testimoniale",
    orderNow: "Comandă acum",
    
    // Hero Section
    heroTitle: "Transformă Emoțiile Tale în Muzică",
    heroSubtitle: "Cel mai frumos cadou: o melodie creată special pentru cineva drag.",
    seePackages: "Vezi Pachetele",
    listenToSamples: "Ascultă Mostre",
    
    // Packages Section
    chooseYourPackage: "Alege Pachetul Tău",
    selectPerfectPackage: "Selectează pachetul perfect care se potrivește nevoilor și bugetului tău",
    loadingPackages: "Se încarcă pachetele...",
    failedToLoadPackages: "Nu s-au putut încărca pachetele. Te rugăm să încerci din nou mai târziu.",
    reload: "Reîncarcă",
    mostPopular: "Cel mai popular",
    whatsIncluded: "Ce include",
    moreFeatures: "mai multe funcții",
    learnMore: "Află mai multe",
    viewAllPackages: "Vezi toate pachetele",
    noPackagesAvailable: "Nu sunt pachete disponibile momentan.",
    checkBackLater: "Te rugăm să revii mai târziu.",
    
    // CTA Section
    readyToCreateSpecial: "Gata să Creezi Ceva Special?",
    helpCreatePersonalized: "Să te ajutăm să creezi un cadou muzical personalizat care va fi prețuit pentru totdeauna.",
    startYourOrder: "Începe Comanda",
    
    // Order related
    orderSuccess: "Comanda Creată",
    orderSuccessMessage: "Comanda ta a fost creată cu succes. Integrarea plății va fi disponibilă în curând.",
    orderError: "Eroare Comandă",
    orderErrorMessage: "A apărut o eroare la procesarea comenzii.",
    
    // Form fields
    recipientName: "Numele destinatarului",
    relationship: "Relația cu destinatarul",
    occasion: "Ocazia",
    eventDate: "Data evenimentului",
    songLanguage: "Limba cântecului",
    story: "Povestea voastră",
    emotionalTone: "Tonul emoțional",
    keyMoments: "Momentele cheie",
    specialWords: "Cuvinte sau fraze speciale",
    musicStyle: "Stilul muzical",
    referenceSong: "Cântec de referință (link YouTube/Spotify)",
    
    // Options
    partner: "Partener/ă",
    family: "Familie",
    friend: "Prieten/ă",
    colleague: "Coleg/ă",
    other: "Altul",
    
    birthday: "Ziua de naștere",
    wedding: "Nuntă",
    anniversary: "Aniversare",
    graduation: "Absolvire",
    valentine: "Ziua Îndrăgostiților",
    christmas: "Crăciun",
    
    romanian: "Română",
    english: "Engleză",
    spanish: "Spaniolă",
    french: "Franceză",
    italian: "Italiană",
    
    romantic: "Romantic",
    happy: "Fericit",
    nostalgic: "Nostalgic",
    energetic: "Energic",
    emotional: "Emoțional",
    peaceful: "Liniștit",
    
    pop: "Pop",
    rock: "Rock",
    acoustic: "Acustic",
    electronic: "Electronic",
    jazz: "Jazz",
    classical: "Clasic",
    hiphop: "Hip-Hop",
    country: "Country",
    
    // Common
    price: "Preț",
    ron: "RON",
    includes: "Include",
    selectPackage: "Selectează pachetul",
    startOrder: "Începe comanda",
    
    // Footer
    quickLinks: "Link-uri Rapide",
    followUs: "Urmărește-ne",
    allRightsReserved: "Toate drepturile rezervate",
    madeWithLove: "Făcut cu ❤️ pentru muzică"
  },
  
  en: {
    // Navigation
    home: "Home",
    about: "About",
    packages: "Packages",
    howItWorks: "How it Works",
    contact: "Contact",
    testimonials: "Testimonials",
    orderNow: "Order Now",
    
    // Hero Section
    heroTitle: "Transform Your Emotions into Music",
    heroSubtitle: "The most beautiful gift: a song created especially for someone dear.",
    seePackages: "See Packages",
    listenToSamples: "Listen to Samples",
    
    // Packages Section
    chooseYourPackage: "Choose Your Package",
    selectPerfectPackage: "Select the perfect music package that fits your needs and budget",
    loadingPackages: "Loading packages...",
    failedToLoadPackages: "Failed to load packages. Please try again later.",
    reload: "Reload",
    mostPopular: "Most Popular",
    whatsIncluded: "What's Included",
    moreFeatures: "more features",
    learnMore: "Learn More",
    viewAllPackages: "View All Packages",
    noPackagesAvailable: "No packages available at the moment.",
    checkBackLater: "Please check back later.",
    
    // CTA Section
    readyToCreateSpecial: "Ready to Create Something Special?",
    helpCreatePersonalized: "Let us help you create a personalized musical gift that will be treasured forever.",
    startYourOrder: "Start Your Order",
    
    // Order related
    orderSuccess: "Order Created",
    orderSuccessMessage: "Your order has been created successfully. Payment integration will be available soon.",
    orderError: "Order Error",
    orderErrorMessage: "There was an error processing your order.",
    
    // Form fields
    recipientName: "Recipient's name",
    relationship: "Relationship with recipient",
    occasion: "Occasion",
    eventDate: "Event date",
    songLanguage: "Song language",
    story: "Your story",
    emotionalTone: "Emotional tone",
    keyMoments: "Key moments",
    specialWords: "Special words or phrases",
    musicStyle: "Music style",
    referenceSong: "Reference song (YouTube/Spotify link)",
    
    // Options
    partner: "Partner",
    family: "Family",
    friend: "Friend",
    colleague: "Colleague",
    other: "Other",
    
    birthday: "Birthday",
    wedding: "Wedding",
    anniversary: "Anniversary",
    graduation: "Graduation",
    valentine: "Valentine's Day",
    christmas: "Christmas",
    
    romanian: "Romanian",
    english: "English",
    spanish: "Spanish",
    french: "French",
    italian: "Italian",
    
    romantic: "Romantic",
    happy: "Happy",
    nostalgic: "Nostalgic",
    energetic: "Energetic",
    emotional: "Emotional",
    peaceful: "Peaceful",
    
    pop: "Pop",
    rock: "Rock",
    acoustic: "Acoustic",
    electronic: "Electronic",
    jazz: "Jazz",
    classical: "Classical",
    hiphop: "Hip-Hop",
    country: "Country",
    
    // Common
    price: "Price",
    ron: "RON",
    includes: "Includes",
    selectPackage: "Select package",
    startOrder: "Start order",
    
    // Footer
    quickLinks: "Quick Links",
    followUs: "Follow Us",
    allRightsReserved: "All rights reserved",
    madeWithLove: "Made with ❤️ for music"
  },
  
  fr: {
    // Navigation
    home: "Accueil",
    about: "À propos",
    packages: "Forfaits",
    howItWorks: "Comment ça marche",
    contact: "Contact",
    testimonials: "Témoignages",
    orderNow: "Commander maintenant",
    
    // Hero Section
    heroTitle: "Transformez vos émotions en musique",
    heroSubtitle: "Le plus beau cadeau : une chanson créée spécialement pour quelqu'un de cher.",
    seePackages: "Voir les forfaits",
    listenToSamples: "Écouter les échantillons",
    
    // Packages Section
    chooseYourPackage: "Choisissez votre forfait",
    selectPerfectPackage: "Sélectionnez le forfait musical parfait qui correspond à vos besoins et votre budget",
    loadingPackages: "Chargement des forfaits...",
    failedToLoadPackages: "Échec du chargement des forfaits. Veuillez réessayer plus tard.",
    reload: "Recharger",
    mostPopular: "Le plus populaire",
    whatsIncluded: "Ce qui est inclus",
    moreFeatures: "plus de fonctionnalités",
    learnMore: "En savoir plus",
    viewAllPackages: "Voir tous les forfaits",
    noPackagesAvailable: "Aucun forfait disponible pour le moment.",
    checkBackLater: "Veuillez revenir plus tard.",
    
    // CTA Section
    readyToCreateSpecial: "Prêt à créer quelque chose de spécial ?",
    helpCreatePersonalized: "Laissez-nous vous aider à créer un cadeau musical personnalisé qui sera chéri pour toujours.",
    startYourOrder: "Commencer votre commande",
    
    // Common
    price: "Prix",
    ron: "RON",
    includes: "Inclut",
    selectPackage: "Sélectionner le forfait",
    startOrder: "Commencer la commande"
  },
  
  pl: {
    // Navigation
    home: "Strona główna",
    about: "O nas",
    packages: "Pakiety",
    howItWorks: "Jak to działa",
    contact: "Kontakt",
    testimonials: "Opinie",
    orderNow: "Zamów teraz",
    
    // Hero Section
    heroTitle: "Przekształć swoje emocje w muzykę",
    heroSubtitle: "Najpiękniejszy prezent: piosenka stworzona specjalnie dla kogoś bliskiego.",
    seePackages: "Zobacz pakiety",
    listenToSamples: "Posłuchaj próbek",
    
    // Packages Section
    chooseYourPackage: "Wybierz swój pakiet",
    selectPerfectPackage: "Wybierz idealny pakiet muzyczny, który odpowiada Twoim potrzebom i budżetowi",
    loadingPackages: "Ładowanie pakietów...",
    failedToLoadPackages: "Nie udało się załadować pakietów. Spróbuj ponownie później.",
    reload: "Przeładuj",
    mostPopular: "Najpopularniejszy",
    whatsIncluded: "Co zawiera",
    moreFeatures: "więcej funkcji",
    learnMore: "Dowiedz się więcej",
    viewAllPackages: "Zobacz wszystkie pakiety",
    noPackagesAvailable: "Brak dostępnych pakietów w tej chwili.",
    checkBackLater: "Sprawdź ponownie później.",
    
    // CTA Section
    readyToCreateSpecial: "Gotowy stworzyć coś wyjątkowego?",
    helpCreatePersonalized: "Pozwól nam pomóc Ci stworzyć spersonalizowany prezent muzyczny, który będzie ceniony na zawsze.",
    startYourOrder: "Rozpocznij zamówienie",
    
    // Common
    price: "Cena",
    ron: "RON",
    includes: "Zawiera",
    selectPackage: "Wybierz pakiet",
    startOrder: "Rozpocznij zamówienie"
  },
  
  de: {
    // Navigation
    home: "Startseite",
    about: "Über uns",
    packages: "Pakete",
    howItWorks: "Wie es funktioniert",
    contact: "Kontakt",
    testimonials: "Testimonials",
    orderNow: "Jetzt bestellen",
    
    // Hero Section
    heroTitle: "Verwandle deine Emotionen in Musik",
    heroSubtitle: "Das schönste Geschenk: ein Lied, das speziell für jemand Besonderen geschrieben wurde.",
    seePackages: "Pakete ansehen",
    listenToSamples: "Hörproben anhören",
    
    // Packages Section
    chooseYourPackage: "Wähle dein Paket",
    selectPerfectPackage: "Wähle das perfekte Musikpaket, das deinen Bedürfnissen und deinem Budget entspricht",
    loadingPackages: "Pakete werden geladen...",
    failedToLoadPackages: "Pakete konnten nicht geladen werden. Bitte versuche es später erneut.",
    reload: "Neu laden",
    mostPopular: "Am beliebtesten",
    whatsIncluded: "Was enthalten ist",
    moreFeatures: "weitere Funktionen",
    learnMore: "Mehr erfahren",
    viewAllPackages: "Alle Pakete anzeigen",
    noPackagesAvailable: "Momentan sind keine Pakete verfügbar.",
    checkBackLater: "Bitte schaue später wieder vorbei.",
    
    // CTA Section
    readyToCreateSpecial: "Bereit, etwas Besonderes zu schaffen?",
    helpCreatePersonalized: "Lass uns dir helfen, ein personalisiertes Musikgeschenk zu erstellen, das für immer geschätzt wird.",
    startYourOrder: "Bestellung starten",
    
    // Common
    price: "Preis",
    ron: "RON",
    includes: "Beinhaltet",
    selectPackage: "Paket auswählen",
    startOrder: "Bestellung starten"
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ro');

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
