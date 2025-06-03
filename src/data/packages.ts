import type { Package } from '@/types';

// Define the addons configuration
export const addons = {
  rushDelivery: { 
    price_ron: 99,
    price_eur: 19,
    label_key: 'rushDeliveryLabel',
    description_key: 'rushDeliveryDescription',
    availableFor: ['personal', 'business', 'premium', 'instrumental', 'remix', 'plus']
  },
  commercialRights: { 
    price_ron: 99,
    price_eur: 19,
    label_key: 'commercialRightsLabel',
    description_key: 'commercialRightsDescription',
    availableFor: ['personal', 'plus']
  },
  distributieMangoRecords: {
    price_ron: 199,
    price_eur: 39,
    label_key: 'distributieMangoRecordsLabel',
    description_key: 'distributieMangoRecordsDescription',
    availableFor: ['personal', 'remix', 'instrumental', 'plus']
  },
  customVideo: { 
    price_ron: 149,
    price_eur: 29,
    label_key: 'customVideoLabel',
    description_key: 'customVideoDescription',
    availableFor: ['personal', 'business', 'premium', 'instrumental', 'remix', 'plus']
  },
  audioMessageFromSender: { 
    price_ron: 99,
    price_eur: 19,
    label_key: 'audioMessageFromSenderLabel',
    description_key: 'audioMessageFromSenderDescription',
    availableFor: ['personal', 'business', 'premium', 'plus']
  },
  commercialRightsUpgrade: {
    price_ron: 399,
    price_eur: 79,
    label_key: 'commercialRightsUpgradeLabel',
    description_key: 'commercialRightsUpgradeDescription',
    availableFor: ['business']
  },
  extendedSong: {
    price_ron: 49,
    price_eur: 9,
    label_key: 'extendedSongLabel',
    description_key: 'extendedSongDescription',
    availableFor: ['personal', 'premium', 'business', 'plus']
  }
};

