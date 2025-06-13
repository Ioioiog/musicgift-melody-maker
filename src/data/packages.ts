import { Package, Addon } from '@/types';

// Define the packages with all properties
const packages: Package[] = [
  {
    value: 'plus',
    label_key: 'plusPackage',
    tagline_key: 'plusTagline',
    description_key: 'plusDescription',
    delivery_time_key: 'plusDelivery',
    price_eur: 99,
    price_ron: 499,
    includes: [
      { include_key: 'plusInclude1', include_order: 1 },
      { include_key: 'plusInclude2', include_order: 2 },
      { include_key: 'plusInclude3', include_order: 3 }
    ],
    steps: []
  },
  {
    value: 'personal',
    label_key: 'personalPackage',
    tagline_key: 'personalTagline',
    description_key: 'personalDescription',
    delivery_time_key: 'personalDelivery',
    price_eur: 249,
    price_ron: 1249,
    tag: 'popular',
    includes: [
      { include_key: 'personalInclude1', include_order: 1 },
      { include_key: 'personalInclude2', include_order: 2 },
      { include_key: 'personalInclude3', include_order: 3 },
      { include_key: 'personalInclude4', include_order: 4 }
    ],
    steps: []
  },
  {
    value: 'premium',
    label_key: 'premiumPackage',
    tagline_key: 'premiumTagline',
    description_key: 'premiumDescription',
    delivery_time_key: 'premiumDelivery',
    price_eur: 499,
    price_ron: 2499,
    tag: 'premium',
    includes: [
      { include_key: 'premiumInclude1', include_order: 1 },
      { include_key: 'premiumInclude2', include_order: 2 },
      { include_key: 'premiumInclude3', include_order: 3 }
    ],
    steps: []
  },
  {
    value: 'business',
    label_key: 'businessPackage',
    tagline_key: 'businessTagline',
    description_key: 'businessDescription',
    delivery_time_key: 'businessDelivery',
    price_eur: 999,
    price_ron: 4999,
    includes: [
      { include_key: 'businessInclude1', include_order: 1 },
      { include_key: 'businessInclude2', include_order: 2 },
      { include_key: 'businessInclude3', include_order: 3 },
      { include_key: 'businessInclude4', include_order: 4 },
      { include_key: 'businessInclude5', include_order: 5 }
    ],
    steps: []
  },
  {
    value: 'artist',
    label_key: 'artistPackage',
    tagline_key: 'artistTagline',
    description_key: 'artistDescription',
    delivery_time_key: 'artistDelivery',
    price_eur: 1499,
    price_ron: 7499,
    includes: [
      { include_key: 'artistInclude1', include_order: 1 },
      { include_key: 'artistInclude2', include_order: 2 },
      { include_key: 'artistInclude3', include_order: 3 },
      { include_key: 'artistInclude4', include_order: 4 }
    ],
    steps: []
  },
  {
    value: 'remix',
    label_key: 'remixPackage',
    tagline_key: 'remixTagline',
    description_key: 'remixDescription',
    delivery_time_key: 'remixDelivery',
    price_eur: 499,
    price_ron: 2499,
    includes: [
      { include_key: 'remixInclude1', include_order: 1 },
      { include_key: 'remixInclude2', include_order: 2 },
      { include_key: 'remixInclude3', include_order: 3 },
      { include_key: 'remixInclude4', include_order: 4 },
      { include_key: 'remixInclude5', include_order: 5 },
      { include_key: 'remixInclude6', include_order: 6 }
    ],
    steps: []
  },
  {
    value: 'instrumental',
    label_key: 'instrumentalPackage',
    tagline_key: 'instrumentalTagline',
    description_key: 'instrumentalDescription',
    delivery_time_key: 'instrumentalDelivery',
    price_eur: 499,
    price_ron: 2499,
    includes: [
      { include_key: 'instrumentalInclude1', include_order: 1 },
      { include_key: 'instrumentalInclude2', include_order: 2 },
      { include_key: 'instrumentalInclude3', include_order: 3 },
      { include_key: 'instrumentalInclude4', include_order: 4 },
      { include_key: 'instrumentalInclude5', include_order: 5 }
    ],
    steps: []
  },
  {
    value: 'gift',
    label_key: 'giftPackage',
    tagline_key: 'giftTagline',
    description_key: 'giftDescription',
    delivery_time_key: 'giftDelivery',
    price_eur: 59,
    price_ron: 299,
    tag: 'gift',
    includes: [
      { include_key: 'giftInclude1', include_order: 1 },
      { include_key: 'giftInclude2', include_order: 2 },
      { include_key: 'giftInclude3', include_order: 3 }
    ],
    steps: []
  },
  {
    value: 'wedding',
    label_key: 'weddingPackage',
    tagline_key: 'weddingTagline',
    description_key: 'weddingDescription',
    delivery_time_key: 'weddingDelivery',
    price_eur: 799,
    price_ron: 3999,
    includes: [
      { include_key: 'weddingInclude1', include_order: 1 },
      { include_key: 'weddingInclude2', include_order: 2 },
      { include_key: 'weddingInclude3', include_order: 3 },
      { include_key: 'weddingInclude4', include_order: 4 },
      { include_key: 'weddingInclude5', include_order: 5 },
      { include_key: 'weddingInclude6', include_order: 6 },
      { include_key: 'weddingInclude7', include_order: 7 },
      { include_key: 'weddingInclude8', include_order: 8 }
    ],
    steps: [
      {
        id: 'wedding-details',
        step_number: 1,
        title_key: 'weddingStep1Title',
        fields: [
          {
            id: 'couple_names',
            field_name: 'couple_names',
            field_type: 'text',
            placeholder_key: 'weddingCoupleNamesPlaceholder',
            required: true,
            field_order: 1
          },
          {
            id: 'couple_type',
            field_name: 'couple_type',
            field_type: 'select',
            placeholder_key: 'weddingCoupleTypePlaceholder',
            required: true,
            field_order: 2,
            options: [
              { value: 'bride_groom', label_key: 'weddingBrideGroom' },
              { value: 'godparents', label_key: 'weddingGodparents' }
            ]
          }
        ]
      },
      {
        id: 'wedding-story',
        step_number: 2,
        title_key: 'weddingStep2Title',
        fields: [
          {
            id: 'how_met',
            field_name: 'how_met',
            field_type: 'textarea',
            placeholder_key: 'weddingHowMetPlaceholder',
            required: true,
            field_order: 1
          },
          {
            id: 'love_story',
            field_name: 'love_story',
            field_type: 'textarea',
            placeholder_key: 'weddingLoveStoryPlaceholder',
            required: true,
            field_order: 2
          },
          {
            id: 'atmosphere',
            field_name: 'atmosphere',
            field_type: 'checkbox',
            placeholder_key: 'weddingAtmospherePlaceholder',
            required: false,
            field_order: 3,
            options: [
              { value: 'romantic', label_key: 'weddingAtmosphereRomantic' },
              { value: 'emotional', label_key: 'weddingAtmosphereEmotional' },
              { value: 'elegant', label_key: 'weddingAtmosphereElegant' }
            ]
          },
          {
            id: 'musical_style',
            field_name: 'musical_style',
            field_type: 'text',
            placeholder_key: 'weddingMusicalStylePlaceholder',
            required: false,
            field_order: 4
          }
        ]
      }
    ]
  },
  {
    value: 'baptism',
    label_key: 'baptismPackage',
    tagline_key: 'baptismTagline',
    description_key: 'baptismDescription',
    delivery_time_key: 'baptismDelivery',
    price_eur: 599,
    price_ron: 2999,
    includes: [
      { include_key: 'baptismInclude1', include_order: 1 },
      { include_key: 'baptismInclude2', include_order: 2 },
      { include_key: 'baptismInclude3', include_order: 3 },
      { include_key: 'baptismInclude4', include_order: 4 },
      { include_key: 'baptismInclude5', include_order: 5 },
      { include_key: 'baptismInclude6', include_order: 6 }
    ],
    steps: [
      {
        id: 'child-info',
        step_number: 1,
        title_key: 'baptismStep1Title',
        fields: [
          {
            id: 'child_name',
            field_name: 'child_name',
            field_type: 'text',
            placeholder_key: 'baptismChildNamePlaceholder',
            required: true,
            field_order: 1
          },
          {
            id: 'name_meaning',
            field_name: 'name_meaning',
            field_type: 'text',
            placeholder_key: 'baptismNameMeaningPlaceholder',
            required: false,
            field_order: 2
          },
          {
            id: 'birth_story',
            field_name: 'birth_story',
            field_type: 'textarea',
            placeholder_key: 'baptismBirthStoryPlaceholder',
            required: true,
            field_order: 3
          }
        ]
      },
      {
        id: 'musical-preferences',
        step_number: 2,
        title_key: 'baptismStep2Title',
        fields: [
          {
            id: 'atmosphere',
            field_name: 'atmosphere',
            field_type: 'checkbox',
            placeholder_key: 'baptismAtmospherePlaceholder',
            required: false,
            field_order: 1,
            options: [
              { value: 'calm', label_key: 'baptismAtmosphereCalm' },
              { value: 'playful', label_key: 'baptismAtmospherePlayful' },
              { value: 'emotional', label_key: 'baptismAtmosphereEmotional' }
            ]
          },
          {
            id: 'style',
            field_name: 'style',
            field_type: 'select',
            placeholder_key: 'baptismStylePlaceholder',
            required: false,
            field_order: 2,
            options: [
              { value: 'ballad', label_key: 'baptismStyleBallad' },
              { value: 'lullaby', label_key: 'baptismStyleLullaby' },
              { value: 'acoustic_pop', label_key: 'baptismStyleAcousticPop' }
            ]
          }
        ]
      }
    ]
  },
  {
    value: 'comingOfAge',
    label_key: 'comingOfAgePackage',
    tagline_key: 'comingOfAgeTagline',
    description_key: 'comingOfAgeDescription',
    delivery_time_key: 'comingOfAgeDelivery',
    price_eur: 799,
    price_ron: 3999,
    includes: [
      { include_key: 'comingOfAgeInclude1', include_order: 1 },
      { include_key: 'comingOfAgeInclude2', include_order: 2 },
      { include_key: 'comingOfAgeInclude3', include_order: 3 },
      { include_key: 'comingOfAgeInclude4', include_order: 4 },
      { include_key: 'comingOfAgeInclude5', include_order: 5 },
      { include_key: 'comingOfAgeInclude6', include_order: 6 }
    ],
    steps: [
      {
        id: 'celebrant-info',
        step_number: 1,
        title_key: 'comingOfAgeStep1Title',
        fields: [
          {
            id: 'celebrant_name',
            field_name: 'celebrant_name',
            field_type: 'text',
            placeholder_key: 'comingOfAgeCelebrantNamePlaceholder',
            required: true,
            field_order: 1
          },
          {
            id: 'hobbies',
            field_name: 'hobbies',
            field_type: 'textarea',
            placeholder_key: 'comingOfAgeHobbiesPlaceholder',
            required: true,
            field_order: 2
          },
          {
            id: 'personal_message',
            field_name: 'personal_message',
            field_type: 'textarea',
            placeholder_key: 'comingOfAgePersonalMessagePlaceholder',
            required: false,
            field_order: 3
          }
        ]
      },
      {
        id: 'musical-style',
        step_number: 2,
        title_key: 'comingOfAgeStep2Title',
        fields: [
          {
            id: 'style',
            field_name: 'style',
            field_type: 'checkbox',
            placeholder_key: 'comingOfAgeStylePlaceholder',
            required: false,
            field_order: 1,
            options: [
              { value: 'hip_hop', label_key: 'comingOfAgeStyleHipHop' },
              { value: 'pop', label_key: 'comingOfAgeStylePop' },
              { value: 'trap', label_key: 'comingOfAgeStyleTrap' },
              { value: 'lofi', label_key: 'comingOfAgeStyleLofi' }
            ]
          },
          {
            id: 'vibe',
            field_name: 'vibe',
            field_type: 'checkbox',
            placeholder_key: 'comingOfAgeVibePlaceholder',
            required: false,
            field_order: 2,
            options: [
              { value: 'emotional', label_key: 'comingOfAgeVibeEmotional' },
              { value: 'fun', label_key: 'comingOfAgeVibeFun' },
              { value: 'rebellious', label_key: 'comingOfAgeVibeRebellious' },
              { value: 'dreamy', label_key: 'comingOfAgeVibeDreamy' }
            ]
          },
          {
            id: 'favorite_artists',
            field_name: 'favorite_artists',
            field_type: 'text',
            placeholder_key: 'comingOfAgeFavoriteArtistsPlaceholder',
            required: false,
            field_order: 3
          }
        ]
      }
    ]
  },
  {
    value: 'dj',
    label_key: 'djPackage',
    tagline_key: 'djTagline',
    description_key: 'djDescription',
    delivery_time_key: 'djDelivery',
    price_eur: 899,
    price_ron: 4499,
    tag: 'exclusive',
    includes: [
      { include_key: 'djInclude1', include_order: 1 },
      { include_key: 'djInclude2', include_order: 2 },
      { include_key: 'djInclude3', include_order: 3 },
      { include_key: 'djInclude4', include_order: 4 },
      { include_key: 'djInclude5', include_order: 5 }
    ],
    steps: [
      {
        id: 'dj-identity',
        step_number: 1,
        title_key: 'djStepIdentity',
        fields: [
          {
            id: 'dj_name',
            field_name: 'dj_name',
            field_type: 'text',
            placeholder_key: 'enterDjName',
            required: true,
            field_order: 1
          },
          {
            id: 'identity_keywords',
            field_name: 'identity_keywords',
            field_type: 'textarea',
            placeholder_key: 'enterIdentityKeywords',
            required: true,
            field_order: 2
          },
          {
            id: 'public_persona',
            field_name: 'public_persona',
            field_type: 'textarea',
            placeholder_key: 'describePublicPersona',
            required: false,
            field_order: 3
          },
          {
            id: 'target_audience',
            field_name: 'target_audience',
            field_type: 'textarea',
            placeholder_key: 'describeTargetAudience',
            required: false,
            field_order: 4
          }
        ]
      },
      {
        id: 'dj-sound',
        step_number: 2,
        title_key: 'djStepSound',
        fields: [
          {
            id: 'music_style',
            field_name: 'music_style',
            field_type: 'select',
            required: true,
            field_order: 1,
            placeholder_key: 'selectMusicStyle',
            options: [
              { value: 'afro_house', label_key: 'afroHouse' },
              { value: 'edm', label_key: 'edm' },
              { value: 'dance', label_key: 'dance' },
              { value: 'future_rave', label_key: 'futureRave' },
              { value: 'techno', label_key: 'techno' }
            ]
          },
          {
            id: 'vocal_choice',
            field_name: 'vocal_choice',
            field_type: 'select',
            required: true,
            field_order: 2,
            placeholder_key: 'selectVocalChoice',
            options: [
              { value: 'female', label_key: 'voiceFemale' },
              { value: 'male', label_key: 'voiceMale' },
              { value: 'duet', label_key: 'duet' },
              { value: 'instrumental', label_key: 'instrumental' }
            ]
          },
          {
            id: 'sound_reference',
            field_name: 'sound_reference',
            field_type: 'text',
            placeholder_key: 'enterSoundReference',
            required: false,
            field_order: 3
          },
          {
            id: 'tempo_preference',
            field_name: 'tempo_preference',
            field_type: 'text',
            placeholder_key: 'enterTempoPreference',
            required: false,
            field_order: 4
          },
          {
            id: 'what_to_avoid',
            field_name: 'what_to_avoid',
            field_type: 'textarea',
            placeholder_key: 'enterWhatToAvoid',
            required: false,
            field_order: 5
          }
        ]
      },
      {
        id: 'dj-release',
        step_number: 3,
        title_key: 'djStepRelease',
        fields: [
          {
            id: 'cover_preferences',
            field_name: 'cover_preferences',
            field_type: 'textarea',
            placeholder_key: 'describeCoverPreferences',
            required: false,
            field_order: 1
          },
          {
            id: 'platforms',
            field_name: 'platforms',
            field_type: 'checkbox',
            required: false,
            field_order: 2,
            placeholder_key: 'selectPlatforms',
            options: [
              { value: 'spotify', label_key: 'spotify' },
              { value: 'apple_music', label_key: 'appleMusic' },
              { value: 'beatport', label_key: 'beatport' },
              { value: 'youtube', label_key: 'youtube' },
              { value: 'soundcloud', label_key: 'soundcloud' }
            ]
          },
          {
            id: 'release_plan',
            field_name: 'release_plan',
            field_type: 'textarea',
            placeholder_key: 'describeReleasePlan',
            required: false,
            field_order: 3
          },
          {
            id: 'social_links',
            field_name: 'social_links',
            field_type: 'textarea',
            placeholder_key: 'enterSocialLinks',
            required: false,
            field_order: 4
          }
        ]
      },
      {
        id: 'dj-final-notes',
        step_number: 4,
        title_key: 'djStepFinalNotes',
        fields: [
          {
            id: 'goals_with_song',
            field_name: 'goals_with_song',
            field_type: 'textarea',
            placeholder_key: 'describeGoalsWithSong',
            required: false,
            field_order: 1
          },
          {
            id: 'message_to_producer',
            field_name: 'message_to_producer',
            field_type: 'textarea',
            placeholder_key: 'enterMessageToProducer',
            required: false,
            field_order: 2
          },
          {
            id: 'heard_about_us',
            field_name: 'heard_about_us',
            field_type: 'select',
            required: false,
            field_order: 3,
            placeholder_key: 'selectHeardAboutUs',
            options: [
              { value: 'tiktok', label_key: 'tiktok' },
              { value: 'instagram', label_key: 'instagram' },
              { value: 'friend_recommendation', label_key: 'friendRecommendation' },
              { value: 'google_search', label_key: 'googleSearch' },
              { value: 'other', label_key: 'otherSource' }
            ]
          }
        ]
      }
    ]
  }
];

