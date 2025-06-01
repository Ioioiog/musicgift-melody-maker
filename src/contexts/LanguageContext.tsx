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
  language: Language;
  setLanguage: (lang: Language) => void;
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
    
    // Package Labels
    personalPackage: "Pachet Personal",
    businessPackage: "Pachet Business",
    premiumPackage: "Pachet Premium",
    artistPackage: "Pachet Artist",
    instrumentalPackage: "Pachet Instrumental",
    remixPackage: "Pachet Remix",
    giftPackage: "Pachet Cadou",
    
    // Package Taglines
    "O melodie unică pentru momentele tale speciale": "O melodie unică pentru momentele tale speciale",
    "Dă-i brandului tău o voce memorabilă": "Dă-i brandului tău o voce memorabilă",
    "Experiența completă: cântec + video animat + distribuție": "Experiența completă: cântec + video animat + distribuție",
    "Colaborare artistică completă pentru cariera ta muzicală": "Colaborare artistică completă pentru cariera ta muzicală",
    "Instrumental personalizat pentru proiectele tale": "Instrumental personalizat pentru proiectele tale",
    "Dă o nouă viață cântecului tău preferat": "Dă o nouă viață cântecului tău preferat",
    "Oferă cadoul muzicii personalizate": "Oferă cadoul muzicii personalizate",
    
    // Package Descriptions
    "Perfect pentru cadouri personalizate și momente de neuitat": "Perfect pentru cadouri personalizate și momente de neuitat",
    "Creat pentru companii care vor o piesă originală pentru branding, campanii sau reclame cu impact emoțional": "Creat pentru companii care vor o piesă originală pentru branding, campanii sau reclame cu impact emoțional",
    "Pachetul complet pentru cei care vor totul inclus": "Pachetul complet pentru cei care vor totul inclus",
    "Pachetul profesional pentru artiști care vor să își lanseze cariera muzicală": "Pachetul profesional pentru artiști care vor să își lanseze cariera muzicală",
    "Perfecte pentru podcasturi, videoclipuri, prezentări sau orice proiect care necesită muzică de fundal": "Perfecte pentru podcasturi, videoclipuri, prezentări sau orice proiect care necesită muzică de fundal",
    "Transformă orice cântec într-o versiune unică și personalizată": "Transformă orice cântec într-o versiune unică și personalizată",
    "Cumpără orice pachet ca și cadou pentru cineva special": "Cumpără orice pachet ca și cadou pentru cineva special",
    
    // Delivery Times
    "3-5 zile": "3-5 zile",
    "5–7 zile": "5–7 zile",
    "5-7 zile": "5-7 zile",
    "14-21 zile": "14-21 zile",
    "Variabil": "Variabil",
    
    // Package Includes
    "Cântec original din povestea ta": "Cântec original din povestea ta",
    "Voce profesională": "Voce profesională",
    "Livrare rapidă": "Livrare rapidă",
    "Drepturi personale": "Drepturi personale",
    "Consultanță creativă": "Consultanță creativă",
    "Cântec personalizat pentru afacerea ta": "Cântec personalizat pentru afacerea ta",
    "Producție profesională și voce de studio": "Producție profesională și voce de studio",
    "Mix & Master de calitate superioară": "Mix & Master de calitate superioară",
    "Licență comercială limitată (excludere: radio, TV, revânzare piesă)": "Licență comercială limitată (excludere: radio, TV, revânzare piesă)",
    "Fișiere audio multiple (MP3, WAV)": "Fișiere audio multiple (MP3, WAV)",
    "Cântec original cu producție completă": "Cântec original cu producție completă",
    "Video animat DOMG": "Video animat DOMG",
    "Distribuție oficială digitală Mango Records": "Distribuție oficială digitală Mango Records",
    "Colaborare artistică completă": "Colaborare artistică completă",
    "Producție cântec original": "Producție cântec original",
    "Înregistrare vocală profesională": "Înregistrare vocală profesională",
    "Video clip muzical profesional": "Video clip muzical profesional",
    "Distribuție pe toate platformele": "Distribuție pe toate platformele",
    "Contract 50/50": "Contract 50/50",
    "Marketing profesional": "Marketing profesional",
    "Instrumental personalizat": "Instrumental personalizat",
    "Producție audio profesională": "Producție audio profesională",
    "Mix & Master final": "Mix & Master final",
    "Fișiere audio multiple": "Fișiere audio multiple",
    "Stems separate pentru editare": "Stems separate pentru editare",
    "Remix profesional": "Remix profesional",
    "Producție în stilul dorit": "Producție în stilul dorit",
    "Versiune extinsă și radio edit": "Versiune extinsă și radio edit",
    "Fișiere audio de înaltă calitate": "Fișiere audio de înaltă calitate",
    "Card digital personalizat": "Card digital personalizat",
    "Mesaj personalizat": "Mesaj personalizat",
    "Livrare automată": "Livrare automată",
    "Toate beneficiile pachetului selectat": "Toate beneficiile pachetului selectat",
    
    // Step Titles
    "Alege pachetul": "Alege pachetul",
    "Povestea ta": "Povestea ta",
    "Informații companie": "Informații companie",
    "Detalii cântec": "Detalii cântec",
    "Profilul artistic": "Profilul artistic",
    "Specificații instrumental": "Specificații instrumental",
    "Detalii remix": "Detalii remix",
    "Pachetul cadou": "Pachetul cadou",
    
    // Field Placeholders
    "Numele destinatarului": "Numele destinatarului",
    "Relația cu destinatarul": "Relația cu destinatarul",
    "Ocazia": "Ocazia",
    "Povestea voastră în câteva cuvinte": "Povestea voastră în câteva cuvinte",
    "Stilul muzical preferat": "Stilul muzical preferat",
    "Numele companiei": "Numele companiei",
    "Domeniul de activitate": "Domeniul de activitate",
    "Ce mesaj vrei să transmită melodia despre brandul tău": "Ce mesaj vrei să transmită melodia despre brandul tău",
    "Publicul țintă": "Publicul țintă",
    "Titlul dorit pentru cântec": "Titlul dorit pentru cântec",
    "Stilul video-ului animat": "Stilul video-ului animat",
    "Conceptul și mesajul cântecului": "Conceptul și mesajul cântecului",
    "Numele de scenă dorit": "Numele de scenă dorit",
    "Experiența muzicală": "Experiența muzicală",
    "Genul muzical preferat": "Genul muzical preferat",
    "Viziunea ta artistică și ce vrei să transmiți prin muzică": "Viziunea ta artistică și ce vrei să transmiți prin muzică",
    "Obiectivele tale de carieră muzicală": "Obiectivele tale de carieră muzicală",
    "Tipul proiectului": "Tipul proiectului",
    "Genul muzical": "Genul muzical",
    "Atmosfera dorită": "Atmosfera dorită",
    "Durata dorită": "Durata dorită",
    "Note adiționale și detalii specifice": "Note adiționale și detalii specifice",
    "Numele cântecului original și artistul": "Numele cântecului original și artistul",
    "Stilul remix-ului dorit": "Stilul remix-ului dorit",
    "Tempoul dorit": "Tempoul dorit",
    "Cerințe speciale și viziunea ta pentru remix": "Cerințe speciale și viziunea ta pentru remix",
    "Alege pachetul pentru cadou": "Alege pachetul pentru cadou",
    "Numele destinatarului cadoului": "Numele destinatarului cadoului",
    "Email-ul destinatarului": "Email-ul destinatarului",
    "Mesajul tău pentru destinatar": "Mesajul tău pentru destinatar",
    "Data livrării (opțional)": "Data livrării (opțional)",
    
    // Option Values - Relationships
    "Partener/ă": "Partener/ă",
    "Copil": "Copil",
    "Părinte": "Părinte",
    "Prieten/ă": "Prieten/ă",
    "Frate/Soră": "Frate/Soră",
    "Bunic/Bunică": "Bunic/Bunică",
    "Altă relație": "Altă relație",
    
    // Option Values - Occasions
    "Zi de naștere": "Zi de naștere",
    "Aniversare": "Aniversare",
    "Nuntă": "Nuntă",
    "Ziua Îndrăgostiților": "Ziua Îndrăgostiților",
    "Crăciun": "Crăciun",
    "Altă ocazie": "Altă ocazie",
    
    // Option Values - Music Styles
    "Pop": "Pop",
    "Acustic": "Acustic",
    "Rock": "Rock",
    "Jazz": "Jazz",
    "Folk": "Folk",
    "Electronic": "Electronic",
    "Corporate": "Corporate",
    "Energic": "Energic",
    "Calm": "Calm",
    "Modern": "Modern",
    "Clasic": "Clasic",
    "Hip-Hop": "Hip-Hop",
    
    // Option Values - Video Styles
    "Romantic": "Romantic",
    "Distractiv": "Distractiv",
    "Elegant": "Elegant",
    
    // Option Values - Experience Levels
    "Începător": "Începător",
    "Intermediar": "Intermediar",
    "Avansat": "Avansat",
    "Profesionist": "Profesionist",
    
    // Option Values - Project Types
    "Podcast": "Podcast",
    "Video/Film": "Video/Film",
    "Prezentare": "Prezentare",
    "Joc": "Joc",
    "Reclamă": "Reclamă",
    "Altul": "Altul",
    
    // Option Values - Moods
    "Misterios": "Misterios",
    "Optimist": "Optimist",
    "Dramatic": "Dramatic",
    "Jucăuș": "Jucăuș",
    
    // Option Values - Durations
    "30 secunde": "30 secunde",
    "1 minut": "1 minut",
    "2 minute": "2 minute",
    "3 minute": "3 minute",
    "Durată personalizată": "Durată personalizată",
    
    // Option Values - Remix Styles
    "Electronic/EDM": "Electronic/EDM",
    "Reggae": "Reggae",
    
    // Option Values - Tempo
    "Mai lent": "Mai lent",
    "Același tempo": "Același tempo",
    "Mai rapid": "Mai rapid",
    "Tempo variabil": "Tempo variabil",
    
    // Option Values - Gift Packages
    "Pachet Personal": "Pachet Personal",
    "Pachet Business": "Pachet Business",
    "Pachet Premium": "Pachet Premium",
    "Pachet Artist": "Pachet Artist",
    "Pachet Instrumental": "Pachet Instrumental",
    "Pachet Remix": "Pachet Remix",
    
    // Option Values - Additional
    "Ambient": "Ambient",
    "Cinematic": "Cinematic",
    "Relaxant": "Relaxant",
    
    // Tags
    "Nou": "Nou",
    "Popular": "Popular",
    "Premium": "Premium",
    "Cadou": "Cadou",
    
    heroTitle: "Transformă Emoțiile Tale în Muzică",
    heroSubtitle: "Cel mai frumos cadou: o melodie creată special pentru cineva drag.",
    seePackages: "Vezi Pachetele",
    listenToSamples: "Ascultă Mostre",
    
    // About Page
    aboutSubtitle: "Despre Noi",
    aboutNewDescription1: "Suntem o echipă pasionată de muzică și tehnologie, dedicată să transforme emoțiile și amintirile tale în melodii unice și personalizate. Cu ani de experiență în industria muzicală, creăm cadouri muzicale care ating inima și rămân în suflet pentru totdeauna.",
    aboutNewDescription2: "Fiecare cântec pe care îl creăm este o poveste unică, construită cu atenție la detalii și dragostea pentru muzică. Folosim cele mai avansate tehnologii și talentul nostru artistic pentru a da viață visurilor tale muzicale.",
    songsCreated: "Cântece Create",
    yearsExperience: "Ani Experiență",
    clientSatisfaction: "Satisfacția Clienților",
    whoWeAre: "Cine Suntem",
    mihaiGruiaTitle: "Mihai Gruia - Compozitor Principal",
    mihaiGruiaDescription: "Cu peste 10 ani de experiență în compunerea muzicală, Mihai aduce creativitate și profesionalism în fiecare proiect, transformând emoțiile în melodii memorabile.",
    mangoRecordsTitle: "Mango Records - Parteneri de Producție",
    mangoRecordsDescription: "Studio de înregistrări profesional cu echipamente de ultimă generație, asigurând calitatea superioară a fiecărui cântec produs.",
    domgStudioTitle: "DOMG Studio - Producție Audio",
    domgStudioDescription: "Experți în producția audio și masterizare, DOMG Studio oferă sunetul crystal clar pe care îl merită fiecare melodie personalizată.",
    doMusicForGoodTitle: "Do Music For Good - Misiunea Noastră",
    doMusicForGoodDescription: "Credem că muzica are puterea de a schimba vieți și de a aduce oamenii împreună. Fiecare proiect contribuie la o lume mai frumoasă prin muzică.",
    
    // How It Works Page
    howItWorksTitle: "Cum Funcționează",
    choosePackage: "Alege Pachetul",
    choosePackageDesc: "Selectează pachetul perfect care se potrivește nevoilor și bugetului tău din gama noastră variată de opțiuni.",
    tellYourStory: "Povestește-ne Povestea",
    tellYourStoryDesc: "Împărtășește-ne momentele speciale, emoțiile și detaliile care fac povestea ta unică și memorabilă.",
    weCreate: "Creăm Muzica",
    weCreateDesc: "Echipa noastră de compozitori profesioniști transformă povestea ta într-o melodie originală și personalizată.",
    deliverDelight: "Livrăm Bucuria",
    deliverDelightDesc: "Primești cântecul tău personalizat în format digital de înaltă calitate, gata să aducă zâmbete și emoții.",
    
    // Contact Page
    contactTitle: "Contactează-ne",
    contactSubtitle: "Intră în legătură cu noi pentru orice întrebări sau pentru a-ți începe călătoria muzicală",
    getInTouch: "Intră în Legătură",
    contactDescription: "Ne-ar plăcea să auzim de la tine. Trimite-ne un mesaj și vom răspunde cât mai curând posibil.",
    emailUs: "Trimite-ne Email",
    callUs: "Sună-ne",
    visitUs: "Vizitează-ne",
    sendMessage: "Trimite Mesaj",
    yourName: "Numele tău",
    yourEmail: "Email-ul tău",
    phoneNumber: "Numărul de telefon",
    yourMessage: "Mesajul tău",
    sendMessageBtn: "Trimite Mesajul",
    messageSent: "Mesaj trimis!",
    messageThankYou: "Mulțumim pentru mesajul tău. Vom reveni cu un răspuns în cel mai scurt timp.",
    
    // Testimonials Page
    testimonialsTitle: "Ce Spun Clienții Noștri",
    testimonialsSubtitle: "Testimoniale reale de la clienți mulțumiți care și-au iubit cântecele personalizate",
    
    // Individual Testimonials
    testimonial1Name: "Ana M.",
    testimonial1Location: "București",
    testimonial1Review: "Am primit o melodie personalizată pentru ziua mea de naștere și a fost absolut perfectă! Emoția pe care am simțit-o când am ascultat-o prima dată a fost de nedescris.",
    
    testimonial2Name: "Nati G.",
    testimonial2Location: "Cluj-Napoca",
    testimonial2Review: "Serviciu excepțional! Melodia creată pentru nunta noastră a fost exact ce ne-am dorit. Toți invitații au fost impresionați de originalitatea și calitatea piesei.",
    
    testimonial3Name: "TechCorp",
    testimonial3Location: "Timișoara",
    testimonial3Review: "Am comandat o melodie pentru campania noastră de marketing și rezultatul a depășit toate așteptările. Profesionalism și creativitate la cel mai înalt nivel!",
    
    testimonial4Name: "Maria P.",
    testimonial4Location: "Iași",
    testimonial4Review: "Cea mai frumoasă surpriză pe care am putut-o face soțului meu! Melodia personalizată pentru aniversarea noastră a fost emoționantă și memorabilă.",
    
    testimonial5Name: "Alex R.",
    testimonial5Location: "Brașov",
    testimonial5Review: "Calitate impecabilă și atenție la detalii! Echipa a reușit să surprindă perfect povestea noastră în melodie. Recomand cu încredere!",
    
    // Testimonials
    testimonialQuote: "Am comandat un cântec pentru soția mea la aniversarea noastră și a fost cel mai frumos cadou pe care l-am putut oferi. Calitatea muzicii și emoția din versuri ne-au emoționat până la lacrimi.",
    testimonialAuthor: "Alexandru M., București",
    
    // Footer
    footerDescription: "Creăm cadouri muzicale personalizate. Transformă momentele tale speciale în melodii frumoase și personalizate.",
    contactInfo: "Informații Contact",
    stayUpdated: "Rămâi la Curent",
    newsletterDescription: "Abonează-te pentru a primi oferte speciale, pachete noi și conținut muzical exclusiv direct în inbox-ul tău.",
    enterEmail: "Introdu adresa ta de email",
    subscribe: "Abonează-te",
    subscribeDisclaimer: "Prin abonare, ești de acord cu Politica noastră de Confidențialitate și consimți să primești actualizări de la compania noastră.",
    legal: "Legal",
    termsConditions: "Termeni și Condiții",
    privacyPolicy: "Politica de Confidențialitate",
    refundPolicy: "Politica de Rambursare",
    cookiePolicy: "Politica Cookie",
    copyright: "© 2025 MusicGift.ro. Toate drepturile rezervate. Făcut de RED DOMAIN cu ❤️ pentru iubitorii de muzică.",
    
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
    
    // Package Labels
    personalPackage: "Personal Package",
    businessPackage: "Business Package",
    premiumPackage: "Premium Package",
    artistPackage: "Artist Package",
    instrumentalPackage: "Instrumental Package",
    remixPackage: "Remix Package",
    giftPackage: "Gift Package",
    
    // Package Taglines
    "O melodie unică pentru momentele tale speciale": "A unique melody for your special moments",
    "Dă-i brandului tău o voce memorabilă": "Give your brand a memorable voice",
    "Experiența completă: cântec + video animat + distribuție": "Complete experience: song + animated video + distribution",
    "Colaborare artistică completă pentru cariera ta muzicală": "Complete artistic collaboration for your musical career",
    "Instrumental personalizat pentru proiectele tale": "Personalized instrumental for your projects",
    "Dă o nouă viață cântecului tău preferat": "Give new life to your favorite song",
    "Oferă cadoul muzicii personalizate": "Offer the gift of personalized music",
    
    // Package Descriptions
    "Perfect pentru cadouri personalizate și momente de neuitat": "Perfect for personalized gifts and unforgettable moments",
    "Creat pentru companii care vor o piesă originală pentru branding, campanii sau reclame cu impact emoțional": "Created for companies that want an original piece for branding, campaigns or ads with emotional impact",
    "Pachetul complet pentru cei care vor totul inclus": "The complete package for those who want everything included",
    "Pachetul profesional pentru artiști care vor să își lanseze cariera muzicală": "The professional package for artists who want to launch their musical career",
    "Perfecte pentru podcasturi, videoclipuri, prezentări sau orice proiect care necesită muzică de fundal": "Perfect for podcasts, videos, presentations or any project that needs background music",
    "Transformă orice cântec într-o versiune unică și personalizată": "Transform any song into a unique and personalized version",
    "Cumpără orice pachet ca și cadou pentru cineva special": "Buy any package as a gift for someone special",
    
    // Delivery Times
    "3-5 zile": "3-5 days",
    "5–7 zile": "5–7 days",
    "5-7 zile": "5-7 days",
    "14-21 zile": "14-21 days",
    "Variabil": "Variable",
    
    // Package Includes
    "Cântec original din povestea ta": "Original song from your story",
    "Voce profesională": "Professional voice",
    "Livrare rapidă": "Fast delivery",
    "Drepturi personale": "Personal rights",
    "Consultanță creativă": "Creative consultation",
    "Cântec personalizat pentru afacerea ta": "Personalized song for your business",
    "Producție profesională și voce de studio": "Professional production and studio voice",
    "Mix & Master de calitate superioară": "Superior quality mix & master",
    "Licență comercială limitată (excludere: radio, TV, revânzare piesă)": "Limited commercial license (excluding: radio, TV, song resale)",
    "Fișiere audio multiple (MP3, WAV)": "Multiple audio files (MP3, WAV)",
    "Cântec original cu producție completă": "Original song with complete production",
    "Video animat DOMG": "DOMG animated video",
    "Distribuție oficială digitală Mango Records": "Official digital distribution Mango Records",
    "Colaborare artistică completă": "Complete artistic collaboration",
    "Producție cântec original": "Original song production",
    "Înregistrare vocală profesională": "Professional vocal recording",
    "Video clip muzical profesional": "Professional music video",
    "Distribuție pe toate platformele": "Distribution on all platforms",
    "Contract 50/50": "50/50 contract",
    "Marketing profesional": "Professional marketing",
    "Instrumental personalizat": "Personalized instrumental",
    "Producție audio profesională": "Professional audio production",
    "Mix & Master final": "Final mix & master",
    "Fișiere audio multiple": "Multiple audio files",
    "Stems separate pentru editare": "Separate stems for editing",
    "Remix profesional": "Professional remix",
    "Producție în stilul dorit": "Production in desired style",
    "Versiune extinsă și radio edit": "Extended version and radio edit",
    "Fișiere audio de înaltă calitate": "High quality audio files",
    "Card digital personalizat": "Personalized digital card",
    "Mesaj personalizat": "Personalized message",
    "Livrare automată": "Automatic delivery",
    "Toate beneficiile pachetului selectat": "All benefits of selected package",
    
    // Step Titles
    "Alege pachetul": "Choose Package",
    "Povestea ta": "Your Story",
    "Informații companie": "Company Information",
    "Detalii cântec": "Song Details",
    "Profilul artistic": "Artistic Profile",
    "Specificații instrumental": "Instrumental Specifications",
    "Detalii remix": "Remix Details",
    "Pachetul cadou": "Gift Package",
    
    // Field Placeholders
    "Numele destinatarului": "Recipient's name",
    "Relația cu destinatarul": "Relationship with recipient",
    "Ocazia": "Occasion",
    "Povestea voastră în câteva cuvinte": "Your story in a few words",
    "Stilul muzical preferat": "Preferred musical style",
    "Numele companiei": "Company name",
    "Domeniul de activitate": "Business domain",
    "Ce mesaj vrei să transmită melodia despre brandul tău": "What message should the song convey about your brand",
    "Publicul țintă": "Target audience",
    "Titlul dorit pentru cântec": "Desired song title",
    "Stilul video-ului animat": "Animated video style",
    "Conceptul și mesajul cântecului": "Song concept and message",
    "Numele de scenă dorit": "Desired stage name",
    "Experiența muzicală": "Musical experience",
    "Genul muzical preferat": "Preferred musical genre",
    "Viziunea ta artistică și ce vrei să transmiți prin muzică": "Your artistic vision and what you want to convey through music",
    "Obiectivele tale de carieră muzicală": "Your musical career goals",
    "Tipul proiectului": "Project type",
    "Genul muzical": "Musical genre",
    "Atmosfera dorită": "Desired atmosphere",
    "Durata dorită": "Desired duration",
    "Note adiționale și detalii specifice": "Additional notes and specific details",
    "Numele cântecului original și artistul": "Original song name and artist",
    "Stilul remix-ului dorit": "Desired remix style",
    "Tempoul dorit": "Desired tempo",
    "Cerințe speciale și viziunea ta pentru remix": "Special requirements and your vision for the remix",
    "Alege pachetul pentru cadou": "Choose package for gift",
    "Numele destinatarului cadoului": "Gift recipient's name",
    "Email-ul destinatarului": "Recipient's email",
    "Mesajul tău pentru destinatar": "Your message for the recipient",
    "Data livrării (opțional)": "Delivery date (optional)",
    
    // Option Values - Relationships
    "Partener/ă": "Partner",
    "Copil": "Child",
    "Părinte": "Parent",
    "Prieten/ă": "Friend",
    "Frate/Soră": "Sibling",
    "Bunic/Bunică": "Grandparent",
    "Altă relație": "Other relationship",
    
    // Option Values - Occasions
    "Zi de naștere": "Birthday",
    "Aniversare": "Anniversary",
    "Nuntă": "Wedding",
    "Ziua Îndrăgostiților": "Valentine's Day",
    "Crăciun": "Christmas",
    "Altă ocazie": "Other occasion",
    
    // Option Values - Music Styles
    "Pop": "Pop",
    "Acustic": "Acoustic",
    "Rock": "Rock",
    "Jazz": "Jazz",
    "Folk": "Folk",
    "Electronic": "Electronic",
    "Corporate": "Corporate",
    "Energic": "Energic",
    "Calm": "Calm",
    "Modern": "Modern",
    "Clasic": "Classic",
    "Hip-Hop": "Hip-Hop",
    
    // Option Values - Video Styles
    "Romantic": "Romantic",
    "Distractiv": "Fun",
    "Elegant": "Elegant",
    
    // Option Values - Experience Levels
    "Începător": "Beginner",
    "Intermediar": "Intermediate",
    "Avansat": "Advanced",
    "Profesionist": "Professional",
    
    // Option Values - Project Types
    "Podcast": "Podcast",
    "Video/Film": "Video/Film",
    "Prezentare": "Presentation",
    "Joc": "Game",
    "Reclamă": "Commercial",
    "Altul": "Other",
    
    // Option Values - Moods
    "Misterios": "Mysterious",
    "Optimist": "Uplifting",
    "Dramatic": "Dramatic",
    "Jucăuș": "Playful",
    
    // Option Values - Durations
    "30 secunde": "30 seconds",
    "1 minut": "1 minute",
    "2 minute": "2 minutes",
    "3 minute": "3 minutes",
    "Durată personalizată": "Custom duration",
    
    // Option Values - Remix Styles
    "Electronic/EDM": "Electronic/EDM",
    "Reggae": "Reggae",
    
    // Option Values - Tempo
    "Mai lent": "Slower",
    "Același tempo": "Same tempo",
    "Mai rapid": "Faster",
    "Tempo variabil": "Variable tempo",
    
    // Option Values - Gift Packages
    "Pachet Personal": "Personal Package",
    "Pachet Business": "Business Package",
    "Pachet Premium": "Premium Package",
    "Pachet Artist": "Artist Package",
    "Pachet Instrumental": "Instrumental Package",
    "Pachet Remix": "Remix Package",
    
    // Option Values - Additional
    "Ambient": "Ambient",
    "Cinematic": "Cinematic",
    "Relaxant": "Relaxing",
    
    // Tags
    "Nou": "New",
    "Popular": "Popular",
    "Premium": "Premium",
    "Cadou": "Gift",
    
    heroTitle: "Transform Your Emotions into Music",
    heroSubtitle: "The most beautiful gift: a song created especially for someone dear.",
    seePackages: "See Packages",
    listenToSamples: "Listen to Samples",
    
    // About Page
    aboutSubtitle: "About Us",
    aboutNewDescription1: "We are a passionate team of music and technology enthusiasts, dedicated to transforming your emotions and memories into unique and personalized melodies. With years of experience in the music industry, we create musical gifts that touch the heart and remain in the soul forever.",
    aboutNewDescription2: "Every song we create is a unique story, built with attention to detail and love for music. We use the most advanced technologies and our artistic talent to bring your musical dreams to life.",
    songsCreated: "Songs Created",
    yearsExperience: "Years Experience",
    clientSatisfaction: "Client Satisfaction",
    whoWeAre: "Who We Are",
    mihaiGruiaTitle: "Mihai Gruia - Lead Composer",
    mihaiGruiaDescription: "With over 10 years of experience in musical composition, Mihai brings creativity and professionalism to every project, transforming emotions into memorable melodies.",
    mangoRecordsTitle: "Mango Records - Production Partners",
    mangoRecordsDescription: "Professional recording studio with state-of-the-art equipment, ensuring superior quality of every song produced.",
    domgStudioTitle: "DOMG Studio - Audio Production",
    domgStudioDescription: "Experts in audio production and mastering, DOMG Studio provides the crystal clear sound that every personalized melody deserves.",
    doMusicForGoodTitle: "Do Music For Good - Our Mission",
    doMusicForGoodDescription: "We believe music has the power to change lives and bring people together. Every project contributes to a more beautiful world through music.",
    
    // How It Works Page
    howItWorksTitle: "How It Works",
    choosePackage: "Choose Package",
    choosePackageDesc: "Select the perfect package that fits your needs and budget from our varied range of options.",
    tellYourStory: "Tell Your Story",
    tellYourStoryDesc: "Share with us the special moments, emotions, and details that make your story unique and memorable.",
    weCreate: "We Create Music",
    weCreateDesc: "Our team of professional composers transforms your story into an original and personalized melody.",
    deliverDelight: "Deliver Delight",
    deliverDelightDesc: "You receive your personalized song in high-quality digital format, ready to bring smiles and emotions.",
    
    // Contact Page
    contactTitle: "Contact Us",
    contactSubtitle: "Get in touch with us for any questions or to start your musical journey",
    getInTouch: "Get In Touch",
    contactDescription: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    emailUs: "Email Us",
    callUs: "Call Us",
    visitUs: "Visit Us",
    sendMessage: "Send Message",
    yourName: "Your name",
    yourEmail: "Your email",
    phoneNumber: "Phone number",
    yourMessage: "Your message",
    sendMessageBtn: "Send Message",
    messageSent: "Message sent!",
    messageThankYou: "Thank you for your message. We will get back to you soon.",
    
    // Testimonials Page
    testimonialsTitle: "What Our Customers Say",
    testimonialsSubtitle: "Real testimonials from satisfied customers who love their personalized songs",
    
    // Individual Testimonials
    testimonial1Name: "Ana M.",
    testimonial1Location: "Bucharest",
    testimonial1Review: "I received a personalized song for my birthday and it was absolutely perfect! The emotion I felt when I heard it for the first time was indescribable.",
    
    testimonial2Name: "Nati G.",
    testimonial2Location: "Cluj-Napoca",
    testimonial2Review: "Exceptional service! The song created for our wedding was exactly what we wanted. All guests were impressed by the originality and quality of the piece.",
    
    testimonial3Name: "TechCorp",
    testimonial3Location: "Timișoara",
    testimonial3Review: "We ordered a song for our marketing campaign and the result exceeded all expectations. Professionalism and creativity at the highest level!",
    
    testimonial4Name: "Maria P.",
    testimonial4Location: "Iași",
    testimonial4Review: "The most beautiful surprise I could give my husband! The personalized song for our anniversary was emotional and memorable.",
    
    testimonial5Name: "Alex R.",
    testimonial5Location: "Brașov",
    testimonial5Review: "Impeccable quality and attention to detail! The team managed to perfectly capture our story in the song. I recommend with confidence!",
    
    // Testimonials
    testimonialQuote: "I ordered a song for my wife on our anniversary and it was the most beautiful gift I could offer. The quality of the music and emotion in the lyrics moved us to tears.",
    testimonialAuthor: "Alexandru M., Bucharest",
    
    // Footer
    footerDescription: "Creating personalized musical gifts. Transform your special moments into beautiful custom songs.",
    contactInfo: "Contact Info",
    stayUpdated: "Stay Updated",
    newsletterDescription: "Subscribe to get special offers, new packages, and exclusive musical content delivered to your inbox.",
    enterEmail: "Enter your email address",
    subscribe: "Subscribe",
    subscribeDisclaimer: "By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.",
    legal: "Legal",
    termsConditions: "Terms & Conditions",
    privacyPolicy: "Privacy Policy",
    refundPolicy: "Refund Policy",
    cookiePolicy: "Cookie Policy",
    copyright: "© 2025 MusicGift.ro. All rights reserved. Made by RED DOMAIN with ❤️ for music lovers.",
    
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
    
    // Package Labels
    personalPackage: "Forfait Personnel",
    businessPackage: "Forfait Entreprise",
    premiumPackage: "Forfait Premium",
    artistPackage: "Forfait Artiste",
    instrumentalPackage: "Forfait Instrumental",
    remixPackage: "Forfait Remix",
    giftPackage: "Forfait Cadeau",
    
    // ... add more French package translations following the same pattern
    heroTitle: "Transformez vos émotions en musique",
    heroSubtitle: "Le plus beau cadeau : une chanson créée spécialement pour quelqu'un de cher.",
    seePackages: "Voir les forfaits",
    listenToSamples: "Écouter les échantillons",
    
    // About Page
    aboutSubtitle: "À propos de nous",
    aboutNewDescription1: "Nous sommes une équipe passionnée de musique et de technologie, dédiée à transformer vos émotions et souvenirs en mélodies uniques et personnalisées. Avec des années d'expérience dans l'industrie musicale, nous créons des cadeaux musicaux qui touchent le cœur et restent dans l'âme pour toujours.",
    aboutNewDescription2: "Chaque chanson que nous créons est une histoire unique, construite avec attention aux détails et amour pour la musique. Nous utilisons les technologies les plus avancées et notre talent artistique pour donner vie à vos rêves musicaux.",
    songsCreated: "Chansons Créées",
    yearsExperience: "Années d'Expérience",
    clientSatisfaction: "Satisfaction Client",
    whoWeAre: "Qui Nous Sommes",
    mihaiGruiaTitle: "Mihai Gruia - Compositeur Principal",
    mihaiGruiaDescription: "Avec plus de 10 ans d'expérience en composition musicale, Mihai apporte créativité et professionnalisme à chaque projet, transformant les émotions en mélodies mémorables.",
    mangoRecordsTitle: "Mango Records - Partenaires de Production",
    mangoRecordsDescription: "Studio d'enregistrement professionnel avec équipement de pointe, assurant la qualité supérieure de chaque chanson produite.",
    domgStudioTitle: "DOMG Studio - Production Audio",
    domgStudioDescription: "Experts en production audio et mastering, DOMG Studio fournit le son cristallin que mérite chaque mélodie personnalisée.",
    doMusicForGoodTitle: "Do Music For Good - Notre Mission",
    doMusicForGoodDescription: "Nous croyons que la musique a le pouvoir de changer des vies et de rassembler les gens. Chaque projet contribue à un monde plus beau grâce à la musique.",
    
    // How It Works Page
    howItWorksTitle: "Comment ça marche",
    choosePackage: "Choisir le forfait",
    choosePackageDesc: "Sélectionnez le forfait parfait qui correspond à vos besoins et budget parmi notre gamme variée d'options.",
    tellYourStory: "Racontez votre histoire",
    tellYourStoryDesc: "Partagez avec nous les moments spéciaux, émotions et détails qui rendent votre histoire unique et mémorable.",
    weCreate: "Nous créons la musique",
    weCreateDesc: "Notre équipe de compositeurs professionnels transforme votre histoire en mélodie originale et personnalisée.",
    deliverDelight: "Livrer la joie",
    deliverDelightDesc: "Vous recevez votre chanson personnalisée en format numérique haute qualité, prête à apporter sourires et émotions.",
    
    // Contact Page
    contactTitle: "Contactez-nous",
    contactSubtitle: "Contactez-nous pour toutes questions ou pour commencer votre voyage musical",
    getInTouch: "Entrer en contact",
    contactDescription: "Nous aimerions avoir de vos nouvelles. Envoyez-nous un message et nous répondrons dès que possible.",
    emailUs: "Nous envoyer un email",
    callUs: "Nous appeler",
    visitUs: "Nous rendre visite",
    sendMessage: "Envoyer un message",
    yourName: "Votre nom",
    yourEmail: "Votre email",
    phoneNumber: "Numéro de téléphone",
    yourMessage: "Votre message",
    sendMessageBtn: "Envoyer le message",
    messageSent: "Message envoyé !",
    messageThankYou: "Merci pour votre message. Nous vous répondrons bientôt.",
    
    // Testimonials Page
    testimonialsTitle: "Ce que disent nos clients",
    testimonialsSubtitle: "Témoignages réels de clients satisfaits qui adorent leurs chansons personnalisées",
    
    // Individual Testimonials
    testimonial1Name: "Ana M.",
    testimonial1Location: "Bucarest",
    testimonial1Review: "J'ai reçu une chanson personnalisée pour mon anniversaire et c'était absolument parfait ! L'émotion que j'ai ressentie en l'entendant pour la première fois était indescriptible.",
    
    testimonial2Name: "Nati G.",
    testimonial2Location: "Cluj-Napoca",
    testimonial2Review: "Service exceptionnel ! La chanson créée pour notre mariage était exactement ce que nous voulions. Tous les invités ont été impressionnés par l'originalité et la qualité de la pièce.",
    
    testimonial3Name: "TechCorp",
    testimonial3Location: "Timișoara",
    testimonial3Review: "Nous avons commandé une chanson pour notre campagne marketing et le résultat a dépassé toutes les attentes. Professionnalisme et créativité au plus haut niveau !",
    
    testimonial4Name: "Maria P.",
    testimonial4Location: "Iași",
    testimonial4Review: "La plus belle surprise que je pouvais faire à mon mari ! La chanson personnalisée pour notre anniversaire était émouvante et mémorable.",
    
    testimonial5Name: "Alex R.",
    testimonial5Location: "Brașov",
    testimonial5Review: "Qualité impeccable et attention aux détails ! L'équipe a réussi à capturer parfaitement notre histoire dans la chanson. Je recommande en toute confiance !",
    
    // Footer
    footerDescription: "Créer des cadeaux musicaux personnalisés. Transformez vos moments spéciaux en belles chansons personnalisées.",
    contactInfo: "Informations de contact",
    stayUpdated: "Restez informé",
    newsletterDescription: "Abonnez-vous pour recevoir des offres spéciales, de nouveaux forfaits et du contenu musical exclusif dans votre boîte de réception.",
    enterEmail: "Entrez votre adresse email",
    subscribe: "S'abonner",
    subscribeDisclaimer: "En vous abonnant, vous acceptez notre Politique de confidentialité et consentez à recevoir des mises à jour de notre entreprise.",
    legal: "Légal",
    termsConditions: "Termes et conditions",
    privacyPolicy: "Politique de confidentialité",
    refundPolicy: "Politique de remboursement",
    cookiePolicy: "Politique des cookies",
    copyright: "© 2025 MusicGift.ro. Tous droits réservés. Fait par RED DOMAIN avec ❤️ pour les amoureux de la musique.",
    
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
    checkBackLater: "Veuillez revenir plus tard."
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
    
    // Package Labels
    personalPackage: "Pakiet Osobisty",
    businessPackage: "Pakiet Biznesowy",
    premiumPackage: "Pakiet Premium",
    artistPackage: "Pakiet Artysty",
    instrumentalPackage: "Pakiet Instrumentalny",
    remixPackage: "Pakiet Remix",
    giftPackage: "Pakiet Prezentowy",
    
    // ... add more Polish package translations following the same pattern
    heroTitle: "Przekształć swoje emocje w muzykę",
    heroSubtitle: "Najpiękniejszy prezent: piosenka stworzona specjalnie dla kogoś bliskiego.",
    seePackages: "Zobacz pakiety",
    listenToSamples: "Posłuchaj próbek",
    
    // About Page
    aboutSubtitle: "O nas",
    aboutNewDescription1: "Jesteśmy zespołem pasjonatów muzyki i technologii, oddanym przekształcaniu twoich emocji i wspomnień w unikalne i spersonalizowane melodie. Z latami doświadczenia w branży muzycznej, tworzymy prezenty muzyczne, które dotykają serca i pozostają w duszy na zawsze.",
    aboutNewDescription2: "Każda piosenka, którą tworzymy, to unikalna historia, zbudowana z dbałością o szczegóły i miłością do muzyki. Używamy najnowszych technologii i naszego talentu artystycznego, aby ożywić twoje muzyczne marzenia.",
    songsCreated: "Utworzone Piosenki",
    yearsExperience: "Lata Doświadczenia",
    clientSatisfaction: "Zadowolenie Klientów",
    whoWeAre: "Kim Jesteśmy",
    mihaiGruiaTitle: "Mihai Gruia - Główny Kompozytor",
    mihaiGruiaDescription: "Z ponad 10-letnim doświadczeniem w komponowaniu muzyki, Mihai wnosi kreatywność i profesjonalizm do każdego projektu, przekształcając emocje w niezapomniane melodie.",
    mangoRecordsTitle: "Mango Records - Partnerzy Produkcyjni",
    mangoRecordsDescription: "Profesjonalne studio nagraniowe z najnowocześniejszym sprzętem, zapewniające najwyższą jakość każdej wyprodukowanej piosenki.",
    domgStudioTitle: "DOMG Studio - Produkcja Audio",
    domgStudioDescription: "Eksperci w produkcji audio i masteringu, DOMG Studio zapewnia krystalicznie czysty dźwięk, na który zasługuje każda spersonalizowana melodia.",
    doMusicForGoodTitle: "Do Music For Good - Nasza Misja",
    doMusicForGoodDescription: "Wierzymy, że muzyka ma moc zmieniania życia i łączenia ludzi. Każdy projekt przyczynia się do piękniejszego świata poprzez muzykę.",
    
    // How It Works Page
    howItWorksTitle: "Jak to działa",
    choosePackage: "Wybierz pakiet",
    choosePackageDesc: "Wybierz idealny pakiet, który odpowiada Twoim potrzebom i budżetowi z naszej zróżnicowanej gamy opcji.",
    tellYourStory: "Opowiedz swoją historię",
    tellYourStoryDesc: "Podziel się z nami wyjątkowymi momentami, emocjami i szczegółami, które czynią Twoją historię unikalną i niezapomnianą.",
    weCreate: "Tworzymy muzykę",
    weCreateDesc: "Nasz zespół profesjonalnych kompozytorów przekształca Twoją historię w oryginalną i spersonalizowaną melodię.",
    deliverDelight: "Dostarczamy radość",
    deliverDelightDesc: "Otrzymujesz swoją spersonalizowaną piosenkę w wysokiej jakości formacie cyfrowym, gotową do przynoszenia uśmiechu i emocji.",
    
    // Contact Page
    contactTitle: "Skontaktuj się z nami",
    contactSubtitle: "Skontaktuj się z nami w przypadku pytań lub aby rozpocząć swoją muzyczną podróż",
    getInTouch: "Skontaktuj się",
    contactDescription: "Chcielibyśmy usłyszeć od Ciebie. Wyślij nam wiadomość, a odpowiemy tak szybko, jak to możliwe.",
    emailUs: "Napisz do nas",
    callUs: "Zadzwoń do nas",
    visitUs: "Odwiedź nas",
    sendMessage: "Wyślij wiadomość",
    yourName: "Twoje imię",
    yourEmail: "Twój email",
    phoneNumber: "Numer telefonu",
    yourMessage: "Twoja wiadomość",
    sendMessageBtn: "Wyślij wiadomość",
    messageSent: "Wiadomość wysłana!",
    messageThankYou: "Dziękujemy za Twoją wiadomość. Wkrótce się z Tobą skontaktujemy.",
    
    // Testimonials Page
    testimonialsTitle: "Co mówią nasi klienci",
    testimonialsSubtitle: "Prawdziwe opinie zadowolonych klientów, którzy pokochali swoje spersonalizowane piosenki",
    
    // Individual Testimonials
    testimonial1Name: "Ana M.",
    testimonial1Location: "Bukareszt",
    testimonial1Review: "Otrzymałam spersonalizowaną piosenkę na moje urodziny i była absolutnie idealna! Emocje, które poczułam, słysząc ją po raz pierwszy, były nie do opisania.",
    
    testimonial2Name: "Nati G.",
    testimonial2Location: "Cluj-Napoca",
    testimonial2Review: "Wyjątkowa obsługa! Piosenka stworzona na nasz ślub była dokładnie tym, czego chcieliśmy. Wszyscy goście byli pod wrażeniem oryginalności i jakości utworu.",
    
    testimonial3Name: "TechCorp",
    testimonial3Location: "Timișoara",
    testimonial3Review: "Zamówiliśmy piosenkę do naszej kampanii marketingowej, a rezultat przewyższył wszystkie oczekiwania. Profesjonalizm i kreatywność na najwyższym poziomie!",
    
    testimonial4Name: "Maria P.",
    testimonial4Location: "Iași",
    testimonial4Review: "Najpiękniejsza niespodzianka, jaką mogłam sprawić mężowi! Spersonalizowana piosenka na naszą rocznicę była wzruszająca i niezapomniana.",
    
    testimonial5Name: "Alex R.",
    testimonial5Location: "Brașov",
    testimonial5Review: "Nienagannej jakości i dbałość o szczegóły! Zespół zdołał doskonale uchwycić naszą historię w piosence. Polecam z pełnym zaufaniem!",
    
    // Footer
    footerDescription: "Tworzymy spersonalizowane prezenty muzyczne. Przekształć swoje wyjątkowe momenty w piękne, spersonalizowane piosenki.",
    contactInfo: "Informacje kontaktowe",
    stayUpdated: "Bądź na bieżąco",
    newsletterDescription: "Zapisz się, aby otrzymywać specjalne oferty, nowe pakiety i ekskluzywną zawartość muzyczną do swojej skrzynki odbiorczej.",
    enterEmail: "Wprowadź swój adres email",
    subscribe: "Zapisz się",
    subscribeDisclaimer: "Zapisując się, zgadzasz się na naszą Politykę prywatności i wyrażasz zgodę na otrzymywanie aktualizacji od naszej firmy.",
    legal: "Prawne",
    termsConditions: "Regulamin",
    privacyPolicy: "Polityka prywatności",
    refundPolicy: "Polityka zwrotów",
    cookiePolicy: "Polityka cookies",
    copyright: "© 2025 MusicGift.ro. Wszelkie prawa zastrzeżone. Stworzone przez RED DOMAIN z ❤️ dla miłośników muzyki.",
    
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
    checkBackLater: "Sprawdź ponownie później."
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
    
    // Package Labels
    personalPackage: "Persönliches Paket",
    businessPackage: "Business Paket",
    premiumPackage: "Premium Paket",
    artistPackage: "Künstler Paket",
    instrumentalPackage: "Instrumental Paket",
    remixPackage: "Remix Paket",
    giftPackage: "Geschenk Paket",
    
    // ... add more German package translations following the same pattern
    heroTitle: "Verwandle deine Emotionen in Musik",
    heroSubtitle: "Das schönste Geschenk: ein Lied, das speziell für jemand Besonderen geschrieben wurde.",
    seePackages: "Pakete ansehen",
    listenToSamples: "Hörproben anhören",
    
    // About Page
    aboutSubtitle: "Über uns",
    aboutNewDescription1: "Wir sind ein leidenschaftliches Team von Musik- und Technologie-Enthusiasten, das sich der Verwandlung deiner Emotionen und Erinnerungen in einzigartige und personalisierte Melodien widmet. Mit jahrelanger Erfahrung in der Musikindustrie schaffen wir musikalische Geschenke, die das Herz berühren und für immer in der Seele bleiben.",
    aboutNewDescription2: "Jedes Lied, das wir schaffen, ist eine einzigartige Geschichte, gebaut mit Liebe zum Detail und Leidenschaft für Musik. Wir verwenden die fortschrittlichsten Technologien und unser künstlerisches Talent, um deine musikalischen Träume zum Leben zu erwecken.",
    songsCreated: "Erstellte Songs",
    yearsExperience: "Jahre Erfahrung",
    clientSatisfaction: "Kundenzufriedenheit",
    whoWeAre: "Wer wir sind",
    mihaiGruiaTitle: "Mihai Gruia - Hauptkomponist",
    mihaiGruiaDescription: "Mit über 10 Jahren Erfahrung in der Musikkomposition bringt Mihai Kreativität und Professionalität in jedes Projekt und verwandelt Emotionen in unvergessliche Melodien.",
    mangoRecordsTitle: "Mango Records - Produktionspartner",
    mangoRecordsDescription: "Professionelles Aufnahmestudio mit modernster Ausrüstung, das die überlegene Qualität jedes produzierten Songs gewährleistet.",
    domgStudioTitle: "DOMG Studio - Audioproduktion",
    domgStudioDescription: "Experten in Audioproduktion und Mastering, DOMG Studio bietet den kristallklaren Sound, den jede personalisierte Melodie verdient.",
    doMusicForGoodTitle: "Do Music For Good - Unsere Mission",
    doMusicForGoodDescription: "Wir glauben, dass Musik die Kraft hat, Leben zu verändern und Menschen zusammenzubringen. Jedes Projekt trägt zu einer schöneren Welt durch Musik bei.",
    
    // How It Works Page
    howItWorksTitle: "Wie es funktioniert",
    choosePackage: "Paket wählen",
    choosePackageDesc: "Wähle das perfekte Paket, das deinen Bedürfnissen entspricht.",
    tellYourStory: "Erzähle deine Geschichte",
    tellYourStoryDesc: "Teile mit uns die besonderen Momente, die deine Geschichte einzigartig machen.",
    weCreate: "Wir schaffen Musik",
    weCreateDesc: "Unser Team verwandelt deine Geschichte in eine originelle Melodie.",
    deliverDelight: "Freude liefern",
    deliverDelightDesc: "Du erhältst deinen personalisierten Song in hochwertigem Format.",
    
    // Contact Page
    contactTitle: "Kontaktiere uns",
    contactSubtitle: "Kontaktiere uns bei Fragen oder um deine musikalische Reise zu beginnen",
    getInTouch: "Kontakt aufnehmen",
    contactDescription: "Wir würden gerne von dir hören. Sende uns eine Nachricht.",
    emailUs: "E-Mail senden",
    callUs: "Anrufen",
    visitUs: "Besuche uns",
    sendMessage: "Nachricht senden",
    yourName: "Dein Name",
    yourEmail: "Deine E-Mail",
    phoneNumber: "Telefonnummer",
    yourMessage: "Deine Nachricht",
    sendMessageBtn: "Nachricht senden",
    messageSent: "Nachricht gesendet!",
    messageThankYou: "Danke für deine Nachricht. Wir melden uns bald bei dir.",
    
    // Testimonials Page
    testimonialsTitle: "Was unsere Kunden sagen",
    testimonialsSubtitle: "Echte Testimonials von zufriedenen Kunden, die ihre personalisierten Songs lieben",
    
    // Individual Testimonials
    testimonial1Name: "Ana M.",
    testimonial1Location: "Bukarest",
    testimonial1Review: "Ich habe ein personalisiertes Lied für meinen Geburtstag erhalten und es war absolut perfekt! Die Emotion, die ich beim ersten Hören gespürt habe, war unbeschreiblich.",
    
    testimonial2Name: "Nati G.",
    testimonial2Location: "Cluj-Napoca",
    testimonial2Review: "Außergewöhnlicher Service! Das Lied, das für unsere Hochzeit erstellt wurde, war genau das, was wir wollten. Alle Gäste waren beeindruckt.",
    
    testimonial3Name: "TechCorp",
    testimonial3Location: "Timișoara",
    testimonial3Review: "Wir haben ein Lied für unsere Marketingkampagne bestellt und das Ergebnis übertraf alle Erwartungen.",
    
    testimonial4Name: "Maria P.",
    testimonial4Location: "Iași",
    testimonial4Review: "Die schönste Überraschung, die ich meinem Mann machen konnte! Die personalisierte Melodie war emotional und unvergesslich.",
    
    testimonial5Name: "Alex R.",
    testimonial5Location: "Brașov",
    testimonial5Review: "Tadellose Qualität und Liebe zum Detail! Ich empfehle mit vollem Vertrauen!",
    
    // Footer
    footerDescription: "Personalisierte Musikgeschenke erstellen. Verwandle deine besonderen Momente in schöne, maßgeschneiderte Songs.",
    contactInfo: "Kontaktinformationen",
    stayUpdated: "Bleib auf dem Laufenden",
    newsletterDescription: "Abonniere, um spezielle Angebote zu erhalten.",
    enterEmail: "Gib deine E-Mail-Adresse ein",
    subscribe: "Abonnieren",
    subscribeDisclaimer: "Durch das Abonnieren stimmst du unserer Datenschutzerklärung zu.",
    legal: "Rechtliches",
    termsConditions: "Geschäftsbedingungen",
    privacyPolicy: "Datenschutzerklärung",
    refundPolicy: "Rückerstattungsrichtlinie",
    cookiePolicy: "Cookie-Richtlinie",
    copyright: "© 2025 MusicGift.ro. Alle Rechte vorbehalten.",
    
    // Packages Section
    chooseYourPackage: "Wähle dein Paket",
    selectPerfectPackage: "Wähle das perfekte Musikpaket, das deinen Bedürfnissen entspricht",
    loadingPackages: "Pakete werden geladen...",
    failedToLoadPackages: "Pakete konnten nicht geladen werden. Bitte versuche es später erneut.",
    reload: "Neu laden",
    mostPopular: "Am beliebtesten",
    whatsIncluded: "Was enthalten ist",
    moreFeatures: "weitere Funktionen",
    learnMore: "Mehr erfahren",
    viewAllPackages: "Alle Pakete anzeigen",
    noPackagesAvailable: "Momentan sind keine Pakete verfügbar.",
    checkBackLater: "Bitte schaue später wieder vorbei."
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ro');

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
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
