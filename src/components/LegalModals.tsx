import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { refundContent } from '@/data/refundContent';

const termsContent = {
  ro: {
    title: "Termeni și Condiții",
    intro: "Acești termeni și condiții guvernează utilizarea site-ului MusicGift.ro și serviciile oferite.",
    sections: [
      {
        title: "Acceptarea Termenilor",
        content: "Prin accesarea sau utilizarea site-ului, sunteți de acord să respectați acești termeni și condiții în întregime."
      },
      {
        title: "Descrierea Serviciilor",
        content: "Oferim servicii de creare de melodii personalizate, inclusiv compoziție, înregistrare și producție muzicală."
      },
      {
        title: "Drepturi de Autor",
        content: "Drepturile de autor asupra melodiilor personalizate create rămân la MusicGift.ro până la plata integrală, după care sunt transferate clientului."
      },
      {
        title: "Limitarea Răspunderii",
        content: "Nu suntem responsabili pentru daunele indirecte sau consecințiale rezultate din utilizarea serviciilor noastre."
      }
    ]
  },
  en: {
    title: "Terms and Conditions",
    intro: "These terms and conditions govern the use of the MusicGift.ro website and the services offered.",
    sections: [
      {
        title: "Acceptance of Terms",
        content: "By accessing or using the site, you agree to abide by these terms and conditions in full."
      },
      {
        title: "Description of Services",
        content: "We offer personalized song creation services, including composition, recording, and music production."
      },
      {
        title: "Copyright",
        content: "Copyrights to personalized songs created remain with MusicGift.ro until full payment, after which they are transferred to the client."
      },
      {
        title: "Limitation of Liability",
        content: "We are not responsible for indirect or consequential damages resulting from the use of our services."
      }
    ]
  },
  fr: {
    title: "Termes et Conditions",
    intro: "Ces termes et conditions régissent l'utilisation du site web MusicGift.ro et les services offerts.",
    sections: [
      {
        title: "Acceptation des Termes",
        content: "En accédant à ou en utilisant le site, vous acceptez de respecter ces termes et conditions dans leur intégralité."
      },
      {
        title: "Description des Services",
        content: "Nous offrons des services de création de chansons personnalisées, y compris la composition, l'enregistrement et la production musicale."
      },
      {
        title: "Droits d'Auteur",
        content: "Les droits d'auteur des chansons personnalisées créées restent la propriété de MusicGift.ro jusqu'au paiement intégral, après quoi ils sont transférés au client."
      },
      {
        title: "Limitation de Responsabilité",
        content: "Nous ne sommes pas responsables des dommages indirects ou consécutifs résultant de l'utilisation de nos services."
      }
    ]
  }
};

const privacyContent = {
  ro: {
    title: "Politica de Confidențialitate",
    intro: "Această politică descrie modul în care colectăm, utilizăm și protejăm informațiile personale ale utilizatorilor MusicGift.ro.",
    sections: [
      {
        title: "Colectarea Informațiilor",
        content: "Colectăm informații precum nume, adresă de email și detalii despre preferințele muzicale pentru a personaliza serviciile."
      },
      {
        title: "Utilizarea Informațiilor",
        content: "Utilizăm informațiile pentru a crea melodii personalizate, a îmbunătăți serviciile și a comunica cu clienții."
      },
      {
        title: "Protecția Informațiilor",
        content: "Implementăm măsuri de securitate pentru a proteja informațiile personale împotriva accesului neautorizat."
      },
      {
        title: "Distribuirea Informațiilor",
        content: "Nu distribuim informațiile personale către terți fără consimțământul explicit al utilizatorului."
      }
    ]
  },
  en: {
    title: "Privacy Policy",
    intro: "This policy describes how we collect, use, and protect the personal information of MusicGift.ro users.",
    sections: [
      {
        title: "Information Collection",
        content: "We collect information such as name, email address, and details about musical preferences to personalize services."
      },
      {
        title: "Use of Information",
        content: "We use the information to create personalized songs, improve services, and communicate with customers."
      },
      {
        title: "Information Protection",
        content: "We implement security measures to protect personal information against unauthorized access."
      },
      {
        title: "Information Sharing",
        content: "We do not share personal information with third parties without the explicit consent of the user."
      }
    ]
  },
  fr: {
    title: "Politique de Confidentialité",
    intro: "Cette politique décrit comment nous collectons, utilisons et protégeons les informations personnelles des utilisateurs de MusicGift.ro.",
    sections: [
      {
        title: "Collecte d'Informations",
        content: "Nous collectons des informations telles que le nom, l'adresse e-mail et les détails sur les préférences musicales pour personnaliser les services."
      },
      {
        title: "Utilisation des Informations",
        content: "Nous utilisons les informations pour créer des chansons personnalisées, améliorer les services et communiquer avec les clients."
      },
      {
        title: "Protection des Informations",
        content: "Nous mettons en œuvre des mesures de sécurité pour protéger les informations personnelles contre l'accès non autorisé."
      },
      {
        title: "Partage d'Informations",
        content: "Nous ne partageons pas d'informations personnelles avec des tiers sans le consentement explicite de l'utilisateur."
      }
    ]
  }
};

