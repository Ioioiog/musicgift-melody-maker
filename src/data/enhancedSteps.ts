
// Enhanced Step 1 for all packages 
export const stepOneByPackage = {
  personal: {
    id: "personal-step-1",
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
        field_type: "checkbox",
        label_key: "includeNameInSongLabel",
        placeholder_key: "includeNameInSongPlaceholder",
        required: false,
        field_order: 2
      },
      {
        id: "relationshipText",
        field_name: "relationshipText",
        field_type: "text",
        label_key: "relationshipTextLabel",
        placeholder_key: "relationshipTextPlaceholder",
        required: true,
        field_order: 3
      },
      {
        id: "storyDetailed",
        field_name: "storyDetailed",
        field_type: "textarea",
        label_key: "storyDetailedLabel",
        placeholder_key: "storyDetailedPlaceholder",
        required: true,
        field_order: 4
      }
    ]
  },
  premium: {
    id: "premium-step-1",
    step_number: 1,
    title_key: "yourStoryStep",
    fields: [
      {
        id: "occasion",
        field_name: "occasion",
        field_type: "text",
        label_key: "occasionLabel",
        placeholder_key: "occasionPlaceholder",
        required: true,
        field_order: 1
      },
      {
        id: "story",
        field_name: "story",
        field_type: "textarea",
        label_key: "storyLabel",
        placeholder_key: "storyPlaceholder",
        required: true,
        field_order: 2
      },
      {
        id: "vibe",
        field_name: "vibe",
        field_type: "text",
        label_key: "vibeLabel",
        placeholder_key: "vibePlaceholder",
        required: true,
        field_order: 3
      }
    ]
  },
  business: {
    id: "business-step-1",
    step_number: 1,
    title_key: "companyDetailsStep",
    fields: [
      {
        id: "companyName",
        field_name: "companyName",
        field_type: "text",
        label_key: "companyNameLabel",
        placeholder_key: "companyNamePlaceholder",
        required: true,
        field_order: 1
      },
      {
        id: "brandMessage",
        field_name: "brandMessage",
        field_type: "textarea",
        label_key: "brandMessageLabel",
        placeholder_key: "brandMessagePlaceholder",
        required: true,
        field_order: 2
      }
    ]
  },
  artist: {
    id: "artist-step-1",
    step_number: 1,
    title_key: "artistIntroStep",
    fields: [
      {
        id: "artistName",
        field_name: "artistName",
        field_type: "text",
        label_key: "artistNameLabel",
        placeholder_key: "artistNamePlaceholder",
        required: true,
        field_order: 1
      },
      {
        id: "musicalStyle",
        field_name: "musicalStyle",
        field_type: "text",
        label_key: "musicalStyleLabel",
        placeholder_key: "musicalStylePlaceholder",
        required: true,
        field_order: 2
      }
    ]
  },
  instrumental: {
    id: "instrumental-step-1",
    step_number: 1,
    title_key: "instrumentalConceptStep",
    fields: [
      {
        id: "instrumentalVibe",
        field_name: "instrumentalVibe",
        field_type: "text",
        label_key: "instrumentalVibeLabel",
        placeholder_key: "instrumentalVibePlaceholder",
        required: true,
        field_order: 1
      },
      {
        id: "instrumentalPurpose",
        field_name: "instrumentalPurpose",
        field_type: "textarea",
        label_key: "instrumentalPurposeLabel",
        placeholder_key: "instrumentalPurposePlaceholder",
        required: false,
        field_order: 2
      }
    ]
  },
  remix: {
    id: "remix-step-1",
    step_number: 1,
    title_key: "remixInfoStep",
    fields: [
      {
        id: "originalSongLink",
        field_name: "originalSongLink",
        field_type: "url",
        label_key: "originalSongLinkLabel",
        placeholder_key: "originalSongLinkPlaceholder",
        required: true,
        field_order: 1
      },
      {
        id: "desiredRemixStyle",
        field_name: "desiredRemixStyle",
        field_type: "text",
        label_key: "desiredRemixStyleLabel",
        placeholder_key: "desiredRemixStylePlaceholder",
        required: true,
        field_order: 2
      }
    ]
  }
};

