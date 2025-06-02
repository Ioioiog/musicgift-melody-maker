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
      sections: [
        {
          title: "1. Cine suntem?",
          content: "MusicGift este un serviciu creat de Mango Records SRL, companie românească cu sediul în București, Str. Fabrica de Glucoză 6–8, înregistrată la Registrul Comerțului cu nr. J23/2828/2017, CUI RO29228083."
        },
        {
          title: "2. Ce înseamnă fiecare termen?",
          content: `• MusicGift – Serviciul care creează melodii personalizate.
• Clientul – Tu, cel/cea care comandă o melodie.
• Melodia – Cântecul final livrat.
• Master – Fișierul audio final.
• Compoziția – Linia melodică, armonia și versurile.`
        },
        {
          title: "3. Ce oferim?",
          content: "🎶 Creăm melodii unice, inspirate din poveștile clienților noștri – pentru cadouri, evenimente, reclame sau uz artistic."
        },
        {
          title: "4. Cum funcționează comanda?",
          content: `🕒 Termene de livrare:
• 3–5 zile lucrătoare: pentru pachetele Personal, Business, Premium
• 7–10 zile lucrătoare: pentru pachetul Artist

📦 Melodia se livrează prin link securizat, trimis pe email.`
        },
        {
          title: "5. Drepturi de autor și utilizare",
          content: `✍️ Drepturile de autor asupra piesei (compoziție și text) rămân la Mango Records.

🎧 Tu primești dreptul de a folosi melodia conform pachetului ales (ex: personal, comercial etc.).`
        },
        {
          title: "6. Portofoliu",
          content: "Putem include melodia ta în portofoliul nostru ca exemplu de creație. Nu îți afectează în niciun fel drepturile de utilizare."
        },
        {
          title: "7. Plata și rambursare",
          content: `💳 Plata se face integral la plasarea comenzii.

❌ Pentru că produsele sunt personalizate, nu se acceptă rambursări – cu excepția unor situații speciale (ex: eroare tehnică gravă).`
        },
        {
          title: "8. Responsabilitățile tale",
          content: `• Să oferi informații corecte și complete.
• Să nu trimiți conținut neadecvat (vulgar, ilegal etc.).
• Să folosești site-ul în mod responsabil.`
        },
        {
          title: "9. Modificări ale termenilor",
          content: "Putem actualiza acești termeni oricând. Te încurajăm să revii periodic pentru a verifica eventualele modificări."
        },
        {
          title: "10. 📬 Newsletter și comunicări comerciale",
          content: `Prin abonarea la newsletter:
• Accepți să primești emailuri cu noutăți, oferte și campanii MusicGift.
• Te poți dezabona oricând prin linkul din email sau scriind la: mihai.gruia@mangorecords.net
• Respectăm toate reglementările GDPR. Nu trimitem spam și nu partajăm datele tale cu terți.`
        },
        {
          title: "11. 🔐 Protecția datelor (GDPR)",
          content: `Colectăm:
• Nume, email, telefon

Scop:
• Procesarea comenzii
• Trimiterea de comunicări comerciale

Drepturile tale:
• Acces, rectificare, ștergere, opoziție, portabilitate`
        },
        {
          title: "12. Utilizarea site-ului",
          content: `Este interzisă:
• Frauda
• Utilizarea abuzivă
• Copierea conținutului fără acord`
        },
        {
          title: "13. Politica de cookies",
          content: "Folosim cookie-uri pentru a îmbunătăți experiența ta pe site."
        },
        {
          title: "14. Legea aplicabilă",
          content: "Acești termeni sunt guvernați de legislația română."
        },
        {
          title: "15. Dreptul de a refuza comenzi",
          content: "Putem refuza comenzi în cazuri justificate (ex: conținut inacceptabil). În astfel de cazuri, returnăm integral banii."
        },
        {
          title: "16. 🔁 Politica de returnare",
          content: `Fiind produse 100% personalizate, acestea nu pot fi returnate, conform OUG nr. 34/2014.

✅ În cazuri excepționale (erori tehnice sau imposibilitatea livrării), putem:
• Reface melodia
• Oferi rambursare parțială/integrală`
        },
        {
          title: "17. Limitarea răspunderii",
          content: "MusicGift nu este responsabil pentru daune indirecte. Răspunderea noastră maximă este suma plătită de client."
        },
        {
          title: "18. Forță majoră",
          content: "Nu suntem responsabili pentru întârzieri cauzate de factori externi: dezastre, pandemii, conflicte etc."
        },
        {
          title: "19. Utilizarea melodiei",
          content: "Clientul este singurul responsabil pentru cum, unde și în ce context folosește melodia."
        },
        {
          title: "20. Comenzi cu conținut inacceptabil",
          content: `Refuzăm comenzi care conțin:
• Limbaj vulgar
• Mesaje politice, discriminatorii sau ofensatoare`
        },
        {
          title: "21. Materiale trimise de client",
          content: `Dacă ne trimiți imagini, clipuri sau alte fișiere pentru videoclip:
• Trebuie să deții drepturile de utilizare
• Ne oferi permisiunea de a le folosi doar pentru livrarea comenzii`
        },
        {
          title: "22. 🎧 Pachetul „Remix"",
          content: `Poți comanda un remix doar dacă deții 100% din drepturile asupra piesei originale.

Dacă ceri publicarea prin Mango Records, trebuie să ne trimiți dovezi legale.

Dacă se dovedește că ai oferit informații false:
• Suma achitată nu se rambursează
• Tu vei răspunde pentru orice dispută privind drepturile de autor`
        },
        {
          title: "23. ⏳ Stocarea livrărilor",
          content: `Păstrăm melodiile și fișierele asociate comenzii tale timp de 6 luni.

După această perioadă, pot fi șterse automat fără notificare.

👉 Te rugăm să salvezi fișierele local imediat după livrare.`
        },
        {
          title: "24. Contact",
          content: `📧 Email: mihai.gruia@mangorecords.net
📞 Telefon: 0723 141 501
🌐 Website: www.musicgift.ro
🏢 Operat de: SC MANGO RECORDS SRL
📍 Sediu: Str. Fabrica de Glucoză 6–8, București
🧾 CUI: RO29228083 | Nr. RC: J23/2828/2017`
        }
      ],
      footer: "Dacă ai întrebări, ne poți scrie oricând – suntem aici să te ajutăm cu drag! 🎼❤️"
    },
    en: {
      title: "Terms and Conditions – MusicGift.ro",
      intro: "Welcome to MusicGift.ro! By ordering a personalized song, you agree to the rules below. We've written them simply and clearly, so you know exactly what you're getting.",
      sections: [
        {
          title: "1. Who are we?",
          content: "MusicGift is a service created by Mango Records SRL, a Romanian company headquartered in Bucharest, Str. Fabrica de Glucoză 6–8, registered with the Trade Registry under nr. J23/2828/2017, CUI RO29228083."
        },
        {
          title: "2. What does each term mean?",
          content: `• MusicGift – The service that creates personalized songs.
• Client – You, the one ordering a song.
• Song – The final delivered track.
• Master – The final audio file.
• Composition – The melody line, harmony and lyrics.`
        },
        {
          title: "3. What do we offer?",
          content: "🎶 We create unique songs, inspired by our clients' stories – for gifts, events, advertisements or artistic use."
        },
        {
          title: "4. How does ordering work?",
          content: `🕒 Delivery times:
• 3–5 working days: for Personal, Business, Premium packages
• 7–10 working days: for Artist package

📦 The song is delivered via secure link, sent by email.`
        },
        {
          title: "5. Copyright and usage rights",
          content: `✍️ Copyright over the song (composition and lyrics) remains with Mango Records.

🎧 You receive the right to use the song according to your chosen package (e.g. personal, commercial etc.).`
        },
        {
          title: "6. Portfolio",
          content: "We may include your song in our portfolio as an example of creation. This doesn't affect your usage rights in any way."
        },
        {
          title: "7. Payment and refunds",
          content: `💳 Payment is made in full when placing the order.

❌ Since products are personalized, refunds are not accepted – except in special situations (e.g. serious technical error).`
        },
        {
          title: "8. Your responsibilities",
          content: `• Provide accurate and complete information.
• Don't send inappropriate content (vulgar, illegal etc.).
• Use the website responsibly.`
        },
        {
          title: "9. Changes to terms",
          content: "We may update these terms at any time. We encourage you to check back periodically for any changes."
        },
        {
          title: "10. 📬 Newsletter and commercial communications",
          content: `By subscribing to the newsletter:
• You agree to receive emails with news, offers and MusicGift campaigns.
• You can unsubscribe anytime via the email link or by writing to: mihai.gruia@mangorecords.net
• We respect all GDPR regulations. We don't send spam and don't share your data with third parties.`
        },
        {
          title: "11. 🔐 Data protection (GDPR)",
          content: `We collect:
• Name, email, phone

Purpose:
• Order processing
• Sending commercial communications

Your rights:
• Access, rectification, deletion, opposition, portability`
        },
        {
          title: "12. Website usage",
          content: `Prohibited:
• Fraud
• Abusive use
• Copying content without permission`
        },
        {
          title: "13. Cookie policy",
          content: "We use cookies to improve your website experience."
        },
        {
          title: "14. Applicable law",
          content: "These terms are governed by Romanian legislation."
        },
        {
          title: "15. Right to refuse orders",
          content: "We may refuse orders in justified cases (e.g. unacceptable content). In such cases, we fully refund the money."
        },
        {
          title: "16. 🔁 Return policy",
          content: `Being 100% personalized products, they cannot be returned, according to OUG nr. 34/2014.

✅ In exceptional cases (technical errors or delivery impossibility), we may:
• Remake the song
• Offer partial/full refund`
        },
        {
          title: "17. Liability limitation",
          content: "MusicGift is not responsible for indirect damages. Our maximum liability is the amount paid by the client."
        },
        {
          title: "18. Force majeure",
          content: "We are not responsible for delays caused by external factors: disasters, pandemies, conflicts etc."
        },
        {
          title: "19. Song usage",
          content: "The client is solely responsible for how, where and in what context they use the song."
        },
        {
          title: "20. Orders with unacceptable content",
          content: `We refuse orders containing:
• Vulgar language
• Political, discriminatory or offensive messages`
        },
        {
          title: "21. Materials sent by client",
          content: `If you send us images, clips or other files for video:
• You must own the usage rights
• You give us permission to use them only for order delivery`
        },
        {
          title: "22. 🎧 \"Remix\" package",
          content: `You can order a remix only if you own 100% of the rights to the original song.

If you request publication through Mango Records, you must send us legal proof.

If it's proven you provided false information:
• The paid amount is not refunded
• You will be responsible for any copyright disputes`
        },
        {
          title: "23. ⏳ Delivery storage",
          content: `We keep songs and files associated with your order for 6 months.

After this period, they may be automatically deleted without notification.

👉 Please save files locally immediately after delivery.`
        },
        {
          title: "24. Contact",
          content: `📧 Email: mihai.gruia@mangorecords.net
📞 Phone: 0723 141 501
🌐 Website: www.musicgift.ro
🏢 Operated by: SC MANGO RECORDS SRL
📍 Address: Str. Fabrica de Glucoză 6–8, București
🧾 CUI: RO29228083 | RC Nr: J23/2828/2017`
        }
      ],
      footer: "If you have questions, you can write to us anytime – we're here to help you with pleasure! 🎼❤️"
    },
    fr: {
      title: "Conditions Générales – MusicGift.ro",
      intro: "Bienvenue sur MusicGift.ro ! En commandant une chanson personnalisée, vous acceptez les règles ci-dessous. Nous les avons écrites simplement et clairement, pour que vous sachiez exactement ce que vous obtenez.",
      sections: [
        {
          title: "1. Qui sommes-nous ?",
          content: "MusicGift est un service créé par Mango Records SRL, société roumaine dont le siège social est à Bucarest, Str. Fabrica de Glucoză 6–8, enregistrée au Registre du Commerce sous le nr. J23/2828/2017, CUI RO29228083."
        },
        {
          title: "2. Que signifie chaque terme ?",
          content: `• MusicGift – Le service qui crée des chansons personnalisées.
• Client – Vous, celui/celle qui commande une chanson.
• Chanson – Le morceau final livré.
• Master – Le fichier audio final.
• Composition – La ligne mélodique, l'harmonie et les paroles.`
        },
        {
          title: "3. Que proposons-nous ?",
          content: "🎶 Nous créons des chansons uniques, inspirées des histoires de nos clients – pour des cadeaux, événements, publicités ou usage artistique."
        },
        {
          title: "4. Comment fonctionne la commande ?",
          content: `🕒 Délais de livraison :
• 3–5 jours ouvrables : pour les forfaits Personal, Business, Premium
• 7–10 jours ouvrables : pour le forfait Artist

📦 La chanson est livrée via un lien sécurisé, envoyé par email.`
        },
        {
          title: "5. Droits d'auteur et d'utilisation",
          content: `✍️ Les droits d'auteur sur la chanson (composition et paroles) restent à Mango Records.

🎧 Vous recevez le droit d'utiliser la chanson selon le forfait choisi (ex : personnel, commercial etc.).`
        },
        {
          title: "6. Portfolio",
          content: "Nous pouvons inclure votre chanson dans notre portfolio comme exemple de création. Cela n'affecte en rien vos droits d'utilisation."
        },
        {
          title: "7. Paiement et remboursement",
          content: `💳 Le paiement se fait intégralement lors de la commande.

❌ Les produits étant personnalisés, les remboursements ne sont pas acceptés – sauf situations spéciales (ex : erreur technique grave).`
        },
        {
          title: "8. Vos responsabilités",
          content: `• Fournir des informations exactes et complètes.
• Ne pas envoyer de contenu inapproprié (vulgair, illégal etc.).
• Utiliser le site de manière responsable.`
        },
        {
          title: "9. Modifications des conditions",
          content: "Nous pouvons actualiser ces conditions à tout moment. Nous vous encourageons à revenir périodiquement pour vérifier d'éventuelles modifications."
        },
        {
          title: "10. 📬 Newsletter et communications commerciales",
          content: `En vous abonnant à la newsletter :
• Vous acceptez de recevoir des emails avec actualités, offres et MusicGift campagnes.
• Vous pouvez vous désabonner à tout moment via le lien dans l'email ou en écrivant à : mihai.gruia@mangorecords.net
• Nous respectons toutes les réglementations RGPD. Nous n'envoyons pas de spam et ne partageons pas vos données avec des tiers.`
        },
        {
          title: "11. 🔐 Protection des données (RGPD)",
          content: `Nous collectons :
• Nom, email, téléphone

Objectif :
• Traitement de la commande
• Envoi de communications commerciales

Vos droits :
• Accès, rectification, suppression, opposition, portabilité`
        },
        {
          title: "12. Utilisation du site",
          content: `Interdit :
• Fraude
• Utilisation abusive
• Copie du contenu sans accord`
        },
        {
          title: "13. Politique de cookies",
          content: "Nous utilisons des cookies pour améliorer votre expérience sur le site."
        },
        {
          title: "14. Loi applicable",
          content: "Ces conditions sont régies par la législation roumaine."
        },
        {
          title: "15. Droit de refuser les commandes",
          content: "Nous pouvons refuser des commandes dans des cas justifiés (ex : contenu inacceptable). Dans de tels cas, nous remboursons intégralement l'argent."
        },
        {
          title: "16. 🔁 Retourbeleid",
          content: `Étant des produits 100% personnalisés, ils ne peuvent pas être retournés, conformément à OUG nr. 34/2014.

✅ Dans des cas exceptionnels (erreurs techniques ou impossibilité de livraison), nous pouvons :
• Refaire la chanson
• Offrir un remboursement partiel/intégral`
        },
        {
          title: "17. Limitation de responsabilité",
          content: "MusicGift n'est pas responsable des dommages indirects. Notre responsabilité maximale est la somme payée par le client."
        },
        {
          title: "18. Force majeure",
          content: "Nous ne sommes pas responsables des retards causés par des facteurs externes : catastrophes, pandémies, conflits etc."
        },
        {
          title: "19. Utilisation de la chanson",
          content: "Le client est seul responsable pour comment, où et dans quel contexte il utilise la chanson."
        },
        {
          title: "20. Commandes avec contenu inacceptable",
          content: `Nous refusons les commandes contenant :
• Langage vulgaire
• Messages politiques, discriminatoires ou beledigants`
        },
        {
          title: "21. Matériaux envoyés par le client",
          content: `Si vous nous envoyez des images, clips ou autres fichiers pour vidéo :
• Vous devez détenir les droits d'utilisation
• Vous nous donnez la permission de les utiliser uniquement pour la livraison de la commande`
        },
        {
          title: "22. 🎧 \"Remix\" pakket",
          content: `Vous pouvez commander un remix seulement si vous détenez 100% des droits sur la chanson originale.

Si vous demandez la publication via Mango Records, vous devez nous envoyer des preuves légales.

S'il s'avère que vous avez fourni de fausses informations :
• La somme payée n'est pas remboursée
• Vous répondrez de tout litige concernant les droits d'auteur`
        },
        {
          title: "23. ⏳ Levering opslag",
          content: `We conserven chansons et fichiers associés à votre commande pendant 6 mois.

Après cette période, ils peuvent être supprimés automatiquement sans notification.

👉 Veuillez sauvegarder les fichiers localement immédiatement après livraison.`
        },
        {
          title: "24. Contact",
          content: `📧 Email : mihai.gruia@mangorecords.net
📞 Téléphone : 0723 141 501
🌐 Site web : www.musicgift.ro
🏢 Exploité par : SC MANGO RECORDS SRL
📍 Siège : Str. Fabrica de Glucoză 6–8, București
🧾 CUI : RO29228083 | Nr RC : J23/2828/2017`
        }
      ],
      footer: "Si vous avez des questions, vous pouvez nous écrire à tout moment – nous sommes là pour vous aider avec plaisir ! 🎼❤️"
    },
    nl: {
      title: "Algemene Voorwaarden – MusicGift.ro",
      intro: "Welkom bij MusicGift.ro! Door een gepersonaliseerd nummer te bestellen, ga je akkoord met de onderstaande regels. We hebben ze eenvoudig en duidelijk geschreven, zodat je precies weet wat je krijgt.",
      sections: [
        {
          title: "1. Wie zijn wij?",
          content: "MusicGift is een service gecreëerd door Mango Records SRL, een Roemeens bedrijf gevestigd in Boekarest, Str. Fabrica de Glucoză 6–8, geregistreerd bij het Handelsregister onder nr. J23/2828/2017, CUI RO29228083."
        },
        {
          title: "2. Wat betekent elke term?",
          content: `• MusicGift – De service die gepersonaliseerde nummers creëert.
• Klant – Jij, degene die een nummer bestelt.
• Nummer – Het uiteindelijk geleverde liedje.
• Master – Het definitieve audiobestand.
• Compositie – De melodielijn, harmonie en teksten.`
        },
        {
          title: "3. Wat bieden wij?",
          content: "🎶 We creëren unieke nummers, geïnspireerd door de verhalen van onze klanten – voor cadeaus, evenementen, advertenties of artistiek gebruik."
        },
        {
          title: "4. Hoe werkt bestellen?",
          content: `🕒 Levertijden:
• 3–5 werkdagen: voor Personal, Business, Premium pakketten
• 7–10 werkdagen: voor Artist pakket

📦 Het nummer wordt geleverd via veilige link, verzonden per email.`
        },
        {
          title: "5. Auteursrechten en gebruiksrechten",
          content: `✍️ Auteursrechten op het nummer (compositie en teksten) blijven bij Mango Records.

🎧 Je ontvangt het recht om het nummer te gebruiken volgens je gekozen pakket (bijv. persoonlijk, commercieel etc.).`
        },
        {
          title: "6. Portfolio",
          content: "We kunnen jouw nummer opnemen in ons portfolio als creatievoorbeeld. Dit heeft geen invloed op jouw gebruiksrechten."
        },
        {
          title: "7. Betaling en terugbetaling",
          content: `💳 Betaling gebeurt volledig bij het plaatsen van de bestelling.

❌ Omdat producten gepersonaliseerd zijn, worden terugbetalingen niet geaccepteerd – behalve in speciale situaties (bijv. ernstige technische fout).`
        },
        {
          title: "8. Jouw verantwoordelijkheden",
          content: `• Juiste en volledige informatie verstrekken.
• Geen ongepaste inhoud sturen (vulgair, illegaal etc.).
• De website verantwoordelijk gebruiken.`
        },
        {
          title: "9. Wijzigingen in voorwaarden",
          content: "We kunnen deze voorwaarden op elk moment bijwerken. We moedigen je aan om periodiek terug te komen om eventuele wijzigingen te controleren."
        },
        {
          title: "10. 📬 Nieuwsbrief en commerciële communicatie",
          content: `Door je aan te melden voor de nieuwsbrief:
• Accepteer je emails te ontvangen met nieuws, aanbiedingen en MusicGift campagnes.
• Je kunt je op elk moment uitschrijven via de emaillink of door te schrijven naar: mihai.gruia@mangorecords.net
• We respecteren alle AVG-regelgeving. We sturen geen spam en delen je gegevens niet met derden.`
        },
        {
          title: "11. 🔐 Gegevensbescherming (AVG)",
          content: `We verzamelen :
• Naam, email, telefoon

Doel :
• Bestelling verwerken
• Verzenden van commerciële communicatie

Jouw rechten :
• Toegang, rectificatie, verwijdering, bezwaar, overdraagbaarheid`
        },
        {
          title: "12. Website gebruik",
          content: `Verboden :
• Fraude
• Misbruik
• Inhoud kopiëren zonder toestemming`
        },
        {
          title: "13. Cookie beleid",
          content: "We gebruiken cookies om je website-ervaring te verbeteren."
        },
        {
          title: "14. Toepasselijk recht",
          content: "Deze voorwaarden worden beheerst door Roemeense wetgeving."
        },
        {
          title: "15. Recht om bestellingen te weigeren",
          content: "We kunnen bestellingen weigeren in gerechtvaardigde gevallen (bijv. onaanvaardbare inhoud). In dergelijke gevallen betalen we het geld volledig terug."
        },
        {
          title: "16. 🔁 Retourbeleid",
          content: `Omdat het 100% gepersonaliseerde producten zijn, kunnen ze niet geretourneerd worden, volgens OUG nr. 34/2014.

✅ In uitzonderlijke gevallen (technische fouten of onmogelijkheid van levering), kunnen we:
• Het nummer opnieuw maken
• Gedeeltelijke/volledige terugbetaling aanbieden`
        },
        {
          title: "17. Aansprakelijkheidsbeperking",
          content: "MusicGift is niet verantwoordelijk voor indirecte schade. Onze maximale aansprakelijkheid is het bedrag betaald door de klant."
        },
        {
          title: "18. Overmacht",
          content: "We zijn niet verantwoordelijk voor vertragingen veroorzaakt door externe factoren: rampen, pandemieën, conflicten etc."
        },
        {
          title: "19. Gebruik van het nummer",
          content: "De klant is alleen verantwoordelijk voor hoe, waar en in welke context ze het nummer gebruiken."
        },
        {
          title: "20. Bestellingen met onaanvaardbare inhoud",
          content: `We weigeren bestellingen die bevatten:
• Vulgaire taal
• Politieke, discriminerende of beledigende berichten`
        },
        {
          title: "21. Materialen verzonden door klant",
          content: `Als je ons afbeeldingen, clips of andere bestanden stuurt voor video:
• Je moet de gebruiksrechten bezitten
• Je geeft ons toestemming om ze alleen te gebruiken voor bestelling levering`
        },
        {
          title: "22. 🎧 \"Remix\" pakket",
          content: `Je kunt alleen een remix bestellen als je 100% van de rechten op het originele nummer bezit.

Als je publicatie via Mango Records vraagt, moet je ons juridisch bewijs sturen.

Als blijkt dat je valse informatie hebt verstrekt:
• Het betaalde bedrag wordt niet terugbetaald
• Je bent verantwoordelijk voor eventuele auteursrechtgeschillen`
        },
        {
          title: "23. ⏳ Levering opslag",
          content: `We bewaren nummers en bestanden geassocieerd met je bestelling gedurende 6 maanden.

Na deze periode kunnen ze automatisch worden verwijderd zonder melding.

👉 Sla bestanden lokaal op onmiddellijk na levering.`
        },
        {
          title: "24. Contact",
          content: `📧 Email: mihai.gruia@mangorecords.net
📞 Telefoon: 0723 141 501
🌐 Website: www.musicgift.ro
🏢 Beheerd door: SC MANGO RECORDS SRL
📍 Adres: Str. Fabrica de Glucoză 6–8, București
🧾 CUI: RO29228083 | RC Nr: J23/2828/2017`
        }
      ],
      footer: "Als je vragen hebt, kun je ons op elk moment schrijven – we zijn er om je met plezier te helpen! 🎼❤️"
    },
    pl: {
      title: "Regulamin – MusicGift.ro",
      intro: "Witamy na MusicGift.ro! Zamawiając spersonalizowaną piosenkę, zgadzasz się na poniższe zasady. Napisaliśmy je prosto i jasno, abyś wiedział dokładnie, co otrzymujesz.",
      sections: [
        {
          title: "1. Kim jesteśmy?",
          content: "MusicGift to usługa stworzona przez Mango Records SRL, rumuńską firmę z siedzibą w Bukareszcie, Str. Fabrica de Glucoză 6–8, zarejestrowaną w Rejestrze Handlowym pod nr. J23/2828/2017, CUI RO29228083."
        },
        {
          title: "2. Co oznacza każdy termin?",
          content: `• MusicGift – Usługa tworząca spersonalizowane piosenki.
• Klient – Ty, osoba zamawiająca piosenkę.
• Piosenka – Ostateczny dostarczony utwór.
• Master – Ostateczny plik audio.
• Kompozycja – Linia melodyczna, harmonia i teksten.`
        },
        {
          title: "3. Co oferujemy?",
          content: "🎶 Tworzymy unikalne piosenki, inspirowane historiami naszych klientów – na prezenty, wydarzenia, reklamy lub użytek artystyczny."
        },
        {
          title: "4. Jak działa zamawianie?",
          content: `🕒 Terminy dostawy:
• 3–5 dni roboczych: dla pakietów Personal, Business, Premium
• 7–10 dni roboczych: dla pakietu Artist

📦 Piosenka jest dostarczana przez bezpieczny link, wysłany emailem.`
        },
        {
          title: "5. Prawa autorskie i użytkowania",
          content: `✍️ Prawa autorskie do piosenki (kompozycja i tekst) pozostają przy Mango Records.

🎧 Otrzymujesz prawo do używania piosenki zgodnie z wybranym pakietem (np. osobiste, komercyjne itp.).`
        },
        {
          title: "6. Portfolio",
          content: "Możemy umieścić twoją piosenkę w naszym portfolio jako przykład twórczości. Nie wpływa to w żaden sposób na twoje prawa użytkowania."
        },
        {
          title: "7. Płatność i zwroty",
          content: `💳 Płatność dokonywana jest w całości przy składaniu zamówienia.

❌ Ponieważ produkty są spersonalizowane, zwroty nie są akceptowane – z wyjątkiem specjalnych sytuacji (np. poważny błąd techniczny).`
        },
        {
          title: "8. Twoje obowiązki",
          content: `• Podawanie dokładnych i kompletnych informacji.
• Nie wysyłanie nieodpowiedniej treści (wulgarnej, nielegalnej itp.).
• Odpowiedzialne korzystanie ze strony.`
        },
        {
          title: "9. Zmiany w regulaminie",
          content: "Możemy aktualizować ten regulamin w dowolnym momencie. Zachęcamy do okresowego sprawdzania ewentualnych zmian."
        },
        {
          title: "10. 📬 Newsletter i komunikacja komercyjna",
          content: `Subskrybując newsletter:
• Zgadzasz się na otrzymywanie emaili z nowościami, ofertami i kampaniami MusicGift.
• Możesz się wypisać w dowolnym momencie przez link w emailu lub pisząc na: mihai.gruia@mangorecords.net
• Przestrzegamy wszystkich przepisów RODO. Nie wysyłamy spamu i nie udostępniamy twoich danych stronom trzecim.`
        },
        {
          title: "11. 🔐 Ochrona danych (RODO)",
          content: `Zbieramy:
• Imię, email, telefon

Cel:
• Przetwarzanie zamówienia
• Wysyłanie komunikacji komercyjnej

Twoje prawa:
• Dostęp, sprostowanie, usunięcie, sprzeciw, przenośność`
        },
        {
          title: "12. Użytkowanie strony",
          content: `Zabronione:
• Oszustwo
• Nadużywanie
• Kopiowanie treści bez zgody`
        },
        {
          title: "13. Polityka cookies",
          content: "Używamy plików cookie, aby poprawić twoje doświadczenie na stronie."
        },
        {
          title: "14. Prawo właściwe",
          content: "Ten regulamin podlega prawu rumuńskiemu."
        },
        {
          title: "15. Prawo do odmowy zamówień",
          content: "Możemy odmówić zamówień w uzasadnionych przypadkach (np. nieakceptowalna treść). W takich przypadkach w pełni zwracamy pieniądze."
        },
        {
          title: "16. 🔁 Polityka zwrotów",
          content: `Będąc produktami w 100% spersonalizowanymi, nie mogą być zwracane, zgodnie z OUG nr. 34/2014.

✅ W wyjątkowych przypadkach (błędy techniczne lub niemożność dostawy), możemy:
• Przerobić piosenkę
• Zaoferować częściowy/pełny zwrot`
        },
        {
          title: "17. Ograniczenie odpowiedzialności",
          content: "MusicGift nie odpowiada za szkody pośrednie. Nasza maksymalna odpowiedzialność to kwota zapłacona przez klienta."
        },
        {
          title: "18. Siła wyższa",
          content: "Nie odpowiadamy za opóźnienia spowodowane czynnikami zewnętrznymi: katastrofy, pandemie, konflikty itp."
        },
        {
          title: "19. Użytkowanie piosenki",
          content: "Klient jest jedynym odpowiedzialnym za to, jak, gdzie i w jakim kontekście używa piosenki."
        },
        {
          title: "20. Zamówienia z nieakceptowalną treścią",
          content: `Odmawiamy zamówień zawierających:
• Wulgarny język
• Wiadomości polityczne, dyskryminacyjne lub obraźliwe`
        },
        {
          title: "21. Materiały wysłane przez klienta",
          content: `Jeśli wysyłasz nam obrazy, klipy lub inne pliki do filmu:
• Musisz posiadać prawa użytkowania
• Dajesz nam pozwolenie na ich użycie tylko do realizacji zamówienia`
        },
        {
          title: "22. 🎧 Pakiet \"Remix\"",
          content: `Możesz zamówić remix tylko jeśli posiadasz 100% praw do oryginalnej piosenki.

Jeśli żądasz publikacji przez Mango Records, musisz przesłać nam dowody prawne.

Jeśli okaże się, że podałeś fałszywe informacje:
• Zapłacona kwota nie jest zwracana
• Będziesz odpowiadać za wszelkie spory dotyczące praw autorskich`
        },
        {
          title: "23. ⏳ Przechowywanie dostaw",
          content: `Przechowujemy piosenki i pliki związane z twoim zamówieniem przez 6 miesięcy.

Po tym okresie mogą zostać automatycznie usunięte bez powiadomienia.

👉 Prosimy o zapisanie plików lokalnie natychmiast po dostawie.`
        },
        {
          title: "24. Kontakt",
          content: `📧 Email: mihai.gruia@mangorecords.net
📞 Telefon: 0723 141 501
🌐 Strona: www.musicgift.ro
🏢 Prowadzone przez: SC MANGO RECORDS SRL
📍 Adres: Str. Fabrica de Glucoză 6–8, București
🧾 CUI: RO29228083 | Nr RC: J23/2828/2017`
        }
      ],
      footer: "Jeśli masz pytania, możesz napisać do nas w dowolnym momencie – jesteśmy tu, aby ci pomóc z przyjemnością! 🎼❤️"
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
            
            {currentTerms.sections.map((section, index) => (
              <section key={index}>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">{section.title}</h3>
                <div className="whitespace-pre-line">{section.content}</div>
                {index < currentTerms.sections.length - 1 && (
                  <div className="w-full h-px bg-gray-200 mt-6"></div>
                )}
              </section>
            ))}
            
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
