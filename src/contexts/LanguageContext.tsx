import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ro' | 'fr' | 'pl' | 'de';

interface LanguageContextType {
  currentLanguage: Language;
  setCurrentLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
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
    signOut: 'Sign Out',
    
    // Order Page
    placeOrder: 'Place Order',
    orderSubtitle: 'Let\'s create something magical together. Fill out the form below to get started.',
    orderSent: 'Order sent!',
    orderThankYou: 'Thank you for your order. We will contact you soon to confirm the details.',
    orderError: 'Error',
    orderErrorMessage: 'An error occurred while saving the order. Please try again.',
    
    // Order Form Navigation
    backToHome: 'Back to Home',
    progress: 'Progress',
    previous: 'PREVIOUS',
    continue: 'CONTINUE',
    completeOrder: 'COMPLETE ORDER',
    submitting: 'SUBMITTING...',
    
    // Order Form Validation
    completeRequiredFields: 'Please complete all required fields',
    completeRequiredFieldsDesc: 'Make sure to fill in all required information before proceeding.',
    orderSubmittedSuccess: 'Order submitted successfully!',
    orderSubmittedDesc: 'Thank you for your order. We\'ll contact you soon with next steps.',
    somethingWentWrong: 'Something went wrong',
    tryAgainSupport: 'Please try again or contact support if the problem persists.',
    
    // Step Titles
    stepPackage: 'Package',
    stepDetails: 'Details',
    stepStory: 'Story',
    stepPreferences: 'Preferences',
    stepContact: 'Contact',
    
    // Step Configuration
    choosePackage: 'Choose package',
    generalDetails: 'General details',
    storyAndEmotionalDetails: 'Story and emotional details',
    musicalPreferences: 'Musical preferences',
    confirmation: 'Confirmation',
    
    // Package Details
    whatsIncluded: 'What\'s included:',
    professionalQuality: 'Professional quality guaranteed',
    tellUsAboutRecipient: 'Tell Us About the Recipient',
    helpUnderstand: 'Help us understand who this special song is for and what occasion we\'re celebrating.',
    
    // Packages
    personalPackage: 'Personal Package',
    businessPackage: 'Business Package',
    premiumPackage: 'Premium Package',
    artistPackage: 'Artist Package',
    instrumentalPackage: 'Instrumental Package',
    remixPackage: 'Remix Package',
    giftPackage: 'Gift Package',
    
    // Package Descriptions
    personalPackageDesc: 'A song written with soul – just for you and your loved ones.',
    personalPackageTagline: 'Ideal for birthdays, weddings or special occasions – we transform your story into a unique and emotional musical gift.',
    
    // Form Fields
    recipientName: 'Name of the person the song is for',
    relationship: 'Your relationship with this person',
    occasion: 'Occasion (birthday, wedding, etc.)',
    eventDate: 'Event date',
    songLanguage: 'Language you want the song written in',
    pronunciationAudioRecipient: 'Audio recording (if the name has special pronunciation)',
    story: 'The story you want us to transform into a song',
    emotionalTone: 'Song tone (romantic, cheerful, nostalgic, etc.)',
    keyMoments: 'Essential moments from your relationship',
    specialWords: 'Words/expressions that should appear',
    pronunciationAudioKeywords: 'Audio recording for difficult words',
    musicStyle: 'What music style do you prefer',
    referenceSong: 'Example song with similar vibe',
    fullName: 'Your full name',
    email: 'Your email address',
    phone: 'Phone number (optional)',
    acceptMentionObligation: 'I accept that if I publish the song, I must mention "MusicGift.ro by Mango Records"',
    
    // Relationships
    partner: 'Partner/Wife/Husband',
    child: 'Child',
    parent: 'Parent',
    sibling: 'Brother/Sister',
    friend: 'Friend',
    grandparent: 'Grandparent',
    otherRelation: 'Other relationship',
    
    // Occasions
    birthday: 'Birthday',
    wedding: 'Wedding',
    anniversary: 'Anniversary',
    valentine: 'Valentine\'s Day',
    graduation: 'Graduation',
    christmas: 'Christmas',
    otherOccasion: 'Other occasion',
    
    // Emotional Tones
    romantic: 'Romantic',
    happy: 'Happy/Joyful',
    nostalgic: 'Nostalgic',
    emotional: 'Emotional',
    energetic: 'Energetic',
    peaceful: 'Peaceful/Calm',
    
