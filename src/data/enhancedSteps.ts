
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
