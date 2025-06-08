
import type { Field, Step, FieldOption, Addon } from '@/types';

export interface PackageInclude {
  include_key: string;
  include_order?: number;
}

export interface PackageTag {
  id: string;
  tag_type: string;
  tag_label_key?: string;
  styling_class?: string;
}

export interface Package {
  id?: string;
  value: string;
  label_key: string;
  tagline_key: string;
  description_key: string;
  price_ron: number;
  price_eur: number;
  delivery_time_key: string;
  tag?: string;
  includes?: PackageInclude[];
  available_addons: string[];
  steps: Step[];
}

export interface OrderFlow {
  steps: {
    id: string;
    step_number: number;
    title_key: string;
    fields: {
      id: string;
      field_name: string;
      field_type: string;
      placeholder_key?: string;
      required: boolean;
      field_order: number;
      options?: { value: string; label_key: string }[];
    }[];
  }[];
}

export interface AddOn {
  id: string;
  value: string;
  label_key: string;
  description_key: string;
  price_ron: number;
  price_eur: number;
  availableFor: string[];
}

// Wedding Package Order Flow
const weddingOrderFlow: OrderFlow = {
  steps: [
    {
      id: "wedding-step-1",
      step_number: 1,
      title_key: "weddingStep1Title",
      fields: [
        {
          id: "wedding_couple_names",
          field_name: "couple_names",
          field_type: "text",
          placeholder_key: "weddingCoupleNamesPlaceholder",
          required: true,
          field_order: 1
        },
        {
          id: "wedding_couple_type",
          field_name: "couple_type",
          field_type: "radio",
          required: true,
          field_order: 2,
          options: [
            { value: "bride_groom", label_key: "weddingBrideGroom" },
            { value: "godparents", label_key: "weddingGodparents" }
          ]
        },
        {
          id: "wedding_how_met",
          field_name: "how_met",
          field_type: "textarea",
          placeholder_key: "weddingHowMetPlaceholder",
          required: true,
          field_order: 3
        }
      ]
    },
    {
      id: "wedding-step-2",
      step_number: 2,
      title_key: "weddingStep2Title",
      fields: [
        {
          id: "wedding_love_story",
          field_name: "love_story",
          field_type: "textarea",
          placeholder_key: "weddingLoveStoryPlaceholder",
          required: true,
          field_order: 1
        },
        {
          id: "wedding_atmosphere",
          field_name: "atmosphere",
          field_type: "radio",
          required: true,
          field_order: 2,
          options: [
            { value: "romantic", label_key: "weddingAtmosphereRomantic" },
            { value: "emotional", label_key: "weddingAtmosphereEmotional" },
            { value: "elegant", label_key: "weddingAtmosphereElegant" }
          ]
        },
        {
          id: "wedding_voice_preference",
          field_name: "voice_preference",
          field_type: "radio",
          required: true,
          field_order: 3,
          options: [
            { value: "female", label_key: "voiceFemale" },
            { value: "male", label_key: "voiceMale" }
          ]
        },
        {
          id: "wedding_musical_style",
          field_name: "musical_style",
          field_type: "textarea",
          placeholder_key: "weddingMusicalStylePlaceholder",
          required: true,
          field_order: 4
        }
      ]
    }
  ]
};

// Baptism Package Order Flow
const baptismOrderFlow: OrderFlow = {
  steps: [
    {
      id: "baptism-step-1",
      step_number: 1,
      title_key: "baptismStep1Title",
      fields: [
        {
          id: "baptism_child_name",
          field_name: "child_name",
          field_type: "text",
          placeholder_key: "baptismChildNamePlaceholder",
          required: true,
          field_order: 1
        },
        {
          id: "baptism_name_meaning",
          field_name: "name_meaning",
          field_type: "text",
          placeholder_key: "baptismNameMeaningPlaceholder",
          required: false,
          field_order: 2
        },
        {
          id: "baptism_birth_story",
          field_name: "birth_story",
          field_type: "textarea",
          placeholder_key: "baptismBirthStoryPlaceholder",
          required: true,
          field_order: 3
        }
      ]
    },
    {
      id: "baptism-step-2",
      step_number: 2,
      title_key: "baptismStep2Title",
      fields: [
        {
          id: "baptism_atmosphere",
          field_name: "atmosphere",
          field_type: "radio",
          required: true,
          field_order: 1,
          options: [
            { value: "calm", label_key: "baptismAtmosphereCalm" },
            { value: "playful", label_key: "baptismAtmospherePlayful" },
            { value: "emotional", label_key: "baptismAtmosphereEmotional" }
          ]
        },
        {
          id: "baptism_voice_preference",
          field_name: "voice_preference",
          field_type: "radio",
          required: true,
          field_order: 2,
          options: [
            { value: "female", label_key: "voiceFemale" },
            { value: "male", label_key: "voiceMale" }
          ]
        },
        {
          id: "baptism_musical_style",
          field_name: "musical_style",
          field_type: "radio",
          required: true,
          field_order: 3,
          options: [
            { value: "ballad", label_key: "baptismStyleBallad" },
            { value: "lullaby", label_key: "baptismStyleLullaby" },
            { value: "acoustic_pop", label_key: "baptismStyleAcousticPop" }
          ]
        }
      ]
    }
  ]
};

