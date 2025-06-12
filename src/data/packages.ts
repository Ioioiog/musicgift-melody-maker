import { Package, Addon } from '@/types';

export const packages: Package[] = [
  {
    id: "plus",
    value: "plus",
    label_key: "plusPackage",
    description_key: "plusDescription",
    tagline_key: "plusTagline",
    delivery_time_key: "plusDelivery",
    price_ron: 99,
    price_eur: 19,
    tag: "new",
    includes: [
      {
        id: "plus_include_1",
        include_key: "plusInclude1",
        include_order: 1
      },
      {
        id: "plus_include_2", 
        include_key: "plusInclude2",
        include_order: 2
      },
      {
        id: "plus_include_3",
        include_key: "plusInclude3", 
        include_order: 3
      }
    ],
    steps: [
      {
        id: "plus_step_1",
        step_number: 1,
        title_key: "basicInfo",
        fields: [
          {
            id: "plus_field_1",
            field_name: "recipient_name",
            field_type: "text",
            placeholder_key: "recipientNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "plus_field_2", 
            field_name: "message",
            field_type: "textarea",
            placeholder_key: "messagePlaceholder",
            required: true,
            field_order: 2
          }
        ]
      }
    ]
  },
  {
    id: "personal",
    value: "personal", 
    label_key: "personalPackage",
    description_key: "personalDescription",
    tagline_key: "personalTagline",
    delivery_time_key: "personalDelivery",
    price_ron: 299,
    price_eur: 59,
    tag: "popular",
    includes: [
      {
        id: "personal_include_1",
        include_key: "personalInclude1",
        include_order: 1
      },
      {
        id: "personal_include_2",
        include_key: "personalInclude2", 
        include_order: 2
      },
      {
        id: "personal_include_3",
        include_key: "personalInclude3",
        include_order: 3
      },
      {
        id: "personal_include_4",
        include_key: "personalInclude4",
        include_order: 4
      }
    ],
    steps: [
      {
        id: "personal_step_1",
        step_number: 1,
        title_key: "basicInfo",
        fields: [
          {
            id: "personal_field_1",
            field_name: "recipient_name",
            field_type: "text",
            placeholder_key: "recipientNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "personal_field_2",
            field_name: "occasion",
            field_type: "select",
            required: true,
            field_order: 2,
            options: [
              { value: "birthday", label_key: "birthday" },
              { value: "anniversary", label_key: "anniversary" },
              { value: "wedding", label_key: "wedding" },
              { value: "graduation", label_key: "graduation" },
              { value: "other", label_key: "other" }
            ]
          }
        ]
      },
      {
        id: "personal_step_2",
        step_number: 2,
        title_key: "storyDetails",
        fields: [
          {
            id: "personal_field_3",
            field_name: "story",
            field_type: "textarea",
            placeholder_key: "storyPlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "personal_field_4",
            field_name: "musical_style",
            field_type: "select",
            required: false,
            field_order: 2,
            options: [
              { value: "pop", label_key: "pop" },
              { value: "rock", label_key: "rock" },
              { value: "acoustic", label_key: "acoustic" },
              { value: "ballad", label_key: "ballad" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "premium",
    value: "premium",
    label_key: "premiumPackage", 
    description_key: "premiumDescription",
    tagline_key: "premiumTagline",
    delivery_time_key: "premiumDelivery",
    price_ron: 999,
    price_eur: 199,
    tag: "premium",
    includes: [
      {
        id: "premium_include_1",
        include_key: "premiumInclude1",
        include_order: 1
      },
      {
        id: "premium_include_2",
        include_key: "premiumInclude2",
        include_order: 2
      },
      {
        id: "premium_include_3", 
        include_key: "premiumInclude3",
        include_order: 3
      }
    ],
    steps: [
      {
        id: "premium_step_1",
        step_number: 1,
        title_key: "basicInfo",
        fields: [
          {
            id: "premium_field_1",
            field_name: "artist_name",
            field_type: "text",
            placeholder_key: "artistNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "premium_field_2",
            field_name: "song_concept",
            field_type: "textarea",
            placeholder_key: "songConceptPlaceholder",
            required: true,
            field_order: 2
          }
        ]
      }
    ]
  },
  {
    id: "gift",
    value: "gift",
    label_key: "giftPackage",
    description_key: "giftDescription", 
    tagline_key: "giftTagline",
    delivery_time_key: "giftDelivery",
    price_ron: 299,
    price_eur: 59,
    tag: "gift",
    includes: [
      {
        id: "gift_include_1",
        include_key: "giftInclude1",
        include_order: 1
      },
      {
        id: "gift_include_2",
        include_key: "giftInclude2",
        include_order: 2
      },
      {
        id: "gift_include_3",
        include_key: "giftInclude3",
        include_order: 3
      }
    ],
    steps: [
      {
        id: "gift_step_1",
        step_number: 1,
        title_key: "giftDetails",
        fields: [
          {
            id: "gift_field_1",
            field_name: "recipient_name",
            field_type: "text",
            placeholder_key: "recipientNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "gift_field_2",
            field_name: "gift_amount",
            field_type: "select",
            required: true,
            field_order: 2,
            options: [
              { value: "59", label_key: "amount59" },
              { value: "99", label_key: "amount99" },
              { value: "199", label_key: "amount199" },
              { value: "custom", label_key: "customAmount" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "business",
    value: "business",
    label_key: "businessPackage",
    description_key: "businessDescription",
    tagline_key: "businessTagline", 
    delivery_time_key: "businessDelivery",
    price_ron: 1999,
    price_eur: 399,
    includes: [
      {
        id: "business_include_1",
        include_key: "businessInclude1",
        include_order: 1
      },
      {
        id: "business_include_2",
        include_key: "businessInclude2",
        include_order: 2
      },
      {
        id: "business_include_3",
        include_key: "businessInclude3",
        include_order: 3
      },
      {
        id: "business_include_4",
        include_key: "businessInclude4",
        include_order: 4
      },
      {
        id: "business_include_5",
        include_key: "businessInclude5",
        include_order: 5
      }
    ],
    steps: [
      {
        id: "business_step_1",
        step_number: 1,
        title_key: "businessInfo",
        fields: [
          {
            id: "business_field_1",
            field_name: "company_name",
            field_type: "text",
            placeholder_key: "companyNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "business_field_2",
            field_name: "brand_message",
            field_type: "textarea",
            placeholder_key: "brandMessagePlaceholder",
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
    description_key: "remixDescription",
    tagline_key: "remixTagline",
    delivery_time_key: "remixDelivery",
    price_ron: 499,
    price_eur: 99,
    includes: [
      {
        id: "remix_include_1",
        include_key: "remixInclude1",
        include_order: 1
      },
      {
        id: "remix_include_2",
        include_key: "remixInclude2",
        include_order: 2
      },
      {
        id: "remix_include_3",
        include_key: "remixInclude3",
        include_order: 3
      },
      {
        id: "remix_include_4",
        include_key: "remixInclude4",
        include_order: 4
      },
      {
        id: "remix_include_5",
        include_key: "remixInclude5",
        include_order: 5
      },
      {
        id: "remix_include_6",
        include_key: "remixInclude6",
        include_order: 6
      }
    ],
    steps: [
      {
        id: "remix_step_1",
        step_number: 1,
        title_key: "remixDetails",
        fields: [
          {
            id: "remix_field_1",
            field_name: "original_song",
            field_type: "file",
            required: true,
            field_order: 1
          },
          {
            id: "remix_field_2",
            field_name: "remix_style",
            field_type: "select",
            required: true,
            field_order: 2,
            options: [
              { value: "electronic", label_key: "electronic" },
              { value: "acoustic", label_key: "acoustic" },
              { value: "hip-hop", label_key: "hiphop" },
              { value: "rock", label_key: "rock" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "instrumental",
    value: "instrumental",
    label_key: "instrumentalPackage",
    description_key: "instrumentalDescription",
    tagline_key: "instrumentalTagline",
    delivery_time_key: "instrumentalDelivery",
    price_ron: 399,
    price_eur: 79,
    includes: [
      {
        id: "instrumental_include_1",
        include_key: "instrumentalInclude1",
        include_order: 1
      },
      {
        id: "instrumental_include_2",
        include_key: "instrumentalInclude2",
        include_order: 2
      },
      {
        id: "instrumental_include_3",
        include_key: "instrumentalInclude3",
        include_order: 3
      },
      {
        id: "instrumental_include_4",
        include_key: "instrumentalInclude4",
        include_order: 4
      },
      {
        id: "instrumental_include_5",
        include_key: "instrumentalInclude5",
        include_order: 5
      }
    ],
    steps: [
      {
        id: "instrumental_step_1",
        step_number: 1,
        title_key: "instrumentalDetails",
        fields: [
          {
            id: "instrumental_field_1",
            field_name: "genre",
            field_type: "select",
            required: true,
            field_order: 1,
            options: [
              { value: "pop", label_key: "pop" },
              { value: "rock", label_key: "rock" },
              { value: "jazz", label_key: "jazz" },
              { value: "classical", label_key: "classical" }
            ]
          },
          {
            id: "instrumental_field_2",
            field_name: "mood",
            field_type: "select",
            required: true,
            field_order: 2,
            options: [
              { value: "upbeat", label_key: "upbeat" },
              { value: "calm", label_key: "calm" },
              { value: "dramatic", label_key: "dramatic" },
              { value: "romantic", label_key: "romantic" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "wedding",
    value: "wedding",
    label_key: "weddingPackage",
    description_key: "weddingDescription",
    tagline_key: "weddingTagline",
    delivery_time_key: "weddingDelivery",
    price_ron: 799,
    price_eur: 159,
    includes: [
      {
        id: "wedding_include_1",
        include_key: "weddingInclude1",
        include_order: 1
      },
      {
        id: "wedding_include_2",
        include_key: "weddingInclude2",
        include_order: 2
      },
      {
        id: "wedding_include_3",
        include_key: "weddingInclude3",
        include_order: 3
      },
      {
        id: "wedding_include_4",
        include_key: "weddingInclude4",
        include_order: 4
      },
      {
        id: "wedding_include_5",
        include_key: "weddingInclude5",
        include_order: 5
      },
      {
        id: "wedding_include_6",
        include_key: "weddingInclude6",
        include_order: 6
      },
      {
        id: "wedding_include_7",
        include_key: "weddingInclude7",
        include_order: 7
      },
      {
        id: "wedding_include_8",
        include_key: "weddingInclude8",
        include_order: 8
      }
    ],
    steps: [
      {
        id: "wedding_step_1",
        step_number: 1,
        title_key: "weddingStep1Title",
        fields: [
          {
            id: "wedding_field_1",
            field_name: "couple_names",
            field_type: "text",
            placeholder_key: "weddingCoupleNamesPlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "wedding_field_2",
            field_name: "couple_type",
            field_type: "select",
            required: true,
            field_order: 2,
            options: [
              { value: "bride-groom", label_key: "weddingBrideGroom" },
              { value: "godparents", label_key: "weddingGodparents" }
            ]
          }
        ]
      },
      {
        id: "wedding_step_2",
        step_number: 2,
        title_key: "weddingStep2Title",
        fields: [
          {
            id: "wedding_field_3",
            field_name: "how_met",
            field_type: "textarea",
            placeholder_key: "weddingHowMetPlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "wedding_field_4",
            field_name: "love_story",
            field_type: "textarea",
            placeholder_key: "weddingLoveStoryPlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "wedding_field_5",
            field_name: "atmosphere",
            field_type: "select",
            required: true,
            field_order: 3,
            options: [
              { value: "romantic", label_key: "weddingAtmosphereRomantic" },
              { value: "emotional", label_key: "weddingAtmosphereEmotional" },
              { value: "elegant", label_key: "weddingAtmosphereElegant" }
            ]
          },
          {
            id: "wedding_field_6",
            field_name: "musical_style",
            field_type: "text",
            placeholder_key: "weddingMusicalStylePlaceholder",
            required: false,
            field_order: 4
          }
        ]
      }
    ]
  },
  {
    id: "baptism",
    value: "baptism",
    label_key: "baptismPackage",
    description_key: "baptismDescription",
    tagline_key: "baptismTagline",
    delivery_time_key: "baptismDelivery",
    price_ron: 499,
    price_eur: 99,
    includes: [
      {
        id: "baptism_include_1",
        include_key: "baptismInclude1",
        include_order: 1
      },
      {
        id: "baptism_include_2",
        include_key: "baptismInclude2",
        include_order: 2
      },
      {
        id: "baptism_include_3",
        include_key: "baptismInclude3",
        include_order: 3
      },
      {
        id: "baptism_include_4",
        include_key: "baptismInclude4",
        include_order: 4
      },
      {
        id: "baptism_include_5",
        include_key: "baptismInclude5",
        include_order: 5
      },
      {
        id: "baptism_include_6",
        include_key: "baptismInclude6",
        include_order: 6
      }
    ],
    steps: [
      {
        id: "baptism_step_1",
        step_number: 1,
        title_key: "baptismStep1Title",
        fields: [
          {
            id: "baptism_field_1",
            field_name: "child_name",
            field_type: "text",
            placeholder_key: "baptismChildNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "baptism_field_2",
            field_name: "name_meaning",
            field_type: "text",
            placeholder_key: "baptismNameMeaningPlaceholder",
            required: false,
            field_order: 2
          },
          {
            id: "baptism_field_3",
            field_name: "birth_story",
            field_type: "textarea",
            placeholder_key: "baptismBirthStoryPlaceholder",
            required: true,
            field_order: 3
          }
        ]
      },
      {
        id: "baptism_step_2",
        step_number: 2,
        title_key: "baptismStep2Title",
        fields: [
          {
            id: "baptism_field_4",
            field_name: "atmosphere",
            field_type: "select",
            required: true,
            field_order: 1,
            options: [
              { value: "calm", label_key: "baptismAtmosphereCalm" },
              { value: "playful", label_key: "baptismAtmospherePlayful" },
              { value: "emotional", label_key: "baptismAtmosphereEmotional" }
            ]
          },
          {
            id: "baptism_field_5",
            field_name: "musical_style",
            field_type: "select",
            required: true,
            field_order: 2,
            options: [
              { value: "ballad", label_key: "baptismStyleBallad" },
              { value: "lullaby", label_key: "baptismStyleLullaby" },
              { value: "acoustic-pop", label_key: "baptismStyleAcousticPop" }
            ]
          },
          {
            id: "baptism_field_6",
            field_name: "voice_preference",
            field_type: "select",
            required: true,
            field_order: 3,
            options: [
              { value: "female", label_key: "voiceFemale" },
              { value: "male", label_key: "voiceMale" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "comingOfAge",
    value: "comingOfAge",
    label_key: "comingOfAgePackage",
    description_key: "comingOfAgeDescription",
    tagline_key: "comingOfAgeTagline",
    delivery_time_key: "comingOfAgeDelivery",
    price_ron: 599,
    price_eur: 119,
    includes: [
      {
        id: "comingOfAge_include_1",
        include_key: "comingOfAgeInclude1",
        include_order: 1
      },
      {
        id: "comingOfAge_include_2",
        include_key: "comingOfAgeInclude2",
        include_order: 2
      },
      {
        id: "comingOfAge_include_3",
        include_key: "comingOfAgeInclude3",
        include_order: 3
      },
      {
        id: "comingOfAge_include_4",
        include_key: "comingOfAgeInclude4",
        include_order: 4
      },
      {
        id: "comingOfAge_include_5",
        include_key: "comingOfAgeInclude5",
        include_order: 5
      },
      {
        id: "comingOfAge_include_6",
        include_key: "comingOfAgeInclude6",
        include_order: 6
      }
    ],
    steps: [
      {
        id: "comingOfAge_step_1",
        step_number: 1,
        title_key: "comingOfAgeStep1Title",
        fields: [
          {
            id: "comingOfAge_field_1",
            field_name: "celebrant_name",
            field_type: "text",
            placeholder_key: "comingOfAgeCelebrantNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "comingOfAge_field_2",
            field_name: "hobbies_personality",
            field_type: "textarea",
            placeholder_key: "comingOfAgeHobbiesPlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "comingOfAge_field_3",
            field_name: "personal_message",
            field_type: "textarea",
            placeholder_key: "comingOfAgePersonalMessagePlaceholder",
            required: true,
            field_order: 3
          }
        ]
      },
      {
        id: "comingOfAge_step_2",
        step_number: 2,
        title_key: "comingOfAgeStep2Title",
        fields: [
          {
            id: "comingOfAge_field_4",
            field_name: "musical_style",
            field_type: "select",
            required: true,
            field_order: 1,
            options: [
              { value: "hip-hop", label_key: "comingOfAgeStyleHipHop" },
              { value: "pop", label_key: "comingOfAgeStylePop" },
              { value: "trap", label_key: "comingOfAgeStyleTrap" },
              { value: "lofi", label_key: "comingOfAgeStyleLofi" }
            ]
          },
          {
            id: "comingOfAge_field_5",
            field_name: "vibe",
            field_type: "select",
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
            id: "comingOfAge_field_6",
            field_name: "favorite_artists",
            field_type: "text",
            placeholder_key: "comingOfAgeFavoriteArtistsPlaceholder",
            required: false,
            field_order: 3
          }
        ]
      }
    ]
  },
  {
    id: "artist",
    value: "artist",
    label_key: "artistPackage",
    description_key: "artistDescription",
    tagline_key: "artistTagline",
    delivery_time_key: "artistDelivery",
    price_ron: 1499,
    price_eur: 299,
    includes: [
      {
        id: "artist_include_1",
        include_key: "artistInclude1",
        include_order: 1
      },
      {
        id: "artist_include_2",
        include_key: "artistInclude2",
        include_order: 2
      },
      {
        id: "artist_include_3",
        include_key: "artistInclude3",
        include_order: 3
      },
      {
        id: "artist_include_4",
        include_key: "artistInclude4",
        include_order: 4
      }
    ],
    steps: [
      {
        id: "artist_step_1",
        step_number: 1,
        title_key: "artistInfo",
        fields: [
          {
            id: "artist_field_1",
            field_name: "artist_name",
            field_type: "text",
            placeholder_key: "artistNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "artist_field_2",
            field_name: "music_style",
            field_type: "select",
            required: true,
            field_order: 2,
            options: [
              { value: "pop", label_key: "pop" },
              { value: "rock", label_key: "rock" },
              { value: "hip-hop", label_key: "hiphop" },
              { value: "electronic", label_key: "electronic" }
            ]
          }
        ]
      }
    ]
  }
];

export const addOns: Addon[] = [
  {
    id: "rush_delivery",
    value: "rush_delivery",
    label_key: "rushDelivery",
    description_key: "rushDeliveryDesc",
    price_ron: 149,
    price_eur: 29
  },
  {
    id: "extra_revision",
    value: "extra_revision",
    label_key: "extraRevision",
    description_key: "extraRevisionDesc",
    price_ron: 99,
    price_eur: 19
  },
  {
    id: "extended_license",
    value: "extended_license",
    label_key: "extendedLicense",
    description_key: "extendedLicenseDesc",
    price_ron: 249,
    price_eur: 49
  },
  {
    id: "source_files",
    value: "source_files",
    label_key: "sourceFiles",
    description_key: "sourceFilesDesc",
    price_ron: 499,
    price_eur: 99
  },
  {
    id: "social_media_rights",
    value: "social_media_rights",
    label_key: "socialMediaRights",
    description_key: "socialMediaRightsDesc",
    price_ron: 199,
    price_eur: 39
  },
  {
    id: "mango_records_distribution",
    value: "mango_records_distribution",
    label_key: "mangoRecordsDistribution",
    description_key: "mangoRecordsDistributionDesc",
    price_ron: 749,
    price_eur: 149
  },
  {
    id: "custom_video",
    value: "custom_video",
    label_key: "customVideo",
    description_key: "customVideoDesc",
    price_ron: 999,
    price_eur: 199
  },
  {
    id: "audio_message_from_sender",
    value: "audio_message_from_sender",
    label_key: "audioMessageFromSender",
    description_key: "audioMessageFromSenderDesc",
    price_ron: 99,
    price_eur: 19
  },
  {
    id: "branded_audio_message",
    value: "branded_audio_message",
    label_key: "brandedAudioMessage",
    description_key: "brandedAudioMessageDesc",
    price_ron: 149,
    price_eur: 29
  },
  {
    id: "commercial_rights_upgrade",
    value: "commercial_rights_upgrade",
    label_key: "commercialRightsUpgrade",
    description_key: "commercialRightsUpgradeDesc",
    price_ron: 499,
    price_eur: 99
  },
  {
    id: "extended_song",
    value: "extended_song",
    label_key: "extendedSong",
    description_key: "extendedSongDesc",
    price_ron: 299,
    price_eur: 59
  },
  {
    id: "godparents_melody",
    value: "godparents_melody",
    label_key: "godparentsmelody",
    description_key: "godparentsmelodyDesc",
    price_ron: 349,
    price_eur: 69
  },
  {
    id: "separated_stems",
    value: "separated_stems",
    label_key: "separatedStems",
    description_key: "separatedStemsDesc",
    price_ron: 549,
    price_eur: 109
  },
  {
    id: "personalized_audio_message",
    value: "personalized_audio_message",
    label_key: "personalizedAudioMessage",
    description_key: "personalizedAudioMessageDesc",
    price_ron: 129,
    price_eur: 25
  },
  {
    id: "godparents_special_melody",
    value: "godparents_special_melody",
    label_key: "godparentsSpecialMelody",
    description_key: "godparentsSpecialMelodyDesc",
    price_ron: 399,
    price_eur: 79
  }
];
