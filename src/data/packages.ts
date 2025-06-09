
import type { Field, Step, FieldOption, Addon } from '@/types';

export interface PackageInclude {
  include_key: string;
  include_order?: number;
}

export interface PackageTag {
  id: string;
  tag_type: string;
  tag_label_key?: string;
  styling_class?: string;
}

export interface Package {
  id?: string;
  value: string;
  label_key: string;
  tagline_key: string;
  description_key: string;
  price_ron: number;
  price_eur: number;
  delivery_time_key: string;
  tag?: string;
  includes?: PackageInclude[];
  available_addons: string[];
  steps: Step[];
}

export interface OrderFlow {
  steps: {
    id: string;
    step_number: number;
    title_key: string;
    fields: {
      id: string;
      field_name: string;
      field_type: string;
      placeholder_key?: string;
      required: boolean;
      field_order: number;
      options?: { value: string; label_key: string }[];
    }[];
  }[];
}

export interface AddOn {
  id: string;
  value: string;
  label_key: string;
  description_key: string;
  price_ron: number;
  price_eur: number;
  availableFor: string[];
}

// Personal Package Order Flow
const personalOrderFlow: OrderFlow = {
  steps: [
    {
      id: "personal-step-1",
      step_number: 1,
      title_key: "generalDetails",
      fields: [
        {
          id: "personal_recipient_name",
          field_name: "recipientName",
          field_type: "text",
          placeholder_key: "recipientName",
          required: true,
          field_order: 1
        },
        {
          id: "personal_relationship",
          field_name: "relationship",
          field_type: "select",
          placeholder_key: "relationship",
          required: true,
          field_order: 2
        },
        {
          id: "personal_occasion",
          field_name: "occasion",
          field_type: "select",
          placeholder_key: "occasion",
          required: true,
          field_order: 3
        },
        {
          id: "personal_event_date",
          field_name: "eventDate",
          field_type: "date",
          placeholder_key: "eventDate",
          required: false,
          field_order: 4
        },
        {
          id: "personal_song_language",
          field_name: "songLanguage",
          field_type: "select",
          placeholder_key: "songLanguage",
          required: true,
          field_order: 5
        },
        {
          id: "personal_pronunciation_audio_recipient",
          field_name: "pronunciationAudio_recipient",
          field_type: "file",
          placeholder_key: "pronunciationAudioRecipient",
          required: false,
          field_order: 6
        }
      ]
    },
    {
      id: "personal-step-2",
      step_number: 2,
      title_key: "storyAndEmotionalDetails",
      fields: [
        {
          id: "personal_story",
          field_name: "story",
          field_type: "textarea",
          placeholder_key: "story",
          required: true,
          field_order: 1
        },
        {
          id: "personal_emotional_tone",
          field_name: "emotionalTone",
          field_type: "select",
          placeholder_key: "emotionalTone",
          required: true,
          field_order: 2
        },
        {
          id: "personal_key_moments",
          field_name: "keyMoments",
          field_type: "textarea",
          placeholder_key: "keyMoments",
          required: true,
          field_order: 3
        },
        {
          id: "personal_special_words",
          field_name: "specialWords",
          field_type: "textarea",
          placeholder_key: "specialWords",
          required: false,
          field_order: 4
        },
        {
          id: "personal_pronunciation_audio_keywords",
          field_name: "pronunciationAudio_keywords",
          field_type: "file",
          placeholder_key: "pronunciationAudioKeywords",
          required: false,
          field_order: 5
        }
      ]
    },
    {
      id: "personal-step-3",
      step_number: 3,
      title_key: "musicalPreferences",
      fields: [
        {
          id: "personal_music_style",
          field_name: "musicStyle",
          field_type: "select",
          placeholder_key: "musicStyle",
          required: true,
          field_order: 1
        },
        {
          id: "personal_voice_preference",
          field_name: "voice_preference",
          field_type: "radio",
          required: true,
          field_order: 2,
          options: [
            { value: "female", label_key: "voiceFemale" },
            { value: "male", label_key: "voiceMale" }
          ]
        },
        {
          id: "personal_reference_song",
          field_name: "referenceSong",
          field_type: "url",
          placeholder_key: "referenceSong",
          required: false,
          field_order: 3
        }
      ]
    },
    {
      id: "personal-step-4",
      step_number: 4,
      title_key: "confirmation",
      fields: [
        {
          id: "personal_full_name",
          field_name: "fullName",
          field_type: "text",
          placeholder_key: "fullName",
          required: true,
          field_order: 1
        },
        {
          id: "personal_email",
          field_name: "email",
          field_type: "email",
          placeholder_key: "email",
          required: true,
          field_order: 2
        },
        {
          id: "personal_phone",
          field_name: "phone",
          field_type: "tel",
          placeholder_key: "phone",
          required: false,
          field_order: 3
        },
        {
          id: "personal_accept_mention_obligation",
          field_name: "acceptMentionObligation",
          field_type: "checkbox",
          placeholder_key: "acceptMentionObligation",
          required: true,
          field_order: 4
        }
      ]
    }
  ]
};

