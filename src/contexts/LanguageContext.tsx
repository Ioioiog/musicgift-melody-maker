
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
    choosePackage: 'Choose a Package',
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
    fullName: 'Full Name',
    email: 'Email',
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
    choosePackage: 'Alege un Pachet',
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
    
    // About Page
    aboutTitle: 'À Propos de MusicGift',
    aboutSubtitle: 'Créer des Souvenirs Musicaux Depuis 2020',
    aboutDescription1: 'MusicGift.ro a été fondé avec une mission simple : aider les gens à exprimer leurs émotions les plus profondes à travers la musique personnalisée. Nous croyons que chaque histoire d\'amour, chaque amitié et chaque moment spécial mérite sa propre bande sonore.',
    aboutDescription2: 'Notre équipe de compositeurs, paroliers et vocalistes talentueux travaillent ensemble pour transformer vos histoires en belles chansons sur mesure. Des ballades romantiques aux chansons de célébration entraînantes, nous avons aidé plus de 1 000 clients à créer des cadeaux musicaux inoubliables.',
    songsCreated: 'Chansons Créées',
    yearsExperience: 'Années d\'Expérience',
    clientSatisfaction: 'Satisfaction Client',
    ourTeam: 'Notre Équipe Créative',
    leadComposer: 'Compositeur Principal & Directeur Musical',
    leadVocalist: 'Vocaliste Principal & Parolier',
    soundEngineer: 'Ingénieur du Son & Producteur',
    
    // How It Works Page
    howItWorksTitle: 'Comment Ça Marche',
    howItWorksSubtitle: 'Créer votre chanson personnalisée est facile',
    choosePackage: 'Choisir un Forfait',
    choosePackageDesc: 'Sélectionnez le forfait qui correspond le mieux à vos besoins et votre budget.',
    tellYourStory: 'Racontez Votre Histoire',
    tellYourStoryDesc: 'Remplissez notre questionnaire détaillé sur le destinataire et l\'occasion.',
    weCreate: 'Nous Créons',
    weCreateDesc: 'Notre équipe de musiciens professionnels et compositeurs créent votre chanson personnalisée.',
    deliverDelight: 'Livrer & Ravir',
    deliverDelightDesc: 'Recevez votre chanson finie et surprenez votre personne spéciale!',
    
    // Testimonials Page
    testimonialsTitle: 'Ce Que Disent Nos Clients',
    testimonialsSubtitle: 'Vraies histoires de personnes qui ont choisi MusicGift pour leurs moments spéciaux',
    testimonial1: 'Je cherchais un cadeau vraiment unique pour le 40e anniversaire de ma femme. La chanson créée par MusicGift l\'a fait pleurer. Elle a parfaitement capturé notre histoire et c\'est quelque chose que nous chérirons pour toujours.',
    testimonial2: 'En tant que propriétaire d\'entreprise, je voulais quelque chose de spécial pour le 10e anniversaire de notre société. L\'équipe de MusicGift.ro a livré une chanson fantastique qui incarnait parfaitement les valeurs et le parcours de notre entreprise.',
    testimonial3: 'J\'ai surpris mes parents avec une chanson personnalisée pour leur 30e anniversaire de mariage. Le processus était si fluide, et le résultat était au-delà de ce que j\'aurais pu imaginer. Ils la jouent pour tous ceux qui leur rendent visite!',
    author1: 'Andrei Popescu',
    author2: 'Maria Ionescu',
    author3: 'Elena Dumitrescu',
    location1: 'Bucarest',
    location2: 'Cluj-Napoca',
    location3: 'Timișoara',
    
    // Contact Page
    contactTitle: 'Contactez-Nous',
    contactSubtitle: 'Des questions? Nous sommes là pour vous aider!',
    getInTouch: 'Entrer en Contact',
    contactDescription: 'Que vous ayez des questions sur nos services, besoin d\'aide pour choisir le bon forfait, ou que vous souhaitiez discuter de votre vision musicale, nous sommes là pour vous aider à rendre votre cadeau parfait.',
    emailUs: 'Nous Envoyer un Email',
    callUs: 'Nous Appeler',
    visitUs: 'Nous Rendre Visite',
    followUs: 'Nous Suivre',
    sendMessage: 'Envoyez-nous un message',
    yourName: 'Votre Nom',
    yourEmail: 'Votre Email',
    phoneNumber: 'Numéro de Téléphone',
    yourMessage: 'Votre Message',
    sendMessageBtn: 'Envoyer le Message',
    messageSent: 'Message envoyé!',
    messageThankYou: 'Nous vous répondrons dès que possible.',
    
    // Auth Page
    musicGift: 'Music Gift',
    signInSubtitle: 'Connectez-vous pour continuer',
    signUpSubtitle: 'Créer un nouveau compte',
    fullName: 'Nom Complet',
    email: 'Email',
    password: 'Mot de Passe',
    signInBtn: 'Se Connecter',
    signUpBtn: 'S\'Inscrire',
    noAccount: 'Pas de compte? Inscrivez-vous ici',
    haveAccount: 'Déjà un compte? Connectez-vous ici',
    authError: 'Erreur d\'Authentification',
    invalidCredentials: 'Email ou mot de passe invalide. Veuillez vérifier vos informations.',
    signInSuccess: 'Connexion réussie!',
    welcomeBack: 'Bon retour!',
    accountExists: 'Compte existant',
    accountExistsMessage: 'Un compte avec cet email existe déjà. Essayez de vous connecter.',
    accountCreated: 'Compte créé avec succès!',
    canSignIn: 'Vous pouvez maintenant vous connecter avec vos nouvelles informations.',
    unexpectedError: 'Erreur inattendue',
    tryAgain: 'Une erreur s\'est produite. Veuillez réessayer.',
    backHome: 'Retour à l\'accueil',
    connectToContinue: 'Connectez-vous pour continuer',
    createAccount: 'Créer un nouveau compte',
    passwordMinLength: 'Le mot de passe doit contenir au moins 6 caractères',
    signingIn: 'Connexion en cours...',
    signingUp: 'Inscription en cours...',
    
    // Settings Page
    accountSettingsTitle: 'Paramètres du Compte',
    manageAccount: 'Gérez les informations de votre compte',
    profileInfo: 'Informations du Profil',
    updateProfile: 'Mettez à jour vos informations personnelles',
    accountInfo: 'Informations du Compte',
    accountDetails: 'Détails sur votre compte',
    userId: 'ID Utilisateur',
    registrationDate: 'Date d\'Inscription',
    lastUpdate: 'Dernière Mise à Jour',
    saveChanges: 'Sauvegarder les Modifications',
    saving: 'Sauvegarde...',
    profileUpdated: 'Profil mis à jour avec succès!',
    profileError: 'Impossible de mettre à jour le profil',
    loadError: 'Impossible de charger les données du profil',
    emailCannotChange: 'L\'email ne peut pas être modifié depuis cette page',
    
    // 404 Page
    pageNotFound: 'Page Non Trouvée',
    oopsNotFound: 'Oops! Page non trouvée',
    returnHome: 'Retour à l\'Accueil'
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
    
    // About Page
    aboutTitle: 'O MusicGift',
    aboutSubtitle: 'Tworzymy Muzyczne Wspomnienia od 2020',
    aboutDescription1: 'MusicGift.ro zostało założone z prostą misją: pomagać ludziom wyrażać najgłębsze emocje poprzez spersonalizowaną muzykę. Wierzymy, że każda historia miłosna, każda przyjaźń i każdy wyjątkowy moment zasługuje na własną ścieżkę dźwiękową.',
    aboutDescription2: 'Nasz zespół utalentowanych kompozytorów, tekściarzy i wokalistów współpracuje, aby przekształcić Twoje historie w piękne, wykonane na zamówienie piosenki. Od romantycznych ballad po rytmiczne piosenki świąteczne, pomogliśmy ponad 1000 klientom stworzyć niezapomniane muzyczne prezenty.',
    songsCreated: 'Utworzone Piosenki',
    yearsExperience: 'Lat Doświadczenia',
    clientSatisfaction: 'Zadowolenie Klientów',
    ourTeam: 'Nasz Kreatywny Zespół',
    leadComposer: 'Główny Kompozytor i Dyrektor Muzyczny',
    leadVocalist: 'Główny Wokalista i Tekściarz',
    soundEngineer: 'Inżynier Dźwięku i Producent',
    
    // How It Works Page
    howItWorksTitle: 'Jak To Działa',
    howItWorksSubtitle: 'Tworzenie spersonalizowanej piosenki jest łatwe',
    choosePackage: 'Wybierz Pakiet',
    choosePackageDesc: 'Wybierz pakiet, który najlepiej odpowiada Twoim potrzebom i budżetowi.',
    tellYourStory: 'Opowiedz Swoją Historię',
    tellYourStoryDesc: 'Wypełnij nasz szczegółowy kwestionariusz o odbiorcy i okazji.',
    weCreate: 'My Tworzymy',
    weCreateDesc: 'Nasz zespół profesjonalnych muzyków i kompozytorów tworzy Twoją spersonalizowaną piosenkę.',
    deliverDelight: 'Dostarczamy i Zachwycamy',
    deliverDelightDesc: 'Otrzymaj gotową piosenkę i zaskocz swoją wyjątkową osobę!',
    
    // Testimonials Page
    testimonialsTitle: 'Co Mówią Nasi Klienci',
    testimonialsSubtitle: 'Prawdziwe historie od osób, które wybrały MusicGift na swoje wyjątkowe momenty',
    testimonial1: 'Szukałem naprawdę wyjątkowego prezentu na 40. urodziny mojej żony. Piosenka stworzona przez MusicGift sprawiła, że zapłakała. Doskonale uchwyciła naszą historię i to coś, co będziemy cenić na zawsze.',
    testimonial2: 'Jako właściciel firmy chciałem coś wyjątkowego na 10. rocznicę naszej firmy. Zespół MusicGift.ro dostarczył fantastyczną piosenkę, która doskonale odzwierciedlała wartości i podróż naszej firmy.',
    testimonial3: 'Zaskoczyłem moich rodziców spersonalizowaną piosenką na ich 30. rocznicę ślubu. Proces był tak płynny, a rezultat był ponad to, co mogłem sobie wyobrazić. Odtwarzają ją dla wszystkich, którzy ich odwiedzają!',
    author1: 'Andrei Popescu',
    author2: 'Maria Ionescu',
    author3: 'Elena Dumitrescu',
    location1: 'Bukareszt',
    location2: 'Cluj-Napoca',
    location3: 'Timișoara',
    
    // Contact Page
    contactTitle: 'Skontaktuj się z Nami',
    contactSubtitle: 'Masz pytania? Jesteśmy tutaj, aby pomóc!',
    getInTouch: 'Skontaktuj się',
    contactDescription: 'Czy masz pytania o nasze usługi, potrzebujesz pomocy w wyborze odpowiedniego pakietu, czy chcesz przedyskutować swoją wizję muzyczną, jesteśmy tutaj, aby pomóc Ci stworzyć idealny prezent.',
    emailUs: 'Napisz do Nas',
    callUs: 'Zadzwoń do Nas',
    visitUs: 'Odwiedź Nas',
    followUs: 'Śledź Nas',
    sendMessage: 'Wyślij nam wiadomość',
    yourName: 'Twoje Imię',
    yourEmail: 'Twój Email',
    phoneNumber: 'Numer Telefonu',
    yourMessage: 'Twoja Wiadomość',
    sendMessageBtn: 'Wyślij Wiadomość',
    messageSent: 'Wiadomość wysłana!',
    messageThankYou: 'Odpowiemy jak najszybciej.',
    
    // Auth Page
    musicGift: 'Music Gift',
    signInSubtitle: 'Zaloguj się, aby kontynuować',
    signUpSubtitle: 'Utwórz nowe konto',
    fullName: 'Pełne Imię i Nazwisko',
    email: 'Email',
    password: 'Hasło',
    signInBtn: 'Zaloguj się',
    signUpBtn: 'Zarejestruj się',
    noAccount: 'Nie masz konta? Zarejestruj się tutaj',
    haveAccount: 'Masz już konto? Zaloguj się tutaj',
    authError: 'Błąd Uwierzytelniania',
    invalidCredentials: 'Nieprawidłowy email lub hasło. Sprawdź swoje dane.',
    signInSuccess: 'Logowanie udane!',
    welcomeBack: 'Witaj ponownie!',
    accountExists: 'Konto istnieje',
    accountExistsMessage: 'Konto z tym emailem już istnieje. Spróbuj się zalogować.',
    accountCreated: 'Konto utworzone pomyślnie!',
    canSignIn: 'Możesz teraz zalogować się swoimi nowymi danymi.',
    unexpectedError: 'Nieoczekiwany błąd',
    tryAgain: 'Wystąpił błąd. Spróbuj ponownie.',
    backHome: 'Powrót do domu',
    connectToContinue: 'Zaloguj się, aby kontynuować',
    createAccount: 'Utwórz nowe konto',
    passwordMinLength: 'Hasło musi mieć co najmniej 6 znaków',
    signingIn: 'Logowanie...',
    signingUp: 'Rejestracja...',
    
    // Settings Page
    accountSettingsTitle: 'Ustawienia Konta',
    manageAccount: 'Zarządzaj informacjami o swoim koncie',
    profileInfo: 'Informacje o Profilu',
    updateProfile: 'Zaktualizuj swoje dane osobowe',
    accountInfo: 'Informacje o Koncie',
    accountDetails: 'Szczegóły o Twoim koncie',
    userId: 'ID Użytkownika',
    registrationDate: 'Data Rejestracji',
    lastUpdate: 'Ostatnia Aktualizacja',
    saveChanges: 'Zapisz Zmiany',
    saving: 'Zapisywanie...',
    profileUpdated: 'Profil zaktualizowany pomyślnie!',
    profileError: 'Nie można zaktualizować profilu',
    loadError: 'Nie można załadować danych profilu',
    emailCannotChange: 'Email nie może być zmieniony z tej strony',
    
    // 404 Page
    pageNotFound: 'Strona Nie Znaleziona',
    oopsNotFound: 'Ups! Strona nie znaleziona',
    returnHome: 'Powrót do Strony Głównej'
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
    
    // About Page
    aboutTitle: 'Über MusicGift',
    aboutSubtitle: 'Musikalische Erinnerungen Schaffen Seit 2020',
    aboutDescription1: 'MusicGift.ro wurde mit einer einfachen Mission gegründet: Menschen dabei zu helfen, ihre tiefsten Emotionen durch personalisierte Musik auszudrücken. Wir glauben, dass jede Liebesgeschichte, jede Freundschaft und jeder besondere Moment seinen eigenen Soundtrack verdient.',
    aboutDescription2: 'Unser Team aus talentierten Komponisten, Textern und Vokalisten arbeitet zusammen, um Ihre Geschichten in wunderschöne, maßgeschneiderte Lieder zu verwandeln. Von romantischen Balladen bis hin zu mitreißenden Feierliedern haben wir über 1.000 Kunden geholfen, unvergessliche musikalische Geschenke zu schaffen.',
    songsCreated: 'Erstellte Lieder',
    yearsExperience: 'Jahre Erfahrung',
    clientSatisfaction: 'Kundenzufriedenheit',
    ourTeam: 'Unser Kreatives Team',
    leadComposer: 'Hauptkomponist & Musikdirektor',
    leadVocalist: 'Hauptsänger & Texter',
    soundEngineer: 'Toningenieur & Produzent',
    
    // How It Works Page
    howItWorksTitle: 'Wie Es Funktioniert',
    howItWorksSubtitle: 'Das Erstellen Ihres personalisierten Liedes ist einfach',
    choosePackage: 'Paket Wählen',
    choosePackageDesc: 'Wählen Sie das Paket, das am besten zu Ihren Bedürfnissen und Ihrem Budget passt.',
    tellYourStory: 'Erzählen Sie Ihre Geschichte',
    tellYourStoryDesc: 'Füllen Sie unseren detaillierten Fragebogen über den Empfänger und den Anlass aus.',
    weCreate: 'Wir Erschaffen',
    weCreateDesc: 'Unser Team aus professionellen Musikern und Songwritern erstellt Ihr personalisiertes Lied.',
    deliverDelight: 'Liefern & Erfreuen',
    deliverDelightDesc: 'Erhalten Sie Ihr fertiges Lied und überraschen Sie Ihre besondere Person!',
    
    // Testimonials Page
    testimonialsTitle: 'Was Unsere Kunden Sagen',
    testimonialsSubtitle: 'Echte Geschichten von Menschen, die MusicGift für ihre besonderen Momente gewählt haben',
    testimonial1: 'Ich suchte nach einem wirklich einzigartigen Geschenk für den 40. Geburtstag meiner Frau. Das von MusicGift erstellte Lied brachte sie zum Weinen. Es erfasste unsere Geschichte perfekt und ist etwas, das wir für immer schätzen werden.',
    testimonial2: 'Als Geschäftsinhaber wollte ich etwas Besonderes für das 10-jährige Jubiläum unseres Unternehmens. Das Team von MusicGift.ro lieferte ein fantastisches Lied, das die Werte und die Reise unseres Unternehmens perfekt verkörperte.',
    testimonial3: 'Ich überraschte meine Eltern mit einem personalisierten Lied zu ihrem 30. Hochzeitstag. Der Prozess war so reibungslos und das Ergebnis war jenseits dessen, was ich mir hätte vorstellen können. Sie spielen es für jeden, der sie besucht!',
    author1: 'Andrei Popescu',
    author2: 'Maria Ionescu',
    author3: 'Elena Dumitrescu',
    location1: 'Bukarest',
    location2: 'Cluj-Napoca',
    location3: 'Timișoara',
    
    // Contact Page
    contactTitle: 'Kontaktieren Sie Uns',
    contactSubtitle: 'Haben Sie Fragen? Wir sind hier, um zu helfen!',
    getInTouch: 'Kontakt Aufnehmen',
    contactDescription: 'Ob Sie Fragen zu unseren Dienstleistungen haben, Hilfe bei der Auswahl des richtigen Pakets benötigen oder Ihre musikalische Vision besprechen möchten, wir sind hier, um Ihnen zu helfen, Ihr Geschenk perfekt zu machen.',
    emailUs: 'E-Mail Senden',
    callUs: 'Anrufen',
    visitUs: 'Besuchen Sie Uns',
    followUs: 'Folgen Sie Uns',
    sendMessage: 'Senden Sie uns eine Nachricht',
    yourName: 'Ihr Name',
    yourEmail: 'Ihre E-Mail',
    phoneNumber: 'Telefonnummer',
    yourMessage: 'Ihre Nachricht',
    sendMessageBtn: 'Nachricht Senden',
    messageSent: 'Nachricht gesendet!',
    messageThankYou: 'Wir werden Ihnen so schnell wie möglich antworten.',
    
    // Auth Page
    musicGift: 'Music Gift',
    signInSubtitle: 'Melden Sie sich an, um fortzufahren',
    signUpSubtitle: 'Neues Konto erstellen',
    fullName: 'Vollständiger Name',
    email: 'E-Mail',
    password: 'Passwort',
    signInBtn: 'Anmelden',
    signUpBtn: 'Registrieren',
    noAccount: 'Haben Sie kein Konto? Hier registrieren',
    haveAccount: 'Haben Sie bereits ein Konto? Hier anmelden',
    authError: 'Authentifizierungsfehler',
    invalidCredentials: 'Ungültige E-Mail oder Passwort. Bitte überprüfen Sie Ihre Angaben.',
    signInSuccess: 'Anmeldung erfolgreich!',
    welcomeBack: 'Willkommen zurück!',
    accountExists: 'Konto existiert',
    accountExistsMessage: 'Ein Konto mit dieser E-Mail existiert bereits. Versuchen Sie sich anzumelden.',
    accountCreated: 'Konto erfolgreich erstellt!',
    canSignIn: 'Sie können sich jetzt mit Ihren neuen Anmeldedaten anmelden.',
    unexpectedError: 'Unerwarteter Fehler',
    tryAgain: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    backHome: 'Zurück zur Startseite',
    connectToContinue: 'Melden Sie sich an, um fortzufahren',
    createAccount: 'Neues Konto erstellen',
    passwordMinLength: 'Das Passwort muss mindestens 6 Zeichen haben',
    signingIn: 'Anmeldung...',
    signingUp: 'Registrierung...',
    
    // Settings Page
    accountSettingsTitle: 'Kontoeinstellungen',
    manageAccount: 'Verwalten Sie Ihre Kontoinformationen',
    profileInfo: 'Profilinformationen',
    updateProfile: 'Aktualisieren Sie Ihre persönlichen Informationen',
    accountInfo: 'Kontoinformationen',
    accountDetails: 'Details zu Ihrem Konto',
    userId: 'Benutzer-ID',
    registrationDate: 'Registrierungsdatum',
    lastUpdate: 'Letzte Aktualisierung',
    saveChanges: 'Änderungen Speichern',
    saving: 'Speichern...',
    profileUpdated: 'Profil erfolgreich aktualisiert!',
    profileError: 'Profil konnte nicht aktualisiert werden',
    loadError: 'Profildaten konnten nicht geladen werden',
    emailCannotChange: 'Die E-Mail kann von dieser Seite aus nicht geändert werden',
    
    // 404 Page
    pageNotFound: 'Seite Nicht Gefunden',
    oopsNotFound: 'Ups! Seite nicht gefunden',
    returnHome: 'Zurück zur Startseite'
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
