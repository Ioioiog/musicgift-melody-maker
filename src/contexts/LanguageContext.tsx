import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = "en" | "ro" | "fr" | "pl" | "de" | "nl";

export const languageNames: Record<Language, string> = {
  en: "English",
  ro: "Română", 
  fr: "Français",
  pl: "Polski",
  de: "Deutsch",
  nl: "Nederlands"
};

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
    
    // Hero Section
    heroTitle: "Transformă emoțiile tale în muzică",
    heroSubtitle: "Cel mai frumos cadou: o melodie creată special pentru cineva drag",
    seePackages: "Vezi pachetele",
    listenToSamples: "Ascultă mostre",
    
    // Packages Section
    chooseYourPackage: "Alege pachetul tău",
    selectPerfectPackage: "Selectează pachetul perfect care se potrivește nevoilor și bugetului tău",
    viewAllPackages: "Vezi toate pachetele",
    
    // CTA Section
    readyToCreateSpecial: "Gata să creezi ceva special?",
    helpCreatePersonalized: "Lasă-ne să te ajutăm să creezi un cadou muzical personalizat care va fi prețuit pentru totdeauna",
    
    // Loading and Error States
    loadingPackages: "Se încarcă pachetele...",
    failedToLoadPackages: "Nu s-au putut încărca pachetele. Te rugăm să încerci din nou mai târziu.",
    reload: "Reîncarcă",
    mostPopular: "Cel mai popular",
    noPackagesAvailable: "Nu sunt pachete disponibile momentan.",
    checkBackLater: "Te rugăm să verifici din nou mai târziu.",
    
    // Footer
    footerDescription: "Creăm cadouri muzicale personalizate. Transformă momentele tale speciale în melodii frumoase personalizate",
    quickLinks: "Link-uri rapide",
    contactInfo: "Informații contact",
    legal: "Legal",
    termsConditions: "Termeni și condiții",
    privacyPolicy: "Politica de confidențialitate",
    refundPolicy: "Politica de rambursare",
    cookiePolicy: "Politica cookie-urilor",
    stayUpdated: "Rămâi la curent",
    newsletterDescription: "Abonează-te pentru a primi oferte speciale, pachete noi și conținut muzical exclusiv direct în inbox",
    copyright: "© 2025 MusicGift.ro. Toate drepturile rezervate. Realizat de RED DOMAIN cu ❤️ pentru iubitorii de muzică",
    
    // Newsletter Form
    enterName: "Numele tău (opțional)",
    enterEmail: "Introdu adresa de email",
    subscribe: "Abonează-te",
    subscribing: "Se abonează...",
    subscribeDisclaimer: "Prin abonare, accepți Politica noastră de confidențialitate și consimți să primești actualizări de la compania noastră",
    
    // How It Works Page
    howItWorksTitle: "Cum funcționează",
    howItWorksSubtitle: "Procesul nostru simplu de creare a cadourilor muzicale personalizate",
    howItWorksProcessTitle: "Procesul nostru simplu",
    howItWorksProcessSubtitle: "Urmează acești pași simpli pentru a-ți crea cadoul muzical personalizat",
    
    // Steps
    step: "Pasul",
    step1Title: "Alege pachetul",
    step1Description: "Selectează pachetul care se potrivește ocaziei tale și bugetului",
    step2Title: "Spune-ne povestea",
    step2Description: "Completează formularul cu detaliile și povestea ta unică",
    step3Title: "Creăm muzica",
    step3Description: "Echipa noastră profesionistă creează cântecul tău personalizat",
    step4Title: "Primești cadoul",
    step4Description: "Îți livrăm cântecul finalizat în 3-7 zile lucrătoare",
    
    // CTA Section
    readyToStart: "Gata să începi?",
    readyToStartContent: "Începe călătoria ta muzicală astăzi și creează un cadou de neuitat",
    startYourOrder: "Începe comanda",
    
    // Package names
    personalPackage: "Pachet Personal",
    premiumPackage: "Pachet Premium",
    businessPackage: "Pachet Business",
    artistPackage: "Pachet Artist",
    remixPackage: "Pachet Remix",
    instrumentalPackage: "Pachet Instrumental",
    giftPackage: "Pachet Cadou",
    
    // Package taglines
    personalTagline: "Un cântec scris cu suflet – doar pentru tine și cei dragi",
    premiumTagline: "Lansare completă cu distribuție globală",
    businessTagline: "Dă-i brandului tău o voce memorabilă",
    artistTagline: "Lansează-ți cariera muzicală cu o piesă de top",
    remixTagline: "Redă viață piesei tale într-un stil nou",
    instrumentalTagline: "Creează pe baza unui instrumental personalizat",
    giftTagline: "O poveste muzicală oferită în dar",
    
    // Package descriptions
    personalDescription: "Ideal pentru aniversări, nunți sau ocazii speciale – transformăm povestea ta într-un cadou muzical unic și emoționant.",
    premiumDescription: "Lansare completă. Expune-ți povestea lumii întregi. Muzică originală, videoclip animat DOMG și distribuție globală prin canalul Mango Records (+100k).",
    businessDescription: "Dă-i brandului tău o voce memorabilă. Creat pentru companii care vor o piesă originală pentru branding, campanii sau reclame cu impact emoțional.",
    artistDescription: "Lansează-ți cariera muzicală cu o piesă de top. Pentru artiști dedicați care își doresc o piesă originală, distribuție completă și co-proprietate asupra drepturilor.",
    remixDescription: "Redă viață piesei tale într-un stil complet nou. Pentru artiști sau creatori care dețin drepturile asupra piesei originale și vor o versiune remixată într-un alt gen.",
    instrumentalDescription: "Creează pe baza unui instrumental construit special pentru tine. Pentru artiști care vor să-și scrie propriul cântec, dar au nevoie de un instrumental personalizat și profesionist.",
    giftDescription: "O poveste muzicală oferită în dar. Perfect pentru a surprinde pe cineva drag – destinatarul își alege singur stilul și atmosfera cântecului.",
    
    // Delivery times
    personalDelivery: "3–5 zile lucrătoare",
    premiumDelivery: "5–7 zile",
    businessDelivery: "5–7 zile",
    artistDelivery: "7–10 zile",
    remixDelivery: "3–5 zile",
    instrumentalDelivery: "3–5 zile",
    giftDelivery: "Instant",
    
    // Package includes - Updated for Personal
    personalInclude1: "Cântec original creat după povestea ta",
    personalInclude2: "Voce profesionistă din echipa MusicGift",
    personalInclude3: "Livrare digitală în 3–5 zile",
    personalInclude4: "Drepturi de utilizare personală (non-comercial)",
    
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
    
    // NEW: Personal Package Step Titles
    songStoryStep: "Povestea melodiei",
    musicalPreferencesStep: "Preferințe muzicale",
    contactDetailsStep: "Detalii contact și livrare",
    legalAcceptancesStep: "Acceptări legale",
    
    // NEW: Field Labels (just the field names)
    recipientLabel: "Cui este dedicată melodia?",
    includeNameInSongLabel: "Numele în melodie",
    pronunciationAudioLabel: "Pronunție nume",
    relationshipTextLabel: "Relația ta cu această persoană",
    storyDetailedLabel: "Povestea acestei persoane",
    keywordsLabel: "Cuvinte cheie importante",
    keywordsAudioLabel: "Pronunție cuvinte cheie",
    styleReferenceLabel: "Stilul melodiei",
    youtubeExampleLabel: "Exemplu YouTube",
    
    // NEW: Personal Package Field Placeholders (helpful text only)
    recipientPlaceholder: "ex: Maria",
    includeNameInSongPlaceholder: "Vrei ca numele persoanei să apară în melodie?",
    pronunciationAudioPlaceholder: "Înregistrează pronunția numelui dacă e atipic",
    relationshipTextPlaceholder: "ex: soție/soț, prieten, coleg, sora/frate",
    storyDetailedPlaceholder: "Ce o face specială? Care sunt momentele frumoase pe care le-ați trăit împreună? Ce calități vrei să subliniezi în melodie? Ce amintiri importante aveți?",
    keywordsPlaceholder: "nume, locuri, expresii speciale",
    keywordsAudioPlaceholder: "Înregistrează pronunția unor cuvinte cheie (opțional)",
    
    // NEW: Musical Preferences Fields
    styleReferencePlaceholder: "ex: pop, rock, ballad, rap",
    youtubeExamplePlaceholder: "Link YouTube cu exemplu de melodie în genul celei pe care o vrei",
    
    // NEW: Mood Options
    moodRomantic: "Romantic",
    moodCheerful: "Vesel",
    moodNostalgic: "Nostalgic",
    moodEnergetic: "Energetic",
    moodMelancholic: "Melancolic",
    moodInspirational: "Inspirațional",
    moodEmotional: "Emoțional",
    moodUplifting: "Încurajator",
    
    // NEW: Voice Gender Options
    voiceFeminine: "Voce feminină",
    voiceMasculine: "Voce masculină",
    voiceDuet: "Duet",
    voiceMusicGiftChoice: "Las la alegerea MusicGift",
    
    // NEW: Legal Acceptances
    termsMentionMusicGiftPlaceholder: "Accept că dacă postez public piesa, trebuie să menționez: \"Produs de MusicGift.ro by Mango Records\"",
    confirmOrderPlaceholder: "Confirm comanda și detaliile oferite",
    acceptTermsAndConditionsPlaceholder: "Accept termenii și condițiile de pe site",
    
    // NEW: Addons
    videoMessageFromSender: "Mesaj video de la tine",
    
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
    
    // Hero Section
    heroTitle: "Transform Your Emotions Into Music",
    heroSubtitle: "The most beautiful gift: a song created especially for someone dear",
    seePackages: "See Packages",
    listenToSamples: "Listen to Samples",
    
    // Packages Section
    chooseYourPackage: "Choose Your Package",
    selectPerfectPackage: "Select the perfect package that fits your needs and budget",
    viewAllPackages: "View All Packages",
    
    // CTA Section
    readyToCreateSpecial: "Ready to Create Something Special?",
    helpCreatePersonalized: "Let us help you create a personalized musical gift that will be treasured forever",
    
    // Loading and Error States
    loadingPackages: "Loading packages...",
    failedToLoadPackages: "Failed to load packages. Please try again later.",
    reload: "Reload",
    mostPopular: "Most Popular",
    noPackagesAvailable: "No packages available at the moment.",
    checkBackLater: "Please check back later.",
    
    // Footer
    footerDescription: "Creating personalized musical gifts. Transform your special moments into beautiful custom songs",
    quickLinks: "Quick Links",
    contactInfo: "Contact Info",
    legal: "Legal",
    termsConditions: "Terms & Conditions",
    privacyPolicy: "Privacy Policy",
    refundPolicy: "Refund Policy",
    cookiePolicy: "Cookie Policy",
    stayUpdated: "Stay Updated",
    newsletterDescription: "Subscribe to get special offers, new packages, and exclusive musical content delivered to your inbox",
    copyright: "© 2025 MusicGift.ro. All rights reserved. Made by RED DOMAIN with ❤️ for music lovers",
    
    // Newsletter Form
    enterName: "Your name (optional)",
    enterEmail: "Enter your email address",
    subscribe: "Subscribe",
    subscribing: "Subscribing...",
    subscribeDisclaimer: "By subscribing, you agree to our Privacy Policy and consent to receive updates from our company",
    
    // How It Works Page
    howItWorksTitle: "How It Works",
    howItWorksSubtitle: "Our simple process for creating personalized musical gifts",
    howItWorksProcessTitle: "Our Simple Process",
    howItWorksProcessSubtitle: "Follow these easy steps to create your personalized musical gift",
    
    // Steps
    step: "Step",
    step1Title: "Choose Package",
    step1Description: "Select the package that fits your occasion and budget",
    step2Title: "Tell Your Story",
    step2Description: "Fill out the form with your details and unique story",
    step3Title: "We Create Music",
    step3Description: "Our professional team creates your personalized song",
    step4Title: "Receive Your Gift",
    step4Description: "We deliver your finished song within 3-7 working days",
    
    // CTA Section
    readyToStart: "Ready to Start?",
    readyToStartContent: "Begin your musical journey today and create an unforgettable gift",
    startYourOrder: "Start Your Order",
    
    // Package names
    personalPackage: "Personal Package",
    premiumPackage: "Premium Package",
    businessPackage: "Business Package",
    artistPackage: "Artist Package",
    remixPackage: "Remix Package",
    instrumentalPackage: "Instrumental Package",
    giftPackage: "Gift Package",
    
    // Package taglines
    personalTagline: "A song written with soul – just for you and your loved ones",
    premiumTagline: "Complete release with global distribution",
    businessTagline: "Give your brand a memorable voice",
    artistTagline: "Launch your musical career with a top song",
    remixTagline: "Bring your song back to life in a new style",
    instrumentalTagline: "Create based on a personalized instrumental",
    giftTagline: "A musical story given as a gift",
    
    // Package descriptions
    personalDescription: "Perfect for birthdays, weddings or special occasions – we transform your story into a unique and emotional musical gift.",
    premiumDescription: "Complete release. Expose your story to the whole world. Original music, animated DOMG video and global distribution through Mango Records channel (+100k).",
    businessDescription: "Give your brand a memorable voice. Created for companies that want an original song for branding, campaigns or ads with emotional impact.",
    artistDescription: "Launch your musical career with a top song. For dedicated artists who want an original song, complete distribution and co-ownership of rights.",
    remixDescription: "Bring your song back to life in a completely new style. For artists or creators who own the rights to the original song and want a remixed version in another genre.",
    instrumentalDescription: "Create based on an instrumental built especially for you. For artists who want to write their own song, but need a personalized and professional instrumental.",
    giftDescription: "A musical story given as a gift. Perfect for surprising someone dear – the recipient chooses the style and atmosphere of the song themselves.",
    
    // Delivery times
    personalDelivery: "3–5 working days",
    premiumDelivery: "5–7 days",
    businessDelivery: "5–7 days",
    artistDelivery: "7–10 days",
    remixDelivery: "3–5 days",
    instrumentalDelivery: "3–5 days",
    giftDelivery: "Instant",
    
    // Package includes - Updated for Personal
    personalInclude1: "Original song created after your story",
    personalInclude2: "Professional voice from MusicGift team",
    personalInclude3: "Digital delivery in 3–5 days",
    personalInclude4: "Personal use rights (non-commercial)",
    
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
    
    // NEW: Personal Package Step Titles
    songStoryStep: "Song Story",
    musicalPreferencesStep: "Musical Preferences",
    contactDetailsStep: "Contact & Delivery Details",
    legalAcceptancesStep: "Legal Acceptances",
    
    // NEW: Field Labels (just the field names)
    recipientLabel: "Who is the song dedicated to?",
    includeNameInSongLabel: "Name in song",
    pronunciationAudioLabel: "Name pronunciation",
    relationshipTextLabel: "Your relationship with this person",
    storyDetailedLabel: "Story of this person",
    keywordsLabel: "Important keywords",
    keywordsAudioLabel: "Keywords pronunciation",
    styleReferenceLabel: "Song style",
    youtubeExampleLabel: "YouTube example",
    
    // NEW: Personal Package Field Placeholders (helpful text only)
    recipientPlaceholder: "e.g. Maria",
    includeNameInSongPlaceholder: "Do you want the person's name to appear in the song?",
    pronunciationAudioPlaceholder: "Record name pronunciation if atypical",
    relationshipTextPlaceholder: "e.g. wife/husband, friend, colleague, sister/brother",
    storyDetailedPlaceholder: "What makes them special? What beautiful moments have you lived together? What qualities do you want to highlight in the song? What important memories do you have?",
    keywordsPlaceholder: "names, places, special expressions",
    keywordsAudioPlaceholder: "Record pronunciation of some keywords (optional)",
    
    // NEW: Musical Preferences Fields
    styleReferencePlaceholder: "e.g. pop, rock, ballad, rap",
    youtubeExamplePlaceholder: "YouTube link with example song in the genre you want",
    
    // NEW: Mood Options
    moodRomantic: "Romantic",
    moodCheerful: "Cheerful",
    moodNostalgic: "Nostalgic",
    moodEnergetic: "Energetic",
    moodMelancholic: "Melancholic",
    moodInspirational: "Inspirational",
    moodEmotional: "Emotional",
    moodUplifting: "Uplifting",
    
    // NEW: Voice Gender Options
    voiceFeminine: "Female voice",
    voiceMasculine: "Male voice",
    voiceDuet: "Duet",
    voiceMusicGiftChoice: "Let MusicGift choose",
    
    // NEW: Legal Acceptances
    termsMentionMusicGiftPlaceholder: "I accept that if I post the song publicly, I must mention: \"Produced by MusicGift.ro by Mango Records\"",
    confirmOrderPlaceholder: "I confirm the order and details provided",
    acceptTermsAndConditionsPlaceholder: "I accept the terms and conditions from the website",
    
    // NEW: Addons
    videoMessageFromSender: "Video message from you",
    
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
    acceptProcessPlaceholder: "I accept that: 1. I receive song + instrumental in 7 days. 2. I send WAV voice. 3. Mango Records mixes and delivers. 4. I sign a 50/50 co-production contract.",
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
    professionalQuality: "Professional Quality",
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
  },
  fr: {
    // Navigation & General
    home: "Accueil",
    packages: "Forfaits",
    howItWorks: "Comment ça marche",
    about: "À propos",
    testimonials: "Témoignages",
    contact: "Contact",
    getStarted: "Commencer",
    orderNow: "Commander maintenant",
    
    // Hero Section
    heroTitle: "Transformez vos émotions en musique",
    heroSubtitle: "Le plus beau cadeau : une chanson créée spécialement pour quelqu'un de cher",
    seePackages: "Voir les forfaits",
    listenToSamples: "Écouter les échantillons",
    
    // Packages Section
    chooseYourPackage: "Choisissez votre forfait",
    selectPerfectPackage: "Sélectionnez le forfait parfait qui correspond à vos besoins et votre budget",
    viewAllPackages: "Voir tous les forfaits",
    
    // CTA Section
    readyToCreateSpecial: "Prêt à créer quelque chose de spécial ?",
    helpCreatePersonalized: "Laissez-nous vous aider à créer un cadeau musical personnalisé qui sera chéri pour toujours",
    
    // Loading and Error States
    loadingPackages: "Chargement des forfaits...",
    failedToLoadPackages: "Échec du chargement des forfaits. Veuillez réessayer plus tard.",
    reload: "Recharger",
    mostPopular: "Le plus populaire",
    noPackagesAvailable: "Aucun forfait disponible pour le moment.",
    checkBackLater: "Veuillez revenir plus tard.",
    
    // Footer
    footerDescription: "Création de cadeaux musicaux personnalisés. Transformez vos moments spéciaux en belles chansons personnalisées",
    quickLinks: "Liens rapides",
    contactInfo: "Informations de contact",
    legal: "Légal",
    termsConditions: "Conditions générales",
    privacyPolicy: "Politique de confidentialité",
    refundPolicy: "Politique de remboursement",
    cookiePolicy: "Politique des cookies",
    stayUpdated: "Restez informé",
    newsletterDescription: "Abonnez-vous pour recevoir des offres spéciales, de nouveaux forfaits et du contenu musical exclusif dans votre boîte de réception",
    copyright: "© 2025 MusicGift.ro. Tous droits réservés. Créé par RED DOMAIN avec ❤️ pour les amoureux de la musique",
    
    // Newsletter Form
    enterName: "Votre nom (optionnel)",
    enterEmail: "Entrez votre adresse e-mail",
    subscribe: "S'abonner",
    subscribing: "Abonnement en cours...",
    subscribeDisclaimer: "En vous abonnant, vous acceptez notre politique de confidentialité et consentez à recevoir des mises à jour de notre entreprise",
    
    // How It Works Page
    howItWorksTitle: "Comment ça marche",
    howItWorksSubtitle: "Notre processus simple pour créer des cadeaux musicaux personnalisés",
    howItWorksProcessTitle: "Notre processus simple",
    howItWorksProcessSubtitle: "Suivez ces étapes simples pour créer votre cadeau musical personnalisé",
    
    // Steps
    step: "Étape",
    step1Title: "Choisir le forfait",
    step1Description: "Sélectionnez le forfait qui correspond à votre occasion et votre budget",
    step2Title: "Racontez votre histoire",
    step2Description: "Remplissez le formulaire avec vos détails et votre histoire unique",
    step3Title: "Nous créons la musique",
    step3Description: "Notre équipe professionnelle crée votre chanson personnalisée",
    step4Title: "Recevez votre cadeau",
    step4Description: "Nous livrons votre chanson terminée dans 3-7 jours ouvrables",
    
    // CTA Section
    readyToStart: "Prêt à commencer ?",
    readyToStartContent: "Commencez votre voyage musical aujourd'hui et créez un cadeau inoubliable",
    startYourOrder: "Commencer votre commande",
    
    // Package names
    personalPackage: "Forfait Personnel",
    premiumPackage: "Forfait Premium",
    businessPackage: "Forfait Entreprise",
    artistPackage: "Forfait Artiste",
    remixPackage: "Forfait Remix",
    instrumentalPackage: "Forfait Instrumental",
    giftPackage: "Forfait Cadeau",
    
    // Package taglines
    personalTagline: "Une chanson écrite avec âme – juste pour vous et vos proches",
    premiumTagline: "Version complète avec distribution mondiale",
    businessTagline: "Donnez à votre marque une voix mémorable",
    artistTagline: "Lancez votre carrière musicale avec une chanson de qualité",
    remixTagline: "Redonnez vie à votre chanson dans un nouveau style",
    instrumentalTagline: "Créez basé sur un instrumental personnalisé",
    giftTagline: "Une histoire musicale offerte en cadeau",
    
    // Package descriptions
    personalDescription: "Parfait pour les anniversaires, mariages ou occasions spéciales – nous transformons votre histoire en un cadeau musical unique et émouvant.",
    premiumDescription: "Version complète. Exposez votre histoire au monde entier. Musique originale, vidéo animée DOMG et distribution mondiale via le canal Mango Records (+100k).",
    businessDescription: "Donnez à votre marque une voix mémorable. Créé pour les entreprises qui veulent une chanson originale pour le branding, les campagnes ou les publicités avec impact émotionnel.",
    artistDescription: "Lancez votre carrière musicale avec une chanson de qualité. Pour les artistes dédiés qui veulent une chanson originale, une distribution complète et la co-propriété des droits.",
    remixDescription: "Redonnez vie à votre chanson dans un style complètement nouveau. Pour les artistes ou créateurs qui possèdent les droits de la chanson originale et veulent une version remixée dans un autre genre.",
    instrumentalDescription: "Créez basé sur un instrumental construit spécialement pour vous. Pour les artistes qui veulent écrire leur propre chanson, mais ont besoin d'un instrumental personnalisé et professionnel.",
    giftDescription: "Une histoire musicale offerte en cadeau. Parfait pour surprendre quelqu'un de cher – le destinataire choisit lui-même le style et l'atmosphère de la chanson.",
    
    // Delivery times
    personalDelivery: "3–5 jours ouvrables",
    premiumDelivery: "5–7 jours",
    businessDelivery: "5–7 jours",
    artistDelivery: "7–10 jours",
    remixDelivery: "3–5 jours",
    instrumentalDelivery: "3–5 jours",
    giftDelivery: "Instantané",
    
    // Package includes
    personalInclude1: "Chanson originale créée d'après votre histoire",
    personalInclude2: "Voix professionnelle de l'équipe MusicGift",
    personalInclude3: "Livraison numérique en 3–5 jours",
    personalInclude4: "Droits d'usage personnel (non-commercial)",
    
    premiumInclude1: "Chanson originale avec production complète",
    premiumInclude2: "Vidéo animée (style \"Do Music for Good\")",
    premiumInclude3: "Distribution numérique officielle via Mango Records (+100k)",
    
    businessInclude1: "Chanson personnalisée pour votre entreprise",
    businessInclude2: "Production professionnelle et voix de studio",
    businessInclude3: "Mix & Master de qualité supérieure",
    businessInclude4: "Licence commerciale limitée",
    
    artistInclude1: "Chanson originale + instrumental professionnel",
    artistInclude2: "Guide vocal + enregistrement avec voix de studio",
    artistInclude3: "Co-propriété 50/50 master",
    artistInclude4: "Distribution complète via Mango Records",
    
    remixInclude1: "Remix complet dans le style choisi",
    remixInclude2: "Étiquette personnalisable : \"Remix by Mango Records\"",
    remixInclude3: "Mix & Master professionnel",
    remixInclude4: "Export audio : WAV + MP3",
    remixInclude5: "Version courte pour les réseaux sociaux (optionnel)",
    remixInclude6: "Nécessite l'envoi de la chanson originale",
    
    instrumentalInclude1: "Instrumental original composé par MusicGift",
    instrumentalInclude2: "Arrangement complet : beat, harmonies, structure",
    instrumentalInclude3: "Sans voix – espace pour votre interprétation",
    instrumentalInclude4: "Fichier audio professionnel (WAV ou MP3)",
    instrumentalInclude5: "Licence commerciale limitée",
    
    giftInclude1: "Carte cadeau numérique valable pour tout forfait MusicGift",
    giftInclude2: "Livraison instantanée par e-mail",
    giftInclude3: "Le bénéficiaire choisit le forfait désiré",
    
    // Tags
    newTag: "Nouveau",
    popularTag: "Populaire",
    premiumTag: "Premium",
    giftTag: "Cadeau",
    
    // Languages
    romanianLanguage: "Roumain",
    englishLanguage: "Anglais",
    frenchLanguage: "Français",
    
    // Personal Package Step Titles
    songStoryStep: "Histoire de la chanson",
    musicalPreferencesStep: "Préférences musicales",
    contactDetailsStep: "Détails de contact et livraison",
    legalAcceptancesStep: "Acceptations légales",
    
    // Field Labels
    recipientLabel: "À qui la chanson est-elle dédiée ?",
    includeNameInSongLabel: "Imię w piosence",
    pronunciationAudioLabel: "Wymowa imienia",
    relationshipTextLabel: "Twoja relacja z tą osobą",
    storyDetailedLabel: "Historia tej osoby",
    keywordsLabel: "Ważne słowa kluczowe",
    keywordsAudioLabel: "Wymowa słów kluczowych",
    styleReferenceLabel: "Styl piosenki",
    youtubeExampleLabel: "Przykład YouTube",
    
    // Personal Package Field Placeholders
    recipientPlaceholder: "np. Maria",
    includeNameInSongPlaceholder: "Czy chcesz, żeby imię osoby pojawiło się w piosence?",
    pronunciationAudioPlaceholder: "Nagraj wymowę imienia, jeśli jest nietypowa",
    relationshipTextPlaceholder: "np. żona/mąż, przyjaciel, kolega, siostra/brat",
    storyDetailedPlaceholder: "Co czyni ją wyjątkową? Jakie piękne chwile przeżyliście razem? Jakie cechy chcesz podkreślić w piosence? Jakie ważne wspomnienia macie?",
    keywordsPlaceholder: "imiona, miejsca, specjalne wyrażenia",
    keywordsAudioPlaceholder: "Nagraj wymowę niektórych słów kluczowych (opcjonalne)",
    
    // Musical Preferences Fields
    styleReferencePlaceholder: "np. pop, rock, ballada, rap",
    youtubeExamplePlaceholder: "Link YouTube z przykładem piosenki w gatunku, który chcesz",
    
    // Mood Options
    moodRomantic: "Romantyczny",
    moodCheerful: "Radosny",
    moodNostalgic: "Nostalgiczny",
    moodEnergetic: "Energiek",
    moodMelancholic: "Melancholijny",
    moodInspirational: "Inspirujący",
    moodEmotional: "Emocjonalny",
    moodUplifting: "Podnoszący na duchu",
    
    // Voice Gender Options
    voiceFeminine: "Głos kobiecy",
    voiceMasculine: "Głos męski",
    voiceDuet: "Duet",
    voiceMusicGiftChoice: "Pozwól wybrać MusicGift",
    
    // Legal Acceptances
    termsMentionMusicGiftPlaceholder: "Akceptuję, że jeśli opublikuję piosenkę publicznie, muszę wspomnieć: \"Wyprodukowane przez MusicGift.ro by Mango Records\"",
    confirmOrderPlaceholder: "Potwierdzam zamówienie i podane szczegóły",
    acceptTermsAndConditionsPlaceholder: "Akceptuję regulamin strony internetowej",
    
    // Addons
    videoMessageFromSender: "Wiadomość wideo od Ciebie",
    
    // Step titles
    forWhomIsSongStep: "Dla kogo jest piosenka?",
    forWhichCompanyIsSongStep: "Dla jakiej firmy jest piosenka?",
    yourContactDetailsStep: "Twoje dane kontaktowe",
    contactAndBillingDetailsStep: "Dane kontaktowe i rozliczeniowe",
    
    // Field placeholders
    recipientNamePlaceholder: "Imię osoby, dla której jest piosenka",
    recipientNamePronunciationPlaceholder: "Nagranie wymowy imienia (jeśli imię ma nietypową wymowę)",
    relationshipPlaceholder: "Twoja relacja z tą osobą",
    companyNameForSongPlaceholder: "Nazwa firmy, dla której jest piosenka",
    companyNamePronunciationPlaceholder: "Nagranie wymowy nazwy firmy",
    
    // Relationship options
    relationshipPartner: "Partner",
    relationshipFamily: "Rodzina",
    relationshipFriend: "Przyjaciel",
    relationshipColleague: "Kolega",
    relationshipOther: "Inne",
    
    // Existing step titles
    choosePackageStep: "Wybierz pakiet",
    personalDetailsStep: "Szczegóły osobiste",
    companyDetailsStep: "Szczegóły firmy",
    yourStoryStep: "Twoja historia",
    brandStoryStep: "Marka i historia",
    addonsStep: "Dodatki",
    distributionConfirmationStep: "Potwierdzenie dystrybucji",
    artisticDataStep: "Dane artystyczne",
    songConceptStep: "Koncepcja piosenki",
    processAcceptanceStep: "Akceptacja procesu",
    remixInfoStep: "Informacje o remiksie",
    legalityContactStep: "Legalność i kontakt",
    artisticDetailsStep: "Szczegóły artystyczne",
    visionStyleStep: "Wizja i styl",
    extraOptionsStep: "Dodatkowe opcje",
    recipientDetailsStep: "Szczegóły odbiorcy",
    deliveryConfirmationStep: "Dostawa i potwierdzenie",
    
    // Field placeholders (existing ones)
    choosePersonalPackage: "Wybierz Pakiet Osobisty",
    choosePremiumPackage: "Wybierz Pakiet Premium",
    chooseBusinessPackage: "Wybierz Pakiet Biznesowy",
    chooseArtistPackage: "Wybierz Pakiet Artysty",
    fullNamePlaceholder: "Pełne imię i nazwisko",
    emailPlaceholder: "Adres e-mail",
    phonePlaceholder: "Telefon",
    songLanguagePlaceholder: "Język piosenki (RO / EN / FR)",
    occasionPlaceholder: "Okazja / dedykacja",
    pronunciationRecordingPlaceholder: "Nagranie wymowy (opcjonalne)",
    storyPlaceholder: "Opisz historię",
    vibePlaceholder: "Pożądany nastrój / emocja",
    youtubeLinksPlaceholder: "Linki YouTube inspiracji",
    importantKeywordsPlaceholder: "Ważne słowa kluczowe",
    keywordsPronunciationPlaceholder: "Wymowa słów kluczowych (opcjonalne)",
    selectAddonsPlaceholder: "Wybierz dodatkowe opcje",
    acceptMentionPlaceholder: "Akceptuję, że źródło MusicGift.ro by Mango Records musi być wymienione, jeśli piosenka zostanie opublikowana online",
    acceptMangoDistributionPlaceholder: "Akceptuję, że piosenka będzie dystrybuowana tylko przez Mango Records",
    companyNamePlaceholder: "Nazwa firmy",
    contactPersonPlaceholder: "Osoba kontaktowa",
    companyPronunciationPlaceholder: "Wymowa firmy (opcjonalne)",
    brandStoryPlaceholder: "Historia marki",
    keyValuesPlaceholder: "Kluczowe wartości i komunikaty",
    inspirationLinksPlaceholder: "Inspiracja wideo/muzyczna",
    artistNamePlaceholder: "Nazwa artysty",
    mediaLinksPlaceholder: "Linki do wydanych piosenek",
    pressLinksPlaceholder: "Linki do wystąpień medialnych",
    musicalVisionPlaceholder: "Jaka jest Twoja wizja muzyczna?",
    acceptProcessPlaceholder: "Akceptuję, że: 1. Otrzymuję piosenkę + instrumental w 7 dni. 2. Wysyłam głos WAV. 3. Mango Records miksuje i dostarcza. 4. Podpisuję kontrakt koprodukcji 50/50.",
    acceptContactPlaceholder: "Akceptuję kontakt w ciągu najbliższych 24-48h przez zespół MusicGift",
    originalSongLinkPlaceholder: "Link do oryginalnej piosenki",
    uploadWAVPlaceholder: "Prześlij plik .WAV",
    remixGenrePlaceholder: "Pożądany styl dla remiksu",
    ownershipConfirmationPlaceholder: "Oświadczam, że posiadam wszystkie prawa do oryginalnej piosenki",
    titleLanguagePlaceholder: "Język tytułu i klimatu",
    instrumentalGenrePlaceholder: "Pożądany gatunek muzyczny",
    moodAtmospherePlaceholder: "Nastrój/atmosfera",
    giftRecipientNamePlaceholder: "Imię osoby, której dajesz prezent",
    recipientEmailPlaceholder: "E-mail odbiorcy",
    personalMessagePlaceholder: "Twoja wiadomość (opcjonalna)",
    senderNamePlaceholder: "Twoje imię",
    senderEmailPlaceholder: "Twój e-mail do potwierdzenia",
    
    // Order wizard
    loadingSteps: "Ładowanie kroków...",
    errorLoadingSteps: "Błąd ładowania kroków",
    errorLoadingStepsDesc: "Nie można załadować konfiguracji dla tego pakietu. Spróbuj ponownie lub skontaktuj się z pomocą techniczną.",
    chooseAnotherPackage: "Wybierz inny pakiet",
    tryAgain: "Spróbuj ponownie",
    noStepsConfigured: "Brak skonfigurowanych kroków",
    noStepsConfiguredDesc: "Ten pakiet nie ma jeszcze skonfigurowanych kroków. Skontaktuj się z pomocą techniczną lub wybierz inny pakiet.",
    selectYourPackage: "Wybierz swój pakiet",
    selectOption: "Wybierz opcję",
    completeRequiredFields: "Wypełnij wszystkie wymagane pola",
    completeRequiredFieldsDesc: "Upewnij się, że wszystkie wymagane pola są wypełnione przed kontynuowaniem.",
    somethingWentWrong: "Coś poszło nie tak",
    tryAgainSupport: "Spróbuj ponownie lub skontaktuj się z pomocą techniczną, jeśli problem będzie się powtarzał.",
    stepPackage: "Krok",
    of: "z",
    progress: "Postęp",
    whatsIncluded: "Co zawiera",
    professionalQuality: "Profesjonalna jakość",
    previous: "Poprzedni",
    continue: "Kontynuuj",
    submitting: "Wysyłanie...",
    completeOrder: "Sfinalizuj zamówienie",
    choosePackage: "Wybierz pakiet",
    pickDate: "Wybierz datę",
    
    // Toast messages
    orderSuccess: "Zamówienie utworzone",
    orderSuccessMessage: "Twoje zamówienie zostało pomyślnie utworzone. To używa przykładowych danych do demonstracji.",
    orderError: "Błąd",
    orderErrorMessage: "Wystąpił błąd",
    
    // Addons
    rushDelivery: "Ekspresowa dostawa",
    commercialRights: "Prawa komercyjne",
    distributionMangoRecords: "Dystrybucja Mango Records",
    customVideo: "Niestandardowe wideo",
    audioMessageFromSender: "Wiadomość audio od nadawcy",
    extendedSong: "Rozszerzona piosenka",
  },
  pl: {
    // Navigation & General
    home: "Strona główna",
    packages: "Pakiety",
    howItWorks: "Jak to działa",
    about: "O nas",
    testimonials: "Opinie",
    contact: "Kontakt",
    getStarted: "Zacznij teraz",
    orderNow: "Zamów teraz",
    
    // Hero Section
    heroTitle: "Zamień swoje emocje w muzykę",
    heroSubtitle: "Najpiękniejszy prezent: piosenka stworzona specjalnie dla kogoś bliskiego",
    seePackages: "Bekijk pakketten",
    listenToSamples: "Luister naar voorbeelden",
    
    // Packages Section
    chooseYourPackage: "Kies je pakket",
    selectPerfectPackage: "Selecteer het perfecte pakket dat past bij jouw behoeften en budget",
    viewAllPackages: "Bekijk alle pakketten",
    
    // CTA Section
    readyToCreateSpecial: "Klaar om iets speciaals te creëren?",
    helpCreatePersonalized: "Laat ons je helpen een gepersonaliseerd muzikaal cadeau te maken dat voor altijd gekoesterd zal worden",
    
    // Loading and Error States
    loadingPackages: "Pakketten laden...",
    failedToLoadPackages: "Kon pakketten niet laden. Probeer het later opnieuw.",
    reload: "Herladen",
    mostPopular: "Meest populair",
    noPackagesAvailable: "Geen pakketten beschikbaar op dit moment.",
    checkBackLater: "Kom later terug.",
    
    // Footer
    footerDescription: "Gepersonaliseerde muzikale cadeaus maken. Transformeer je speciale momenten in prachtige aangepaste liedjes",
    quickLinks: "Snelle links",
    contactInfo: "Contactinfo",
    legal: "Juridisch",
    termsConditions: "Algemene voorwaarden",
    privacyPolicy: "Privacybeleid",
    refundPolicy: "Terugbetalingsbeleid",
    cookiePolicy: "Cookiebeleid",
    stayUpdated: "Blijf op de hoogte",
    newsletterDescription: "Abonneer je om speciale aanbiedingen, nieuwe pakketten en exclusieve muzikale content in je inbox te ontvangen",
    copyright: "© 2025 MusicGift.ro. Alle rechten voorbehouden. Gemaakt door RED DOMAIN met ❤️ voor muziekliefhebbers",
    
    // Newsletter Form
    enterName: "Je naam (optioneel)",
    enterEmail: "Voer je e-mailadres in",
    subscribe: "Abonneren",
    subscribing: "Aan het abonneren...",
    subscribeDisclaimer: "Door je te abonneren, ga je akkoord met ons Privacybeleid en stem je in met het ontvangen van updates van ons bedrijf",
    
    // How It Works Page
    howItWorksTitle: "Hoe het werkt",
    howItWorksSubtitle: "Ons eenvoudige proces voor het maken van gepersonaliseerde muzikale cadeaus",
    howItWorksProcessTitle: "Ons eenvoudige proces",
    howItWorksProcessSubtitle: "Volg deze eenvoudige stappen om je gepersonaliseerde muzikale cadeau te maken",
    
    // Steps
    step: "Stap",
    step1Title: "Kies pakket",
    step1Description: "Selecteer het pakket dat past bij je gelegenheid en budget",
    step2Title: "Vertel je verhaal",
    step2Description: "Vul het formulier in met je details en unieke verhaal",
    step3Title: "Wij maken muziek",
    step3Description: "Ons professionele team maakt je gepersonaliseerde lied",
    step4Title: "Ontvang je cadeau",
    step4Description: "We leveren je voltooide lied binnen 3-7 werkdagen",
    
    // CTA Section
    readyToStart: "Klaar om te beginnen?",
    readyToStartContent: "Begin vandaag je muzikale reis en maak een onvergetelijk cadeau",
    startYourOrder: "Start je bestelling",
    
    // Package names
    personalPackage: "Persoonlijk Pakket",
    premiumPackage: "Premium Pakket",
    businessPackage: "Business Pakket",
    artistPackage: "Artiest Pakket",
    remixPackage: "Remix Pakket",
    instrumentalPackage: "Instrumentaal Pakket",
    giftPackage: "Cadeau Pakket",
    
    // Package taglines
    personalTagline: "Een lied geschreven met ziel – alleen voor jou en je dierbaren",
    premiumTagline: "Volledige release met wereldwijde distributie",
    businessTagline: "Geef je merk een gedenkwaardige stem",
    artistTagline: "Start je muzikale carrière met een toplied",
    remixTagline: "Breng je lied terug tot leven in een nieuwe stijl",
    instrumentalTagline: "Creëer gebaseerd op een gepersonaliseerde instrumental",
    giftTagline: "Een muzikaal verhaal gegeven als cadeau",
    
    // Package descriptions
    personalDescription: "Perfect voor verjaardagen, bruiloften of speciale gelegenheden – we transformeren je verhaal in een uniek en emotioneel muzikaal cadeau.",
    premiumDescription: "Volledige release. Toon je verhaal aan de hele wereld. Originele muziek, geanimeerde DOMG video en wereldwijde distributie via Mango Records kanaal (+100k).",
    businessDescription: "Geef je merk een gedenkwaardige stem. Gemaakt voor bedrijven die een origineel lied willen voor branding, campagnes of advertenties met emotionele impact.",
    artistDescription: "Start je muzikale carrière met een toplied. Voor toegewijde artiesten die een origineel lied willen, volledige distributie en mede-eigendom van rechten.",
    remixDescription: "Breng je lied terug tot leven in een compleet nieuwe stijl. Voor artiesten of makers die de rechten bezitten van het originele lied en een geremixte versie willen in een ander genre.",
    instrumentalDescription: "Creëer gebaseerd op een instrumental speciaal voor jou gebouwd. Voor artiesten die hun eigen lied willen schrijven, maar een gepersonaliseerde en professionele instrumental nodig hebben.",
    giftDescription: "Een muzikaal verhaal gegeven als cadeau. Perfect om iemand dierbaar te verrassen – de ontvanger kiest zelf de stijl en sfeer van het lied.",
    
    // Delivery times
    personalDelivery: "3–5 werkdagen",
    premiumDelivery: "5–7 dagen",
    businessDelivery: "5–7 dagen",
    artistDelivery: "7–10 dagen",
    remixDelivery: "3–5 dagen",
    instrumentalDelivery: "3–5 dagen",
    giftDelivery: "Direct",
    
    // Package includes
    personalInclude1: "Origineel lied gemaakt naar je verhaal",
    personalInclude2: "Professionele stem van het MusicGift team",
    personalInclude3: "Digitale levering in 3–5 dagen",
    personalInclude4: "Persoonlijke gebruiksrechten (niet-commercieel)",
    
    premiumInclude1: "Origineel lied met volledige productie",
    premiumInclude2: "Geanimeerde video (\"Do Music for Good\" stijl)",
    premiumInclude3: "Officiële digitale distributie via Mango Records (+100k)",
    
    businessInclude1: "Gepersonaliseerd lied voor je bedrijf",
    businessInclude2: "Professionele productie en studiostem",
    businessInclude3: "Superieure kwaliteit Mix & Master",
    businessInclude4: "Beperkte commerciële licentie",
    
    artistInclude1: "Origineel lied + professionele instrumental",
    artistInclude2: "Vocale gids + studio stem opname",
    artistInclude3: "50/50 mede-eigendom van de master",
    artistInclude4: "Volledige distributie via Mango Records",
    
    remixInclude1: "Volledige remix in gekozen stijl",
    remixInclude2: "Aanpasbaar label: \"Remix by Mango Records\"",
    remixInclude3: "Professionele Mix & Master",
    remixInclude4: "Audio export: WAV + MP3",
    remixInclude5: "Korte versie voor sociale media (optioneel)",
    remixInclude6: "Vereist het versturen van het originele lied",
    
    instrumentalInclude1: "Originele instrumental gecomponeerd door MusicGift",
    instrumentalInclude2: "Volledig arrangement: beat, harmonieën, structuur",
    instrumentalInclude3: "Geen stem – ruimte voor je interpretatie",
    instrumentalInclude4: "Professioneel audiobestand (WAV of MP3)",
    instrumentalInclude5: "Beperkte commerciële licentie",
    
    giftInclude1: "Digitale cadeaubon geldig voor elk MusicGift pakket",
    giftInclude2: "Directe levering via e-mail",
    giftInclude3: "Begunstigde kiest gewenst pakket",
    
    // Tags
    newTag: "Nieuw",
    popularTag: "Populair",
    premiumTag: "Premium",
    giftTag: "Cadeau",
    
    // Languages
    romanianLanguage: "Roemeens",
    englishLanguage: "Engels",
    frenchLanguage: "Frans",
    
    // Personal Package Step Titles
    songStoryStep: "Liedverhaal",
    musicalPreferencesStep: "Muzikale voorkeuren",
    contactDetailsStep: "Contact- en leveringsgegevens",
    legalAcceptancesStep: "Juridische acceptaties",
    
    // Field Labels
    recipientLabel: "Aan wie is het lied opgedragen?",
    includeNameInSongLabel: "Naam in lied",
    pronunciationAudioLabel: "Naamuitspraak",
    relationshipTextLabel: "Je relatie met deze persoon",
    storyDetailedLabel: "Verhaal van deze persoon",
    keywordsLabel: "Belangrijke trefwoorden",
    keywordsAudioLabel: "Uitspraak trefwoorden",
    styleReferenceLabel: "Liedstijl",
    youtubeExampleLabel: "YouTube voorbeeld",
    
    // Personal Package Field Placeholders
    recipientPlaceholder: "bijv. Maria",
    includeNameInSongPlaceholder: "Wil je dat de naam van de persoon in het lied voorkomt?",
    pronunciationAudioPlaceholder: "Neem de naamuitspraak op als deze atypisch is",
    relationshipTextPlaceholder: "bijv. vrouw/man, vriend, collega, zus/broer",
    storyDetailedPlaceholder: "Wat maakt haar speciaal? Welke mooie momenten hebben jullie samen beleefd? Welke kwaliteiten wil je benadrukken in het lied? Welke belangrijke herinneringen hebben jullie?",
    keywordsPlaceholder: "namen, plaatsen, speciale uitdrukkingen",
    keywordsAudioPlaceholder: "Neem de uitspraak van enkele trefwoorden op (optioneel)",
    
    // Musical Preferences Fields
    styleReferencePlaceholder: "bijv. pop, rock, ballad, rap",
    youtubeExamplePlaceholder: "YouTube link met voorbeeldlied in het genre dat je wilt",
    
    // Mood Options
    moodRomantic: "Romantisch",
    moodCheerful: "Vrolijk",
    moodNostalgic: "Nostalgisch",
    moodEnergetic: "Energiek",
    moodMelancholic: "Melancholisch",
    moodInspirational: "Inspirerend",
    moodEmotional: "Emotioneel",
    moodUplifting: "Opbeurend",
    
    // Voice Gender Options
    voiceFeminine: "Vrouwelijke stem",
    voiceMasculine: "Mannelijke stem",
    voiceDuet: "Duet",
    voiceMusicGiftChoice: "Laat MusicGift kiezen",
    
    // Legal Acceptances
    termsMentionMusicGiftPlaceholder: "Ik accepteer dat als ik het lied publiekelijk post, ik moet vermelden: \"Geproduceerd door MusicGift.ro by Mango Records\"",
    confirmOrderPlaceholder: "Ik bevestig de bestelling en verstrekte details",
    acceptTermsAndConditionsPlaceholder: "Ik accepteer de algemene voorwaarden van de website",
    
    // Addons
    videoMessageFromSender: "Videoboodschap van jou",
    
    // Step titles
    forWhomIsSongStep: "Voor wie is het lied?",
    forWhichCompanyIsSongStep: "Voor welk bedrijf is het lied?",
    yourContactDetailsStep: "Je contactgegevens",
    contactAndBillingDetailsStep: "Contact- en factureringsgegevens",
    
    // Field placeholders
    recipientNamePlaceholder: "Naam van de persoon voor wie het lied is",
    recipientNamePronunciationPlaceholder: "Naamuitspraak opname (als de naam een ongewone uitspraak heeft)",
    relationshipPlaceholder: "Je relatie met deze persoon",
    companyNameForSongPlaceholder: "Naam van het bedrijf voor wie het lied is",
    companyNamePronunciationPlaceholder: "Bedrijfsnaam uitspraak opname",
    
    // Relationship options
    relationshipPartner: "Partner",
    relationshipFamily: "Familie",
    relationshipFriend: "Vriend",
    relationshipColleague: "Collega",
    relationshipOther: "Anders",
    
    // Existing step titles
    choosePackageStep: "Kies pakket",
    personalDetailsStep: "Persoonlijke gegevens",
    companyDetailsStep: "Bedrijfsgegevens",
    yourStoryStep: "Je verhaal",
    brandStoryStep: "Merk en verhaal",
    addonsStep: "Add-ons",
    distributionConfirmationStep: "Distributiebevestiging",
    artisticDataStep: "Artistieke gegevens",
    songConceptStep: "Liedconcept",
    processAcceptanceStep: "Procesacceptatie",
    remixInfoStep: "Remix informatie",
    legalityContactStep: "Legaliteit en contact",
    artisticDetailsStep: "Artistieke details",
    visionStyleStep: "Visie en stijl",
    extraOptionsStep: "Extra opties",
    recipientDetailsStep: "Ontvanger details",
    deliveryConfirmationStep: "Levering & bevestiging",
    
    // Field placeholders (existing ones)
    choosePersonalPackage: "Kies Persoonlijk Pakket",
    choosePremiumPackage: "Kies Premium Pakket",
    chooseBusinessPackage: "Kies Business Pakket",
    chooseArtistPackage: "Kies Artiest Pakket",
    fullNamePlaceholder: "Volledige naam",
    emailPlaceholder: "E-mailadres",
    phonePlaceholder: "Telefoon",
    songLanguagePlaceholder: "Liedtaal (RO / EN / FR)",
    occasionPlaceholder: "Gelegenheid / toewijding",
    pronunciationRecordingPlaceholder: "Uitspraak opname (optioneel)",
    storyPlaceholder: "Beschrijf het verhaal",
    vibePlaceholder: "Gewenste stemming / emotie",
    youtubeLinksPlaceholder: "YouTube inspiratie links",
    importantKeywordsPlaceholder: "Belangrijke trefwoorden",
    keywordsPronunciationPlaceholder: "Trefwoorden uitspraak (optioneel)",
    selectAddonsPlaceholder: "Selecteer extra opties",
    acceptMentionPlaceholder: "Ik accepteer dat MusicGift.ro by Mango Records bron vermeld moet worden als het lied online wordt gepost",
    acceptMangoDistributionPlaceholder: "Ik accepteer dat het lied alleen via Mango Records gedistribueerd wordt",
    companyNamePlaceholder: "Bedrijfsnaam",
    contactPersonPlaceholder: "Contactpersoon",
    companyPronunciationPlaceholder: "Bedrijfsuitspraak (optioneel)",
    brandStoryPlaceholder: "Merkverhaal",
    keyValuesPlaceholder: "Kernwaarden en berichten",
    inspirationLinksPlaceholder: "Video/muzikale inspiratie",
    artistNamePlaceholder: "Artiestnaam",
    mediaLinksPlaceholder: "Links naar uitgebrachte liedjes",
    pressLinksPlaceholder: "Links naar media-optredens",
    musicalVisionPlaceholder: "Wat is je muzikale visie?",
    acceptProcessPlaceholder: "Ik accepteer dat: 1. Ik ontvang lied + instrumental in 7 dagen. 2. Ik stuur WAV stem. 3. Mango Records mixt en levert. 4. Ik teken 50/50 co-productie contract.",
    acceptContactPlaceholder: "Ik accepteer contact binnen de komende 24-48u door het MusicGift team",
    originalSongLinkPlaceholder: "Origineel lied link",
    uploadWAVPlaceholder: "Upload .WAV bestand",
    remixGenrePlaceholder: "Gewenste stijl voor remix",
    ownershipConfirmationPlaceholder: "Ik verklaar dat ik alle rechten bezit van het originele lied",
    titleLanguagePlaceholder: "Titel en sfeer taal",
    instrumentalGenrePlaceholder: "Gewenst muziekgenre",
    moodAtmospherePlaceholder: "Stemming/atmosfeer",
    giftRecipientNamePlaceholder: "Naam van de persoon aan wie je het cadeau geeft",
    recipientEmailPlaceholder: "E-mail van ontvanger",
    personalMessagePlaceholder: "Je bericht (optioneel)",
    senderNamePlaceholder: "Je naam",
    senderEmailPlaceholder: "Je e-mail voor bevestiging",
    
    // Order wizard
    loadingSteps: "Stappen laden...",
    errorLoadingSteps: "Fout bij laden stappen",
    errorLoadingStepsDesc: "Kon de configuratie voor dit pakket niet laden. Probeer opnieuw of neem contact op met support.",
    chooseAnotherPackage: "Kies een ander pakket",
    tryAgain: "Probeer opnieuw",
    noStepsConfigured: "Geen stappen geconfigureerd",
    noStepsConfiguredDesc: "Dit pakket heeft nog geen stappen geconfigureerd. Neem contact op met support of kies een ander pakket.",
    selectYourPackage: "Selecteer je pakket",
    selectOption: "Selecteer een optie",
    completeRequiredFields: "Vul alle verplichte velden in",
    completeRequiredFieldsDesc: "Zorg ervoor dat alle verplichte velden zijn ingevuld voordat je doorgaat.",
    somethingWentWrong: "Er ging iets mis",
    tryAgainSupport: "Probeer opnieuw of neem contact op met support als het probleem aanhoudt.",
    stepPackage: "Stap",
    of: "van",
    progress: "Voortgang",
    whatsIncluded: "Wat is inbegrepen",
    professionalQuality: "Professionele kwaliteit",
    previous: "Vorige",
    continue: "Doorgaan",
    submitting: "Versturen...",
    completeOrder: "Bestelling voltooien",
    choosePackage: "Kies pakket",
    pickDate: "Kies datum",
    
    // Toast messages
    orderSuccess: "Bestelling aangemaakt",
    orderSuccessMessage: "Je bestelling is succesvol aangemaakt. Dit gebruikt voorbeeldgegevens voor demonstratie.",
    orderError: "Fout",
    orderErrorMessage: "Er is een fout opgetreden",
    
    // Addons
    rushDelivery: "Spoedlevering",
    commercialRights: "Commerciële rechten",
    distributionMangoRecords: "Mango Records distributie",
    customVideo: "Aangepaste video",
    audioMessageFromSender: "Audiobericht van afzender",
    extendedSong: "Uitgebreid lied",
  },
  nl: {
    // Navigation & General
    home: "Home",
    packages: "Pakketten",
    howItWorks: "Hoe het werkt",
    about: "Over ons",
    testimonials: "Testimonials",
    contact: "Contact",
    getStarted: "Aan de slag",
    orderNow: "Nu bestellen",
    
    // Hero Section
    heroTitle: "Transformeer je emoties in muziek",
    heroSubtitle: "Het mooiste cadeau: een lied speciaal gemaakt voor iemand dierbaar",
    seePackages: "Bekijk pakketten",
    listenToSamples: "Luister naar voorbeelden",
    
    // Packages Section
    chooseYourPackage: "Kies je pakket",
    selectPerfectPackage: "Selecteer het perfecte pakket dat past bij jouw behoeften en budget",
    viewAllPackages: "Bekijk alle pakketten",
    
    // CTA Section
    readyToCreateSpecial: "Klaar om iets speciaals te creëren?",
    helpCreatePersonalized: "Laat ons je helpen een gepersonaliseerd muzikaal cadeau te maken dat voor altijd gekoesterd zal worden",
    
    // Loading and Error States
    loadingPackages: "Pakketten laden...",
    failedToLoadPackages: "Kon pakketten niet laden. Probeer het later opnieuw.",
    reload: "Herladen",
    mostPopular: "Meest populair",
    noPackagesAvailable: "Geen pakketten beschikbaar op dit moment.",
    checkBackLater: "Kom later terug.",
    
    // Footer
    footerDescription: "Gepersonaliseerde muzikale cadeaus maken. Transformeer je speciale momenten in prachtige aangepaste liedjes",
    quickLinks: "Snelle links",
    contactInfo: "Contactinfo",
    legal: "Juridisch",
    termsConditions: "Algemene voorwaarden",
    privacyPolicy: "Privacybeleid",
    refundPolicy: "Terugbetalingsbeleid",
    cookiePolicy: "Cookiebeleid",
    stayUpdated: "Blijf op de hoogte",
    newsletterDescription: "Abonneer je om speciale aanbiedingen, nieuwe pakketten en exclusieve muzikale content in je inbox te ontvangen",
    copyright: "© 2025 MusicGift.ro. Alle rechten voorbehouden. Gemaakt door RED DOMAIN met ❤️ voor muziekliefhebbers",
    
    // Newsletter Form
    enterName: "Je naam (optioneel)",
    enterEmail: "Voer je e-mailadres in",
    subscribe: "Abonneren",
    subscribing: "Aan het abonneren...",
    subscribeDisclaimer: "Door je te abonneren, ga je akkoord met ons Privacybeleid en stem je in met het ontvangen van updates van ons bedrijf",
    
    // How It Works Page
    howItWorksTitle: "Hoe het werkt",
    howItWorksSubtitle: "Ons eenvoudige proces voor het maken van gepersonaliseerde muzikale cadeaus",
    howItWorksProcessTitle: "Ons eenvoudige proces",
    howItWorksProcessSubtitle: "Volg deze eenvoudige stappen om je gepersonaliseerde muzikale cadeau te maken",
    
    // Steps
    step: "Stap",
    step1Title: "Kies pakket",
    step1Description: "Selecteer het pakket dat past bij je gelegenheid en budget",
    step2Title: "Vertel je verhaal",
    step2Description: "Vul het formulier in met je details en unieke verhaal",
    step3Title: "Wij maken muziek",
    step3Description: "Ons professionele team maakt je gepersonaliseerde lied",
    step4Title: "Ontvang je cadeau",
    step4Description: "We leveren je voltooide lied binnen 3-7 werkdagen",
    
    // CTA Section
    readyToStart: "Klaar om te beginnen?",
    readyToStartContent: "Begin vandaag je muzikale reis en maak een onvergetelijk cadeau",
    startYourOrder: "Start je bestelling",
    
    // Package names
    personalPackage: "Persoonlijk Pakket",
    premiumPackage: "Premium Pakket",
    businessPackage: "Business Pakket",
    artistPackage: "Artiest Pakket",
    remixPackage: "Remix Pakket",
    instrumentalPackage: "Instrumentaal Pakket",
    giftPackage: "Cadeau Pakket",
    
    // Package taglines
    personalTagline: "Een lied geschreven met ziel – alleen voor jou en je dierbaren",
    premiumTagline: "Volledige release met wereldwijde distributie",
    businessTagline: "Geef je merk een gedenkwaardige stem",
    artistTagline: "Start je muzikale carrière met een toplied",
    remixTagline: "Breng je lied terug tot leven in een nieuwe stijl",
    instrumentalTagline: "Creëer gebaseerd op een gepersonaliseerde instrumental",
    giftTagline: "Een muzikaal verhaal gegeven als cadeau",
    
    // Package descriptions
    personalDescription: "Perfect voor verjaardagen, bruiloften of speciale gelegenheden – we transformeren je verhaal in een uniek en emotioneel muzikaal cadeau.",
    premiumDescription: "Volledige release. Toon je verhaal aan de hele wereld. Originele muziek, geanimeerde DOMG video en wereldwijde distributie via Mango Records kanaal (+100k).",
    businessDescription: "Geef je merk een gedenkwaardige stem. Gemaakt voor bedrijven die een origineel lied willen voor branding, campagnes of advertenties met emotionele impact.",
    artistDescription: "Start je muzikale carrière met een toplied. Voor toegewijde artiesten die een origineel lied willen, volledige distributie en mede-eigendom van rechten.",
    remixDescription: "Breng je lied terug tot leven in een compleet nieuwe stijl. Voor artiesten of makers die de rechten bezitten van het originele lied en een geremixte versie willen in een ander genre.",
    instrumentalDescription: "Creëer gebaseerd op een instrumental speciaal voor jou gebouwd. Voor artiesten die hun eigen lied willen schrijven, maar een gepersonaliseerde en professionele instrumental nodig hebben.",
    giftDescription: "Een muzikaal verhaal gegeven als cadeau. Perfect om iemand dierbaar te verrassen – de ontvanger kiest zelf de stijl en sfeer van het lied.",
    
    // Delivery times
    personalDelivery: "3–5 werkdagen",
    premiumDelivery: "5–7 dagen",
    businessDelivery: "5–7 dagen",
    artistDelivery: "7–10 dagen",
    remixDelivery: "3–5 dagen",
    instrumentalDelivery: "3–5 dagen",
    giftDelivery: "Direct",
    
    // Package includes
    personalInclude1: "Origineel lied gemaakt naar je verhaal",
    personalInclude2: "Professionele stem van het MusicGift team",
    personalInclude3: "Digitale levering in 3–5 dagen",
    personalInclude4: "Persoonlijke gebruiksrechten (niet-commercieel)",
    
    premiumInclude1: "Origineel lied met volledige productie",
    premiumInclude2: "Geanimeerde video (\"Do Music for Good\" stijl)",
    premiumInclude3: "Officiële digitale distributie via Mango Records (+100k)",
    
    businessInclude1: "Gepersonaliseerd lied voor je bedrijf",
    businessInclude2: "Professionele productie en studiostem",
    businessInclude3: "Superieure kwaliteit Mix & Master",
    businessInclude4: "Beperkte commerciële licentie",
    
    artistInclude1: "Origineel lied + professionele instrumental",
    artistInclude2: "Vocale gids + studio stem opname",
    artistInclude3: "50/50 mede-eigendom van de master",
    artistInclude4: "Volledige distributie via Mango Records",
    
    remixInclude1: "Volledige remix in gekozen stijl",
    remixInclude2: "Aanpasbaar label: \"Remix by Mango Records\"",
    remixInclude3: "Professionele Mix & Master",
    remixInclude4: "Audio export: WAV + MP3",
    remixInclude5: "Korte versie voor sociale media (optioneel)",
    remixInclude6: "Vereist het versturen van het originele lied",
    
    instrumentalInclude1: "Originele instrumental gecomponeerd door MusicGift",
    instrumentalInclude2: "Volledig arrangement: beat, harmonieën, structuur",
    instrumentalInclude3: "Geen stem – ruimte voor je interpretatie",
    instrumentalInclude4: "Professioneel audiobestand (WAV of MP3)",
    instrumentalInclude5: "Beperkte commerciële licentie",
    
    giftInclude1: "Digitale cadeaubon geldig voor elk MusicGift pakket",
    giftInclude2: "Directe levering via e-mail",
    giftInclude3: "Begunstigde kiest gewenst pakket",
    
    // Tags
    newTag: "Nieuw",
    popularTag: "Populair",
    premiumTag: "Premium",
    giftTag: "Cadeau",
    
    // Languages
    romanianLanguage: "Roemeens",
    englishLanguage: "Engels",
    frenchLanguage: "Frans",
    
    // Personal Package Step Titles
    songStoryStep: "Liedverhaal",
    musicalPreferencesStep: "Muzikale voorkeuren",
    contactDetailsStep: "Contact- en leveringsgegevens",
    legalAcceptancesStep: "Juridische acceptaties",
    
    // Field Labels
    recipientLabel: "Aan wie is het lied opgedragen?",
    includeNameInSongLabel: "Naam in lied",
    pronunciationAudioLabel: "Naamuitspraak",
    relationshipTextLabel: "Je relatie met deze persoon",
    storyDetailedLabel: "Verhaal van deze persoon",
    keywordsLabel: "Belangrijke trefwoorden",
    keywordsAudioLabel: "Uitspraak trefwoorden",
    styleReferenceLabel: "Liedstijl",
    youtubeExampleLabel: "YouTube voorbeeld",
    
    // Personal Package Field Placeholders
    recipientPlaceholder: "bijv. Maria",
    includeNameInSongPlaceholder: "Wil je dat de naam van de persoon in het lied voorkomt?",
    pronunciationAudioPlaceholder: "Neem de naamuitspraak op als deze atypisch is",
    relationshipTextPlaceholder: "bijv. vrouw/man, vriend, collega, zus/broer",
    storyDetailedPlaceholder: "Wat maakt haar speciaal? Welke mooie momenten hebben jullie samen beleefd? Welke kwaliteiten wil je benadrukken in het lied? Welke belangrijke herinneringen hebben jullie?",
    keywordsPlaceholder: "namen, plaatsen, speciale uitdrukkingen",
    keywordsAudioPlaceholder: "Neem de uitspraak van enkele trefwoorden op (optioneel)",
    
    // Musical Preferences Fields
    styleReferencePlaceholder: "bijv. pop, rock, ballad, rap",
    youtubeExamplePlaceholder: "YouTube link met voorbeeldlied in het genre dat je wilt",
    
    // Mood Options
    moodRomantic: "Romantisch",
    moodCheerful: "Vrolijk",
    moodNostalgic: "Nostalgisch",
    moodEnergetic: "Energiek",
    moodMelancholic: "Melancholisch",
    moodInspirational: "Inspirerend",
    moodEmotional: "Emotioneel",
    moodUplifting: "Opbeurend",
    
    // Voice Gender Options
    voiceFeminine: "Vrouwelijke stem",
    voiceMasculine: "Mannelijke stem",
    voiceDuet: "Duet",
    voiceMusicGiftChoice: "Laat MusicGift kiezen",
    
    // Legal Acceptances
    termsMentionMusicGiftPlaceholder: "Ik accepteer dat als ik het lied publiekelijk post, ik moet vermelden: \"Geproduceerd door MusicGift.ro by Mango Records\"",
    confirmOrderPlaceholder: "Ik bevestig de bestelling en verstrekte details",
    acceptTermsAndConditionsPlaceholder: "Ik accepteer de algemene voorwaarden van de website",
    
    // Addons
    videoMessageFromSender: "Videoboodschap van jou",
    
    // Step titles
    forWhomIsSongStep: "Voor wie is het lied?",
    forWhichCompanyIsSongStep: "Voor welk bedrijf is het lied?",
    yourContactDetailsStep: "Je contactgegevens",
    contactAndBillingDetailsStep: "Contact- en factureringsgegevens",
    
    // Field placeholders
    recipientNamePlaceholder: "Naam van de persoon voor wie het lied is",
    recipientNamePronunciationPlaceholder: "Naamuitspraak opname (als de naam een ongewone uitspraak heeft)",
    relationshipPlaceholder: "Je relatie met deze persoon",
    companyNameForSongPlaceholder: "Naam van het bedrijf voor wie het lied is",
    companyNamePronunciationPlaceholder: "Bedrijfsnaam uitspraak opname",
    
    // Relationship options
    relationshipPartner: "Partner",
    relationshipFamily: "Familie",
    relationshipFriend: "Vriend",
    relationshipColleague: "Collega",
    relationshipOther: "Anders",
    
    // Existing step titles
    choosePackageStep: "Kies pakket",
    personalDetailsStep: "Persoonlijke gegevens",
    companyDetailsStep: "Bedrijfsgegevens",
    yourStoryStep: "Je verhaal",
    brandStoryStep: "Merk en verhaal",
    addonsStep: "Add-ons",
    distributionConfirmationStep: "Distributiebevestiging",
    artisticDataStep: "Artistieke gegevens",
    songConceptStep: "Liedconcept",
    processAcceptanceStep: "Procesacceptatie",
    remixInfoStep: "Remix informatie",
    legalityContactStep: "Legaliteit en contact",
    artisticDetailsStep: "Artistieke details",
    visionStyleStep: "Visie en stijl",
    extraOptionsStep: "Extra opties",
    recipientDetailsStep: "Ontvanger details",
    deliveryConfirmationStep: "Levering & bevestiging",
    
    // Field placeholders (existing ones)
    choosePersonalPackage: "Kies Persoonlijk Pakket",
    choosePremiumPackage: "Kies Premium Pakket",
    chooseBusinessPackage: "Kies Business Pakket",
    chooseArtistPackage: "Kies Artiest Pakket",
    fullNamePlaceholder: "Volledige naam",
    emailPlaceholder: "E-mailadres",
    phonePlaceholder: "Telefoon",
    songLanguagePlaceholder: "Liedtaal (RO / EN / FR)",
    occasionPlaceholder: "Gelegenheid / toewijding",
    pronunciationRecordingPlaceholder: "Uitspraak opname (optioneel)",
    storyPlaceholder: "Beschrijf het verhaal",
    vibePlaceholder: "Gewenste stemming / emotie",
    youtubeLinksPlaceholder: "YouTube inspiratie links",
    importantKeywordsPlaceholder: "Belangrijke trefwoorden",
    keywordsPronunciationPlaceholder: "Trefwoorden uitspraak (optioneel)",
    selectAddonsPlaceholder: "Selecteer extra opties",
    acceptMentionPlaceholder: "Ik accepteer dat MusicGift.ro by Mango Records bron vermeld moet worden als het lied online wordt gepost",
    acceptMangoDistributionPlaceholder: "Ik accepteer dat het lied alleen via Mango Records gedistribueerd wordt",
    companyNamePlaceholder: "Bedrijfsnaam",
    contactPersonPlaceholder: "Contactpersoon",
    companyPronunciationPlaceholder: "Bedrijfsuitspraak (optioneel)",
    brandStoryPlaceholder: "Merkverhaal",
    keyValuesPlaceholder: "Kernwaarden en berichten",
    inspirationLinksPlaceholder: "Video/muzikale inspiratie",
    artistNamePlaceholder: "Artiestnaam",
    mediaLinksPlaceholder: "Links naar uitgebrachte liedjes",
    pressLinksPlaceholder: "Links naar media-optredens",
    musicalVisionPlaceholder: "Wat is je muzikale visie?",
    acceptProcessPlaceholder: "Ik accepteer dat: 1. Ik ontvang lied + instrumental in 7 dagen. 2. Ik stuur WAV stem. 3. Mango Records mixt en levert. 4. Ik teken 50/50 co-productie contract.",
    acceptContactPlaceholder: "Ik accepteer contact binnen de komende 24-48u door het MusicGift team",
    originalSongLinkPlaceholder: "Origineel lied link",
    uploadWAVPlaceholder: "Upload .WAV bestand",
    remixGenrePlaceholder: "Gewenste stijl voor remix",
    ownershipConfirmationPlaceholder: "Ik verklaar dat ik alle rechten bezit van het originele lied",
    titleLanguagePlaceholder: "Titel en sfeer taal",
    instrumentalGenrePlaceholder: "Gewenst muziekgenre",
    moodAtmospherePlaceholder: "Stemming/atmosfeer",
    giftRecipientNamePlaceholder: "Naam van de persoon aan wie je het cadeau geeft",
    recipientEmailPlaceholder: "E-mail van ontvanger",
    personalMessagePlaceholder: "Je bericht (optioneel)",
    senderNamePlaceholder: "Je naam",
    senderEmailPlaceholder: "Je e-mail voor bevestiging",
    
    // Order wizard
    loadingSteps: "Stappen laden...",
    errorLoadingSteps: "Fout bij laden stappen",
    errorLoadingStepsDesc: "Kon de configuratie voor dit pakket niet laden. Probeer opnieuw of neem contact op met support.",
    chooseAnotherPackage: "Kies een ander pakket",
    tryAgain: "Probeer opnieuw",
    noStepsConfigured: "Geen stappen geconfigureerd",
    noStepsConfiguredDesc: "Dit pakket heeft nog geen stappen geconfigureerd. Neem contact op met support of kies een ander pakket.",
    selectYourPackage: "Selecteer je pakket",
    selectOption: "Selecteer een optie",
    completeRequiredFields: "Vul alle verplichte velden in",
    completeRequiredFieldsDesc: "Zorg ervoor dat alle verplichte velden zijn ingevuld voordat je doorgaat.",
    somethingWentWrong: "Er ging iets mis",
    tryAgainSupport: "Probeer opnieuw of neem contact op met support als het probleem aanhoudt.",
    stepPackage: "Stap",
    of: "van",
    progress: "Voortgang",
    whatsIncluded: "Wat is inbegrepen",
    professionalQuality: "Professionele kwaliteit",
    previous: "Vorige",
    continue: "Doorgaan",
    submitting: "Versturen...",
    completeOrder: "Bestelling voltooien",
    choosePackage: "Kies pakket",
    pickDate: "Kies datum",
    
    // Toast messages
    orderSuccess: "Bestelling aangemaakt",
    orderSuccessMessage: "Je bestelling is succesvol aangemaakt. Dit gebruikt voorbeeldgegevens voor demonstratie.",
    orderError: "Fout",
    orderErrorMessage: "Er is een fout opgetreden",
    
    // Addons
    rushDelivery: "Spoedlevering",
    commercialRights: "Commerciële rechten",
    distributionMangoRecords: "Mango Records distributie",
    customVideo: "Aangepaste video",
    audioMessageFromSender: "Audiobericht van afzender",
    extendedSong: "Uitgebreid lied",
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
