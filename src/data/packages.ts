import { v4 as uuidv4 } from 'uuid';

export const packages = [
  {
    id: "personal",
    value: "personal",
    label_key: "personalPackage",
    tagline_key: "personalTagline",
    description_key: "personalDescription",
    price_ron: 100,
    price_eur: 19,
    delivery_time_key: "personalDelivery",
    includes: [
      { text_key: "personalInclude1" },
      { text_key: "personalInclude2" },
      { text_key: "personalInclude3" },
      { text_key: "personalInclude4" }
    ],
    tags: ["popular"],
    steps: [
      {
        id: "song-story",
        title_key: "songStoryStep",
        fields: [
          {
            id: "recipient",
            field_name: "recipient",
            field_type: "text",
            label_key: "recipientLabel",
            placeholder_key: "recipientPlaceholder",
            required: true
          },
          {
            id: "include-name-in-song",
            field_name: "includeNameInSong",
            field_type: "checkbox",
            label_key: "includeNameInSongLabel",
            placeholder_key: "includeNameInSongPlaceholder",
            required: false
          },
          {
            id: "pronunciation-audio",
            field_name: "pronunciationAudio",
            field_type: "audio-recorder",
            label_key: "pronunciationAudioLabel",
            placeholder_key: "pronunciationAudioPlaceholder",
            required: false
          },
          {
            id: "occasion",
            field_name: "occasion",
            field_type: "text",
            label_key: "occasionLabel",
            placeholder_key: "occasionPlaceholder",
            required: true
          },
          {
            id: "special-requests",
            field_name: "specialRequests",
            field_type: "textarea",
            label_key: "specialRequestsLabel",
            placeholder_key: "specialRequestsPlaceholder",
            required: false
          }
        ]
      },
      {
        id: "personal-details",
        title_key: "personalDetailsStep",
        fields: [
          {
            id: "relationship",
            field_name: "relationship",
            field_type: "select",
            label_key: "relationshipLabel",
            placeholder_key: "relationshipPlaceholder",
            required: true,
            options: [
              { value: "partner", label_key: "Partner" },
              { value: "parent", label_key: "Parent" },
              { value: "child", label_key: "Child" },
              { value: "friend", label_key: "Friend" },
              { value: "colleague", label_key: "Colleague" },
              { value: "other", label_key: "Other" }
            ]
          },
          {
            id: "relationship-text",
            field_name: "relationshipText",
            field_type: "textarea",
            label_key: "relationshipTextLabel",
            placeholder_key: "relationshipTextPlaceholder",
            required: false
          },
          {
            id: "story-detailed",
            field_name: "storyDetailed",
            field_type: "textarea",
            label_key: "storyDetailedLabel",
            placeholder_key: "storyDetailedPlaceholder",
            required: true
          },
          {
            id: "keywords",
            field_name: "keywords",
            field_type: "text",
            label_key: "keywordsLabel",
            placeholder_key: "keywordsPlaceholder",
            required: false
          },
          {
            id: "keywords-audio",
            field_name: "keywordsAudio",
            field_type: "audio-recorder",
            label_key: "keywordsAudioLabel",
            placeholder_key: "keywordsAudioPlaceholder",
            required: false
          }
        ]
      },
      {
        id: "musical-preferences",
        title_key: "musicalPreferencesStep",
        fields: [
          {
            id: "favorite-genre",
            field_name: "favoriteGenre",
            field_type: "select",
            label_key: "favoriteGenreLabel",
            placeholder_key: "favoriteGenrePlaceholder",
            required: true,
            options: [
              { value: "pop", label_key: "Pop" },
              { value: "rock", label_key: "Rock" },
              { value: "folk", label_key: "Folk" },
              { value: "jazz", label_key: "Jazz" },
              { value: "classical", label_key: "Classical" },
              { value: "electronic", label_key: "Electronic" },
              { value: "hip-hop", label_key: "Hip Hop" },
              { value: "country", label_key: "Country" },
              { value: "r-n-b", label_key: "R&B" },
              { value: "metal", label_key: "Metal" },
              { value: "reggae", label_key: "Reggae" },
              { value: "other", label_key: "Other" }
            ]
          },
          {
            id: "song-length",
            field_name: "songLength",
            field_type: "select",
            label_key: "songLengthLabel",
            placeholder_key: "songLengthPlaceholder",
            required: true,
            options: [
              { value: "short", label_key: "Short (1-2 minutes)" },
              { value: "medium", label_key: "Medium (2-3 minutes)" },
              { value: "long", label_key: "Long (3-4 minutes)" }
            ]
          },
          {
            id: "instruments",
            field_name: "instruments",
            field_type: "text",
            label_key: "instrumentsLabel",
            placeholder_key: "instrumentsPlaceholder",
            required: false
          },
          {
            id: "mood",
            field_name: "mood",
            field_type: "select",
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
            id: "voice-gender",
            field_name: "voiceGender",
            field_type: "select",
            label_key: "voiceGenderLabel",
            placeholder_key: "voiceGenderPlaceholder",
            required: true,
            options: [
              { value: "feminine", label_key: "voiceFeminine" },
              { value: "masculine", label_key: "voiceMasculine" },
              { value: "duet", label_key: "voiceDuet" },
              { value: "musicgift-choice", label_key: "voiceMusicGiftChoice" }
            ]
          },
          {
            id: "song-language",
            field_name: "songLanguage",
            field_type: "select",
            label_key: "songLanguageLabel",
            placeholder_key: "songLanguagePlaceholder",
            required: true,
            options: [
              { value: "romanian", label_key: "romanianLanguage" },
              { value: "english", label_key: "englishLanguage" },
              { value: "french", label_key: "frenchLanguage" }
            ]
          }
        ]
      },
      {
        id: "contact-details",
        title_key: "contactDetailsStep",
        fields: [
          {
            id: "full-name",
            field_name: "fullName",
            field_type: "text",
            label_key: "fullNameLabel",
            placeholder_key: "fullNamePlaceholder",
            required: true
          },
          {
            id: "email",
            field_name: "email",
            field_type: "email",
            label_key: "emailLabel",
            placeholder_key: "emailPlaceholder",
            required: true
          },
          {
            id: "phone",
            field_name: "phone",
            field_type: "tel",
            label_key: "phoneLabel",
            placeholder_key: "phonePlaceholder",
            required: true
          },
          {
            id: "dedication-message",
            field_name: "dedicationMessage",
            field_type: "textarea",
            label_key: "dedicationMessageLabel",
            placeholder_key: "dedicationMessagePlaceholder",
            required: false
          }
        ]
      },
      {
        id: "addons",
        title_key: "addonsStep",
        fields: [
          {
            id: "addons-selection",
            field_name: "addons",
            field_type: "addons",
            label_key: "Add-ons",
            placeholder_key: "Select add-ons",
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
    tagline_key: "premiumTagline",
    description_key: "premiumDescription",
    price_ron: 300,
    price_eur: 59,
    delivery_time_key: "premiumDelivery",
    includes: [
      { text_key: "premiumInclude1" },
      { text_key: "premiumInclude2" },
      { text_key: "premiumInclude3" }
    ],
    tags: ["premium", "popular"],
    steps: [
      {
        id: "song-story",
        title_key: "songStoryStep",
        fields: [
          {
            id: "recipient",
            field_name: "recipient",
            field_type: "text",
            label_key: "recipientLabel",
            placeholder_key: "recipientPlaceholder",
            required: true
          },
          {
            id: "include-name-in-song",
            field_name: "includeNameInSong",
            field_type: "checkbox",
            label_key: "includeNameInSongLabel",
            placeholder_key: "includeNameInSongPlaceholder",
            required: false
          },
          {
            id: "pronunciation-audio",
            field_name: "pronunciationAudio",
            field_type: "audio-recorder",
            label_key: "pronunciationAudioLabel",
            placeholder_key: "pronunciationAudioPlaceholder",
            required: false
          },
          {
            id: "occasion",
            field_name: "occasion",
            field_type: "text",
            label_key: "occasionLabel",
            placeholder_key: "occasionPlaceholder",
            required: true
          },
          {
            id: "special-requests",
            field_name: "specialRequests",
            field_type: "textarea",
            label_key: "specialRequestsLabel",
            placeholder_key: "specialRequestsPlaceholder",
            required: false
          }
        ]
      },
      {
        id: "personal-details",
        title_key: "personalDetailsStep",
        fields: [
          {
            id: "relationship",
            field_name: "relationship",
            field_type: "select",
            label_key: "relationshipLabel",
            placeholder_key: "relationshipPlaceholder",
            required: true,
            options: [
              { value: "partner", label_key: "Partner" },
              { value: "parent", label_key: "Parent" },
              { value: "child", label_key: "Child" },
              { value: "friend", label_key: "Friend" },
              { value: "colleague", label_key: "Colleague" },
              { value: "other", label_key: "Other" }
            ]
          },
          {
            id: "relationship-text",
            field_name: "relationshipText",
            field_type: "textarea",
            label_key: "relationshipTextLabel",
            placeholder_key: "relationshipTextPlaceholder",
            required: false
          },
          {
            id: "story-detailed",
            field_name: "storyDetailed",
            field_type: "textarea",
            label_key: "storyDetailedLabel",
            placeholder_key: "storyDetailedPlaceholder",
            required: true
          },
          {
            id: "keywords",
            field_name: "keywords",
            field_type: "text",
            label_key: "keywordsLabel",
            placeholder_key: "keywordsPlaceholder",
            required: false
          },
          {
            id: "keywords-audio",
            field_name: "keywordsAudio",
            field_type: "audio-recorder",
            label_key: "keywordsAudioLabel",
            placeholder_key: "keywordsAudioPlaceholder",
            required: false
          }
        ]
      },
      {
        id: "musical-preferences",
        title_key: "musicalPreferencesStep",
        fields: [
          {
            id: "favorite-genre",
            field_name: "favoriteGenre",
            field_type: "select",
            label_key: "favoriteGenreLabel",
            placeholder_key: "favoriteGenrePlaceholder",
            required: true,
            options: [
              { value: "pop", label_key: "Pop" },
              { value: "rock", label_key: "Rock" },
              { value: "folk", label_key: "Folk" },
              { value: "jazz", label_key: "Jazz" },
              { value: "classical", label_key: "Classical" },
              { value: "electronic", label_key: "Electronic" },
              { value: "hip-hop", label_key: "Hip Hop" },
              { value: "country", label_key: "Country" },
              { value: "r-n-b", label_key: "R&B" },
              { value: "metal", label_key: "Metal" },
              { value: "reggae", label_key: "Reggae" },
              { value: "other", label_key: "Other" }
            ]
          },
          {
            id: "song-length",
            field_name: "songLength",
            field_type: "select",
            label_key: "songLengthLabel",
            placeholder_key: "songLengthPlaceholder",
            required: true,
            options: [
              { value: "short", label_key: "Short (1-2 minutes)" },
              { value: "medium", label_key: "Medium (2-3 minutes)" },
              { value: "long", label_key: "Long (3-4 minutes)" }
            ]
          },
          {
            id: "instruments",
            field_name: "instruments",
            field_type: "text",
            label_key: "instrumentsLabel",
            placeholder_key: "instrumentsPlaceholder",
            required: false
          },
          {
            id: "mood",
            field_name: "mood",
            field_type: "select",
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
            id: "voice-gender",
            field_name: "voiceGender",
            field_type: "select",
            label_key: "voiceGenderLabel",
            placeholder_key: "voiceGenderPlaceholder",
            required: true,
            options: [
              { value: "feminine", label_key: "voiceFeminine" },
              { value: "masculine", label_key: "voiceMasculine" },
              { value: "duet", label_key: "voiceDuet" },
              { value: "musicgift-choice", label_key: "voiceMusicGiftChoice" }
            ]
          },
          {
            id: "song-language",
            field_name: "songLanguage",
            field_type: "select",
            label_key: "songLanguageLabel",
            placeholder_key: "songLanguagePlaceholder",
            required: true,
            options: [
              { value: "romanian", label_key: "romanianLanguage" },
              { value: "english", label_key: "englishLanguage" },
              { value: "french", label_key: "frenchLanguage" }
            ]
          }
        ]
      },
      {
        id: "contact-details",
        title_key: "contactDetailsStep",
        fields: [
          {
            id: "full-name",
            field_name: "fullName",
            field_type: "text",
            label_key: "fullNameLabel",
            placeholder_key: "fullNamePlaceholder",
            required: true
          },
          {
            id: "email",
            field_name: "email",
            field_type: "email",
            label_key: "emailLabel",
            placeholder_key: "emailPlaceholder",
            required: true
          },
          {
            id: "phone",
            field_name: "phone",
            field_type: "tel",
            label_key: "phoneLabel",
            placeholder_key: "phonePlaceholder",
            required: true
          },
          {
            id: "dedication-message",
            field_name: "dedicationMessage",
            field_type: "textarea",
            label_key: "dedicationMessageLabel",
            placeholder_key: "dedicationMessagePlaceholder",
            required: false
          }
        ]
      },
      {
        id: "addons",
        title_key: "addonsStep",
        fields: [
          {
            id: "addons-selection",
            field_name: "addons",
            field_type: "addons",
            label_key: "Add-ons",
            placeholder_key: "Select add-ons",
            required: false
          }
        ]
      }
    ]
  },
  {
    id: "business",
    value: "business",
    label_key: "businessPackage",
    tagline_key: "businessTagline",
    description_key: "businessDescription",
    price_ron: 500,
    price_eur: 99,
    delivery_time_key: "businessDelivery",
    includes: [
      { text_key: "businessInclude1" },
      { text_key: "businessInclude2" },
      { text_key: "businessInclude3" },
      { text_key: "businessInclude4" }
    ],
    tags: ["premium"],
    steps: [
      {
        id: "song-story",
        title_key: "songStoryStep",
        fields: [
          {
            id: "recipient",
            field_name: "recipient",
            field_type: "text",
            label_key: "recipientLabel",
            placeholder_key: "recipientPlaceholder",
            required: true
          },
          {
            id: "include-name-in-song",
            field_name: "includeNameInSong",
            field_type: "checkbox",
            label_key: "includeNameInSongLabel",
            placeholder_key: "includeNameInSongPlaceholder",
            required: false
          },
          {
            id: "pronunciation-audio",
            field_name: "pronunciationAudio",
            field_type: "audio-recorder",
            label_key: "pronunciationAudioLabel",
            placeholder_key: "pronunciationAudioPlaceholder",
            required: false
          },
          {
            id: "occasion",
            field_name: "occasion",
            field_type: "text",
            label_key: "occasionLabel",
            placeholder_key: "occasionPlaceholder",
            required: true
          },
          {
            id: "special-requests",
            field_name: "specialRequests",
            field_type: "textarea",
            label_key: "specialRequestsLabel",
            placeholder_key: "specialRequestsPlaceholder",
            required: false
          }
        ]
      },
      {
        id: "personal-details",
        title_key: "personalDetailsStep",
        fields: [
          {
            id: "relationship",
            field_name: "relationship",
            field_type: "select",
            label_key: "relationshipLabel",
            placeholder_key: "relationshipPlaceholder",
            required: true,
            options: [
              { value: "partner", label_key: "Partner" },
              { value: "parent", label_key: "Parent" },
              { value: "child", label_key: "Child" },
              { value: "friend", label_key: "Friend" },
              { value: "colleague", label_key: "Colleague" },
              { value: "other", label_key: "Other" }
            ]
          },
          {
            id: "relationship-text",
            field_name: "relationshipText",
            field_type: "textarea",
            label_key: "relationshipTextLabel",
            placeholder_key: "relationshipTextPlaceholder",
            required: false
          },
          {
            id: "story-detailed",
            field_name: "storyDetailed",
            field_type: "textarea",
            label_key: "storyDetailedLabel",
            placeholder_key: "storyDetailedPlaceholder",
            required: true
          },
          {
            id: "keywords",
            field_name: "keywords",
            field_type: "text",
            label_key: "keywordsLabel",
            placeholder_key: "keywordsPlaceholder",
            required: false
          },
          {
            id: "keywords-audio",
            field_name: "keywordsAudio",
            field_type: "audio-recorder",
            label_key: "keywordsAudioLabel",
            placeholder_key: "keywordsAudioPlaceholder",
            required: false
          }
        ]
      },
      {
        id: "musical-preferences",
        title_key: "musicalPreferencesStep",
        fields: [
          {
            id: "favorite-genre",
            field_name: "favoriteGenre",
            field_type: "select",
            label_key: "favoriteGenreLabel",
            placeholder_key: "favoriteGenrePlaceholder",
            required: true,
            options: [
              { value: "pop", label_key: "Pop" },
              { value: "rock", label_key: "Rock" },
              { value: "folk", label_key: "Folk" },
              { value: "jazz", label_key: "Jazz" },
              { value: "classical", label_key: "Classical" },
              { value: "electronic", label_key: "Electronic" },
              { value: "hip-hop", label_key: "Hip Hop" },
              { value: "country", label_key: "Country" },
              { value: "r-n-b", label_key: "R&B" },
              { value: "metal", label_key: "Metal" },
              { value: "reggae", label_key: "Reggae" },
              { value: "other", label_key: "Other" }
            ]
          },
          {
            id: "song-length",
            field_name: "songLength",
            field_type: "select",
            label_key: "songLengthLabel",
            placeholder_key: "songLengthPlaceholder",
            required: true,
            options: [
              { value: "short", label_key: "Short (1-2 minutes)" },
              { value: "medium", label_key: "Medium (2-3 minutes)" },
              { value: "long", label_key: "Long (3-4 minutes)" }
            ]
          },
          {
            id: "instruments",
            field_name: "instruments",
            field_type: "text",
            label_key: "instrumentsLabel",
            placeholder_key: "instrumentsPlaceholder",
            required: false
          },
          {
            id: "mood",
            field_name: "mood",
            field_type: "select",
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
            id: "voice-gender",
            field_name: "voiceGender",
            field_type: "select",
            label_key: "voiceGenderLabel",
            placeholder_key: "voiceGenderPlaceholder",
            required: true,
            options: [
              { value: "feminine", label_key: "voiceFeminine" },
              { value: "masculine", label_key: "voiceMasculine" },
              { value: "duet", label_key: "voiceDuet" },
              { value: "musicgift-choice", label_key: "voiceMusicGiftChoice" }
            ]
          },
          {
            id: "song-language",
            field_name: "songLanguage",
            field_type: "select",
            label_key: "songLanguageLabel",
            placeholder_key: "songLanguagePlaceholder",
            required: true,
            options: [
              { value: "romanian", label_key: "romanianLanguage" },
              { value: "english", label_key: "englishLanguage" },
              { value: "french", label_key: "frenchLanguage" }
            ]
          }
        ]
      },
      {
        id: "contact-details",
        title_key: "contactDetailsStep",
        fields: [
          {
            id: "full-name",
            field_name: "fullName",
            field_type: "text",
            label_key: "fullNameLabel",
            placeholder_key: "fullNamePlaceholder",
            required: true
          },
          {
            id: "email",
            field_name: "email",
            field_type: "email",
            label_key: "emailLabel",
            placeholder_key: "emailPlaceholder",
            required: true
          },
          {
            id: "phone",
            field_name: "phone",
            field_type: "tel",
            label_key: "phoneLabel",
            placeholder_key: "phonePlaceholder",
            required: true
          },
          {
            id: "dedication-message",
            field_name: "dedicationMessage",
            field_type: "textarea",
            label_key: "dedicationMessageLabel",
            placeholder_key: "dedicationMessagePlaceholder",
            required: false
          }
        ]
      },
      {
        id: "addons",
        title_key: "addonsStep",
        fields: [
          {
            id: "addons-selection",
            field_name: "addons",
            field_type: "addons",
            label_key: "Add-ons",
            placeholder_key: "Select add-ons",
            required: false
          }
        ]
      }
    ]
  },
  {
    id: "artist",
    value: "artist",
    label_key: "artistPackage",
    tagline_key: "artistTagline",
    description_key: "artistDescription",
    price_ron: 500,
    price_eur: 99,
    delivery_time_key: "artistDelivery",
    includes: [
      { text_key: "artistInclude1" },
      { text_key: "artistInclude2" },
      { text_key: "artistInclude3" },
      { text_key: "artistInclude4" }
    ],
    tags: ["premium"],
    steps: [
      {
        id: "song-story",
        title_key: "songStoryStep",
        fields: [
          {
            id: "recipient",
            field_name: "recipient",
            field_type: "text",
            label_key: "recipientLabel",
            placeholder_key: "recipientPlaceholder",
            required: true
          },
          {
            id: "include-name-in-song",
            field_name: "includeNameInSong",
            field_type: "checkbox",
            label_key: "includeNameInSongLabel",
            placeholder_key: "includeNameInSongPlaceholder",
            required: false
          },
          {
            id: "pronunciation-audio",
            field_name: "pronunciationAudio",
            field_type: "audio-recorder",
            label_key: "pronunciationAudioLabel",
            placeholder_key: "pronunciationAudioPlaceholder",
            required: false
          },
          {
            id: "occasion",
            field_name: "occasion",
            field_type: "text",
            label_key: "occasionLabel",
            placeholder_key: "occasionPlaceholder",
            required: true
          },
          {
            id: "special-requests",
            field_name: "specialRequests",
            field_type: "textarea",
            label_key: "specialRequestsLabel",
            placeholder_key: "specialRequestsPlaceholder",
            required: false
          }
        ]
      },
      {
        id: "personal-details",
        title_key: "personalDetailsStep",
        fields: [
          {
            id: "relationship",
            field_name: "relationship",
            field_type: "select",
            label_key: "relationshipLabel",
            placeholder_key: "relationshipPlaceholder",
            required: true,
            options: [
              { value: "partner", label_key: "Partner" },
              { value: "parent", label_key: "Parent" },
              { value: "child", label_key: "Child" },
              { value: "friend", label_key: "Friend" },
              { value: "colleague", label_key: "Colleague" },
              { value: "other", label_key: "Other" }
            ]
          },
          {
            id: "relationship-text",
            field_name: "relationshipText",
            field_type: "textarea",
            label_key: "relationshipTextLabel",
            placeholder_key: "relationshipTextPlaceholder",
            required: false
          },
          {
            id: "story-detailed",
            field_name: "storyDetailed",
            field_type: "textarea",
            label_key: "storyDetailedLabel",
            placeholder_key: "storyDetailedPlaceholder",
            required: true
          },
          {
            id: "keywords",
            field_name: "keywords",
            field_type: "text",
            label_key: "keywordsLabel",
            placeholder_key: "keywordsPlaceholder",
            required: false
          },
          {
            id: "keywords-audio",
            field_name: "keywordsAudio",
            field_type: "audio-recorder",
            label_key: "keywordsAudioLabel",
            placeholder_key: "keywordsAudioPlaceholder",
            required: false
          }
        ]
      },
      {
        id: "musical-preferences",
        title_key: "musicalPreferencesStep",
        fields: [
          {
            id: "favorite-genre",
            field_name: "favoriteGenre",
            field_type: "select",
            label_key: "favoriteGenreLabel",
            placeholder_key: "favoriteGenrePlaceholder",
            required: true,
            options: [
              { value: "pop", label_key: "Pop" },
              { value: "rock", label_key: "Rock" },
              { value: "folk", label_key: "Folk" },
              { value: "jazz", label_key: "Jazz" },
              { value: "classical", label_key: "Classical" },
              { value: "electronic", label_key: "Electronic" },
              { value: "hip-hop", label_key: "Hip Hop" },
              { value: "country", label_key: "Country" },
              { value: "r-n-b", label_key: "R&B" },
              { value: "metal", label_key: "Metal" },
              { value: "reggae", label_key: "Reggae" },
              { value: "other", label_key: "Other" }
            ]
          },
          {
            id: "song-length",
            field_name: "songLength",
            field_type: "select",
            label_key: "songLengthLabel",
            placeholder_key: "songLengthPlaceholder",
            required: true,
            options: [
              { value: "short", label_key: "Short (1-2 minutes)" },
              { value: "medium", label_key: "Medium (2-3 minutes)" },
              { value: "long", label_key: "Long (3-4 minutes)" }
            ]
          },
          {
            id: "instruments",
            field_name: "instruments",
            field_type: "text",
            label_key: "instrumentsLabel",
            placeholder_key: "instrumentsPlaceholder",
            required: false
          },
          {
            id: "mood",
            field_name: "mood",
            field_type: "select",
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
            id: "voice-gender",
            field_name: "voiceGender",
            field_type: "select",
            label_key: "voiceGenderLabel",
            placeholder_key: "voiceGenderPlaceholder",
            required: true,
            options: [
              { value: "feminine", label_key: "voiceFeminine" },
              { value: "masculine", label_key: "voiceMasculine" },
              { value: "duet", label_key: "voiceDuet" },
              { value: "musicgift-choice", label_key: "voiceMusicGiftChoice" }
            ]
          },
          {
            id: "song-language",
            field_name: "songLanguage",
            field_type: "select",
            label_key: "songLanguageLabel",
            placeholder_key: "songLanguagePlaceholder",
            required: true,
            options: [
              { value: "romanian", label_key: "romanianLanguage" },
              { value: "english", label_key: "englishLanguage" },
              { value: "french", label_key: "frenchLanguage" }
            ]
          }
        ]
      },
      {
        id: "contact-details",
        title_key: "contactDetailsStep",
        fields: [
          {
            id: "full-name",
            field_name: "fullName",
            field_type: "text",
            label_key: "fullNameLabel",
            placeholder_key: "fullNamePlaceholder",
            required: true
          },
          {
            id: "email",
            field_name: "email",
            field_type: "email",
            label_key: "emailLabel",
            placeholder_key: "emailPlaceholder",
            required: true
          },
          {
            id: "phone",
            field_name: "phone",
            field_type: "tel",
            label_key: "phoneLabel",
            placeholder_key: "phonePlaceholder",
            required: true
          },
          {
            id: "dedication-message",
            field_name: "dedicationMessage",
            field_type: "textarea",
            label_key: "dedicationMessageLabel",
            placeholder_key: "dedicationMessagePlaceholder",
            required: false
          }
        ]
      },
      {
        id: "addons",
        title_key: "addonsStep",
        fields: [
          {
            id: "addons-selection",
            field_name: "addons",
            field_type: "addons",
            label_key: "Add-ons",
            placeholder_key: "Select add-ons",
            required: false
          }
        ]
      }
    ]
  },
  {
    id: "remix",
    value: "remix",
    label_key: "remixPackage",
    tagline_key: "remixTagline",
    description_key: "remixDescription",
    price_ron: 200,
    price_eur: 39,
    delivery_time_key: "remixDelivery",
    includes: [
      { text_key: "remixInclude1" },
      { text_key: "remixInclude2" },
      { text_key: "remixInclude3" },
      { text_key: "remixInclude4" },
      { text_key: "remixInclude5" },
      { text_key: "remixInclude6" }
    ],
    tags: ["new"],
    steps: [
      {
        id: "song-story",
        title_key: "songStoryStep",
        fields: [
          {
            id: "recipient",
            field_name: "recipient",
            field_type: "text",
            label_key: "recipientLabel",
            placeholder_key: "recipientPlaceholder",
            required: true
          },
          {
            id: "include-name-in-song",
            field_name: "includeNameInSong",
            field_type: "checkbox",
            label_key: "includeNameInSongLabel",
            placeholder_key: "includeNameInSongPlaceholder",
            required: false
          },
          {
            id: "pronunciation-audio",
            field_name: "pronunciationAudio",
            field_type: "audio-recorder",
            label_key: "pronunciationAudioLabel",
            placeholder_key: "pronunciationAudioPlaceholder",
            required: false
          },
          {
            id: "occasion",
            field_name: "occasion",
            field_type: "text",
            label_key: "occasionLabel",
            placeholder_key: "occasionPlaceholder",
            required: true
          },
          {
            id: "special-requests",
            field_name: "specialRequests",
            field_type: "textarea",
            label_key: "specialRequestsLabel",
            placeholder_key: "specialRequestsPlaceholder",
            required: false
          }
        ]
      },
      {
        id: "personal-details",
        title_key: "personalDetailsStep",
        fields: [
          {
            id: "relationship",
            field_name: "relationship",
            field_type: "select",
            label_key: "relationshipLabel",
            placeholder_key: "relationshipPlaceholder",
            required: true,
            options: [
              { value: "partner", label_key: "Partner" },
              { value: "parent", label_key: "Parent" },
              { value: "child", label_key: "Child" },
              { value: "friend", label_key: "Friend" },
              { value: "colleague", label_key: "Colleague" },
              { value: "other", label_key: "Other" }
            ]
          },
          {
            id: "relationship-text",
            field_name: "relationshipText",
            field_type: "textarea",
            label_key: "relationshipTextLabel",
            placeholder_key: "relationshipTextPlaceholder",
            required: false
          },
          {
            id: "story-detailed",
            field_name: "storyDetailed",
            field_type: "textarea",
            label_key: "storyDetailedLabel",
            placeholder_key: "storyDetailedPlaceholder",
            required: true
          },
          {
            id: "keywords",
            field_name: "keywords",
            field_type: "text",
            label_key: "keywordsLabel",
            placeholder_key: "keywordsPlaceholder",
            required: false
          },
          {
            id: "keywords-audio",
            field_name: "keywordsAudio",
            field_type: "audio-recorder",
            label_key: "keywordsAudioLabel",
            placeholder_key: "keywordsAudioPlaceholder",
            required: false
          }
        ]
      },
      {
        id: "musical-preferences",
        title_key: "musicalPreferencesStep",
        fields: [
          {
            id: "favorite-genre",
            field_name: "favoriteGenre",
            field_type: "select",
            label_key: "favoriteGenreLabel",
            placeholder_key: "favoriteGenrePlaceholder",
            required: true,
            options: [
              { value: "pop", label_key: "Pop" },
              { value: "rock", label_key: "Rock" },
              { value: "folk", label_key: "Folk" },
              { value: "jazz", label_key: "Jazz" },
              { value: "classical", label_key: "Classical" },
              { value: "electronic", label_key: "Electronic" },
              { value: "hip-hop", label_key: "Hip Hop" },
              { value: "country", label_key: "Country" },
              { value: "r-n-b", label_key: "R&B" },
              { value: "metal", label_key: "Metal" },
              { value: "reggae", label_key: "Reggae" },
              { value: "other", label_key: "Other" }
            ]
          },
          {
            id: "song-length",
            field_name: "songLength",
            field_type: "select",
            label_key: "songLengthLabel",
            placeholder_key: "songLengthPlaceholder",
            required: true,
            options: [
              { value: "short", label_key: "Short (1-2 minutes)" },
              { value: "medium", label_key: "Medium (2-3 minutes)" },
              { value: "long", label_key: "Long (3-4 minutes)" }
            ]
          },
          {
            id: "instruments",
            field_name: "instruments",
            field_type: "text",
            label_key: "instrumentsLabel",
            placeholder_key: "instrumentsPlaceholder",
            required: false
          },
          {
            id: "mood",
            field_name: "mood",
            field_type: "select",
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
            id: "voice-gender",
            field_name: "voiceGender",
            field_type: "select",
            label_key: "voiceGenderLabel",
            placeholder_key: "voiceGenderPlaceholder",
            required: true,
            options: [
              { value: "feminine", label_key: "voiceFeminine" },
              { value: "masculine", label_key: "voiceMasculine" },
              { value: "duet", label_key: "voiceDuet" },
              { value: "musicgift-choice", label_key: "voiceMusicGiftChoice" }
            ]
          },
          {
            id: "song-language",
            field_name: "songLanguage",
            field_type: "select",
            label_key: "songLanguageLabel",
            placeholder_key: "songLanguagePlaceholder",
            required: true,
            options: [
              { value: "romanian", label_key: "romanianLanguage" },
              { value: "english", label_key: "englishLanguage" },
              { value: "french", label_key: "frenchLanguage" }
            ]
          }
        ]
      },
      {
        id: "contact-details",
        title_key: "contactDetailsStep",
        fields: [
          {
            id: "full-name",
            field_name: "fullName",
            field_type: "text",
            label_key: "fullNameLabel",
            placeholder_key: "fullNamePlaceholder",
            required: true
          },
          {
            id: "email",
            field_name: "email",
            field_type: "email",
            label_key: "emailLabel",
            placeholder_key: "emailPlaceholder",
            required: true
          },
          {
            id: "phone",
            field_name: "phone",
            field_type: "tel",
            label_key: "phoneLabel",
            placeholder_key: "phonePlaceholder",
            required: true
          },
          {
            id: "dedication-message",
            field_name: "dedicationMessage",
            field_type: "textarea",
            label_key: "dedicationMessageLabel",
            placeholder_key: "dedicationMessagePlaceholder",
            required: false
          }
        ]
      },
      {
        id: "addons",
        title_key: "addonsStep",
        fields: [
          {
            id: "addons-selection",
            field_name: "addons",
            field_type: "addons",
            label_key: "Add-ons",
            placeholder_key: "Select add-ons",
            required: false
          }
        ]
      }
    ]
  },
  {
    id: "instrumental",
    value: "instrumental",
    label_key: "instrumentalPackage",
    tagline_key: "instrumentalTagline",
    description_key: "instrumentalDescription",
    price_ron: 150,
    price_eur: 29,
    delivery_time_key: "instrumentalDelivery",
    includes: [
      { text_key: "instrumentalInclude1" },
      { text_key: "instrumentalInclude2" },
      { text_key: "instrumentalInclude3" },
      { text_key: "instrumentalInclude4" },
      { text_key: "instrumentalInclude5" }
    ],
    tags: ["new"],
    steps: [
      {
        id: "song-story",
        title_key: "songStoryStep",
        fields: [
          {
            id: "recipient",
            field_name: "recipient",
            field_type: "text",
            label_key: "recipientLabel",
            placeholder_key: "recipientPlaceholder",
            required: true
          },
          {
            id: "include-name-in-song",
            field_name: "includeNameInSong",
            field_type: "checkbox",
            label_key: "includeNameInSongLabel",
            placeholder_key: "includeNameInSongPlaceholder",
            required: false
          },
          {
            id: "pronunciation-audio",
            field_name: "pronunciationAudio",
            field_type: "audio-recorder",
            label_key: "pronunciationAudioLabel",
            placeholder_key: "pronunciationAudioPlaceholder",
            required: false
          },
          {
            id: "occasion",
            field_name: "occasion",
            field_type: "text",
            label_key: "occasionLabel",
            placeholder_key: "occasionPlaceholder",
            required: true
          },
          {
            id: "special-requests",
            field_name: "specialRequests",
            field_type: "textarea",
            label_key: "specialRequestsLabel",
            placeholder_key: "specialRequestsPlaceholder",
            required: false
          }
        ]
      },
      {
        id: "personal-details",
        title_key: "personalDetailsStep",
        fields: [
          {
            id: "relationship",
            field_name: "relationship",
            field_type: "select",
            label_key: "relationshipLabel",
            placeholder_key: "relationshipPlaceholder",
            required: true,
            options: [
              { value: "partner", label_key: "Partner" },
              { value: "parent", label_key: "Parent" },
              { value: "child", label_key: "Child" },
              { value: "friend", label_key: "Friend" },
              { value: "colleague", label_key: "Colleague" },
              { value: "other", label_key: "Other" }
            ]
          },
          {
            id: "relationship-text",
            field_name: "relationshipText",
            field_type: "textarea",
            label_key: "relationshipTextLabel",
            placeholder_key: "relationshipTextPlaceholder",
            required: false
          },
          {
            id: "story-detailed",
            field_name: "storyDetailed",
            field_type: "textarea",
            label_key: "storyDetailedLabel",
            placeholder_key: "storyDetailedPlaceholder",
            required: true
          },
          {
            id: "keywords",
            field_name: "keywords",
            field_type: "text",
            label_key: "keywordsLabel",
            placeholder_key: "keywordsPlaceholder",
            required: false
          },
          {
            id: "keywords-audio",
            field_name: "keywordsAudio",
            field_type: "audio-recorder",
            label_key: "keywordsAudioLabel",
            placeholder_key: "keywordsAudioPlaceholder",
            required: false
          }
        ]
      },
      {
        id: "musical-preferences",
        title_key: "musicalPreferencesStep",
        fields: [
          {
            id: "favorite-genre",
            field_name: "favoriteGenre",
            field_type: "select",
            label_key: "favoriteGenreLabel",
            placeholder_key: "favoriteGenrePlaceholder",
            required: true,
            options: [
              { value: "pop", label_key: "Pop" },
              { value: "rock", label_key: "Rock" },
              { value: "folk", label_key: "Folk" },
              { value: "jazz", label_key: "Jazz" },
              { value: "classical", label_key: "Classical" },
              { value: "electronic", label_key: "Electronic" },
              { value: "hip-hop", label_key: "Hip Hop" },
              { value: "country", label_key: "Country" },
              { value: "r-n-b", label_key: "R&B" },
              { value: "metal", label_key: "Metal" },
              { value: "reggae", label_key: "Reggae" },
              { value: "other", label_key: "Other" }
            ]
          },
          {
            id: "song-length",
            field_name: "songLength",
            field_type: "select",
            label_key: "songLengthLabel",
            placeholder_key: "songLengthPlaceholder",
            required: true,
            options: [
              { value: "short", label_key: "Short (1-2 minutes)" },
              { value: "medium", label_key: "Medium (2-3 minutes)" },
              { value: "long", label_key: "Long (3-4 minutes)" }
            ]
          },
          {
            id: "instruments",
            field_name: "instruments",
            field_type: "text",
            label_key: "instrumentsLabel",
            placeholder_key: "instrumentsPlaceholder",
            required: false
          },
          {
            id: "mood",
            field_name: "mood",
            field_type: "select",
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
            id: "voice-gender",
            field_name: "voiceGender",
            field_type: "select",
            label_key: "voiceGenderLabel",
            placeholder_key: "voiceGenderPlaceholder",
            required: true,
            options: [
              { value: "feminine", label_key: "voiceFeminine" },
              { value: "masculine", label_key: "voiceMasculine" },
              { value: "duet", label_key: "voiceDuet" },
              { value: "musicgift-choice", label_key: "voiceMusicGiftChoice" }
            ]
          },
          {
            id: "song-language",
            field_name: "songLanguage",
            field_type: "select",
            label_key: "songLanguageLabel",
            placeholder_key: "songLanguagePlaceholder",
            required: true,
            options: [
              { value: "romanian", label_key: "romanianLanguage" },
              { value: "english", label_key: "englishLanguage" },
              { value: "french", label_key: "frenchLanguage" }
            ]
          }
        ]
      },
      {
        id: "contact-details",
        title_key: "contactDetailsStep",
        fields: [
          {
            id: "full-name",
            field_name: "fullName",
            field_type: "text",
            label_key: "fullNameLabel",
            placeholder_key: "fullNamePlaceholder",
            required: true
          },
          {
            id: "email",
            field_name: "email",
            field_type: "email",
            label_key: "emailLabel",
            placeholder_key: "emailPlaceholder",
            required: true
          },
          {
            id: "phone",
            field_name: "phone",
            field_type: "tel",
            label_key: "phoneLabel",
            placeholder_key: "phonePlaceholder",
            required: true
          },
          {
            id: "dedication-message",
            field_name: "dedicationMessage",
            field_type: "textarea",
            label_key: "dedicationMessageLabel",
            placeholder_key: "dedicationMessagePlaceholder",
            required: false
          }
        ]
      },
      {
        id: "addons",
        title_key: "addonsStep",
        fields: [
          {
            id: "addons-selection",
            field_name: "addons",
            field_type: "addons",
            label_key: "Add-ons",
            placeholder_key: "Select add-ons",
            required: false
          }
        ]
      }
    ]
  },
  {
    id: "gift",
    value: "gift",
    label_key: "giftPackage",
    tagline_key: "giftTagline", 
    description_key: "giftDescription",
    price_ron: 100,
    price_eur: 19,
    delivery_time_key: "giftDelivery",
    includes: [
      { text_key: "giftInclude1" },
      { text_key: "giftInclude2" },
      { text_key: "giftInclude3" }
    ],
    tags: ["gift", "new"],
    steps: [
      {
        id: "gift-details",
        title_key: "giftDetailsStep",
        fields: [
          {
            id: "gift-amount",
            field_name: "giftAmount",
            field_type: "select",
            label_key: "giftAmountLabel",
            placeholder_key: "giftAmountPlaceholder",
            required: true,
            options: [
              { value: "100", label_key: "100 RON / 19 EUR" },
              { value: "200", label_key: "200 RON / 39 EUR" },
              { value: "300", label_key: "300 RON / 59 EUR" },
              { value: "500", label_key: "500 RON / 99 EUR" }
            ]
          }
        ]
      }
    ]
  }
];

export const addons = [
  {
    id: "rush-delivery",
    addon_key: "rushDelivery",
    label_key: "rushDeliveryLabel",
    description_key: "rushDeliveryDescription",
    price: 100,
    packages: ["personal", "premium", "business", "artist", "remix", "instrumental"]
  },
  {
    id: "commercial-rights",
    addon_key: "commercialRights", 
    label_key: "commercialRightsLabel",
    description_key: "commercialRightsDescription",
    price: 200,
    packages: ["personal", "premium"]
  },
  {
    id: "distributie-mango-records",
    addon_key: "distributieMangoRecords",
    label_key: "distributieMangoRecordsLabel", 
    description_key: "distributieMangoRecordsDescription",
    price: 149,
    packages: ["personal", "artist"]
  },
  {
    id: "custom-video",
    addon_key: "customVideo",
    label_key: "customVideoLabel",
    description_key: "customVideoDescription", 
    price: 200,
    packages: ["personal", "premium", "business"],
    trigger_field_type: "file",
    trigger_config: {
      accept: "image/*,video/*",
      maxFiles: 10,
      maxSize: 50 * 1024 * 1024, // 50MB
      label_key: "uploadPhotosVideos",
      placeholder_key: "uploadPhotosVideosPlaceholder"
    }
  },
  {
    id: "audio-message-from-sender",
    addon_key: "audioMessageFromSender",
    label_key: "audioMessageFromSenderLabel",
    description_key: "audioMessageFromSenderDescription",
    price: 49,
    packages: ["personal", "premium", "business", "artist"],
    trigger_field_type: "audio-recorder",
    trigger_config: {
      label_key: "recordPersonalMessage",
      placeholder_key: "recordPersonalMessagePlaceholder"
    }
  },
  {
    id: "commercial-rights-upgrade",
    addon_key: "commercialRightsUpgrade",
    label_key: "commercialRightsUpgradeLabel",
    description_key: "commercialRightsUpgradeDescription",
    price: 200,
    packages: ["remix", "instrumental"]
  },
  {
    id: "extended-song",
    addon_key: "extendedSong",
    label_key: "extendedSongLabel",
    description_key: "extendedSongDescription",
    price: 149,
    packages: ["personal", "premium", "business", "artist"]
  }
];

// Updated step configurations for packages that need final acceptance steps
export const stepConfigurations = {
  personal: [
    {
      id: "legal-acceptances",
      title_key: "legalAcceptancesStep",
      fields: [
        {
          id: "mention-musicgift",
          field_name: "mentionMusicGift",
          field_type: "checkbox",
          label_key: "mentionMusicGiftLabel",
          placeholder_key: "termsMentionMusicGiftPlaceholder",
          required: true
        },
        {
          id: "confirm-order",
          field_name: "confirmOrder", 
          field_type: "checkbox",
          label_key: "confirmOrderLabel",
          placeholder_key: "confirmOrderPlaceholder",
          required: true
        },
        {
          id: "accept-terms",
          field_name: "acceptTerms",
          field_type: "checkbox", 
          label_key: "acceptTermsLabel",
          placeholder_key: "acceptTermsAndConditionsPlaceholder",
          required: true
        }
      ]
    }
  ],
  premium: [
    {
      id: "legal-acceptances",
      title_key: "legalAcceptancesStep",
      fields: [
        {
          id: "mention-musicgift",
          field_name: "mentionMusicGift",
          field_type: "checkbox",
          label_key: "mentionMusicGiftLabel",
          placeholder_key: "termsMentionMusicGiftPlaceholder",
          required: true
        },
        {
          id: "confirm-order",
          field_name: "confirmOrder",
          field_type: "checkbox",
          label_key: "confirmOrderLabel", 
          placeholder_key: "confirmOrderPlaceholder",
          required: true
        },
        {
          id: "accept-terms",
          field_name: "acceptTerms",
          field_type: "checkbox",
          label_key: "acceptTermsLabel",
          placeholder_key: "acceptTermsAndConditionsPlaceholder", 
          required: true
        }
      ]
    }
  ],
  business: [
    {
      id: "legal-acceptances", 
      title_key: "legalAcceptancesStep",
      fields: [
        {
          id: "mention-musicgift",
          field_name: "mentionMusicGift",
          field_type: "checkbox",
          label_key: "mentionMusicGiftLabel",
          placeholder_key: "termsMentionMusicGiftPlaceholder",
          required: true
        },
        {
          id: "confirm-order",
          field_name: "confirmOrder",
          field_type: "checkbox", 
          label_key: "confirmOrderLabel",
          placeholder_key: "confirmOrderPlaceholder",
          required: true
        },
        {
          id: "accept-terms",
          field_name: "acceptTerms",
          field_type: "checkbox",
          label_key: "acceptTermsLabel",
          placeholder_key: "acceptTermsAndConditionsPlaceholder",
          required: true
        }
      ]
    }
  ],
  artist: [
    {
      id: "legal-acceptances",
      title_key: "legalAcceptancesStep", 
      fields: [
        {
          id: "mention-musicgift",
          field_name: "mentionMusicGift",
          field_type: "checkbox",
          label_key: "mentionMusicGiftLabel",
          placeholder_key: "termsMentionMusicGiftPlaceholder",
          required: true
        },
        {
          id: "confirm-order",
          field_name: "confirmOrder",
          field_type: "checkbox",
          label_key: "confirmOrderLabel",
          placeholder_key: "confirmOrderPlaceholder", 
          required: true
        },
        {
          id: "accept-terms", 
          field_name: "acceptTerms",
          field_type: "checkbox",
          label_key: "acceptTermsLabel",
          placeholder_key: "acceptTermsAndConditionsPlaceholder",
          required: true
        }
      ]
    }
  ]
};
