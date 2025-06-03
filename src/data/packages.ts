// Package data definitions with proper TypeScript interfaces

export interface PackageInclude {
  include_key: string;
  include_order?: number;
}

export interface FieldOption {
  value: string;
  label_key: string;
}

export interface Field {
  id: string;
  field_name: string;
  field_type: string;
  label_key?: string;
  placeholder_key?: string;
  required: boolean;
  field_order: number;
  options?: FieldOption[];
}

export interface Step {
  id: string;
  step_number: number;
  title_key: string;
  fields: Field[];
}

export interface PackageData {
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
  steps: Step[];
}

export interface AddonData {
  id: string;
  addon_key: string;
  label_key: string;
  description_key: string;
  price: number;
  packages: string[];
  trigger_field_type?: string;
  trigger_config?: Record<string, any>;
}

// Package definitions
export const packages: PackageData[] = [
  {
    value: "basic",
    label_key: "basicPackage",
    tagline_key: "basicTagline",
    description_key: "basicDescription",
    price_ron: 199,
    price_eur: 39,
    delivery_time_key: "7-10 zile lucrătoare",
    tag: "popular",
    includes: [
      { include_key: "professionalQuality", include_order: 1 },
      { include_key: "personalizedLyrics", include_order: 2 },
      { include_key: "highQualityRecording", include_order: 3 },
      { include_key: "mp3Download", include_order: 4 }
    ],
    steps: [
      {
        id: "step-1",
        step_number: 1,
        title_key: "songStoryStep",
        fields: [
          {
            id: "1-recipient",
            field_name: "recipient",
            field_type: "text",
            label_key: "recipientLabel",
            placeholder_key: "recipientPlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "1-includeNameInSong",
            field_name: "includeNameInSong",
            field_type: "checkbox",
            label_key: "includeNameInSongLabel",
            placeholder_key: "includeNameInSongPlaceholder",
            required: false,
            field_order: 2
          },
          {
            id: "1-pronunciationAudio",
            field_name: "pronunciationAudio",
            field_type: "audio",
            label_key: "pronunciationAudioLabel",
            placeholder_key: "pronunciationAudioPlaceholder",
            required: false,
            field_order: 3
          },
          {
            id: "1-occasion",
            field_name: "occasion",
            field_type: "text",
            label_key: "occasionLabel",
            placeholder_key: "occasionPlaceholder",
            required: true,
            field_order: 4
          },
          {
            id: "1-specialRequests",
            field_name: "specialRequests",
            field_type: "textarea",
            label_key: "specialRequestsLabel",
            placeholder_key: "specialRequestsPlaceholder",
            required: false,
            field_order: 5
          }
        ]
      },
      {
        id: "step-2",
        step_number: 2,
        title_key: "personalDetailsStep",
        fields: [
          {
            id: "2-fullName",
            field_name: "fullName",
            field_type: "text",
            label_key: "fullNameLabel",
            placeholder_key: "fullNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "2-email",
            field_name: "email",
            field_type: "email",
            label_key: "emailLabel",
            placeholder_key: "emailPlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "2-phone",
            field_name: "phone",
            field_type: "tel",
            label_key: "phoneLabel",
            placeholder_key: "phonePlaceholder",
            required: false,
            field_order: 3
          }
        ]
      },
      {
        id: "step-3",
        step_number: 3,
        title_key: "musicalPreferencesStep",
        fields: [
          {
            id: "3-favoriteGenre",
            field_name: "favoriteGenre",
            field_type: "text",
            label_key: "favoriteGenreLabel",
            placeholder_key: "favoriteGenrePlaceholder",
            required: false,
            field_order: 1
          },
          {
            id: "3-voiceGender",
            field_name: "voiceGender",
            field_type: "select",
            label_key: "voiceGenderLabel",
            placeholder_key: "voiceGenderPlaceholder",
            required: false,
            field_order: 2,
            options: [
              { value: "feminine", label_key: "voiceFeminine" },
              { value: "masculine", label_key: "voiceMasculine" },
              { value: "duet", label_key: "voiceDuet" },
              { value: "musicgift_choice", label_key: "voiceMusicGiftChoice" }
            ]
          },
          {
            id: "3-mood",
            field_name: "mood",
            field_type: "select",
            label_key: "moodLabel",
            placeholder_key: "moodPlaceholder",
            required: false,
            field_order: 3,
            options: [
              { value: "romantic", label_key: "moodRomantic" },
              { value: "cheerful", label_key: "moodCheerful" },
              { value: "nostalgic", label_key: "moodNostalgic" },
              { value: "energetic", label_key: "moodEnergetic" },
              { value: "melancholic", label_key: "moodMelancholic" },
              { value: "inspirational", label_key: "moodInspirational" },
              { value: "emotional", label_key: "moodEmotional" },
              { value: "uplifting", label_key: "moodUplifting" }
            ]
          },
          {
            id: "3-songLanguage",
            field_name: "songLanguage",
            field_type: "select",
            label_key: "songLanguageLabel",
            placeholder_key: "songLanguagePlaceholder",
            required: true,
            field_order: 4,
            options: [
              { value: "romanian", label_key: "romanianLanguage" },
              { value: "english", label_key: "englishLanguage" },
              { value: "french", label_key: "frenchLanguage" }
            ]
          }
        ]
      },
      {
        id: "step-4",
        step_number: 4,
        title_key: "addonsStep",
        fields: [
          {
            id: "4-addons",
            field_name: "addons",
            field_type: "addons",
            required: false,
            field_order: 1
          }
        ]
      },
      {
        id: "step-5",
        step_number: 5,
        title_key: "legalAcceptancesStep",
        fields: [
          {
            id: "5-mentionMusicGift",
            field_name: "mentionMusicGift",
            field_type: "checkbox",
            label_key: "mentionMusicGiftLabel",
            placeholder_key: "termsMentionMusicGiftPlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "5-confirmOrder",
            field_name: "confirmOrder",
            field_type: "checkbox",
            label_key: "confirmOrderLabel",
            placeholder_key: "confirmOrderPlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "5-acceptTerms",
            field_name: "acceptTerms",
            field_type: "checkbox",
            label_key: "acceptTermsLabel",
            placeholder_key: "acceptTermsAndConditionsPlaceholder",
            required: true,
            field_order: 3
          }
        ]
      }
    ]
  },
  {
    value: "premium",
    label_key: "premiumPackage",
    tagline_key: "premiumTagline",
    description_key: "premiumDescription",
    price_ron: 399,
    price_eur: 79,
    delivery_time_key: "5-7 zile lucrătoare",
    tag: "premium",
    includes: [
      { include_key: "professionalQuality", include_order: 1 },
      { include_key: "personalizedLyrics", include_order: 2 },
      { include_key: "highQualityRecording", include_order: 3 },
      { include_key: "mp3Download", include_order: 4 },
      { include_key: "extendedVersion", include_order: 5 },
      { include_key: "commercialRights", include_order: 6 }
    ],
    steps: [
      {
        id: "step-1",
        step_number: 1,
        title_key: "songStoryStep",
        fields: [
          {
            id: "1-recipient",
            field_name: "recipient",
            field_type: "text",
            label_key: "recipientLabel",
            placeholder_key: "recipientPlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "1-includeNameInSong",
            field_name: "includeNameInSong",
            field_type: "checkbox",
            label_key: "includeNameInSongLabel",
            placeholder_key: "includeNameInSongPlaceholder",
            required: false,
            field_order: 2
          },
          {
            id: "1-pronunciationAudio",
            field_name: "pronunciationAudio",
            field_type: "audio",
            label_key: "pronunciationAudioLabel",
            placeholder_key: "pronunciationAudioPlaceholder",
            required: false,
            field_order: 3
          },
          {
            id: "1-occasion",
            field_name: "occasion",
            field_type: "text",
            label_key: "occasionLabel",
            placeholder_key: "occasionPlaceholder",
            required: true,
            field_order: 4
          },
          {
            id: "1-specialRequests",
            field_name: "specialRequests",
            field_type: "textarea",
            label_key: "specialRequestsLabel",
            placeholder_key: "specialRequestsPlaceholder",
            required: false,
            field_order: 5
          }
        ]
      },
      {
        id: "step-2",
        step_number: 2,
        title_key: "personalDetailsStep",
        fields: [
          {
            id: "2-fullName",
            field_name: "fullName",
            field_type: "text",
            label_key: "fullNameLabel",
            placeholder_key: "fullNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "2-email",
            field_name: "email",
            field_type: "email",
            label_key: "emailLabel",
            placeholder_key: "emailPlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "2-phone",
            field_name: "phone",
            field_type: "tel",
            label_key: "phoneLabel",
            placeholder_key: "phonePlaceholder",
            required: false,
            field_order: 3
          }
        ]
      },
      {
        id: "step-3",
        step_number: 3,
        title_key: "musicalPreferencesStep",
        fields: [
          {
            id: "3-favoriteGenre",
            field_name: "favoriteGenre",
            field_type: "text",
            label_key: "favoriteGenreLabel",
            placeholder_key: "favoriteGenrePlaceholder",
            required: false,
            field_order: 1
          },
          {
            id: "3-voiceGender",
            field_name: "voiceGender",
            field_type: "select",
            label_key: "voiceGenderLabel",
            placeholder_key: "voiceGenderPlaceholder",
            required: false,
            field_order: 2,
            options: [
              { value: "feminine", label_key: "voiceFeminine" },
              { value: "masculine", label_key: "voiceMasculine" },
              { value: "duet", label_key: "voiceDuet" },
              { value: "musicgift_choice", label_key: "voiceMusicGiftChoice" }
            ]
          },
          {
            id: "3-mood",
            field_name: "mood",
            field_type: "select",
            label_key: "moodLabel",
            placeholder_key: "moodPlaceholder",
            required: false,
            field_order: 3,
            options: [
              { value: "romantic", label_key: "moodRomantic" },
              { value: "cheerful", label_key: "moodCheerful" },
              { value: "nostalgic", label_key: "moodNostalgic" },
              { value: "energetic", label_key: "moodEnergetic" },
              { value: "melancholic", label_key: "moodMelancholic" },
              { value: "inspirational", label_key: "moodInspirational" },
              { value: "emotional", label_key: "moodEmotional" },
              { value: "uplifting", label_key: "moodUplifting" }
            ]
          },
          {
            id: "3-songLanguage",
            field_name: "songLanguage",
            field_type: "select",
            label_key: "songLanguageLabel",
            placeholder_key: "songLanguagePlaceholder",
            required: true,
            field_order: 4,
            options: [
              { value: "romanian", label_key: "romanianLanguage" },
              { value: "english", label_key: "englishLanguage" },
              { value: "french", label_key: "frenchLanguage" }
            ]
          }
        ]
      },
      {
        id: "step-4",
        step_number: 4,
        title_key: "addonsStep",
        fields: [
          {
            id: "4-addons",
            field_name: "addons",
            field_type: "addons",
            required: false,
            field_order: 1
          }
        ]
      },
      {
        id: "step-5",
        step_number: 5,
        title_key: "legalAcceptancesStep",
        fields: [
          {
            id: "5-mentionMusicGift",
            field_name: "mentionMusicGift",
            field_type: "checkbox",
            label_key: "mentionMusicGiftLabel",
            placeholder_key: "termsMentionMusicGiftPlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "5-confirmOrder",
            field_name: "confirmOrder",
            field_type: "checkbox",
            label_key: "confirmOrderLabel",
            placeholder_key: "confirmOrderPlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "5-acceptTerms",
            field_name: "acceptTerms",
            field_type: "checkbox",
            label_key: "acceptTermsLabel",
            placeholder_key: "acceptTermsAndConditionsPlaceholder",
            required: true,
            field_order: 3
          }
        ]
      }
    ]
  },
  {
    value: "gift",
    label_key: "giftPackage",
    tagline_key: "giftTagline", 
    description_key: "giftDescription",
    price_ron: 0,
    price_eur: 0,
    delivery_time_key: "instant",
    tag: "gift",
    includes: [],
    steps: []
  }
];

