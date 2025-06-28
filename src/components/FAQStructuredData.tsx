
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const FAQStructuredData = () => {
  const { language, t } = useLanguage();
  
  useEffect(() => {
    // Clean up existing FAQ structured data
    const existingScripts = document.querySelectorAll('script[data-faq-schema]');
    existingScripts.forEach(script => script.remove());

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": t('howLongToCreate', 'How long does it take to create a personalized song?'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('creationTimeAnswer', 'Depending on the chosen package, duration varies between 7-14 business days for a complete personalized song.'),
            "dateCreated": new Date().toISOString(),
            "author": {
              "@type": "Organization",
              "name": "MusicGift.ro"
            }
          }
        },
        {
          "@type": "Question",
          "name": t('canChooseStyle', 'Can I choose the musical style for my song?'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('styleChoiceAnswer', 'Yes, you can choose from various musical styles: pop, rock, folk, jazz, classical, and many others based on your preferences.'),
            "dateCreated": new Date().toISOString(),
            "author": {
              "@type": "Organization",
              "name": "MusicGift.ro"
            }
          }
        },
        {
          "@type": "Question",
          "name": t('howOrderingWorks', 'How does the ordering process work?'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('orderingProcessAnswer', 'Choose your desired package, complete the form with song details, make payment, and our team will start working on your personalized composition.'),
            "dateCreated": new Date().toISOString(),
            "author": {
              "@type": "Organization",
              "name": "MusicGift.ro"
            }
          }
        },
        {
          "@type": "Question",
          "name": t('weddingSongPrice', 'How much does a wedding song cost?'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('weddingSongPriceAnswer', 'Wedding song packages start from ' + (language === 'en' ? '£75' : language === 'de' ? '€85' : language === 'pl' ? '350 PLN' : '300 RON') + ' and include special arrangements for your ceremony.'),
            "dateCreated": new Date().toISOString(),
            "author": {
              "@type": "Organization",
              "name": "MusicGift.ro"
            }
          }
        },
        {
          "@type": "Question",
          "name": t('revisionPolicy', 'Can I request revisions to my personalized song?'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('revisionPolicyAnswer', 'Yes, we offer revisions to ensure your complete satisfaction. Premium and Wedding packages include multiple revision rounds.'),
            "dateCreated": new Date().toISOString(),
            "author": {
              "@type": "Organization",
              "name": "MusicGift.ro"
            }
          }
        },
        {
          "@type": "Question",
          "name": t('giftCardValidity', 'How long are gift cards valid?'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('giftCardValidityAnswer', 'Gift cards are valid for 12 months from purchase date and can be used for any of our personalized music services.'),
            "dateCreated": new Date().toISOString(),
            "author": {
              "@type": "Organization",
              "name": "MusicGift.ro"
            }
          }
        },
        {
          "@type": "Question",
          "name": t('deliveryFormat', 'In what format will I receive my personalized song?'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('deliveryFormatAnswer', 'You will receive high-quality MP3 and WAV files via email, along with lyrics sheet and chord progressions if requested.'),
            "dateCreated": new Date().toISOString(),
            "author": {
              "@type": "Organization",
              "name": "MusicGift.ro"
            }
          }
        },
        {
          "@type": "Question",
          "name": t('languageOptions', 'In which languages can you create personalized songs?'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('languageOptionsAnswer', 'We create personalized songs in Romanian, English, German, French, Polish, Italian, and other languages upon request.'),
            "dateCreated": new Date().toISOString(),
            "author": {
              "@type": "Organization",
              "name": "MusicGift.ro"
            }
          }
        }
      ]
    };

    // Create and append script element
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-faq-schema', 'true');
    script.text = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      const scripts = document.querySelectorAll('script[data-faq-schema]');
      scripts.forEach(script => script.remove());
    };
  }, [language, t]);

  return null;
};

export default FAQStructuredData;