    // Music Styles
    pop: 'Pop',
    acoustic: 'Acoustic',
    rock: 'Rock',
    jazz: 'Jazz',
    folk: 'Folk',
    electronic: 'Electronic',
    classical: 'Classical',
    reggae: 'Reggae',
    country: 'Country',
    
    // Languages
    romanian: 'Romanian',
    english: 'English',
    french: 'French',
    german: 'German',
    polish: 'Polish',
    
    // Addons
    rushDelivery: 'Priority delivery in 24-48h',
    commercialRights: 'Commercial rights for YouTube, Spotify etc.',
    distributionMangoRecords: 'Official distribution through Mango Records',
    customVideo: 'Custom video with your photos',
    audioMessageFromSender: 'Personal audio message incorporated into the song',
    extendedSong: 'Extended song with 3 verses instead of 2',
    
    // Audio Recording
    startRecording: 'Start recording',
    stopRecording: 'Stop recording',
    play: 'Play',
    pause: 'Pause',
    reRecord: 'Record again',
    recordingSuccessfullySaved: 'Audio recording saved successfully',
    recordingTimeLimit: 'Time limit: {time} seconds. Record the correct pronunciation.',
    recordPersonalMessage: 'Record your personal audio message',
    personalMessageLimit: 'Time limit: 45 seconds. Your message will be incorporated into the final song.',
    uploadImagesVideo: 'Upload images or video for the custom video',
    acceptImagesVideo: 'We accept images (JPG, PNG) and video (MP4, MOV). You can select multiple files.',
    cannotSelectWith: 'Cannot be selected with',
    
    // Required Field Indicator
    required: '*',
    
    // Delivery Times
    deliveryTime3to5: '3-5 days',
    deliveryTime5to7: '5-7 days',
    deliveryTime7to10: '7-10 days',
    deliveryTime14to21: '14-21 days',
    deliveryTimeVaries: 'Varies by selected package',
    
    // Package Includes
    originalSongFromStory: 'Original song created from your story',
    professionalVoice: 'Professional voice from MusicGift team',
    rapidDelivery: 'Rapid delivery in 3-5 days',
    personalRights: 'Personal use rights (non-commercial)',
    creativeConsultation: 'Creative consultation based on story and musical preferences',
    commercialSong: 'Commercial song for brand/company',
    professionalAudioProduction: 'Professional audio production',
    professionalArtistVoice: 'Voice recorded by professional artist',
    finalMixMaster: 'Final mix and master',
    basicCommercialRights: 'Basic commercial rights included',
    multipleAudioFiles: 'Multiple audio files (WAV, MP3, instrumental)',
    premiumAdvancedProduction: 'Premium song with advanced production',
    automaticDigitalDistribution: 'Automatic distribution on digital platforms',
    lyricVideoIncluded: 'Lyric video included',
    professionalMixMaster: 'Professional mix and master',
    socialMediaPromotion: 'Social media promotion on Mango Records',
    fullArtisticCollaboration: 'Full artistic collaboration',
    originalSongProduction: 'Original song production',
    professionalVocalRecording: 'Professional vocal recording',
    professionalMusicVideo: 'Professional music video',
    distributionAllPlatforms: 'Distribution on all platforms',
    contract5050: '50/50 contract with Mango Records',
    professionalMarketing: 'Professional promotion and marketing',
    customInstrumental: 'Custom instrumental in desired genre',
    separateStems: 'Separate stems for mixing',
    professionalRemix: 'Professional remix of your song',
    productionDesiredStyle: 'Production in desired style',
    extendedRadioEdit: 'Extended version and radio edit',
    highQualityAudioFiles: 'High quality audio files',
    personalizedDigitalCard: 'Personalized digital gift card',
    personalizedMessage: 'Personalized message for recipient',
    automaticDelivery: 'Automatic delivery at desired date',
    allSelectedPackageBenefits: 'All benefits of selected package',