export const packages: Package[] = [
  {
    id: "plus-package",
    value: "plus",
    label_key: "plusPackage",
    tagline_key: "plusTagline",
    description_key: "plusDescription",
    price_ron: 1,
    price_eur: 1,
    delivery_time_key: "plusDelivery",
    tag: "new",
    includes: [
      { include_key: "plusInclude1" },
      { include_key: "plusInclude2" },
      { include_key: "plusInclude3" }
    ],
    steps: [
      {
        id: "plus-step-1",
        step_number: 1,
        title_key: "contactDetailsStep",
        fields: [
          {
            id: "fullName",
            field_name: "fullName",
            field_type: "text",
            label_key: "fullNameLabel",
            placeholder_key: "fullNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "email",
            field_name: "email",
            field_type: "email",
            label_key: "emailLabel",
            placeholder_key: "emailPlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "phone",
            field_name: "phone",
            field_type: "tel",
            label_key: "phoneLabel",
            placeholder_key: "phonePlaceholder",
            required: true,
            field_order: 3
          }
        ]
      },
      {
        id: "plus-step-2",
        step_number: 2,
        title_key: "legalAcceptancesStep",
        fields: [
          {
            id: "acceptTermsAndConditions",
            field_name: "acceptTermsAndConditions",
            field_type: "checkbox",
            label_key: "Termeni și condiții",
            placeholder_key: "acceptTermsAndConditionsPlaceholder",
            required: true,
            field_order: 1
          }
        ]
      }
    ]
  },
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
      {
        id: "personal-step-1",
        step_number: 1,
        title_key: "songStoryStep",
        fields: [
          {
            id: "recipient",
            field_name: "recipient",
            field_type: "text",
            label_key: "recipientLabel",
            placeholder_key: "recipientPlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "includeNameInSong",
            field_name: "includeNameInSong",
            field_type: "checkbox",
            label_key: "includeNameInSongLabel",
            placeholder_key: "includeNameInSongPlaceholder",
            required: false,
            field_order: 2
          },
          {
            id: "pronunciationAudio",
            field_name: "pronunciationAudio",
            field_type: "audio",
            label_key: "pronunciationAudioLabel",
            placeholder_key: "pronunciationAudioPlaceholder",
            required: false,
            field_order: 3
          },
          {
            id: "relationshipText",
            field_name: "relationshipText",
            field_type: "text",
            label_key: "relationshipTextLabel",
            placeholder_key: "relationshipTextPlaceholder",
            required: true,
            field_order: 4
          },
          {
            id: "storyDetailed",
            field_name: "storyDetailed",
            field_type: "textarea",
            label_key: "storyDetailedLabel",
            placeholder_key: "storyDetailedPlaceholder",
            required: true,
            field_order: 5
          },
          {
            id: "keywords",
            field_name: "keywords",
            field_type: "text",
            label_key: "keywordsLabel",
            placeholder_key: "keywordsPlaceholder",
            required: false,
            field_order: 6
          },
          {
            id: "keywordsAudio",
            field_name: "keywordsAudio",
            field_type: "audio",
            label_key: "keywordsAudioLabel",
            placeholder_key: "keywordsAudioPlaceholder",
            required: false,
            field_order: 7
          }
        ]
      },
      {
        id: "personal-step-2",
        step_number: 2,
        title_key: "musicalPreferencesStep",
        fields: [
          {
            id: "styleReference",
            field_name: "styleReference",
            field_type: "text",
            label_key: "styleReferenceLabel",
            placeholder_key: "styleReferencePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "mood",
            field_name: "mood",
            field_type: "select",
            label_key: "moodLabel",
            placeholder_key: "moodPlaceholder",
            required: true,
            field_order: 2,
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
            id: "voiceGender",
            field_name: "voiceGender",
            field_type: "select",
            label_key: "voiceGenderLabel",
            placeholder_key: "voiceGenderPlaceholder",
            required: true,
            field_order: 3,
            options: [
              { value: "feminine", label_key: "voiceFeminine" },
              { value: "masculine", label_key: "voiceMasculine" },
              { value: "duet", label_key: "voiceDuet" },
              { value: "musicgift_choice", label_key: "voiceMusicGiftChoice" }
            ]
          },
          {
            id: "youtubeExample",
            field_name: "youtubeExample",
            field_type: "url",
            label_key: "youtubeExampleLabel",
            placeholder_key: "youtubeExamplePlaceholder",
            required: false,
            field_order: 4
          },
          {
            id: "language",
            field_name: "language",
            field_type: "select",
            label_key: "songLanguageLabel",
            placeholder_key: "songLanguagePlaceholder",
            required: true,
            field_order: 5,
            options: [
              { value: "ro", label_key: "romanianLanguage" },
              { value: "en", label_key: "englishLanguage" },
              { value: "fr", label_key: "frenchLanguage" }
            ]
          }
        ]
      },
      {
        id: "personal-step-3",
        step_number: 3,
        title_key: "addonsStep",
        fields: [
          {
            id: "addons",
            field_name: "addons",
            field_type: "checkbox-group",
            label_key: "addons",
            placeholder_key: "selectOption",
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
            label_key: "fullNameLabel",
            placeholder_key: "fullNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "email",
            field_name: "email",
            field_type: "email",
            label_key: "emailLabel",
            placeholder_key: "emailPlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "phone",
            field_name: "phone",
            field_type: "tel",
            label_key: "phoneLabel",
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
      {
        id: "premium-step-1",
        step_number: 1,
        title_key: "personalDetailsStep",
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
          },
          {
            id: "language",
            field_name: "language",
            field_type: "select",
            placeholder_key: "songLanguagePlaceholder",
            required: true,
            field_order: 4,
            options: [
              { value: "ro", label_key: "Română" },
              { value: "en", label_key: "English" },
              { value: "fr", label_key: "Français" }
            ]
          }
        ]
      },
      {
        id: "premium-step-2",
        step_number: 2,
        title_key: "yourStoryStep",
        fields: [
          {
            id: "occasion",
            field_name: "occasion",
            field_type: "text",
            placeholder_key: "occasionPlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "pronunciationRecording",
            field_name: "pronunciationRecording",
            field_type: "file",
            placeholder_key: "pronunciationRecordingPlaceholder",
            required: false,
            field_order: 2
          },
          {
            id: "story",
            field_name: "story",
            field_type: "textarea",
            placeholder_key: "storyPlaceholder",
            required: true,
            field_order: 3
          },
          {
            id: "vibe",
            field_name: "vibe",
            field_type: "text",
            placeholder_key: "vibePlaceholder",
            required: true,
            field_order: 4
          },
          {
            id: "youtubeLinks",
            field_name: "youtubeLinks",
            field_type: "textarea",
            placeholder_key: "youtubeLinksPlaceholder",
            required: false,
            field_order: 5
          },
          {
            id: "importantKeywords",
            field_name: "importantKeywords",
            field_type: "text",
            placeholder_key: "importantKeywordsPlaceholder",
            required: false,
            field_order: 6
          },
          {
            id: "keywordsPronunciation",
            field_name: "keywordsPronunciation",
            field_type: "file",
            placeholder_key: "keywordsPronunciationPlaceholder",
            required: false,
            field_order: 7
          }
        ]
      },
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
      {
        id: "business-step-1",
        step_number: 1,
        title_key: "companyDetailsStep",
        fields: [
          {
            id: "companyName",
            field_name: "companyName",
            field_type: "text",
            placeholder_key: "companyNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "contactPerson",
            field_name: "contactPerson",
            field_type: "text",
            placeholder_key: "contactPersonPlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "email",
            field_name: "email",
            field_type: "email",
            placeholder_key: "emailPlaceholder",
            required: true,
            field_order: 3
          },
          {
            id: "phone",
            field_name: "phone",
            field_type: "tel",
            placeholder_key: "phonePlaceholder",
            required: true,
            field_order: 4
          },
          {
            id: "companyPronunciation",
            field_name: "companyPronunciation",
            field_type: "file",
            placeholder_key: "companyPronunciationPlaceholder",
            required: false,
            field_order: 5
          }
        ]
      },
      {
        id: "business-step-2",
        step_number: 2,
        title_key: "brandStoryStep",
        fields: [
          {
            id: "brandStory",
            field_name: "brandStory",
            field_type: "textarea",
            placeholder_key: "brandStoryPlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "keyValues",
            field_name: "keyValues",
            field_type: "textarea",
            placeholder_key: "keyValuesPlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "inspirationLinks",
            field_name: "inspirationLinks",
            field_type: "textarea",
            placeholder_key: "inspirationLinksPlaceholder",
            required: false,
            field_order: 3
          }
        ]
      },
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
      {
        id: "artist-step-1",
        step_number: 1,
        title_key: "artisticDataStep",
        fields: [
          {
            id: "artistName",
            field_name: "artistName",
            field_type: "text",
            placeholder_key: "artistNamePlaceholder",
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
          },
          {
            id: "mediaLinks",
            field_name: "mediaLinks",
            field_type: "textarea",
            placeholder_key: "mediaLinksPlaceholder",
            required: false,
            field_order: 4
          },
          {
            id: "pressLinks",
            field_name: "pressLinks",
            field_type: "textarea",
            placeholder_key: "pressLinksPlaceholder",
            required: false,
            field_order: 5
          }
        ]
      },
      {
        id: "artist-step-2",
        step_number: 2,
        title_key: "songConceptStep",
        fields: [
          {
            id: "musicalVision",
            field_name: "musicalVision",
            field_type: "textarea",
            placeholder_key: "musicalVisionPlaceholder",
            required: true,
            field_order: 1
          }
        ]
      },
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
      {
        id: "remix-step-1",
        step_number: 1,
        title_key: "remixInfoStep",
        fields: [
          {
            id: "originalSongLink",
            field_name: "originalSongLink",
            field_type: "url",
            placeholder_key: "originalSongLinkPlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "uploadWAV",
            field_name: "uploadWAV",
            field_type: "file",
            placeholder_key: "uploadWAVPlaceholder",
            required: false,
            field_order: 2
          },
          {
            id: "remixGenre",
            field_name: "remixGenre",
            field_type: "text",
            placeholder_key: "remixGenrePlaceholder",
            required: true,
            field_order: 3
          }
        ]
      },
      {
        id: "remix-step-2",
        step_number: 2,
        title_key: "legalityContactStep",
        fields: [
          {
            id: "ownershipConfirmation",
            field_name: "ownershipConfirmation",
            field_type: "checkbox",
            placeholder_key: "ownershipConfirmationPlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "fullName",
            field_name: "fullName",
            field_type: "text",
            placeholder_key: "fullNamePlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "email",
            field_name: "email",
            field_type: "email",
            placeholder_key: "emailPlaceholder",
            required: true,
            field_order: 3
          },
          {
            id: "phone",
            field_name: "phone",
            field_type: "tel",
            placeholder_key: "phonePlaceholder",
            required: true,
            field_order: 4
          }
        ]
      }
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
      {
        id: "instrumental-step-1",
        step_number: 1,
        title_key: "artisticDetailsStep",
        fields: [
          {
            id: "titleLanguage",
            field_name: "titleLanguage",
            field_type: "text",
            placeholder_key: "titleLanguagePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "instrumentalGenre",
            field_name: "instrumentalGenre",
            field_type: "text",
            placeholder_key: "instrumentalGenrePlaceholder",
            required: true,
            field_order: 2
          }
        ]
      },
      {
        id: "instrumental-step-2",
        step_number: 2,
        title_key: "visionStyleStep",
        fields: [
          {
            id: "moodAtmosphere",
            field_name: "moodAtmosphere",
            field_type: "text",
            placeholder_key: "moodAtmospherePlaceholder",
            required: true,
            field_order: 1
          }
        ]
      },
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
