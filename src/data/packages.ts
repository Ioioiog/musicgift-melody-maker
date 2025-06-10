import { Package, Addon } from '@/types';

export const packages: Package[] = [
  {
    id: "1",
    value: "plus",
    name_key: "plusPackage",
    tagline_key: "plusTagline",
    description_key: "plusDescription",
    price: 299,
    delivery_time_key: "plusDelivery",
    is_active: true,
    is_featured: true,
    tag_key: "newTag",
    includes: [
      { include_key: "plusInclude1", include_order: 1 },
      { include_key: "plusInclude2", include_order: 2 },
      { include_key: "plusInclude3", include_order: 3 }
    ],
    available_addons: ["rushDelivery", "extraRevision"],
    steps: [
      {
        id: "plus-step-1",
        step_number: 1,
        title_key: "plusStep1Title",
        fields: [
          {
            id: "recipientName",
            field_name: "recipientName",
            field_type: "text",
            label_key: "recipientName",
            placeholder_key: "plusRecipientNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "messageContent",
            field_name: "messageContent",
            field_type: "textarea",
            label_key: "specialRequestsLabel",
            placeholder_key: "plusMessageContentPlaceholder",
            required: true,
            field_order: 2
          }
        ]
      },
      {
        id: "plus-step-2",
        step_number: 2,
        title_key: "plusStep2Title",
        fields: [
          {
            id: "style",
            field_name: "style",
            field_type: "select",
            label_key: "musicStyle",
            required: true,
            field_order: 1,
            options: [
              { value: "happy", label_key: "plusStyleHappy" },
              { value: "romantic", label_key: "plusStyleRomantic" },
              { value: "energetic", label_key: "plusStyleEnergetic" }
            ]
          },
          {
            id: "addons",
            field_name: "addons",
            field_type: "checkbox-group",
            label_key: "addons",
            required: false,
            field_order: 2
          }
        ]
      }
    ]
  },
  {
    id: "2",
    value: "personal",
    name_key: "personalPackage",
    tagline_key: "personalTagline",
    description_key: "personalDescription",
    price: 499,
    delivery_time_key: "personalDelivery",
    is_active: true,
    is_featured: true,
    tag_key: "popularTag",
    includes: [
      { include_key: "personalInclude1", include_order: 1 },
      { include_key: "personalInclude2", include_order: 2 },
      { include_key: "personalInclude3", include_order: 3 },
      { include_key: "personalInclude4", include_order: 4 }
    ],
    available_addons: ["rushDelivery", "extraRevision", "extendedLicense", "sourceFiles", "socialMediaRights", "customVideo"],
    steps: [
      {
        id: "personal-step-1",
        step_number: 1,
        title_key: "generalDetails",
        fields: [
          {
            id: "recipientName",
            field_name: "recipientName",
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
            id: "occasion",
            field_name: "occasion",
            field_type: "select",
            label_key: "occasionLabel",
            placeholder_key: "occasionPlaceholder",
            required: true,
            field_order: 3,
            options: [
              { value: "birthday", label_key: "birthdayOccasion" },
              { value: "anniversary", label_key: "anniversaryOccasion" },
              { value: "valentine", label_key: "valentineOccasion" },
              { value: "graduation", label_key: "graduationOccasion" },
              { value: "wedding", label_key: "weddingOccasion" },
              { value: "other", label_key: "otherOccasion" }
            ]
          },
          {
            id: "recipientNamePronunciation",
            field_name: "recipientNamePronunciation", 
            field_type: "audio",
            label_key: "pronunciationAudioLabel",
            placeholder_key: "pronunciationAudioPlaceholder",
            required: false,
            field_order: 4
          }
        ]
      },
      {
        id: "personal-step-2",
        step_number: 2,
        title_key: "storyAndEmotionalDetails",
        fields: [
          {
            id: "relationship",
            field_name: "relationship",
            field_type: "text",
            label_key: "relationshipLabel",
            placeholder_key: "relationshipPlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "story",
            field_name: "story",
            field_type: "textarea",
            label_key: "storyDetailedLabel",
            placeholder_key: "storyDetailedPlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "specialWords",
            field_name: "specialWords",
            field_type: "textarea",
            label_key: "keywordsLabel",
            placeholder_key: "keywordsPlaceholder",
            required: false,
            field_order: 3
          }
        ]
      },
      {
        id: "personal-step-3",
        step_number: 3,
        title_key: "musicalPreferences",
        fields: [
          {
            id: "voiceGender",
            field_name: "voiceGender",
            field_type: "select",
            label_key: "voiceGenderLabel",
            placeholder_key: "voiceGenderPlaceholder",
            required: true,
            field_order: 1,
            options: [
              { value: "female", label_key: "voiceFeminine" },
              { value: "male", label_key: "voiceMasculine" },
              { value: "duet", label_key: "voiceDuet" },
              { value: "musicgift_choice", label_key: "voiceMusicGiftChoice" }
            ]
          },
          {
            id: "songLanguage",
            field_name: "songLanguage",
            field_type: "select",
            label_key: "songLanguageLabel",
            placeholder_key: "songLanguagePlaceholder",
            required: true,
            field_order: 2,
            options: [
              { value: "romanian", label_key: "romanianLanguage" },
              { value: "english", label_key: "englishLanguage" },
              { value: "french", label_key: "frenchLanguage" },
              { value: "italian", label_key: "italianLanguage" }
            ]
          },
          {
            id: "mood",
            field_name: "mood",
            field_type: "select",
            label_key: "moodLabel",
            placeholder_key: "moodPlaceholder",
            required: true,
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
            id: "styleReference",
            field_name: "styleReference",
            field_type: "text",
            label_key: "styleReferenceLabel",
            placeholder_key: "styleReferencePlaceholder",
            required: false,
            field_order: 4
          },
          {
            id: "youtubeExample",
            field_name: "youtubeExample",
            field_type: "url",
            label_key: "youtubeExampleLabel",
            placeholder_key: "youtubeExamplePlaceholder",
            required: false,
            field_order: 5
          },
          {
            id: "addons",
            field_name: "addons",
            field_type: "checkbox-group",
            label_key: "addons",
            required: false,
            field_order: 6
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
            required: false,
            field_order: 3
          },
          {
            id: "invoiceType",
            field_name: "invoiceType",
            field_type: "select",
            label_key: "invoiceType",
            required: true,
            field_order: 4,
            options: [
              { value: "individual", label_key: "individual" },
              { value: "company", label_key: "company" }
            ]
          },
          {
            id: "companyName",
            field_name: "companyName",
            field_type: "text",
            label_key: "companyName",
            required: true,
            field_order: 5
          },
          {
            id: "vatCode",
            field_name: "vatCode",
            field_type: "text",
            label_key: "vatCodeLabel",
            placeholder_key: "vatCodePlaceholder",
            required: true,
            field_order: 6
          }
        ]
      }
    ]
  },
  {
    id: "3",
    value: "premium",
    name_key: "premiumPackage",
    tagline_key: "premiumTagline",
    description_key: "premiumDescription",
    price: 999,
    delivery_time_key: "premiumDelivery",
    is_active: true,
    is_featured: true,
    tag_key: "premiumTag",
    includes: [
      { include_key: "premiumInclude1", include_order: 1 },
      { include_key: "premiumInclude2", include_order: 2 },
      { include_key: "premiumInclude3", include_order: 3 }
    ],
    available_addons: ["rushDelivery", "extraRevision", "extendedLicense", "sourceFiles", "customVideo"],
    steps: [
      {
        id: "premium-step-1",
        step_number: 1,
        title_key: "generalDetails",
        fields: [
          {
            id: "recipientName",
            field_name: "recipientName",
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
            id: "occasion",
            field_name: "occasion",
            field_type: "select",
            label_key: "occasionLabel",
            placeholder_key: "occasionPlaceholder",
            required: true,
            field_order: 3,
            options: [
              { value: "birthday", label_key: "birthdayOccasion" },
              { value: "anniversary", label_key: "anniversaryOccasion" },
              { value: "valentine", label_key: "valentineOccasion" },
              { value: "graduation", label_key: "graduationOccasion" },
              { value: "wedding", label_key: "weddingOccasion" },
              { value: "other", label_key: "otherOccasion" }
            ]
          },
          {
            id: "recipientNamePronunciation",
            field_name: "recipientNamePronunciation",
            field_type: "audio", 
            label_key: "pronunciationAudioLabel",
            placeholder_key: "pronunciationAudioPlaceholder",
            required: false,
            field_order: 4
          }
        ]
      },
      {
        id: "premium-step-2",
        step_number: 2,
        title_key: "storyAndEmotionalDetails",
        fields: [
          {
            id: "relationship",
            field_name: "relationship",
            field_type: "text",
            label_key: "relationshipLabel",
            placeholder_key: "relationshipPlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "story",
            field_name: "story",
            field_type: "textarea",
            label_key: "storyDetailedLabel",
            placeholder_key: "storyDetailedPlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "specialWords",
            field_name: "specialWords",
            field_type: "textarea",
            label_key: "keywordsLabel",
            placeholder_key: "keywordsPlaceholder",
            required: false,
            field_order: 3
          },
          {
            id: "dedicationMessage",
            field_name: "dedicationMessage",
            field_type: "textarea",
            label_key: "dedicationMessageLabel",
            placeholder_key: "dedicationMessagePlaceholder",
            required: false,
            field_order: 4
          }
        ]
      },
      {
        id: "premium-step-3",
        step_number: 3,
        title_key: "musicalPreferences",
        fields: [
          {
            id: "voiceGender",
            field_name: "voiceGender",
            field_type: "select",
            label_key: "voiceGenderLabel",
            placeholder_key: "voiceGenderPlaceholder",
            required: true,
            field_order: 1,
            options: [
              { value: "female", label_key: "voiceFeminine" },
              { value: "male", label_key: "voiceMasculine" },
              { value: "duet", label_key: "voiceDuet" },
              { value: "musicgift_choice", label_key: "voiceMusicGiftChoice" }
            ]
          },
          {
            id: "songLanguage",
            field_name: "songLanguage",
            field_type: "select",
            label_key: "songLanguageLabel",
            placeholder_key: "songLanguagePlaceholder",
            required: true,
            field_order: 2,
            options: [
              { value: "romanian", label_key: "romanianLanguage" },
              { value: "english", label_key: "englishLanguage" },
              { value: "french", label_key: "frenchLanguage" },
              { value: "italian", label_key: "italianLanguage" }
            ]
          },
          {
            id: "mood",
            field_name: "mood",
            field_type: "select",
            label_key: "moodLabel",
            placeholder_key: "moodPlaceholder",
            required: true,
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
            id: "styleReference",
            field_name: "styleReference",
            field_type: "text",
            label_key: "styleReferenceLabel",
            placeholder_key: "styleReferencePlaceholder",
            required: false,
            field_order: 4
          },
          {
            id: "youtubeExample",
            field_name: "youtubeExample",
            field_type: "url",
            label_key: "youtubeExampleLabel",
            placeholder_key: "youtubeExamplePlaceholder",
            required: false,
            field_order: 5
          },
          {
            id: "addons",
            field_name: "addons",
            field_type: "checkbox-group",
            label_key: "addons",
            required: false,
            field_order: 6
          }
        ]
      },
      {
        id: "premium-step-4",
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
            required: false,
            field_order: 3
          },
          {
            id: "invoiceType",
            field_name: "invoiceType",
            field_type: "select",
            label_key: "invoiceType",
            required: true,
            field_order: 4,
            options: [
              { value: "individual", label_key: "individual" },
              { value: "company", label_key: "company" }
            ]
          },
          {
            id: "companyName",
            field_name: "companyName",
            field_type: "text",
            label_key: "companyName",
            required: true,
            field_order: 5
          },
          {
            id: "vatCode",
            field_name: "vatCode",
            field_type: "text",
            label_key: "vatCodeLabel",
            placeholder_key: "vatCodePlaceholder",
            required: true,
            field_order: 6
          }
        ]
      }
    ]
  },
  {
    id: "4",
    value: "business",
    name_key: "businessPackage",
    tagline_key: "businessTagline",
    description_key: "businessDescription",
    price: 1499,
    delivery_time_key: "businessDelivery",
    is_active: true,
    is_featured: false,
    tag_key: "",
    includes: [
      { include_key: "businessInclude1", include_order: 1 },
      { include_key: "businessInclude2", include_order: 2 },
      { include_key: "businessInclude3", include_order: 3 },
      { include_key: "businessInclude4", include_order: 4 },
      { include_key: "businessInclude5", include_order: 5 }
    ],
    available_addons: ["extraRevision", "extendedLicense", "sourceFiles", "brandedAudioMessage", "commercialRightsUpgrade"],
    steps: [
      {
        id: "business-step-1",
        step_number: 1,
        title_key: "businessStep1Title",
        fields: [
          {
            id: "companyName",
            field_name: "companyName",
            field_type: "text",
            label_key: "companyName",
            placeholder_key: "businessCompanyNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "industry",
            field_name: "industry",
            field_type: "text",
            label_key: "industry",
            placeholder_key: "businessIndustryPlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "brandValues",
            field_name: "brandValues",
            field_type: "textarea",
            label_key: "brandValues",
            placeholder_key: "businessBrandValuesPlaceholder",
            required: true,
            field_order: 3
          }
        ]
      },
      {
        id: "business-step-2",
        step_number: 2,
        title_key: "businessStep2Title",
        fields: [
          {
            id: "purpose",
            field_name: "purpose",
            field_type: "select",
            label_key: "purpose",
            required: true,
            field_order: 1,
            options: [
              { value: "branding", label_key: "businessPurposeBranding" },
              { value: "advertising", label_key: "businessPurposeAdvertising" },
              { value: "event", label_key: "businessPurposeEvent" },
              { value: "product_launch", label_key: "businessPurposeProductLaunch" }
            ]
          },
          {
            id: "targetAudience",
            field_name: "targetAudience",
            field_type: "textarea",
            label_key: "targetAudience",
            placeholder_key: "businessTargetAudiencePlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "message",
            field_name: "message",
            field_type: "textarea",
            label_key: "message",
            placeholder_key: "businessMessagePlaceholder",
            required: true,
            field_order: 3
          }
        ]
      },
      {
        id: "business-step-3",
        step_number: 3,
        title_key: "businessStep3Title",
        fields: [
          {
            id: "voicePreference",
            field_name: "voicePreference",
            field_type: "select",
            label_key: "voiceGenderLabel",
            required: true,
            field_order: 1,
            options: [
              { value: "female", label_key: "voiceFemale" },
              { value: "male", label_key: "voiceMale" },
              { value: "both", label_key: "businessVoiceBoth" }
            ]
          },
          {
            id: "usage",
            field_name: "usage",
            field_type: "select",
            label_key: "usage",
            required: true,
            field_order: 2,
            options: [
              { value: "social_media", label_key: "businessUsageSocialMedia" },
              { value: "tv_radio", label_key: "businessUsageTvRadio" },
              { value: "online_ads", label_key: "businessUsageOnlineAds" },
              { value: "events", label_key: "businessUsageEvents" }
            ]
          },
          {
            id: "contactName",
            field_name: "contactName",
            field_type: "text",
            label_key: "contactName",
            placeholder_key: "businessContactNamePlaceholder",
            required: true,
            field_order: 3
          },
          {
            id: "email",
            field_name: "email",
            field_type: "email",
            label_key: "emailLabel",
            placeholder_key: "emailPlaceholder",
            required: true,
            field_order: 4
          },
          {
            id: "acceptTerms",
            field_name: "acceptTerms",
            field_type: "checkbox",
            placeholder_key: "businessAcceptTermsPlaceholder",
            required: true,
            field_order: 5
          },
          {
            id: "addons",
            field_name: "addons",
            field_type: "checkbox-group",
            label_key: "addons",
            required: false,
            field_order: 6
          }
        ]
      }
    ]
  },
  {
    id: "5",
    value: "artist",
    name_key: "artistPackage",
    tagline_key: "artistTagline",
    description_key: "artistDescription",
    price: 1999,
    delivery_time_key: "artistDelivery",
    is_active: true,
    is_featured: false,
    tag_key: "",
    includes: [
      { include_key: "artistInclude1", include_order: 1 },
      { include_key: "artistInclude2", include_order: 2 },
      { include_key: "artistInclude3", include_order: 3 },
      { include_key: "artistInclude4", include_order: 4 }
    ],
    available_addons: ["extraRevision", "sourceFiles", "customVideo"],
    steps: [
      {
        id: "artist-step-1",
        step_number: 1,
        title_key: "artistStep1Title",
        fields: [
          {
            id: "stageName",
            field_name: "stageName",
            field_type: "text",
            label_key: "stageName",
            placeholder_key: "artistStageNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "genre",
            field_name: "genre",
            field_type: "text",
            label_key: "genre",
            placeholder_key: "artistGenrePlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "experience",
            field_name: "experience",
            field_type: "select",
            label_key: "experience",
            required: true,
            field_order: 3,
            options: [
              { value: "beginner", label_key: "artistExperienceBeginner" },
              { value: "intermediate", label_key: "artistExperienceIntermediate" },
              { value: "professional", label_key: "artistExperienceProfessional" }
            ]
          }
        ]
      },
      {
        id: "artist-step-2",
        step_number: 2,
        title_key: "artistStep2Title",
        fields: [
          {
            id: "songConcept",
            field_name: "songConcept",
            field_type: "textarea",
            label_key: "songConcept",
            placeholder_key: "artistSongConceptPlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "targetAudience",
            field_name: "targetAudience",
            field_type: "textarea",
            label_key: "targetAudience",
            placeholder_key: "artistTargetAudiencePlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "inspiration",
            field_name: "inspiration",
            field_type: "textarea",
            label_key: "inspiration",
            placeholder_key: "artistInspirationPlaceholder",
            required: false,
            field_order: 3
          }
        ]
      },
      {
        id: "artist-step-3",
        step_number: 3,
        title_key: "artistStep3Title",
        fields: [
          {
            id: "voicePreference",
            field_name: "voicePreference",
            field_type: "select",
            label_key: "voicePreference",
            required: true,
            field_order: 1,
            options: [
              { value: "own_vocals", label_key: "artistVoiceOwnVocals" },
              { value: "session_singer", label_key: "artistVoiceSessionSinger" }
            ]
          },
          {
            id: "distributionPlatform",
            field_name: "distributionPlatform",
            field_type: "select",
            label_key: "distributionPlatform",
            required: true,
            field_order: 2,
            options: [
              { value: "spotify", label_key: "artistPlatformSpotify" },
              { value: "apple_music", label_key: "artistPlatformAppleMusic" },
              { value: "youtube_music", label_key: "artistPlatformYouTubeMusic" },
              { value: "all_platforms", label_key: "artistPlatformAllPlatforms" }
            ]
          },
          {
            id: "email",
            field_name: "email",
            field_type: "email",
            label_key: "emailLabel",
            placeholder_key: "emailPlaceholder",
            required: true,
            field_order: 3
          },
          {
            id: "acceptCollaboration",
            field_name: "acceptCollaboration",
            field_type: "checkbox",
            placeholder_key: "artistAcceptCollaborationPlaceholder",
            required: true,
            field_order: 4
          },
          {
            id: "addons",
            field_name: "addons",
            field_type: "checkbox-group",
            label_key: "addons",
            required: false,
            field_order: 5
          }
        ]
      }
    ]
  },
  {
    id: "6",
    value: "remix",
    name_key: "remixPackage",
    tagline_key: "remixTagline",
    description_key: "remixDescription",
    price: 699,
    delivery_time_key: "remixDelivery",
    is_active: true,
    is_featured: false,
    tag_key: "",
    includes: [
      { include_key: "remixInclude1", include_order: 1 },
      { include_key: "remixInclude2", include_order: 2 },
      { include_key: "remixInclude3", include_order: 3 },
      { include_key: "remixInclude4", include_order: 4 },
      { include_key: "remixInclude5", include_order: 5 },
      { include_key: "remixInclude6", include_order: 6 }
    ],
    available_addons: ["extraRevision", "sourceFiles", "separatedStems"],
    steps: [
      {
        id: "remix-step-1",
        step_number: 1,
        title_key: "remixStep1Title",
        fields: [
          {
            id: "originalSong",
            field_name: "originalSong",
            field_type: "file",
            label_key: "originalSong",
            placeholder_key: "remixOriginalSongPlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "songTitle",
            field_name: "songTitle",
            field_type: "text",
            label_key: "songTitle",
            placeholder_key: "remixSongTitlePlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "originalArtist",
            field_name: "originalArtist",
            field_type: "text",
            label_key: "originalArtist",
            placeholder_key: "remixOriginalArtistPlaceholder",
            required: true,
            field_order: 3
          }
        ]
      },
      {
        id: "remix-step-2",
        step_number: 2,
        title_key: "remixStep2Title",
        fields: [
          {
            id: "targetGenre",
            field_name: "targetGenre",
            field_type: "text",
            label_key: "targetGenre",
            placeholder_key: "remixTargetGenrePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "energy",
            field_name: "energy",
            field_type: "select",
            label_key: "energy",
            required: true,
            field_order: 2,
            options: [
              { value: "low", label_key: "remixEnergyLow" },
              { value: "medium", label_key: "remixEnergyMedium" },
              { value: "high", label_key: "remixEnergyHigh" }
            ]
          },
          {
            id: "referenceTracks",
            field_name: "referenceTracks",
            field_type: "textarea",
            label_key: "referenceTracks",
            placeholder_key: "remixReferenceTracksPlaceholder",
            required: false,
            field_order: 3
          }
        ]
      },
      {
        id: "remix-step-3",
        step_number: 3,
        title_key: "remixStep3Title",
        fields: [
          {
            id: "vocalsPreference",
            field_name: "vocalsPreference",
            field_type: "select",
            label_key: "vocalsPreference",
            required: true,
            field_order: 1,
            options: [
              { value: "keep_original", label_key: "remixVocalsKeepOriginal" },
              { value: "pitch_shift", label_key: "remixVocalsPitchShift" },
              { value: "time_stretch", label_key: "remixVocalsTimeStretch" }
            ]
          },
          {
            id: "specialRequests",
            field_name: "specialRequests",
            field_type: "textarea",
            label_key: "specialRequests",
            placeholder_key: "remixSpecialRequestsPlaceholder",
            required: false,
            field_order: 2
          },
          {
            id: "email",
            field_name: "email",
            field_type: "email",
            label_key: "emailLabel",
            placeholder_key: "emailPlaceholder",
            required: true,
            field_order: 3
          },
          {
            id: "rightsConfirmation",
            field_name: "rightsConfirmation",
            field_type: "checkbox",
            placeholder_key: "remixRightsConfirmationPlaceholder",
            required: true,
            field_order: 4
          },
          {
            id: "addons",
            field_name: "addons",
            field_type: "checkbox-group",
            label_key: "addons",
            required: false,
            field_order: 5
          }
        ]
      }
    ]
  },
  {
    id: "7",
    value: "instrumental",
    name_key: "instrumentalPackage",
    tagline_key: "instrumentalTagline",
    description_key: "instrumentalDescription",
    price: 599,
    delivery_time_key: "instrumentalDelivery",
    is_active: true,
    is_featured: false,
    tag_key: "",
    includes: [
      { include_key: "instrumentalInclude1", include_order: 1 },
      { include_key: "instrumentalInclude2", include_order: 2 },
      { include_key: "instrumentalInclude3", include_order: 3 },
      { include_key: "instrumentalInclude4", include_order: 4 },
      { include_key: "instrumentalInclude5", include_order: 5 }
    ],
    available_addons: ["extraRevision", "extendedLicense", "sourceFiles"],
    steps: [
      {
        id: "instrumental-step-1",
        step_number: 1,
        title_key: "instrumentalStep1Title",
        fields: [
          {
            id: "genre",
            field_name: "genre",
            field_type: "text",
            label_key: "genre",
            placeholder_key: "instrumentalGenrePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "tempo",
            field_name: "tempo",
            field_type: "select",
            label_key: "tempo",
            required: true,
            field_order: 2,
            options: [
              { value: "slow", label_key: "instrumentalTempoSlow" },
              { value: "medium", label_key: "instrumentalTempoMedium" },
              { value: "fast", label_key: "instrumentalTempoFast" }
            ]
          },
          {
            id: "mood",
            field_name: "mood",
            field_type: "text",
            label_key: "mood",
            placeholder_key: "instrumentalMoodPlaceholder",
            required: true,
            field_order: 3
          }
        ]
      },
      {
        id: "instrumental-step-2",
        step_number: 2,
        title_key: "instrumentalStep2Title",
        fields: [
          {
            id: "structure",
            field_name: "structure",
            field_type: "select",
            label_key: "structure",
            required: true,
            field_order: 1,
            options: [
              { value: "standard", label_key: "instrumentalStructureStandard" },
              { value: "extended", label_key: "instrumentalStructureExtended" },
              { value: "custom", label_key: "instrumentalStructureCustom" }
            ]
          },
          {
            id: "keySignature",
            field_name: "keySignature",
            field_type: "text",
            label_key: "keySignature",
            placeholder_key: "instrumentalKeySignaturePlaceholder",
            required: false,
            field_order: 2
          }
        ]
      },
      {
        id: "instrumental-step-3",
        step_number: 3,
        title_key: "instrumentalStep3Title",
        fields: [
          {
            id: "usage",
            field_name: "usage",
            field_type: "select",
            label_key: "usage",
            required: true,
            field_order: 1,
            options: [
              { value: "personal", label_key: "instrumentalUsagePersonal" },
              { value: "commercial", label_key: "instrumentalUsageCommercial" },
              { value: "youtube", label_key: "instrumentalUsageYouTube" }
            ]
          },
          {
            id: "referenceSongs",
            field_name: "referenceSongs",
            field_type: "textarea",
            label_key: "referenceSongs",
            placeholder_key: "instrumentalReferenceSongsPlaceholder",
            required: false,
            field_order: 2
          },
          {
            id: "email",
            field_name: "email",
            field_type: "email",
            label_key: "emailLabel",
            placeholder_key: "emailPlaceholder",
            required: true,
            field_order: 3
          },
          {
            id: "acceptLicense",
            field_name: "acceptLicense",
            field_type: "checkbox",
            placeholder_key: "instrumentalAcceptLicensePlaceholder",
            required: true,
            field_order: 4
          },
          {
            id: "addons",
            field_name: "addons",
            field_type: "checkbox-group",
            label_key: "addons",
            required: false,
            field_order: 5
          }
        ]
      }
    ]
  },
  {
    id: "8",
    value: "gift",
    name_key: "giftPackage",
    tagline_key: "giftTagline",
    description_key: "giftDescription",
    price: 299,
    delivery_time_key: "giftDelivery",
    is_active: true,
    is_featured: false,
    tag_key: "giftTag",
    includes: [
      { include_key: "giftInclude1", include_order: 1 },
      { include_key: "giftInclude2", include_order: 2 },
      { include_key: "giftInclude3", include_order: 3 }
    ],
    available_addons: [],
    steps: [
      {
        id: "gift-step-1",
        step_number: 1,
        title_key: "giftStep1Title",
        fields: [
          {
            id: "giftAmount",
            field_name: "giftAmount",
            field_type: "select",
            label_key: "giftAmount",
            required: true,
            field_order: 1,
            options: [
              { value: "299", label_key: "gift299RON" },
              { value: "500", label_key: "gift500RON" },
              { value: "custom", label_key: "giftCustomAmount" }
            ]
          },
          {
            id: "customAmount",
            field_name: "customAmount",
            field_type: "text",
            label_key: "customAmount",
            required: false,
            field_order: 2
          }
        ]
      },
      {
        id: "gift-step-2",
        step_number: 2,
        title_key: "giftStep2Title",
        fields: [
          {
            id: "senderName",
            field_name: "senderName",
            field_type: "text",
            label_key: "senderName",
            placeholder_key: "giftSenderNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "recipientName",
            field_name: "recipientName",
            field_type: "text",
            label_key: "recipientName",
            placeholder_key: "giftRecipientNamePlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "recipientEmail",
            field_name: "recipientEmail",
            field_type: "email",
            label_key: "recipientEmail",
            placeholder_key: "giftRecipientEmailPlaceholder",
            required: true,
            field_order: 3
          },
          {
            id: "giftMessage",
            field_name: "giftMessage",
            field_type: "textarea",
            label_key: "giftMessage",
            placeholder_key: "giftMessagePlaceholder",
            required: false,
            field_order: 4
          },
          {
            id: "senderEmail",
            field_name: "senderEmail",
            field_type: "email",
            label_key: "emailLabel",
            placeholder_key: "emailPlaceholder",
            required: true,
            field_order: 5
          }
        ]
      }
    ]
  },
  {
    id: "9",
    value: "wedding",
    name_key: "weddingPackage",
    tagline_key: "weddingTagline",
    description_key: "weddingDescription",
    price: 999,
    delivery_time_key: "weddingDelivery",
    is_active: true,
    is_featured: false,
    tag_key: "",
    includes: [
      { include_key: "weddingInclude1", include_order: 1 },
      { include_key: "weddingInclude2", include_order: 2 },
      { include_key: "weddingInclude3", include_order: 3 },
      { include_key: "weddingInclude4", include_order: 4 },
      { include_key: "weddingInclude5", include_order: 5 },
      { include_key: "weddingInclude6", include_order: 6 },
      { include_key: "weddingInclude7", include_order: 7 },
      { include_key: "weddingInclude8", include_order: 8 }
    ],
    available_addons: ["extraRevision", "sourceFiles", "customVideo", "godparentsmelody"],
    steps: [
      {
        id: "wedding-step-1",
        step_number: 1,
        title_key: "weddingStep1Title",
        fields: [
          {
            id: "coupleNames",
            field_name: "coupleNames",
            field_type: "text",
            label_key: "coupleNames",
            placeholder_key: "weddingCoupleNamesPlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "coupleType",
            field_name: "coupleType",
            field_type: "select",
            label_key: "coupleType",
            required: true,
            field_order: 2,
            options: [
              { value: "bride_groom", label_key: "weddingBrideGroom" },
              { value: "godparents", label_key: "weddingGodparents" }
            ]
          },
          {
            id: "eventDate",
            field_name: "eventDate",
            field_type: "date",
            label_key: "eventDate",
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
            id: "howMet",
            field_name: "howMet",
            field_type: "textarea",
            label_key: "howMet",
            placeholder_key: "weddingHowMetPlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "loveStory",
            field_name: "loveStory",
            field_type: "textarea",
            label_key: "loveStory",
            placeholder_key: "weddingLoveStoryPlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "atmosphere",
            field_name: "atmosphere",
            field_type: "select",
            label_key: "atmosphere",
            required: true,
            field_order: 3,
            options: [
              { value: "romantic", label_key: "weddingAtmosphereRomantic" },
              { value: "emotional", label_key: "weddingAtmosphereEmotional" },
              { value: "elegant", label_key: "weddingAtmosphereElegant" }
            ]
          },
          {
            id: "musicalStyle",
            field_name: "musicalStyle",
            field_type: "text",
            label_key: "musicalStyle",
            placeholder_key: "weddingMusicalStylePlaceholder",
            required: false,
            field_order: 4
          },
          {
            id: "email",
            field_name: "email",
            field_type: "email",
            label_key: "emailLabel",
            placeholder_key: "emailPlaceholder",
            required: true,
            field_order: 5
          },
          {
            id: "addons",
            field_name: "addons",
            field_type: "checkbox-group",
            label_key: "addons",
            required: false,
            field_order: 6
          }
        ]
      }
    ]
  },
  {
    id: "10",
    value: "baptism",
    name_key: "baptismPackage",
    tagline_key: "baptismTagline",
    description_key: "baptismDescription",
    price: 699,
    delivery_time_key: "baptismDelivery",
    is_active: true,
    is_featured: false,
    tag_key: "",
    includes: [
      { include_key: "baptismInclude1", include_order: 1 },
      { include_key: "baptismInclude2", include_order: 2 },
      { include_key: "baptismInclude3", include_order: 3 },
      { include_key: "baptismInclude4", include_order: 4 },
      { include_key: "baptismInclude5", include_order: 5 },
      { include_key: "baptismInclude6", include_order: 6 }
    ],
    available_addons: ["extraRevision", "sourceFiles", "customVideo", "godparentsSpecialMelody"],
    steps: [
      {
        id: "baptism-step-1",
        step_number: 1,
        title_key: "baptismStep1Title",
        fields: [
          {
            id: "childName",
            field_name: "childName",
            field_type: "text",
            label_key: "childName",
            placeholder_key: "baptismChildNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "nameMeaning",
            field_name: "nameMeaning",
            field_type: "text",
            label_key: "nameMeaning",
            placeholder_key: "baptismNameMeaningPlaceholder",
            required: false,
            field_order: 2
          },
          {
            id: "birthStory",
            field_name: "birthStory",
            field_type: "textarea",
            label_key: "birthStory",
            placeholder_key: "baptismBirthStoryPlaceholder",
            required: true,
            field_order: 3
          },
          {
            id: "eventDate",
            field_name: "eventDate",
            field_type: "date",
            label_key: "eventDate",
            required: true,
            field_order: 4
          }
        ]
      },
      {
        id: "baptism-step-2",
        step_number: 2,
        title_key: "baptismStep2Title",
        fields: [
          {
            id: "atmosphere",
            field_name: "atmosphere",
            field_type: "select",
            label_key: "atmosphere",
            required: true,
            field_order: 1,
            options: [
              { value: "calm", label_key: "baptismAtmosphereCalm" },
              { value: "playful", label_key: "baptismAtmospherePlayful" },
              { value: "emotional", label_key: "baptismAtmosphereEmotional" }
            ]
          },
          {
            id: "style",
            field_name: "style",
            field_type: "select",
            label_key: "style",
            required: true,
            field_order: 2,
            options: [
              { value: "ballad", label_key: "baptismStyleBallad" },
              { value: "lullaby", label_key: "baptismStyleLullaby" },
              { value: "acoustic_pop", label_key: "baptismStyleAcousticPop" }
            ]
          },
          {
            id: "voiceGender",
            field_name: "voiceGender",
            field_type: "select",
            label_key: "voiceGenderLabel",
            required: true,
            field_order: 3,
            options: [
              { value: "female", label_key: "voiceFemale" },
              { value: "male", label_key: "voiceMale" }
            ]
          },
          {
            id: "email",
            field_name: "email",
            field_type: "email",
            label_key: "emailLabel",
            placeholder_key: "emailPlaceholder",
            required: true,
            field_order: 4
          },
          {
            id: "addons",
            field_name: "addons",
            field_type: "checkbox-group",
            label_key: "addons",
            required: false,
            field_order: 5
          }
        ]
      }
    ]
  },
  {
    id: "11",
    value: "comingOfAge",
    name_key: "comingOfAgePackage",
    tagline_key: "comingOfAgeTagline",
    description_key: "comingOfAgeDescription",
    price: 799,
    delivery_time_key: "comingOfAgeDelivery",
    is_active: true,
    is_featured: false,
    tag_key: "",
    includes: [
      { include_key: "comingOfAgeInclude1", include_order: 1 },
      { include_key: "comingOfAgeInclude2", include_order: 2 },
      { include_key: "comingOfAgeInclude3", include_order: 3 },
      { include_key: "comingOfAgeInclude4", include_order: 4 },
      { include_key: "comingOfAgeInclude5", include_order: 5 },
      { include_key: "comingOfAgeInclude6", include_order: 6 }
    ],
    available_addons: ["extraRevision", "sourceFiles", "customVideo", "personalizedAudioMessage"],
    steps: [
      {
        id: "comingOfAge-step-1",
        step_number: 1,
        title_key: "comingOfAgeStep1Title",
        fields: [
          {
            id: "celebrantName",
            field_name: "celebrantName",
            field_type: "text",
            label_key: "celebrantName",
            placeholder_key: "comingOfAgeCelebrantNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "hobbies",
            field_name: "hobbies",
            field_type: "textarea",
            label_key: "hobbies",
            placeholder_key: "comingOfAgeHobbiesPlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "personalMessage",
            field_name: "personalMessage",
            field_type: "textarea",
            label_key: "personalMessage",
            placeholder_key: "comingOfAgePersonalMessagePlaceholder",
            required: true,
            field_order: 3
          },
          {
            id: "eventDate",
            field_name: "eventDate",
            field_type: "date",
            label_key: "eventDate",
            required: true,
            field_order: 4
          }
        ]
      },
      {
        id: "comingOfAge-step-2",
        step_number: 2,
        title_key: "comingOfAgeStep2Title",
        fields: [
          {
            id: "style",
            field_name: "style",
            field_type: "select",
            label_key: "style",
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
            id: "vibe",
            field_name: "vibe",
            field_type: "select",
            label_key: "vibe",
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
            id: "favoriteArtists",
            field_name: "favoriteArtists",
            field_type: "text",
            label_key: "favoriteArtists",
            placeholder_key: "comingOfAgeFavoriteArtistsPlaceholder",
            required: false,
            field_order: 3
          },
          {
            id: "email",
            field_name: "email",
            field_type: "email",
            label_key: "emailLabel",
            placeholder_key: "emailPlaceholder",
            required: true,
            field_order: 4
          },
          {
            id: "addons",
            field_name: "addons",
            field_type: "checkbox-group",
            label_key: "addons",
            required: false,
            field_order: 5
          }
        ]
      }
    ]
  }
];