// Coming of Age Package Order Flow
const comingOfAgeOrderFlow: OrderFlow = {
  steps: [
    {
      id: "coming-of-age-step-1",
      step_number: 1,
      title_key: "comingOfAgeStep1Title",
      fields: [
        {
          id: "coming_of_age_celebrant_name",
          field_name: "celebrant_name",
          field_type: "text",
          placeholder_key: "comingOfAgeCelebrantNamePlaceholder",
          required: true,
          field_order: 1
        },
        {
          id: "coming_of_age_hobbies",
          field_name: "hobbies",
          field_type: "textarea",
          placeholder_key: "comingOfAgeHobbiesPlaceholder",
          required: true,
          field_order: 2
        },
        {
          id: "coming_of_age_personal_message",
          field_name: "personal_message",
          field_type: "textarea",
          placeholder_key: "comingOfAgePersonalMessagePlaceholder",
          required: true,
          field_order: 3
        }
      ]
    },
    {
      id: "coming-of-age-step-2",
      step_number: 2,
      title_key: "comingOfAgeStep2Title",
      fields: [
        {
          id: "coming_of_age_musical_style",
          field_name: "musical_style",
          field_type: "radio",
          required: true,
          field_order: 1,
          options: [
            { value: "hip_hop", label_key: "comingOfAgeStyleHipHop" },
            { value: "pop", label_key: "comingOfAgeStylePop" },
            { value: "trap", label_key: "comingOfAgeStyleTrap" },
            { value: "lofi", label_key: "comingOfAgeStyleLofi" }
          ]
        },
        {
          id: "coming_of_age_vibe",
          field_name: "vibe",
          field_type: "radio",
          required: true,
          field_order: 2,
          options: [
            { value: "emotional", label_key: "comingOfAgeVibeEmotional" },
            { value: "fun", label_key: "comingOfAgeVibeFun" },
            { value: "rebellious", label_key: "comingOfAgeVibeRebellious" },
            { value: "dreamy", label_key: "comingOfAgeVibeDreamy" }
          ]
        },
        {
          id: "coming_of_age_favorite_artists",
          field_name: "favorite_artists",
          field_type: "textarea",
          placeholder_key: "comingOfAgeFavoriteArtistsPlaceholder",
          required: false,
          field_order: 3
        },
        {
          id: "coming_of_age_voice_preference",
          field_name: "voice_preference",
          field_type: "radio",
          required: true,
          field_order: 4,
          options: [
            { value: "female", label_key: "voiceFemale" },
            { value: "male", label_key: "voiceMale" }
          ]
        }
      ]
    }
  ]
};

