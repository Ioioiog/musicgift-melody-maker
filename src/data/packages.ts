
export interface PackageData {
  id: string;
  value: string;
  label_key: string;
  tagline_key: string;
  description_key: string;
  delivery_time_key: string;
  price_ron: number;
  price_eur: number;
  available_addons: string[];
  tag?: string;
  is_active?: boolean;
  is_popular?: boolean;
  includes: Array<{
    id: string;
    include_key: string;
    include_order: number;
  }>;
  steps: Array<{
    id: string;
    step_number: number;
    title_key: string;
    fields: Array<{
      id: string;
      field_name: string;
      field_type: string;
      placeholder_key?: string;
      required: boolean;
      field_order: number;
      options?: Array<{ value: string; label_key: string; }>;
    }>;
  }>;
}

export interface Addon {
  id: string;
  addon_key: string;
  label_key: string;
  description_key: string;
  price_ron: number;
  price_eur: number;
  is_active: boolean;
  trigger_field_type?: string;
  trigger_field_config?: {
    maxFiles?: number;
    maxTotalSizeMb?: number;
    allowedTypes?: string[];
    maxDuration?: number;
  };
}

export const packages: PackageData[] = [
  {
    id: "1",
    value: "personal",
    label_key: "personalPackage",
    tagline_key: "personalTagline", 
    description_key: "personalDescription",
    delivery_time_key: "personalDelivery",
    price_ron: 299,
    price_eur: 59,
    available_addons: ["rushDelivery", "socialMediaRights", "mangoRecordsDistribution", "customVideo", "audioMessageFromSender", "extendedSong"],
    includes: [
      { id: "p1", include_key: "personalInclude1", include_order: 1 },
      { id: "p2", include_key: "personalInclude2", include_order: 2 },
      { id: "p3", include_key: "personalInclude3", include_order: 3 },
      { id: "p4", include_key: "personalInclude4", include_order: 4 }
    ],
    steps: [
      {
        id: "personal_step1",
        step_number: 1,
        title_key: "generalDetails",
        fields: [
          {
            id: "songTheme",
            field_name: "songTheme",
            field_type: "textarea",
            placeholder_key: "songThemePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "songLanguage",
            field_name: "songLanguage",
            field_type: "select",
            placeholder_key: "selectSongLanguage",
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
            id: "songStyle",
            field_name: "songStyle",
            field_type: "select",
            placeholder_key: "selectSongStyle",
            required: true,
            field_order: 3,
            options: [
              { value: "pop", label_key: "popStyle" },
              { value: "rock", label_key: "rockStyle" },
              { value: "ballad", label_key: "balladStyle" },
              { value: "folk", label_key: "folkStyle" },
              { value: "jazz", label_key: "jazzStyle" }
            ]
          }
        ]
      },
      {
        id: "personal_step2",
        step_number: 2,
        title_key: "recipientDetails",
        fields: [
          {
            id: "recipientName",
            field_name: "recipientName",
            field_type: "text",
            placeholder_key: "recipientNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "recipientAge",
            field_name: "recipientAge",
            field_type: "text",
            placeholder_key: "recipientAgePlaceholder",
            required: false,
            field_order: 2
          },
          {
            id: "recipientRelation",
            field_name: "recipientRelation",
            field_type: "text",
            placeholder_key: "recipientRelationPlaceholder",
            required: true,
            field_order: 3
          },
          {
            id: "recipientPersonality",
            field_name: "recipientPersonality",
            field_type: "textarea",
            placeholder_key: "recipientPersonalityPlaceholder",
            required: true,
            field_order: 4
          }
        ]
      },
      {
        id: "personal_step3",
        step_number: 3,
        title_key: "messageDetails",
        fields: [
          {
            id: "specialMessage",
            field_name: "specialMessage",
            field_type: "textarea",
            placeholder_key: "specialMessagePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "specialMemories",
            field_name: "specialMemories",
            field_type: "textarea",
            placeholder_key: "specialMemoriesPlaceholder",
            required: false,
            field_order: 2
          },
          {
            id: "additionalInfo",
            field_name: "additionalInfo",
            field_type: "textarea",
            placeholder_key: "additionalInfoPlaceholder",
            required: false,
            field_order: 3
          }
        ]
      }
    ]
  },
  {
    id: "10",
    value: "test",
    label_key: "testPackage",
    tagline_key: "testTagline",
    description_key: "testDescription",
    delivery_time_key: "testDelivery",
    price_ron: 1,
    price_eur: 0.5,
    available_addons: ["rushDelivery"],
    includes: [
      { id: "t1", include_key: "testInclude1", include_order: 1 }
    ],
    steps: [
      {
        id: "test_step1",
        step_number: 1,
        title_key: "testDetails",
        fields: [
          {
            id: "testField",
            field_name: "testField",
            field_type: "text",
            placeholder_key: "testFieldPlaceholder",
            required: true,
            field_order: 1
          }
        ]
      }
    ]
  },
  {
    id: "2",
    value: "premium",
    label_key: "premiumPackage",
    tagline_key: "premiumTagline",
    description_key: "premiumDescription",
    delivery_time_key: "premiumDelivery",
    price_ron: 499,
    price_eur: 99,
    available_addons: ["rushDelivery", "socialMediaRights", "customVideo", "audioMessageFromSender", "extendedSong"],
    includes: [
      { id: "pr1", include_key: "premiumInclude1", include_order: 1 },
      { id: "pr2", include_key: "premiumInclude2", include_order: 2 },
      { id: "pr3", include_key: "premiumInclude3", include_order: 3 }
    ],
    steps: [
      {
        id: "premium_step1",
        step_number: 1,
        title_key: "generalDetails",
        fields: [
          {
            id: "songTheme",
            field_name: "songTheme",
            field_type: "textarea",
            placeholder_key: "songThemePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "songLanguage",
            field_name: "songLanguage",
            field_type: "select",
            placeholder_key: "selectSongLanguage",
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
            id: "songStyle",
            field_name: "songStyle",
            field_type: "select",
            placeholder_key: "selectSongStyle",
            required: true,
            field_order: 3,
            options: [
              { value: "pop", label_key: "popStyle" },
              { value: "rock", label_key: "rockStyle" },
              { value: "ballad", label_key: "balladStyle" },
              { value: "electronic", label_key: "electronicStyle" },
              { value: "hiphop", label_key: "hiphopStyle" }
            ]
          }
        ]
      },
      {
        id: "premium_step2",
        step_number: 2,
        title_key: "recipientDetails",
        fields: [
          {
            id: "recipientName",
            field_name: "recipientName",
            field_type: "text",
            placeholder_key: "recipientNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "recipientAge",
            field_name: "recipientAge",
            field_type: "text",
            placeholder_key: "recipientAgePlaceholder",
            required: false,
            field_order: 2
          },
          {
            id: "recipientRelation",
            field_name: "recipientRelation",
            field_type: "text",
            placeholder_key: "recipientRelationPlaceholder",
            required: true,
            field_order: 3
          },
          {
            id: "recipientPersonality",
            field_name: "recipientPersonality",
            field_type: "textarea",
            placeholder_key: "recipientPersonalityPlaceholder",
            required: true,
            field_order: 4
          }
        ]
      },
      {
        id: "premium_step3",
        step_number: 3,
        title_key: "messageDetails",
        fields: [
          {
            id: "specialMessage",
            field_name: "specialMessage",
            field_type: "textarea",
            placeholder_key: "specialMessagePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "specialMemories",
            field_name: "specialMemories",
            field_type: "textarea",
            placeholder_key: "specialMemoriesPlaceholder",
            required: false,
            field_order: 2
          },
          {
            id: "additionalInfo",
            field_name: "additionalInfo",
            field_type: "textarea",
            placeholder_key: "additionalInfoPlaceholder",
            required: false,
            field_order: 3
          }
        ]
      },
      {
        id: "premium_step4",
        step_number: 4,
        title_key: "distributionDetails",
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
            id: "songTitle",
            field_name: "songTitle",
            field_type: "text",
            placeholder_key: "songTitlePlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "releaseDate",
            field_name: "releaseDate",
            field_type: "date",
            placeholder_key: "releaseDatePlaceholder",
            required: true,
            field_order: 3
          }
        ]
      }
    ]
  },
  {
    id: "3",
    value: "business",
    label_key: "businessPackage",
    tagline_key: "businessTagline",
    description_key: "businessDescription",
    delivery_time_key: "businessDelivery",
    price_ron: 499,
    price_eur: 99,
    available_addons: ["rushDelivery", "socialMediaRights", "brandedAudioMessage", "commercialRightsUpgrade", "customVideo", "extendedSong"],
    includes: [
      { id: "b1", include_key: "businessInclude1", include_order: 1 },
      { id: "b2", include_key: "businessInclude2", include_order: 2 },
      { id: "b3", include_key: "businessInclude3", include_order: 3 },
      { id: "b4", include_key: "businessInclude4", include_order: 4 },
      { id: "b5", include_key: "businessInclude5", include_order: 5 }
    ],
    steps: [
      {
        id: "business_step1",
        step_number: 1,
        title_key: "businessDetails",
        fields: [
          {
            id: "businessName",
            field_name: "businessName",
            field_type: "text",
            placeholder_key: "businessNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "businessIndustry",
            field_name: "businessIndustry",
            field_type: "text",
            placeholder_key: "businessIndustryPlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "businessValues",
            field_name: "businessValues",
            field_type: "textarea",
            placeholder_key: "businessValuesPlaceholder",
            required: true,
            field_order: 3
          }
        ]
      },
      {
        id: "business_step2",
        step_number: 2,
        title_key: "songRequirements",
        fields: [
          {
            id: "songPurpose",
            field_name: "songPurpose",
            field_type: "textarea",
            placeholder_key: "songPurposePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "songLanguage",
            field_name: "songLanguage",
            field_type: "select",
            placeholder_key: "selectSongLanguage",
            required: true,
            field_order: 2,
            options: [
              { value: "romanian", label_key: "romanianLanguage" },
              { value: "english", label_key: "englishLanguage" },
              { value: "french", label_key: "frenchLanguage" }
            ]
          },
          {
            id: "songStyle",
            field_name: "songStyle",
            field_type: "select",
            placeholder_key: "selectSongStyle",
            required: true,
            field_order: 3,
            options: [
              { value: "pop", label_key: "popStyle" },
              { value: "rock", label_key: "rockStyle" },
              { value: "electronic", label_key: "electronicStyle" },
              { value: "corporate", label_key: "corporateStyle" },
              { value: "acoustic", label_key: "acousticStyle" }
            ]
          },
          {
            id: "targetAudience",
            field_name: "targetAudience",
            field_type: "textarea",
            placeholder_key: "targetAudiencePlaceholder",
            required: true,
            field_order: 4
          }
        ]
      },
      {
        id: "business_step3",
        step_number: 3,
        title_key: "additionalRequirements",
        fields: [
          {
            id: "keyMessages",
            field_name: "keyMessages",
            field_type: "textarea",
            placeholder_key: "keyMessagesPlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "brandGuidelines",
            field_name: "brandGuidelines",
            field_type: "textarea",
            placeholder_key: "brandGuidelinesPlaceholder",
            required: false,
            field_order: 2
          },
          {
            id: "additionalInfo",
            field_name: "additionalInfo",
            field_type: "textarea",
            placeholder_key: "additionalInfoPlaceholder",
            required: false,
            field_order: 3
          }
        ]
      }
    ]
  },
  {
    id: "4",
    value: "artist",
    label_key: "artistPackage",
    tagline_key: "artistTagline",
    description_key: "artistDescription",
    delivery_time_key: "artistDelivery",
    price_ron: 7999,
    price_eur: 1499,
    available_addons: [],
    includes: [
      { id: "a1", include_key: "artistInclude1", include_order: 1 },
      { id: "a2", include_key: "artistInclude2", include_order: 2 },
      { id: "a3", include_key: "artistInclude3", include_order: 3 },
      { id: "a4", include_key: "artistInclude4", include_order: 4 }
    ],
    steps: [
      {
        id: "artist_step1",
        step_number: 1,
        title_key: "artistDetails",
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
            id: "artistGenre",
            field_name: "artistGenre",
            field_type: "text",
            placeholder_key: "artistGenrePlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "artistInfluences",
            field_name: "artistInfluences",
            field_type: "textarea",
            placeholder_key: "artistInfluencesPlaceholder",
            required: true,
            field_order: 3
          }
        ]
      },
      {
        id: "artist_step2",
        step_number: 2,
        title_key: "songRequirements",
        fields: [
          {
            id: "songTheme",
            field_name: "songTheme",
            field_type: "textarea",
            placeholder_key: "songThemePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "songLanguage",
            field_name: "songLanguage",
            field_type: "select",
            placeholder_key: "selectSongLanguage",
            required: true,
            field_order: 2,
            options: [
              { value: "romanian", label_key: "romanianLanguage" },
              { value: "english", label_key: "englishLanguage" },
              { value: "french", label_key: "frenchLanguage" }
            ]
          },
          {
            id: "songStyle",
            field_name: "songStyle",
            field_type: "select",
            placeholder_key: "selectSongStyle",
            required: true,
            field_order: 3,
            options: [
              { value: "pop", label_key: "popStyle" },
              { value: "rock", label_key: "rockStyle" },
              { value: "electronic", label_key: "electronicStyle" },
              { value: "hiphop", label_key: "hiphopStyle" },
              { value: "rnb", label_key: "rnbStyle" }
            ]
          }
        ]
      },
      {
        id: "artist_step3",
        step_number: 3,
        title_key: "distributionDetails",
        fields: [
          {
            id: "songTitle",
            field_name: "songTitle",
            field_type: "text",
            placeholder_key: "songTitlePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "releaseDate",
            field_name: "releaseDate",
            field_type: "date",
            placeholder_key: "releaseDatePlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "additionalInfo",
            field_name: "additionalInfo",
            field_type: "textarea",
            placeholder_key: "additionalInfoPlaceholder",
            required: false,
            field_order: 3
          }
        ]
      }
    ]
  },
  {
    id: "5",
    value: "remix",
    label_key: "remixPackage",
    tagline_key: "remixTagline",
    description_key: "remixDescription",
    delivery_time_key: "remixDelivery",
    price_ron: 499,
    price_eur: 99,
    available_addons: ["rushDelivery", "socialMediaRights", "mangoRecordsDistribution", "customVideo"],
    includes: [
      { id: "r1", include_key: "remixInclude1", include_order: 1 },
      { id: "r2", include_key: "remixInclude2", include_order: 2 },
      { id: "r3", include_key: "remixInclude3", include_order: 3 },
      { id: "r4", include_key: "remixInclude4", include_order: 4 },
      { id: "r5", include_key: "remixInclude5", include_order: 5 },
      { id: "r6", include_key: "remixInclude6", include_order: 6 }
    ],
    steps: [
      {
        id: "remix_step1",
        step_number: 1,
        title_key: "originalSongDetails",
        fields: [
          {
            id: "originalSongTitle",
            field_name: "originalSongTitle",
            field_type: "text",
            placeholder_key: "originalSongTitlePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "originalArtist",
            field_name: "originalArtist",
            field_type: "text",
            placeholder_key: "originalArtistPlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "originalSongLink",
            field_name: "originalSongLink",
            field_type: "url",
            placeholder_key: "originalSongLinkPlaceholder",
            required: true,
            field_order: 3
          }
        ]
      },
      {
        id: "remix_step2",
        step_number: 2,
        title_key: "remixRequirements",
        fields: [
          {
            id: "remixStyle",
            field_name: "remixStyle",
            field_type: "select",
            placeholder_key: "selectRemixStyle",
            required: true,
            field_order: 1,
            options: [
              { value: "edm", label_key: "edmStyle" },
              { value: "house", label_key: "houseStyle" },
              { value: "techno", label_key: "technoStyle" },
              { value: "trap", label_key: "trapStyle" },
              { value: "lofi", label_key: "lofiStyle" }
            ]
          },
          {
            id: "remixMood",
            field_name: "remixMood",
            field_type: "select",
            placeholder_key: "selectRemixMood",
            required: true,
            field_order: 2,
            options: [
              { value: "energetic", label_key: "energeticMood" },
              { value: "chill", label_key: "chillMood" },
              { value: "dark", label_key: "darkMood" },
              { value: "uplifting", label_key: "upliftingMood" }
            ]
          },
          {
            id: "remixInstructions",
            field_name: "remixInstructions",
            field_type: "textarea",
            placeholder_key: "remixInstructionsPlaceholder",
            required: false,
            field_order: 3
          }
        ]
      }
    ]
  },
  {
    id: "6",
    value: "instrumental",
    label_key: "instrumentalPackage",
    tagline_key: "instrumentalTagline",
    description_key: "instrumentalDescription",
    delivery_time_key: "instrumentalDelivery",
    price_ron: 499,
    price_eur: 99,
    available_addons: ["rushDelivery", "socialMediaRights", "mangoRecordsDistribution", "customVideo", "separatedStems"],
    includes: [
      { id: "i1", include_key: "instrumentalInclude1", include_order: 1 },
      { id: "i2", include_key: "instrumentalInclude2", include_order: 2 },
      { id: "i3", include_key: "instrumentalInclude3", include_order: 3 },
      { id: "i4", include_key: "instrumentalInclude4", include_order: 4 },
      { id: "i5", include_key: "instrumentalInclude5", include_order: 5 }
    ],
    steps: [
      {
        id: "instrumental_step1",
        step_number: 1,
        title_key: "instrumentalDetails",
        fields: [
          {
            id: "instrumentalStyle",
            field_name: "instrumentalStyle",
            field_type: "select",
            placeholder_key: "selectInstrumentalStyle",
            required: true,
            field_order: 1,
            options: [
              { value: "pop", label_key: "popStyle" },
              { value: "hiphop", label_key: "hiphopStyle" },
              { value: "rnb", label_key: "rnbStyle" },
              { value: "electronic", label_key: "electronicStyle" },
              { value: "acoustic", label_key: "acousticStyle" }
            ]
          },
          {
            id: "instrumentalMood",
            field_name: "instrumentalMood",
            field_type: "select",
            placeholder_key: "selectInstrumentalMood",
            required: true,
            field_order: 2,
            options: [
              { value: "energetic", label_key: "energeticMood" },
              { value: "chill", label_key: "chillMood" },
              { value: "dark", label_key: "darkMood" },
              { value: "uplifting", label_key: "upliftingMood" },
              { value: "melancholic", label_key: "melancholicMood" }
            ]
          },
          {
            id: "instrumentalTempo",
            field_name: "instrumentalTempo",
            field_type: "select",
            placeholder_key: "selectInstrumentalTempo",
            required: true,
            field_order: 3,
            options: [
              { value: "slow", label_key: "slowTempo" },
              { value: "medium", label_key: "mediumTempo" },
              { value: "fast", label_key: "fastTempo" }
            ]
          }
        ]
      },
      {
        id: "instrumental_step2",
        step_number: 2,
        title_key: "instrumentalRequirements",
        fields: [
          {
            id: "instrumentalDescription",
            field_name: "instrumentalDescription",
            field_type: "textarea",
            placeholder_key: "instrumentalDescriptionPlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "instrumentalReferences",
            field_name: "instrumentalReferences",
            field_type: "textarea",
            placeholder_key: "instrumentalReferencesPlaceholder",
            required: false,
            field_order: 2
          },
          {
            id: "additionalInfo",
            field_name: "additionalInfo",
            field_type: "textarea",
            placeholder_key: "additionalInfoPlaceholder",
            required: false,
            field_order: 3
          }
        ]
      }
    ]
  },
  {
    id: "7",
    value: "wedding",
    label_key: "weddingPackage",
    tagline_key: "weddingTagline",
    description_key: "weddingDescription",
    delivery_time_key: "weddingDelivery",
    price_ron: 299,
    price_eur: 59,
    available_addons: ["rushDelivery", "socialMediaRights", "mangoRecordsDistribution", "customVideo", "audioMessageFromSender", "extendedSong", "godparentsMelody"],
    includes: [
      { id: "w1", include_key: "weddingInclude1", include_order: 1 },
      { id: "w2", include_key: "weddingInclude2", include_order: 2 },
      { id: "w3", include_key: "weddingInclude3", include_order: 3 },
      { id: "w4", include_key: "weddingInclude4", include_order: 4 },
      { id: "w5", include_key: "weddingInclude5", include_order: 5 },
      { id: "w6", include_key: "weddingInclude6", include_order: 6 },
      { id: "w7", include_key: "weddingInclude7", include_order: 7 },
      { id: "w8", include_key: "weddingInclude8", include_order: 8 }
    ],
    steps: [
      {
        id: "wedding_step1",
        step_number: 1,
        title_key: "weddingStep1Title",
        fields: [
          {
            id: "coupleNames",
            field_name: "coupleNames",
            field_type: "text",
            placeholder_key: "weddingCoupleNamesPlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "coupleType",
            field_name: "coupleType",
            field_type: "select",
            placeholder_key: "selectCoupleType",
            required: true,
            field_order: 2,
            options: [
              { value: "brideGroom", label_key: "weddingBrideGroom" },
              { value: "godparents", label_key: "weddingGodparents" }
            ]
          },
          {
            id: "howMet",
            field_name: "howMet",
            field_type: "textarea",
            placeholder_key: "weddingHowMetPlaceholder",
            required: true,
            field_order: 3
          }
        ]
      },
      {
        id: "wedding_step2",
        step_number: 2,
        title_key: "weddingStep2Title",
        fields: [
          {
            id: "loveStory",
            field_name: "loveStory",
            field_type: "textarea",
            placeholder_key: "weddingLoveStoryPlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "songAtmosphere",
            field_name: "songAtmosphere",
            field_type: "select",
            placeholder_key: "selectSongAtmosphere",
            required: true,
            field_order: 2,
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
            placeholder_key: "weddingMusicalStylePlaceholder",
            required: false,
            field_order: 3
          },
          {
            id: "voicePreference",
            field_name: "voicePreference",
            field_type: "select",
            placeholder_key: "selectVoicePreference",
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
  },
  {
    id: "8",
    value: "baptism",
    label_key: "baptismPackage",
    tagline_key: "baptismTagline",
    description_key: "baptismDescription",
    delivery_time_key: "baptismDelivery",
    price_ron: 299,
    price_eur: 59,
    available_addons: ["rushDelivery", "socialMediaRights", "mangoRecordsDistribution", "customVideo", "audioMessageFromSender", "extendedSong"],
    includes: [
      { id: "bp1", include_key: "baptismInclude1", include_order: 1 },
      { id: "bp2", include_key: "baptismInclude2", include_order: 2 },
      { id: "bp3", include_key: "baptismInclude3", include_order: 3 },
      { id: "bp4", include_key: "baptismInclude4", include_order: 4 },
      { id: "bp5", include_key: "baptismInclude5", include_order: 5 },
      { id: "bp6", include_key: "baptismInclude6", include_order: 6 }
    ],
    steps: [
      {
        id: "baptism_step1",
        step_number: 1,
        title_key: "baptismStep1Title",
        fields: [
          {
            id: "childName",
            field_name: "childName",
            field_type: "text",
            placeholder_key: "baptismChildNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "nameMeaning",
            field_name: "nameMeaning",
            field_type: "text",
            placeholder_key: "baptismNameMeaningPlaceholder",
            required: false,
            field_order: 2
          },
          {
            id: "birthStory",
            field_name: "birthStory",
            field_type: "textarea",
            placeholder_key: "baptismBirthStoryPlaceholder",
            required: true,
            field_order: 3
          }
        ]
      },
      {
        id: "baptism_step2",
        step_number: 2,
        title_key: "baptismStep2Title",
        fields: [
          {
            id: "songAtmosphere",
            field_name: "songAtmosphere",
            field_type: "select",
            placeholder_key: "selectSongAtmosphere",
            required: true,
            field_order: 1,
            options: [
              { value: "calm", label_key: "baptismAtmosphereCalm" },
              { value: "playful", label_key: "baptismAtmospherePlayful" },
              { value: "emotional", label_key: "baptismAtmosphereEmotional" }
            ]
          },
          {
            id: "songStyle",
            field_name: "songStyle",
            field_type: "select",
            placeholder_key: "selectSongStyle",
            required: true,
            field_order: 2,
            options: [
              { value: "ballad", label_key: "baptismStyleBallad" },
              { value: "lullaby", label_key: "baptismStyleLullaby" },
              { value: "acousticPop", label_key: "baptismStyleAcousticPop" }
            ]
          },
          {
            id: "voicePreference",
            field_name: "voicePreference",
            field_type: "select",
            placeholder_key: "selectVoicePreference",
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
    id: "9",
    value: "comingOfAge",
    label_key: "comingOfAgePackage",
    tagline_key: "comingOfAgeTagline",
    description_key: "comingOfAgeDescription",
    delivery_time_key: "comingOfAgeDelivery",
    price_ron: 299,
    price_eur: 59,
    available_addons: ["rushDelivery", "socialMediaRights", "customVideo", "audioMessageFromSender", "extendedSong"],
    includes: [
      { id: "ca1", include_key: "comingOfAgeInclude1", include_order: 1 },
      { id: "ca2", include_key: "comingOfAgeInclude2", include_order: 2 },
      { id: "ca3", include_key: "comingOfAgeInclude3", include_order: 3 },
      { id: "ca4", include_key: "comingOfAgeInclude4", include_order: 4 },
      { id: "ca5", include_key: "comingOfAgeInclude5", include_order: 5 },
      { id: "ca6", include_key: "comingOfAgeInclude6", include_order: 6 }
    ],
    steps: [
      {
        id: "comingOfAge_step1",
        step_number: 1,
        title_key: "comingOfAgeStep1Title",
        fields: [
          {
            id: "celebrantName",
            field_name: "celebrantName",
            field_type: "text",
            placeholder_key: "comingOfAgeCelebrantNamePlaceholder",
            required: true,
            field_order: 1
          },
          {
            id: "hobbies",
            field_name: "hobbies",
            field_type: "textarea",
            placeholder_key: "comingOfAgeHobbiesPlaceholder",
            required: true,
            field_order: 2
          },
          {
            id: "personalMessage",
            field_name: "personalMessage",
            field_type: "textarea",
            placeholder_key: "comingOfAgePersonalMessagePlaceholder",
            required: true,
            field_order: 3
          }
        ]
      },
      {
        id: "comingOfAge_step2",
        step_number: 2,
        title_key: "comingOfAgeStep2Title",
        fields: [
          {
            id: "songStyle",
            field_name: "songStyle",
            field_type: "select",
            placeholder_key: "selectSongStyle",
            required: true,
            field_order: 1,
            options: [
              { value: "hiphop", label_key: "comingOfAgeStyleHipHop" },
              { value: "pop", label_key: "comingOfAgeStylePop" },
              { value: "trap", label_key: "comingOfAgeStyleTrap" },
              { value: "lofi", label_key: "comingOfAgeStyleLofi" }
            ]
          },
          {
            id: "songVibe",
            field_name: "songVibe",
            field_type: "select",
            placeholder_key: "selectSongVibe",
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
            placeholder_key: "comingOfAgeFavoriteArtistsPlaceholder",
            required: false,
            field_order: 3
          }
        ]
      }
    ]
  }
];

export const addOns: Addon[] = [
  {
    id: "addon-rush-delivery",
    addon_key: "rushDelivery",
    label_key: "rushDelivery",
    description_key: "rushDeliveryDesc",
    price_ron: 100,
    price_eur: 20,
    is_active: true
  },
  {
    id: "addon-social-media-rights",
    addon_key: "socialMediaRights",
    label_key: "socialMediaRights",
    description_key: "socialMediaRightsDesc",
    price_ron: 0,
    price_eur: 0,
    is_active: true
  },
  {
    id: "addon-mango-records-distribution",
    addon_key: "mangoRecordsDistribution",
    label_key: "mangoRecordsDistribution",
    description_key: "mangoRecordsDistributionDesc",
    price_ron: 200,
    price_eur: 40,
    is_active: true
  },
  {
    id: "addon-custom-video",
    addon_key: "customVideo",
    label_key: "customVideo",
    description_key: "customVideoDesc",
    price_ron: 149,
    price_eur: 30,
    is_active: true,
    trigger_field_type: "file",
    trigger_field_config: {
      maxFiles: 20,
      maxTotalSizeMb: 150,
      allowedTypes: [".jpg", ".jpeg", ".png", ".mp4", ".mov"]
    }
  },
  {
    id: "addon-audio-message-from-sender",
    addon_key: "audioMessageFromSender",
    label_key: "audioMessageFromSender",
    description_key: "audioMessageFromSenderDesc",
    price_ron: 100,
    price_eur: 20,
    is_active: true,
    trigger_field_type: "audio-recorder",
    trigger_field_config: {
      maxDuration: 45
    }
  },
  {
    id: "addon-branded-audio-message",
    addon_key: "brandedAudioMessage",
    label_key: "brandedAudioMessage",
    description_key: "brandedAudioMessageDesc",
    price_ron: 0,
    price_eur: 0,
    is_active: true,
    trigger_field_type: "audio-recorder",
    trigger_field_config: {
      maxDuration: 30
    }
  },
  {
    id: "addon-commercial-rights-upgrade",
    addon_key: "commercialRightsUpgrade",
    label_key: "commercialRightsUpgrade",
    description_key: "commercialRightsUpgradeDesc",
    price_ron: 400,
    price_eur: 80,
    is_active: true
  },
  {
    id: "addon-extended-song",
    addon_key: "extendedSong",
    label_key: "extendedSong",
    description_key: "extendedSongDesc",
    price_ron: 49,
    price_eur: 10,
    is_active: true
  },
  {
    id: "addon-godparents-melody",
    addon_key: "godparentsMelody",
    label_key: "godparentsMelody",
    description_key: "godparentsMelodyDesc",
    price_ron: 199,
    price_eur: 40,
    is_active: true
  },
  {
    id: "addon-separated-stems",
    addon_key: "separatedStems",
    label_key: "separatedStems",
    description_key: "separatedStemsDesc",
    price_ron: 149,
    price_eur: 30,
    is_active: true
  }
];
