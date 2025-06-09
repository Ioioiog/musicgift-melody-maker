
import type { Step } from '@/types';

export const commonPackageSteps: Step[] = [
  {
    id: "story",
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
        field_type: "radio",
        label_key: "includeNameInSongLabel",
        placeholder_key: "includeNameInSongPlaceholder",
        required: true,
        field_order: 2,
        options: [
          { value: "yes", label_key: "yes" },
          { value: "no", label_key: "no" }
        ]
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
        id: "occasion",
        field_name: "occasion",
        field_type: "select",
        label_key: "occasionLabel",
        placeholder_key: "occasionPlaceholder",
        required: true,
        field_order: 4,
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
        field_name: "specialRequests",
        field_type: "textarea",
        label_key: "specialRequestsLabel",
        placeholder_key: "specialRequestsPlaceholder",
        required: false,
        field_order: 5
      },
      {
        id: "deliveryInstructions",
        field_name: "deliveryInstructions",
        field_type: "textarea",
        label_key: "deliveryInstructionsLabel", 
        placeholder_key: "deliveryInstructionsPlaceholder",
        required: false,
        field_order: 6
      }
    ]
  },
  {
    id: "personal",
    step_number: 2,
    title_key: "personalDetailsStep",
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
        id: "birthDate",
        field_name: "birthDate",
        field_type: "date",
        label_key: "birthDateLabel",
        placeholder_key: "birthDatePlaceholder",
        required: false,
        field_order: 2
      },
      {
        id: "gender",
        field_name: "gender",
        field_type: "select",
        label_key: "genderLabel",
        placeholder_key: "genderPlaceholder",
        required: false,
        field_order: 3,
        options: [
          { value: "male", label_key: "male" },
          { value: "female", label_key: "female" },
          { value: "other", label_key: "other" }
        ]
      },
      {
        id: "relationship",
        field_name: "relationship",
        field_type: "select",
        label_key: "relationshipLabel",
        placeholder_key: "relationshipPlaceholder",
        required: true,
        field_order: 4,
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
        field_name: "relationshipText",
        field_type: "textarea",
        label_key: "relationshipTextLabel",
        placeholder_key: "relationshipTextPlaceholder",
        required: false,
        field_order: 5
      }
    ]
  },
  {
    id: "content",
    step_number: 3,
    title_key: "contactInfoStep",
    fields: [
      {
        id: "storyDetailed",
        field_name: "storyDetailed",
        field_type: "textarea",
        label_key: "storyDetailedLabel",
        placeholder_key: "storyDetailedPlaceholder",
        required: true,
        field_order: 1
      },
      {
        id: "keywords",
        field_name: "keywords",
        field_type: "textarea",
        label_key: "keywordsLabel",
        placeholder_key: "keywordsPlaceholder",
        required: false,
        field_order: 2
      },
      {
        id: "keywordsAudio",
        field_name: "keywordsAudio",
        field_type: "audio",
        label_key: "keywordsAudioLabel",
        placeholder_key: "keywordsAudioPlaceholder",
        required: false,
        field_order: 3
      }
    ]
  },
  {
    id: "musical",
    step_number: 4,
    title_key: "musicalPreferencesStep",
    fields: [
      {
        id: "favoriteGenre",
        field_name: "favoriteGenre",
        field_type: "select",
        label_key: "favoriteGenreLabel",
        placeholder_key: "favoriteGenrePlaceholder",
        required: true,
        field_order: 1,
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
        field_name: "songLength",
        field_type: "select",
        label_key: "songLengthLabel",
        placeholder_key: "songLengthPlaceholder",
        required: false,
        field_order: 2,
        options: [
          { value: "short", label_key: "short" },
          { value: "medium", label_key: "medium" },
          { value: "long", label_key: "long" }
        ]
      },
      {
        id: "instruments",
        field_name: "instruments",
        field_type: "textarea",
        label_key: "instrumentsLabel",
        placeholder_key: "instrumentsPlaceholder",
        required: false,
        field_order: 3
      },
      {
        id: "mood",
        field_name: "mood",
        field_type: "select",
        label_key: "moodLabel",
        placeholder_key: "moodPlaceholder",
        required: true,
        field_order: 4,
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
        field_name: "lyricsTheme",
        field_type: "textarea",
        label_key: "lyricsThemeLabel",
        placeholder_key: "lyricsThemePlaceholder",
        required: false,
        field_order: 5
      },
      {
        id: "styleReference",
        field_name: "styleReference",
        field_type: "text",
        label_key: "styleReferenceLabel",
        placeholder_key: "styleReferencePlaceholder",
        required: false,
        field_order: 6
      },
      {
        id: "youtubeExample",
        field_name: "youtubeExample",
        field_type: "text",
        label_key: "youtubeExampleLabel",
        placeholder_key: "youtubeExamplePlaceholder",
        required: false,
        field_order: 7
      },
      {
        id: "voiceGender",
        field_name: "voiceGender",
        field_type: "radio",
        label_key: "voiceGenderLabel",
        placeholder_key: "voiceGenderPlaceholder",
        required: true,
        field_order: 8,
        options: [
          { value: "feminine", label_key: "voiceFeminine" },
          { value: "masculine", label_key: "voiceMasculine" },
          { value: "duet", label_key: "voiceDuet" },
          { value: "choice", label_key: "voiceMusicGiftChoice" }
        ]
      },
      {
        id: "songLanguage",
        field_name: "songLanguage",
        field_type: "select",
        label_key: "songLanguageLabel",
        placeholder_key: "songLanguagePlaceholder",
        required: true,
        field_order: 9,
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
    step_number: 5,
    title_key: "contactDetailsStep",
    fields: [
      {
        id: "email",
        field_name: "email",
        field_type: "email",
        label_key: "emailLabel",
        placeholder_key: "emailPlaceholder",
        required: true,
        field_order: 1
      },
      {
        id: "phone",
        field_name: "phone",
        field_type: "text",
        label_key: "phoneLabel",
        placeholder_key: "phonePlaceholder",
        required: false,
        field_order: 2
      },
      {
        id: "dedicationMessage",
        field_name: "dedicationMessage",
        field_type: "textarea",
        label_key: "dedicationMessageLabel",
        placeholder_key: "dedicationMessagePlaceholder",
        required: false,
        field_order: 3
      }
    ]
  }
];