const addOns: Addon[] = [
  {
    value: 'rushDelivery',
    label_key: 'rushDelivery',
    description_key: 'rushDeliveryDesc',
    price_eur: 49,
    price_ron: 249
  },
  {
    value: 'extraRevision',
    label_key: 'extraRevision',
    description_key: 'extraRevisionDesc',
    price_eur: 29,
    price_ron: 149
  },
  {
    value: 'extendedLicense',
    label_key: 'extendedLicense',
    description_key: 'extendedLicenseDesc',
    price_eur: 199,
    price_ron: 999
  },
  {
    value: 'sourceFiles',
    label_key: 'sourceFiles',
    description_key: 'sourceFilesDesc',
    price_eur: 299,
    price_ron: 1499
  },
  {
    value: 'socialMediaRights',
    label_key: 'socialMediaRights',
    description_key: 'socialMediaRightsDesc',
    price_eur: 99,
    price_ron: 499
  },
  {
    value: 'mangoRecordsDistribution',
    label_key: 'mangoRecordsDistribution',
    description_key: 'mangoRecordsDistributionDesc',
    price_eur: 299,
    price_ron: 1499
  },
  {
    value: 'customVideo',
    label_key: 'customVideo',
    description_key: 'customVideoDesc',
    price_eur: 799,
    price_ron: 3999
  },
  {
    value: 'audioMessageFromSender',
    label_key: 'audioMessageFromSender',
    description_key: 'audioMessageFromSenderDesc',
    price_eur: 49,
    price_ron: 249
  },
  {
    value: 'brandedAudioMessage',
    label_key: 'brandedAudioMessage',
    description_key: 'brandedAudioMessageDesc',
    price_eur: 99,
    price_ron: 499
  },
  {
    value: 'commercialRightsUpgrade',
    label_key: 'commercialRightsUpgrade',
    description_key: 'commercialRightsUpgradeDesc',
    price_eur: 299,
    price_ron: 1499
  },
  {
    value: 'extendedSong',
    label_key: 'extendedSong',
    description_key: 'extendedSongDesc',
    price_eur: 199,
    price_ron: 999
  },
  {
    value: 'godparentsmelody',
    label_key: 'godparentsmelody',
    description_key: 'godparentsmelodyDesc',
    price_eur: 149,
    price_ron: 749
  },
  {
    value: 'separatedStems',
    label_key: 'separatedStems',
    description_key: 'separatedStemsDesc',
    price_eur: 399,
    price_ron: 1999
  },
  {
    value: 'personalizedAudioMessage',
    label_key: 'personalizedAudioMessage',
    description_key: 'personalizedAudioMessageDesc',
    price_eur: 79,
    price_ron: 399
  },
  {
    value: 'godparentsSpecialMelody',
    label_key: 'godparentsSpecialMelody',
    description_key: 'godparentsSpecialMelodyDesc',
    price_eur: 199,
    price_ron: 999
  }
];

export { packages, addOns };