export const addOns: Addon[] = [
  {
    id: "1",
    addon_key: "rushDelivery",
    label_key: "rushDelivery",
    description_key: "rushDeliveryDesc",
    price: 199,
    is_active: true,
    trigger_field_type: null
  },
  {
    id: "2",
    addon_key: "extraRevision",
    label_key: "extraRevision",
    description_key: "extraRevisionDesc",
    price: 99,
    is_active: true,
    trigger_field_type: null
  },
  {
    id: "3",
    addon_key: "extendedLicense",
    label_key: "extendedLicense",
    description_key: "extendedLicenseDesc",
    price: 299,
    is_active: true,
    trigger_field_type: null
  },
  {
    id: "4",
    addon_key: "sourceFiles",
    label_key: "sourceFiles",
    description_key: "sourceFilesDesc",
    price: 199,
    is_active: true,
    trigger_field_type: null
  },
  {
    id: "5",
    addon_key: "socialMediaRights",
    label_key: "socialMediaRights",
    description_key: "socialMediaRightsDesc",
    price: 149,
    is_active: true,
    trigger_field_type: null
  },
  {
    id: "6",
    addon_key: "distributieMangoRecords",
    label_key: "distributieMangoRecords",
    description_key: "distributieMangoRecordsDesc",
    price: 299,
    is_active: true,
    trigger_field_type: null
  },
  {
    id: "7",
    addon_key: "customVideo",
    label_key: "customVideo",
    description_key: "customVideoDesc",
    price: 299,
    is_active: true,
    trigger_field_type: "file",
    trigger_field_config: {
      maxFiles: 10,
      maxTotalSizeMb: 150,
      allowedTypes: [".jpg", ".jpeg", ".png", ".mp4", ".mov"]
    }
  },
  {
    id: "8",
    addon_key: "audioMessageFromSender",
    label_key: "audioMessageFromSender",
    description_key: "audioMessageFromSenderDesc",
    price: 49,
    is_active: true,
    trigger_field_type: "audio-recorder",
    trigger_field_config: {
      maxDuration: 30
    }
  },
  {
    id: "9",
    addon_key: "brandedAudioMessage",
    label_key: "brandedAudioMessage",
    description_key: "brandedAudioMessageDesc",
    price: 99,
    is_active: true,
    trigger_field_type: "audio-recorder",
    trigger_field_config: {
      maxDuration: 15
    }
  },
  {
    id: "10",
    addon_key: "commercialRightsUpgrade",
    label_key: "commercialRightsUpgrade",
    description_key: "commercialRightsUpgradeDesc",
    price: 499,
    is_active: true,
    trigger_field_type: null
  },
  {
    id: "11",
    addon_key: "extendedSong",
    label_key: "extendedSong",
    description_key: "extendedSongDesc",
    price: 149,
    is_active: true,
    trigger_field_type: null
  },
  {
    id: "12",
    addon_key: "godparentsmelody",
    label_key: "godparentsmelody",
    description_key: "godparentsmelodyDesc",
    price: 399,
    is_active: true,
    trigger_field_type: null
  },
  {
    id: "13",
    addon_key: "separatedStems",
    label_key: "separatedStems",
    description_key: "separatedStemsDesc",
    price: 149,
    is_active: true,
    trigger_field_type: null
  },
  {
    id: "14",
    addon_key: "personalizedAudioMessage",
    label_key: "personalizedAudioMessage",
    description_key: "personalizedAudioMessageDesc",
    price: 49,
    is_active: true,
    trigger_field_type: "audio-recorder",
    trigger_field_config: {
      maxDuration: 30
    }
  },
  {
    id: "15",
    addon_key: "godparentsSpecialMelody",
    label_key: "godparentsSpecialMelody",
    description_key: "godparentsSpecialMelodyDesc",
    price: 399,
    is_active: true,
    trigger_field_type: null
  }
];