// Premium Package Order Flow
const premiumOrderFlow: OrderFlow = {
  steps: [
    {
      id: "premium-step-1",
      step_number: 1,
      title_key: "generalDetails",
      fields: [
        {
          id: "premium_recipient_name",
          field_name: "recipientName",
          field_type: "text",
          placeholder_key: "recipientName",
          required: true,
          field_order: 1
        },
        {
          id: "premium_relationship",
          field_name: "relationship",
          field_type: "select",
          placeholder_key: "relationship",
          required: true,
          field_order: 2
        },
        {
          id: "premium_occasion",
          field_name: "occasion",
          field_type: "select",
          placeholder_key: "occasion",
          required: true,
          field_order: 3
        },
        {
          id: "premium_event_date",
          field_name: "eventDate",
          field_type: "date",
          placeholder_key: "eventDate",
          required: false,
          field_order: 4
        },
        {
          id: "premium_song_language",
          field_name: "songLanguage",
          field_type: "select",
          placeholder_key: "songLanguage",
          required: true,
          field_order: 5
        }
      ]
    },
    {
      id: "premium-step-2",
      step_number: 2,
      title_key: "storyAndEmotionalDetails",
      fields: [
        {
          id: "premium_story",
          field_name: "story",
          field_type: "textarea",
          placeholder_key: "story",
          required: true,
          field_order: 1
        },
        {
          id: "premium_emotional_tone",
          field_name: "emotionalTone",
          field_type: "select",
          placeholder_key: "emotionalTone",
          required: true,
          field_order: 2
        },
        {
          id: "premium_key_moments",
          field_name: "keyMoments",
          field_type: "textarea",
          placeholder_key: "keyMoments",
          required: true,
          field_order: 3
        }
      ]
    },
    {
      id: "premium-step-3",
      step_number: 3,
      title_key: "musicalPreferences",
      fields: [
        {
          id: "premium_music_style",
          field_name: "musicStyle",
          field_type: "select",
          placeholder_key: "musicStyle",
          required: true,
          field_order: 1
        },
        {
          id: "premium_voice_preference",
          field_name: "voice_preference",
          field_type: "radio",
          required: true,
          field_order: 2,
          options: [
            { value: "female", label_key: "voiceFemale" },
            { value: "male", label_key: "voiceMale" }
          ]
        }
      ]
    },
    {
      id: "premium-step-4",
      step_number: 4,
      title_key: "confirmation",
      fields: [
        {
          id: "premium_full_name",
          field_name: "fullName",
          field_type: "text",
          placeholder_key: "fullName",
          required: true,
          field_order: 1
        },
        {
          id: "premium_email",
          field_name: "email",
          field_type: "email",
          placeholder_key: "email",
          required: true,
          field_order: 2
        },
        {
          id: "premium_phone",
          field_name: "phone",
          field_type: "tel",
          placeholder_key: "phone",
          required: false,
          field_order: 3
        },
        {
          id: "premium_accept_mention_obligation",
          field_name: "acceptMentionObligation",
          field_type: "checkbox",
          placeholder_key: "acceptMentionObligation",
          required: true,
          field_order: 4
        },
        {
          id: "premium_accept_distribution",
          field_name: "acceptDistribution",
          field_type: "checkbox",
          placeholder_key: "acceptDistribution",
          required: true,
          field_order: 5
        },
        {
          id: "premium_final_note",
          field_name: "finalNote",
          field_type: "checkbox",
          placeholder_key: "finalNote",
          required: true,
          field_order: 6
        }
      ]
    }
  ]
};

// Business Package Order Flow
const businessOrderFlow: OrderFlow = {
  steps: [
    {
      id: "business-step-1",
      step_number: 1,
      title_key: "businessStep1Title",
      fields: [
        {
          id: "business_company_name",
          field_name: "company_name",
          field_type: "text",
          placeholder_key: "businessCompanyNamePlaceholder",
          required: true,
          field_order: 1
        },
        {
          id: "business_industry",
          field_name: "industry",
          field_type: "text",
          placeholder_key: "businessIndustryPlaceholder",
          required: true,
          field_order: 2
        },
        {
          id: "business_brand_values",
          field_name: "brand_values",
          field_type: "textarea",
          placeholder_key: "businessBrandValuesPlaceholder",
          required: true,
          field_order: 3
        }
      ]
    },
    {
      id: "business-step-2",
      step_number: 2,
      title_key: "businessStep2Title",
      fields: [
        {
          id: "business_campaign_purpose",
          field_name: "campaign_purpose",
          field_type: "radio",
          required: true,
          field_order: 1,
          options: [
            { value: "branding", label_key: "businessPurposeBranding" },
            { value: "advertising", label_key: "businessPurposeAdvertising" },
            { value: "event", label_key: "businessPurposeEvent" },
            { value: "product_launch", label_key: "businessPurposeProductLaunch" }
          ]
        },
        {
          id: "business_target_audience",
          field_name: "target_audience",
          field_type: "textarea",
          placeholder_key: "businessTargetAudiencePlaceholder",
          required: true,
          field_order: 2
        },
        {
          id: "business_message",
          field_name: "business_message",
          field_type: "textarea",
          placeholder_key: "businessMessagePlaceholder",
          required: true,
          field_order: 3
        }
      ]
    },
    {
      id: "business-step-3",
      step_number: 3,
      title_key: "businessStep3Title",
      fields: [
        {
          id: "business_music_style",
          field_name: "music_style",
          field_type: "select",
          placeholder_key: "musicStyle",
          required: true,
          field_order: 1
        },
        {
          id: "business_voice_preference",
          field_name: "voice_preference",
          field_type: "radio",
          required: true,
          field_order: 2,
          options: [
            { value: "female", label_key: "voiceFemale" },
            { value: "male", label_key: "voiceMale" },
            { value: "both", label_key: "businessVoiceBoth" }
          ]
        },
        {
          id: "business_usage_scope",
          field_name: "usage_scope",
          field_type: "checkbox-group",
          required: true,
          field_order: 3,
          options: [
            { value: "social_media", label_key: "businessUsageSocialMedia" },
            { value: "tv_radio", label_key: "businessUsageTvRadio" },
            { value: "online_ads", label_key: "businessUsageOnlineAds" },
            { value: "events", label_key: "businessUsageEvents" }
          ]
        }
      ]
    },
    {
      id: "business-step-4",
      step_number: 4,
      title_key: "confirmation",
      fields: [
        {
          id: "business_contact_name",
          field_name: "contact_name",
          field_type: "text",
          placeholder_key: "businessContactNamePlaceholder",
          required: true,
          field_order: 1
        },
        {
          id: "business_email",
          field_name: "email",
          field_type: "email",
          placeholder_key: "email",
          required: true,
          field_order: 2
        },
        {
          id: "business_phone",
          field_name: "phone",
          field_type: "tel",
          placeholder_key: "phone",
          required: true,
          field_order: 3
        },
        {
          id: "business_accept_terms",
          field_name: "accept_terms",
          field_type: "checkbox",
          placeholder_key: "businessAcceptTermsPlaceholder",
          required: true,
          field_order: 4
        }
      ]
    }
  ]
};