const cookieContent = {
  ro: {
    title: "Politica de Cookie-uri",
    intro: "Această politică explică modul în care folosim cookie-uri și tehnologii similare pentru a îmbunătăți experiența utilizatorilor pe MusicGift.ro.",
    sections: [
      {
        title: "Ce sunt Cookie-urile",
        content: "Cookie-urile sunt fișiere mici stocate pe dispozitivul dumneavoastră pentru a urmări preferințele și activitățile."
      },
      {
        title: "Cum Folosim Cookie-urile",
        content: "Folosim cookie-uri pentru a personaliza conținutul, a analiza traficul și a oferi funcționalități îmbunătățite."
      },
      {
        title: "Gestionarea Cookie-urilor",
        content: "Puteți gestiona preferințele cookie-urilor prin setările browserului dumneavoastră."
      },
      {
        title: "Cookie-uri Terțe Părți",
        content: "Unele cookie-uri pot fi plasate de terțe părți pentru publicitate și analiză."
      }
    ]
  },
  en: {
    title: "Cookie Policy",
    intro: "This policy explains how we use cookies and similar technologies to improve the user experience on MusicGift.ro.",
    sections: [
      {
        title: "What are Cookies",
        content: "Cookies are small files stored on your device to track preferences and activities."
      },
      {
        title: "How We Use Cookies",
        content: "We use cookies to personalize content, analyze traffic, and provide enhanced functionality."
      },
      {
        title: "Managing Cookies",
        content: "You can manage your cookie preferences through your browser settings."
      },
      {
        title: "Third-Party Cookies",
        content: "Some cookies may be placed by third parties for advertising and analytics."
      }
    ]
  },
  fr: {
    title: "Politique de Cookies",
    intro: "Cette politique explique comment nous utilisons les cookies et les technologies similaires pour améliorer l'expérience utilisateur sur MusicGift.ro.",
    sections: [
      {
        title: "Que sont les Cookies",
        content: "Les cookies sont de petits fichiers stockés sur votre appareil pour suivre les préférences et les activités."
      },
      {
        title: "Comment Nous Utilisons les Cookies",
        content: "Nous utilisons des cookies pour personnaliser le contenu, analyser le trafic et fournir des fonctionnalités améliorées."
      },
      {
        title: "Gestion des Cookies",
        content: "Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur."
      },
      {
        title: "Cookies Tiers",
        content: "Certains cookies peuvent être placés par des tiers à des fins de publicité et d'analyse."
      }
    ]
  }
};

interface LegalModalsProps {
  showTerms: boolean;
  showPrivacy: boolean;
  showRefund: boolean;
  showCookie: boolean;
  onClose: () => void;
}

const LegalModals: React.FC<LegalModalsProps> = ({
  showTerms,
  showPrivacy,
  showRefund,
  showCookie,
  onClose
}) => {
  const { language } = useLanguage();

  const getContent = (contentObj: any) => {
    return contentObj[language] || contentObj['ro'] || contentObj['en'];
  };

  return (
    <>
      {/* Terms and Conditions Modal */}
      <Dialog open={showTerms} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{getContent(termsContent).title}</DialogTitle>
            <DialogDescription>
              {getContent(termsContent).intro}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {getContent(termsContent).sections.map((section: any, index: number) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                <p className="text-gray-600 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Modal */}
      <Dialog open={showPrivacy} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{getContent(privacyContent).title}</DialogTitle>
            <DialogDescription>
              {getContent(privacyContent).intro}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {getContent(privacyContent).sections.map((section: any, index: number) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                <p className="text-gray-600 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Refund Policy Modal */}
      <Dialog open={showRefund} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{getContent(refundContent).title}</DialogTitle>
            <DialogDescription>
              {getContent(refundContent).intro}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {getContent(refundContent).sections.map((section: any, index: number) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                <p className="text-gray-600 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Cookie Policy Modal */}
      <Dialog open={showCookie} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{getContent(cookieContent).title}</DialogTitle>
            <DialogDescription>
              {getContent(cookieContent).intro}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {getContent(cookieContent).sections.map((section: any, index: number) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                <p className="text-gray-600 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LegalModals;
