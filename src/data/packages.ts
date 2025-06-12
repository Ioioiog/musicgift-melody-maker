import { Package, Addon } from '@/types';

export const packages: Package[] = [
  {
    id: "1",
    value: "personal",
    label_key: "personalPackage",
    tagline_key: "personalTagline", 
    description_key: "personalDescription",
    delivery_time_key: "personalDelivery",
    price_ron: 299,
    price_eur: 59,
    tag: "popular",
    is_active: true,
    is_popular: true,
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
          },
          {
            id: "vocalPreference",
            field_name: "vocalPreference",
            field_type: "select",
            placeholder_key: "selectVocalPreference",
            required: true,
            field_order: 4,
            options: [
              { value: "female", label_key: "voiceFemale" },
              { value: "male", label_key: "voiceMale" },
              { value: "duet", label_key: "voiceDuet" }
            ]
          },
          {
            id: "songStyleYoutube",
            field_name: "songStyleYoutube",
            field_type: "url",
            placeholder_key: "songStyleYoutubePlaceholder",
            required: false,
            field_order: 5
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
            id: "recipientNamePronunciation",
            field_name: "recipientNamePronunciation",
            field_type: "audio-recorder",
            placeholder_key: "recipientNamePronunciationPlaceholder",
            required: false,
            field_order: 2
          },
          {
            id: "recipientAge",
            field_name: "recipientAge",
            field_type: "text",
            placeholder_key: "recipientAgePlaceholder",
            required: false,
            field_order: 3
          },
          {
            id: "recipientRelation",
            field_name: "recipientRelation",
            field_type: "text",
            placeholder_key: "recipientRelationPlaceholder",
            required: true,
            field_order: 4
          },
          {
            id: "recipientPersonality",
            field_name: "recipientPersonality",
            field_type: "textarea",
            placeholder_key: "recipientPersonalityPlaceholder",
            required: true,
            field_order: 5
          },
          {
            id: "favoriteGenre",
            field_name: "favoriteGenre",
            field_type: "text",
            placeholder_key: "favoriteGenrePlaceholder",
            required: false,
            field_order: 6
          },
          {
            id: "hobbies",
            field_name: "hobbies",
            field_type: "textarea",
            placeholder_key: "hobbiesPlaceholder",
            required: false,
            field_order: 7
          },
          {
            id: "specialOccasion",
            field_name: "specialOccasion",
            field_type: "select",
            placeholder_key: "selectSpecialOccasion",
            required: false,
            field_order: 8,
            options: [
              { value: "birthday", label_key: "birthdayOccasion" },
              { value: "anniversary", label_key: "anniversaryOccasion" },
              { value: "valentine", label_key: "valentineOccasion" },
              { value: "graduation", label_key: "graduationOccasion" },
              { value: "wedding", label_key: "weddingOccasion" },
              { value: "other", label_key: "otherOccasion" }
            ]
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
            id: "sharedExperiences",
            field_name: "sharedExperiences",
            field_type: "textarea",
            placeholder_key: "sharedExperiencesPlaceholder",
            required: false,
            field_order: 3
          },
          {
            id: "insideJokes",
            field_name: "insideJokes",
            field_type: "textarea",
            placeholder_key: "insideJokesPlaceholder",
            required: false,
            field_order: 4
          },
          {
            id: "futureWishes",
            field_name: "futureWishes",
            field_type: "textarea",
            placeholder_key: "futureWishesPlaceholder",
            required: false,
            field_order: 5
          },
          {
            id: "additionalInfo",
            field_name: "additionalInfo",
            field_type: "textarea",
            placeholder_key: "additionalInfoPlaceholder",
            required: false,
            field_order: 6
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
    tag: "premium",
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
          },
          {
            id: "vocalPreference",
            field_name: "vocalPreference",
            field_type: "select",
            placeholder_key: "selectVocalPreference",
            required: true,
            field_order: 4,
            options: [
              { value: "female", label_key: "voiceFemale" },
              { value: "male", label_key: "voiceMale" },
              { value: "duet", label_key: "voiceDuet" }
            ]
          },
          {
            id: "songStyleYoutube",
            field_name: "songStyleYoutube",
            field_type: "url",
            placeholder_key: "songStyleYoutubePlaceholder",
            required: false,
            field_order: 5
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
            id: "recipientNamePronunciation",
            field_name: "recipientNamePronunciation",
            field_type: "audio-recorder",
            placeholder_key: "recipientNamePronunciationPlaceholder",
            required: false,
            field_order: 2
          },
          {
            id: "recipientAge",
            field_name: "recipientAge",
            field_type: "text",
            placeholder_key: "recipientAgePlaceholder",
            required: false,
            field_order: 3
          },
          {
            id: "recipientRelation",
            field_name: "recipientRelation",
            field_type: "text",
            placeholder_key: "recipientRelationPlaceholder",
            required: true,
            field_order: 4
          },
          {
            id: "recipientPersonality",
            field_name: "recipientPersonality",
            field_type: "textarea",
            placeholder_key: "recipientPersonalityPlaceholder",
            required: true,
            field_order: 5
          },
          {
            id: "favoriteGenre",
            field_name: "favoriteGenre",
            field_type: "text",
            placeholder_key: "favoriteGenrePlaceholder",
            required: false,
            field_order: 6
          },
          {
            id: "hobbies",
            field_name: "hobbies",
            field_type: "textarea",
            placeholder_key: "hobbiesPlaceholder",
            required: false,
            field_order: 7
          },
          {
            id: "specialOccasion",
            field_name: "specialOccasion",
            field_type: "select",
            placeholder_key: "selectSpecialOccasion",
            required: false,
            field_order: 8,
            options: [
              { value: "birthday", label_key: "birthdayOccasion" },
              { value: "anniversary", label_key: "anniversaryOccasion" },
              { value: "valentine", label_key: "valentineOccasion" },
              { value: "graduation", label_key: "graduationOccasion" },
              { value: "wedding", label_key: "weddingOccasion" },
              { value: "other", label_key: "otherOccasion" }
            ]
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
            id: "sharedExperiences",
            field_name: "sharedExperiences",
            field_type: "textarea",
            placeholder_key: "sharedExperiencesPlaceholder",
            required: false,
            field_order: 3
          },
          {
            id: "insideJokes",
            field_name: "insideJokes",
            field_type: "textarea",
            placeholder_key: "insideJokesPlaceholder",
            required: false,
            field_order: 4
          },
          {
            id: "futureWishes",
            field_name: "futureWishes",
            field_type: "textarea",
            placeholder_key: "futureWishesPlaceholder",
            required: false,
            field_order: 5
          },
          {
            id: "additionalInfo",
            field_name: "additionalInfo",
            field_type: "textarea",
            placeholder_key: "additionalInfoPlaceholder",
            required: false,
            field_order: 6
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
          },
          {
            id: "companySize",
            field_name: "companySize",
            field_type: "select",
            placeholder_key: "selectCompanySize",
            required: true,
            field_order: 4,
            options: [
              { value: "startup", label_key: "companySizeStartup" },
              { value: "small", label_key: "companySizeSmall" },
              { value: "medium", label_key: "companySizeMedium" },
              { value: "large", label_key: "companySizeLarge" }
            ]
          },
          {
            id: "targetMarket",
            field_name: "targetMarket",
            field_type: "textarea",
            placeholder_key: "targetMarketPlaceholder",
            required: true,
            field_order: 5
          },
          {
            id: "brandPersonality",
            field_name: "brandPersonality",
            field_type: "select",
            placeholder_key: "selectBrandPersonality",
            required: true,
            field_order: 6,
            options: [
              { value: "professional", label_key: "brandPersonalityProfessional" },
              { value: "friendly", label_key: "brandPersonalityFriendly" },
              { value: "innovative", label_key: "brandPersonalityInnovative" },
              { value: "trustworthy", label_key: "brandPersonalityTrustworthy" },
              { value: "energetic", label_key: "brandPersonalityEnergetic" },
              { value: "sophisticated", label_key: "brandPersonalitySophisticated" }
            ]
          },
          {
            id: "companyHistory",
            field_name: "companyHistory",
            field_type: "textarea",
            placeholder_key: "companyHistoryPlaceholder",
            required: false,
            field_order: 7
          },
          {
            id: "uniqueSellingProposition",
            field_name: "uniqueSellingProposition",
            field_type: "textarea",
            placeholder_key: "uniqueSellingPropositionPlaceholder",
            required: true,
            field_order: 8
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
          },
          {
            id: "usageContext",
            field_name: "usageContext",
            field_type: "select",
            placeholder_key: "selectUsageContext",
            required: true,
            field_order: 5,
            options: [
              { value: "companyEvents", label_key: "usageContextCompanyEvents" },
              { value: "marketingCampaigns", label_key: "usageContextMarketingCampaigns" },
              { value: "websiteSocialMedia", label_key: "usageContextWebsiteSocialMedia" },
              { value: "tradeShows", label_key: "usageContextTradeShows" },
              { value: "internalMotivation", label_key: "usageContextInternalMotivation" },
              { value: "customerExperience", label_key: "usageContextCustomerExperience" }
            ]
          },
          {
            id: "desiredEmotionalResponse",
            field_name: "desiredEmotionalResponse",
            field_type: "select",
            placeholder_key: "selectDesiredEmotionalResponse",
            required: true,
            field_order: 6,
            options: [
              { value: "trust", label_key: "emotionalResponseTrust" },
              { value: "excitement", label_key: "emotionalResponseExcitement" },
              { value: "inspiration", label_key: "emotionalResponseInspiration" },
              { value: "confidence", label_key: "emotionalResponseConfidence" },
              { value: "nostalgia", label_key: "emotionalResponseNostalgia" },
              { value: "pride", label_key: "emotionalResponsePride" }
            ]
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
          },
          {
            id: "competitorAnalysis",
            field_name: "competitorAnalysis",
            field_type: "textarea",
            placeholder_key: "competitorAnalysisPlaceholder",
            required: false,
            field_order: 4
          },
          {
            id: "callToAction",
            field_name: "callToAction",
            field_type: "text",
            placeholder_key: "callToActionPlaceholder",
            required: false,
            field_order: 5
          },
          {
            id: "seasonalTemporalRelevance",
            field_name: "seasonalTemporalRelevance",
            field_type: "text",
            placeholder_key: "seasonalTemporalRelevancePlaceholder",
            required: false,
            field_order: 6
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
          },
          {
            id: "realName",
            field_name: "realName",
            field_type: "text",
            placeholder_key: "realNamePlaceholder",
            required: true,
            field_order: 4
          },
          {
            id: "yearsActive",
            field_name: "yearsActive",
            field_type: "text",
            placeholder_key: "yearsActivePlaceholder",
            required: true,
            field_order: 5
          },
          {
            id: "previousReleases",
            field_name: "previousReleases",
            field_type: "textarea",
            placeholder_key: "previousReleasesPlaceholder",
            required: false,
            field_order: 6
          },
          {
            id: "performanceExperience",
            field_name: "performanceExperience",
            field_type: "textarea",
            placeholder_key: "performanceExperiencePlaceholder",
            required: true,
            field_order: 7
          },
          {
            id: "socialMediaFollowing",
            field_name: "socialMediaFollowing",
            field_type: "text",
            placeholder_key: "socialMediaFollowingPlaceholder",
            required: false,
            field_order: 8
          },
          {
            id: "musicEducationTraining",
            field_name: "musicEducationTraining",
            field_type: "textarea",
            placeholder_key: "musicEducationTrainingPlaceholder",
            required: false,
            field_order: 9
          },
          {
            id: "careerGoals",
            field_name: "careerGoals",
            field_type: "textarea",
            placeholder_key: "careerGoalsPlaceholder",
            required: true,
            field_order: 10
          },
          {
            id: "targetAudience",
            field_name: "targetAudience",
            field_type: "textarea",
            placeholder_key: "targetAudiencePlaceholder",
            required: true,
            field_order: 11
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
          },
          {
            id: "vocalStyle",
            field_name: "vocalStyle",
            field_type: "textarea",
            placeholder_key: "vocalStylePlaceholder",
            required: true,
            field_order: 4
          },
          {
            id: "lyricalThemes",
            field_name: "lyricalThemes",
            field_type: "textarea",
            placeholder_key: "lyricalThemesPlaceholder",
            required: true,
            field_order: 5
          },
          {
            id: "musicalComplexity",
            field_name: "musicalComplexity",
            field_type: "select",
            placeholder_key: "selectMusicalComplexity",
            required: true,
            field_order: 6,
            options: [
              { value: "simple", label_key: "musicalComplexitySimple" },
              { value: "moderate", label_key: "musicalComplexityModerate" },
              { value: "complex", label_key: "musicalComplexityComplex" }
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
          },
          {
            id: "marketingBudget",
            field_name: "marketingBudget",
            field_type: "select",
            placeholder_key: "selectMarketingBudget",
            required: false,
            field_order: 4,
            options: [
              { value: "under1000", label_key: "marketingBudgetUnder1000" },
              { value: "1000to5000", label_key: "marketingBudget1000to5000" },
              { value: "5000plus", label_key: "marketingBudget5000plus" },
              { value: "tbd", label_key: "marketingBudgetTBD" }
            ]
          },
          {
            id: "releaseStrategy",
            field_name: "releaseStrategy",
            field_type: "select",
            placeholder_key: "selectReleaseStrategy",
            required: true,
            field_order: 5,
            options: [
              { value: "single", label_key: "releaseStrategySingle" },
              { value: "ep", label_key: "releaseStrategyEP" },
              { value: "album", label_key: "releaseStrategyAlbum" }
            ]
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
    available_addons: ["rushDelivery", "mangoRecordsDistribution", "customVideo", "separatedStems"],
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
            id: "instrumentalLength",
            field_name: "instrumentalLength",
            field_type: "select",
            placeholder_key: "selectInstrumentalLength",
            required: true,
            field_order: 2,
            options: [
              { value: "1to2min", label_key: "instrumentalLength1to2" },
              { value: "2to3min", label_key: "instrumentalLength2to3" },
              { value: "3to4min", label_key: "instrumentalLength3to4" },
              { value: "4plusmin", label_key: "instrumentalLength4plus" }
            ]
          },
          {
            id: "instrumentalMood",
            field_name: "instrumentalMood",
            field_type: "select",
            placeholder_key: "selectInstrumentalMood",
            required: true,
            field_order: 3,
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
            field_order: 4,
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
          },
          {
            id: "intendedUse",
            field_name: "intendedUse",
            field_type: "select",
            placeholder_key: "selectIntendedUse",
            required: true,
            field_order: 4,
            options: [
              { value: "backgroundMusic", label_key: "intendedUseBackgroundMusic" },
              { value: "vocalRecordingBase", label_key: "intendedUseVocalRecordingBase" },
              { value: "performance", label_key: "intendedUsePerformance" },
              { value: "meditationRelaxation", label_key: "intendedUseMeditationRelaxation" },
              { value: "contentCreation", label_key: "intendedUseContentCreation" }
            ]
          },
          {
            id: "loopRequirements",
            field_name: "loopRequirements",
            field_type: "checkbox",
            placeholder_key: "loopRequirementsPlaceholder",
            required: false,
            field_order: 5
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
          },
          {
            id: "coupleNamesPronunciation",
            field_name: "coupleNamesPronunciation",
            field_type: "audio-recorder",
            placeholder_key: "coupleNamesPronunciationPlaceholder",
            required: false,
            field_order: 4
          },
          {
            id: "relationshipDuration",
            field_name: "relationshipDuration",
            field_type: "text",
            placeholder_key: "relationshipDurationPlaceholder",
            required: false,
            field_order: 5
          },
          {
            id: "weddingDate",
            field_name: "weddingDate",
            field_type: "date",
            placeholder_key: "weddingDatePlaceholder",
            required: false,
            field_order: 6
          },
          {
            id: "weddingVenueType",
            field_name: "weddingVenueType",
            field_type: "select",
            placeholder_key: "selectWeddingVenueType",
            required: false,
            field_order: 7,
            options: [
              { value: "church", label_key: "weddingVenueChurch" },
              { value: "outdoor", label_key: "weddingVenueOutdoor" },
              { value: "beach", label_key: "weddingVenueBeach" },
              { value: "garden", label_key: "weddingVenueGarden" },
              { value: "ballroom", label_key: "weddingVenueBallroom" },
              { value: "destination", label_key: "weddingVenueDestination" },
              { value: "other", label_key: "weddingVenueOther" }
            ]
          },
          {
            id: "weddingThemeStyle",
            field_name: "weddingThemeStyle",
            field_type: "text",
            placeholder_key: "weddingThemeStylePlaceholder",
            required: false,
            field_order: 8
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
              { value: "male", label_key: "voiceMale" },   
              { value: "duet", label_key: "voiceDuet" }
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
          },
          {
            id: "childNamePronunciation",
            field_name: "childNamePronunciation",
            field_type: "audio-recorder",
            placeholder_key: "childNamePronunciationPlaceholder",
            required: false,
            field_order: 4
          },
          {
            id: "childAge",
            field_name: "childAge",
            field_type: "text",
            placeholder_key: "childAgePlaceholder",
            required: true,
            field_order: 5
          },
          {
            id: "parentsNames",
            field_name: "parentsNames",
            field_type: "text",
            placeholder_key: "parentsNamesPlaceholder",
            required: true,
            field_order: 6
          },
          {
            id: "familyTraditions",
            field_name: "familyTraditions",
            field_type: "textarea",
            placeholder_key: "familyTraditionsPlaceholder",
            required: false,
            field_order: 7
          },
          {
            id: "baptismDate",
            field_name: "baptismDate",
            field_type: "date",
            placeholder_key: "baptismDatePlaceholder",
            required: false,
            field_order: 8
          },
          {
            id: "churchVenue",
            field_name: "churchVenue",
            field_type: "text",
            placeholder_key: "churchVenuePlaceholder",
            required: false,
            field_order: 9
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
              { value: "male", label_key: "voiceMale" },   
              { value: "duet", label_key: "voiceDuet" }
            ]
          },
          {
            id: "blessingPrayerElements",
            field_name: "blessingPrayerElements",
            field_type: "textarea",
            placeholder_key: "blessingPrayerElementsPlaceholder",
            required: false,
            field_order: 4
          },
          {
            id: "childPersonality",
            field_name: "childPersonality",
            field_type: "textarea",
            placeholder_key: "childPersonalityPlaceholder",
            required: false,
            field_order: 5
          },
          {
            id: "futureHopes",
            field_name: "futureHopes",
            field_type: "textarea",
            placeholder_key: "futureHopesPlaceholder",
            required: false,
            field_order: 6
          },
          {
            id: "familyMessage",
            field_name: "familyMessage",
            field_type: "textarea",
            placeholder_key: "familyMessagePlaceholder",
            required: false,
            field_order: 7
          },
          {
            id: "godparentsMention",
            field_name: "godparentsMention",
            field_type: "checkbox",
            placeholder_key: "godparentsMentionPlaceholder",
            required: false,
            field_order: 8
          },
          {
            id: "godparentsNames",
            field_name: "godparentsNames",
            field_type: "text",
            placeholder_key: "godparentsNamesPlaceholder",
            required: false,
            field_order: 9
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
          },
          {
            id: "celebrantNamePronunciation",
            field_name: "celebrantNamePronunciation",
            field_type: "audio-recorder",
            placeholder_key: "celebrantNamePronunciationPlaceholder",
            required: false,
            field_order: 4
          },
          {
            id: "ageMilestone",
            field_name: "ageMilestone",
            field_type: "select",
            placeholder_key: "selectAgeMilestone",
            required: true,
            field_order: 5,
            options: [
              { value: "13th", label_key: "ageMilestone13th" },
              { value: "16th", label_key: "ageMilestone16th" },
              { value: "18th", label_key: "ageMilestone18th" },
              { value: "21st", label_key: "ageMilestone21st" },
              { value: "other", label_key: "ageMilestoneOther" }
            ]
          },
          {
            id: "personalAchievements",
            field_name: "personalAchievements",
            field_type: "textarea",
            placeholder_key: "personalAchievementsPlaceholder",
            required: false,
            field_order: 6
          },
          {
            id: "personalityTraits",
            field_name: "personalityTraits",
            field_type: "textarea",
            placeholder_key: "personalityTraitsPlaceholder",
            required: true,
            field_order: 7
          },
          {
            id: "futureAspirations",
            field_name: "futureAspirations",
            field_type: "textarea",
            placeholder_key: "futureAspirationsPlaceholder",
            required: false,
            field_order: 8
          },
          {
            id: "favoriteMemories",
            field_name: "favoriteMemories",
            field_type: "textarea",
            placeholder_key: "favoriteMemoriesPlaceholder",
            required: false,
            field_order: 9
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
              { value: "lofi", label_key: "comingOfAgeStyleLofi" },
              { value: "rock", label_key: "comingOfAgeStyleRock" },
              { value: "rnb", label_key: "comingOfAgeStyleRnB" },
              { value: "electronic", label_key: "comingOfAgeStyleElectronic" }
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
              { value: "dreamy", label_key: "comingOfAgeVibeDreamy" },
              { value: "motivational", label_key: "comingOfAgeVibeMotivational" },
              { value: "confident", label_key: "comingOfAgeVibeConfident" }
            ]
          },
          {
            id: "favoriteArtists",
            field_name: "favoriteArtists",
            field_type: "text",
            placeholder_key: "comingOfAgeFavoriteArtistsPlaceholder",
            required: false,
            field_order: 3
          },
          {
            id: "lyricalThemes",
            field_name: "lyricalThemes",
            field_type: "select",
            placeholder_key: "selectLyricalThemes",
            required: true,
            field_order: 4,
            options: [
              { value: "growingUp", label_key: "lyricalThemesGrowingUp" },
              { value: "dreams", label_key: "lyricalThemesDreams" },
              { value: "friendship", label_key: "lyricalThemesFriendship" },
              { value: "family", label_key: "lyricalThemesFamily" },
              { value: "independence", label_key: "lyricalThemesIndependence" },
              { value: "success", label_key: "lyricalThemesSuccess" },
              { value: "adventure", label_key: "lyricalThemesAdventure" }
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
              { value: "male", label_key: "voiceMale" },   
              { value: "duet", label_key: "voiceDuet" }
            ]
          },
          {
            id: "culturalReferences",
            field_name: "culturalReferences",
            field_type: "textarea",
            placeholder_key: "culturalReferencesPlaceholder",
            required: false,
            field_order: 5
          },
          {
            id: "energyLevel",
            field_name: "energyLevel",
            field_type: "select",
            placeholder_key: "selectEnergyLevel",
            required: true,
            field_order: 6,
            options: [
              { value: "highEnergy", label_key: "energyLevelHigh" },
              { value: "moderate", label_key: "energyLevelModerate" },
              { value: "chill", label_key: "energyLevelChill" },
              { value: "mixed", label_key: "energyLevelMixed" }
            ]
          },
          {
            id: "collaborationPreference",
            field_name: "collaborationPreference",
            field_type: "select",
            placeholder_key: "selectCollaborationPreference",
            required: false,
            field_order: 7,
            options: [
              { value: "soloArtist", label_key: "collaborationSolo" },
              { value: "featuredGuest", label_key: "collaborationFeatured" },
              { value: "groupChoir", label_key: "collaborationGroup" },
              { value: "spokenWord", label_key: "collaborationSpokenWord" }
            ]
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
    price_ron: 99,
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
    price_ron: 199,
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
    price_ron: 99,
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
    price_ron: 399,
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