// Artist Package Order Flow
const artistOrderFlow: OrderFlow = {
  steps: [
    {
      id: "artist-step-1",
      step_number: 1,
      title_key: "artistStep1Title",
      fields: [
        {
          id: "artist_stage_name",
          field_name: "stage_name",
          field_type: "text",
          placeholder_key: "artistStageNamePlaceholder",
          required: true,
          field_order: 1
        },
        {
          id: "artist_genre",
          field_name: "genre",
          field_type: "select",
          placeholder_key: "artistGenrePlaceholder",
          required: true,
          field_order: 2
        },
        {
          id: "artist_experience",
          field_name: "experience",
          field_type: "radio",
          required: true,
          field_order: 3,
          options: [
            { value: "beginner", label_key: "artistExperienceBeginner" },
            { value: "intermediate", label_key: "artistExperienceIntermediate" },
            { value: "professional", label_key: "artistExperienceProfessional" }
          ]
        }
      ]
    },
    {
      id: "artist-step-2",
      step_number: 2,
      title_key: "artistStep2Title",
      fields: [
        {
          id: "artist_song_concept",
          field_name: "song_concept",
          field_type: "textarea",
          placeholder_key: "artistSongConceptPlaceholder",
          required: true,
          field_order: 1
        },
        {
          id: "artist_target_audience",
          field_name: "target_audience",
          field_type: "textarea",
          placeholder_key: "artistTargetAudiencePlaceholder",
          required: true,
          field_order: 2
        },
        {
          id: "artist_inspiration",
          field_name: "inspiration",
          field_type: "textarea",
          placeholder_key: "artistInspirationPlaceholder",
          required: false,
          field_order: 3
        }
      ]
    },
    {
      id: "artist-step-3",
      step_number: 3,
      title_key: "artistStep3Title",
      fields: [
        {
          id: "artist_voice_type",
          field_name: "voice_type",
          field_type: "radio",
          required: true,
          field_order: 1,
          options: [
            { value: "own_vocals", label_key: "artistVoiceOwnVocals" },
            { value: "session_singer", label_key: "artistVoiceSessionSinger" }
          ]
        },
        {
          id: "artist_distribution_platforms",
          field_name: "distribution_platforms",
          field_type: "checkbox-group",
          required: true,
          field_order: 2,
          options: [
            { value: "spotify", label_key: "artistPlatformSpotify" },
            { value: "apple_music", label_key: "artistPlatformAppleMusic" },
            { value: "youtube_music", label_key: "artistPlatformYouTubeMusic" },
            { value: "all_platforms", label_key: "artistPlatformAllPlatforms" }
          ]
        }
      ]
    },
    {
      id: "artist-step-4",
      step_number: 4,
      title_key: "confirmation",
      fields: [
        {
          id: "artist_full_name",
          field_name: "full_name",
          field_type: "text",
          placeholder_key: "fullName",
          required: true,
          field_order: 1
        },
        {
          id: "artist_email",
          field_name: "email",
          field_type: "email",
          placeholder_key: "email",
          required: true,
          field_order: 2
        },
        {
          id: "artist_phone",
          field_name: "phone",
          field_type: "tel",
          placeholder_key: "phone",
          required: true,
          field_order: 3
        },
        {
          id: "artist_accept_collaboration",
          field_name: "accept_collaboration",
          field_type: "checkbox",
          placeholder_key: "artistAcceptCollaborationPlaceholder",
          required: true,
          field_order: 4
        }
      ]
    }
  ]
};