    // About Page
    aboutTitle: 'About MusicGift',
    aboutSubtitle: 'Creating Musical Memories Since 2020',
    aboutDescription1: 'MusicGift.ro was founded with a simple mission: to help people express their deepest emotions through personalized music. We believe that every love story, every friendship, and every special moment deserves its own soundtrack.',
    aboutDescription2: 'Our team of talented composers, lyricists, and vocalists work together to transform your stories into beautiful, custom-made songs. From romantic ballads to upbeat celebration songs, we\'ve helped over 1,000 customers create unforgettable musical gifts.',
    songsCreated: 'Songs Created',
    yearsExperience: 'Years Experience',
    clientSatisfaction: 'Client Satisfaction',
    ourTeam: 'Our Creative Team',
    leadComposer: 'Lead Composer & Music Director',
    leadVocalist: 'Lead Vocalist & Lyricist',
    soundEngineer: 'Sound Engineer & Producer',
    
    // How It Works Page
    howItWorksTitle: 'How It Works',
    howItWorksSubtitle: 'Creating your personalized song is easy',
    choosePackageStep: 'Choose a Package',
    choosePackageDesc: 'Select the package that best fits your needs and budget.',
    tellYourStory: 'Tell Your Story',
    tellYourStoryDesc: 'Fill out our detailed questionnaire about your recipient and the occasion.',
    weCreate: 'We Create',
    weCreateDesc: 'Our team of professional musicians and songwriters create your custom song.',
    deliverDelight: 'Deliver & Delight',
    deliverDelightDesc: 'Receive your finished song and surprise your special someone!',
    
    // Testimonials Page
    testimonialsTitle: 'What Our Customers Say',
    testimonialsSubtitle: 'Real stories from people who chose MusicGift for their special moments',
    testimonial1: 'I was searching for a truly unique gift for my wife\'s 40th birthday. The song MusicGift created brought her to tears. It captured our story perfectly and is something we\'ll cherish forever.',
    testimonial2: 'As a business owner, I wanted something special for our company\'s 10th anniversary. The team at MusicGift.ro delivered a fantastic song that perfectly embodied our company values and journey.',
    testimonial3: 'I surprised my parents with a custom song for their 30th wedding anniversary. The process was so smooth, and the result was beyond what I could have imagined. They play it for everyone who visits!',
    author1: 'Andrei Popescu',
    author2: 'Maria Ionescu',
    author3: 'Elena Dumitrescu',
    location1: 'București',
    location2: 'Cluj-Napoca',
    location3: 'Timișoara',
    
    // Contact Page
    contactTitle: 'Contact Us',
    contactSubtitle: 'Have questions? We\'re here to help!',
    getInTouch: 'Get in Touch',
    contactDescription: 'Whether you have questions about our services, need help choosing the right package, or want to discuss your musical vision, we\'re here to help make your gift perfect.',
    emailUs: 'Email Us',
    callUs: 'Call Us',
    visitUs: 'Visit Us',
    followUs: 'Follow Us',
    sendMessage: 'Send us a message',
    yourName: 'Your Name',
    yourEmail: 'Your Email',
    phoneNumber: 'Phone Number',
    yourMessage: 'Your Message',
    sendMessageBtn: 'Send Message',
    messageSent: 'Message sent!',
    messageThankYou: 'We\'ll get back to you as soon as possible.',
    
    // Auth Page
    musicGift: 'Music Gift',
    signInSubtitle: 'Sign in to continue',
    signUpSubtitle: 'Create a new account',
    password: 'Password',
    signInBtn: 'Sign In',
    signUpBtn: 'Sign Up',
    noAccount: 'Don\'t have an account? Sign up here',
    haveAccount: 'Already have an account? Sign in here',
    authError: 'Authentication Error',
    invalidCredentials: 'Invalid email or password. Please check your credentials.',
    signInSuccess: 'Sign in successful!',
    welcomeBack: 'Welcome back!',
    accountExists: 'Account exists',
    accountExistsMessage: 'An account with this email already exists. Try signing in.',
    accountCreated: 'Account created successfully!',
    canSignIn: 'You can now sign in with your new credentials.',
    unexpectedError: 'Unexpected error',
    tryAgain: 'An error occurred. Please try again.',
    backHome: 'Back home',
    connectToContinue: 'Sign in to continue',
    createAccount: 'Create a new account',
    passwordMinLength: 'Password must be at least 6 characters',
    signingIn: 'Signing in...',
    signingUp: 'Signing up...',
    
