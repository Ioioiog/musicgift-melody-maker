export interface PackageData {
  id: number;
  value: string;
  label_key: string;
  tagline_key: string;
  description_key: string;
  price_ron: number;
  price_eur: number;
  delivery_time_key: string;
  is_active: boolean;
  is_popular: boolean;
  tag?: string;
  available_addons: string[];
  includes: Array<{
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
      label_key?: string;
      placeholder_key?: string;
      required: boolean;
      field_order: number;
      options?: Array<{ value: string; label_key: string }>;
    }>;
  }>;
}

export const packages: PackageData[] = [
  {
    id: 1,
    value: "personal",
    label_key: "personalPackage",
    tagline_key: "personalTagline", 
    description_key: "personalDescription",
    price_ron: 299,
    price_eur: 59,
    delivery_time_key: "personalDelivery",
    is_active: true,
    is_popular: true,
    tag: "popular",
    available_addons: ["rushDelivery", "socialMediaRights", "distributieMangoRecords", "customVideo", "audioMessageFromSender", "extendedSong"],
    includes: [
      { include_key: "personalInclude1", include_order: 1 },
      { include_key: "personalInclude2", include_order: 2 },
      { include_key: "personalInclude3", include_order: 3 },
      { include_key: "personalInclude4", include_order: 4 }
    ],
    steps: [
      {
        id: "step1",
        step_number: 1,
        title_key: "generalDetails",
        fields: [
          {
            id: "field1",
            field_name: "recipientName",
            field_type: "text",
            label_key: "recipientName",
            placeholder_key: "recipientName",
            required: true,
            field_order: 1
          },
          {
            id: "field2",
            field_name: "relationship",
            field_type: "select",
            label_key: "relationship",
            placeholder_key: "relationship",
            required: true,
            field_order: 2,
            options: [
              { value: "partner", label_key: "relationshipPartner" },
              { value: "spouse", label_key: "relationshipSpouse" },
              { value: "friend", label_key: "relationshipFriend" },
              { value: "family", label_key: "relationshipFamily" },
              { value: "child", label_key: "relationshipChild" },
              { value: "parent", label_key: "relationshipParent" },
              { value: "sibling", label_key: "relationshipSibling" },
              { value: "colleague", label_key: "relationshipColleague" },
              { value: "other", label_key: "relationshipOther" }
            ]
          },
          {
            id: "field3",
            field_name: "occasion",
            field_type: "select",
            label_key: "occasion",
            placeholder_key: "occasion",
            required: true,
            field_order: 3,
            options: [
              { value: "birthday", label_key: "occasionBirthday" },
              { value: "anniversary", label_key: "occasionAnniversary" },
              { value: "wedding", label_key: "occasionWedding" },
              { value: "valentines", label_key: "occasionValentines" },
              { value: "christmas", label_key: "occasionChristmas" },
              { value: "graduation", label_key: "occasionGraduation" },
              { value: "mothers_day", label_key: "occasionMothersDay" },
              { value: "fathers_day", label_key: "occasionFathersDay" },
              { value: "just_because", label_key: "occasionJustBecause" },
              { value: "other", label_key: "occasionOther" }
            ]
          },
          {
            id: "field4",
            field_name: "eventDate",
            field_type: "date",
            label_key: "eventDate",
            placeholder_key: "eventDate",
            required: false,
            field_order: 4
          },
          {
            id: "field5",
            field_name: "songLanguage",
            field_type: "select",
            label_key: "songLanguage",
            placeholder_key: "songLanguage",
            required: true,
            field_order: 5,
            options: [
              { value: "romanian", label_key: "romanianLanguage" },
              { value: "english", label_key: "englishLanguage" },
              { value: "french", label_key: "frenchLanguage" }
            ]
          },
          {
            id: "field6",
            field_name: "pronunciationAudio_recipient",
            field_type: "audio",
            label_key: "pronunciationAudioRecipient",
            placeholder_key: "pronunciationAudioRecipient",
            required: false,
            field_order: 6
          }
        ]
      },
      {
        id: "step2",
        step_number: 2,
        title_key: "storyAndEmotionalDetails",
        fields: [
          {
            id: "field7",
            field_name: "story",
            field_type: "textarea",
            label_key: "story",
            placeholder_key: "story",
            required: true,
            field_order: 1
          },
          {
            id: "field8",
            field_name: "emotionalTone",
            field_type: "select",
            label_key: "emotionalTone",
            placeholder_key: "emotionalTone",
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
            id: "field9",
            field_name: "keyMoments",
            field_type: "textarea",
            label_key: "keyMoments",
            placeholder_key: "keyMoments",
            required: true,
            field_order: 3
          },
          {
            id: "field10",
            field_name: "specialWords",
            field_type: "textarea",
            label_key: "specialWords",
            placeholder_key: "specialWords",
            required: false,
            field_order: 4
          },
          {
            id: "field11",
            field_name: "pronunciationAudio_keywords",
            field_type: "audio",
            label_key: "pronunciationAudioKeywords",
            placeholder_key: "pronunciationAudioKeywords",
            required: false,
            field_order: 5
          }
        ]
      },
      {
        id: "step3",
        step_number: 3,
        title_key: "musicalPreferences",
        fields: [
          {
            id: "field12",
            field_name: "musicStyle",
            field_type: "select",
            label_key: "musicStyle",
            placeholder_key: "musicStyle",
            required: true,
            field_order: 1,
            options: [
              { value: "pop_contemporary", label_key: "stylePopContemporary" },
              { value: "rock_ballad", label_key: "styleRockBallad" },
              { value: "folk_acoustic", label_key: "styleFolkAcoustic" },
              { value: "country", label_key: "styleCountry" },
              { value: "jazz_blues", label_key: "styleJazzBlues" },
              { value: "classical", label_key: "styleClassical" },
              { value: "electronic", label_key: "styleElectronic" },
              { value: "hip_hop", label_key: "styleHipHop" },
              { value: "rnb", label_key: "styleRnB" },
              { value: "reggae", label_key: "styleReggae" }
            ]
          },
          {
            id: "field13",
            field_name: "referenceSong",
            field_type: "text",
            label_key: "referenceSong",
            placeholder_key: "referenceSong",
            required: false,
            field_order: 2
          }
        ]
      }
    ]
  },
  {
    id: 2,
    value: "premium",
    label_key: "premiumPackage",
    tagline_key: "premiumTagline",
    description_key: "premiumDescription",
    price_ron: 499,
    price_eur: 99,
    delivery_time_key: "premiumDelivery",
    is_active: true,
    is_popular: false,
    tag: "premium",
    available_addons: ["rushDelivery", "customVideo", "audioMessageFromSender", "extendedSong"],
    includes: [
      { include_key: "premiumInclude1", include_order: 1 },
      { include_key: "premiumInclude2", include_order: 2 },
      { include_key: "premiumInclude3", include_order: 3 }
    ],
    steps: [
      {
        id: "step1",
        step_number: 1,
        title_key: "generalDetails",
        fields: [
          {
            id: "field1",
            field_name: "recipientName",
            field_type: "text",
            label_key: "recipientName",
            placeholder_key: "recipientName",
            required: true,
            field_order: 1
          },
          {
            id: "field2",
            field_name: "relationship",
            field_type: "select",
            label_key: "relationship",
            placeholder_key: "relationship",
            required: true,
            field_order: 2,
            options: [
              { value: "partner", label_key: "relationshipPartner" },
              { value: "spouse", label_key: "relationshipSpouse" },
              { value: "friend", label_key: "relationshipFriend" },
              { value: "family", label_key: "relationshipFamily" },
              { value: "child", label_key: "relationshipChild" },
              { value: "parent", label_key: "relationshipParent" },
              { value: "sibling", label_key: "relationshipSibling" },
              { value: "colleague", label_key: "relationshipColleague" },
              { value: "other", label_key: "relationshipOther" }
            ]
          },
          {
            id: "field3",
            field_name: "occasion",
            field_type: "select",
            label_key: "occasion",
            placeholder_key: "occasion",
            required: true,
            field_order: 3,
            options: [
              { value: "birthday", label_key: "occasionBirthday" },
              { value: "anniversary", label_key: "occasionAnniversary" },
              { value: "wedding", label_key: "occasionWedding" },
              { value: "valentines", label_key: "occasionValentines" },
              { value: "christmas", label_key: "occasionChristmas" },
              { value: "graduation", label_key: "occasionGraduation" },
              { value: "mothers_day", label_key: "occasionMothersDay" },
              { value: "fathers_day", label_key: "occasionFathersDay" },
              { value: "just_because", label_key: "occasionJustBecause" },
              { value: "other", label_key: "occasionOther" }
            ]
          },
          {
            id: "field4",
            field_name: "eventDate",
            field_type: "date",
            label_key: "eventDate",
            placeholder_key: "eventDate",
            required: false,
            field_order: 4
          },
          {
            id: "field5",
            field_name: "songLanguage",
            field_type: "select",
            label_key: "songLanguage",
            placeholder_key: "songLanguage",
            required: true,
            field_order: 5,
            options: [
              { value: "romanian", label_key: "romanianLanguage" },
              { value: "english", label_key: "englishLanguage" },
              { value: "french", label_key: "frenchLanguage" }
            ]
          }
        ]
      },
      {
        id: "step2",
        step_number: 2,
        title_key: "storyAndEmotionalDetails",
        fields: [
          {
            id: "field6",
            field_name: "story",
            field_type: "textarea",
            label_key: "story",
            placeholder_key: "story",
            required: true,
            field_order: 1
          },
          {
            id: "field7",
            field_name: "emotionalTone",
            field_type: "select",
            label_key: "emotionalTone",
            placeholder_key: "emotionalTone",
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
            id: "field8",
            field_name: "keyMoments",
            field_type: "textarea",
            label_key: "keyMoments",
            placeholder_key: "keyMoments",
            required: true,
            field_order: 3
          },
          {
            id: "field9",
            field_name: "specialWords",
            field_type: "textarea",
            label_key: "specialWords",
            placeholder_key: "specialWords",
            required: false,
            field_order: 4
          }
        ]
      },
      {
        id: "step3",
        step_number: 3,
        title_key: "musicalPreferences",
        fields: [
          {
            id: "field10",
            field_name: "musicStyle",
            field_type: "select",
            label_key: "musicStyle",
            placeholder_key: "musicStyle",
            required: true,
            field_order: 1,
            options: [
              { value: "pop_contemporary", label_key: "stylePopContemporary" },
              { value: "rock_ballad", label_key: "styleRockBallad" },
              { value: "folk_acoustic", label_key: "styleFolkAcoustic" },
              { value: "country", label_key: "styleCountry" },
              { value: "jazz_blues", label_key: "styleJazzBlues" },
              { value: "classical", label_key: "styleClassical" },
              { value: "electronic", label_key: "styleElectronic" },
              { value: "hip_hop", label_key: "styleHipHop" },
              { value: "rnb", label_key: "styleRnB" },
              { value: "reggae", label_key: "styleReggae" }
            ]
          },
          {
            id: "field11",
            field_name: "referenceSong",
            field_type: "text",
            label_key: "referenceSong",
            placeholder_key: "referenceSong",
            required: false,
            field_order: 2
          }
        ]
      },
      {
        id: "step4",
        step_number: 4,
        title_key: "premiumExtras",
        fields: [
          {
            id: "field12",
            field_name: "artistPreference",
            field_type: "select",
            label_key: "artistPreference",
            placeholder_key: "artistPreference",
            required: false,
            field_order: 1,
            options: [
              { value: "male", label_key: "maleVoice" },
              { value: "female", label_key: "femaleVoice" },
              { value: "no_preference", label_key: "noPreference" }
            ]
          },
          {
            id: "field13",
            field_name: "instrumentPreference",
            field_type: "select",
            label_key: "instrumentPreference",
            placeholder_key: "instrumentPreference",
            required: false,
            field_order: 2,
            options: [
              { value: "acoustic_guitar", label_key: "acousticGuitar" },
              { value: "piano", label_key: "piano" },
              { value: "electric_guitar", label_key: "electricGuitar" },
              { value: "violin", label_key: "violin" },
              { value: "full_band", label_key: "fullBand" },
              { value: "no_preference", label_key: "noPreference" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 3,
    value: "business",
    label_key: "businessPackage",
    tagline_key: "businessTagline",
    description_key: "businessDescription",
    price_ron: 499,
    price_eur: 99,
    delivery_time_key: "businessDelivery",
    is_active: true,
    is_popular: false,
    available_addons: ["rushDelivery", "customVideo", "brandedAudioMessage", "commercialRightsUpgrade", "distributieMangoRecords"],
    includes: [
      { include_key: "businessInclude1", include_order: 1 },
      { include_key: "businessInclude2", include_order: 2 },
      { include_key: "businessInclude3", include_order: 3 },
      { include_key: "businessInclude4", include_order: 4 },
      { include_key: "businessInclude5", include_order: 5 }
    ],
    steps: [
      {
        id: "step1",
        step_number: 1,
        title_key: "businessDetails",
        fields: [
          {
            id: "field1",
            field_name: "companyName",
            field_type: "text",
            label_key: "companyName",
            placeholder_key: "companyName",
            required: true,
            field_order: 1
          },
          {
            id: "field2",
            field_name: "targetAudience",
            field_type: "text",
            label_key: "targetAudience",
            placeholder_key: "targetAudience",
            required: true,
            field_order: 2
          },
          {
            id: "field3",
            field_name: "campaignPurpose",
            field_type: "select",
            label_key: "campaignPurpose",
            placeholder_key: "campaignPurpose",
            required: true,
            field_order: 3,
            options: [
              { value: "brand_awareness", label_key: "brandAwareness" },
              { value: "product_launch", label_key: "productLaunch" },
              { value: "employee_appreciation", label_key: "employeeAppreciation" },
              { value: "customer_loyalty", label_key: "customerLoyalty" },
              { value: "event_promotion", label_key: "eventPromotion" },
              { value: "other", label_key: "other" }
            ]
          },
          {
            id: "field4",
            field_name: "songLanguage",
            field_type: "select",
            label_key: "songLanguage",
            placeholder_key: "songLanguage",
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
        id: "step2",
        step_number: 2,
        title_key: "brandMessage",
        fields: [
          {
            id: "field5",
            field_name: "brandValues",
            field_type: "textarea",
            label_key: "brandValues",
            placeholder_key: "brandValues",
            required: true,
            field_order: 1
          },
          {
            id: "field6",
            field_name: "keyMessage",
            field_type: "textarea",
            label_key: "keyMessage",
            placeholder_key: "keyMessage",
            required: true,
            field_order: 2
          },
          {
            id: "field7",
            field_name: "emotionalTone",
            field_type: "select",
            label_key: "emotionalTone",
            placeholder_key: "emotionalTone",
            required: true,
            field_order: 3,
            options: [
              { value: "professional", label_key: "moodProfessional" },
              { value: "inspirational", label_key: "moodInspirational" },
              { value: "energetic", label_key: "moodEnergetic" },
              { value: "trustworthy", label_key: "moodTrustworthy" },
              { value: "innovative", label_key: "moodInnovative" },
              { value: "warm", label_key: "moodWarm" }
            ]
          }
        ]
      },
      {
        id: "step3",
        step_number: 3,
        title_key: "musicalPreferences",
        fields: [
          {
            id: "field8",
            field_name: "musicStyle",
            field_type: "select",
            label_key: "musicStyle",
            placeholder_key: "musicStyle",
            required: true,
            field_order: 1,
            options: [
              { value: "corporate", label_key: "styleCorporate" },
              { value: "pop_contemporary", label_key: "stylePopContemporary" },
              { value: "jazz_blues", label_key: "styleJazzBlues" },
              { value: "classical", label_key: "styleClassical" },
              { value: "electronic", label_key: "styleElectronic" },
              { value: "folk_acoustic", label_key: "styleFolkAcoustic" }
            ]
          },
          {
            id: "field9",
            field_name: "referenceSong",
            field_type: "text",
            label_key: "referenceSong",
            placeholder_key: "referenceSong",
            required: false,
            field_order: 2
          }
        ]
      }
    ]
  },
  {
    id: 4,
    value: "artist",
    label_key: "artistPackage",
    tagline_key: "artistTagline",
    description_key: "artistDescription",
    price_ron: 7999,
    price_eur: 1499,
    delivery_time_key: "artistDelivery",
    is_active: true,
    is_popular: false,
    available_addons: ["rushDelivery"],
    includes: [
      { include_key: "artistInclude1", include_order: 1 },
      { include_key: "artistInclude2", include_order: 2 },
      { include_key: "artistInclude3", include_order: 3 },
      { include_key: "artistInclude4", include_order: 4 }
    ],
    steps: [
      {
        id: "step1",
        step_number: 1,
        title_key: "artistProfile",
        fields: [
          {
            id: "field1",
            field_name: "artistName",
            field_type: "text",
            label_key: "artistName",
            placeholder_key: "artistName",
            required: true,
            field_order: 1
          },
          {
            id: "field2",
            field_name: "artistGenre",
            field_type: "select",
            label_key: "artistGenre",
            placeholder_key: "artistGenre",
            required: true,
            field_order: 2,
            options: [
              { value: "pop", label_key: "genrePop" },
              { value: "rock", label_key: "genreRock" },
              { value: "folk", label_key: "genreFolk" },
              { value: "jazz", label_key: "genreJazz" },
              { value: "classical", label_key: "genreClassical" },
              { value: "electronic", label_key: "genreElectronic" },
              { value: "hip_hop", label_key: "genreHipHop" },
              { value: "rnb", label_key: "genreRnB" }
            ]
          },
          {
            id: "field3",
            field_name: "careerStage",
            field_type: "select",
            label_key: "careerStage",
            placeholder_key: "careerStage",
            required: true,
            field_order: 3,
            options: [
              { value: "emerging", label_key: "stageEmerging" },
              { value: "developing", label_key: "stageDeveloping" },
              { value: "established", label_key: "stageEstablished" },
              { value: "veteran", label_key: "stageVeteran" }
            ]
          },
          {
            id: "field4",
            field_name: "songLanguage",
            field_type: "select",
            label_key: "songLanguage",
            placeholder_key: "songLanguage",
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
        id: "step2",
        step_number: 2,
        title_key: "songConcept",
        fields: [
          {
            id: "field5",
            field_name: "songTheme",
            field_type: "textarea",
            label_key: "songTheme",
            placeholder_key: "songTheme",
            required: true,
            field_order: 1
          },
          {
            id: "field6",
            field_name: "targetAudience",
            field_type: "text",
            label_key: "targetAudience",
            placeholder_key: "targetAudience",
            required: true,
            field_order: 2
          },
          {
            id: "field7",
            field_name: "emotionalTone",
            field_type: "select",
            label_key: "emotionalTone",
            placeholder_key: "emotionalTone",
            required: true,
            field_order: 3,
            options: [
              { value: "romantic", label_key: "moodRomantic" },
              { value: "energetic", label_key: "moodEnergetic" },
              { value: "melancholic", label_key: "moodMelancholic" },
              { value: "inspirational", label_key: "moodInspirational" },
              { value: "rebellious", label_key: "moodRebellious" },
              { value: "nostalgic", label_key: "moodNostalgic" }
            ]
          }
        ]
      },
      {
        id: "step3",
        step_number: 3,
        title_key: "technicalRequirements",
        fields: [
          {
            id: "field8",
            field_name: "songStructure",
            field_type: "select",
            label_key: "songStructure",
            placeholder_key: "songStructure",
            required: true,
            field_order: 1,
            options: [
              { value: "verse_chorus", label_key: "structureVerseChorus" },
              { value: "verse_chorus_bridge", label_key: "structureVerseChorusBridge" },
              { value: "intro_verse_chorus_outro", label_key: "structureIntroVerseChorusOutro" },
              { value: "custom", label_key: "structureCustom" }
            ]
          },
          {
            id: "field9",
            field_name: "songDuration",
            field_type: "select",
            label_key: "songDuration",
            placeholder_key: "songDuration",
            required: true,
            field_order: 2,
            options: [
              { value: "2_3_minutes", label_key: "duration2to3" },
              { value: "3_4_minutes", label_key: "duration3to4" },
              { value: "4_5_minutes", label_key: "duration4to5" },
              { value: "custom", label_key: "durationCustom" }
            ]
          },
          {
            id: "field10",
            field_name: "instrumentalRequirements",
            field_type: "textarea",
            label_key: "instrumentalRequirements",
            placeholder_key: "instrumentalRequirements",
            required: false,
            field_order: 3
          }
        ]
      }
    ]
  },
  {
    id: 5,
    value: "remix",
    label_key: "remixPackage",
    tagline_key: "remixTagline",
    description_key: "remixDescription",
    price_ron: 499,
    price_eur: 99,
    delivery_time_key: "remixDelivery",
    is_active: true,
    is_popular: false,
    available_addons: ["rushDelivery", "distributieMangoRecords"],
    includes: [
      { include_key: "remixInclude1", include_order: 1 },
      { include_key: "remixInclude2", include_order: 2 },
      { include_key: "remixInclude3", include_order: 3 },
      { include_key: "remixInclude4", include_order: 4 },
      { include_key: "remixInclude5", include_order: 5 },
      { include_key: "remixInclude6", include_order: 6 }
    ],
    steps: [
      {
        id: "step1",
        step_number: 1,
        title_key: "originalSongDetails",
        fields: [
          {
            id: "field1",
            field_name: "originalSongTitle",
            field_type: "text",
            label_key: "originalSongTitle",
            placeholder_key: "originalSongTitle",
            required: true,
            field_order: 1
          },
          {
            id: "field2",
            field_name: "originalArtist",
            field_type: "text",
            label_key: "originalArtist",
            placeholder_key: "originalArtist",
            required: true,
            field_order: 2
          },
          {
            id: "field3",
            field_name: "songReference",
            field_type: "text",
            label_key: "songReference",
            placeholder_key: "songReference",
            required: true,
            field_order: 3
          },
          {
            id: "field4",
            field_name: "songLanguage",
            field_type: "select",
            label_key: "songLanguage",
            placeholder_key: "songLanguage",
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
        id: "step2",
        step_number: 2,
        title_key: "remixRequirements",
        fields: [
          {
            id: "field5",
            field_name: "remixStyle",
            field_type: "select",
            label_key: "remixStyle",
            placeholder_key: "remixStyle",
            required: true,
            field_order: 1,
            options: [
              { value: "acoustic", label_key: "styleAcoustic" },
              { value: "electronic", label_key: "styleElectronic" },
              { value: "rock", label_key: "styleRock" },
              { value: "jazz", label_key: "styleJazz" },
              { value: "orchestral", label_key: "styleOrchestral" },
              { value: "lo_fi", label_key: "styleLoFi" }
            ]
          },
          {
            id: "field6",
            field_name: "personalizations",
            field_type: "textarea",
            label_key: "personalizations",
            placeholder_key: "personalizations",
            required: true,
            field_order: 2
          },
          {
            id: "field7",
            field_name: "specialInstructions",
            field_type: "textarea",
            label_key: "specialInstructions",
            placeholder_key: "specialInstructions",
            required: false,
            field_order: 3
          }
        ]
      }
    ]
  },
  {
    id: 6,
    value: "instrumental",
    label_key: "instrumentalPackage",
    tagline_key: "instrumentalTagline",
    description_key: "instrumentalDescription",
    price_ron: 499,
    price_eur: 99,
    delivery_time_key: "instrumentalDelivery",
    is_active: true,
    is_popular: false,
    available_addons: ["rushDelivery", "customVideo", "distributieMangoRecords", "separatedStems"],
    includes: [
      { include_key: "instrumentalInclude1", include_order: 1 },
      { include_key: "instrumentalInclude2", include_order: 2 },
      { include_key: "instrumentalInclude3", include_order: 3 },
      { include_key: "instrumentalInclude4", include_order: 4 },
      { include_key: "instrumentalInclude5", include_order: 5 }
    ],
    steps: [
      {
        id: "step1",
        step_number: 1,
        title_key: "instrumentalConcept",
        fields: [
          {
            id: "field1",
            field_name: "instrumentalPurpose",
            field_type: "select",
            label_key: "instrumentalPurpose",
            placeholder_key: "instrumentalPurpose",
            required: true,
            field_order: 1,
            options: [
              { value: "background_music", label_key: "purposeBackgroundMusic" },
              { value: "meditation", label_key: "purposeMeditation" },
              { value: "workout", label_key: "purposeWorkout" },
              { value: "study", label_key: "purposeStudy" },
              { value: "relaxation", label_key: "purposeRelaxation" },
              { value: "commercial", label_key: "purposeCommercial" },
              { value: "performance", label_key: "purposePerformance" }
            ]
          },
          {
            id: "field2",
            field_name: "mood",
            field_type: "select",
            label_key: "mood",
            placeholder_key: "mood",
            required: true,
            field_order: 2,
            options: [
              { value: "calm", label_key: "moodCalm" },
              { value: "energetic", label_key: "moodEnergetic" },
              { value: "mysterious", label_key: "moodMysterious" },
              { value: "uplifting", label_key: "moodUplifting" },
              { value: "dramatic", label_key: "moodDramatic" },
              { value: "peaceful", label_key: "moodPeaceful" }
            ]
          },
          {
            id: "field3",
            field_name: "duration",
            field_type: "select",
            label_key: "duration",
            placeholder_key: "duration",
            required: true,
            field_order: 3,
            options: [
              { value: "1_2_minutes", label_key: "duration1to2" },
              { value: "2_3_minutes", label_key: "duration2to3" },
              { value: "3_4_minutes", label_key: "duration3to4" },
              { value: "4_5_minutes", label_key: "duration4to5" },
              { value: "custom", label_key: "durationCustom" }
            ]
          }
        ]
      },
      {
        id: "step2",
        step_number: 2,
        title_key: "instrumentalArrangement",
        fields: [
          {
            id: "field4",
            field_name: "primaryInstruments",
            field_type: "select",
            label_key: "primaryInstruments",
            placeholder_key: "primaryInstruments",
            required: true,
            field_order: 1,
            options: [
              { value: "piano", label_key: "instrumentPiano" },
              { value: "guitar", label_key: "instrumentGuitar" },
              { value: "violin", label_key: "instrumentViolin" },
              { value: "flute", label_key: "instrumentFlute" },
              { value: "saxophone", label_key: "instrumentSaxophone" },
              { value: "electronic", label_key: "instrumentElectronic" },
              { value: "full_orchestra", label_key: "instrumentFullOrchestra" }
            ]
          },
          {
            id: "field5",
            field_name: "musicStyle",
            field_type: "select",
            label_key: "musicStyle",
            placeholder_key: "musicStyle",
            required: true,
            field_order: 2,
            options: [
              { value: "classical", label_key: "styleClassical" },
              { value: "jazz", label_key: "styleJazz" },
              { value: "ambient", label_key: "styleAmbient" },
              { value: "cinematic", label_key: "styleCinematic" },
              { value: "minimalist", label_key: "styleMinimalist" },
              { value: "world", label_key: "styleWorld" }
            ]
          },
          {
            id: "field6",
            field_name: "referenceSong",
            field_type: "text",
            label_key: "referenceSong",
            placeholder_key: "referenceSong",
            required: false,
            field_order: 3
          }
        ]
      }
    ]
  },
  {
    id: 7,
    value: "plus",
    label_key: "plusPackage",
    tagline_key: "plusTagline",
    description_key: "plusDescription",
    price_ron: 1,
    price_eur: 1,
    delivery_time_key: "plusDelivery",
    is_active: true,
    is_popular: false,
    tag: "new",
    available_addons: [],
    includes: [
      { include_key: "plusInclude1", include_order: 1 },
      { include_key: "plusInclude2", include_order: 2 },
      { include_key: "plusInclude3", include_order: 3 }
    ],
    steps: [
      {
        id: "step1",
        step_number: 1,
        title_key: "basicDetails",
        fields: [
          {
            id: "field1",
            field_name: "songType",
            field_type: "select",
            label_key: "songType",
            placeholder_key: "songType",
            required: true,
            field_order: 1,
            options: [
              { value: "personal", label_key: "typePersonal" },
              { value: "promotional", label_key: "typePromotional" },
              { value: "educational", label_key: "typeEducational" }
            ]
          },
          {
            id: "field2",
            field_name: "songLanguage",
            field_type: "select",
            label_key: "songLanguage",
            placeholder_key: "songLanguage",
            required: true,
            field_order: 2,
            options: [
              { value: "romanian", label_key: "romanianLanguage" },
              { value: "english", label_key: "englishLanguage" },
              { value: "french", label_key: "frenchLanguage" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 8,
    value: "gift",
    label_key: "giftPackage",
    tagline_key: "giftTagline",
    description_key: "giftDescription",
    price_ron: 299,
    price_eur: 59,
    delivery_time_key: "giftDelivery",
    is_active: true,
    is_popular: false,
    tag: "gift",
    available_addons: [],
    includes: [
      { include_key: "giftInclude1", include_order: 1 },
      { include_key: "giftInclude2", include_order: 2 },
      { include_key: "giftInclude3", include_order: 3 }
    ],
    steps: []
  },
  {
    id: 9,
    value: "wedding",
    label_key: "weddingPackage",
    tagline_key: "weddingTagline",
    description_key: "weddingDescription",
    price_ron: 299,
    price_eur: 59,
    delivery_time_key: "weddingDelivery",
    is_active: true,
    is_popular: false,
    available_addons: ["rushDelivery", "socialMediaRights", "distributieMangoRecords", "customVideo", "audioMessageFromSender", "extendedSong", "godparentsmelody"],
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
    steps: [
      {
        id: "step1",
        step_number: 1,
        title_key: "coupleDetails",
        fields: [
          {
            id: "field1",
            field_name: "brideName",
            field_type: "text",
            label_key: "brideName",
            placeholder_key: "brideName",
            required: true,
            field_order: 1
          },
          {
            id: "field2",
            field_name: "groomName",
            field_type: "text",
            label_key: "groomName",
            placeholder_key: "groomName",
            required: true,
            field_order: 2
          },
          {
            id: "field3",
            field_name: "weddingDate",
            field_type: "date",
            label_key: "weddingDate",
            placeholder_key: "weddingDate",
            required: true,
            field_order: 3
          },
          {
            id: "field4",
            field_name: "songLanguage",
            field_type: "select",
            label_key: "songLanguage",
            placeholder_key: "songLanguage",
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
        id: "step2",
        step_number: 2,
        title_key: "loveStory",
        fields: [
          {
            id: "field5",
            field_name: "howYouMet",
            field_type: "textarea",
            label_key: "howYouMet",
            placeholder_key: "howYouMet",
            required: true,
            field_order: 1
          },
          {
            id: "field6",
            field_name: "specialMoments",
            field_type: "textarea",
            label_key: "specialMoments",
            placeholder_key: "specialMoments",
            required: true,
            field_order: 2
          },
          {
            id: "field7",
            field_name: "futureWishes",
            field_type: "textarea",
            label_key: "futureWishes",
            placeholder_key: "futureWishes",
            required: false,
            field_order: 3
          }
        ]
      },
      {
        id: "step3",
        step_number: 3,
        title_key: "musicalPreferences",
        fields: [
          {
            id: "field8",
            field_name: "musicStyle",
            field_type: "select",
            label_key: "musicStyle",
            placeholder_key: "musicStyle",
            required: true,
            field_order: 1,
            options: [
              { value: "romantic_ballad", label_key: "styleRomanticBallad" },
              { value: "acoustic_folk", label_key: "styleAcousticFolk" },
              { value: "classical", label_key: "styleClassical" },
              { value: "contemporary", label_key: "styleContemporary" },
              { value: "traditional", label_key: "styleTraditional" }
            ]
          },
          {
            id: "field9",
            field_name: "referenceSong",
            field_type: "text",
            label_key: "referenceSong",
            placeholder_key: "referenceSong",
            required: false,
            field_order: 2
          }
        ]
      }
    ]
  },
  {
    id: 10,
    value: "baptism",
    label_key: "baptismPackage",
    tagline_key: "baptismTagline",
    description_key: "baptismDescription",
    price_ron: 299,
    price_eur: 59,
    delivery_time_key: "baptismDelivery",
    is_active: true,
    is_popular: false,
    available_addons: ["rushDelivery", "socialMediaRights", "distributieMangoRecords", "customVideo", "audioMessageFromSender", "extendedSong"],
    includes: [
      { include_key: "baptismInclude1", include_order: 1 },
      { include_key: "baptismInclude2", include_order: 2 },
      { include_key: "baptismInclude3", include_order: 3 },
      { include_key: "baptismInclude4", include_order: 4 },
      { include_key: "baptismInclude5", include_order: 5 },
      { include_key: "baptismInclude6", include_order: 6 }
    ],
    steps: [
      {
        id: "step1",
        step_number: 1,
        title_key: "childDetails",
        fields: [
          {
            id: "field1",
            field_name: "childName",
            field_type: "text",
            label_key: "childName",
            placeholder_key: "childName",
            required: true,
            field_order: 1
          },
          {
            id: "field2",
            field_name: "baptismDate",
            field_type: "date",
            label_key: "baptismDate",
            placeholder_key: "baptismDate",
            required: true,
            field_order: 2
          },
          {
            id: "field3",
            field_name: "parentsNames",
            field_type: "text",
            label_key: "parentsNames",
            placeholder_key: "parentsNames",
            required: true,
            field_order: 3
          },
          {
            id: "field4",
            field_name: "godparentsNames",
            field_type: "text",
            label_key: "godparentsNames",
            placeholder_key: "godparentsNames",
            required: false,
            field_order: 4
          },
          {
            id: "field5",
            field_name: "songLanguage",
            field_type: "select",
            label_key: "songLanguage",
            placeholder_key: "songLanguage",
            required: true,
            field_order: 5,
            options: [
              { value: "romanian", label_key: "romanianLanguage" },
              { value: "english", label_key: "englishLanguage" },
              { value: "french", label_key: "frenchLanguage" }
            ]
          }
        ]
      },
      {
        id: "step2",
        step_number: 2,
        title_key: "blessingsAndWishes",
        fields: [
          {
            id: "field6",
            field_name: "blessings",
            field_type: "textarea",
            label_key: "blessings",
            placeholder_key: "blessings",
            required: true,
            field_order: 1
          },
          {
            id: "field7",
            field_name: "futureWishes",
            field_type: "textarea",
            label_key: "futureWishes",
            placeholder_key: "futureWishes",
            required: true,
            field_order: 2
          },
          {
            id: "field8",
            field_name: "specialMessage",
            field_type: "textarea",
            label_key: "specialMessage",
            placeholder_key: "specialMessage",
            required: false,
            field_order: 3
          }
        ]
      },
      {
        id: "step3",
        step_number: 3,
        title_key: "musicalPreferences",
        fields: [
          {
            id: "field9",
            field_name: "musicStyle",
            field_type: "select",
            label_key: "musicStyle",
            placeholder_key: "musicStyle",
            required: true,
            field_order: 1,
            options: [
              { value: "lullaby", label_key: "styleLullaby" },
              { value: "spiritual", label_key: "styleSpiritual" },
              { value: "gentle_folk", label_key: "styleGentleFolk" },
              { value: "classical", label_key: "styleClassical" },
              { value: "contemporary", label_key: "styleContemporary" }
            ]
          },
          {
            id: "field10",
            field_name: "referenceSong",
            field_type: "text",
            label_key: "referenceSong",
            placeholder_key: "referenceSong",
            required: false,
            field_order: 2
          }
        ]
      }
    ]
  },
  {
    id: 11,
    value: "comingOfAge",
    label_key: "comingOfAgePackage",
    tagline_key: "comingOfAgeTagline",
    description_key: "comingOfAgeDescription",
    price_ron: 299,
    price_eur: 59,
    delivery_time_key: "comingOfAgeDelivery",
    is_active: true,
    is_popular: false,
    available_addons: ["rushDelivery", "socialMediaRights", "distributieMangoRecords", "customVideo", "audioMessageFromSender", "extendedSong"],
    includes: [
      { include_key: "comingOfAgeInclude1", include_order: 1 },
      { include_key: "comingOfAgeInclude2", include_order: 2 },
      { include_key: "comingOfAgeInclude3", include_order: 3 },
      { include_key: "comingOfAgeInclude4", include_order: 4 },
      { include_key: "comingOfAgeInclude5", include_order: 5 },
      { include_key: "comingOfAgeInclude6", include_order: 6 }
    ],
    steps: [
      {
        id: "step1",
        step_number: 1,
        title_key: "celebrantDetails",
        fields: [
          {
            id: "field1",
            field_name: "celebrantName",
            field_type: "text",
            label_key: "celebrantName",
            placeholder_key: "celebrantName",
            required: true,
            field_order: 1
          },
          {
            id: "field2",
            field_name: "celebrationDate",
            field_type: "date",
            label_key: "celebrationDate",
            placeholder_key: "celebrationDate",
            required: true,
            field_order: 2
          },
          {
            id: "field3",
            field_name: "relationship",
            field_type: "select",
            label_key: "relationship",
            placeholder_key: "relationship",
            required: true,
            field_order: 3,
            options: [
              { value: "parent", label_key: "relationshipParent" },
              { value: "grandparent", label_key: "relationshipGrandparent" },
              { value: "godparent", label_key: "relationshipGodparent" },
              { value: "family", label_key: "relationshipFamily" },
              { value: "friend", label_key: "relationshipFriend" }
            ]
          },
          {
            id: "field4",
            field_name: "songLanguage",
            field_type: "select",
            label_key: "songLanguage",
            placeholder_key: "songLanguage",
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
        id: "step2",
        step_number: 2,
        title_key: "lifeJourneyAndWishes",
        fields: [
          {
            id: "field5",
            field_name: "personalityTraits",
            field_type: "textarea",
            label_key: "personalityTraits",
            placeholder_key: "personalityTraits",
            required: true,
            field_order: 1
          },
          {
            id: "field6",
            field_name: "achievements",
            field_type: "textarea",
            label_key: "achievements",
            placeholder_key: "achievements",
            required: true,
            field_order: 2
          },
          {
            id: "field7",
            field_name: "futureWishes",
            field_type: "textarea",
            label_key: "futureWishes",
            placeholder_key: "futureWishes",
            required: true,
            field_order: 3
          },
          {
            id: "field8",
            field_name: "specialMemories",
            field_type: "textarea",
            label_key: "specialMemories",
            placeholder_key: "specialMemories",
            required: false,
            field_order: 4
          }
        ]
      },
      {
        id: "step3",
        step_number: 3,
        title_key: "musicalPreferences",
        fields: [
          {
            id: "field9",
            field_name: "musicStyle",
            field_type: "select",
            label_key: "musicStyle",
            placeholder_key: "musicStyle",
            required: true,
            field_order: 1,
            options: [
              { value: "inspirational", label_key: "styleInspirational" },
              { value: "pop_contemporary", label_key: "stylePopContemporary" },
              { value: "folk_acoustic", label_key: "styleFolkAcoustic" },
              { value: "uplifting", label_key: "styleUplifting" },
              { value: "traditional", label_key: "styleTraditional" }
            ]
          },
          {
            id: "field10",
            field_name: "referenceSong",
            field_type: "text",
            label_key: "referenceSong",
            placeholder_key: "referenceSong",
            required: false,
            field_order: 2
          }
        ]
      }
    ]
  }
];

export const addOns = [
  {
    id: "1",
    addon_key: "rushDelivery",
    label_key: "rushDelivery",
    description_key: "rushDeliveryDesc",
    price_ron: 99,
    price_eur: 20,
    is_active: true,
    trigger_field_type: null,
    trigger_field_config: {},
    trigger_condition: "",
    trigger_condition_value: ""
  },
  {
    id: "2",
    addon_key: "socialMediaRights",
    label_key: "socialMediaRights",
    description_key: "socialMediaRightsDesc",
    price_ron: 0,
    price_eur: 0,
    is_active: true,
    trigger_field_type: null,
    trigger_field_config: {},
    trigger_condition: "",
    trigger_condition_value: ""
  },
  {
    id: "3",
    addon_key: "distributieMangoRecords",
    label_key: "distributieMangoRecords",
    description_key: "distributieMangoRecordsDesc",
    price_ron: 199,
    price_eur: 40,
    is_active: true,
    trigger_field_type: null,
    trigger_field_config: {},
    trigger_condition: "",
    trigger_condition_value: ""
  },
  {
    id: "4",
    addon_key: "customVideo",
    label_key: "customVideo",
    description_key: "customVideoDesc",
    price_ron: 149,
    price_eur: 30,
    is_active: true,
    trigger_field_type: "file",
    trigger_field_config: {
      allowedTypes: [".jpg", ".jpeg", ".png", ".mp4", ".mov"],
      maxFiles: 10,
      maxTotalSizeMb: 150
    },
    trigger_condition: "",
    trigger_condition_value: ""
  },
  {
    id: "5",
    addon_key: "audioMessageFromSender",
    label_key: "audioMessageFromSender",
    description_key: "audioMessageFromSenderDesc",
    price_ron: 99,
    price_eur: 20,
    is_active: true,
    trigger_field_type: "audio-recorder",
    trigger_field_config: {
      maxDuration: 30
    },
    trigger_condition: "",
    trigger_condition_value: ""
  },
  {
    id: "6",
    addon_key: "brandedAudioMessage",
    label_key: "brandedAudioMessage",
    description_key: "brandedAudioMessageDesc",
    price_ron: 0,
    price_eur: 0,
    is_active: true,
    trigger_field_type: "audio-recorder",
    trigger_field_config: {
      maxDuration: 15
    },
    trigger_condition: "",
    trigger_condition_value: ""
  },
  {
    id: "7",
    addon_key: "commercialRightsUpgrade",
    label_key: "commercialRightsUpgrade",
    description_key: "commercialRightsUpgradeDesc",
    price_ron: 399,
    price_eur: 80,
    is_active: true,
    trigger_field_type: null,
    trigger_field_config: {},
    trigger_condition: "",
    trigger_condition_value: ""
  },
  {
    id: "8",
    addon_key: "extendedSong",
    label_key: "extendedSong",
    description_key: "extendedSongDesc",
    price_ron: 49,
    price_eur: 10,
    is_active: true,
    trigger_field_type: null,
    trigger_field_config: {},
    trigger_condition: "",
    trigger_condition_value: ""
  },
  {
    id: "9",
    addon_key: "godparentsmelody",
    label_key: "godparentsmelody",
    description_key: "godparentsmelodyDesc",
    price_ron: 199,
    price_eur: 40,
    is_active: true,
    trigger_field_type: null,
    trigger_field_config: {},
    trigger_condition: "",
    trigger_condition_value: ""
  },
  {
    id: "10",
    addon_key: "separatedStems",
    label_key: "separatedStems",
    description_key: "separatedStemsDesc",
    price_ron: 149,
    price_eur: 30,
    is_active: true,
    trigger_field_type: null,
    trigger_field_config: {},
    trigger_condition: "",
    trigger_condition_value: ""
  }
];