// Remix Package Order Flow
const remixOrderFlow: OrderFlow = {
  steps: [
    {
      id: "remix-step-1",
      step_number: 1,
      title_key: "remixStep1Title",
      fields: [
        {
          id: "remix_original_song",
          field_name: "original_song",
          field_type: "file",
          placeholder_key: "remixOriginalSongPlaceholder",
          required: true,
          field_order: 1
        },
        {
          id: "remix_song_title",
          field_name: "song_title",
          field_type: "text",
          placeholder_key: "remixSongTitlePlaceholder",
          required: true,
          field_order: 2
        },
        {
          id: "remix_original_artist",
          field_name: "original_artist",
          field_type: "text",
          placeholder_key: "remixOriginalArtistPlaceholder",
          required: true,
          field_order: 3
        }
      ]
    },
    {
      id: "remix-step-2",
      step_number: 2,
      title_key: "remixStep2Title",
      fields: [
        {
          id: "remix_target_genre",
          field_name: "target_genre",
          field_type: "select",
          placeholder_key: "remixTargetGenrePlaceholder",
          required: true,
          field_order: 1
        },
        {
          id: "remix_energy_level",
          field_name: "energy_level",
          field_type: "radio",
          required: true,
          field_order: 2,
          options: [
            { value: "low", label_key: "remixEnergyLow" },
            { value: "medium", label_key: "remixEnergyMedium" },
            { value: "high", label_key: "remixEnergyHigh" }
          ]
        },
        {
          id: "remix_reference_tracks",
          field_name: "reference_tracks",
          field_type: "textarea",
          placeholder_key: "remixReferenceTracksPlaceholder",
          required: false,
          field_order: 3
        }
      ]
    },
    {
      id: "remix-step-3",
      step_number: 3,
      title_key: "remixStep3Title",
      fields: [
        {
          id: "remix_vocals_treatment",
          field_name: "vocals_treatment",
          field_type: "radio",
          required: true,
          field_order: 1,
          options: [
            { value: "keep_original", label_key: "remixVocalsKeepOriginal" },
            { value: "pitch_shift", label_key: "remixVocalsPitchShift" },
            { value: "time_stretch", label_key: "remixVocalsTimeStretch" }
          ]
        },
        {
          id: "remix_special_requests",
          field_name: "special_requests",
          field_type: "textarea",
          placeholder_key: "remixSpecialRequestsPlaceholder",
          required: false,
          field_order: 2
        }
      ]
    },
    {
      id: "remix-step-4",
      step_number: 4,
      title_key: "confirmation",
      fields: [
        {
          id: "remix_full_name",
          field_name: "full_name",
          field_type: "text",
          placeholder_key: "fullName",
          required: true,
          field_order: 1
        },
        {
          id: "remix_email",
          field_name: "email",
          field_type: "email",
          placeholder_key: "email",
          required: true,
          field_order: 2
        },
        {
          id: "remix_rights_confirmation",
          field_name: "rights_confirmation",
          field_type: "checkbox",
          placeholder_key: "remixRightsConfirmationPlaceholder",
          required: true,
          field_order: 3
        }
      ]
    }
  ]
};

// Instrumental Package Order Flow
const instrumentalOrderFlow: OrderFlow = {
  steps: [
    {
      id: "instrumental-step-1",
      step_number: 1,
      title_key: "instrumentalStep1Title",
      fields: [
        {
          id: "instrumental_genre",
          field_name: "genre",
          field_type: "select",
          placeholder_key: "instrumentalGenrePlaceholder",
          required: true,
          field_order: 1
        },
        {
          id: "instrumental_tempo",
          field_name: "tempo",
          field_type: "radio",
          required: true,
          field_order: 2,
          options: [
            { value: "slow", label_key: "instrumentalTempoSlow" },
            { value: "medium", label_key: "instrumentalTempoMedium" },
            { value: "fast", label_key: "instrumentalTempoFast" }
          ]
        },
        {
          id: "instrumental_mood",
          field_name: "mood",
          field_type: "select",
          placeholder_key: "instrumentalMoodPlaceholder",
          required: true,
          field_order: 3
        }
      ]
    },
    {
      id: "instrumental-step-2",
      step_number: 2,
      title_key: "instrumentalStep2Title",
      fields: [
        {
          id: "instrumental_structure",
          field_name: "structure",
          field_type: "radio",
          required: true,
          field_order: 1,
          options: [
            { value: "standard", label_key: "instrumentalStructureStandard" },
            { value: "extended", label_key: "instrumentalStructureExtended" },
            { value: "custom", label_key: "instrumentalStructureCustom" }
          ]
        },
        {
          id: "instrumental_key_signature",
          field_name: "key_signature",
          field_type: "select",
          placeholder_key: "instrumentalKeySignaturePlaceholder",
          required: false,
          field_order: 2
        }
      ]
    },
    {
      id: "instrumental-step-3",
      step_number: 3,
      title_key: "instrumentalStep3Title",
      fields: [
        {
          id: "instrumental_usage_purpose",
          field_name: "usage_purpose",
          field_type: "radio",
          required: true,
          field_order: 1,
          options: [
            { value: "personal_use", label_key: "instrumentalUsagePersonal" },
            { value: "commercial_use", label_key: "instrumentalUsageCommercial" },
            { value: "youtube_content", label_key: "instrumentalUsageYouTube" }
          ]
        },
        {
          id: "instrumental_reference_songs",
          field_name: "reference_songs",
          field_type: "textarea",
          placeholder_key: "instrumentalReferenceSongsPlaceholder",
          required: false,
          field_order: 2
        }
      ]
    },
    {
      id: "instrumental-step-4",
      step_number: 4,
      title_key: "confirmation",
      fields: [
        {
          id: "instrumental_full_name",
          field_name: "full_name",
          field_type: "text",
          placeholder_key: "fullName",
          required: true,
          field_order: 1
        },
        {
          id: "instrumental_email",
          field_name: "email",
          field_type: "email",
          placeholder_key: "email",
          required: true,
          field_order: 2
        },
        {
          id: "instrumental_accept_license",
          field_name: "accept_license",
          field_type: "checkbox",
          placeholder_key: "instrumentalAcceptLicensePlaceholder",
          required: true,
          field_order: 3
        }
      ]
    }
  ]
};