export const packages: Package[] = [
  {
    id: "plus",
    value: "plus",
    label_key: "plusPackage",
    description_key: "plusDescription",
    tagline_key: "plusTagline",
    price_ron: 1,
    price_eur: 1,
    delivery_time_key: "plusDelivery",
    includes: [
      { include_key: "plusInclude1" },
      { include_key: "plusInclude2" },
      { include_key: "plusInclude3" },
    ],
    available_addons: ["rushDelivery", "socialMediaRights", "customVideo", "audioMessageFromSender", "extendedSong"],
    steps: [],
    tag: "new",
  },
  {
    id: "personal",
    value: "personal",
    label_key: "personalPackage",
    description_key: "personalDescription",
    tagline_key: "personalTagline",
    price_ron: 299,
    price_eur: 59,
    delivery_time_key: "personalDelivery",
    includes: [
      { include_key: "personalInclude1" },
      { include_key: "personalInclude2" },
      { include_key: "personalInclude3" },
      { include_key: "personalInclude4" },
    ],
    available_addons: ["rushDelivery", "socialMediaRights", "distributieMangoRecords", "customVideo", "audioMessageFromSender", "extendedSong"],
    steps: [],
  },
  {
    id: "premium",
    value: "premium",
    label_key: "premiumPackage",
    description_key: "premiumDescription",
    tagline_key: "premiumTagline",
    price_ron: 499,
    price_eur: 99,
    delivery_time_key: "premiumDelivery",
    includes: [
      { include_key: "premiumInclude1" },
      { include_key: "premiumInclude2" },
      { include_key: "premiumInclude3" },
    ],
    available_addons: ["rushDelivery", "customVideo", "audioMessageFromSender", "extendedSong"],
    steps: [],
    tag: "popular",
  },
  {
    id: "business",
    value: "business",
    label_key: "businessPackage",
    description_key: "businessDescription",
    tagline_key: "businessTagline",
    price_ron: 499,
    price_eur: 99,
    delivery_time_key: "businessDelivery",
    includes: [
      { include_key: "businessInclude1" },
      { include_key: "businessInclude2" },
      { include_key: "businessInclude3" },
      { include_key: "businessInclude4" },
    ],
    available_addons: ["rushDelivery", "customVideo", "brandedAudioMessage", "commercialRightsUpgrade", "extendedSong"],
    steps: [],
  },
  {
    id: "artist",
    value: "artist",
    label_key: "artistPackage",
    description_key: "artistDescription",
    tagline_key: "artistTagline",
    price_ron: 7999,
    price_eur: 1599,
    delivery_time_key: "artistDelivery",
    includes: [
      { include_key: "artistInclude1" },
      { include_key: "artistInclude2" },
      { include_key: "artistInclude3" },
      { include_key: "artistInclude4" },
    ],
    available_addons: ["rushDelivery", "socialMediaRights", "customVideo", "audioMessageFromSender"],
    steps: [],
  },
  {
    id: "remix",
    value: "remix",
    label_key: "remixPackage",
    description_key: "remixDescription",
    tagline_key: "remixTagline",
    price_ron: 499,
    price_eur: 99,
    delivery_time_key: "remixDelivery",
    includes: [
      { include_key: "remixInclude1" },
      { include_key: "remixInclude2" },
      { include_key: "remixInclude3" },
      { include_key: "remixInclude4" },
      { include_key: "remixInclude5" },
      { include_key: "remixInclude6" },
    ],
    available_addons: ["rushDelivery", "socialMediaRights", "distributieMangoRecords", "customVideo", "audioMessageFromSender"],
    steps: [],
  },
  {
    id: "instrumental",
    value: "instrumental",
    label_key: "instrumentalPackage",
    description_key: "instrumentalDescription",
    tagline_key: "instrumentalTagline",
    price_ron: 499,
    price_eur: 99,
    delivery_time_key: "instrumentalDelivery",
    includes: [
      { include_key: "instrumentalInclude1" },
      { include_key: "instrumentalInclude2" },
      { include_key: "instrumentalInclude3" },
      { include_key: "instrumentalInclude4" },
      { include_key: "instrumentalInclude5" },
    ],
    available_addons: ["rushDelivery", "socialMediaRights", "distributieMangoRecords", "customVideo", "audioMessageFromSender"],
    steps: [],
  },
  {
    id: "gift",
    value: "gift",
    label_key: "giftPackage",
    description_key: "giftDescription",
    tagline_key: "giftTagline",
    price_ron: 299,
    price_eur: 59,
    delivery_time_key: "giftDelivery",
    includes: [
      { include_key: "giftInclude1" },
      { include_key: "giftInclude2" },
      { include_key: "giftInclude3" },
    ],
    available_addons: [],
    steps: [],
    tag: "gift",
  },
  {
    id: "wedding",
    value: "wedding",
    label_key: "weddingPackage",
    description_key: "weddingDescription",
    tagline_key: "weddingTagline",
    price_ron: 299,
    price_eur: 59,
    delivery_time_key: "weddingDelivery",
    includes: [
      { include_key: "weddingInclude1" },
      { include_key: "weddingInclude2" },
      { include_key: "weddingInclude3" },
      { include_key: "weddingInclude4" },
      { include_key: "weddingInclude5" },
      { include_key: "weddingInclude6" },
      { include_key: "weddingInclude7" },
      { include_key: "weddingInclude8" }
    ],
    available_addons: ["rushDelivery", "socialMediaRights", "customVideo", "audioMessageFromSender", "extendedSong", "godparentsmelody"],
    steps: weddingOrderFlow.steps,
    tag: "new"
  },
  {
    id: "baptism",
    value: "baptism",
    label_key: "baptismPackage",
    description_key: "baptismDescription",
    tagline_key: "baptismTagline",
    price_ron: 299,
    price_eur: 59,
    delivery_time_key: "baptismDelivery",
    includes: [
      { include_key: "baptismInclude1" },
      { include_key: "baptismInclude2" },
      { include_key: "baptismInclude3" },
      { include_key: "baptismInclude4" },
      { include_key: "baptismInclude5" },
      { include_key: "baptismInclude6" }
    ],
    available_addons: ["rushDelivery", "socialMediaRights", "distributieMangoRecords", "customVideo", "audioMessageFromSender", "extendedSong"],
    steps: baptismOrderFlow.steps,
    tag: "new"
  },
  {
    id: "coming-of-age",
    value: "coming-of-age",
    label_key: "comingOfAgePackage",
    description_key: "comingOfAgeDescription",
    tagline_key: "comingOfAgeTagline",
    price_ron: 299,
    price_eur: 59,
    delivery_time_key: "comingOfAgeDelivery",
    includes: [
      { include_key: "comingOfAgeInclude1" },
      { include_key: "comingOfAgeInclude2" },
      { include_key: "comingOfAgeInclude3" },
      { include_key: "comingOfAgeInclude4" },
      { include_key: "comingOfAgeInclude5" },
      { include_key: "comingOfAgeInclude6" }
    ],
    available_addons: ["rushDelivery", "socialMediaRights", "customVideo", "audioMessageFromSender", "extendedSong"],
    steps: comingOfAgeOrderFlow.steps,
    tag: "new"
  }
];

