
import { useLanguage } from '@/contexts/LanguageContext';

export interface StepContent {
  id: number;
  getTitle: (t: (key: string) => string) => string;
  getDescription: (t: (key: string) => string) => string;
  getDetails: (t: (key: string) => string) => {
    intro: string;
    listTitle: string;
    listItems: string[];
    footer: string;
  };
  styling: {
    color: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
  };
}

export const stepContentData: StepContent[] = [
  {
    id: 1,
    getTitle: (t) => t('step1Title'),
    getDescription: (t) => t('step1Description'),
    getDetails: (t) => ({
      intro: t('step1DetailsIntro'),
      listTitle: t('step1DetailsTitle'),
      listItems: [
        t('step1Detail1'),
        t('step1Detail2'),
        t('step1Detail3'),
        t('step1Detail4')
      ],
      footer: t('step1DetailsFooter')
    }),
    styling: {
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-400",
      textColor: "text-blue-800"
    }
  },
  {
    id: 2,
    getTitle: (t) => t('step2Title'),
    getDescription: (t) => t('step2Description'),
    getDetails: (t) => ({
      intro: t('step2DetailsIntro'),
      listTitle: t('step2DetailsTitle'),
      listItems: [
        t('step2Detail1'),
        t('step2Detail2'),
        t('step2Detail3'),
        t('step2Detail4')
      ],
      footer: t('step2DetailsFooter')
    }),
    styling: {
      color: "text-green-600",
      bgColor: "bg-green-100",
      borderColor: "border-green-400",
      textColor: "text-green-800"
    }
  },
  {
    id: 3,
    getTitle: (t) => t('step3Title'),
    getDescription: (t) => t('step3Description'),
    getDetails: (t) => ({
      intro: t('step3DetailsIntro'),
      listTitle: t('step3DetailsTitle'),
      listItems: [
        t('step3Detail1'),
        t('step3Detail2'),
        t('step3Detail3'),
        t('step3Detail4')
      ],
      footer: t('step3DetailsFooter')
    }),
    styling: {
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      borderColor: "border-purple-400",
      textColor: "text-purple-800"
    }
  },
  {
    id: 4,
    getTitle: (t) => t('step4Title'),
    getDescription: (t) => t('step4Description'),
    getDetails: (t) => ({
      intro: t('step4DetailsIntro'),
      listTitle: t('step4DetailsTitle'),
      listItems: [
        t('step4Detail1'),
        t('step4Detail2'),
        t('step4Detail3'),
        t('step4Detail4')
      ],
      footer: t('step4DetailsFooter')
    }),
    styling: {
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      borderColor: "border-orange-400",
      textColor: "text-orange-800"
    }
  }
];