// Plus Package Order Flow (Simplified)
const plusOrderFlow: OrderFlow = {
  steps: [
    {
      id: "plus-step-1",
      step_number: 1,
      title_key: "plusStep1Title",
      fields: [
        {
          id: "plus_recipient_name",
          field_name: "recipient_name",
          field_type: "text",
          placeholder_key: "plusRecipientNamePlaceholder",
          required: true,
          field_order: 1
        },
        {
          id: "plus_message_content",
          field_name: "message_content",
          field_type: "textarea",
          placeholder_key: "plusMessageContentPlaceholder",
          required: true,
          field_order: 2
        }
      ]
    },
    {
      id: "plus-step-2",
      step_number: 2,
      title_key: "plusStep2Title",
      fields: [
        {
          id: "plus_music_style",
          field_name: "music_style",
          field_type: "radio",
          required: true,
          field_order: 1,
          options: [
            { value: "happy", label_key: "plusStyleHappy" },
            { value: "romantic", label_key: "plusStyleRomantic" },
            { value: "energetic", label_key: "plusStyleEnergetic" }
          ]
        },
        {
          id: "plus_voice_preference",
          field_name: "voice_preference",
          field_type: "radio",
          required: true,
          field_order: 2,
          options: [
            { value: "female", label_key: "voiceFemale" },
            { value: "male", label_key: "voiceMale" }
          ]
        }
      ]
    },
    {
      id: "plus-step-3",
      step_number: 3,
      title_key: "confirmation",
      fields: [
        {
          id: "plus_full_name",
          field_name: "full_name",
          field_type: "text",
          placeholder_key: "fullName",
          required: true,
          field_order: 1
        },
        {
          id: "plus_email",
          field_name: "email",
          field_type: "email",
          placeholder_key: "email",
          required: true,
          field_order: 2
        }
      ]
    }
  ]
};

// Gift Package Order Flow (Special case - handled by GiftPurchaseWizard)
const giftOrderFlow: OrderFlow = {
  steps: [
    {
      id: "gift-step-1",
      step_number: 1,
      title_key: "giftStep1Title",
      fields: [
        {
          id: "gift_amount",
          field_name: "gift_amount",
          field_type: "radio",
          required: true,
          field_order: 1,
          options: [
            { value: "299", label_key: "gift299RON" },
            { value: "500", label_key: "gift500RON" },
            { value: "custom", label_key: "giftCustomAmount" }
          ]
        }
      ]
    },
    {
      id: "gift-step-2",
      step_number: 2,
      title_key: "giftStep2Title",
      fields: [
        {
          id: "gift_sender_name",
          field_name: "sender_name",
          field_type: "text",
          placeholder_key: "giftSenderNamePlaceholder",
          required: true,
          field_order: 1
        },
        {
          id: "gift_recipient_name",
          field_name: "recipient_name",
          field_type: "text",
          placeholder_key: "giftRecipientNamePlaceholder",
          required: true,
          field_order: 2
        },
        {
          id: "gift_recipient_email",
          field_name: "recipient_email",
          field_type: "email",
          placeholder_key: "giftRecipientEmailPlaceholder",
          required: true,
          field_order: 3
        },
        {
          id: "gift_message",
          field_name: "gift_message",
          field_type: "textarea",
          placeholder_key: "giftMessagePlaceholder",
          required: false,
          field_order: 4
        }
      ]
    }
  ]
};

