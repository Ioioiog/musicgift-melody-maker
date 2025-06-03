
import { stepOneByPackage, stepTwoByPackage } from './enhancedSteps';
import type { PackageData, Addon } from '@/types/packages';

export const packages: PackageData[] = [
  {
    id: "personal",
    value: "personal",
    label_key: "personalPackage",
    tagline_key: "personalTagline",
    description_key: "personalDescription",
    price_ron: 299,
    price_eur: 59,
    delivery_time_key: "personalDelivery",
    tags: ["popularTag"],
    includes: [
      { include_key: "personalInclude1", include_order: 1 },
      { include_key: "personalInclude2", include_order: 2 },
      { include_key: "personalInclude3", include_order: 3 },
      { include_key: "personalInclude4", include_order: 4 }
    ],
    steps: [
      stepOneByPackage.personal,
      stepTwoByPackage.personal,
      {
        id: "personal-step-3",
        step_number: 3,
        title_key: "contactDetails",
        fields: [
          {
            id: "fullName",
            field_name: "fullName",
            field_type: "text",
            label_key: "fullName",
            placeholder_key: "fullNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "email",
            field_name: "email",
            field_type: "email",
            label_key: "email",
            placeholder_key: "emailPlaceholder",
            required: true,
            field_order: 2
          }
        ]
      }
    ]
  },
  {
    id: "premium",
    value: "premium",
    label_key: "premiumPackage",
    tagline_key: "premiumTagline",
    description_key: "premiumDescription",
    price_ron: 499,
    price_eur: 99,
    delivery_time_key: "premiumDelivery",
    tags: ["mostPopular"],
    includes: [
      { include_key: "premiumInclude1", include_order: 1 },
      { include_key: "premiumInclude2", include_order: 2 },
      { include_key: "premiumInclude3", include_order: 3 }
    ],
    steps: [
      stepOneByPackage.premium,
      stepTwoByPackage.premium,
      {
        id: "premium-step-3",
        step_number: 3,
        title_key: "contactDetails",
        fields: [
          {
            id: "fullName",
            field_name: "fullName",
            field_type: "text",
            label_key: "fullName",
            placeholder_key: "fullNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "email",
            field_name: "email",
            field_type: "email",
            label_key: "email",
            placeholder_key: "emailPlaceholder",
            required: true,
            field_order: 2
          }
        ]
      }
    ]
  },
  {
    id: "business",
    value: "business",
    label_key: "businessPackage",
    tagline_key: "businessTagline",
    description_key: "businessDescription",
    price_ron: 499,
    price_eur: 99,
    delivery_time_key: "businessDelivery",
    tags: [],
    includes: [
      { include_key: "businessInclude1", include_order: 1 },
      { include_key: "businessInclude2", include_order: 2 },
      { include_key: "businessInclude3", include_order: 3 },
      { include_key: "businessInclude4", include_order: 4 }
    ],
    steps: [
      stepOneByPackage.business,
      stepTwoByPackage.business,
      {
        id: "business-step-3",
        step_number: 3,
        title_key: "contactDetails",
        fields: [
          {
            id: "fullName",
            field_name: "fullName",
            field_type: "text",
            label_key: "fullName",
            placeholder_key: "fullNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "email",
            field_name: "email",
            field_type: "email",
            label_key: "email",
            placeholder_key: "emailPlaceholder",
            required: true,
            field_order: 2
          }
        ]
      }
    ]
  },
  {
    id: "artist",
    value: "artist",
    label_key: "artistPackage",
    tagline_key: "artistTagline",
    description_key: "artistDescription",
    price_ron: 7999,
    price_eur: 1599,
    delivery_time_key: "artistDelivery",
    tags: ["premiumTag"],
    includes: [
      { include_key: "artistInclude1", include_order: 1 },
      { include_key: "artistInclude2", include_order: 2 },
      { include_key: "artistInclude3", include_order: 3 },
      { include_key: "artistInclude4", include_order: 4 }
    ],
    steps: [
      stepOneByPackage.artist,
      stepTwoByPackage.artist,
      {
        id: "artist-step-3",
        step_number: 3,
        title_key: "contactDetails",
        fields: [
          {
            id: "fullName",
            field_name: "fullName",
            field_type: "text",
            label_key: "fullName",
            placeholder_key: "fullNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "email",
            field_name: "email",
            field_type: "email",
            label_key: "email",
            placeholder_key: "emailPlaceholder",
            required: true,
            field_order: 2
          }
        ]
      }
    ]
  },
  {
    id: "instrumental",
    value: "instrumental",
    label_key: "instrumentalPackage",
    tagline_key: "instrumentalTagline",
    description_key: "instrumentalDescription",
    price_ron: 499,
    price_eur: 99,
    delivery_time_key: "instrumentalDelivery",
    tags: [],
    includes: [
      { include_key: "instrumentalInclude1", include_order: 1 },
      { include_key: "instrumentalInclude2", include_order: 2 },
      { include_key: "instrumentalInclude3", include_order: 3 },
      { include_key: "instrumentalInclude4", include_order: 4 },
      { include_key: "instrumentalInclude5", include_order: 5 }
    ],
    steps: [
      stepOneByPackage.instrumental,
      stepTwoByPackage.instrumental,
      {
        id: "instrumental-step-3",
        step_number: 3,
        title_key: "contactDetails",
        fields: [
          {
            id: "fullName",
            field_name: "fullName",
            field_type: "text",
            label_key: "fullName",
            placeholder_key: "fullNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "email",
            field_name: "email",
            field_type: "email",
            label_key: "email",
            placeholder_key: "emailPlaceholder",
            required: true,
            field_order: 2
          }
        ]
      }
    ]
  },
  {
    id: "remix",
    value: "remix",
    label_key: "remixPackage",
    tagline_key: "remixTagline",
    description_key: "remixDescription",
    price_ron: 499,
    price_eur: 99,
    delivery_time_key: "remixDelivery",
    tags: [],
    includes: [
      { include_key: "remixInclude1", include_order: 1 },
      { include_key: "remixInclude2", include_order: 2 },
      { include_key: "remixInclude3", include_order: 3 },
      { include_key: "remixInclude4", include_order: 4 },
      { include_key: "remixInclude5", include_order: 5 },
      { include_key: "remixInclude6", include_order: 6 }
    ],
    steps: [
      stepOneByPackage.remix,
      stepTwoByPackage.remix,
      {
        id: "remix-step-3",
        step_number: 3,
        title_key: "contactDetails",
        fields: [
          {
            id: "fullName",
            field_name: "fullName",
            field_type: "text",
            label_key: "fullName",
            placeholder_key: "fullNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "email",
            field_name: "email",
            field_type: "email",
            label_key: "email",
            placeholder_key: "emailPlaceholder",
            required: true,
            field_order: 2
          }
        ]
      }
    ]
  }
];

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
