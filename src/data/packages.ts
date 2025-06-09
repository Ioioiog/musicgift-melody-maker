export const packages = [
  {
    id: "personal",
    value: "personal",
    label_key: "personalPackage",
    price: 299,
    delivery_time_key: "delivery14Days",
    popular: true,
    includes: [
      "professionalComposition",
      "personalizedLyrics", 
      "highQualityRecording",
      "mp3Download"
    ],
    steps: [
      {
        id: "story",
        title_key: "songStoryStep",
        fields: [
          {
            id: "recipient",
            type: "text",
            label_key: "recipientLabel",
            placeholder_key: "recipientPlaceholder",
            required: true
          },
          {
            id: "includeNameInSong",
            type: "radio",
            label_key: "includeNameInSongLabel",
            placeholder_key: "includeNameInSongPlaceholder",
            required: true,
            options: [
              { value: "yes", label_key: "yes" },
              { value: "no", label_key: "no" }
            ]
          },
          {
            id: "pronunciationAudio",
            type: "audio",
            label_key: "pronunciationAudioLabel",
            placeholder_key: "pronunciationAudioPlaceholder",
            required: false
          },
          {
            id: "occasion",
            type: "select",
            label_key: "occasionLabel",
            placeholder_key: "occasionPlaceholder",
            required: true,
            options: [
              { value: "birthday", label_key: "occasionBirthday" },
              { value: "anniversary", label_key: "occasionAnniversary" },
              { value: "wedding", label_key: "occasionWedding" },
              { value: "valentines", label_key: "occasionValentines" },
              { value: "christmas", label_key: "occasionChristmas" },
              { value: "graduation", label_key: "occasionGraduation" },
              { value: "mothersday", label_key: "occasionMothersDay" },
              { value: "fathersday", label_key: "occasionFathersDay" },
              { value: "justbecause", label_key: "occasionJustBecause" },
              { value: "other", label_key: "occasionOther" }
            ]
          },
          {
            id: "specialRequests",
            type: "textarea",
            label_key: "specialRequestsLabel",
            placeholder_key: "specialRequestsPlaceholder",
            required: false
          },
          {
            id: "deliveryInstructions",
            type: "textarea",
            label_key: "deliveryInstructionsLabel", 
            placeholder_key: "deliveryInstructionsPlaceholder",
            required: false
          }
        ]
      },
      {
        id: "personal",
        title_key: "personalDetailsStep",
        fields: [
          {
            id: "fullName",
            type: "text",
            label_key: "fullNameLabel",
            placeholder_key: "fullNamePlaceholder",
            required: true
          },
          {
            id: "birthDate",
            type: "date",
            label_key: "birthDateLabel",
            placeholder_key: "birthDatePlaceholder",
            required: false
          },
          {
            id: "gender",
            type: "select",
            label_key: "genderLabel",
            placeholder_key: "genderPlaceholder",
            required: false,
            options: [
              { value: "male", label_key: "male" },
              { value: "female", label_key: "female" },
              { value: "other", label_key: "other" }
            ]
          },
          {
            id: "relationship",
            type: "select",
            label_key: "relationshipLabel",
            placeholder_key: "relationshipPlaceholder",
            required: true,
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
            id: "relationshipText",
            type: "textarea",
            label_key: "relationshipTextLabel",
            placeholder_key: "relationshipTextPlaceholder",
            required: false
          }
        ]
      },
      {
        id: "content",
        title_key: "contactInfoStep",
        fields: [
          {
            id: "storyDetailed",
            type: "textarea",
            label_key: "storyDetailedLabel",
            placeholder_key: "storyDetailedPlaceholder",
            required: true
          },
          {
            id: "keywords",
            type: "textarea",
            label_key: "keywordsLabel",
            placeholder_key: "keywordsPlaceholder",
            required: false
          },
          {
            id: "keywordsAudio",
            type: "audio",
            label_key: "keywordsAudioLabel",
            placeholder_key: "keywordsAudioPlaceholder",
            required: false
          }
        ]
      },
      {
        id: "musical",
        title_key: "musicalPreferencesStep",
        fields: [
          {
            id: "favoriteGenre",
            type: "select",
            label_key: "favoriteGenreLabel",
            placeholder_key: "favoriteGenrePlaceholder",
            required: true,
            options: [
              { value: "pop", label_key: "stylePopContemporary" },
              { value: "rock", label_key: "styleRockBallad" },
              { value: "folk", label_key: "styleFolkAcoustic" },
              { value: "country", label_key: "styleCountry" },
              { value: "jazz", label_key: "styleJazzBlues" },
              { value: "classical", label_key: "styleClassical" },
              { value: "electronic", label_key: "styleElectronic" },
              { value: "hiphop", label_key: "styleHipHop" },
              { value: "rnb", label_key: "styleRnB" },
              { value: "reggae", label_key: "styleReggae" }
            ]
          },
          {
            id: "songLength",
            type: "select",
            label_key: "songLengthLabel",
            placeholder_key: "songLengthPlaceholder",
            required: false,
            options: [
              { value: "short", label_key: "short" },
              { value: "medium", label_key: "medium" },
              { value: "long", label_key: "long" }
            ]
          },
          {
            id: "instruments",
            type: "textarea",
            label_key: "instrumentsLabel",
            placeholder_key: "instrumentsPlaceholder",
            required: false
          },
          {
            id: "mood",
            type: "select",
            label_key: "moodLabel",
            placeholder_key: "moodPlaceholder",
            required: true,
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
            id: "lyricsTheme",
            type: "textarea",
            label_key: "lyricsThemeLabel",
            placeholder_key: "lyricsThemePlaceholder",
            required: false
          },
          {
            id: "styleReference",
            type: "text",
            label_key: "styleReferenceLabel",
            placeholder_key: "styleReferencePlaceholder",
            required: false
          },
          {
            id: "youtubeExample",
            type: "text",
            label_key: "youtubeExampleLabel",
            placeholder_key: "youtubeExamplePlaceholder",
            required: false
          },
          {
            id: "voiceGender",
            type: "radio",
            label_key: "voiceGenderLabel",
            placeholder_key: "voiceGenderPlaceholder",
            required: true,
            options: [
              { value: "feminine", label_key: "voiceFeminine" },
              { value: "masculine", label_key: "voiceMasculine" },
              { value: "duet", label_key: "voiceDuet" },
              { value: "choice", label_key: "voiceMusicGiftChoice" }
            ]
          },
          {
            id: "songLanguage",
            type: "select",
            label_key: "songLanguageLabel",
            placeholder_key: "songLanguagePlaceholder",
            required: true,
            options: [
              { value: "romanian", label_key: "romanianLanguage" },
              { value: "english", label_key: "englishLanguage" },
              { value: "french", label_key: "frenchLanguage" },
              { value: "italian", label_key: "italianLanguage" }
            ]
          }
        ]
      },
      {
        id: "contact",
        title_key: "contactDetailsStep",
        fields: [
          {
            id: "email",
            type: "email",
            label_key: "emailLabel",
            placeholder_key: "emailPlaceholder",
            required: true
          },
          {
            id: "phone",
            type: "text",
            label_key: "phoneLabel",
            placeholder_key: "phonePlaceholder",
            required: false
          },
          {
            id: "dedicationMessage",
            type: "textarea",
            label_key: "dedicationMessageLabel",
            placeholder_key: "dedicationMessagePlaceholder",
            required: false
          }
        ]
      }
    ]
  },
  {
    id: "premium",
    value: "premium",
    label_key: "premiumPackage",
    price: 699,
    delivery_time_key: "delivery21Days",
    premium: true,
    includes: [
      "professionalComposition",
      "personalizedLyrics",
      "highQualityRecording",
      "globalDistribution",
      "mp3Download",
      "mixedMastered"
    ],
    steps: [
      {
        id: "story",
        title_key: "songStoryStep",
        fields: [
          {
            id: "recipient",
            type: "text",
            label_key: "recipientLabel",
            placeholder_key: "recipientPlaceholder",
            required: true
          },
          {
            id: "includeNameInSong",
            type: "radio",
            label_key: "includeNameInSongLabel",
            placeholder_key: "includeNameInSongPlaceholder",
            required: true,
            options: [
              { value: "yes", label_key: "yes" },
              { value: "no", label_key: "no" }
            ]
          },
          {
            id: "pronunciationAudio",
            type: "audio",
            label_key: "pronunciationAudioLabel",
            placeholder_key: "pronunciationAudioPlaceholder",
            required: false
          },
          {
            id: "occasion",
            type: "select",
            label_key: "occasionLabel",
            placeholder_key: "occasionPlaceholder",
            required: true,
            options: [
              { value: "birthday", label_key: "occasionBirthday" },
              { value: "anniversary", label_key: "occasionAnniversary" },
              { value: "wedding", label_key: "occasionWedding" },
              { value: "valentines", label_key: "occasionValentines" },
              { value: "christmas", label_key: "occasionChristmas" },
              { value: "graduation", label_key: "occasionGraduation" },
              { value: "mothersday", label_key: "occasionMothersDay" },
              { value: "fathersday", label_key: "occasionFathersDay" },
              { value: "justbecause", label_key: "occasionJustBecause" },
              { value: "other", label_key: "occasionOther" }
            ]
          },
          {
            id: "specialRequests",
            type: "textarea",
            label_key: "specialRequestsLabel",
            placeholder_key: "specialRequestsPlaceholder",
            required: false
          },
          {
            id: "deliveryInstructions",
            type: "textarea",
            label_key: "deliveryInstructionsLabel", 
            placeholder_key: "deliveryInstructionsPlaceholder",
            required: false
          }
        ]
      },
      {
        id: "personal",
        title_key: "personalDetailsStep",
        fields: [
          {
            id: "fullName",
            type: "text",
            label_key: "fullNameLabel",
            placeholder_key: "fullNamePlaceholder",
            required: true
          },
          {
            id: "birthDate",
            type: "date",
            label_key: "birthDateLabel",
            placeholder_key: "birthDatePlaceholder",
            required: false
          },
          {
            id: "gender",
            type: "select",
            label_key: "genderLabel",
            placeholder_key: "genderPlaceholder",
            required: false,
            options: [
              { value: "male", label_key: "male" },
              { value: "female", label_key: "female" },
              { value: "other", label_key: "other" }
            ]
          },
          {
            id: "relationship",
            type: "select",
            label_key: "relationshipLabel",
            placeholder_key: "relationshipPlaceholder",
            required: true,
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
            id: "relationshipText",
            type: "textarea",
            label_key: "relationshipTextLabel",
            placeholder_key: "relationshipTextPlaceholder",
            required: false
          }
        ]
      },
      {
        id: "content",
        title_key: "contactInfoStep",
        fields: [
          {
            id: "storyDetailed",
            type: "textarea",
            label_key: "storyDetailedLabel",
            placeholder_key: "storyDetailedPlaceholder",
            required: true
          },
          {
            id: "keywords",
            type: "textarea",
            label_key: "keywordsLabel",
            placeholder_key: "keywordsPlaceholder",
            required: false
          },
          {
            id: "keywordsAudio",
            type: "audio",
            label_key: "keywordsAudioLabel",
            placeholder_key: "keywordsAudioPlaceholder",
            required: false
          }
        ]
      },
      {
        id: "musical",
        title_key: "musicalPreferencesStep",
        fields: [
          {
            id: "favoriteGenre",
            type: "select",
            label_key: "favoriteGenreLabel",
            placeholder_key: "favoriteGenrePlaceholder",
            required: true,
            options: [
              { value: "pop", label_key: "stylePopContemporary" },
              { value: "rock", label_key: "styleRockBallad" },
              { value: "folk", label_key: "styleFolkAcoustic" },
              { value: "country", label_key: "styleCountry" },
              { value: "jazz", label_key: "styleJazzBlues" },
              { value: "classical", label_key: "styleClassical" },
              { value: "electronic", label_key: "styleElectronic" },
              { value: "hiphop", label_key: "styleHipHop" },
              { value: "rnb", label_key: "styleRnB" },
              { value: "reggae", label_key: "styleReggae" }
            ]
          },
          {
            id: "songLength",
            type: "select",
            label_key: "songLengthLabel",
            placeholder_key: "songLengthPlaceholder",
            required: false,
            options: [
              { value: "short", label_key: "short" },
              { value: "medium", label_key: "medium" },
              { value: "long", label_key: "long" }
            ]
          },
          {
            id: "instruments",
            type: "textarea",
            label_key: "instrumentsLabel",
            placeholder_key: "instrumentsPlaceholder",
            required: false
          },
          {
            id: "mood",
            type: "select",
            label_key: "moodLabel",
            placeholder_key: "moodPlaceholder",
            required: true,
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
            id: "lyricsTheme",
            type: "textarea",
            label_key: "lyricsThemeLabel",
            placeholder_key: "lyricsThemePlaceholder",
            required: false
          },
          {
            id: "styleReference",
            type: "text",
            label_key: "styleReferenceLabel",
            placeholder_key: "styleReferencePlaceholder",
            required: false
          },
          {
            id: "youtubeExample",
            type: "text",
            label_key: "youtubeExampleLabel",
            placeholder_key: "youtubeExamplePlaceholder",
            required: false
          },
          {
            id: "voiceGender",
            type: "radio",
            label_key: "voiceGenderLabel",
            placeholder_key: "voiceGenderPlaceholder",
            required: true,
            options: [
              { value: "feminine", label_key: "voiceFeminine" },
              { value: "masculine", label_key: "voiceMasculine" },
              { value: "duet", label_key: "voiceDuet" },
              { value: "choice", label_key: "voiceMusicGiftChoice" }
            ]
          },
          {
            id: "songLanguage",
            type: "select",
            label_key: "songLanguageLabel",
            placeholder_key: "songLanguagePlaceholder",
            required: true,
            options: [
              { value: "romanian", label_key: "romanianLanguage" },
              { value: "english", label_key: "englishLanguage" },
              { value: "french", label_key: "frenchLanguage" },
              { value: "italian", label_key: "italianLanguage" }
            ]
          }
        ]
      },
      {
        id: "contact",
        title_key: "contactDetailsStep",
        fields: [
          {
            id: "email",
            type: "email",
            label_key: "emailLabel",
            placeholder_key: "emailPlaceholder",
            required: true
          },
          {
            id: "phone",
            type: "text",
            label_key: "phoneLabel",
            placeholder_key: "phonePlaceholder",
            required: false
          },
          {
            id: "dedicationMessage",
            type: "textarea",
            label_key: "dedicationMessageLabel",
            placeholder_key: "dedicationMessagePlaceholder",
            required: false
          }
        ]
      }
    ]
  }
];

// Define the PackageData type
export interface PackageData {
  id: string;
  value: string;
  label_key: string;
  price: number;
  delivery_time_key: string;
  popular?: boolean;
  premium?: boolean;
  includes: string[];
  steps: Array<{
    id: string;
    title_key: string;
    fields: Array<{
      id: string;
      type: string;
      label_key: string;
      placeholder_key?: string;
      required: boolean;
      options?: Array<{ value: string; label_key: string; }>;
    }>;
  }>;
}

// Add-ons array (currently empty but needed for the hook)
export const addOns: Array<{
  id: string;
  name: string;
  description: string;
  price: number;
}> = [];
