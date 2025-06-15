
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface LegalModalsProps {
  showModal: string | null;
  onClose: () => void;
}

const LegalModals = ({ showModal, onClose }: LegalModalsProps) => {
  const { t } = useLanguage();

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

  // Helper function to safely get array translations
  const getArrayTranslation = (key: string): string[] => {
    const translation = t(key);
    if (Array.isArray(translation)) {
      return translation;
    }
    // Fallback to empty array if translation is not an array
    return [];
  };

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
MusicGift is a service created by Mango Records SRL, a Romanian company headquartered in Bucharest, Str. Fabrica de Glucoză 6–8, registered with the Trade Registry under no. J23/2828/2017, CUI RO29228083.

2. What does each term mean?
• MusicGift – The service that creates personalized songs.
• Client – You, the one ordering a song.
• Song – The final delivered track.
• Master – The final audio file.
• Composition – The melody line, harmony and lyrics.

3. What do we offer?
🎶 We create unique songs, inspired by our clients' stories – for gifts, events, advertisements or artistic use.

4. How does ordering work?
🕒 Delivery terms:
• 3–5 working days: for Personal, Business, Premium packages
• 7–10 working days: for Artist package

📦 The song is delivered through a secure link, sent by email.

5. Copyright and usage rights
✍️ The copyright of the song (composition and lyrics) remains with Mango Records.
🎧 You receive the right to use the song according to the chosen package (e.g.: personal, commercial etc.).

6. Portfolio
We may include your song in our portfolio as an example of creation. This does not affect your usage rights in any way.

7. Payment and refund
💳 Payment is made in full when placing the order.
❌ Because products are personalized, refunds are not accepted – except in special situations (e.g.: serious technical error).

8. Your responsibilities
• To provide correct and complete information.
• Not to send inappropriate content (vulgar, illegal etc.).
• To use the site responsibly.

9. Changes to terms
We may update these terms at any time. We encourage you to return periodically to check for possible changes.

10. 📬 Newsletter and commercial communications
By subscribing to the newsletter:
• You agree to receive emails with news, offers and MusicGift campaigns.
• You can unsubscribe at any time through the link in the email or by writing to: mihai.gruia@mangorecords.net
• We respect all GDPR regulations. We do not send spam and do not share your data with third parties.

11. 🔐 Data protection (GDPR)
We collect: Name, email, phone
Purpose: Order processing, Sending commercial communications
Your rights: Access, rectification, deletion, opposition, portability

12. Website usage
Prohibited: Fraud, Abusive use, Copying content without agreement

13. Cookie policy
We use cookies to improve your experience on the site.

14. Applicable law
These terms are governed by Romanian legislation.

15. Right to refuse orders
We may refuse orders in justified cases (e.g.: unacceptable content). In such cases, we return the money in full.

16. 🔁 Return policy
Being 100% personalized products, they cannot be returned, according to OUG no. 34/2014.
✅ In exceptional cases (technical errors or impossibility of delivery), we can:
• Remake the song
• Offer partial/full refund

17. Limitation of liability
MusicGift is not responsible for indirect damages. Our maximum liability is the amount paid by the client.

18. Force majeure
We are not responsible for delays caused by external factors: disasters, pandemics, conflicts etc.

19. Song usage
The client is solely responsible for how, where and in what context they use the song.

20. Orders with unacceptable content
We refuse orders containing: Vulgar language, Political, discriminatory or offensive messages

21. Materials sent by client
If you send us images, clips or other files for video:
• You must own the usage rights
• You give us permission to use them only for order delivery

22. 🎧 "Remix" Package
You can order a remix only if you own 100% of the rights to the original song.
If you request publication through Mango Records, you must send us legal proof.
If it is proven that you provided false information:
• The paid amount is not refunded
• You will be responsible for any dispute regarding copyrights

23. ⏳ Delivery storage
We keep the songs and files associated with your order for 6 months.
After this period, they may be automatically deleted without notification.
👉 Please save the files locally immediately after delivery.

24. Contact
📧 Email: mihai.gruia@mangorecords.net
📞 Phone: 0723 141 501
🌐 Website: www.musicgift.ro
🏢 Operated by: SC MANGO RECORDS SRL
📍 Address: Str. Fabrica de Glucoză 6–8, Bucharest
🧾 CUI: RO29228083 | RC No.: J23/2828/2017`,
      footer: "If you have questions, you can write to us anytime – we are here to help you with pleasure! 🎼❤️"
    },
    fr: {
      title: "Conditions Générales – MusicGift.ro",
      intro: "Bienvenue sur MusicGift.ro ! En commandant une chanson personnalisée, vous acceptez les règles ci-dessous. Nous les avons écrites de manière simple et claire, pour que vous sachiez exactement ce que vous recevez.",
      content: `1. Qui sommes-nous ?
MusicGift est un service créé par Mango Records SRL, société roumaine dont le siège social est à Bucarest, Str. Fabrica de Glucoză 6–8, enregistrée au Registre du Commerce sous le no. J23/2828/2017, CUI RO29228083.

2. Que signifie chaque terme ?
• MusicGift – Le service qui crée des chansons personnalisées.
• Client – Vous, celui qui commande une chanson.
• Chanson – Le morceau final livré.
• Master – Le fichier audio final.
• Composition – La ligne mélodique, l'harmonie et les paroles.

3. Que proposons-nous ?
🎶 Nous créons des chansons uniques, inspirées des histoires de nos clients – pour des cadeaux, événements, publicités ou usage artistique.

4. Comment fonctionne la commande ?
🕒 Délais de livraison :
• 3–5 jours ouvrables : pour les packages Personnel, Business, Premium
• 7–10 jours ouvrables : pour le package Artiste

📦 La chanson est livrée via un lien sécurisé, envoyé par email.

5. Droits d'auteur et utilisation
✍️ Les droits d'auteur de la chanson (composition et paroles) restent à Mango Records.
🎧 Vous recevez le droit d'utiliser la chanson selon le package choisi (ex : personnel, commercial etc.).

6. Portfolio
Nous pouvons inclure votre chanson dans notre portfolio comme exemple de création. Cela n'affecte en rien vos droits d'utilisation.

7. Paiement et remboursement
💳 Le paiement se fait intégralement lors de la commande.
❌ Parce que les produits sont personnalisés, les remboursements ne sont pas acceptés – sauf situations spéciales (ex : erreur technique grave).

8. Vos responsabilités
• Fournir des informations correctes et complètes.
• Ne pas envoyer de contenu inapproprié (vulgaire, illégal etc.).
• Utiliser le site de manière responsable.

9. Modifications des conditions
Nous pouvons mettre à jour ces conditions à tout moment. Nous vous encourageons à revenir périodiquement pour vérifier d'éventuelles modifications.

10. 📬 Newsletter et communications commerciales
En vous abonnant à la newsletter :
• Vous acceptez de recevoir des emails avec des actualités, offres et campagnes MusicGift.
• Vous pouvez vous désabonner à tout moment via le lien dans l'email ou en écrivant à : mihai.gruia@mangorecords.net
• Nous respectons toutes les réglementations RGPD. Nous n'envoyons pas de spam et ne partageons pas vos données avec des tiers.

11. 🔐 Protection des données (RGPD)
Nous collectons : Nom, email, téléphone
Objectif : Traitement de la commande, Envoi de communications commerciales
Vos droits : Accès, rectification, suppression, opposition, portabilité

12. Utilisation du site
Interdit : Fraude, Utilisation abusive, Copie du contenu sans accord

13. Politique de cookies
Nous utilisons des cookies pour améliorer votre expérience sur le site.

14. Loi applicable
Ces conditions sont régies par la législation roumaine.

15. Droit de refuser les commandes
Nous pouvons refuser des commandes dans des cas justifiés (ex : contenu inacceptable). Dans de tels cas, nous remboursons intégralement.

16. 🔁 Politique de retour
Étant des produits 100% personnalisés, ils ne peuvent être retournés, selon OUG no. 34/2014.
✅ Dans des cas exceptionnels (erreurs techniques ou impossibilité de livraison), nous pouvons :
• Refaire la chanson
• Offrir un remboursement partiel/intégral

17. Limitation de responsabilité
MusicGift n'est pas responsable des dommages indirects. Notre responsabilité maximale est le montant payé par le client.

18. Force majeure
Nous ne sommes pas responsables des retards causés par des facteurs externes : catastrophes, pandémies, conflictes etc.

19. Utilisation de la chanson
Le client est seul responsable de comment, où et dans quel contexte il utilise la chanson.

20. Commandes avec contenu inacceptable
Nous refusons les commandes contenant : Langage vulgaire, Messages politiques, discriminatoires ou offensants

21. Matériaux envoyés par le client
Si vous nous envoyez des images, clips ou autres fichiers pour vidéo :
• Vous devez posséder les droits d'utilisation
• Vous nous donnez la permission de les utiliser uniquement pour la livraison de la commande

22. 🎧 Package "Remix"
Vous pouvez commander un remix seulement si vous possédez 100% des droits de la chanson originale.
Si vous demandez une publication via Mango Records, vous devez nous envoyer des preuves légales.
S'il est prouvé que vous avez fourni de fausses informations :
• Le montant payé n'est pas remboursé
• Vous serez responsable de tout litige concernant les droits d'auteur

23. ⏳ Stockage des livraisons
Nous conservons les chansons et fichiers associés à votre commande pendant 6 mois.
Après cette période, ils peuvent être supprimés automatiquement sans notification.
👉 Veuillez sauvegarder les fichiers localement immédiatement après livraison.

24. Contact
📧 Email : mihai.gruia@mangorecords.net
📞 Téléphone : 0723 141 501
🌐 Site web : www.musicgift.ro
🏢 Exploité par : SC MANGO RECORDS SRL
📍 Adresse : Str. Fabrica de Glucoză 6–8, Bucarest
🧾 CUI : RO29228083 | No. RC : J23/2828/2017`,
      footer: "Si vous avez des questions, vous pouvez nous écrire à tout moment – nous sommes là pour vous aider avec plaisir ! 🎼❤️"
    },
    nl: {
      title: "Algemene Voorwaarden – MusicGift.ro",
      intro: "Welkom bij MusicGift.ro! Door een gepersonaliseerd nummer te bestellen, ga je akkoord met de onderstaande regels. We hebben ze eenvoudig en duidelijk geschreven, zodat je precies weet wat je krijgt.",
      content: `1. Wie zijn wij?
MusicGift is een service gecreëerd door Mango Records SRL, een Roemeens bedrijf gevestigd in Boekarest, Str. Fabrica de Glucoză 6–8, geregistreerd bij het Handelsregister onder nr. J23/2828/2017, CUI RO29228083.

2. Wat betekent elke term?
• MusicGift – De service die gepersonaliseerde nummers creëert.
• Klant – Jij, degene die een nummer bestelt.
• Nummer – Het uiteindelijk geleverde liedje.
• Master – Het uiteindelijke audiobestand.
• Compositie – De melodielijn, harmonie en teksten.

3. Wat bieden wij?
🎶 We creëren unieke nummers, geïnspireerd door de verhalen van onze klanten – voor cadeaus, evenementen, advertenties of artistiek gebruik.

4. Hoe werkt bestellen?
🕒 Levertermijnen:
• 3–5 werkdagen: voor Personal, Business, Premium pakketten
• 7–10 werkdagen: voor Artist pakket

📦 Het nummer wordt geleverd via een beveiligde link, verzonden per email.

5. Auteursrechten en gebruik
✍️ De auteursrechten van het nummer (compositie en tekst) blijven bij Mango Records.
🎧 Je ontvangt het recht om het nummer te gebruiken volgens het gekozen pakket (bijv.: persoonlijk, commercieel etc.).

6. Portfolio
We kunnen jouw nummer opnemen in ons portfolio als voorbeeld van creatie. Dit heeft geen invloed op jouw gebruiksrechten.

7. Betaling en terugbetaling
💳 Betaling wordt volledig gedaan bij het plaatsen van de bestelling.
❌ Omdat producten gepersonaliseerd zijn, worden terugbetalingen niet geaccepteerd – behalve in speciale situaties (bijv.: ernstige technische fout).

8. Jouw verantwoordelijkheden
• Correcte en volledige informatie verstrekken.
• Geen ongepaste inhoud verzenden (vulgair, illegaal etc.).
• De site verantwoordelijk gebruiken.

9. Wijzigingen van voorwaarden
We kunnen deze voorwaarden op elk moment bijwerken. We moedigen je aan om periodiek terug te komen om mogelijke wijzigingen te controleren.

10. 📬 Nieuwsbrief en commerciële communicatie
Door je aan te melden voor de nieuwsbrief:
• Ga je akkoord met het ontvangen van emails met nieuws, aanbiedingen en MusicGift campagnes.
• Je kunt je op elk moment afmelden via de link in de email of door te schrijven naar: mihai.gruia@mangorecords.net
• We respecteren alle AVG-regelgeving. We sturen geen spam en delen je gegevens niet met derden.

11. 🔐 Gegevensbescherming (AVG)
We verzamelen: Naam, email, telefoon
Doel: Orderverwerking, Verzenden van commerciële communicatie
Jouw rechten: Toegang, rectificatie, verwijdering, bezwaar, portabiliteit

12. Website gebruik
Verboden: Fraude, Misbruik, Kopiëren van inhoud zonder toestemming

13. Cookie beleid
We gebruiken cookies om je ervaring op de site te verbeteren.

14. Toepasselijk recht
Deze voorwaarden worden beheerst door de Roemeense wetgeving.

15. Recht om bestellingen te weigeren
We kunnen bestellingen weigeren in gerechtvaardigde gevallen (bijv.: onaanvaardbare inhoud). In dergelijke gevallen betalen we het geld volledig terug.

16. 🔁 Retourbeleid
Omdat het 100% gepersonaliseerde producten zijn, kunnen ze niet worden geretourneerd, volgens OUG nr. 34/2014.
✅ In uitzonderlijke gevallen (technische fouten of onmogelijkheid van levering), kunnen we:
• Het nummer opnieuw maken
• Gedeeltelijke/volledige terugbetaling aanbieden

17. Beperking van aansprakelijkheid
MusicGift is niet verantwoordelijk voor indirecte schade. Onze maximale aansprakelijkheid is het bedrag dat door de klant is betaald.

18. Overmacht
We zijn niet verantwoordelijk voor vertragingen veroorzaakt door externe factoren: rampen, pandemieën, conflicten etc.

19. Nummer gebruik
De klant is alleen verantwoordelijk voor hoe, waar en in welke context hij het nummer gebruikt.

20. Bestellingen met onaanvaardbare inhoud
We weigeren bestellingen die bevatten: Vulgaire taal, Politieke, discriminerende of beledigende berichten

21. Materialen verzonden door klant
Als je ons afbeeldingen, clips of andere bestanden stuurt voor video:
• Je moet de gebruiksrechten bezitten
• Je geeft ons toestemming om ze alleen te gebruiken voor orderlevering

22. 🎧 "Remix" Pakket
Je kunt alleen een remix bestellen als je 100% van de rechten op het originele nummer bezit.
Als je publicatie via Mango Records vraagt, moet je ons juridisch bewijs sturen.
Als bewezen wordt dat je valse informatie hebt verstrekt:
• Het betaalde bedrag wordt niet terugbetaald
• Je bent verantwoordelijk voor elk geschil betreffende auteursrechten

23. ⏳ Levering opslag
We bewaren de nummers en bestanden geassocieerd met je bestelling gedurende 6 maanden.
Na deze periode kunnen ze automatisch worden verwijderd zonder kennisgeving.
👉 Sla de bestanden lokaal op onmiddellijk na levering.

24. Contact
📧 Email: mihai.gruia@mangorecords.net
📞 Telefoon: 0723 141 501
🌐 Website: www.musicgift.ro
🏢 Geëxploiteerd door: SC MANGO RECORDS SRL
📍 Adres: Str. Fabrica de Glucoză 6–8, Boekarest
🧾 CUI: RO29228083 | RC Nr.: J23/2828/2017`,
      footer: "Als je vragen hebt, kun je ons op elk moment schrijven – we zijn er om je met plezier te helpen! 🎼❤️"
    },
    pl: {
      title: "Regulamin – MusicGift.ro",
      intro: "Witamy na MusicGift.ro! Zamawiając spersonalizowaną piosenkę, zgadzasz się na poniższe zasady. Napisaliśmy je prosto i jasno, żebyś wiedział dokładnie, co otrzymujesz.",
      content: `1. Kim jesteśmy?
MusicGift to usługa stworzona przez Mango Records SRL, rumuńską firmę z siedzibą w Bukareszcie, Str. Fabrica de Glucoză 6–8, zarejestrowaną w Rejestrze Handlowym pod nr. J23/2828/2017, CUI RO29228083.

2. Co oznacza każdy termin?
• MusicGift – Usługa, która tworzy spersonalizowane piosenki.
• Klient – Ty, osoba zamawiająca piosenkę.
• Piosenka – Ostateczny dostarczony utwór.
• Master – Ostateczny plik audio.
• Kompozycja – Linia melodyczna, harmonia i tekst.

3. Co oferujemy?
🎶 Tworzymy unikalne piosenki, inspirowane historiami naszych klientów – na prezenty, wydarzenia, reklamy lub użytek artystyczny.

4. Jak działa zamawianie?
🕒 Terminy dostawy:
• 3–5 dni roboczych: dla pakietów Personal, Business, Premium
• 7–10 dni roboczych: dla pakietu Artist

📦 Piosenka jest dostarczana przez bezpieczny link, wysłany e-mailem.

5. Prawa autorskie i użytkowanie
✍️ Prawa autorskie do piosenki (kompozycja i tekst) pozostają przy Mango Records.
🎧 Otrzymujesz prawo do używania piosenki zgodnie z wybranym pakietem (np.: osobiste, komercyjne itp.).

6. Portfolio
Możemy umieścić twoją piosenkę w naszym portfolio jako przykład twórczości. To w żaden sposób nie wpływa na twoje prawa użytkowania.

7. Płatność i zwrot
💳 Płatność dokonywana jest w całości przy składaniu zamówienia.
❌ Ponieważ produkty są spersonalizowane, zwroty nie są akceptowane – z wyjątkiem szczególnych sytuacji (np.: poważny błąd techniczny).

8. Twoje obowiązki
• Podawanie poprawnych i kompletnych informacji.
• Nie wysyłanie nieodpowiedniej treści (wulgarnej, nielegalnej itp.).
• Odpowiedzialne korzystanie ze strony.

9. Zmiany warunków
Możemy aktualizować te warunki w dowolnym momencie. Zachęcamy do okresowego powracania w celu sprawdzenia możliwych zmian.

10. 📬 Newsletter i komunikacja komercyjna
Zapisując się do newslettera:
• Zgadzasz się na otrzymywanie e-maili z nowościami, ofertami i kampaniami MusicGift.
• Możesz wypisać się w dowolnym momencie przez link w e-mailu lub pisząc na: mihai.gruia@mangorecords.net
• Przestrzegamy wszystkich przepisów RODO. Nie wysyłamy spamu i nie udostępniamy twoich danych stronom trzecim.

11. 🔐 Ochrona danych (RODO)
Zbieramy: Imię, e-mail, telefon
Cel: Przetwarzanie zamówienia, Wysyłanie komunikacji komercyjnej
Twoje prawa: Dostęp, sprostowanie, usunięcie, sprzeciw, przenośność

12. Korzystanie ze strony
Zabronione: Oszustwo, Nadużywanie, Kopiowanie treści bez zgody

13. Polityka cookies
Używamy plików cookie, aby poprawić twoje doświadczenia na stronie.

14. Prawo właściwe
Te warunki są regulowane przez rumuńskie prawo.

15. Prawo do odmowy zamówień
Możemy odmówić zamówień w uzasadnionych przypadkach (np.: nieakceptowalna treść). W takich przypadkach zwracamy pieniądze w całości.

16. 🔁 Polityka zwrotów
Będąc produktami 100% spersonalizowanymi, nie mogą być zwrócone, zgodnie z OUG nr. 34/2014.
✅ W wyjątkowych przypadkach (błędy techniczne lub niemożność dostawy), możemy:
• Przerobić piosenkę
• Zaoferować częściowy/pełny zwrot

17. Ograniczenie odpowiedzialności
MusicGift nie jest odpowiedzialny za szkody pośrednie. Nasza maksymalna odpowiedzialność to kwota zapłacona przez klienta.

18. Siła wyższa
Nie jesteśmy odpowiedzialni za opóźnienia spowodowane czynnikami zewnętrznymi: katastrofy, pandemie, konflikty itp.

19. Użycie piosenki
Klient jest jedynym odpowiedzialnym za to, jak, gdzie i w jakim kontekście używa piosenki.

20. Zamówienia z nieakceptowalną treścią
Odmawiamy zamówień zawierających: Wulgarny język, Wiadomości polityczne, dyskryminacyjne lub obraźliwe

21. Materiały wysłane przez klienta
Jeśli wysyłasz nam obrazy, klipy lub inne pliki do wideo:
• Musisz posiadać prawa użytkowania
• Dajesz nam pozwolenie na ich użycie tylko do realizacji zamówienia

22. 🎧 Pakiet "Remix"
Możesz zamówić remix tylko jeśli posiadasz 100% praw do oryginalnej piosenki.
Jeśli prosisz o publikację przez Mango Records, musisz przesłać nam dowody prawne.
Jeśli udowodni się, że podałeś fałszywe informacje:
• Zapłacona kwota nie jest zwracana
• Będziesz odpowiedzialny za wszelkie spory dotyczące praw autorskich

23. ⏳ Przechowywanie dostaw
Przechowujemy piosenki i pliki związane z twoim zamówieniem przez 6 miesięcy.
Po tym okresie mogą zostać automatycznie usunięte bez powiadomienia.
👉 Prosimy o zapisanie plików lokalnie natychmiast po dostawie.

24. Kontakt
📧 E-mail: mihai.gruia@mangorecords.net
📞 Telefon: 0723 141 501
🌐 Strona: www.musicgift.ro
🏢 Prowadzone przez: SC MANGO RECORDS SRL
📍 Adres: Str. Fabrica de Glucoză 6–8, Bukareszt
🧾 CUI: RO29228083 | Nr. RC: J23/2828/2017`,
      footer: "Jeśli masz pytania, możesz napisać do nas w dowolnym momencie – jesteśmy tutaj, aby pomóc ci z przyjemnością! 🎼❤️"
    }
  };

  const currentTerms = termsContent[currentLang] || termsContent.ro;

  return (
    <>
      {/* Terms & Conditions Modal */}
      <Dialog open={showModal === 'terms'} onOpenChange={onClose}>
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
      <Dialog open={showModal === 'privacy'} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-md border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-4">
              {t('privacyPolicy')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h3 className="text-lg font-semibold mb-3">{t('dataCollection')}</h3>
              <p>{t('dataCollectionContent')}</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('howWeUseData')}</h3>
              <ul className="list-disc pl-6 space-y-2">
                {getArrayTranslation('howWeUseDataList').map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('dataProtection')}</h3>
              <p>{t('dataProtectionContent')}</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('thirdPartyServices')}</h3>
              <p>{t('thirdPartyServicesContent')}</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('yourRights')}</h3>
              <ul className="list-disc pl-6 space-y-2">
                {getArrayTranslation('yourRightsList').map((right, index) => (
                  <li key={index}>{right}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('contact')}</h3>
              <p>{t('contactContent')}</p>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Refund Policy Modal */}
      <Dialog open={showModal === 'refund'} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-md border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-4">
              {t('refundPolicy')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h3 className="text-lg font-semibold mb-3">{t('refundEligibility')}</h3>
              <p>{t('refundEligibilityContent')}</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('whenRefundsApply')}</h3>
              <ul className="list-disc pl-6 space-y-2">
                {getArrayTranslation('whenRefundsApplyList').map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('refundProcess')}</h3>
              <ol className="list-decimal pl-6 space-y-2">
                {getArrayTranslation('refundProcessList').map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('nonRefundableSituations')}</h3>
              <ul className="list-disc pl-6 space-y-2">
                {getArrayTranslation('nonRefundableSituationsList').map((situation, index) => (
                  <li key={index}>{situation}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('partialRefunds')}</h3>
              <p>{t('partialRefundsContent')}</p>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cookie Policy Modal */}
      <Dialog open={showModal === 'cookies'} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-md border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-4">
              {t('cookiePolicy')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h3 className="text-lg font-semibold mb-3">{t('whatAreCookies')}</h3>
              <p>{t('whatAreCookiesContent')}</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('typesOfCookies')}</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">{t('essentialCookies')}</h4>
                  <p className="text-sm">{t('essentialCookiesContent')}</p>
                </div>
                
                <div>
                  <h4 className="font-medium">{t('analyticsCookies')}</h4>
                  <p className="text-sm">{t('analyticsCookiesContent')}</p>
                </div>
                
                <div>
                  <h4 className="font-medium">{t('preferenceCookies')}</h4>
                  <p className="text-sm">{t('preferenceCookiesContent')}</p>
                </div>
                
                <div>
                  <h4 className="font-medium">{t('marketingCookies')}</h4>
                  <p className="text-sm">{t('marketingCookiesContent')}</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('managingCookies')}</h3>
              <p>{t('managingCookiesContent')}</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('thirdPartyCookies')}</h3>
              <p>{t('thirdPartyCookiesContent')}</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">{t('updates')}</h3>
              <p>{t('updatesContent')}</p>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LegalModals;
