// This file is now deprecated in favor of dynamic configuration from Supabase
// Keeping for fallback purposes during migration

export const getStepsForPackage = (selectedPackage: string) => {
  // Fallback configuration - this will be replaced by dynamic data from Supabase
  const commonSteps = [
    {
      step: 1,
      title: "choosePackage",
      fields: [
        { name: "package", type: "select", placeholder: "choosePackage", required: true }
      ]
    }
  ];

  const packageSpecificSteps: any = {
    personal: [
      {
        step: 2,
        title: "generalDetails",
        fields: [
          { name: "recipientName", type: "text", placeholder: "recipientName", required: true },
          { name: "relationship", type: "select", placeholder: "relationship", required: true },
          { name: "occasion", type: "select", placeholder: "occasion", required: true },
          { name: "eventDate", type: "date", placeholder: "eventDate", required: false },
          { name: "songLanguage", type: "select", placeholder: "songLanguage", required: true },
          { name: "pronunciationAudio_recipient", type: "file", placeholder: "pronunciationAudioRecipient", required: false }
        ]
      },
      {
        step: 3,
        title: "storyAndEmotionalDetails",
        fields: [
          { name: "story", type: "textarea", placeholder: "story", required: true },
          { name: "emotionalTone", type: "select", placeholder: "emotionalTone", required: true },
          { name: "keyMoments", type: "textarea", placeholder: "keyMoments", required: true },
          { name: "specialWords", type: "textarea", placeholder: "specialWords", required: false },
          { name: "pronunciationAudio_keywords", type: "file", placeholder: "pronunciationAudioKeywords", required: false }
        ]
      },
      {
        step: 4,
        title: "musicalPreferences",
        fields: [
          { name: "musicStyle", type: "select", placeholder: "musicStyle", required: true },
          { name: "referenceSong", type: "url", placeholder: "referenceSong", required: false },
          { name: "addons", type: "checkbox-group", options: ["rushDelivery", "commercialRights", "distributionMangoRecords", "customVideo", "audioMessageFromSender", "extendedSong"] }
        ]
      },
      {
        step: 5,
        title: "confirmation",
        fields: [
          { name: "fullName", type: "text", placeholder: "fullName", required: true },
          { name: "email", type: "email", placeholder: "email", required: true },
          { name: "phone", type: "tel", placeholder: "phone", required: false },
          { name: "acceptMentionObligation", type: "checkbox", placeholder: "acceptMentionObligation", required: true }
        ]
      }
    ],
    premium: [
      {
        step: 2,
        title: "generalDetails",
        fields: [
          { name: "recipientName", type: "text", placeholder: "recipientName", required: true },
          { name: "relationship", type: "select", placeholder: "relationship", required: true },
          { name: "occasion", type: "select", placeholder: "occasion", required: true },
          { name: "eventDate", type: "date", placeholder: "eventDate", required: false },
          { name: "songLanguage", type: "select", placeholder: "songLanguage", required: true },
          { name: "pronunciationAudio_recipient", type: "file", placeholder: "pronunciationAudioRecipient", required: false }
        ]
      },
      {
        step: 3,
        title: "storyAndEmotionalDetails",
        fields: [
          { name: "story", type: "textarea", placeholder: "story", required: true },
          { name: "emotionalTone", type: "select", placeholder: "emotionalTone", required: true },
          { name: "keyMoments", type: "textarea", placeholder: "keyMoments", required: true },
          { name: "specialWords", type: "textarea", placeholder: "specialWords", required: false },
          { name: "pronunciationAudio_keywords", type: "file", placeholder: "pronunciationAudioKeywords", required: false }
        ]
      },
      {
        step: 4,
        title: "musicalPreferences",
        fields: [
          { name: "musicStyle", type: "select", placeholder: "musicStyle", required: true },
          { name: "referenceSong", type: "url", placeholder: "referenceSong", required: false },
          { name: "addons", type: "checkbox-group", options: ["rushDelivery", "customVideo", "audioMessageFromSender", "extendedSong"] }
        ]
      },
      {
        step: 5,
        title: "confirmation",
        fields: [
          { name: "fullName", type: "text", placeholder: "fullName", required: true },
          { name: "email", type: "email", placeholder: "email", required: true },
          { name: "phone", type: "tel", placeholder: "phone", required: false },
          { name: "acceptMentionObligation", type: "checkbox", placeholder: "acceptMentionObligation", required: true },
          { name: "acceptDistribution", type: "checkbox", placeholder: "acceptDistribution", required: true },
          { name: "finalNote", type: "checkbox", placeholder: "finalNote", required: true }
        ]
      }
    ]
  };

  return [...commonSteps, ...(packageSpecificSteps[selectedPackage] || [])];
};
