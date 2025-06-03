
import type { Package, Addon } from '@/types/packages';
import { stepOneByPackage, stepTwoByPackage } from './enhancedSteps';

// Define the addons configuration
export const addons: Record<string, Addon> = {
  rushDelivery: {
    label_key: "rushDelivery",
    description_key: "rushDeliveryDesc",
    price: 199,
    packages: ["personal", "premium", "business", "artist", "remix", "instrumental"]
  },
  exclusiveMangoDistribution: {
    label_key: "exclusiveMangoDistribution",
    description_key: "exclusiveMangoDistributionDesc",
    price: 299,
    packages: ["premium", "artist"]
  },
  customVideo: {
    label_key: "customVideo",
    description_key: "customVideoDesc",
    price: 399,
    packages: ["personal", "premium", "artist"]
  },
  audioMessageFromSender: {
    label_key: "audioMessageFromSender",
    description_key: "audioMessageFromSenderDesc",
    price: 99,
    packages: ["personal", "premium"]
  },
  commercialRightsUpgrade: {
    label_key: "commercialRightsUpgrade",
    description_key: "commercialRightsUpgradeDesc",
    price: 249,
    packages: ["personal", "instrumental"]
  },
  extendedSong: {
    label_key: "extendedSong",
    description_key: "extendedSongDesc",
    price: 149,
    packages: ["personal", "premium"]
  },
  additionalInstrument: {
    label_key: "additionalInstrument",
    description_key: "additionalInstrumentDesc",
    price: 79,
    packages: ["instrumental"],
    trigger_field_type: "select",
    trigger_config: {
      options: [
        { value: "guitar", label_key: "guitar" },
        { value: "piano", label_key: "piano" },
        { value: "drums", label_key: "drums" },
        { value: "bass", label_key: "bass" }
      ]
    }
  },
  vocalTuning: {
    label_key: "vocalTuning",
    description_key: "vocalTuningDesc",
    price: 99,
    packages: ["artist"],
    trigger_field_type: "checkbox"
  },
  remixStems: {
    label_key: "remixStems",
    description_key: "remixStemsDesc",
    price: 49,
    packages: ["remix"],
    trigger_field_type: "file",
    trigger_config: {
      allowedTypes: [".wav", ".mp3", ".zip"],
      maxFiles: 5,
      maxTotalSizeMb: 50
    }
  }
};