// Enhanced Step 2 for all packages except 'gift'
export const stepTwoByPackage = {
  personal: {
    id: "personal-step-2",
    step_number: 2,
    title_key: "musicalPreferencesStep",
    fields: [
      {
        id: "styleReference",
        field_name: "styleReference",
        field_type: "text",
        label_key: "styleReferenceLabel",
        placeholder_key: "styleReferencePlaceholder",
        required: true,
        field_order: 1
      },
      {
        id: "mood",
        field_name: "mood",
        field_type: "select",
        label_key: "moodLabel",
        placeholder_key: "moodPlaceholder",
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
        id: "voiceGender",
        field_name: "voiceGender",
        field_type: "select",
        label_key: "voiceGenderLabel",
        placeholder_key: "voiceGenderPlaceholder",
        required: true,
        field_order: 3,
        options: [
          { value: "feminine", label_key: "voiceFeminine" },
          { value: "masculine", label_key: "voiceMasculine" },
          { value: "duet", label_key: "voiceDuet" },
          { value: "musicgift_choice", label_key: "voiceMusicGiftChoice" }
        ]
      }
    ]
  },
  premium: {
    id: "premium-step-2",
    step_number: 2,
    title_key: "distributionPreferencesStep",
    fields: [
      {
        id: "targetPlatform",
        field_name: "targetPlatform",
        field_type: "checkbox-group",
        label_key: "targetPlatformLabel",
        placeholder_key: "targetPlatformPlaceholder",
        required: true,
        field_order: 1,
        options: [
          { value: "spotify", label_key: "platformSpotify" },
          { value: "youtube", label_key: "platformYouTube" },
          { value: "instagram", label_key: "platformInstagram" },
          { value: "tiktok", label_key: "platformTikTok" }
        ]
      },
      {
        id: "artistBio",
        field_name: "artistBio",
        field_type: "textarea",
        label_key: "artistBioLabel",
        placeholder_key: "artistBioPlaceholder",
        required: false,
        field_order: 2
      }
    ]
  },
  business: {
    id: "business-step-2",
    step_number: 2,
    title_key: "brandIdentityStep",
    fields: [
      {
        id: "brandValues",
        field_name: "brandValues",
        field_type: "textarea",
        label_key: "brandValuesLabel",
        placeholder_key: "brandValuesPlaceholder",
        required: true,
        field_order: 1
      },
      {
        id: "targetAudience",
        field_name: "targetAudience",
        field_type: "text",
        label_key: "targetAudienceLabel",
        placeholder_key: "targetAudiencePlaceholder",
        required: true,
        field_order: 2
      }
    ]
  },
  artist: {
    id: "artist-step-2",
    step_number: 2,
    title_key: "creativeDirectionStep",
    fields: [
      {
        id: "artisticInfluences",
        field_name: "artisticInfluences",
        field_type: "textarea",
        label_key: "artisticInfluencesLabel",
        placeholder_key: "artisticInfluencesPlaceholder",
        required: false,
        field_order: 1
      },
      {
        id: "vocalRecordingMethod",
        field_name: "vocalRecordingMethod",
        field_type: "select",
        label_key: "vocalRecordingMethodLabel",
        placeholder_key: "vocalRecordingMethodPlaceholder",
        required: true,
        field_order: 2,
        options: [
          { value: "studio_visit", label_key: "studioVisit" },
          { value: "local_studio", label_key: "localStudio" },
          { value: "home_recording", label_key: "homeRecording" }
        ]
      }
    ]
  },
  instrumental: {
    id: "instrumental-step-2",
    step_number: 2,
    title_key: "instrumentalStyleStep",
    fields: [
      {
        id: "instrumentalStyleRef",
        field_name: "instrumentalStyleRef",
        field_type: "text",
        label_key: "instrumentalStyleRefLabel",
        placeholder_key: "instrumentalStyleRefPlaceholder",
        required: true,
        field_order: 1
      },
      {
        id: "instrumentType",
        field_name: "instrumentType",
        field_type: "select",
        label_key: "instrumentTypeLabel",
        placeholder_key: "instrumentTypePlaceholder",
        required: false,
        field_order: 2,
        options: [
          { value: "piano", label_key: "instrumentPiano" },
          { value: "guitar", label_key: "instrumentGuitar" },
          { value: "synth", label_key: "instrumentSynth" },
          { value: "other", label_key: "instrumentOther" }
        ]
      }
    ]
  },
  remix: {
    id: "remix-step-2",
    step_number: 2,
    title_key: "remixArtistIntentStep",
    fields: [
      {
        id: "remixGoal",
        field_name: "remixGoal",
        field_type: "textarea",
        label_key: "remixGoalLabel",
        placeholder_key: "remixGoalPlaceholder",
        required: true,
        field_order: 1
      },
      {
        id: "creditsConfirmation",
        field_name: "creditsConfirmation",
        field_type: "checkbox",
        label_key: "creditsConfirmationLabel",
        placeholder_key: "creditsConfirmationPlaceholder",
        required: true,
        field_order: 2
      }
    ]
  }
};