// Add-ons definitions
export const addons: Record<string, AddonData> = {
  rushDelivery: {
    id: "rushDelivery",
    addon_key: "rushDelivery",
    label_key: "rushDeliveryLabel",
    description_key: "rushDeliveryDescription",
    price: 100,
    packages: ["basic", "premium"]
  },
  commercialRights: {
    id: "commercialRights",
    addon_key: "commercialRights",
    label_key: "commercialRightsLabel",
    description_key: "commercialRightsDescription",
    price: 200,
    packages: ["basic"]
  },
  distributieMangoRecords: {
    id: "distributieMangoRecords",
    addon_key: "distributieMangoRecords",
    label_key: "distributieMangoRecordsLabel",
    description_key: "distributieMangoRecordsDescription",
    price: 149,
    packages: ["basic", "premium"]
  },
  customVideo: {
    id: "customVideo",
    addon_key: "customVideo",
    label_key: "customVideoLabel",
    description_key: "customVideoDescription",
    price: 200,
    packages: ["basic", "premium"],
    trigger_field_type: "file",
    trigger_config: {
      accept: "image/*,video/*",
      multiple: true,
      maxFiles: 10,
      maxSize: "50MB",
      placeholder_key: "uploadPhotosVideosPlaceholder"
    }
  },
  audioMessageFromSender: {
    id: "audioMessageFromSender",
    addon_key: "audioMessageFromSender",
    label_key: "audioMessageFromSenderLabel",
    description_key: "audioMessageFromSenderDescription",
    price: 49,
    packages: ["basic", "premium"],
    trigger_field_type: "audio-recorder",
    trigger_config: {
      placeholder_key: "recordPersonalMessagePlaceholder"
    }
  },
  commercialRightsUpgrade: {
    id: "commercialRightsUpgrade",
    addon_key: "commercialRightsUpgrade",
    label_key: "commercialRightsUpgradeLabel",
    description_key: "commercialRightsUpgradeDescription",
    price: 200,
    packages: ["premium"]
  },
  extendedSong: {
    id: "extendedSong",
    addon_key: "extendedSong",
    label_key: "extendedSongLabel",
    description_key: "extendedSongDescription",
    price: 149,
    packages: ["basic"]
  }
};
