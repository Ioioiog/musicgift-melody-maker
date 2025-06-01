import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  ro: {
    // Navigation & General
    home: "Acasă",
    packages: "Pachete",
    howItWorks: "Cum funcționează",
    about: "Despre noi",
    testimonials: "Testimoniale",
    contact: "Contact",
    getStarted: "Începe acum",
    orderNow: "Comandă acum",
    
    // Package names
    personalPackage: "Pachet Personal",
    premiumPackage: "Pachet Premium",
    businessPackage: "Pachet Business",
    artistPackage: "Pachet Artist",
    remixPackage: "Pachet Remix",
    instrumentalPackage: "Pachet Instrumental",
    giftPackage: "Pachet Cadou",
    
    // Package taglines
    personalTagline: "Un cântec scris cu suflet – doar pentru tine",
    premiumTagline: "Lansare completă cu distribuție globală",
    businessTagline: "Dă-i brandului tău o voce memorabilă",
    artistTagline: "Lansează-ți cariera muzicală cu o piesă de top",
    remixTagline: "Redă viață piesei tale într-un stil nou",
    instrumentalTagline: "Creează pe baza unui instrumental personalizat",
    giftTagline: "O poveste muzicală oferită în dar",
    
    // Package descriptions
    personalDescription: "Un cântec scris cu suflet – doar pentru tine și cei dragi. Ideal pentru aniversări, nunți sau ocazii speciale – transformăm povestea ta într-un cadou muzical unic și emoționant.",
    premiumDescription: "Lansare completă. Expune-ți povestea lumii întregi. Muzică originală, videoclip animat DOMG și distribuție globală prin canalul Mango Records (+100k).",
    businessDescription: "Dă-i brandului tău o voce memorabilă. Creat pentru companii care vor o piesă originală pentru branding, campanii sau reclame cu impact emoțional.",
    artistDescription: "Lansează-ți cariera muzicală cu o piesă de top. Pentru artiști dedicați care își doresc o piesă originală, distribuție completă și co-proprietate asupra drepturilor.",
    remixDescription: "Redă viață piesei tale într-un stil complet nou. Pentru artiști sau creatori care dețin drepturile asupra piesei originale și vor o versiune remixată într-un alt gen.",
    instrumentalDescription: "Creează pe baza unui instrumental construit special pentru tine. Pentru artiști care vor să-și scrie propriul cântec, dar au nevoie de un instrumental personalizat și profesionist.",
    giftDescription: "O poveste muzicală oferită în dar. Perfect pentru a surprinde pe cineva drag – destinatarul își alege singur stilul și atmosfera cântecului.",
    
    // Delivery times
    personalDelivery: "3–5 zile",
    premiumDelivery: "5–7 zile",
    businessDelivery: "5–7 zile",
    artistDelivery: "7–10 zile",
    remixDelivery: "3–5 zile",
    instrumentalDelivery: "3–5 zile",
    giftDelivery: "Instant",
    
    // Package includes
    personalInclude1: "Cântec original creat după povestea ta",
    personalInclude2: "Voce profesionistă din echipa MusicGift",
    personalInclude3: "Livrare rapidă în 3–5 zile",
    personalInclude4: "Drepturi de utilizare personală (non-comercial)",
    personalInclude5: "Consultare creativă bazată pe poveste și preferințe muzicale",
    
    premiumInclude1: "Piesă originală cu producție completă",
    premiumInclude2: "Videoclip animat (stil \"Do Music for Good\")",
    premiumInclude3: "Distribuție digitală oficială prin Mango Records (+100k)",
    
    businessInclude1: "Cântec personalizat pentru afacerea ta",
    businessInclude2: "Producție profesională și voce de studio",
    businessInclude3: "Mix & Master de calitate superioară",
    businessInclude4: "Licență comercială limitată",
    
    artistInclude1: "Piesă originală + instrumental profesional",
    artistInclude2: "Ghid vocal + înregistrare cu voce de studio",
    artistInclude3: "Coproprietate 50/50 asupra masterului",
    artistInclude4: "Distribuție completă prin Mango Records",
    
    remixInclude1: "Remix complet într-un stil ales",
    remixInclude2: "Etichetă personalizabilă: \"Remix by Mango Records\"",
    remixInclude3: "Mix & Master profesional",
    remixInclude4: "Export audio: WAV + MP3",
    remixInclude5: "Versiune scurtă pentru social media (opțional)",
    remixInclude6: "Necesită trimiterea piesei originale",
    
    instrumentalInclude1: "Instrumental original compus de MusicGift",
    instrumentalInclude2: "Aranjament complet: beat, armonii, structură",
    instrumentalInclude3: "Fără voce – spațiu pentru interpretarea ta",
    instrumentalInclude4: "Fișier audio profesional (WAV sau MP3)",
    instrumentalInclude5: "Licență comercială limitată",
    
    giftInclude1: "Card cadou digital valabil pentru orice pachet MusicGift",
    giftInclude2: "Livrare instantanee prin e-mail",
    giftInclude3: "Beneficiarul alege pachetul dorit",
    
    // Tags
    newTag: "Nou",
    popularTag: "Popular",
    premiumTag: "Premium",
    giftTag: "Cadou",
    
    // Languages
    romanianLanguage: "Română",
    englishLanguage: "Engleză",
    frenchLanguage: "Franceză",
    
    // Step titles - NEW TRANSLATIONS
    forWhomIsSongStep: "Pentru cine este cântecul?",
    forWhichCompanyIsSongStep: "Pentru ce companie este cântecul?",
    yourContactDetailsStep: "Detaliile tale de contact",
    contactAndBillingDetailsStep: "Detalii de contact și facturare",
    
    // Field placeholders - NEW TRANSLATIONS
    recipientNamePlaceholder: "Numele persoanei pentru care este cântecul",
    recipientNamePronunciationPlaceholder: "Înregistrare pronunție nume (dacă numele are o pronunție neobișnuită)",
    relationshipPlaceholder: "Relația ta cu această persoană",
    companyNameForSongPlaceholder: "Numele companiei pentru care este cântecul",
    companyNamePronunciationPlaceholder: "Înregistrare pronunție nume companie",
    
    // Relationship options - NEW TRANSLATIONS
    relationshipPartner: "Partener(ă)",
    relationshipFamily: "Familie",
    relationshipFriend: "Prieten(ă)",
    relationshipColleague: "Coleg(ă)",
    relationshipOther: "Altceva",
    
    // Existing step titles
    choosePackageStep: "Alege pachetul",
    personalDetailsStep: "Detalii personale",
    companyDetailsStep: "Detalii companie",
    yourStoryStep: "Povestea ta",
    brandStoryStep: "Brand și poveste",
    addonsStep: "Add-ons",
    distributionConfirmationStep: "Confirmare distribuție",
    artisticDataStep: "Date artistice",
    songConceptStep: "Concept melodie",
    processAcceptanceStep: "Acceptare proces",
    remixInfoStep: "Informații remix",
    legalityContactStep: "Legalitate și contact",
    artisticDetailsStep: "Detalii artistice",
    visionStyleStep: "Viziune și stil",
    extraOptionsStep: "Extra opțiuni",
    recipientDetailsStep: "Detalii destinatar",
    deliveryConfirmationStep: "Livrare & confirmare",
    
    // Field placeholders (existing ones)
    choosePersonalPackage: "Alege pachetul Personal",
    choosePremiumPackage: "Alege pachetul Premium",
    chooseBusinessPackage: "Alege pachetul Business",
    chooseArtistPackage: "Alege pachetul Artist",
    fullNamePlaceholder: "Numele complet",
    emailPlaceholder: "Adresa de email",
    phonePlaceholder: "Telefon",
    songLanguagePlaceholder: "Limba melodiei (RO / EN / FR)",
    occasionPlaceholder: "Ocazia / dedicația",
    pronunciationRecordingPlaceholder: "Înregistrare pronunție (opțional)",
    storyPlaceholder: "Descrie povestea",
    vibePlaceholder: "Stare / emoție dorită",
    youtubeLinksPlaceholder: "Linkuri YouTube de inspirație",
    importantKeywordsPlaceholder: "Cuvinte cheie importante",
    keywordsPronunciationPlaceholder: "Pronunție cuvinte cheie (opțional)",
    selectAddonsPlaceholder: "Selectează extra-opțiuni",
    acceptMentionPlaceholder: "Accept că trebuie menționată sursa MusicGift.ro by Mango Records dacă piesa este postată online",
    acceptMangoDistributionPlaceholder: "Accept că piesa va fi distribuită doar prin Mango Records",
    companyNamePlaceholder: "Numele companiei",
    contactPersonPlaceholder: "Persoana de contact",
    companyPronunciationPlaceholder: "Pronunție companie (opțional)",
    brandStoryPlaceholder: "Povestea brandului",
    keyValuesPlaceholder: "Valori și mesaje principale",
    inspirationLinksPlaceholder: "Inspirație video/muzicală",
    artistNamePlaceholder: "Numele artistului",
    mediaLinksPlaceholder: "Linkuri cu melodii lansate",
    pressLinksPlaceholder: "Linkuri cu apariții media",
    musicalVisionPlaceholder: "Care este viziunea ta muzicală?",
    acceptProcessPlaceholder: "Accept că: 1. Primesc piesa + instrumental în 7 zile. 2. Trimit vocea WAV. 3. Mango Records mixează și livrează. 4. Semnez contract 50/50 co-producție.",
    acceptContactPlaceholder: "Accept să fiu contactat în următoarele 24–48h de echipa MusicGift",
    originalSongLinkPlaceholder: "Link piesă originală",
    uploadWAVPlaceholder: "Încarcă fișier .WAV",
    remixGenrePlaceholder: "Stil dorit pentru remix",
    ownershipConfirmationPlaceholder: "Declar că dețin toate drepturile asupra piesei originale",
    titleLanguagePlaceholder: "Limba titlului și vibe-ului",
    instrumentalGenrePlaceholder: "Genul muzical dorit",
    moodAtmospherePlaceholder: "Mood/atmosferă",
    giftRecipientNamePlaceholder: "Numele persoanei căreia îi oferi cadoul",
    recipientEmailPlaceholder: "Emailul destinatarului",
    personalMessagePlaceholder: "Mesajul tău (opțional)",
    senderNamePlaceholder: "Numele tău",
    senderEmailPlaceholder: "Emailul tău pentru confirmare",
    
    // Order wizard
    loadingPackages: "Se încarcă pachetele...",
    loadingSteps: "Se încarcă pașii...",
    errorLoadingSteps: "Eroare la încărcarea pașilor",
    errorLoadingStepsDesc: "Nu s-a putut încărca configurația pentru acest pachet. Te rugăm să încerci din nou sau să contactezi suportul.",
    chooseAnotherPackage: "Alege alt pachet",
    tryAgain: "Încearcă din nou",
    noStepsConfigured: "Nu sunt configurați pași",
    noStepsConfiguredDesc: "Acest pachet nu are pași configurați încă. Te rugăm să contactezi suportul sau să alegi un alt pachet.",
    selectYourPackage: "Selectează pachetul tău",
    selectOption: "Selectează o opțiune",
    completeRequiredFields: "Te rugăm să completezi toate câmpurile obligatorii",
    completeRequiredFieldsDesc: "Asigură-te că toate câmpurile obligatorii sunt completate înainte de a continua.",
    somethingWentWrong: "Ceva nu a mers bine",
    tryAgainSupport: "Te rugăm să încerci din nou sau să contactezi suportul dacă problema persistă.",
    stepPackage: "Pasul",
    of: "din",
    progress: "Progres",
    whatsIncluded: "Ce include",
    professionalQuality: "Calitate profesională",
    previous: "Anterior",
    continue: "Continuă",
    submitting: "Se trimite...",
    completeOrder: "Finalizează comanda",
    choosePackage: "Alege pachetul",
    pickDate: "Alege data",
    
    // Toast messages
    orderSuccess: "Comandă creată",
    orderSuccessMessage: "Comanda ta a fost creată cu succes. Aceasta folosește date de demonstrație.",
    orderError: "Eroare",
    orderErrorMessage: "A apărut o eroare",
    
    // Addons
    rushDelivery: "Livrare rapidă",
    commercialRights: "Drepturi comerciale",
    distributionMangoRecords: "Distribuție Mango Records",
    customVideo: "Video personalizat",
    audioMessageFromSender: "Mesaj audio de la expeditor",
    extendedSong: "Cântec extins",
  },
  en: {
    // Navigation & General
    home: "Home",
    packages: "Packages",
    howItWorks: "How It Works",
    about: "About",
    testimonials: "Testimonials",
    contact: "Contact",
    getStarted: "Get Started",
    orderNow: "Order Now",
    
    // Package names
    personalPackage: "Personal Package",
    premiumPackage: "Premium Package",
    businessPackage: "Business Package",
    artistPackage: "Artist Package",
    remixPackage: "Remix Package",
    instrumentalPackage: "Instrumental Package",
    giftPackage: "Gift Package",
    
    // Package taglines
    personalTagline: "A song written with soul – just for you",
    premiumTagline: "Complete release with global distribution",
    businessTagline: "Give your brand a memorable voice",
    artistTagline: "Launch your musical career with a top song",
    remixTagline: "Bring your song back to life in a new style",
    instrumentalTagline: "Create based on a personalized instrumental",
    giftTagline: "A musical story given as a gift",
    
    // Package descriptions
    personalDescription: "A song written with soul – just for you and your loved ones. Perfect for birthdays, weddings or special occasions – we transform your story into a unique and emotional musical gift.",
    premiumDescription: "Complete release. Expose your story to the whole world. Original music, animated DOMG video and global distribution through Mango Records channel (+100k).",
    businessDescription: "Give your brand a memorable voice. Created for companies that want an original song for branding, campaigns or ads with emotional impact.",
    artistDescription: "Launch your musical career with a top song. For dedicated artists who want an original song, complete distribution and co-ownership of rights.",
    remixDescription: "Bring your song back to life in a completely new style. For artists or creators who own the rights to the original song and want a remixed version in another genre.",
    instrumentalDescription: "Create based on an instrumental built especially for you. For artists who want to write their own song, but need a personalized and professional instrumental.",
    giftDescription: "A musical story given as a gift. Perfect for surprising someone dear – the recipient chooses the style and atmosphere of the song themselves.",
    
    // Delivery times
    personalDelivery: "3–5 days",
    premiumDelivery: "5–7 days",
    businessDelivery: "5–7 days",
    artistDelivery: "7–10 days",
    remixDelivery: "3–5 days",
    instrumentalDelivery: "3–5 days",
    giftDelivery: "Instant",
    
    // Package includes
    personalInclude1: "Original song created after your story",
    personalInclude2: "Professional voice from MusicGift team",
    personalInclude3: "Fast delivery in 3–5 days",
    personalInclude4: "Personal use rights (non-commercial)",
    personalInclude5: "Creative consultation based on story and musical preferences",
    
    premiumInclude1: "Original song with complete production",
    premiumInclude2: "Animated video (\"Do Music for Good\" style)",
    premiumInclude3: "Official digital distribution through Mango Records (+100k)",
    
    businessInclude1: "Personalized song for your business",
    businessInclude2: "Professional production and studio voice",
    businessInclude3: "Superior quality Mix & Master",
    businessInclude4: "Limited commercial license",
    
    artistInclude1: "Original song + professional instrumental",
    artistInclude2: "Vocal guide + studio voice recording",
    artistInclude3: "50/50 co-ownership of the master",
    artistInclude4: "Complete distribution through Mango Records",
    
    remixInclude1: "Complete remix in chosen style",
    remixInclude2: "Customizable label: \"Remix by Mango Records\"",
    remixInclude3: "Professional Mix & Master",
    remixInclude4: "Audio export: WAV + MP3",
    remixInclude5: "Short version for social media (optional)",
    remixInclude6: "Requires sending original song",
    
    instrumentalInclude1: "Original instrumental composed by MusicGift",
    instrumentalInclude2: "Complete arrangement: beat, harmonies, structure",
    instrumentalInclude3: "No voice – space for your interpretation",
    instrumentalInclude4: "Professional audio file (WAV or MP3)",
    instrumentalInclude5: "Limited commercial license",
    
    giftInclude1: "Digital gift card valid for any MusicGift package",
    giftInclude2: "Instant delivery via email",
    giftInclude3: "Beneficiary chooses desired package",
    
    // Tags
    newTag: "New",
    popularTag: "Popular",
    premiumTag: "Premium",
    giftTag: "Gift",
    
    // Languages
    romanianLanguage: "Romanian",
    englishLanguage: "English",
    frenchLanguage: "French",
    
    // Step titles - NEW TRANSLATIONS
    forWhomIsSongStep: "Who is the song for?",
    forWhichCompanyIsSongStep: "Which company is the song for?",
    yourContactDetailsStep: "Your contact details",
    contactAndBillingDetailsStep: "Contact and billing details",
    
    // Field placeholders - NEW TRANSLATIONS
    recipientNamePlaceholder: "Name of the person the song is for",
    recipientNamePronunciationPlaceholder: "Name pronunciation recording (if the name has an unusual pronunciation)",
    relationshipPlaceholder: "Your relationship with this person",
    companyNameForSongPlaceholder: "Name of the company the song is for",
    companyNamePronunciationPlaceholder: "Company name pronunciation recording",
    
    // Relationship options - NEW TRANSLATIONS
    relationshipPartner: "Partner",
    relationshipFamily: "Family",
    relationshipFriend: "Friend",
    relationshipColleague: "Colleague",
    relationshipOther: "Other",
    
    // Existing step titles
    choosePackageStep: "Choose package",
    personalDetailsStep: "Personal details",
    companyDetailsStep: "Company details",
    yourStoryStep: "Your story",
    brandStoryStep: "Brand and story",
    addonsStep: "Add-ons",
    distributionConfirmationStep: "Distribution confirmation",
    artisticDataStep: "Artistic data",
    songConceptStep: "Song concept",
    processAcceptanceStep: "Process acceptance",
    remixInfoStep: "Remix information",
    legalityContactStep: "Legality and contact",
    artisticDetailsStep: "Artistic details",
    visionStyleStep: "Vision and style",
    extraOptionsStep: "Extra options",
    recipientDetailsStep: "Recipient details",
    deliveryConfirmationStep: "Delivery & confirmation",
    
    // Field placeholders (existing ones)
    choosePersonalPackage: "Choose Personal Package",
    choosePremiumPackage: "Choose Premium Package",
    chooseBusinessPackage: "Choose Business Package",
    chooseArtistPackage: "Choose Artist Package",
    fullNamePlaceholder: "Full name",
    emailPlaceholder: "Email address",
    phonePlaceholder: "Phone",
    songLanguagePlaceholder: "Song language (RO / EN / FR)",
    occasionPlaceholder: "Occasion / dedication",
    pronunciationRecordingPlaceholder: "Pronunciation recording (optional)",
    storyPlaceholder: "Describe the story",
    vibePlaceholder: "Desired mood / emotion",
    youtubeLinksPlaceholder: "YouTube inspiration links",
    importantKeywordsPlaceholder: "Important keywords",
    keywordsPronunciationPlaceholder: "Keywords pronunciation (optional)",
    selectAddonsPlaceholder: "Select extra options",
    acceptMentionPlaceholder: "I accept that MusicGift.ro by Mango Records source must be mentioned if the song is posted online",
    acceptMangoDistributionPlaceholder: "I accept that the song will be distributed only through Mango Records",
    companyNamePlaceholder: "Company name",
    contactPersonPlaceholder: "Contact person",
    companyPronunciationPlaceholder: "Company pronunciation (optional)",
    brandStoryPlaceholder: "Brand story",
    keyValuesPlaceholder: "Key values and messages",
    inspirationLinksPlaceholder: "Video/musical inspiration",
    artistNamePlaceholder: "Artist name",
    mediaLinksPlaceholder: "Links to released songs",
    pressLinksPlaceholder: "Links to media appearances",
    musicalVisionPlaceholder: "What is your musical vision?",
    acceptProcessPlaceholder: "I accept that: 1. I receive song + instrumental in 7 days. 2. I send WAV voice. 3. Mango Records mixes and delivers. 4. I sign 50/50 co-production contract.",
    acceptContactPlaceholder: "I accept to be contacted in the next 24–48h by MusicGift team",
    originalSongLinkPlaceholder: "Original song link",
    uploadWAVPlaceholder: "Upload .WAV file",
    remixGenrePlaceholder: "Desired style for remix",
    ownershipConfirmationPlaceholder: "I declare that I own all rights to the original song",
    titleLanguagePlaceholder: "Title and vibe language",
    instrumentalGenrePlaceholder: "Desired musical genre",
    moodAtmospherePlaceholder: "Mood/atmosphere",
    giftRecipientNamePlaceholder: "Name of the person you're giving the gift to",
    recipientEmailPlaceholder: "Recipient's email",
    personalMessagePlaceholder: "Your message (optional)",
    senderNamePlaceholder: "Your name",
    senderEmailPlaceholder: "Your email for confirmation",
    
    // Order wizard
    loadingPackages: "Loading packages...",
    loadingSteps: "Loading steps...",
    errorLoadingSteps: "Error loading steps",
    errorLoadingStepsDesc: "Unable to load the configuration for this package. Please try again or contact support.",
    chooseAnotherPackage: "Choose another package",
    tryAgain: "Try again",
    noStepsConfigured: "No steps configured",
    noStepsConfiguredDesc: "This package doesn't have any steps configured yet. Please contact support or choose a different package.",
    selectYourPackage: "Select your package",
    selectOption: "Select an option",
    completeRequiredFields: "Please complete all required fields",
    completeRequiredFieldsDesc: "Make sure all required fields are filled out before proceeding.",
    somethingWentWrong: "Something went wrong",
    tryAgainSupport: "Please try again or contact support if the problem persists.",
    stepPackage: "Step",
    of: "of",
    progress: "Progress",
    whatsIncluded: "What's included",
    professionalQuality: "Professional quality",
    previous: "Previous",
    continue: "Continue",
    submitting: "Submitting...",
    completeOrder: "Complete order",
    choosePackage: "Choose package",
    pickDate: "Pick date",
    
    // Toast messages
    orderSuccess: "Order created",
    orderSuccessMessage: "Your order has been created successfully. This is using sample data for demonstration.",
    orderError: "Error",
    orderErrorMessage: "An error occurred",
    
    // Addons
    rushDelivery: "Rush delivery",
    commercialRights: "Commercial rights",
    distributionMangoRecords: "Mango Records distribution",
    customVideo: "Custom video",
    audioMessageFromSender: "Audio message from sender",
    extendedSong: "Extended song",
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'ro';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    const translation = translations[language as keyof typeof translations]?.[key];
    return translation || fallback || key;
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