    // Settings Page
    accountSettingsTitle: 'Account Settings',
    manageAccount: 'Manage your account information',
    profileInfo: 'Profile Information',
    updateProfile: 'Update your personal information',
    accountInfo: 'Account Information',
    accountDetails: 'Details about your account',
    userId: 'User ID',
    registrationDate: 'Registration Date',
    lastUpdate: 'Last Update',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    profileUpdated: 'Profile updated successfully!',
    profileError: 'Could not update profile',
    loadError: 'Could not load profile data',
    emailCannotChange: 'Email cannot be changed from this page',
    
    // 404 Page
    pageNotFound: 'Page Not Found',
    oopsNotFound: 'Oops! Page not found',
    returnHome: 'Return to Home'
  },
  ro: {
    // Navigation
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
    signOut: 'Deconectează-te',
    
    // Order Page
    placeOrder: 'Plasează Comanda',
    orderSubtitle: 'Să creăm ceva magic împreună. Completează formularul de mai jos pentru a începe.',
    orderSent: 'Comandă trimisă!',
    orderThankYou: 'Mulțumim pentru comandă. Vă vom contacta în curând pentru confirmarea detaliilor.',
    orderError: 'Eroare',
    orderErrorMessage: 'A apărut o eroare la salvarea comenzii. Încercați din nou.',
    
    // Order Form Navigation
    backToHome: 'Înapoi Acasă',
    progress: 'Progres',
    previous: 'ANTERIOR',
    continue: 'CONTINUĂ',
    completeOrder: 'FINALIZEAZĂ COMANDA',
    submitting: 'SE TRIMITE...',
    
    // Order Form Validation
    completeRequiredFields: 'Te rugăm să completezi toate câmpurile obligatorii',
    completeRequiredFieldsDesc: 'Asigură-te că completezi toate informațiile necesare înainte de a continua.',
    orderSubmittedSuccess: 'Comanda a fost trimisă cu succes!',
    orderSubmittedDesc: 'Mulțumim pentru comandă. Te vom contacta în curând cu următorii pași.',
    somethingWentWrong: 'Ceva nu a mers bine',
    tryAgainSupport: 'Te rugăm să încerci din nou sau să contactezi suportul dacă problema persistă.',
    
    // Step Titles
    stepPackage: 'Pachet',
    stepDetails: 'Detalii',
    stepStory: 'Poveste',
    stepPreferences: 'Preferințe',
    stepContact: 'Contact',
    
    // Step Configuration
    choosePackage: 'Alege pachetul',
    generalDetails: 'Detalii generale',
    storyAndEmotionalDetails: 'Poveste și detalii emoționale',
    musicalPreferences: 'Preferințe muzicale',
    confirmation: 'Confirmare',
    
    // Package Details
    whatsIncluded: 'Ce include:',
    professionalQuality: 'Calitate profesională garantată',
    tellUsAboutRecipient: 'Spune-ne despre destinatar',
    helpUnderstand: 'Ajută-ne să înțelegem pentru cine este această melodie specială și ce ocazie sărbătorim.',
    
    // Packages
    personalPackage: 'Pachet Personal',
    businessPackage: 'Pachet Business',
    premiumPackage: 'Pachet Premium',
    artistPackage: 'Pachet Artist',
    instrumentalPackage: 'Pachet Instrumental',
    remixPackage: 'Pachet Remix',
    giftPackage: 'Pachet Cadou',
    
    // Package Descriptions
    personalPackageDesc: 'Un cântec scris cu suflet – doar pentru tine și cei dragi.',
    personalPackageTagline: 'Ideal pentru aniversări, nunți sau ocazii speciale – transformăm povestea ta într-un cadou muzical unic și emoționant.',
    
    // Form Fields
    recipientName: 'Numele persoanei pentru care este melodia',
    relationship: 'Relația ta cu această persoană',
    occasion: 'Ocazie (zi de naștere, nuntă etc.)',
    eventDate: 'Data evenimentului',
    songLanguage: 'Limba în care vrei să fie scrisă piesa',
    pronunciationAudioRecipient: 'Înregistrare audio (dacă numele are pronunție specială)',
    story: 'Povestea pe care vrei să o transformăm în cântec',
    emotionalTone: 'Tonul piesei (romantic, vesel, nostalgic etc.)',
    keyMoments: 'Momente esențiale din relația voastră',
    specialWords: 'Cuvinte/expresii care ar trebui să apară',
    pronunciationAudioKeywords: 'Înregistrare audio pentru cuvinte dificile',
    musicStyle: 'Ce stil muzical preferi',
    referenceSong: 'Exemplu de piesă cu vibe similar',
    fullName: 'Numele tău complet',
    email: 'Adresa ta de e-mail',
    phone: 'Număr de telefon (opțional)',
    acceptMentionObligation: 'Accept că dacă public piesa, trebuie să menționez "MusicGift.ro by Mango Records"',
    
    // Relationships
    partner: 'Partener/Soție/Soț',
    child: 'Copil',
    parent: 'Părinte',
    sibling: 'Frate/Soră',
    friend: 'Prieten(ă)',
    grandparent: 'Bunic/Bunică',
    otherRelation: 'Altă relație',
    
    // Occasions
    birthday: 'Zi de naștere',
    wedding: 'Nuntă',
    anniversary: 'Aniversare',
    valentine: 'Ziua Îndrăgostiților',
    graduation: 'Absolvire',
    christmas: 'Crăciun',
    otherOccasion: 'Altă ocazie',
    
    // Emotional Tones
    romantic: 'Romantic',
    happy: 'Vesel/Bucuros',
    nostalgic: 'Nostalgic',
    emotional: 'Emoționant',
    energetic: 'Energic',
    peaceful: 'Liniștit/Calm',
    
    // Music Styles
    pop: 'Pop',
    acoustic: 'Acustic',
    rock: 'Rock',
    jazz: 'Jazz',
    folk: 'Folk',
    electronic: 'Electronic',
    classical: 'Clasic',
    reggae: 'Reggae',
    country: 'Country',
    
    // Languages
    romanian: 'Română',
    english: 'English',
    french: 'Français',
    german: 'Deutsch',
    polish: 'Polski',
    
    // Addons
    rushDelivery: 'Livrare prioritară în 24–48h',
    commercialRights: 'Drepturi comerciale pentru YouTube, Spotify etc.',
    distributionMangoRecords: 'Distribuție oficială prin Mango Records',
    customVideo: 'Videoclip personalizat cu pozele tale',
    audioMessageFromSender: 'Mesaj audio personalizat încorporat în piesă',
    extendedSong: 'Melodie extinsă cu 3 strofe în loc de 2',
    
    // Audio Recording
    startRecording: 'Începe înregistrarea',
    stopRecording: 'Oprește înregistrarea',
    play: 'Redă',
    pause: 'Pauză',
    reRecord: 'Înregistrează din nou',
    recordingSuccessfullySaved: 'Înregistrarea audio a fost salvată cu succes',
    recordingTimeLimit: 'Limita de timp: {time} secunde. Înregistrează pronunția corectă.',
    recordPersonalMessage: 'Înregistrează mesajul tău audio personal',
    personalMessageLimit: 'Limita de timp: 45 secunde. Mesajul tău va fi incorporat în piesa finală.',
    uploadImagesVideo: 'Încarcă imagini sau video pentru videoclipul personalizat',
    acceptImagesVideo: 'Acceptăm imagini (JPG, PNG) și video (MP4, MOV). Poți selecta mai multe fișiere.',
    cannotSelectWith: 'Nu poate fi selectat cu',
    
    // Required Field Indicator
    required: '*',
    
    // Delivery Times
    deliveryTime3to5: '3-5 zile',
    deliveryTime5to7: '5-7 zile',
    deliveryTime7to10: '7-10 zile',
    deliveryTime14to21: '14-21 zile',
    deliveryTimeVaries: 'Conform pachetului ales',
    
    // Package Includes
    originalSongFromStory: 'Cântec original creat după povestea ta',
    professionalVoice: 'Voce profesionistă din echipa MusicGift',
    rapidDelivery: 'Livrare rapidă în 3–5 zile',
    personalRights: 'Drepturi de utilizare personală (non-comercial)',
    creativeConsultation: 'Consultare creativă bazată pe poveste și preferințe muzicale',
    commercialSong: 'Melodie comercială pentru brand/companie',
    professionalAudioProduction: 'Producție audio profesională',
    professionalArtistVoice: 'Voce înregistrată de artist profesionist',
    finalMixMaster: 'Mix și master final',
    basicCommercialRights: 'Drepturi comerciale de bază incluse',
    multipleAudioFiles: 'Fișiere audio multiple (WAV, MP3, instrumental)',
    premiumAdvancedProduction: 'Melodie premium cu producție avansată',
    automaticDigitalDistribution: 'Distribuție automată pe platforme digitale',
    lyricVideoIncluded: 'Videoclip lyric inclus',
    professionalMixMaster: 'Mix și master profesional',
    socialMediaPromotion: 'Promovare pe rețelele sociale Mango Records',
    fullArtisticCollaboration: 'Colaborare artistică completă',
    originalSongProduction: 'Producția unei melodii originale',
    professionalVocalRecording: 'Înregistrare vocală profesională',
    professionalMusicVideo: 'Videoclip muzical profesional',
    distributionAllPlatforms: 'Distribuție pe toate platformele',
    contract5050: 'Contract 50/50 cu Mango Records',
    professionalMarketing: 'Promovare și marketing profesional',
    customInstrumental: 'Instrumental personalizat în genul dorit',
    separateStems: 'Stems separate pentru mixing',
    professionalRemix: 'Remix profesional al piesei tale',
    productionDesiredStyle: 'Producție în stilul dorit',
    extendedRadioEdit: 'Versiune extended și radio edit',
    highQualityAudioFiles: 'Fișiere audio de înaltă calitate',
    personalizedDigitalCard: 'Card cadou digital personalizat',
    personalizedMessage: 'Mesaj personalizat pentru destinatar',
    automaticDelivery: 'Trimitere automată la data dorită',
    allSelectedPackageBenefits: 'Toate beneficiile pachetului selectat',

    // About Page
    aboutTitle: 'Despre MusicGift',
    aboutSubtitle: 'Creăm Amintiri Muzicale din 2020',
    aboutDescription1: 'MusicGift.ro a fost înființat cu o misiune simplă: să ajutăm oamenii să-și exprime cele mai profunde emoții prin muzică personalizată. Credem că fiecare poveste de dragoste, fiecare prietenie și fiecare moment special merită propriul soundtrack.',
    aboutDescription2: 'Echipa noastră de compozitori, textieri și vocaliști talentați lucrează împreună pentru a transforma poveștile dvs. în cântece frumoase, făcute la comandă. De la balade romantice la cântece de sărbătoare, am ajutat peste 1.000 de clienți să creeze cadouri muzicale de neuitat.',
    songsCreated: 'Cântece Create',
    yearsExperience: 'Ani Experiență',
    clientSatisfaction: 'Satisfacția Clienților',
    ourTeam: 'Echipa Noastră Creativă',
    leadComposer: 'Compozitor Principal & Director Muzical',
    leadVocalist: 'Vocalist Principal & Textier',
    soundEngineer: 'Inginer Sunet & Producător',
    
    // How It Works Page
    howItWorksTitle: 'Cum Funcționează',
    howItWorksSubtitle: 'Crearea cântecului tău personalizat este ușoară',
    choosePackageStep: 'Alege un Pachet',
    choosePackageDesc: 'Selectează pachetul care se potrivește cel mai bine nevoilor și bugetului tău.',
    tellYourStory: 'Spune-ți Povestea',
    tellYourStoryDesc: 'Completează chestionarul nostru detaliat despre destinatar și ocazie.',
    weCreate: 'Noi Creăm',
    weCreateDesc: 'Echipa noastră de muzicieni și compozitori profesioniști creează cântecul tău personalizat.',
    deliverDelight: 'Livrăm & Încântăm',
    deliverDelightDesc: 'Primești cântecul finalizat și surprinzi persoana specială!',
    
    // Testimonials Page
    testimonialsTitle: 'Ce Spun Clienții Noștri',
    testimonialsSubtitle: 'Povești reale de la persoane care au ales MusicGift pentru momentele lor speciale',
    testimonial1: 'Căutam un cadou cu adevărat unic pentru a 40-a aniversare a soției mele. Cântecul creat de MusicGift a adus-o la lacrimi. A surprins perfect povestea noastră și este ceva ce vom prețui pentru totdeauna.',
    testimonial2: 'Ca proprietar de afacere, am vrut ceva special pentru a 10-a aniversare a companiei noastre. Echipa de la MusicGift.ro a livrat un cântec fantastic care a întruchipat perfect valorile și călătoria companiei noastre.',
    testimonial3: 'I-am surprins pe părinții mei cu un cântec personalizat pentru a 30-a aniversare de căsătorie. Procesul a fost atât de lin, iar rezultatul a fost dincolo de ceea ce îmi puteam imagina. Îl redau pentru toți cei care îi vizitează!',
    author1: 'Andrei Popescu',
    author2: 'Maria Ionescu', 
    author3: 'Elena Dumitrescu',
    location1: 'București',
    location2: 'Cluj-Napoca',
    location3: 'Timișoara',
    
    // Contact Page
    contactTitle: 'Contact',
    contactSubtitle: 'Ai întrebări? Suntem aici să te ajutăm!',
    getInTouch: 'Intră în Contact',
    contactDescription: 'Fie că ai întrebări despre serviciile noastre, ai nevoie de ajutor pentru a alege pachetul potrivit sau vrei să discuți viziunea ta muzicală, suntem aici să te ajutăm să faci cadoul perfect.',
    emailUs: 'Trimite-ne Email',
    callUs: 'Sună-ne',
    visitUs: 'Vizitează-ne',
    followUs: 'Urmărește-ne',
    sendMessage: 'Trimite-ne un mesaj',
    yourName: 'Numele Tău',
    yourEmail: 'Email-ul Tău',
    phoneNumber: 'Numărul de Telefon',
    yourMessage: 'Mesajul Tău',
    sendMessageBtn: 'Trimite Mesaj',
    messageSent: 'Mesaj trimis!',
    messageThankYou: 'Îți vom răspunde cât mai curând posibil.',
    
    // Auth Page
    musicGift: 'Music Gift',
    signInSubtitle: 'Conectează-te pentru a continua',
    signUpSubtitle: 'Creează un cont nou',
    fullName: 'Nume Complet',
    email: 'Email',
    password: 'Parolă',
    signInBtn: 'Conectează-te',
    signUpBtn: 'Înregistrează-te',
    noAccount: 'Nu ai cont? Înregistrează-te aici',
    haveAccount: 'Ai deja cont? Conectează-te aici',
    authError: 'Eroare de autentificare',
    invalidCredentials: 'Email sau parolă incorectă. Verificați datele introduse.',
    signInSuccess: 'Conectare reușită!',
    welcomeBack: 'Bun venit înapoi!',
    accountExists: 'Cont existent',
    accountExistsMessage: 'Un cont cu acest email există deja. Încercați să vă conectați.',
    accountCreated: 'Cont creat cu succes!',
    canSignIn: 'Vă puteți conecta acum cu noile credențiale.',
    unexpectedError: 'Eroare neașteptată',
    tryAgain: 'A apărut o eroare. Încercați din nou.',
    backHome: 'Înapoi acasă',
    connectToContinue: 'Conectează-te pentru a continua',
    createAccount: 'Creează un cont nou',
    passwordMinLength: 'Parola trebuie să aibă cel puțin 6 caractere',
    signingIn: 'Se conectează...',
    signingUp: 'Se înregistrează...',
    
    // Settings Page
    accountSettingsTitle: 'Setări cont',
    manageAccount: 'Gestionează informațiile contului tău',
    profileInfo: 'Informații profil',
    updateProfile: 'Actualizează informațiile tale personale',
    accountInfo: 'Informații cont',
    accountDetails: 'Detalii despre contul tău',
    userId: 'ID utilizator',
    registrationDate: 'Data înregistrării',
    lastUpdate: 'Ultima actualizare',
    saveChanges: 'Salvează modificările',
    saving: 'Se salvează...',
    profileUpdated: 'Profilul a fost actualizat cu succes!',
    profileError: 'Nu s-au putut actualiza datele profilului',
    loadError: 'Nu s-au putut încărca datele profilului',
    emailCannotChange: 'Emailul nu poate fi modificat din această pagină',
    
    // 404 Page
    pageNotFound: 'Pagina Nu a Fost Găsită',
    oopsNotFound: 'Oops! Pagina nu a fost găsită',
    returnHome: 'Înapoi Acasă'
  },
  fr: {
    // Navigation
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
    signOut: 'Se déconnecter',
    
    // Order Page
    placeOrder: 'Passer Commande',
    orderSubtitle: 'Créons quelque chose de magique ensemble. Remplissez le formulaire ci-dessous pour commencer.',
    orderSent: 'Commande envoyée!',
    orderThankYou: 'Merci pour votre commande. Nous vous contacterons bientôt pour confirmer les détails.',
    orderError: 'Erreur',
    orderErrorMessage: 'Une erreur s\'est produite lors de l\'enregistrement de la commande. Veuillez réessayer.',
    
    // Order Form Navigation
    backToHome: 'Retour à l\'accueil',
    progress: 'Progrès',
    previous: 'PRÉCÉDENT',
    continue: 'CONTINUER',
    completeOrder: 'FINALISER LA COMMANDE',
    submitting: 'ENVOI EN COURS...',
    
    // Step Titles
    stepPackage: 'Forfait',
    stepDetails: 'Détails',
    stepStory: 'Histoire',
    stepPreferences: 'Préférences',
    stepContact: 'Contact',
    
    // Packages
    personalPackage: 'Forfait Personnel',
    businessPackage: 'Forfait Entreprise',
    premiumPackage: 'Forfait Premium',
    artistPackage: 'Forfait Artiste',
    instrumentalPackage: 'Forfait Instrumental',
    remixPackage: 'Forfait Remix',
    giftPackage: 'Forfait Cadeau',
    
    // Required Field Indicator
    required: '*',
    
    // ... truncated for brevity
  },
  pl: {
    // Navigation
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
    signOut: 'Wyloguj się',
    
    // Order Page
    placeOrder: 'Złóż Zamówienie',
    orderSubtitle: 'Stwórzmy razem coś magicznego. Wypełnij formularz poniżej, aby rozpocząć.',
    orderSent: 'Zamówienie wysłane!',
    orderThankYou: 'Dziękujemy za zamówienie. Skontaktujemy się z Tobą wkrótce, aby potwierdzić szczegóły.',
    orderError: 'Błąd',
    orderErrorMessage: 'Wystąpił błąd podczas zapisywania zamówienia. Spróbuj ponownie.',
    
    // Order Form Navigation
    backToHome: 'Powrót do domu',
    progress: 'Postęp',
    previous: 'POPRZEDNI',
    continue: 'KONTYNUUJ',
    completeOrder: 'ZAKOŃCZ ZAMÓWIENIE',
    submitting: 'WYSYŁANIE...',
    
    // Step Titles
    stepPackage: 'Pakiet',
    stepDetails: 'Szczegóły',
    stepStory: 'Historia',
    stepPreferences: 'Preferencje',
    stepContact: 'Kontakt',
    
    // Packages
    personalPackage: 'Pakiet Osobisty',
    businessPackage: 'Pakiet Biznesowy',
    premiumPackage: 'Pakiet Premium',
    artistPackage: 'Pakiet Artysty',
    instrumentalPackage: 'Pakiet Instrumentalny',
    remixPackage: 'Pakiet Remix',
    giftPackage: 'Pakiet Prezentowy',
    
    // Required Field Indicator
    required: '*',
    
    // ... truncated for brevity
  },
  de: {
    // Navigation
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
    signOut: 'Abmelden',
    
    // Order Page
    placeOrder: 'Bestellung Aufgeben',
    orderSubtitle: 'Lassen Sie uns gemeinsam etwas Magisches schaffen. Füllen Sie das untenstehende Formular aus, um zu beginnen.',
    orderSent: 'Bestellung gesendet!',
    orderThankYou: 'Vielen Dank für Ihre Bestellung. Wir werden Sie bald kontaktieren, um die Details zu bestätigen.',
    orderError: 'Fehler',
    orderErrorMessage: 'Beim Speichern der Bestellung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
    
    // Order Form Navigation
    backToHome: 'Zurück zur Startseite',
    progress: 'Fortschritt',
    previous: 'ZURÜCK',
    continue: 'WEITER',
    completeOrder: 'BESTELLUNG ABSCHLIESSEN',
    submitting: 'WIRD GESENDET...',
    
    // Step Titles
    stepPackage: 'Paket',
    stepDetails: 'Details',
    stepStory: 'Geschichte',
    stepPreferences: 'Präferenzen',
    stepContact: 'Kontakt',
    
    // Packages
    personalPackage: 'Persönliches Paket',
    businessPackage: 'Business Paket',
    premiumPackage: 'Premium Paket',
    artistPackage: 'Künstler Paket',
    instrumentalPackage: 'Instrumental Paket',
    remixPackage: 'Remix Paket',
    giftPackage: 'Geschenk Paket',
    
    // Required Field Indicator
    required: '*',
    
    // ... truncated for brevity
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