export const addOns: AddOn[] = [
  {
    id: "rushDelivery",
    value: "rushDelivery",
    label_key: "rushDelivery",
    description_key: "rushDeliveryDesc",
    price_ron: 100,
    price_eur: 20,
    availableFor: ['personal', 'business', 'premium', 'instrumental', 'remix', 'wedding', 'baptism', 'comingOfAge']
  },
  {
    id: "socialMediaRights",
    value: "socialMediaRights",
    label_key: "socialMediaRights",
    description_key: "socialMediaRightsDesc",
    price_ron: 0,
    price_eur: 0,
    availableFor: ['personal', 'business', 'premium', 'instrumental', 'remix', 'wedding', 'baptism', 'comingOfAge']
  },
  {
    id: "distributieMangoRecords",
    value: "distributieMangoRecords",
    label_key: "distributieMangoRecords",
    description_key: "distributieMangoRecordsDesc",
    price_ron: 200,
    price_eur: 40,
    availableFor: ['personal', 'remix', 'instrumental', 'wedding', 'baptism']
  },
  {
    id: "customVideo",
    value: "customVideo",
    label_key: "customVideo",
    description_key: "customVideoDesc",
    price_ron: 149,
    price_eur: 30,
    availableFor: ['personal', 'business', 'premium', 'instrumental', 'remix', 'wedding', 'baptism', 'comingOfAge']
  },
  {
    id: "audioMessageFromSender",
    value: "audioMessageFromSender",
    label_key: "audioMessageFromSender",
    description_key: "audioMessageFromSenderDesc",
    price_ron: 100,
    price_eur: 20,
    availableFor: ['personal', 'premium', 'wedding', 'baptism', 'comingOfAge']
  },
  {
    id: "brandedAudioMessage",
    value: "brandedAudioMessage",
    label_key: "brandedAudioMessage",
    description_key: "brandedAudioMessageDesc",
    price_ron: 0,
    price_eur: 0,
    availableFor: ['business']
  },
  {
    id: "commercialRightsUpgrade",
    value: "commercialRightsUpgrade",
    label_key: "commercialRightsUpgrade",
    description_key: "commercialRightsUpgradeDesc",
    price_ron: 400,
    price_eur: 80,
    availableFor: ['business']
  },
  {
    id: "extendedSong",
    value: "extendedSong",
    label_key: "extendedSong",
    description_key: "extendedSongDesc",
    price_ron: 49,
    price_eur: 10,
    availableFor: ['personal', 'premium', 'business', 'wedding', 'baptism', 'comingOfAge']
  },
  {
    id: "godparentsmelody",
    value: "godparentsmelody",
    label_key: "godparentsmelody",
    description_key: "godparentsmelodyDesc",
    price_ron: 199,
    price_eur: 40,
    availableFor: ['wedding']
  }
];

// Export PackageData type alias
export type PackageData = Package;
