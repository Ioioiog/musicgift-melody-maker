
import React, { createContext, useContext, useState } from 'react';

export type Language = 'ro' | 'en' | 'fr' | 'pl' | 'de';

export const languageNames: Record<Language, string> = {
  ro: 'Română',
  en: 'English', 
  fr: 'Français',
  pl: 'Polski',
  de: 'Deutsch'
};

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
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
    order: "Comandă",
    orderNow: "Comandă Acum",
    
    // Common UI elements
    loading: "Se încarcă...",
    loadingPackages: "Se încarcă pachetele...",
    learnMore: "Află mai multe",
    backToPackages: "Înapoi la pachete",
    whatsIncluded: "Ce include",
    moreFeatures: "mai multe caracteristici",
    aboutThisPackage: "Despre acest pachet",
    readyToOrder: "Gata să comanzi?",
    startYourJourney: "Începe călătoria ta muzicală astăzi!",
    
    // Premium Package translations
    premiumPackage: "Pachet Premium",
    premiumTagline: "Experiența completă cu distribuție oficială",
    premiumDescription: "Pachetul nostru premium include totul: cântec original, video animat, distribuție oficială prin Mango Records și consultanță creativă detaliată.",
    deliveryTime5To7Days: "5-7 zile lucrătoare",
    
    // Premium Package includes
    originalSongFullProduction: "Cântec original cu producție completă",
    animatedMusicVideo: "Video muzical animat profesional",
    officialDistributionMangoRecords: "Distribuție oficială prin Mango Records",
    detailedCreativeConsultation: "Consultanță creativă detaliată",
    professionalMixingMastering: "Mixing și mastering profesional",
    coverArtwork: "Artwork pentru copertă",
    
    // Premium step titles
    targetAudienceDistribution: "Public țintă și distribuție",
    confirmations: "Confirmări finale",
    
    // Premium field placeholders and labels
    targetAudience: "Descrieți publicul țintă pentru această melodie",
    distributionPlatforms: "Platformele de distribuție dorite",
    artistName: "Numele artistului pentru distribuție",
    acceptDistribution: "Accept distribuția oficială prin Mango Records",
    acceptRights: "Accept termenii și condițiile pentru drepturile comerciale",
    acceptContact: "Accept să fiu contactat pentru detalii suplimentare",
    tempo: "Tempoul melodiei",
    
    // Distribution platform options
    spotify: "Spotify",
    youtube: "YouTube",
    appleMusic: "Apple Music", 
    instagram: "Instagram",
    tiktok: "TikTok",
    allPlatforms: "Toate platformele",
    
    // Tempo options
    slow: "Lent",
    medium: "Mediu",
    fast: "Rapid",
    variable: "Variabil",
    
    // Package types
    personalPackage: "Pachet Personal",
    personalTagline: "Perfect pentru momentele speciale",
    personalDescription: "Un cadou muzical personalizat care va rămâne în inima destinatarului pentru totdeauna.",
    deliveryTime7Days: "7 zile lucrătoare",
    
    // Package includes
    originalSong: "Cântec original personalizat",
    professionalRecording: "Înregistrare profesională",
    basicMixing: "Mixing de bază",
    mp3Delivery: "Livrare în format MP3",
    
    // Step titles
    choosePackage: "Alegeți pachetul",
    generalDetails: "Detalii generale",
    storyAndEmotionalDetails: "Povestea și detaliile emoționale",
    musicalPreferences: "Preferințe muzicale",
    addons: "Servicii suplimentare",
    stepPackage: "Pachet",
    stepDetails: "Detalii",
    stepStory: "Poveste",
    stepPreferences: "Preferințe",
    stepContact: "Contact",
    
    // Field labels and placeholders
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
    
    // Addons
    rushDelivery: "Livrare rapidă (3 zile)",
    commercialRights: "Drepturi comerciale",
    distributionMangoRecords: "Distribuție prin Mango Records",
    customVideo: "Video personalizat",
    audioMessageFromSender: "Mesaj audio de la expeditor",
    extendedSong: "Cântec extins (4-5 minute)",
    
    // Tags
    mostPopular: "Cel mai popular",
    premium: "Premium",
    
    // Common
    price: "Preț",
    ron: "RON",
    includes: "Include",
    selectPackage: "Selectează pachetul",
    startOrder: "Începe comanda",
    
    // About page
    aboutSubtitle: "Despre MusicGift",
    aboutNewDescription1: "MusicGift este o platformă inovatoare care transformă emoțiile și poveștile în muzică personalizată. Creăm cadouri muzicale unice care surprind esența momentelor speciale din viața ta.",
    aboutNewDescription2: "Echipa noastră de profesioniști muzicali folosește cele mai avansate tehnologii pentru a produce cântece originale care rezonează cu fiecare poveste individuală.",
    songsCreated: "Cântece create",
    yearsExperience: "Ani experiență",
    clientSatisfaction: "Satisfacție clienți",
    whoWeAre: "Cine suntem",
    mihaiGruiaTitle: "Mihai Gruia - Fondator și Producer Principal",
    mihaiGruiaDescription: "Cu peste 10 ani de experiență în industria muzicală, Mihai Gruia este sufletul creativ din spatele MusicGift.",
    mangoRecordsTitle: "Mango Records - Partener de Distribuție",
    mangoRecordsDescription: "Platforma noastră de distribuție oficială care asigură că muzica ta ajunge pe toate platformele majore.",
    domgStudioTitle: "DOMG Studio - Producție Profesională", 
    domgStudioDescription: "Studioul nostru de înregistrări echipat cu tehnologia de ultimă generație.",
    doMusicForGoodTitle: "DoMusicForGood - Misiunea Noastră",
    doMusicForGoodDescription: "Credem că muzica poate schimba lumea și ne dedicăm să aducem bucurie prin fiecare cântec creat.",
    
    // Order success/error messages
    orderSuccess: "Comandă creată",
    orderSuccessMessage: "Comanda ta a fost creată cu succes. Integrarea cu plățile va fi disponibilă în curând.",
    orderError: "Eroare comandă",
    orderErrorMessage: "A apărut o eroare la procesarea comenzii. Te rugăm să încerci din nou."
  },
  
  en: {
    // Navigation
    home: "Home",
    about: "About",
    packages: "Packages", 
    howItWorks: "How it Works",
    contact: "Contact",
    testimonials: "Testimonials",
    order: "Order",
    orderNow: "Order Now",
    
    // Common UI elements
    loading: "Loading...",
    loadingPackages: "Loading packages...",
    learnMore: "Learn More",
    backToPackages: "Back to Packages",
    whatsIncluded: "What's Included",
    moreFeatures: "more features",
    aboutThisPackage: "About This Package",
    readyToOrder: "Ready to Order?",
    startYourJourney: "Start your musical journey today!",
    
    // Premium Package translations
    premiumPackage: "Premium Package",
    premiumTagline: "Complete experience with official distribution",
    premiumDescription: "Our premium package includes everything: original song, animated video, official distribution through Mango Records and detailed creative consultation.",
    deliveryTime5To7Days: "5-7 working days",
    
    // Premium Package includes
    originalSongFullProduction: "Original song with full production",
    animatedMusicVideo: "Professional animated music video",
    officialDistributionMangoRecords: "Official distribution through Mango Records",
    detailedCreativeConsultation: "Detailed creative consultation",
    professionalMixingMastering: "Professional mixing and mastering",
    coverArtwork: "Cover artwork",
    
    // Premium step titles
    targetAudienceDistribution: "Target audience and distribution",
    confirmations: "Final confirmations",
    
    // Premium field placeholders and labels
    targetAudience: "Describe the target audience for this song",
    distributionPlatforms: "Desired distribution platforms", 
    artistName: "Artist name for distribution",
    acceptDistribution: "I accept official distribution through Mango Records",
    acceptRights: "I accept the terms and conditions for commercial rights",
    acceptContact: "I accept to be contacted for additional details",
    tempo: "Song tempo",
    
    // Distribution platform options
    spotify: "Spotify",
    youtube: "YouTube", 
    appleMusic: "Apple Music",
    instagram: "Instagram",
    tiktok: "TikTok",
    allPlatforms: "All platforms",
    
    // Tempo options
    slow: "Slow",
    medium: "Medium",
    fast: "Fast", 
    variable: "Variable",
    
    // Package types
    personalPackage: "Personal Package",
    personalTagline: "Perfect for special moments",
    personalDescription: "A personalized musical gift that will remain in the recipient's heart forever.",
    deliveryTime7Days: "7 working days",
    
    // Package includes
    originalSong: "Personalized original song",
    professionalRecording: "Professional recording",
    basicMixing: "Basic mixing",
    mp3Delivery: "MP3 format delivery",
    
    // Step titles
    choosePackage: "Choose package",
    generalDetails: "General details",
    storyAndEmotionalDetails: "Story and emotional details", 
    musicalPreferences: "Musical preferences",
    addons: "Additional services",
    stepPackage: "Package",
    stepDetails: "Details",
    stepStory: "Story",
    stepPreferences: "Preferences",
    stepContact: "Contact",
    
    // Field labels and placeholders
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
    
    // Addons
    rushDelivery: "Rush delivery (3 days)",
    commercialRights: "Commercial rights",
    distributionMangoRecords: "Distribution through Mango Records",
    customVideo: "Custom video",
    audioMessageFromSender: "Audio message from sender",
    extendedSong: "Extended song (4-5 minutes)",
    
    // Tags
    mostPopular: "Most popular",
    premium: "Premium",
    
    // Common
    price: "Price",
    ron: "RON",
    includes: "Includes",
    selectPackage: "Select package",
    startOrder: "Start order",
    
    // About page
    aboutSubtitle: "About MusicGift",
    aboutNewDescription1: "MusicGift is an innovative platform that transforms emotions and stories into personalized music. We create unique musical gifts that capture the essence of special moments in your life.",
    aboutNewDescription2: "Our team of music professionals uses the most advanced technologies to produce original songs that resonate with each individual story.",
    songsCreated: "Songs created",
    yearsExperience: "Years experience",
    clientSatisfaction: "Client satisfaction",
    whoWeAre: "Who we are",
    mihaiGruiaTitle: "Mihai Gruia - Founder & Lead Producer",
    mihaiGruiaDescription: "With over 10 years of experience in the music industry, Mihai Gruia is the creative soul behind MusicGift.",
    mangoRecordsTitle: "Mango Records - Distribution Partner",
    mangoRecordsDescription: "Our official distribution platform that ensures your music reaches all major platforms.",
    domgStudioTitle: "DOMG Studio - Professional Production",
    domgStudioDescription: "Our recording studio equipped with cutting-edge technology.",
    doMusicForGoodTitle: "DoMusicForGood - Our Mission",
    doMusicForGoodDescription: "We believe music can change the world and we're dedicated to bringing joy through every song we create.",
    
    // Order success/error messages
    orderSuccess: "Order Created",
    orderSuccessMessage: "Your order has been created successfully. Payment integration will be available soon.",
    orderError: "Order Error",
    orderErrorMessage: "An error occurred while processing your order. Please try again."
  },
  
  // Adding basic translations for French, Polish, and German
  fr: {
    // Navigation
    home: "Accueil",
    about: "À propos",
    packages: "Packages",
    howItWorks: "Comment ça marche",
    contact: "Contact",
    testimonials: "Témoignages",
    order: "Commander",
    orderNow: "Commander maintenant",
    
    // Common UI elements
    loading: "Chargement...",
    loadingPackages: "Chargement des packages...",
    learnMore: "En savoir plus",
    backToPackages: "Retour aux packages",
    whatsIncluded: "Ce qui est inclus",
    moreFeatures: "plus de fonctionnalités",
    aboutThisPackage: "À propos de ce package",
    readyToOrder: "Prêt à commander?",
    startYourJourney: "Commencez votre voyage musical aujourd'hui!",
    
    // Package types
    personalPackage: "Package Personnel",
    personalTagline: "Parfait pour les moments spéciaux",
    personalDescription: "Un cadeau musical personnalisé qui restera dans le cœur du destinataire pour toujours.",
    
    // Common
    price: "Prix",
    ron: "RON",
    includes: "Inclut",
    selectPackage: "Sélectionner le package",
    startOrder: "Commencer la commande",
    mostPopular: "Le plus populaire",
    
    // Step titles
    stepPackage: "Package",
    stepDetails: "Détails",
    stepStory: "Histoire",
    stepPreferences: "Préférences",
    stepContact: "Contact"
  },
  
  pl: {
    // Navigation
    home: "Start",
    about: "O nas",
    packages: "Pakiety",
    howItWorks: "Jak to działa",
    contact: "Kontakt",
    testimonials: "Opinie",
    order: "Zamówienie",
    orderNow: "Zamów teraz",
    
    // Common UI elements
    loading: "Ładowanie...",
    loadingPackages: "Ładowanie pakietów...",
    learnMore: "Dowiedz się więcej",
    backToPackages: "Powrót do pakietów",
    whatsIncluded: "Co zawiera",
    moreFeatures: "więcej funkcji",
    aboutThisPackage: "O tym pakiecie",
    readyToOrder: "Gotowy do zamówienia?",
    startYourJourney: "Rozpocznij swoją muzyczną podróż już dziś!",
    
    // Package types
    personalPackage: "Pakiet Osobisty",
    personalTagline: "Idealny na wyjątkowe chwile",
    personalDescription: "Spersonalizowany prezent muzyczny, który pozostanie w sercu odbiorcy na zawsze.",
    
    // Common
    price: "Cena",
    ron: "RON",
    includes: "Zawiera",
    selectPackage: "Wybierz pakiet",
    startOrder: "Rozpocznij zamówienie",
    mostPopular: "Najpopularniejszy",
    
    // Step titles
    stepPackage: "Pakiet",
    stepDetails: "Szczegóły",
    stepStory: "Historia",
    stepPreferences: "Preferencje",
    stepContact: "Kontakt"
  },
  
  de: {
    // Navigation
    home: "Startseite",
    about: "Über uns",
    packages: "Pakete",
    howItWorks: "Wie es funktioniert",
    contact: "Kontakt",
    testimonials: "Testimonials",
    order: "Bestellen",
    orderNow: "Jetzt bestellen",
    
    // Common UI elements
    loading: "Wird geladen...",
    loadingPackages: "Pakete werden geladen...",
    learnMore: "Mehr erfahren",
    backToPackages: "Zurück zu Paketen",
    whatsIncluded: "Was enthalten ist",
    moreFeatures: "mehr Funktionen",
    aboutThisPackage: "Über dieses Paket",
    readyToOrder: "Bereit zu bestellen?",
    startYourJourney: "Starten Sie heute Ihre musikalische Reise!",
    
    // Package types
    personalPackage: "Persönliches Paket",
    personalTagline: "Perfekt für besondere Momente",
    personalDescription: "Ein personalisiertes musikalisches Geschenk, das für immer im Herzen des Empfängers bleiben wird.",
    
    // Common
    price: "Preis",
    ron: "RON",
    includes: "Beinhaltet",
    selectPackage: "Paket auswählen",
    startOrder: "Bestellung starten",
    mostPopular: "Am beliebtesten",
    
    // Step titles
    stepPackage: "Paket",
    stepDetails: "Details",
    stepStory: "Geschichte",
    stepPreferences: "Präferenzen",
    stepContact: "Kontakt"
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('ro');

  const t = (key: string): string => {
    const translation = translations[language as keyof typeof translations]?.[key];
    if (translation) return translation;
    
    // Fallback to English if not found in current language
    const englishTranslation = translations.en?.[key];
    if (englishTranslation) return englishTranslation;
    
    // Return the key itself if no translation found (for debugging)
    console.warn(`Translation missing for key: ${key} in language: ${language}`);
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
