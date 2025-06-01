
export interface PackageData {
  id: string;
  value: string;
  label_key: string;
  price: number;
  tagline_key?: string;
  description_key?: string;
  delivery_time_key?: string;
  tags: Array<{
    tag_type: string;
    tag_label_key?: string;
    styling_class?: string;
  }>;
  includes: Array<{
    include_key: string;
    include_order: number;
  }>;
  steps: Array<{
    step_number: number;
    title_key: string;
    step_order: number;
    fields: Array<{
      field_name: string;
      field_type: string;
      placeholder_key?: string;
      required: boolean;
      field_order: number;
      options?: Array<{ value: string; label_key: string; }>;
      validations: any[];
      dependencies: any[];
    }>;
  }>;
  addons: any[];
}

export const packages: PackageData[] = [
  {
    id: "personal-package-id",
    value: "personal",
    label_key: "personalPackage",
    price: 300,
    tagline_key: "personalTagline",
    description_key: "personalDescription",
    delivery_time_key: "personalDelivery",
    tags: [
      {
        tag_type: "new",
        tag_label_key: "newTag",
        styling_class: "bg-green-100 text-green-800"
      }
    ],
    includes: [
      { include_key: "personalInclude1", include_order: 1 },
      { include_key: "personalInclude2", include_order: 2 },
      { include_key: "personalInclude3", include_order: 3 },
      { include_key: "personalInclude4", include_order: 4 },
      { include_key: "personalInclude5", include_order: 5 }
    ],
    steps: [
      {
        step_number: 1,
        title_key: "choosePackageStep",
        step_order: 1,
        fields: [
          {
            field_name: "package",
            field_type: "select",
            placeholder_key: "choosePersonalPackage",
            required: true,
            field_order: 1,
            validations: [],
            dependencies: []
          }
        ]
      },
      {
        step_number: 2,
        title_key: "personalDetailsStep",
        step_order: 2,
        fields: [
          {
            field_name: "fullName",
            field_type: "text",
            placeholder_key: "fullNamePlaceholder",
            required: true,
            field_order: 1,
            validations: [],
            dependencies: []
          },
          {
            field_name: "email",
            field_type: "email",
            placeholder_key: "emailPlaceholder",
            required: true,
            field_order: 2,
            validations: [],
            dependencies: []
          },
          {
            field_name: "phone",
            field_type: "text",
            placeholder_key: "phonePlaceholder",
            required: true,
            field_order: 3,
            validations: [],
            dependencies: []
          },
          {
            field_name: "language",
            field_type: "select",
            placeholder_key: "songLanguagePlaceholder",
            required: true,
            field_order: 4,
            options: [
              { value: "ro", label_key: "romanianLanguage" },
              { value: "en", label_key: "englishLanguage" },
              { value: "fr", label_key: "frenchLanguage" }
            ],
            validations: [],
            dependencies: []
          },
          {
            field_name: "occasion",
            field_type: "text",
            placeholder_key: "occasionPlaceholder",
            required: false,
            field_order: 5,
            validations: [],
            dependencies: []
          },
          {
            field_name: "pronunciationRecording",
            field_type: "file",
            placeholder_key: "pronunciationRecordingPlaceholder",
            required: false,
            field_order: 6,
            validations: [],
            dependencies: []
          }
        ]
      },
      {
        step_number: 3,
        title_key: "yourStoryStep",
        step_order: 3,
        fields: [
          {
            field_name: "story",
            field_type: "textarea",
            placeholder_key: "storyPlaceholder",
            required: true,
            field_order: 1,
            validations: [],
            dependencies: []
          },
          {
            field_name: "vibe",
            field_type: "text",
            placeholder_key: "vibePlaceholder",
            required: true,
            field_order: 2,
            validations: [],
            dependencies: []
          },
          {
            field_name: "youtubeLinks",
            field_type: "text",
            placeholder_key: "youtubeLinksPlaceholder",
            required: false,
            field_order: 3,
            validations: [],
            dependencies: []
          },
          {
            field_name: "importantKeywords",
            field_type: "text",
            placeholder_key: "importantKeywordsPlaceholder",
            required: false,
            field_order: 4,
            validations: [],
            dependencies: []
          },
          {
            field_name: "keywordsPronunciationRecording",
            field_type: "file",
            placeholder_key: "keywordsPronunciationPlaceholder",
            required: false,
            field_order: 5,
            validations: [],
            dependencies: []
          }
        ]
      },
      {
        step_number: 4,
        title_key: "addonsStep",
        step_order: 4,
        fields: [
          {
            field_name: "addons",
            field_type: "checkbox-group",
            placeholder_key: "selectAddonsPlaceholder",
            required: false,
            field_order: 1,
            validations: [],
            dependencies: []
          }
        ]
      },
      {
        step_number: 5,
        title_key: "distributionConfirmationStep",
        step_order: 5,
        fields: [
          {
            field_name: "acceptMention",
            field_type: "checkbox",
            placeholder_key: "acceptMentionPlaceholder",
            required: true,
            field_order: 1,
            validations: [],
            dependencies: []
          }
        ]
      }
    ],
    addons: []
  },
  {
    id: "premium-package-id",
    value: "premium",
    label_key: "premiumPackage",
    price: 500,
    tagline_key: "premiumTagline",
    description_key: "premiumDescription",
    delivery_time_key: "premiumDelivery",
    tags: [
      {
        tag_type: "hot",
        tag_label_key: "popularTag",
        styling_class: "bg-red-100 text-red-800"
      }
    ],
    includes: [
      { include_key: "premiumInclude1", include_order: 1 },
      { include_key: "premiumInclude2", include_order: 2 },
      { include_key: "premiumInclude3", include_order: 3 }
    ],
    steps: [
      {
        step_number: 1,
        title_key: "choosePackageStep",
        step_order: 1,
        fields: [
          {
            field_name: "package",
            field_type: "select",
            placeholder_key: "choosePremiumPackage",
            required: true,
            field_order: 1,
            validations: [],
            dependencies: []
          }
        ]
      },
      {
        step_number: 2,
        title_key: "personalDetailsStep",
        step_order: 2,
        fields: [
          {
            field_name: "fullName",
            field_type: "text",
            placeholder_key: "fullNamePlaceholder",
            required: true,
            field_order: 1,
            validations: [],
            dependencies: []
          },
          {
            field_name: "email",
            field_type: "email",
            placeholder_key: "emailPlaceholder",
            required: true,
            field_order: 2,
            validations: [],
            dependencies: []
          },
          {
            field_name: "phone",
            field_type: "text",
            placeholder_key: "phonePlaceholder",
            required: true,
            field_order: 3,
            validations: [],
            dependencies: []
          },
          {
            field_name: "language",
            field_type: "select",
            placeholder_key: "songLanguagePlaceholder",
            required: true,
            field_order: 4,
            options: [
              { value: "ro", label_key: "romanianLanguage" },
              { value: "en", label_key: "englishLanguage" },
              { value: "fr", label_key: "frenchLanguage" }
            ],
            validations: [],
            dependencies: []
          },
          {
            field_name: "occasion",
            field_type: "text",
            placeholder_key: "occasionPlaceholder",
            required: false,
            field_order: 5,
            validations: [],
            dependencies: []
          },
          {
            field_name: "pronunciationRecording",
            field_type: "file",
            placeholder_key: "pronunciationRecordingPlaceholder",
            required: false,
            field_order: 6,
            validations: [],
            dependencies: []
          }
        ]
      },
      {
        step_number: 3,
        title_key: "yourStoryStep",
        step_order: 3,
        fields: [
          {
            field_name: "story",
            field_type: "textarea",
            placeholder_key: "storyPlaceholder",
            required: true,
            field_order: 1,
            validations: [],
            dependencies: []
          },
          {
            field_name: "vibe",
            field_type: "text",
            placeholder_key: "vibePlaceholder",
            required: true,
            field_order: 2,
            validations: [],
            dependencies: []
          },
          {
            field_name: "youtubeLinks",
            field_type: "text",
            placeholder_key: "youtubeLinksPlaceholder",
            required: false,
            field_order: 3,
            validations: [],
            dependencies: []
          },
          {
            field_name: "importantKeywords",
            field_type: "text",
            placeholder_key: "importantKeywordsPlaceholder",
            required: false,
            field_order: 4,
            validations: [],
            dependencies: []
          },
          {
            field_name: "keywordsPronunciationRecording",
            field_type: "file",
            placeholder_key: "keywordsPronunciationPlaceholder",
            required: false,
            field_order: 5,
            validations: [],
            dependencies: []
          }
        ]
      },
      {
        step_number: 4,
        title_key: "addonsStep",
        step_order: 4,
        fields: [
          {
            field_name: "addons",
            field_type: "checkbox-group",
            placeholder_key: "selectAddonsPlaceholder",
            required: false,
            field_order: 1,
            validations: [],
            dependencies: []
          }
        ]
      },
      {
        step_number: 5,
        title_key: "distributionConfirmationStep",
        step_order: 5,
        fields: [
          {
            field_name: "acceptMangoDistribution",
            field_type: "checkbox",
            placeholder_key: "acceptMangoDistributionPlaceholder",
            required: true,
            field_order: 1,
            validations: [],
            dependencies: []
          }
        ]
      }
    ],
    addons: []
  },
  {
    id: "business-package-id",
    value: "business",
    label_key: "businessPackage",
    price: 500,
    tagline_key: "businessTagline",
    description_key: "businessDescription",
    delivery_time_key: "businessDelivery",
    tags: [
      {
        tag_type: "popular",
        tag_label_key: "popularTag",
        styling_class: "bg-blue-100 text-blue-800"
      }
    ],
    includes: [
      { include_key: "businessInclude1", include_order: 1 },
      { include_key: "businessInclude2", include_order: 2 },
      { include_key: "businessInclude3", include_order: 3 },
      { include_key: "businessInclude4", include_order: 4 }
    ],
    steps: [
      {
        step_number: 1,
        title_key: "choosePackageStep",
        step_order: 1,
        fields: [
          {
            field_name: "package",
            field_type: "select",
            placeholder_key: "chooseBusinessPackage",
            required: true,
            field_order: 1,
            validations: [],
            dependencies: []
          }
        ]
      },
      {
        step_number: 2,
        title_key: "companyDetailsStep",
        step_order: 2,
        fields: [
          {
            field_name: "companyName",
            field_type: "text",
            placeholder_key: "companyNamePlaceholder",
            required: true,
            field_order: 1,
            validations: [],
            dependencies: []
          },
          {
            field_name: "contactPerson",
            field_type: "text",
            placeholder_key: "contactPersonPlaceholder",
            required: true,
            field_order: 2,
            validations: [],
            dependencies: []
          },
          {
            field_name: "email",
            field_type: "email",
            placeholder_key: "emailPlaceholder",
            required: true,
            field_order: 3,
            validations: [],
            dependencies: []
          },
          {
            field_name: "phone",
            field_type: "text",
            placeholder_key: "phonePlaceholder",
            required: true,
            field_order: 4,
            validations: [],
            dependencies: []
          },
          {
            field_name: "language",
            field_type: "select",
            placeholder_key: "songLanguagePlaceholder",
            required: true,
            field_order: 5,
            options: [
              { value: "ro", label_key: "romanianLanguage" },
              { value: "en", label_key: "englishLanguage" },
              { value: "fr", label_key: "frenchLanguage" }
            ],
            validations: [],
            dependencies: []
          },
          {
            field_name: "pronunciationRecording",
            field_type: "file",
            placeholder_key: "companyPronunciationPlaceholder",
            required: false,
            field_order: 6,
            validations: [],
            dependencies: []
          }
        ]
      },
      {
        step_number: 3,
        title_key: "brandStoryStep",
        step_order: 3,
        fields: [
          {
            field_name: "brandStory",
            field_type: "textarea",
            placeholder_key: "brandStoryPlaceholder",
            required: true,
            field_order: 1,
            validations: [],
            dependencies: []
          },
          {
            field_name: "keyValues",
            field_type: "text",
            placeholder_key: "keyValuesPlaceholder",
            required: true,
            field_order: 2,
            validations: [],
            dependencies: []
          },
          {
            field_name: "youtubeLinks",
            field_type: "text",
            placeholder_key: "inspirationLinksPlaceholder",
            required: false,
            field_order: 3,
            validations: [],
            dependencies: []
          }
        ]
      },
      {
        step_number: 4,
        title_key: "addonsStep",
        step_order: 4,
        fields: [
          {
            field_name: "addons",
            field_type: "checkbox-group",
            placeholder_key: "selectAddonsPlaceholder",
            required: false,
            field_order: 1,
            validations: [],
            dependencies: []
          }
        ]
      }
    ],
    addons: []
  },
  {
    id: "artist-package-id",
    value: "artist",
    label_key: "artistPackage",
    price: 8000,
    tagline_key: "artistTagline",
    description_key: "artistDescription",
    delivery_time_key: "artistDelivery",
    tags: [
      {
        tag_type: "premium",
        tag_label_key: "premiumTag",
        styling_class: "bg-purple-100 text-purple-800"
      }
    ],
    includes: [
      { include_key: "artistInclude1", include_order: 1 },
      { include_key: "artistInclude2", include_order: 2 },
      { include_key: "artistInclude3", include_order: 3 },
      { include_key: "artistInclude4", include_order: 4 }
    ],
    steps: [
      {
        step_number: 1,
        title_key: "choosePackageStep",
        step_order: 1,
        fields: [
          {
            field_name: "package",
            field_type: "select",
            placeholder_key: "chooseArtistPackage",
            required: true,
            field_order: 1,
            validations: [],
            dependencies: []
          }
        ]
      },
      {
        step_number: 2,
        title_key: "artisticDataStep",
        step_order: 2,
        fields: [
          {
            field_name: "artistName",
            field_type: "text",
            placeholder_key: "artistNamePlaceholder",
            required: true,
            field_order: 1,
            validations: [],
            dependencies: []
          },
          {
            field_name: "email",
            field_type: "email",
            placeholder_key: "emailPlaceholder",
            required: true,
            field_order: 2,
            validations: [],
            dependencies: []
          },
          {
            field_name: "phone",
            field_type: "text",
            placeholder_key: "phonePlaceholder",
            required: true,
            field_order: 3,
            validations: [],
            dependencies: []
          },
          {
            field_name: "language",
            field_type: "select",
            placeholder_key: "songLanguagePlaceholder",
            required: true,
            field_order: 4,
            options: [
              { value: "ro", label_key: "romanianLanguage" },
              { value: "en", label_key: "englishLanguage" },
              { value: "fr", label_key: "frenchLanguage" }
            ],
            validations: [],
            dependencies: []
          },
          {
            field_name: "mediaLinks",
            field_type: "text",
            placeholder_key: "mediaLinksPlaceholder",
            required: false,
            field_order: 5,
            validations: [],
            dependencies: []
          },
          {
            field_name: "pressLinks",
            field_type: "text",
            placeholder_key: "pressLinksPlaceholder",
            required: false,
            field_order: 6,
            validations: [],
            dependencies: []
          }
        ]
      },
      {
        step_number: 3,
        title_key: "songConceptStep",
        step_order: 3,
        fields: [
          {
            field_name: "vision",
            field_type: "textarea",
            placeholder_key: "musicalVisionPlaceholder",
            required: true,
            field_order: 1,
            validations: [],
            dependencies: []
          },
          {
            field_name: "youtubeLinks",
            field_type: "text",
            placeholder_key: "youtubeLinksPlaceholder",
            required: false,
            field_order: 2,
            validations: [],
            dependencies: []
          }
        ]
      },
      {
        step_number: 4,
        title_key: "processAcceptanceStep",
        step_order: 4,
        fields: [
          {
            field_name: "acceptProcess",
            field_type: "checkbox",
            placeholder_key: "acceptProcessPlaceholder",
            required: true,
            field_order: 1,
            validations: [],
            dependencies: []
          },
          {
            field_name: "acceptContact",
            field_type: "checkbox",
            placeholder_key: "acceptContactPlaceholder",
            required: true,
            field_order: 2,
            validations: [],
            dependencies: []
          }
        ]
      }
    ],
    addons: []
  },
  {
    id: "remix-package-id",
    value: "remix",
    label_key: "remixPackage",
    price: 500,
    tagline_key: "remixTagline",
    description_key: "remixDescription",
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
      {
        step_number: 1,
        title_key: "remixInfoStep",
        step_order: 1,
        fields: [
          {
            field_name: "originalSongLink",
            field_type: "text",
            placeholder_key: "originalSongLinkPlaceholder",
            required: true,
            field_order: 1,
            validations: [],
            dependencies: []
          },
          {
            field_name: "uploadWAV",
            field_type: "file",
            placeholder_key: "uploadWAVPlaceholder",
            required: true,
            field_order: 2,
            validations: [],
            dependencies: []
          },
          {
            field_name: "genre",
            field_type: "text",
            placeholder_key: "remixGenrePlaceholder",
            required: true,
            field_order: 3,
            validations: [],
            dependencies: []
          }
        ]
      },
      {
        step_number: 2,
        title_key: "legalityContactStep",
        step_order: 2,
        fields: [
          {
            field_name: "ownershipConfirmation",
            field_type: "checkbox",
            placeholder_key: "ownershipConfirmationPlaceholder",
            required: true,
            field_order: 1,
            validations: [],
            dependencies: []
          },
          {
            field_name: "acceptContact",
            field_type: "checkbox",
            placeholder_key: "acceptContactPlaceholder",
            required: true,
            field_order: 2,
            validations: [],
            dependencies: []
          }
        ]
      }
    ],
    addons: []
  },
  {
    id: "instrumental-package-id",
    value: "instrumental",
    label_key: "instrumentalPackage",
    price: 500,
    tagline_key: "instrumentalTagline",
    description_key: "instrumentalDescription",
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
      {
        step_number: 1,
        title_key: "artisticDetailsStep",
        step_order: 1,
        fields: [
          {
            field_name: "artistName",
            field_type: "text",
            placeholder_key: "artistNamePlaceholder",
            required: true,
            field_order: 1,
            validations: [],
            dependencies: []
          },
          {
            field_name: "email",
            field_type: "email",
            placeholder_key: "emailPlaceholder",
            required: true,
            field_order: 2,
            validations: [],
            dependencies: []
          },
          {
            field_name: "phone",
            field_type: "text",
            placeholder_key: "phonePlaceholder",
            required: true,
            field_order: 3,
            validations: [],
            dependencies: []
          },
          {
            field_name: "language",
            field_type: "select",
            placeholder_key: "titleLanguagePlaceholder",
            required: true,
            field_order: 4,
            options: [
              { value: "ro", label_key: "romanianLanguage" },
              { value: "en", label_key: "englishLanguage" },
              { value: "fr", label_key: "frenchLanguage" }
            ],
            validations: [],
            dependencies: []
          }
        ]
      },
      {
        step_number: 2,
        title_key: "visionStyleStep",
        step_order: 2,
        fields: [
          {
            field_name: "genre",
            field_type: "text",
            placeholder_key: "instrumentalGenrePlaceholder",
            required: true,
            field_order: 1,
            validations: [],
            dependencies: []
          },
          {
            field_name: "mood",
            field_type: "text",
            placeholder_key: "moodAtmospherePlaceholder",
            required: true,
            field_order: 2,
            validations: [],
            dependencies: []
          },
          {
            field_name: "youtubeLinks",
            field_type: "text",
            placeholder_key: "youtubeLinksPlaceholder",
            required: false,
            field_order: 3,
            validations: [],
            dependencies: []
          }
        ]
      },
      {
        step_number: 3,
        title_key: "extraOptionsStep",
        step_order: 3,
        fields: [
          {
            field_name: "addons",
            field_type: "checkbox-group",
            placeholder_key: "selectAddonsPlaceholder",
            required: false,
            field_order: 1,
            validations: [],
            dependencies: []
          }
        ]
      }
    ],
    addons: []
  },
  {
    id: "gift-package-id",
    value: "gift",
    label_key: "giftPackage",
    price: 0,
    tagline_key: "giftTagline",
    description_key: "giftDescription",
    delivery_time_key: "giftDelivery",
    tags: [
      {
        tag_type: "special",
        tag_label_key: "giftTag",
        styling_class: "bg-pink-100 text-pink-800"
      }
    ],
    includes: [
      { include_key: "giftInclude1", include_order: 1 },
      { include_key: "giftInclude2", include_order: 2 },
      { include_key: "giftInclude3", include_order: 3 }
    ],
    steps: [
      {
        step_number: 1,
        title_key: "recipientDetailsStep",
        step_order: 1,
        fields: [
          {
            field_name: "recipientName",
            field_type: "text",
            placeholder_key: "giftRecipientNamePlaceholder",
            required: true,
            field_order: 1,
            validations: [],
            dependencies: []
          },
          {
            field_name: "recipientEmail",
            field_type: "email",
            placeholder_key: "recipientEmailPlaceholder",
            required: true,
            field_order: 2,
            validations: [],
            dependencies: []
          },
          {
            field_name: "personalMessage",
            field_type: "textarea",
            placeholder_key: "personalMessagePlaceholder",
            required: false,
            field_order: 3,
            validations: [],
            dependencies: []
          }
        ]
      },
      {
        step_number: 2,
        title_key: "deliveryConfirmationStep",
        step_order: 2,
        fields: [
          {
            field_name: "senderName",
            field_type: "text",
            placeholder_key: "senderNamePlaceholder",
            required: true,
            field_order: 1,
            validations: [],
            dependencies: []
          },
          {
            field_name: "senderEmail",
            field_type: "email",
            placeholder_key: "senderEmailPlaceholder",
            required: true,
            field_order: 2,
            validations: [],
            dependencies: []
          }
        ]
      }
    ],
    addons: []
  }
];

export const languages = [
  { value: 'ro', labelKey: 'romanian', flag: '🇷🇴' },
  { value: 'en', labelKey: 'english', flag: '🇺🇸' },
  { value: 'fr', labelKey: 'french', flag: '🇫🇷' },
  { value: 'de', labelKey: 'german', flag: '🇩🇪' },
  { value: 'pl', labelKey: 'polish', flag: '🇵🇱' },
];

export const addons = {
  rushDelivery: { labelKey: 'rushDelivery', price: 100 },
  commercialRights: { labelKey: 'commercialRights', price: 100 },
  distributionMangoRecords: { labelKey: 'distributionMangoRecords', price: 200 },
  customVideo: { labelKey: 'customVideo', price: 149 },
  audioMessageFromSender: { labelKey: 'audioMessageFromSender', price: 100 },
  extendedSong: { labelKey: 'extendedSong', price: 49 },
};