// Wedding Package Order Flow
const weddingOrderFlow: OrderFlow = {
  steps: [
    {
      id: "wedding-step-1",
      step_number: 1,
      title_key: "weddingStep1Title",
      fields: [
        {
          id: "wedding_couple_names",
          field_name: "couple_names",
          field_type: "text",
          placeholder_key: "weddingCoupleNamesPlaceholder",
          required: true,
          field_order: 1
        },
        {
          id: "wedding_couple_type",
          field_name: "couple_type",
          field_type: "radio",
          required: true,
          field_order: 2,
          options: [
            { value: "bride_groom", label_key: "weddingBrideGroom" },
            { value: "godparents", label_key: "weddingGodparents" }
          ]
        },
        {
          id: "wedding_how_met",
          field_name: "how_met",
          field_type: "textarea",
          placeholder_key: "weddingHowMetPlaceholder",
          required: true,
          field_order: 3
        }
      ]
    },
    {
      id: "wedding-step-2",
      step_number: 2,
      title_key: "weddingStep2Title",
      fields: [
        {
          id: "wedding_love_story",
          field_name: "love_story",
          field_type: "textarea",
          placeholder_key: "weddingLoveStoryPlaceholder",
          required: true,
          field_order: 1
        },
        {
          id: "wedding_atmosphere",
          field_name: "atmosphere",
          field_type: "radio",
          required: true,
          field_order: 2,
          options: [
            { value: "romantic", label_key: "weddingAtmosphereRomantic" },
            { value: "emotional", label_key: "weddingAtmosphereEmotional" },
            { value: "elegant", label_key: "weddingAtmosphereElegant" }
          ]
        },
        {
          id: "wedding_voice_preference",
          field_name: "voice_preference",
          field_type: "radio",
          required: true,
          field_order: 3,
          options: [
            { value: "female", label_key: "voiceFemale" },
            { value: "male", label_key: "voiceMale" }
          ]
        },
        {
          id: "wedding_musical_style",
          field_name: "musical_style",
          field_type: "textarea",
          placeholder_key: "weddingMusicalStylePlaceholder",
          required: true,
          field_order: 4
        }
      ]
    }
  ]
};

// Baptism Package Order Flow
const baptismOrderFlow: OrderFlow = {
  steps: [
    {
      id: "baptism-step-1",
      step_number: 1,
      title_key: "baptismStep1Title",
      fields: [
        {
          id: "baptism_child_name",
          field_name: "child_name",
          field_type: "text",
          placeholder_key: "baptismChildNamePlaceholder",
          required: true,
          field_order: 1
        },
        {
          id: "baptism_name_meaning",
          field_name: "name_meaning",
          field_type: "text",
          placeholder_key: "baptismNameMeaningPlaceholder",
          required: false,
          field_order: 2
        },
        {
          id: "baptism_birth_story",
          field_name: "birth_story",
          field_type: "textarea",
          placeholder_key: "baptismBirthStoryPlaceholder",
          required: true,
          field_order: 3
        }
      ]
    },
    {
      id: "baptism-step-2",
      step_number: 2,
      title_key: "baptismStep2Title",
      fields: [
        {
          id: "baptism_atmosphere",
          field_name: "atmosphere",
          field_type: "radio",
          required: true,
          field_order: 1,
          options: [
            { value: "calm", label_key: "baptismAtmosphereCalm" },
            { value: "playful", label_key: "baptismAtmospherePlayful" },
            { value: "emotional", label_key: "baptismAtmosphereEmotional" }
          ]
        },
        {
          id: "baptism_voice_preference",
          field_name: "voice_preference",
          field_type: "radio",
          required: true,
          field_order: 2,
          options: [
            { value: "female", label_key: "voiceFemale" },
            { value: "male", label_key: "voiceMale" }
          ]
        },
        {
          id: "baptism_musical_style",
          field_name: "musical_style",
          field_type: "radio",
          required: true,
          field_order: 3,
          options: [
            { value: "ballad", label_key: "baptismStyleBallad" },
            { value: "lullaby", label_key: "baptismStyleLullaby" },
            { value: "acoustic_pop", label_key: "baptismStyleAcousticPop" }
          ]
        }
      ]
    }
  ]
};

