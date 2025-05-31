
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
    
    // Existing keys - keeping them as reference
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
    startOrder: "Începe comanda"
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
    
    // Existing keys - keeping them as reference
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
    startOrder: "Start order"
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('ro');

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key] || key;
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
