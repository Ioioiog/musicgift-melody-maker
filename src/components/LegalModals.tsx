
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
    if (t('home') === 'Startseite') return 'de';
    if (t('home') === 'Casa') return 'it';
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
    },
    de: {
      title: "Allgemeine Geschäftsbedingungen – MusicGift.ro",
      intro: "Willkommen bei MusicGift.ro! Durch die Bestellung eines personalisierten Songs stimmen Sie den unten stehenden Regeln zu. Wir haben sie einfach und klar geschrieben, damit Sie genau wissen, was Sie bekommen.",
      content: `1. Wer sind wir?
MusicGift ist ein Service von Mango Records SRL, einem rumänischen Unternehmen mit Sitz in Bukarest, Str. Fabrica de Glucoză 6–8, registriert im Handelsregister unter Nr. J23/2828/2017, CUI RO29228083.

2. Was bedeutet jeder Begriff?
• MusicGift – Der Service, der personalisierte Songs erstellt.
• Kunde – Sie, derjenige, der einen Song bestellt.
• Song – Der endgültig gelieferte Track.
• Master – Die endgültige Audiodatei.
• Komposition – Die Melodielinie, Harmonie und Texte.

3. Was bieten wir?
🎶 Wir erstellen einzigartige Songs, inspiriert von den Geschichten unserer Kunden – für Geschenke, Events, Werbung oder künstlerische Nutzung.

4. Wie funktioniert die Bestellung?
🕒 Lieferzeiten:
• 3–5 Werktage: für Personal, Business, Premium Pakete
• 7–10 Werktage: für Artist Paket

📦 Der Song wird über einen sicheren Link geliefert, der per E-Mail gesendet wird.

5. Urheberrecht und Nutzungsrechte
✍️ Das Urheberrecht des Songs (Komposition und Text) verbleibt bei Mango Records.
🎧 Sie erhalten das Recht, den Song entsprechend dem gewählten Paket zu nutzen (z.B.: persönlich, kommerziell etc.).

6. Portfolio
Wir können Ihren Song in unser Portfolio als Beispiel für Kreation aufnehmen. Dies beeinträchtigt Ihre Nutzungsrechte in keiner Weise.

7. Zahlung und Rückerstattung
💳 Die Zahlung erfolgt vollständig bei der Bestellaufgabe.
❌ Da die Produkte personalisiert sind, werden Rückerstattungen nicht akzeptiert – außer in besonderen Situationen (z.B.: schwerwiegender technischer Fehler).

8. Ihre Verantwortlichkeiten
• Korrekte und vollständige Informationen bereitzustellen.
• Keine unangemessenen Inhalte zu senden (vulgär, illegal etc.).
• Die Website verantwortungsvoll zu nutzen.

9. Änderungen der Bedingungen
Wir können diese Bedingungen jederzeit aktualisieren. Wir ermutigen Sie, regelmäßig zurückzukehren, um mögliche Änderungen zu überprüfen.

10. 📬 Newsletter und kommerzielle Kommunikation
Durch das Abonnieren des Newsletters:
• Stimmen Sie zu, E-Mails mit Neuigkeiten, Angeboten und MusicGift-Kampagnen zu erhalten.
• Sie können sich jederzeit über den Link in der E-Mail oder durch Schreiben an: mihai.gruia@mangorecords.net abmelden
• Wir respektieren alle DSGVO-Bestimmungen. Wir senden keinen Spam und teilen Ihre Daten nicht mit Dritten.

11. 🔐 Datenschutz (DSGVO)
Wir sammeln: Name, E-Mail, Telefon
Zweck: Bestellabwicklung, Versendung kommerzieller Kommunikation
Ihre Rechte: Zugang, Berichtigung, Löschung, Widerspruch, Portabilität

12. Website-Nutzung
Verboten: Betrug, Missbräuchliche Nutzung, Kopieren von Inhalten ohne Zustimmung

13. Cookie-Richtlinie
Wir verwenden Cookies, um Ihre Erfahrung auf der Website zu verbessern.

14. Anwendbares Recht
Diese Bedingungen unterliegen der rumänischen Gesetzgebung.

15. Recht zur Verweigerung von Bestellungen
Wir können Bestellungen in begründeten Fällen ablehnen (z.B.: inakzeptabler Inhalt). In solchen Fällen erstatten wir das Geld vollständig zurück.

16. 🔁 Rückgaberichtlinie
Als 100% personalisierte Produkte können sie nicht zurückgegeben werden, gemäß OUG Nr. 34/2014.
✅ In Ausnahmefällen (technische Fehler oder Unmöglichkeit der Lieferung) können wir:
• Den Song neu erstellen
• Teilweise/vollständige Rückerstattung anbieten

17. Haftungsbeschränkung
MusicGift ist nicht verantwortlich für indirekte Schäden. Unsere maximale Haftung ist der vom Kunden gezahlte Betrag.

18. Höhere Gewalt
Wir sind nicht verantwortlich für Verzögerungen durch externe Faktoren: Katastrophen, Pandemien, Konflikte etc.

19. Song-Nutzung
Der Kunde ist allein verantwortlich dafür, wie, wo und in welchem Kontext er den Song verwendet.

20. Bestellungen mit inakzeptablem Inhalt
Wir lehnen Bestellungen ab, die enthalten: Vulgäre Sprache, Politische, diskriminierende oder beleidigende Nachrichten

21. Vom Kunden gesendete Materialien
Wenn Sie uns Bilder, Clips oder andere Dateien für Videos senden:
• Sie müssen die Nutzungsrechte besitzen
• Sie geben uns die Erlaubnis, sie nur für die Bestellabwicklung zu verwenden

22. 🎧 "Remix" Paket
Sie können nur einen Remix bestellen, wenn Sie 100% der Rechte am ursprünglichen Song besitzen.
Wenn Sie eine Veröffentlichung über Mango Records beantragen, müssen Sie uns rechtliche Nachweise senden.
Wenn sich herausstellt, dass Sie falsche Informationen angegeben haben:
• Der gezahlte Betrag wird nicht erstattet
• Sie sind für alle Streitigkeiten bezüglich der Urheberrechte verantwortlich

23. ⏳ Lieferungsspeicherung
Wir bewahren die Songs und Dateien Ihrer Bestellung 6 Monate lang auf.
Nach diesem Zeitraum können sie automatisch ohne Benachrichtigung gelöscht werden.
👉 Bitte speichern Sie die Dateien sofort nach der Lieferung lokal.

24. Kontakt
📧 E-Mail: mihai.gruia@mangorecords.net
📞 Telefon: 0723 141 501
🌐 Website: www.musicgift.ro
🏢 Betrieben von: SC MANGO RECORDS SRL
📍 Adresse: Str. Fabrica de Glucoză 6–8, Bukarest
🧾 CUI: RO29228083 | RC Nr.: J23/2828/2017`,
      footer: "Wenn Sie Fragen haben, können Sie uns jederzeit schreiben – wir sind hier, um Ihnen gerne zu helfen! 🎼❤️"
    },
    it: {
      title: "Termini e Condizioni – MusicGift.ro",
      intro: "Benvenuto su MusicGift.ro! Ordinando una canzone personalizzata, accetti le regole qui sotto. Le abbiamo scritte in modo semplice e chiaro, così sai esattamente cosa ricevi.",
      content: `1. Chi siamo?
MusicGift è un servizio creato da Mango Records SRL, azienda rumena con sede a Bucarest, Str. Fabrica de Glucoză 6–8, registrata al Registro del Commercio con n. J23/2828/2017, CUI RO29228083.

2. Cosa significa ogni termine?
• MusicGift – Il servizio che crea canzoni personalizzate.
• Cliente – Tu, colui che ordina una canzone.
• Canzone – Il brano finale consegnato.
• Master – Il file audio finale.
• Composizione – La linea melodica, armonia e testi.

3. Cosa offriamo?
🎶 Creiamo canzoni uniche, ispirate dalle storie dei nostri clienti – per regali, eventi, pubblicità o uso artistico.

4. Come funziona l'ordinazione?
🕒 Tempi di consegna:
• 3–5 giorni lavorativi: per i pacchetti Personal, Business, Premium
• 7–10 giorni lavorativi: per il pacchetto Artist

📦 La canzone viene consegnata tramite link sicuro, inviato via email.

5. Diritti d'autore e utilizzo
✍️ I diritti d'autore della canzone (composizione e testi) rimangono a Mango Records.
🎧 Ricevi il diritto di utilizzare la canzone secondo il pacchetto scelto (es: personale, commerciale ecc.).

6. Portfolio
Potremmo includere la tua canzone nel nostro portfolio come esempio di creazione. Questo non influisce in alcun modo sui tuoi diritti di utilizzo.

7. Pagamento e rimborso
💳 Il pagamento viene effettuato integralmente al momento dell'ordine.
❌ Poiché i prodotti sono personalizzati, i rimborsi non sono accettati – tranne in situazioni speciali (es: errore tecnico grave).

8. Le tue responsabilità
• Fornire informazioni corrette e complete.
• Non inviare contenuti inappropriati (volgari, illegali ecc.).
• Utilizzare il sito responsabilmente.

9. Modifiche ai termini
Possiamo aggiornare questi termini in qualsiasi momento. Ti incoraggiamo a tornare periodicamente per verificare eventuali modifiche.

10. 📬 Newsletter e comunicazioni commerciali
Iscrivendoti alla newsletter:
• Accetti di ricevere email con notizie, offerte e campagne MusicGift.
• Puoi disiscriverti in qualsiasi momento tramite il link nell'email o scrivendo a: mihai.gruia@mangorecords.net
• Rispettiamo tutte le normative GDPR. Non inviamo spam e non condividiamo i tuoi dati con terzi.

11. 🔐 Protezione dei dati (GDPR)
Raccogliamo: Nome, email, telefono
Scopo: Elaborazione dell'ordine, Invio di comunicazioni commerciali
I tuoi diritti: Accesso, rettifica, cancellazione, opposizione, portabilità

12. Utilizzo del sito
Vietato: Frode, Uso abusivo, Copia del contenuto senza accordo

13. Politica sui cookie
Utilizziamo cookie per migliorare la tua esperienza sul sito.

14. Legge applicabile
Questi termini sono regolati dalla legislazione rumena.

15. Diritto di rifiutare ordini
Possiamo rifiutare ordini in casi giustificati (es: contenuto inaccettabile). In tali casi, restituiamo integralmente il denaro.

16. 🔁 Politica di reso
Essendo prodotti 100% personalizzati, non possono essere restituiti, secondo OUG n. 34/2014.
✅ In casi eccezionali (errori tecnici o impossibilità di consegna), possiamo:
• Rifare la canzone
• Offrire rimborso parziale/integrale

17. Limitazione di responsabilità
MusicGift non è responsabile per danni indiretti. La nostra responsabilità massima è l'importo pagato dal cliente.

18. Forza maggiore
Non siamo responsabili per ritardi causati da fattori esterni: disastri, pandemie, conflitti ecc.

19. Utilizzo della canzone
Il cliente è l'unico responsabile di come, dove e in che contesto utilizza la canzone.

20. Ordini con contenuto inaccettabile
Rifiutiamo ordini che contengono: Linguaggio volgare, Messaggi politici, discriminatori o offensivi

21. Materiali inviati dal cliente
Se ci invii immagini, clip o altri file per video:
• Devi possedere i diritti di utilizzo
• Ci dai il permesso di utilizzarli solo per la consegna dell'ordine

22. 🎧 Pacchetto "Remix"
Puoi ordinare un remix solo se possiedi il 100% dei diritti della canzone originale.
Se richiedi la pubblicazione tramite Mango Records, devi inviarci prove legali.
Se si dimostra che hai fornito informazioni false:
• L'importo pagato non viene rimborsato
• Sarai responsabile per qualsiasi disputa riguardante i diritti d'autore

23. ⏳ Archiviazione delle consegne
Conserviamo le canzoni e i file associati al tuo ordine per 6 mesi.
Dopo questo periodo, possono essere eliminati automaticamente senza notifica.
👉 Ti preghiamo di salvare i file localmente subito dopo la consegna.

24. Contatto
📧 Email: mihai.gruia@mangorecords.net
📞 Telefono: 0723 141 501
🌐 Sito web: www.musicgift.ro
🏢 Gestito da: SC MANGO RECORDS SRL
📍 Indirizzo: Str. Fabrica de Glucoză 6–8, Bucarest
🧾 CUI: RO29228083 | N. RC: J23/2828/2017`,
      footer: "Se hai domande, puoi scriverci in qualsiasi momento – siamo qui per aiutarti con piacere! 🎼❤️"
    }
  };

  const privacyContent = {
    ro: {
      title: "Politica de Confidențialitate – MusicGift.ro",
      intro: "Confidențialitatea ta este importantă pentru noi. Această politică explică cum colectăm, folosim și protejăm informațiile tale personale.",
      content: `1. Informații colectate
Colectăm următoarele informații:
• Date de identificare: nume, prenume, email, telefon
• Informații despre comandă: detalii despre melodia dorită, preferințe muzicale
• Date de plată: informații necesare procesării plății (prin furnizori terți)
• Date tehnice: adresa IP, tipul browserului, timpul petrecut pe site

2. Cum folosim informațiile
Folosim datele tale pentru:
• Procesarea și livrarea comenzilor
• Comunicarea despre statusul comenzii
• Îmbunătățirea serviciilor noastre
• Trimiterea de comunicări comerciale (cu acordul tău)
• Respectarea obligațiilor legale

3. Partajarea datelor
Nu vindem și nu închiriem datele tale personale. Le partajăm doar cu:
• Furnizorii de servicii de plată (Stripe, Revolut, SmartBill)
• Furnizorii de servicii email (pentru livrarea comenzilor)
• Autoritățile competente (când este cerut legal)

4. Securitatea datelor
Implementăm măsuri de securitate pentru protejarea datelor:
• Criptarea datelor în tranzit și la repaus
• Accesul restricționat la informațiile personale
• Monitorizarea regulată a sistemelor
• Actualizări de securitate periodice

5. Drepturile tale (GDPR)
Ai următoarele drepturi:
• Dreptul de acces la datele tale
• Dreptul de rectificare a datelor incorecte
• Dreptul de ștergere a datelor
• Dreptul de opoziție la procesare
• Dreptul la portabilitatea datelor
• Dreptul de a retrage consimțământul

6. Cookie-uri
Folosim cookie-uri pentru:
• Funcționarea corectă a site-ului
• Analiza traficului web
• Personalizarea experienței
• Marketing și publicitate (cu acordul tău)

7. Păstrarea datelor
Păstrăm datele tale:
• Date de comandă: 5 ani (conform legislației fiscale)
• Date de marketing: până la retragerea consimțământului
• Cookie-uri: conform setărilor browserului

8. Contactul pentru protecția datelor
Pentru întrebări despre protecția datelor:
📧 Email: mihai.gruia@mangorecords.net
📞 Telefon: 0723 141 501`
    },
    en: {
      title: "Privacy Policy – MusicGift.ro",
      intro: "Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.",
      content: `1. Information Collected
We collect the following information:
• Identification data: name, surname, email, phone
• Order information: details about desired song, musical preferences
• Payment data: information necessary for payment processing (through third-party providers)
• Technical data: IP address, browser type, time spent on site

2. How We Use Information
We use your data to:
• Process and deliver orders
• Communicate about order status
• Improve our services
• Send commercial communications (with your consent)
• Comply with legal obligations

3. Data Sharing
We do not sell or rent your personal data. We only share it with:
• Payment service providers (Stripe, Revolut, SmartBill)
• Email service providers (for order delivery)
• Competent authorities (when legally required)

4. Data Security
We implement security measures to protect data:
• Encryption of data in transit and at rest
• Restricted access to personal information
• Regular system monitoring
• Periodic security updates

5. Your Rights (GDPR)
You have the following rights:
• Right of access to your data
• Right to rectify incorrect data
• Right to data deletion
• Right to object to processing
• Right to data portability
• Right to withdraw consent

6. Cookies
We use cookies for:
• Proper website functioning
• Web traffic analysis
• Experience personalization
• Marketing and advertising (with your consent)

7. Data Retention
We retain your data:
• Order data: 5 years (according to tax legislation)
• Marketing data: until consent withdrawal
• Cookies: according to browser settings

8. Data Protection Contact
For data protection questions:
📧 Email: mihai.gruia@mangorecords.net
📞 Phone: 0723 141 501`
    },
    fr: {
      title: "Politique de Confidentialité – MusicGift.ro",
      intro: "Votre confidentialité est importante pour nous. Cette politique explique comment nous collectons, utilisons et protégeons vos informations personnelles.",
      content: `1. Informations collectées
Nous collectons les informations suivantes :
• Données d'identification : nom, prénom, email, téléphone
• Informations de commande : détails sur la chanson désirée, préférences musicales
• Données de paiement : informations nécessaires au traitement du paiement (via des fournisseurs tiers)
• Données techniques : adresse IP, type de navigateur, temps passé sur le site

2. Comment nous utilisons les informations
Nous utilisons vos données pour :
• Traiter et livrer les commandes
• Communiquer sur le statut de la commande
• Améliorer nos services
• Envoyer des communications commerciales (avec votre consentement)
• Respecter les obligations légales

3. Partage des données
Nous ne vendons ni ne louons vos données personnelles. Nous les partageons uniquement avec :
• Les fournisseurs de services de paiement (Stripe, Revolut, SmartBill)
• Les fournisseurs de services email (pour la livraison des commandes)
• Les autorités compétentes (quand légalement requis)

4. Sécurité des données
Nous implémentons des mesures de sécurité pour protéger les données :
• Chiffrement des données en transit et au repos
• Accès restreint aux informations personnelles
• Surveillance régulière des systèmes
• Mises à jour de sécurité périodiques

5. Vos droits (RGPD)
Vous avez les droits suivants :
• Droit d'accès à vos données
• Droit de rectifier les données incorrectes
• Droit à l'effacement des données
• Droit d'opposition au traitement
• Droit à la portabilité des données
• Droit de retirer le consentement

6. Cookies
Nous utilisons des cookies pour :
• Le bon fonctionnement du site web
• L'analyse du trafic web
• La personnalisation de l'expérience
• Le marketing et la publicité (avec votre consentement)

7. Conservation des données
Nous conservons vos données :
• Données de commande : 5 ans (selon la législation fiscale)
• Données marketing : jusqu'au retrait du consentement
• Cookies : selon les paramètres du navigateur

8. Contact protection des données
Pour les questions sur la protection des données :
📧 Email : mihai.gruia@mangorecords.net
📞 Téléphone : 0723 141 501`
    },
    nl: {
      title: "Privacybeleid – MusicGift.ro",
      intro: "Jouw privacy is belangrijk voor ons. Dit beleid legt uit hoe we jouw persoonlijke informatie verzamelen, gebruiken en beschermen.",
      content: `1. Verzamelde informatie
We verzamelen de volgende informatie:
• Identificatiegegevens: naam, achternaam, email, telefoon
• Bestelinformatie: details over gewenste nummer, muzikale voorkeuren
• Betalingsgegevens: informatie nodig voor betalingsverwerking (via externe providers)
• Technische gegevens: IP-adres, browsertype, tijd doorgebracht op site

2. Hoe we informatie gebruiken
We gebruiken je gegevens voor:
• Verwerken en leveren van bestellingen
• Communiceren over bestelling status
• Verbeteren van onze diensten
• Verzenden van commerciële communicatie (met jouw toestemming)
• Naleven van wettelijke verplichtingen

3. Gegevensdeling
We verkopen of verhuren je persoonlijke gegevens niet. We delen ze alleen met:
• Betalingsserviceproviders (Stripe, Revolut, SmartBill)
• Email serviceproviders (voor bestelling levering)
• Bevoegde autoriteiten (wanneer wettelijk vereist)

4. Gegevensbeveiliging
We implementeren beveiligingsmaatregelen om gegevens te beschermen:
• Versleuteling van gegevens in doorvoer en rust
• Beperkte toegang tot persoonlijke informatie
• Regelmatige systeemmonitoring
• Periodieke beveiligingsupdates

5. Jouw rechten (AVG)
Je hebt de volgende rechten:
• Recht op toegang tot je gegevens
• Recht op rectificatie van onjuiste gegevens
• Recht op verwijdering van gegevens
• Recht op bezwaar tegen verwerking
• Recht op gegevensportabiliteit
• Recht om toestemming in te trekken

6. Cookies
We gebruiken cookies voor:
• Juiste website werking
• Webverkeer analyse
• Ervaring personalisatie
• Marketing en reclame (met jouw toestemming)

7. Gegevensbewaring
We bewaren je gegevens:
• Bestellingsgegevens: 5 jaar (volgens belastingwetgeving)
• Marketinggegevens: tot intrekking toestemming
• Cookies: volgens browserinstellingen

8. Gegevensbescherming contact
Voor vragen over gegevensbescherming:
📧 Email: mihai.gruia@mangorecords.net
📞 Telefoon: 0723 141 501`
    },
    pl: {
      title: "Polityka Prywatności – MusicGift.ro",
      intro: "Twoja prywatność jest dla nas ważna. Ta polityka wyjaśnia, jak zbieramy, używamy i chronimy Twoje dane osobowe.",
      content: `1. Zebrane informacje
Zbieramy następujące informacje:
• Dane identyfikacyjne: imię, nazwisko, email, telefon
• Informacje o zamówieniu: szczegóły pożądanej piosenki, preferencje muzyczne
• Dane płatności: informacje niezbędne do przetwarzania płatności (przez zewnętrznych dostawców)
• Dane techniczne: adres IP, typ przeglądarki, czas spędzony na stronie

2. Jak używamy informacji
Używamy Twoich danych do:
• Przetwarzania i dostarczania zamówień
• Komunikowania o statusie zamówienia
• Ulepszania naszych usług
• Wysyłania komunikacji komercyjnej (za Twoją zgodą)
• Przestrzegania obowiązków prawnych

3. Udostępnianie danych
Nie sprzedajemy ani nie wynajmujemy Twoich danych osobowych. Udostępniamy je tylko:
• Dostawcom usług płatniczych (Stripe, Revolut, SmartBill)
• Dostawcom usług email (do dostarczania zamówień)
• Właściwym organom (gdy jest to prawnie wymagane)

4. Bezpieczeństwo danych
Wdrażamy środki bezpieczeństwa do ochrony danych:
• Szyfrowanie danych w tranzycie i spoczynku
• Ograniczony dostęp do informacji osobistych
• Regularne monitorowanie systemów
• Okresowe aktualizacje bezpieczeństwa

5. Twoje prawa (RODO)
Masz następujące prawa:
• Prawo dostępu do swoich danych
• Prawo do sprostowania niepoprawnych danych
• Prawo do usunięcia danych
• Prawo do sprzeciwu wobec przetwarzania
• Prawo do przenoszenia danych
• Prawo do wycofania zgody

6. Pliki cookie
Używamy plików cookie do:
• Właściwego funkcjonowania strony internetowej
• Analizy ruchu internetowego
• Personalizacji doświadczenia
• Marketingu i reklamy (za Twoją zgodą)

7. Przechowywanie danych
Przechowujemy Twoje dane:
• Dane zamówienia: 5 lat (zgodnie z prawem podatkowym)
• Dane marketingowe: do wycofania zgody
• Pliki cookie: zgodnie z ustawieniami przeglądarki

8. Kontakt ds. ochrony danych
W sprawach ochrony danych:
📧 Email: mihai.gruia@mangorecords.net
📞 Telefon: 0723 141 501`
    },
    de: {
      title: "Datenschutzrichtlinie – MusicGift.ro",
      intro: "Ihre Privatsphäre ist uns wichtig. Diese Richtlinie erklärt, wie wir Ihre persönlichen Informationen sammeln, verwenden und schützen.",
      content: `1. Gesammelte Informationen
Wir sammeln folgende Informationen:
• Identifikationsdaten: Name, Nachname, E-Mail, Telefon
• Bestellinformationen: Details zum gewünschten Song, musikalische Vorlieben
• Zahlungsdaten: Informationen zur Zahlungsabwicklung (über Drittanbieter)
• Technische Daten: IP-Adresse, Browsertyp, auf der Website verbrachte Zeit

2. Wie wir Informationen verwenden
Wir verwenden Ihre Daten für:
• Bearbeitung und Lieferung von Bestellungen
• Kommunikation über Bestellstatus
• Verbesserung unserer Dienstleistungen
• Versendung kommerzieller Kommunikation (mit Ihrer Zustimmung)
• Einhaltung rechtlicher Verpflichtungen

3. Datenweitergabe
Wir verkaufen oder vermieten Ihre persönlichen Daten nicht. Wir teilen sie nur mit:
• Zahlungsdienstleistern (Stripe, Revolut, SmartBill)
• E-Mail-Dienstleistern (für Bestelllieferung)
• Zuständigen Behörden (wenn gesetzlich erforderlich)

4. Datensicherheit
Wir implementieren Sicherheitsmaßnahmen zum Schutz der Daten:
• Verschlüsselung von Daten bei Übertragung und Speicherung
• Eingeschränkter Zugang zu persönlichen Informationen
• Regelmäßige Systemüberwachung
• Periodische Sicherheitsupdates

5. Ihre Rechte (DSGVO)
Sie haben folgende Rechte:
• Recht auf Zugang zu Ihren Daten
• Recht auf Berichtigung falscher Daten
• Recht auf Löschung der Daten
• Recht auf Widerspruch gegen Verarbeitung
• Recht auf Datenübertragbarkeit
• Recht auf Widerruf der Einwilligung

6. Cookies
Wir verwenden Cookies für:
• Ordnungsgemäße Website-Funktion
• Webverkehr-Analyse
• Erfahrungs-Personalisierung
• Marketing und Werbung (mit Ihrer Zustimmung)

7. Datenspeicherung
Wir speichern Ihre Daten:
• Bestelldaten: 5 Jahre (gemäß Steuergesetzgebung)
• Marketing-Daten: bis zum Widerruf der Einwilligung
• Cookies: gemäß Browser-Einstellungen

8. Datenschutz-Kontakt
Für Fragen zum Datenschutz:
📧 E-Mail: mihai.gruia@mangorecords.net
📞 Telefon: 0723 141 501`
    },
    it: {
      title: "Politica sulla Privacy – MusicGift.ro",
      intro: "La tua privacy è importante per noi. Questa politica spiega come raccogliamo, utilizziamo e proteggiamo le tue informazioni personali.",
      content: `1. Informazioni raccolte
Raccogliamo le seguenti informazioni:
• Dati di identificazione: nome, cognome, email, telefono
• Informazioni sull'ordine: dettagli sulla canzone desiderata, preferenze musicali
• Dati di pagamento: informazioni necessarie per l'elaborazione del pagamento (tramite fornitori terzi)
• Dati tecnici: indirizzo IP, tipo di browser, tempo trascorso sul sito

2. Come utilizziamo le informazioni
Utilizziamo i tuoi dati per:
• Elaborare e consegnare ordini
• Comunicare sullo stato dell'ordine
• Migliorare i nostri servizi
• Inviare comunicazioni commerciali (con il tuo consenso)
• Rispettare gli obblighi legali

3. Condivisione dei dati
Non vendiamo né affittiamo i tuoi dati personali. Li condividiamo solo con:
• Fornitori di servizi di pagamento (Stripe, Revolut, SmartBill)
• Fornitori di servizi email (per la consegna degli ordini)
• Autorità competenti (quando richiesto legalmente)

4. Sicurezza dei dati
Implementiamo misure di sicurezza per proteggere i dati:
• Crittografia dei dati in transito e a riposo
• Accesso limitato alle informazioni personali
• Monitoraggio regolare dei sistemi
• Aggiornamenti di sicurezza periodici

5. I tuoi diritti (GDPR)
Hai i seguenti diritti:
• Diritto di accesso ai tuoi dati
• Diritto di rettifica dei dati errati
• Diritto alla cancellazione dei dati
• Diritto di opposizione al trattamento
• Diritto alla portabilità dei dati
• Diritto di revocare il consenso

6. Cookie
Utilizziamo i cookie per:
• Funzionamento corretto del sito web
• Analisi del traffico web
• Personalizzazione dell'esperienza
• Marketing e pubblicità (con il tuo consenso)

7. Conservazione dei dati
Conserviamo i tuoi dati:
• Dati dell'ordine: 5 anni (secondo la legislazione fiscale)
• Dati di marketing: fino alla revoca del consenso
• Cookie: secondo le impostazioni del browser

8. Contatto protezione dati
Per domande sulla protezione dei dati:
📧 Email: mihai.gruia@mangorecords.net
📞 Telefono: 0723 141 501`
    }
  };

  const refundContent = {
    ro: {
      title: "Politica de Rambursare – MusicGift.ro",
      intro: "Înțelegem că uneori lucrurile nu merg conform planului. Iată politica noastră clară de rambursare pentru serviciile personalizate.",
      content: `1. Politica generală
Datorită naturii personalizate a serviciilor noastre, rambursările sunt limitate la anumite circumstanțe specifice.

2. Când se aplică rambursarea
Rambursarea este disponibilă în următoarele situații:
• Probleme tehnice care împiedică livrarea
• Deviere semnificativă de la cerințele specificate
• Serviciul nu este livrat în termenul promis
• Anulare în 24 de ore de la plasarea comenzii (înainte de începerea lucrului)

3. Procesul de rambursare
Pentru a solicita o rambursare:
1. Contactează echipa noastră de suport în 7 zile de la livrare
2. Oferă o explicație detaliată a problemei
3. Permite până la 48 de ore pentru revizuire
4. Rambursările aprobate sunt procesate în 5-10 zile lucrătoare

4. Situații fără rambursare
Nu oferim rambursări în următoarele cazuri:
• Schimbarea de părere după livrare
• Nemulțumire cu stilul artistic (în limitele specificațiilor)
• Comenzi deja finalizate și livrate
• Cerințe personalizate care au fost îndeplinite cu acuratețe

5. Rambursări parțiale
În unele cazuri, pot fi oferite rambursări parțiale pentru servicii care îndeplinesc parțial cerințele, dar au probleme minore.

6. Perioada de garanție
Oferim o perioadă de 30 de zile pentru raportarea problemelor majore cu comanda ta.

7. Contact pentru rambursări
Pentru întrebări despre rambursări:
📧 Email: mihai.gruia@mangorecords.net
📞 Telefon: 0723 141 501`
    },
    en: {
      title: "Refund Policy – MusicGift.ro",
      intro: "We understand that sometimes things don't go according to plan. Here's our clear refund policy for personalized services.",
      content: `1. General Policy
Due to the personalized nature of our services, refunds are limited to specific circumstances.

2. When Refunds Apply
Refunds are available in the following situations:
• Technical issues preventing delivery
• Significant deviation from specified requirements
• Service not delivered within promised timeframe
• Cancellation within 24 hours of order placement (before work begins)

3. Refund Process
To request a refund:
1. Contact our support team within 7 days of delivery
2. Provide detailed explanation of the issue
3. Allow up to 48 hours for review
4. Approved refunds processed within 5-10 business days

4. Non-Refundable Situations
We do not offer refunds in the following cases:
• Change of mind after delivery
• Dissatisfaction with artistic style (within specifications)
• Orders already completed and delivered
• Custom requests that were accurately fulfilled

5. Partial Refunds
In some cases, partial refunds may be offered for services that partially meet requirements but have minor issues.

6. Warranty Period
We provide a 30-day period for reporting major issues with your order.

7. Refund Contact
For refund questions:
📧 Email: mihai.gruia@mangorecords.net
📞 Phone: 0723 141 501`
    },
    fr: {
      title: "Politique de Remboursement – MusicGift.ro",
      intro: "Nous comprenons que parfois les choses ne se passent pas comme prévu. Voici notre politique claire de remboursement pour les services personnalisés.",
      content: `1. Politique générale
En raison de la nature personnalisée de nos services, les remboursements sont limités à des circonstances spécifiques.

2. Quand les remboursements s'appliquent
Les remboursements sont disponibles dans les situations suivantes :
• Problèmes techniques empêchant la livraison
• Déviation significative des exigences spécifiées
• Service non livré dans les délais promis
• Annulation dans les 24 heures de la commande (avant le début du travail)

3. Processus de remboursement
Pour demander un remboursement :
1. Contactez notre équipe de support dans les 7 jours suivant la livraison
2. Fournissez une explication détaillée du problème
3. Accordez jusqu'à 48 heures pour la révision
4. Les remboursements approuvés sont traités dans les 5-10 jours ouvrables

4. Situations non remboursables
Nous n'offrons pas de remboursements dans les cas suivants :
• Changement d'avis après livraison
• Insatisfaction avec le style artistique (dans les spécifications)
• Commandes déjà terminées et livrées
• Demandes personnalisées qui ont été réalisées avec précision

5. Remboursements partiels
Dans certains cas, des remboursements partiels peuvent être offerts pour des services qui répondent partiellement aux exigences mais ont des problèmes mineurs.

6. Période de garantie
Nous offrons une période de 30 jours pour signaler les problèmes majeurs avec votre commande.

7. Contact remboursement
Pour les questions de remboursement :
📧 Email : mihai.gruia@mangorecords.net
📞 Téléphone : 0723 141 501`
    },
    nl: {
      title: "Terugbetalingsbeleid – MusicGift.ro",
      intro: "We begrijpen dat soms dingen niet volgens plan gaan. Hier is ons duidelijke terugbetalingsbeleid voor gepersonaliseerde diensten.",
      content: `1. Algemeen beleid
Vanwege de gepersonaliseerde aard van onze diensten zijn terugbetalingen beperkt tot specifieke omstandigheden.

2. Wanneer terugbetalingen van toepassing zijn
Terugbetalingen zijn beschikbaar in de volgende situaties:
• Technische problemen die levering verhinderen
• Significante afwijking van gespecificeerde vereisten
• Service niet geleverd binnen beloofde tijdsbestek
• Annulering binnen 24 uur na bestelling (voordat werk begint)

3. Terugbetalingsproces
Om een terugbetaling aan te vragen:
1. Neem contact op met ons supportteam binnen 7 dagen na levering
2. Geef gedetailleerde uitleg van het probleem
3. Sta tot 48 uur toe voor beoordeling
4. Goedgekeurde terugbetalingen verwerkt binnen 5-10 werkdagen

4. Niet-terugbetaalbare situaties
We bieden geen terugbetalingen in de volgende gevallen:
• Van gedachten veranderen na levering
• Ontevredenheid met artistieke stijl (binnen specificaties)
• Bestellingen al voltooid en geleverd
• Aangepaste verzoeken die accuraat zijn vervuld

5. Gedeeltelijke terugbetalingen
In sommige gevallen kunnen gedeeltelijke terugbetalingen worden aangeboden voor diensten die gedeeltelijk voldoen aan vereisten maar kleine problemen hebben.

6. Garantieperiode
We bieden een periode van 30 dagen voor het melden van grote problemen met je bestelling.

7. Terugbetaling contact
Voor terugbetalingsvragen:
📧 Email: mihai.gruia@mangorecords.net
📞 Telefoon: 0723 141 501`
    },
    pl: {
      title: "Polityka Zwrotów – MusicGift.ro",
      intro: "Rozumiemy, że czasami rzeczy nie idą zgodnie z planem. Oto nasza jasna polityka zwrotów dla spersonalizowanych usług.",
      content: `1. Polityka ogólna
Ze względu na spersonalizowany charakter naszych usług, zwroty są ograniczone do określonych okoliczności.

2. Kiedy zwroty są możliwe
Zwroty są dostępne w następujących sytuacjach:
• Problemy techniczne uniemożliwiające dostawę
• Znaczące odchylenie od określonych wymagań
• Usługa nie dostarczona w obiecanych ramach czasowych
• Anulowanie w ciągu 24 godzin od złożenia zamówienia (przed rozpoczęciem pracy)

3. Proces zwrotu
Aby poprosić o zwrot:
1. Skontaktuj się z naszym zespołem wsparcia w ciągu 7 dni od dostawy
2. Podaj szczegółowe wyjaśnienie problemu
3. Pozwól do 48 godzin na przegląd
4. Zatwierdzone zwroty przetwarzane w ciągu 5-10 dni roboczych

4. Sytuacje bez zwrotu
Nie oferujemy zwrotów w następujących przypadkach:
• Zmiana zdania po dostawie
• Niezadowolenie ze stylu artystycznego (w ramach specyfikacji)
• Zamówienia już ukończone i dostarczone
• Niestandardowe żądania, które zostały dokładnie spełnione

5. Częściowe zwroty
W niektórych przypadkach mogą być oferowane częściowe zwroty za usługi, które częściowo spełniają wymagania, ale mają drobne problemy.

6. Okres gwarancji
Oferujemy 30-dniowy okres na zgłaszanie głównych problemów z Twoim zamówieniem.

7. Kontakt w sprawie zwrotów
W sprawach zwrotów:
📧 Email: mihai.gruia@mangorecords.net
📞 Telefon: 0723 141 501`
    },
    de: {
      title: "Rückerstattungsrichtlinie – MusicGift.ro",
      intro: "Wir verstehen, dass manchmal Dinge nicht nach Plan verlaufen. Hier ist unsere klare Rückerstattungsrichtlinie für personalisierte Dienstleistungen.",
      content: `1. Allgemeine Richtlinie
Aufgrund der personalisierten Natur unserer Dienstleistungen sind Rückerstattungen auf bestimmte Umstände beschränkt.

2. Wann Rückerstattungen gelten
Rückerstattungen sind in folgenden Situationen verfügbar:
• Technische Probleme, die die Lieferung verhindern
• Erhebliche Abweichung von spezifizierten Anforderungen
• Service nicht im versprochenen Zeitrahmen geliefert
• Stornierung innerhalb von 24 Stunden nach Bestellung (bevor Arbeit beginnt)

3. Rückerstattungsprozess
Um eine Rückerstattung zu beantragen:
1. Kontaktieren Sie unser Support-Team innerhalb von 7 Tagen nach Lieferung
2. Geben Sie eine detaillierte Erklärung des Problems
3. Erlauben Sie bis zu 48 Stunden zur Überprüfung
4. Genehmigte Rückerstattungen werden innerhalb von 5-10 Werktagen bearbeitet

4. Nicht erstattungsfähige Situationen
Wir bieten keine Rückerstattungen in folgenden Fällen:
• Meinungsänderung nach Lieferung
• Unzufriedenheit mit künstlerischem Stil (innerhalb der Spezifikationen)
• Bereits abgeschlossene und gelieferte Bestellungen
• Kundenspezifische Anfragen, die korrekt erfüllt wurden

5. Teilrückerstattungen
In einigen Fällen können Teilrückerstattungen für Dienstleistungen angeboten werden, die Anforderungen teilweise erfüllen, aber kleinere Probleme haben.

6. Garantiezeit
Wir bieten eine 30-tägige Frist für die Meldung größerer Probleme mit Ihrer Bestellung.

7. Rückerstattungskontakt
Für Rückerstattungsfragen:
📧 E-Mail: mihai.gruia@mangorecords.net
📞 Telefon: 0723 141 501`
    },
    it: {
      title: "Politica di Rimborso – MusicGift.ro",
      intro: "Capiamo che a volte le cose non vanno secondo i piani. Ecco la nostra chiara politica di rimborso per servizi personalizzati.",
      content: `1. Politica generale
A causa della natura personalizzata dei nostri servizi, i rimborsi sono limitati a circostanze specifiche.

2. Quando si applicano i rimborsi
I rimborsi sono disponibili nelle seguenti situazioni:
• Problemi tecnici che impediscono la consegna
• Deviazione significativa dai requisiti specificati
• Servizio non consegnato entro i tempi promessi
• Cancellazione entro 24 ore dall'ordine (prima dell'inizio del lavoro)

3. Processo di rimborso
Per richiedere un rimborso:
1. Contatta il nostro team di supporto entro 7 giorni dalla consegna
2. Fornisci una spiegazione dettagliata del problema
3. Consenti fino a 48 ore per la revisione
4. I rimborsi approvati vengono elaborati entro 5-10 giorni lavorativi

4. Situazioni non rimborsabili
Non offriamo rimborsi nei seguenti casi:
• Cambiamento di idea dopo la consegna
• Insoddisfazione per lo stile artistico (entro le specifiche)
• Ordini già completati e consegnati
• Richieste personalizzate che sono state soddisfatte accuratamente

5. Rimborsi parziali
In alcuni casi, possono essere offerti rimborsi parziali per servizi che soddisfano parzialmente i requisiti ma hanno problemi minori.

6. Periodo di garanzia
Offriamo un periodo di 30 giorni per segnalare problemi importanti con il tuo ordine.

7. Contatto rimborsi
Per domande sui rimborsi:
📧 Email: mihai.gruia@mangorecords.net
📞 Telefono: 0723 141 501`
    }
  };

  const cookieContent = {
    ro: {
      title: "Politica de Cookie-uri – MusicGift.ro",
      intro: "Această politică explică cum folosim cookie-urile pe site-ul nostru pentru a îmbunătăți experiența ta de navigare.",
      content: `1. Ce sunt cookie-urile
Cookie-urile sunt fișiere text mici stocate pe dispozitivul tău când vizitezi site-ul nostru. Ne ajută să oferim o experiență mai bună utilizatorilor.

2. Tipuri de cookie-uri pe care le folosim

Cookie-uri esențiale
• Necesare pentru funcționarea de bază a site-ului
• Includ autentificare și securitate
• Nu pot fi dezactivate fără afectarea funcționalității

Cookie-uri de analiză
• Ne ajută să înțelegem cum interactionează vizitatorii cu site-ul
• Colectează informații în mod anonim
• Folosite pentru îmbunătățirea experienței utilizatorilor

Cookie-uri de marketing
• Folosite pentru urmărirea vizitatorilor pe site-uri
• Afișează reclame relevante
• Măsoară eficiența campaniilor publicitare

Cookie-uri de preferințe
• Memorează setările tale (limba, moneda)
• Personalizează experiența de navigare
• Salvează preferințele pentru viitoarele vizite

3. Gestionarea cookie-urilor
Poți controla cookie-urile prin:
• Setările browserului tău
• Panoul nostru de setări cookie-uri
• Dezactivarea selectivă a anumitor tipuri

Atenție: Dezactivarea anumitor cookie-uri poate afecta funcționalitatea site-ului.

4. Cookie-uri de la terțe părți
Putem folosi servicii de la terți care setează propriile cookie-uri:
• Google Analytics (analiză trafic)
• Furnizori de plăți (procesare comenzi)
• Platforme de marketing (campanii publicitare)

5. Durata cookie-urilor
• Cookie-uri de sesiune: Se șterg când închizi browserul
• Cookie-uri persistente: Rămân pe dispozitiv pentru o perioadă determinată
• Durata variază în funcție de tipul de cookie

6. Actualizări ale politicii
Această politică poate fi actualizată periodic. Modificările vor fi afișate pe această pagină cu data efectivă.

7. Contact pentru cookie-uri
Pentru întrebări despre cookie-uri:
📧 Email: mihai.gruia@mangorecords.net
📞 Telefon: 0723 141 501`
    },
    en: {
      title: "Cookie Policy – MusicGift.ro",
      intro: "This policy explains how we use cookies on our website to enhance your browsing experience.",
      content: `1. What Are Cookies
Cookies are small text files stored on your device when you visit our website. They help us provide a better user experience.

2. Types of Cookies We Use

Essential Cookies
• Necessary for basic website functionality
• Include authentication and security features
• Cannot be disabled without affecting functionality

Analytics Cookies
• Help us understand how visitors interact with our website
• Collect information anonymously
• Used to improve user experience

Marketing Cookies
• Used to track visitors across websites
• Display relevant advertisements
• Measure advertising campaign effectiveness

Preference Cookies
• Remember your settings (language, currency)
• Personalize browsing experience
• Save preferences for future visits

3. Managing Cookies
You can control cookies through:
• Your browser settings
• Our cookie settings panel
• Selective disabling of certain types

Note: Disabling certain cookies may affect website functionality.

4. Third-Party Cookies
We may use third-party services that set their own cookies:
• Google Analytics (traffic analysis)
• Payment providers (order processing)
• Marketing platforms (advertising campaigns)

5. Cookie Duration
• Session cookies: Deleted when you close browser
• Persistent cookies: Remain on device for specified period
• Duration varies by cookie type

6. Policy Updates
This policy may be updated periodically. Changes will be posted on this page with the effective date.

7. Cookie Contact
For cookie-related questions:
📧 Email: mihai.gruia@mangorecords.net
📞 Phone: 0723 141 501`
    },
    fr: {
      title: "Politique de Cookies – MusicGift.ro",
      intro: "Cette politique explique comment nous utilisons les cookies sur notre site web pour améliorer votre expérience de navigation.",
      content: `1. Que sont les cookies
Les cookies sont de petits fichiers texte stockés sur votre appareil lorsque vous visitez notre site web. Ils nous aident à offrir une meilleure expérience utilisateur.

2. Types de cookies que nous utilisons

Cookies essentiels
• Nécessaires pour les fonctionnalités de base du site web
• Incluent l'authentification et les fonctionnalités de sécurité
• Ne peuvent pas être désactivés sans affecter la fonctionnalité

Cookies d'analyse
• Nous aident à comprendre comment les visiteurs interagissent avec notre site web
• Collectent des informations de manière anonyme
• Utilisés pour améliorer l'expérience utilisateur

Cookies de marketing
• Utilisés pour suivre les visiteurs sur les sites web
• Affichent des publicités pertinentes
• Mesurent l'efficacité des campagnes publicitaires

Cookies de préférences
• Mémorisent vos paramètres (langue, devise)
• Personnalisent l'expérience de navigation
• Sauvegardent les préférences pour les futures visites

3. Gestion des cookies
Vous pouvez contrôler les cookies via :
• Les paramètres de votre navigateur
• Notre panneau de paramètres de cookies
• La désactivation sélective de certains types

Note : La désactivation de certains cookies peut affecter la fonctionnalité du site web.

4. Cookies tiers
Nous pouvons utiliser des services tiers qui définissent leurs propres cookies :
• Google Analytics (analyse de trafic)
• Fournisseurs de paiement (traitement des commandes)
• Plateformes marketing (campagnes publicitaires)

5. Durée des cookies
• Cookies de session : Supprimés à la fermeture du navigateur
• Cookies persistants : Restent sur l'appareil pour une période spécifiée
• La durée varie selon le type de cookie

6. Mises à jour de la politique
Cette politique peut être mise à jour périodiquement. Les modifications seront affichées sur cette page avec la date effective.

7. Contact cookies
Pour les questions liées aux cookies :
📧 Email : mihai.gruia@mangorecords.net
📞 Téléphone : 0723 141 501`
    },
    nl: {
      title: "Cookiebeleid – MusicGift.ro",
      intro: "Dit beleid legt uit hoe we cookies op onze website gebruiken om je browse-ervaring te verbeteren.",
      content: `1. Wat zijn cookies
Cookies zijn kleine tekstbestanden die op je apparaat worden opgeslagen wanneer je onze website bezoekt. Ze helpen ons een betere gebruikerservaring te bieden.

2. Soorten cookies die we gebruiken

Essentiële cookies
• Noodzakelijk voor basis website functionaliteit
• Bevatten authenticatie en beveiligingsfuncties
• Kunnen niet worden uitgeschakeld zonder functionaliteit te beïnvloeden

Analyse cookies
• Helpen ons begrijpen hoe bezoekers omgaan met onze website
• Verzamelen informatie anoniem
• Gebruikt om gebruikerservaring te verbeteren

Marketing cookies
• Gebruikt om bezoekers over websites te volgen
• Tonen relevante advertenties
• Meten effectiviteit van reclamecampagnes

Voorkeur cookies
• Onthouden je instellingen (taal, valuta)
• Personaliseren browse-ervaring
• Bewaren voorkeuren voor toekomstige bezoeken

3. Cookies beheren
Je kunt cookies controleren via:
• Je browser instellingen
• Ons cookie instellingen paneel
• Selectief uitschakelen van bepaalde types

Let op: Het uitschakelen van bepaalde cookies kan website functionaliteit beïnvloeden.

4. Cookies van derden
We kunnen diensten van derden gebruiken die hun eigen cookies instellen:
• Google Analytics (verkeer analyse)
• Betalingsproviders (bestelling verwerking)
• Marketing platforms (reclame campagnes)

5. Cookie duur
• Sessie cookies: Verwijderd wanneer je browser sluit
• Persistente cookies: Blijven op apparaat voor gespecificeerde periode
• Duur varieert per cookie type

6. Beleid updates
Dit beleid kan periodiek worden bijgewerkt. Wijzigingen worden op deze pagina geplaatst met de effectieve datum.

7. Cookie contact
Voor cookie-gerelateerde vragen:
📧 Email: mihai.gruia@mangorecords.net
📞 Telefoon: 0723 141 501`
    },
    pl: {
      title: "Polityka Cookies – MusicGift.ro",
      intro: "Ta polityka wyjaśnia, jak używamy plików cookie na naszej stronie internetowej, aby poprawić Twoje doświadczenia przeglądania.",
      content: `1. Czym są pliki cookie
Pliki cookie to małe pliki tekstowe przechowywane na Twoim urządzeniu, gdy odwiedzasz naszą stronę internetową. Pomagają nam zapewnić lepsze doświadczenia użytkownika.

2. Rodzaje plików cookie, których używamy

Niezbędne pliki cookie
• Konieczne dla podstawowej funkcjonalności strony internetowej
• Obejmują uwierzytelnianie i funkcje bezpieczeństwa
• Nie można ich wyłączyć bez wpływu na funkcjonalność

Pliki cookie analityczne
• Pomagają nam zrozumieć, jak odwiedzający wchodzą w interakcję z naszą stroną internetową
• Zbierają informacje anonimowo
• Używane do poprawy doświadczeń użytkownika

Pliki cookie marketingowe
• Używane do śledzenia odwiedzających na stronach internetowych
• Wyświetlają istotne reklamy
• Mierzą skuteczność kampanii reklamowych

Pliki cookie preferencji
• Zapamiętują Twoje ustawienia (język, waluta)
• Personalizują doświadczenia przeglądania
• Zapisują preferencje na przyszłe wizyty

3. Zarządzanie plikami cookie
Możesz kontrolować pliki cookie przez:
• Ustawienia Twojej przeglądarki
• Nasz panel ustawień plików cookie
• Selektywne wyłączanie określonych typów

Uwaga: Wyłączenie niektórych plików cookie może wpłynąć na funkcjonalność strony internetowej.

4. Pliki cookie stron trzecich
Możemy używać usług stron trzecich, które ustawiają własne pliki cookie:
• Google Analytics (analiza ruchu)
• Dostawcy płatności (przetwarzanie zamówień)
• Platformy marketingowe (kampanie reklamowe)

5. Czas trwania plików cookie
• Pliki cookie sesji: Usuwane po zamknięciu przeglądarki
• Pliki cookie trwałe: Pozostają na urządzeniu przez określony czas
• Czas trwania różni się w zależności od typu pliku cookie

6. Aktualizacje polityki
Ta polityka może być okresowo aktualizowana. Zmiany będą publikowane na tej stronie z datą wejścia w życie.

7. Kontakt w sprawie plików cookie
W sprawach związanych z plikami cookie:
📧 Email: mihai.gruia@mangorecords.net
📞 Telefon: 0723 141 501`
    },
    de: {
      title: "Cookie-Richtlinie – MusicGift.ro",
      intro: "Diese Richtlinie erklärt, wie wir Cookies auf unserer Website verwenden, um Ihr Browsing-Erlebnis zu verbessern.",
      content: `1. Was sind Cookies
Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden, wenn Sie unsere Website besuchen. Sie helfen uns, eine bessere Benutzererfahrung zu bieten.

2. Arten von Cookies, die wir verwenden

Wesentliche Cookies
• Notwendig für grundlegende Website-Funktionalität
• Beinhalten Authentifizierung und Sicherheitsfunktionen
• Können nicht deaktiviert werden, ohne die Funktionalität zu beeinträchtigen

Analyse-Cookies
• Helfen uns zu verstehen, wie Besucher mit unserer Website interagieren
• Sammeln Informationen anonym
• Verwendet zur Verbesserung der Benutzererfahrung

Marketing-Cookies
• Verwendet zur Verfolgung von Besuchern über Websites hinweg
• Zeigen relevante Werbung an
• Messen die Effektivität von Werbekampagnen

Präferenz-Cookies
• Merken sich Ihre Einstellungen (Sprache, Währung)
• Personalisieren das Browsing-Erlebnis
• Speichern Präferenzen für zukünftige Besuche

3. Cookie-Verwaltung
Sie können Cookies kontrollieren über:
• Ihre Browser-Einstellungen
• Unser Cookie-Einstellungs-Panel
• Selektive Deaktivierung bestimmter Typen

Hinweis: Das Deaktivieren bestimmter Cookies kann die Website-Funktionalität beeinträchtigen.

4. Drittanbieter-Cookies
Wir können Drittanbieterdienste verwenden, die ihre eigenen Cookies setzen:
• Google Analytics (Verkehrsanalyse)
• Zahlungsanbieter (Bestellabwicklung)
• Marketing-Plattformen (Werbekampagnen)

5. Cookie-Dauer
• Sitzungs-Cookies: Gelöscht beim Schließen des Browsers
• Persistente Cookies: Verbleiben für einen bestimmten Zeitraum auf dem Gerät
• Dauer variiert je nach Cookie-Typ

6. Richtlinien-Updates
Diese Richtlinie kann periodisch aktualisiert werden. Änderungen werden auf dieser Seite mit dem Gültigkeitsdatum veröffentlicht.

7. Cookie-Kontakt
Für Cookie-bezogene Fragen:
📧 E-Mail: mihai.gruia@mangorecords.net
📞 Telefon: 0723 141 501`
    },
    it: {
      title: "Politica sui Cookie – MusicGift.ro",
      intro: "Questa politica spiega come utilizziamo i cookie sul nostro sito web per migliorare la tua esperienza di navigazione.",
      content: `1. Cosa sono i cookie
I cookie sono piccoli file di testo memorizzati sul tuo dispositivo quando visiti il nostro sito web. Ci aiutano a fornire una migliore esperienza utente.

2. Tipi di cookie che utilizziamo

Cookie essenziali
• Necessari per le funzionalità di base del sito web
• Includono autenticazione e funzionalità di sicurezza
• Non possono essere disabilitati senza influire sulla funzionalità

Cookie di analisi
• Ci aiutano a capire come i visitatori interagiscono con il nostro sito web
• Raccolgono informazioni in modo anonimo
• Utilizzati per migliorare l'esperienza utente

Cookie di marketing
• Utilizzati per tracciare i visitatori sui siti web
• Mostrano pubblicità pertinenti
• Misurano l'efficacia delle campagne pubblicitarie

Cookie di preferenze
• Ricordano le tue impostazioni (lingua, valuta)
• Personalizzano l'esperienza di navigazione
• Salvano le preferenze per visite future

3. Gestione dei cookie
Puoi controllare i cookie tramite:
• Le impostazioni del tuo browser
• Il nostro pannello di impostazioni cookie
• Disabilitazione selettiva di certi tipi

Nota: Disabilitare certi cookie può influire sulla funzionalità del sito web.

4. Cookie di terze parti
Potremmo utilizzare servizi di terze parti che impostano i propri cookie:
• Google Analytics (analisi del traffico)
• Fornitori di pagamento (elaborazione ordini)
• Piattaforme di marketing (campagne pubblicitarie)

5. Durata dei cookie
• Cookie di sessione: Eliminati quando chiudi il browser
• Cookie persistenti: Rimangono sul dispositivo per un periodo specificato
• La durata varia per tipo di cookie

6. Aggiornamenti della politica
Questa politica può essere aggiornata periodicamente. Le modifiche saranno pubblicate su questa pagina con la data effettiva.

7. Contatto cookie
Per domande relative ai cookie:
📧 Email: mihai.gruia@mangorecords.net
📞 Telefono: 0723 141 501`
    }
  };

  const currentTerms = termsContent[currentLang] || termsContent.ro;
  const currentPrivacy = privacyContent[currentLang] || privacyContent.ro;
  const currentRefund = refundContent[currentLang] || refundContent.ro;
  const currentCookie = cookieContent[currentLang] || cookieContent.ro;

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
              {currentPrivacy.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p className="text-base font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {currentPrivacy.intro}
            </p>
            
            <div className="w-full h-px bg-gradient-to-r from-purple-600 to-pink-600"></div>
            
            <div className="whitespace-pre-line">
              {currentPrivacy.content}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Refund Policy Modal */}
      <Dialog open={showModal === 'refund'} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-md border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-4">
              {currentRefund.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p className="text-base font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {currentRefund.intro}
            </p>
            
            <div className="w-full h-px bg-gradient-to-r from-purple-600 to-pink-600"></div>
            
            <div className="whitespace-pre-line">
              {currentRefund.content}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cookie Policy Modal */}
      <Dialog open={showModal === 'cookies'} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-md border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-4">
              {currentCookie.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p className="text-base font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {currentCookie.intro}
            </p>
            
            <div className="w-full h-px bg-gradient-to-r from-purple-600 to-pink-600"></div>
            
            <div className="whitespace-pre-line">
              {currentCookie.content}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LegalModals;
