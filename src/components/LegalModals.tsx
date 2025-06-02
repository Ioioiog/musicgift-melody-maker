
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LegalModalsProps {
  t: (key: string) => string;
}

const LegalModals = ({ t }: LegalModalsProps) => {
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [cookieOpen, setCookieOpen] = useState(false);

  // Get current language from the t function
  const getCurrentLanguage = () => {
    // Check if we're in English context by testing a known translation
    if (t('home') === 'Home') return 'en';
    if (t('home') === 'Accueil') return 'fr';
    if (t('home') === 'Thuis') return 'nl';
    if (t('home') === 'Dom') return 'pl';
    return 'ro'; // Default to Romanian
  };

  const currentLang = getCurrentLanguage();

  const termsContent = {
    ro: {
      title: "Termeni și Condiții – MusicGift.ro",
      intro: "Bine ai venit pe MusicGift.ro! Comandând o melodie personalizată, ești de acord cu regulile de mai jos. Le-am scris simplu și clar, ca să știi exact ce primești.",
      content: `1. Cine suntem?
MusicGift este un serviciu creat de Mango Records SRL, companie românească cu sediul în București, Str. Fabrica de Glucoză 6–8, înregistrată la Registrul Comerțului cu nr. J23/2828/2017, CUI RO29228083.

2. Ce înseamnă fiecare termen?
• MusicGift – Serviciul care creează melodii personalizate.
• Clientul – Tu, cel/cea care comandă o melodie.
• Melodia – Cântecul final livrat.
• Master – Fișierul audio final.
• Compoziția – Linia melodică, armonia și versurile.

3. Ce oferim?
🎶 Creăm melodii unice, inspirate din poveștile clienților noștri – pentru cadouri, evenimente, reclame sau uz artistic.

4. Cum funcționează comanda?
🕒 Termene de livrare:
• 3–5 zile lucrătoare: pentru pachetele Personal, Business, Premium
• 7–10 zile lucrătoare: pentru pachetul Artist

📦 Melodia se livrează prin link securizat, trimis pe email.

5. Drepturi de autor și utilizare
✍️ Drepturile de autor asupra piesei (compoziție și text) rămân la Mango Records.
🎧 Tu primești dreptul de a folosi melodia conform pachetului ales (ex: personal, comercial etc.).

6. Portofoliu
Putem include melodia ta în portofoliul nostru ca exemplu de creație. Nu îți afectează în niciun fel drepturile de utilizare.

7. Plata și rambursare
💳 Plata se face integral la plasarea comenzii.
❌ Pentru că produsele sunt personalizate, nu se acceptă rambursări – cu excepția unor situații speciale (ex: eroare tehnică gravă).

8. Responsabilitățile tale
• Să oferi informații corecte și complete.
• Să nu trimiți conținut neadecvat (vulgar, ilegal etc.).
• Să folosești site-ul în mod responsabil.

9. Modificări ale termenilor
Putem actualiza acești termeni oricând. Te încurajăm să revii periodic pentru a verifica eventualele modificări.

10. 📬 Newsletter și comunicări comerciale
Prin abonarea la newsletter:
• Accepți să primești emailuri cu noutăți, oferte și campanii MusicGift.
• Te poți dezabona oricând prin linkul din email sau scriind la: mihai.gruia@mangorecords.net
• Respectăm toate reglementările GDPR. Nu trimitem spam și nu partajăm datele tale cu terți.

11. 🔐 Protecția datelor (GDPR)
Colectăm: Nume, email, telefon
Scop: Procesarea comenzii, Trimiterea de comunicări comerciale
Drepturile tale: Acces, rectificare, ștergere, opoziție, portabilitate

12. Utilizarea site-ului
Este interzisă: Frauda, Utilizarea abuzivă, Copierea conținutului fără acord

13. Politica de cookies
Folosim cookie-uri pentru a îmbunătăți experiența ta pe site.

14. Legea aplicabilă
Acești termeni sunt guvernați de legislația română.

15. Dreptul de a refuza comenzi
Putem refuza comenzi în cazuri justificate (ex: conținut inacceptabil). În astfel de cazuri, returnăm integral banii.

16. 🔁 Politica de returnare
Fiind produse 100% personalizate, acestea nu pot fi returnate, conform OUG nr. 34/2014.
✅ În cazuri excepționale (erori tehnice sau imposibilitatea livrării), putem:
• Reface melodia
• Oferi rambursare parțială/integrală

17. Limitarea răspunderii
MusicGift nu este responsabil pentru daune indirecte. Răspunderea noastră maximă este suma plătită de client.

18. Forță majoră
Nu suntem responsabili pentru întârzieri cauzate de factori externi: dezastre, pandemii, conflicte etc.

19. Utilizarea melodiei
Clientul este singurul responsabil pentru cum, unde și în ce context folosește melodia.

20. Comenzi cu conținut inacceptabil
Refuzăm comenzi care conțin: Limbaj vulgar, Mesaje politice, discriminatorii sau ofensatoare

21. Materiale trimise de client
Dacă ne trimiți imagini, clipuri sau alte fișiere pentru videoclip:
• Trebuie să deții drepturile de utilizare
• Ne oferi permisiunea de a le folosi doar pentru livrarea comenzii

22. 🎧 Pachetul „Remix"
Poți comanda un remix doar dacă deții 100% din drepturile asupra piesei originale.
Dacă ceri publicarea prin Mango Records, trebuie să ne trimiți dovezi legale.
Dacă se dovedește că ai oferit informații false:
• Suma achitată nu se rambursează
• Tu vei răspunde pentru orice dispută privind drepturile de autor

23. ⏳ Stocarea livrărilor
Păstrăm melodiile și fișierele asociate comenzii tale timp de 6 luni.
După această perioadă, pot fi șterse automat fără notificare.
👉 Te rugăm să salvezi fișierele local imediat după livrare.

24. Contact
📧 Email: mihai.gruia@mangorecords.net
📞 Telefon: 0723 141 501
🌐 Website: www.musicgift.ro
🏢 Operat de: SC MANGO RECORDS SRL
📍 Sediu: Str. Fabrica de Glucoză 6–8, București
🧾 CUI: RO29228083 | Nr. RC: J23/2828/2017`,
      footer: "Dacă ai întrebări, ne poți scrie oricând – suntem aici să te ajutăm cu drag! 🎼❤️"
    },
    en: {
      title: "Terms and Conditions – MusicGift.ro",
      intro: "Welcome to MusicGift.ro! By ordering a personalized song, you agree to the rules below. We have written them simply and clearly, so you know exactly what you are getting.",
      content: `1. Who are we?
MusicGift is a service created by Mango Records SRL, a Romanian company headquartered in Bucharest, Str. Fabrica de Glucoză 6–8, registered with the Trade Registry under nr. J23/2828/2017, CUI RO29228083.

2. What does each term mean?
• MusicGift – The service that creates personalized songs.
• Client – You, the one ordering a song.
• Song – The final delivered track.
• Master – The final audio file.
• Composition – The melody line, harmony and lyrics.

3. What do we offer?
🎶 We create unique songs, inspired by our clients' stories – for gifts, events, advertisements or artistic use.`,
      footer: "If you have questions, you can write to us anytime – we are here to help you with pleasure! 🎼❤️"
    },
    fr: {
      title: "Conditions Générales – MusicGift.ro",
      intro: "Bienvenue sur MusicGift.ro ! En commandant une chanson personnalisée, vous acceptez les règles ci-dessous.",
      content: `1. Qui sommes-nous ?
MusicGift est un service créé par Mango Records SRL, société roumaine dont le siège social est à Bucarest.`,
      footer: "Si vous avez des questions, vous pouvez nous écrire à tout moment ! 🎼❤️"
    },
    nl: {
      title: "Algemene Voorwaarden – MusicGift.ro",
      intro: "Welkom bij MusicGift.ro! Door een gepersonaliseerd nummer te bestellen, ga je akkoord met de onderstaande regels.",
      content: `1. Wie zijn wij?
MusicGift is een service gecreëerd door Mango Records SRL, een Roemeens bedrijf gevestigd in Boekarest.`,
      footer: "Als je vragen hebt, kun je ons op elk moment schrijven! 🎼❤️"
    },
    pl: {
      title: "Regulamin – MusicGift.ro",
      intro: "Witamy na MusicGift.ro! Zamawiając spersonalizowaną piosenkę, zgadzasz się na poniższe zasady.",
      content: `1. Kim jesteśmy?
MusicGift to usługa stworzona przez Mango Records SRL, rumuńską firmę z siedzibą w Bukareszcie.`,
      footer: "Jeśli masz pytania, możesz napisać do nas w dowolnym momencie! 🎼❤️"
    }
  };

  const currentTerms = termsContent[currentLang] || termsContent.ro;

  return (
    <>
      {/* Terms & Conditions Modal */}
      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-md border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-4">
              {currentTerms.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p className="text-base font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {currentTerms.intro}
            </p>
            
            <div className="w-full h-px bg-gradient-to-r from-purple-600 to-pink-600"></div>
            
            <div className="whitespace-pre-line">
              {currentTerms.content}
            </div>
            
            <div className="w-full h-px bg-gradient-to-r from-purple-600 to-pink-600"></div>
            
            <p className="text-center font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {currentTerms.footer}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Modal */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-md border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-4">
              {t('privacyPolicy')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h3 className="text-lg font-semibold mb-3">Data Collection</h3>
              <p>We collect information you provide when creating your musical gift, including personal details, preferences, and payment information.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">How We Use Your Data</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create personalized musical content</li>
                <li>Process payments and deliver services</li>
                <li>Communicate about your order</li>
                <li>Improve our services</li>
                <li>Send marketing communications (with consent)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Data Protection</h3>
              <p>We implement appropriate security measures to protect your personal information. Data is encrypted in transit and at rest.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Third-Party Services</h3>
              <p>We may use third-party services for payment processing, analytics, and email communications. These services have their own privacy policies.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Your Rights</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request data deletion</li>
                <li>Withdraw consent for marketing</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Contact</h3>
              <p>For privacy-related questions, contact us at mihai.gruia@mangorecords.net</p>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Refund Policy Modal */}
      <Dialog open={refundOpen} onOpenChange={setRefundOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-md border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-4">
              {t('refundPolicy')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h3 className="text-lg font-semibold mb-3">Refund Eligibility</h3>
              <p>Refunds are available under specific circumstances due to the personalized nature of our services.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">When Refunds Apply</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Technical issues preventing delivery</li>
                <li>Significant deviation from specified requirements</li>
                <li>Service not delivered within promised timeframe</li>
                <li>Cancellation within 24 hours of order placement (before work begins)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Refund Process</h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Contact our support team within 7 days of delivery</li>
                <li>Provide detailed explanation of the issue</li>
                <li>Allow up to 48 hours for review</li>
                <li>Approved refunds processed within 5-10 business days</li>
              </ol>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Non-Refundable Situations</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Change of mind after delivery</li>
                <li>Dissatisfaction with artistic style (within specifications)</li>
                <li>Orders already completed and delivered</li>
                <li>Custom requests that were accurately fulfilled</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Partial Refunds</h3>
              <p>In some cases, partial refunds may be offered for services that partially meet requirements but have minor issues.</p>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cookie Policy Modal */}
      <Dialog open={cookieOpen} onOpenChange={setCookieOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-md border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-4">
              {t('cookiePolicy')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h3 className="text-lg font-semibold mb-3">What Are Cookies</h3>
              <p>Cookies are small text files stored on your device when you visit our website. They help us provide a better user experience.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Types of Cookies We Use</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Essential Cookies</h4>
                  <p className="text-sm">Required for basic website functionality, including authentication and security.</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Analytics Cookies</h4>
                  <p className="text-sm">Help us understand how visitors interact with our website to improve user experience.</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Preference Cookies</h4>
                  <p className="text-sm">Remember your language preferences and other settings.</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Marketing Cookies</h4>
                  <p className="text-sm">Used to deliver relevant advertisements and track campaign effectiveness.</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Managing Cookies</h3>
              <p>You can control cookies through your browser settings. However, disabling certain cookies may affect website functionality.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Third-Party Cookies</h3>
              <p>We may use third-party services that set their own cookies, including payment processors and analytics providers.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Updates</h3>
              <p>This cookie policy may be updated periodically. Changes will be posted on this page with the effective date.</p>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Trigger Functions - exposed for Footer to use */}
      <div className="hidden">
        <button onClick={() => setTermsOpen(true)} id="terms-trigger" />
        <button onClick={() => setPrivacyOpen(true)} id="privacy-trigger" />
        <button onClick={() => setRefundOpen(true)} id="refund-trigger" />
        <button onClick={() => setCookieOpen(true)} id="cookie-trigger" />
      </div>
    </>
  );
};

// Export the trigger functions for Footer to use
export const useLegalModals = () => {
  return {
    openTerms: () => document.getElementById('terms-trigger')?.click(),
    openPrivacy: () => document.getElementById('privacy-trigger')?.click(),
    openRefund: () => document.getElementById('refund-trigger')?.click(),
    openCookie: () => document.getElementById('cookie-trigger')?.click(),
  };
};

export default LegalModals;