// Coming of Age Package Order Flow
const comingOfAgeOrderFlow: OrderFlow = {
  steps: [
    {
      id: "coming-of-age-step-1",
      step_number: 1,
      title_key: "comingOfAgeStep1Title",
      fields: [
        {
          id: "coming_of_age_celebrant_name",
          field_name: "celebrant_name",
          field_type: "text",
          placeholder_key: "comingOfAgeCelebrantNamePlaceholder",
          required: true,
          field_order: 1
        },
        {
          id: "coming_of_age_hobbies",
          field_name: "hobbies",
          field_type: "textarea",
          placeholder_key: "comingOfAgeHobbiesPlaceholder",
          required: true,
          field_order: 2
        },
        {
          id: "coming_of_age_personal_message",
          field_name: "personal_message",
          field_type: "textarea",
          placeholder_key: "comingOfAgePersonalMessagePlaceholder",
          required: true,
          field_order: 3
        }
      ]
    },
    {
      id: "coming-of-age-step-2",
      step_number: 2,
      title_key: "comingOfAgeStep2Title",
      fields: [
        {
          id: "coming_of_age_musical_style",
          field_name: "musical_style",
          field_type: "radio",
          required: true,
          field_order: 1,
          options: [
            { value: "hip_hop", label_key: "comingOfAgeStyleHipHop" },
            { value: "pop", label_key: "comingOfAgeStylePop" },
            { value: "trap", label_key: "comingOfAgeStyleTrap" },
            { value: "lofi", label_key: "comingOfAgeStyleLofi" }
          ]
        },
        {
          id: "coming_of_age_vibe",
          field_name: "vibe",
          field_type: "radio",
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
          id: "coming_of_age_favorite_artists",
          field_name: "favorite_artists",
          field_type: "textarea",
          placeholder_key: "comingOfAgeFavoriteArtistsPlaceholder",
          required: false,
          field_order: 3
        },
        {
          id: "coming_of_age_voice_preference",
          field_name: "voice_preference",
          field_type: "radio",
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
};

export const packages: Package[] = [
  {
    id: "plus",
    value: "plus",
    label_key: "plusPackage",
    description_key: "plusDescription",
    tagline_key: "plusTagline",
    price_ron: 1,
    price_eur: 1,
    delivery_time_key: "plusDelivery",
    includes: [
      { include_key: "plusInclude1" },
      { include_key: "plusInclude2" },
      { include_key: "plusInclude3" },
    ],
    available_addons: ["rushDelivery", "socialMediaRights", "customVideo", "audioMessageFromSender", "extendedSong"],
    steps: plusOrderFlow.steps,
    tag: "new",
  },
  {
    id: "personal",
    value: "personal",
    label_key: "personalPackage",
    description_key: "personalDescription",
    tagline_key: "personalTagline",
    price_ron: 299,
    price_eur: 59,
    delivery_time_key: "personalDelivery",
    includes: [
      { include_key: "personalInclude1" },
      { include_key: "personalInclude2" },
      { include_key: "personalInclude3" },
      { include_key: "personalInclude4" },
    ],
    available_addons: ["rushDelivery", "socialMediaRights", "distributieMangoRecords", "customVideo", "audioMessageFromSender", "extendedSong"],
    steps: personalOrderFlow.steps,
  },
  {
    id: "premium",
    value: "premium",
    label_key: "premiumPackage",
    description_key: "premiumDescription",
    tagline_key: "premiumTagline",
    price_ron: 499,
    price_eur: 99,
    delivery_time_key: "premiumDelivery",
    includes: [
      { include_key: "premiumInclude1" },
      { include_key: "premiumInclude2" },
      { include_key: "premiumInclude3" },
    ],
    available_addons: ["rushDelivery", "customVideo", "audioMessageFromSender", "extendedSong"],
    steps: premiumOrderFlow.steps,
    tag: "popular",
  },
  {
    id: "business",
    value: "business",
    label_key: "businessPackage",
    description_key: "businessDescription",
    tagline_key: "businessTagline",
    price_ron: 499,
    price_eur: 99,
    delivery_time_key: "businessDelivery",
    includes: [
      { include_key: "businessInclude1" },
      { include_key: "businessInclude2" },
      { include_key: "businessInclude3" },
      { include_key: "businessInclude4" },
    ],
    available_addons: ["rushDelivery", "customVideo", "brandedAudioMessage", "commercialRightsUpgrade", "extendedSong"],
    steps: businessOrderFlow.steps,
  },
  {
    id: "artist",
    value: "artist",
    label_key: "artistPackage",
    description_key: "artistDescription",
    tagline_key: "artistTagline",
    price_ron: 7999,
    price_eur: 1599,
    delivery_time_key: "artistDelivery",
    includes: [
      { include_key: "artistInclude1" },
      { include_key: "artistInclude2" },
      { include_key: "artistInclude3" },
      { include_key: "artistInclude4" },
    ],
    available_addons: [],
    steps: artistOrderFlow.steps,
  },
  {
    id: "remix",
    value: "remix",
    label_key: "remixPackage",
    description_key: "remixDescription",
    tagline_key: "remixTagline",
    price_ron: 499,
    price_eur: 99,
    delivery_time_key: "remixDelivery",
    includes: [
      { include_key: "remixInclude1" },
      { include_key: "remixInclude2" },
      { include_key: "remixInclude3" },
      { include_key: "remixInclude4" },
      { include_key: "remixInclude5" },
      { include_key: "remixInclude6" },
    ],
    available_addons: ["rushDelivery", "socialMediaRights", "distributieMangoRecords", "customVideo", "audioMessageFromSender"],
    steps: remixOrderFlow.steps,
  },
  {
    id: "instrumental",
    value: "instrumental",
    label_key: "instrumentalPackage",
    description_key: "instrumentalDescription",
    tagline_key: "instrumentalTagline",
    price_ron: 499,
    price_eur: 99,
    delivery_time_key: "instrumentalDelivery",
    includes: [
      { include_key: "instrumentalInclude1" },
      { include_key: "instrumentalInclude2" },
      { include_key: "instrumentalInclude3" },
      { include_key: "instrumentalInclude4" },
      { include_key: "instrumentalInclude5" },
    ],
    available_addons: ["rushDelivery", "socialMediaRights", "distributieMangoRecords", "customVideo", "audioMessageFromSender"],
    steps: instrumentalOrderFlow.steps,
  },
  {
    id: "gift",
    value: "gift",
    label_key: "giftPackage",
    description_key: "giftDescription",
    tagline_key: "giftTagline",
    price_ron: 299,
    price_eur: 59,
    delivery_time_key: "giftDelivery",
    includes: [
      { include_key: "giftInclude1" },
      { include_key: "giftInclude2" },
      { include_key: "giftInclude3" },
    ],
    available_addons: [],
    steps: giftOrderFlow.steps,
    tag: "gift",
  },
  {
    id: "wedding",
    value: "wedding",
    label_key: "weddingPackage",
    description_key: "weddingDescription",
    tagline_key: "weddingTagline",
    price_ron: 299,
    price_eur: 59,
    delivery_time_key: "weddingDelivery",
    includes: [
      { include_key: "weddingInclude1" },
      { include_key: "weddingInclude2" },
      { include_key: "weddingInclude3" },
      { include_key: "weddingInclude4" },
      { include_key: "weddingInclude5" },
      { include_key: "weddingInclude6" },
      { include_key: "weddingInclude7" },
      { include_key: "weddingInclude8" }
    ],
    available_addons: ["rushDelivery", "socialMediaRights", "customVideo", "audioMessageFromSender", "extendedSong", "godparentsmelody"],
    steps: weddingOrderFlow.steps,
    tag: "new"
  },
  {
    id: "baptism",
    value: "baptism",
    label_key: "baptismPackage",
    description_key: "baptismDescription",
    tagline_key: "baptismTagline",
    price_ron: 299,
    price_eur: 59,
    delivery_time_key: "baptismDelivery",
    includes: [
      { include_key: "baptismInclude1" },
      { include_key: "baptismInclude2" },
      { include_key: "baptismInclude3" },
      { include_key: "baptismInclude4" },
      { include_key: "baptismInclude5" },
      { include_key: "baptismInclude6" }
    ],
    available_addons: ["rushDelivery", "socialMediaRights", "distributieMangoRecords", "customVideo", "audioMessageFromSender", "extendedSong"],
    steps: baptismOrderFlow.steps,
    tag: "new"
  },
  {
    id: "coming-of-age",
    value: "coming-of-age",
    label_key: "comingOfAgePackage",
    description_key: "comingOfAgeDescription",
    tagline_key: "comingOfAgeTagline",
    price_ron: 299,
    price_eur: 59,
    delivery_time_key: "comingOfAgeDelivery",
    includes: [
      { include_key: "comingOfAgeInclude1" },
      { include_key: "comingOfAgeInclude2" },
      { include_key: "comingOfAgeInclude3" },
      { include_key: "comingOfAgeInclude4" },
      { include_key: "comingOfAgeInclude5" },
      { include_key: "comingOfAgeInclude6" }
    ],
    available_addons: ["rushDelivery", "socialMediaRights", "customVideo", "audioMessageFromSender", "extendedSong"],
    steps: comingOfAgeOrderFlow.steps,
    tag: "new"
  }
];

export const addOns: AddOn[] = [
  {
    id: "rushDelivery",
    value: "rushDelivery",
    label_key: "rushDelivery",
    description_key: "rushDeliveryDesc",
    price_ron: 99,
    price_eur: 20,
    availableFor: ['personal', 'business', 'premium', 'instrumental', 'remix', 'wedding', 'baptism', 'comingOfAge']
  },
  {
    id: "socialMediaRights",
    value: "socialMediaRights",
    label_key: "socialMediaRights",
    description_key: "socialMediaRightsDesc",
    price_ron: 0,
    price_eur: 0,
    availableFor: ['personal', 'wedding', 'baptism', 'comingOfAge']
  },
  {
    id: "distributieMangoRecords",
    value: "distributieMangoRecords",
    label_key: "distributieMangoRecords",
    description_key: "distributieMangoRecordsDesc",
    price_ron: 199,
    price_eur: 40,
    availableFor: ['personal', 'remix', 'instrumental', 'wedding', 'baptism', 'comingOfAge', 'business']
  },
  {
    id: "customVideo",
    value: "customVideo",
    label_key: "customVideo",
    description_key: "customVideoDesc",
    price_ron: 149,
    price_eur: 30,
    availableFor: ['personal', 'business', 'premium', 'instrumental', 'remix', 'wedding', 'baptism', 'comingOfAge']
  },
  {
    id: "audioMessageFromSender",
    value: "audioMessageFromSender",
    label_key: "audioMessageFromSender",
    description_key: "audioMessageFromSenderDesc",
    price_ron: 99,
    price_eur: 20,
    availableFor: ['personal', 'premium', 'wedding', 'baptism', 'comingOfAge']
  },
  {
    id: "brandedAudioMessage",
    value: "brandedAudioMessage",
    label_key: "brandedAudioMessage",
    description_key: "brandedAudioMessageDesc",
    price_ron: 0,
    price_eur: 0,
    availableFor: ['business']
  },
  {
    id: "commercialRightsUpgrade",
    value: "commercialRightsUpgrade",
    label_key: "commercialRightsUpgrade",
    description_key: "commercialRightsUpgradeDesc",
    price_ron: 399,
    price_eur: 80,
    availableFor: ['business']
  },
  {
    id: "extendedSong",
    value: "extendedSong",
    label_key: "extendedSong",
    description_key: "extendedSongDesc",
    price_ron: 49,
    price_eur: 10,
    availableFor: ['personal', 'premium', 'business', 'wedding', 'baptism', 'comingOfAge']
  },
  {
    id: "godparentsmelody",
    value: "godparentsmelody",
    label_key: "godparentsmelody",
    description_key: "godparentsmelodyDesc",
    price_ron: 199,
    price_eur: 40,
    availableFor: ['wedding']
  },
  {
    id: "separatedStems",
    value: "separatedStems",
    label_key: "separatedStems",
    description_key: "separatedStemsDesc",
    price_ron: 149,
    price_eur: 30,
    availableFor: ['personal', 'business', 'premium', 'instrumental', 'remix', 'artist', 'wedding', 'baptism', 'comingOfAge']
  }
];

// Export PackageData type alias
export type PackageData = Package;