export const packages: Package[] = [
  {
    id: "personal-package",
    value: "personal",
    label_key: "personalPackage",
    tagline_key: "personalTagline",
    description_key: "personalDescription",
    price_ron: 299,
    price_eur: 59,
    delivery_time_key: "personalDelivery",
    tag: "popular",
    includes: [
      { include_key: "personalInclude1" },
      { include_key: "personalInclude2" },
      { include_key: "personalInclude3" },
      { include_key: "personalInclude4" }
    ],
    steps: [
      stepOneByPackage.personal,
      stepTwoByPackage.personal,
      {
        id: "personal-step-3",
        step_number: 3,
        title_key: "addonsStep",
        fields: [
          {
            id: "addons",
            field_name: "addons",
            field_type: "checkbox-group",
            label_key: "Opțiuni suplimentare",
            placeholder_key: "Selectează opțiunile dorite",
            required: false,
            field_order: 1
          }
        ]
      },
      {
        id: "personal-step-4",
        step_number: 4,
        title_key: "contactDetailsStep",
        fields: [
          {
            id: "fullName",
            field_name: "fullName",
            field_type: "text",
            label_key: "Numele complet",
            placeholder_key: "fullNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "email",
            field_name: "email",
            field_type: "email",
            label_key: "Adresa de email",
            placeholder_key: "emailPlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "phone",
            field_name: "phone",
            field_type: "tel",
            label_key: "Telefon",
            placeholder_key: "phonePlaceholder",
            required: true,
            field_order: 3
          }
        ]
      },
      {
        id: "personal-step-5",
        step_number: 5,
        title_key: "legalAcceptancesStep",
        fields: [
          {
            id: "termsMentionMusicGift",
            field_name: "termsMentionMusicGift",
            field_type: "checkbox",
            label_key: "Mențiune MusicGift",
            placeholder_key: "termsMentionMusicGiftPlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "confirmOrder",
            field_name: "confirmOrder",
            field_type: "checkbox",
            label_key: "Confirmare comandă",
            placeholder_key: "confirmOrderPlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "acceptTermsAndConditions",
            field_name: "acceptTermsAndConditions",
            field_type: "checkbox",
            label_key: "Termeni și condiții",
            placeholder_key: "acceptTermsAndConditionsPlaceholder",
            required: true,
            field_order: 3
          }
        ]
      }
    ]
  },
  {
    id: "premium-package",
    value: "premium",
    label_key: "premiumPackage",
    tagline_key: "premiumTagline",
    description_key: "premiumDescription",
    price_ron: 499,
    price_eur: 99,
    delivery_time_key: "premiumDelivery",
    tag: "premium",
    includes: [
      { include_key: "premiumInclude1" },
      { include_key: "premiumInclude2" },
      { include_key: "premiumInclude3" }
    ],
    steps: [
      stepOneByPackage.premium,
      stepTwoByPackage.premium,
      {
        id: "premium-step-3",
        step_number: 3,
        title_key: "addonsStep",
        fields: [
          {
            id: "addons",
            field_name: "addons",
            field_type: "checkbox-group",
            placeholder_key: "selectAddonsPlaceholder",
            required: false,
            field_order: 1
          }
        ]
      },
      {
        id: "premium-step-4",
        step_number: 4,
        title_key: "distributionConfirmationStep",
        fields: [
          {
            id: "acceptMention",
            field_name: "acceptMention",
            field_type: "checkbox",
            placeholder_key: "acceptMentionPlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "acceptMangoDistribution",
            field_name: "acceptMangoDistribution",
            field_type: "checkbox",
            placeholder_key: "acceptMangoDistributionPlaceholder",
            required: true,
            field_order: 2
          }
        ]
      }
    ]
  },
  {
    id: "business-package",
    value: "business",
    label_key: "businessPackage",
    tagline_key: "businessTagline",
    description_key: "businessDescription",
    price_ron: 499,
    price_eur: 99,
    delivery_time_key: "businessDelivery",
    tag: "new",
    includes: [
      { include_key: "businessInclude1" },
      { include_key: "businessInclude2" },
      { include_key: "businessInclude3" },
      { include_key: "businessInclude4" }
    ],
    steps: [
      stepOneByPackage.business,
      stepTwoByPackage.business,
      {
        id: "business-step-3",
        step_number: 3,
        title_key: "addonsStep",
        fields: [
          {
            id: "addons",
            field_name: "addons",
            field_type: "checkbox-group",
            placeholder_key: "selectAddonsPlaceholder",
            required: false,
            field_order: 1
          }
        ]
      }
    ]
  },
  {
    id: "artist-package",
    value: "artist",
    label_key: "artistPackage",
    tagline_key: "artistTagline",
    description_key: "artistDescription",
    price_ron: 7999,
    price_eur: 1599,
    delivery_time_key: "artistDelivery",
    tag: "new",
    includes: [
      { include_key: "artistInclude1" },
      { include_key: "artistInclude2" },
      { include_key: "artistInclude3" },
      { include_key: "artistInclude4" }
    ],
    steps: [
      stepOneByPackage.artist,
      stepTwoByPackage.artist,
      {
        id: "artist-step-3",
        step_number: 3,
        title_key: "processAcceptanceStep",
        fields: [
          {
            id: "acceptProcess",
            field_name: "acceptProcess",
            field_type: "checkbox",
            placeholder_key: "acceptProcessPlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "acceptContact",
            field_name: "acceptContact",
            field_type: "checkbox",
            placeholder_key: "acceptContactPlaceholder",
            required: true,
            field_order: 2
          }
        ]
      }
    ]
  },
  {
    id: "remix-package",
    value: "remix",
    label_key: "remixPackage",
    tagline_key: "remixTagline",
    description_key: "remixDescription",
    price_ron: 499,
    price_eur: 99,
    delivery_time_key: "remixDelivery",
    tag: "new",
    includes: [
      { include_key: "remixInclude1" },
      { include_key: "remixInclude2" },
      { include_key: "remixInclude3" },
      { include_key: "remixInclude4" },
      { include_key: "remixInclude5" },
      { include_key: "remixInclude6" }
    ],
    steps: [
      stepOneByPackage.remix,
      stepTwoByPackage.remix
    ]
  },
  {
    id: "instrumental-package",
    value: "instrumental",
    label_key: "instrumentalPackage",
    tagline_key: "instrumentalTagline",
    description_key: "instrumentalDescription",
    price_ron: 499,
    price_eur: 99,
    delivery_time_key: "instrumentalDelivery",
    tag: "new",
    includes: [
      { include_key: "instrumentalInclude1" },
      { include_key: "instrumentalInclude2" },
      { include_key: "instrumentalInclude3" },
      { include_key: "instrumentalInclude4" },
      { include_key: "instrumentalInclude5" }
    ],
    steps: [
      stepOneByPackage.instrumental,
      stepTwoByPackage.instrumental,
      {
        id: "instrumental-step-3",
        step_number: 3,
        title_key: "extraOptionsStep",
        fields: [
          {
            id: "fullName",
            field_name: "fullName",
            field_type: "text",
            placeholder_key: "fullNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "email",
            field_name: "email",
            field_type: "email",
            placeholder_key: "emailPlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "phone",
            field_name: "phone",
            field_type: "tel",
            placeholder_key: "phonePlaceholder",
            required: true,
            field_order: 3
          }
        ]
      }
    ]
  },
  {
    id: "gift-package",
    value: "gift",
    label_key: "giftPackage",
    tagline_key: "giftTagline",
    description_key: "giftDescription",
    price_ron: 349,
    price_eur: 69,
    delivery_time_key: "giftDelivery",
    tag: "gift",
    includes: [
      { include_key: "giftInclude1" },
      { include_key: "giftInclude2" },
      { include_key: "giftInclude3" }
    ],
    steps: [
      {
        id: "gift-step-1",
        step_number: 1,
        title_key: "recipientDetailsStep",
        fields: [
          {
            id: "giftRecipientName",
            field_name: "giftRecipientName",
            field_type: "text",
            placeholder_key: "giftRecipientNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "recipientEmail",
            field_name: "recipientEmail",
            field_type: "email",
            placeholder_key: "recipientEmailPlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "personalMessage",
            field_name: "personalMessage",
            field_type: "textarea",
            placeholder_key: "personalMessagePlaceholder",
            required: false,
            field_order: 3
          }
        ]
      },
      {
        id: "gift-step-2",
        step_number: 2,
        title_key: "deliveryConfirmationStep",
        fields: [
          {
            id: "senderName",
            field_name: "senderName",
            field_type: "text",
            placeholder_key: "senderNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "senderEmail",
            field_name: "senderEmail",
            field_type: "email",
            placeholder_key: "senderEmailPlaceholder",
            required: true,
            field_order: 2
          }
        ]
      }
    ]
  }
];

// Export for compatibility with existing code
export type PackageData = Package;
