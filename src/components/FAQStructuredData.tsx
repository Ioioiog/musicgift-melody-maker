
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const FAQStructuredData = () => {
  const { language, t } = useLanguage();
  
  useEffect(() => {
    // Clean up existing FAQ structured data
    const existingScripts = document.querySelectorAll('script[data-faq-schema]');
    existingScripts.forEach(script => script.remove());

    // Get currency and pricing based on language
    const getCurrencyData = () => {
      switch (language) {
        case 'en': return { currency: 'GBP', symbol: '£', personal: '35', premium: '55', wedding: '75' };
        case 'de': return { currency: 'EUR', symbol: '€', personal: '45', premium: '65', wedding: '85' };
        case 'fr': return { currency: 'EUR', symbol: '€', personal: '45', premium: '65', wedding: '85' };
        case 'pl': return { currency: 'PLN', symbol: 'PLN', personal: '180', premium: '270', wedding: '350' };
        case 'it': return { currency: 'EUR', symbol: '€', personal: '45', premium: '65', wedding: '85' };
        default: return { currency: 'RON', symbol: 'RON', personal: '150', premium: '230', wedding: '300' };
      }
    };

    const currencyData = getCurrencyData();

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        // Core FAQ Questions
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
            "text": t('weddingSongPriceAnswer', `Wedding song packages start from ${currencyData.symbol}${currencyData.wedding} and include special arrangements for your ceremony.`),
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
        },
        // Voice Search Optimized Questions
        {
          "@type": "Question",
          "name": t('howToOrderSong', 'How to order a personalized song?'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('howToOrderAnswer', 'To order a personalized song, choose your package, fill out our form with your story details, and complete payment. Your song will be ready in 3-5 business days.'),
            "dateCreated": new Date().toISOString(),
            "author": {
              "@type": "Organization",
              "name": "MusicGift.ro"
            }
          }
        },
        {
          "@type": "Question",
          "name": t('weddingSongCost', 'How much does a wedding song cost?'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('weddingSongCostAnswer', `A personalized wedding song costs ${currencyData.symbol}${currencyData.wedding} and includes professional composition, recording, and unlimited revisions.`),
            "dateCreated": new Date().toISOString(),
            "author": {
              "@type": "Organization",
              "name": "MusicGift.ro"
            }
          }
        },
        {
          "@type": "Question",
          "name": t('deliveryTime', 'How long does it take to get my personalized song?'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('deliveryTimeAnswer', 'Your personalized song will be completed and delivered within 3-5 business days after order confirmation and story submission.'),
            "dateCreated": new Date().toISOString(),
            "author": {
              "@type": "Organization",
              "name": "MusicGift.ro"
            }
          }
        },
        {
          "@type": "Question",
          "name": t('bestAnniversaryGifts', 'What are the best anniversary gifts?'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('bestAnniversaryGiftsAnswer', 'A personalized song is one of the most meaningful anniversary gifts. It captures your love story in music and creates a lasting memory you can treasure forever.'),
            "dateCreated": new Date().toISOString(),
            "author": {
              "@type": "Organization",
              "name": "MusicGift.ro"
            }
          }
        },
        {
          "@type": "Question",
          "name": t('musicServicesNearMe', 'Where can I find personalized music services?'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('musicServicesNearMeAnswer', 'MusicGift.ro offers personalized music composition services worldwide. We work remotely and deliver high-quality personalized songs to customers globally.'),
            "dateCreated": new Date().toISOString(),
            "author": {
              "@type": "Organization",
              "name": "MusicGift.ro"
            }
          }
        },
        {
          "@type": "Question",
          "name": t('bestGiftForWife', 'What is the best romantic gift for my wife?'),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t('bestGiftForWifeAnswer', 'A personalized love song is an incredibly romantic and unique gift for your wife. It shows thoughtfulness and creates a beautiful memory of your relationship.'),
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
