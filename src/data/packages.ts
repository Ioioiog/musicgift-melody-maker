

import { Package, Addon } from '@/types';

export const packages: Package[] = [
  {
    id: 'personal',
    value: 'personal',
    label_key: 'personal',
    tagline_key: 'personalTagline',
    description_key: 'personalDescription',
    price_ron: 299,
    price_eur: 59,
    price_usd: 69,
    delivery_time_key: 'delivery3to5days',
    tag: 'popular',
    is_active: true,
    is_popular: true,
    is_quote_only: false,
    includes: [
      { include_key: 'professionalRecording', include_order: 1 },
      { include_key: 'personalizedLyrics', include_order: 2 },
      { include_key: 'highQualityAudio', include_order: 3 },
      { include_key: 'digitalDelivery', include_order: 4 }
    ],
    available_addons: ['rushDelivery', 'socialMediaRights', 'customVideo', 'audioMessage'],
    steps: [
      {
        id: 'personal-step-1',
        step_number: 1,
        title_key: 'generalDetails',
        fields: [
          { id: 'recipientName', field_name: 'recipientName', field_type: 'text', placeholder_key: 'recipientName', required: true, field_order: 1 },
          { id: 'relationship', field_name: 'relationship', field_type: 'select', placeholder_key: 'relationship', required: true, field_order: 2, options: [
            { value: 'partner', label_key: 'partner' },
            { value: 'friend', label_key: 'friend' },
            { value: 'family', label_key: 'family' },
            { value: 'colleague', label_key: 'colleague' }
          ]},
          { id: 'occasion', field_name: 'occasion', field_type: 'select', placeholder_key: 'occasion', required: true, field_order: 3, options: [
            { value: 'birthday', label_key: 'birthday' },
            { value: 'anniversary', label_key: 'anniversary' },
            { value: 'valentine', label_key: 'valentine' },
            { value: 'graduation', label_key: 'graduation' },
            { value: 'other', label_key: 'other' }
          ]},
          { id: 'eventDate', field_name: 'eventDate', field_type: 'date', placeholder_key: 'eventDate', required: false, field_order: 4 },
          { id: 'songLanguage', field_name: 'songLanguage', field_type: 'select', placeholder_key: 'songLanguage', required: true, field_order: 5, options: [
            { value: 'en', label_key: 'english' },
            { value: 'ro', label_key: 'romanian' },
            { value: 'de', label_key: 'german' },
            { value: 'fr', label_key: 'french' },
            { value: 'it', label_key: 'italian' },
            { value: 'pl', label_key: 'polish' }
          ]}
        ]
      },
      {
        id: 'personal-step-2',
        step_number: 2,
        title_key: 'storyAndEmotionalDetails',
        fields: [
          { id: 'story', field_name: 'story', field_type: 'textarea', placeholder_key: 'story', required: true, field_order: 1 },
          { id: 'emotionalTone', field_name: 'emotionalTone', field_type: 'select', placeholder_key: 'emotionalTone', required: true, field_order: 2, options: [
            { value: 'happy', label_key: 'happy' },
            { value: 'romantic', label_key: 'romantic' },
            { value: 'nostalgic', label_key: 'nostalgic' },
            { value: 'uplifting', label_key: 'uplifting' },
            { value: 'sentimental', label_key: 'sentimental' }
          ]},
          { id: 'keyMoments', field_name: 'keyMoments', field_type: 'textarea', placeholder_key: 'keyMoments', required: true, field_order: 3 },
          { id: 'specialWords', field_name: 'specialWords', field_type: 'textarea', placeholder_key: 'specialWords', required: false, field_order: 4 }
        ]
      },
      {
        id: 'personal-step-3',
        step_number: 3,
        title_key: 'musicalPreferences',
        fields: [
          { id: 'musicStyle', field_name: 'musicStyle', field_type: 'select', placeholder_key: 'musicStyle', required: true, field_order: 1, options: [
            { value: 'pop', label_key: 'pop' },
            { value: 'rock', label_key: 'rock' },
            { value: 'acoustic', label_key: 'acoustic' },
            { value: 'ballad', label_key: 'ballad' },
            { value: 'electronic', label_key: 'electronic' },
            { value: 'jazz', label_key: 'jazz' }
          ]},
          { id: 'referenceSong', field_name: 'referenceSong', field_type: 'url', placeholder_key: 'referenceSong', required: false, field_order: 2 }
        ]
      }
    ]
  },
  {
    id: 'premium',
    value: 'premium',
    label_key: 'premium',
    tagline_key: 'premiumTagline',
    description_key: 'premiumDescription',
    price_ron: 499,
    price_eur: 99,
    price_usd: 115,
    delivery_time_key: 'delivery5to7days',
    is_active: true,
    is_popular: false,
    is_quote_only: false,
    includes: [
      { include_key: 'professionalRecording', include_order: 1 },
      { include_key: 'personalizedLyrics', include_order: 2 },
      { include_key: 'highQualityAudio', include_order: 3 },
      { include_key: 'digitalDelivery', include_order: 4 },
      { include_key: 'multipleVersions', include_order: 5 }
    ],
    available_addons: ['rushDelivery', 'socialMediaRights', 'mangoRecords', 'customVideo'],
    steps: [
      {
        id: 'premium-step-1',
        step_number: 1,
        title_key: 'generalDetails',
        fields: [
          { id: 'recipientName', field_name: 'recipientName', field_type: 'text', placeholder_key: 'recipientName', required: true, field_order: 1 },
          { id: 'relationship', field_name: 'relationship', field_type: 'select', placeholder_key: 'relationship', required: true, field_order: 2, options: [
            { value: 'partner', label_key: 'partner' },
            { value: 'friend', label_key: 'friend' },
            { value: 'family', label_key: 'family' },
            { value: 'colleague', label_key: 'colleague' }
          ]},
          { id: 'occasion', field_name: 'occasion', field_type: 'select', placeholder_key: 'occasion', required: true, field_order: 3, options: [
            { value: 'birthday', label_key: 'birthday' },
            { value: 'anniversary', label_key: 'anniversary' },
            { value: 'valentine', label_key: 'valentine' },
            { value: 'graduation', label_key: 'graduation' },
            { value: 'other', label_key: 'other' }
          ]},
          { id: 'eventDate', field_name: 'eventDate', field_type: 'date', placeholder_key: 'eventDate', required: false, field_order: 4 },
          { id: 'songLanguage', field_name: 'songLanguage', field_type: 'select', placeholder_key: 'songLanguage', required: true, field_order: 5, options: [
            { value: 'en', label_key: 'english' },
            { value: 'ro', label_key: 'romanian' },
            { value: 'de', label_key: 'german' },
            { value: 'fr', label_key: 'french' },
            { value: 'it', label_key: 'italian' },
            { value: 'pl', label_key: 'polish' }
          ]}
        ]
      },
      {
        id: 'premium-step-2',
        step_number: 2,
        title_key: 'storyAndEmotionalDetails',
        fields: [
          { id: 'story', field_name: 'story', field_type: 'textarea', placeholder_key: 'story', required: true, field_order: 1 },
          { id: 'emotionalTone', field_name: 'emotionalTone', field_type: 'select', placeholder_key: 'emotionalTone', required: true, field_order: 2, options: [
            { value: 'happy', label_key: 'happy' },
            { value: 'romantic', label_key: 'romantic' },
            { value: 'nostalgic', label_key: 'nostalgic' },
            { value: 'uplifting', label_key: 'uplifting' },
            { value: 'sentimental', label_key: 'sentimental' }
          ]},
          { id: 'keyMoments', field_name: 'keyMoments', field_type: 'textarea', placeholder_key: 'keyMoments', required: true, field_order: 3 },
          { id: 'specialWords', field_name: 'specialWords', field_type: 'textarea', placeholder_key: 'specialWords', required: false, field_order: 4 },
          { id: 'versionPreferences', field_name: 'versionPreferences', field_type: 'textarea', placeholder_key: 'versionPreferences', required: false, field_order: 5 }
        ]
      },
      {
        id: 'premium-step-3',
        step_number: 3,
        title_key: 'musicalPreferences',
        fields: [
          { id: 'musicStyle', field_name: 'musicStyle', field_type: 'select', placeholder_key: 'musicStyle', required: true, field_order: 1, options: [
            { value: 'pop', label_key: 'pop' },
            { value: 'rock', label_key: 'rock' },
            { value: 'acoustic', label_key: 'acoustic' },
            { value: 'ballad', label_key: 'ballad' },
            { value: 'electronic', label_key: 'electronic' },
            { value: 'jazz', label_key: 'jazz' }
          ]},
          { id: 'referenceSong', field_name: 'referenceSong', field_type: 'url', placeholder_key: 'referenceSong', required: false, field_order: 2 }
        ]
      }
    ]
  },
  {
    id: 'business',
    value: 'business',
    label_key: 'business',
    tagline_key: 'businessTagline',
    description_key: 'businessDescription',
    price_ron: 499,
    price_eur: 99,
    price_usd: 115,
    delivery_time_key: 'delivery7to10days',
    is_active: true,
    is_popular: false,
    is_quote_only: false,
    includes: [
      { include_key: 'professionalRecording', include_order: 1 },
      { include_key: 'commercialRights', include_order: 2 },
      { include_key: 'brandedContent', include_order: 3 },
      { include_key: 'highQualityAudio', include_order: 4 }
    ],
    available_addons: ['rushDelivery', 'commercialRights', 'brandedAudio', 'separatedStems'],
    steps: [
      {
        id: 'business-step-1',
        step_number: 1,
        title_key: 'companyInformation',
        fields: [
          { id: 'companyName', field_name: 'companyName', field_type: 'text', placeholder_key: 'companyName', required: true, field_order: 1 },
          { id: 'industry', field_name: 'industry', field_type: 'select', placeholder_key: 'industry', required: true, field_order: 2, options: [
            { value: 'technology', label_key: 'technology' },
            { value: 'healthcare', label_key: 'healthcare' },
            { value: 'finance', label_key: 'finance' },
            { value: 'education', label_key: 'education' },
            { value: 'retail', label_key: 'retail' },
            { value: 'other', label_key: 'other' }
          ]},
          { id: 'targetAudience', field_name: 'targetAudience', field_type: 'textarea', placeholder_key: 'targetAudience', required: true, field_order: 3 }
        ]
      },
      {
        id: 'business-step-2',
        step_number: 2,
        title_key: 'brandValues',
        fields: [
          { id: 'brandMessage', field_name: 'brandMessage', field_type: 'textarea', placeholder_key: 'brandMessage', required: true, field_order: 1 },
          { id: 'keyValues', field_name: 'keyValues', field_type: 'textarea', placeholder_key: 'keyValues', required: true, field_order: 2 },
          { id: 'usageContext', field_name: 'usageContext', field_type: 'select', placeholder_key: 'usageContext', required: true, field_order: 3, options: [
            { value: 'advertisement', label_key: 'advertisement' },
            { value: 'presentation', label_key: 'presentation' },
            { value: 'event', label_key: 'event' },
            { value: 'website', label_key: 'website' },
            { value: 'social_media', label_key: 'socialMedia' }
          ]}
        ]
      },
      {
        id: 'business-step-3',
        step_number: 3,
        title_key: 'musicalPreferences',
        fields: [
          { id: 'musicStyle', field_name: 'musicStyle', field_type: 'select', placeholder_key: 'musicStyle', required: true, field_order: 1, options: [
            { value: 'corporate', label_key: 'corporate' },
            { value: 'upbeat', label_key: 'upbeat' },
            { value: 'inspirational', label_key: 'inspirational' },
            { value: 'modern', label_key: 'modern' },
            { value: 'classical', label_key: 'classical' }
          ]},
          { id: 'referenceSong', field_name: 'referenceSong', field_type: 'url', placeholder_key: 'referenceSong', required: false, field_order: 2 }
        ]
      }
    ]
  },
  {
    id: 'artist',
    value: 'artist',
    label_key: 'artist',
    tagline_key: 'artistTagline',
    description_key: 'artistDescription',
    price_ron: 7999,
    price_eur: 1499,
    price_usd: 1749,
    delivery_time_key: 'delivery14to21days',
    is_active: true,
    is_popular: false,
    is_quote_only: false,
    includes: [
      { include_key: 'fullProduction', include_order: 1 },
      { include_key: 'professionalMixing', include_order: 2 },
      { include_key: 'masteringIncluded', include_order: 3 },
      { include_key: 'commercialRights', include_order: 4 },
      { include_key: 'distributionReady', include_order: 5 }
    ],
    available_addons: ['mangoRecords', 'separatedStems', 'extendedSong', 'customVideo'],
    steps: [
      {
        id: 'artist-step-1',
        step_number: 1,
        title_key: 'artistBackground',
        fields: [
          { id: 'artistName', field_name: 'artistName', field_type: 'text', placeholder_key: 'artistName', required: true, field_order: 1 },
          { id: 'genre', field_name: 'genre', field_type: 'select', placeholder_key: 'musicGenre', required: true, field_order: 2, options: [
            { value: 'pop', label_key: 'pop' },
            { value: 'rock', label_key: 'rock' },
            { value: 'hip_hop', label_key: 'hipHop' },
            { value: 'electronic', label_key: 'electronic' },
            { value: 'indie', label_key: 'indie' },
            { value: 'alternative', label_key: 'alternative' }
          ]},
          { id: 'careerStage', field_name: 'careerStage', field_type: 'select', placeholder_key: 'careerStage', required: true, field_order: 3, options: [
            { value: 'emerging', label_key: 'emerging' },
            { value: 'developing', label_key: 'developing' },
            { value: 'established', label_key: 'established' }
          ]}
        ]
      },
      {
        id: 'artist-step-2',
        step_number: 2,
        title_key: 'songConcept',
        fields: [
          { id: 'songTheme', field_name: 'songTheme', field_type: 'textarea', placeholder_key: 'songTheme', required: true, field_order: 1 },
          { id: 'targetAudience', field_name: 'targetAudience', field_type: 'textarea', placeholder_key: 'targetAudience', required: true, field_order: 2 },
          { id: 'artistVision', field_name: 'artistVision', field_type: 'textarea', placeholder_key: 'artistVision', required: true, field_order: 3 }
        ]
      },
      {
        id: 'artist-step-3',
        step_number: 3,
        title_key: 'technicalRequirements',
        fields: [
          { id: 'tempo', field_name: 'tempo', field_type: 'select', placeholder_key: 'tempo', required: true, field_order: 1, options: [
            { value: 'slow', label_key: 'slow' },
            { value: 'medium', label_key: 'medium' },
            { value: 'fast', label_key: 'fast' },
            { value: 'variable', label_key: 'variable' }
          ]},
          { id: 'referenceSong', field_name: 'referenceSong', field_type: 'url', placeholder_key: 'referenceSong', required: false, field_order: 2 },
          { id: 'additionalNotes', field_name: 'additionalNotes', field_type: 'textarea', placeholder_key: 'additionalNotes', required: false, field_order: 3 }
        ]
      }
    ]
  },
  {
    id: 'remix',
    value: 'remix',
    label_key: 'remix',
    tagline_key: 'remixTagline',
    description_key: 'remixDescription',
    price_ron: 499,
    price_eur: 99,
    price_usd: 115,
    delivery_time_key: 'delivery5to7days',
    is_active: true,
    is_popular: false,
    is_quote_only: false,
    includes: [
      { include_key: 'remixProduction', include_order: 1 },
      { include_key: 'originalTrackEnhancement', include_order: 2 },
      { include_key: 'highQualityAudio', include_order: 3 },
      { include_key: 'digitalDelivery', include_order: 4 }
    ],
    available_addons: ['rushDelivery', 'separatedStems', 'extendedSong', 'commercialRights'],
    steps: [
      {
        id: 'remix-step-1',
        step_number: 1,
        title_key: 'originalTrackDetails',
        fields: [
          { id: 'originalSong', field_name: 'originalSong', field_type: 'url', placeholder_key: 'originalSongUrl', required: true, field_order: 1 },
          { id: 'remixStyle', field_name: 'remixStyle', field_type: 'select', placeholder_key: 'remixStyle', required: true, field_order: 2, options: [
            { value: 'electronic', label_key: 'electronic' },
            { value: 'acoustic', label_key: 'acoustic' },
            { value: 'dance', label_key: 'dance' },
            { value: 'rock', label_key: 'rock' },
            { value: 'pop', label_key: 'pop' }
          ]},
          { id: 'remixPurpose', field_name: 'remixPurpose', field_type: 'select', placeholder_key: 'remixPurpose', required: true, field_order: 3, options: [
            { value: 'personal', label_key: 'personal' },
            { value: 'party', label_key: 'party' },
            { value: 'commercial', label_key: 'commercial' },
            { value: 'artistic', label_key: 'artistic' }
          ]}
        ]
      },
      {
        id: 'remix-step-2',
        step_number: 2,
        title_key: 'remixPreferences',
        fields: [
          { id: 'enhancementAreas', field_name: 'enhancementAreas', field_type: 'textarea', placeholder_key: 'enhancementAreas', required: true, field_order: 1 },
          { id: 'keepElements', field_name: 'keepElements', field_type: 'textarea', placeholder_key: 'keepElements', required: false, field_order: 2 },
          { id: 'changeElements', field_name: 'changeElements', field_type: 'textarea', placeholder_key: 'changeElements', required: false, field_order: 3 }
        ]
      }
    ]
  },
  {
    id: 'instrumental',
    value: 'instrumental',
    label_key: 'instrumental',
    tagline_key: 'instrumentalTagline',
    description_key: 'instrumentalDescription',
    price_ron: 499,
    price_eur: 99,
    price_usd: 115,
    delivery_time_key: 'delivery3to5days',
    is_active: true,
    is_popular: false,
    is_quote_only: false,
    includes: [
      { include_key: 'instrumentalTrack', include_order: 1 },
      { include_key: 'professionalArrangement', include_order: 2 },
      { include_key: 'highQualityAudio', include_order: 3 },
      { include_key: 'digitalDelivery', include_order: 4 }
    ],
    available_addons: ['rushDelivery', 'separatedStems', 'extendedSong', 'customVideo'],
    steps: [
      {
        id: 'instrumental-step-1',
        step_number: 1,
        title_key: 'instrumentalDetails',
        fields: [
          { id: 'musicStyle', field_name: 'musicStyle', field_type: 'select', placeholder_key: 'musicStyle', required: true, field_order: 1, options: [
            { value: 'classical', label_key: 'classical' },
            { value: 'jazz', label_key: 'jazz' },
            { value: 'rock', label_key: 'rock' },
            { value: 'electronic', label_key: 'electronic' },
            { value: 'ambient', label_key: 'ambient' },
            { value: 'cinematic', label_key: 'cinematic' }
          ]},
          { id: 'instruments', field_name: 'instruments', field_type: 'textarea', placeholder_key: 'preferredInstruments', required: true, field_order: 2 },
          { id: 'mood', field_name: 'mood', field_type: 'select', placeholder_key: 'mood', required: true, field_order: 3, options: [
            { value: 'energetic', label_key: 'energetic' },
            { value: 'calm', label_key: 'calm' },
            { value: 'dramatic', label_key: 'dramatic' },
            { value: 'uplifting', label_key: 'uplifting' },
            { value: 'mysterious', label_key: 'mysterious' }
          ]}
        ]
      },
      {
        id: 'instrumental-step-2',
        step_number: 2,
        title_key: 'compositionDetails',
        fields: [
          { id: 'referenceSong', field_name: 'referenceSong', field_type: 'url', placeholder_key: 'referenceSong', required: false, field_order: 1 },
          { id: 'usagePurpose', field_name: 'usagePurpose', field_type: 'select', placeholder_key: 'usagePurpose', required: true, field_order: 2, options: [
            { value: 'background_music', label_key: 'backgroundMusic' },
            { value: 'meditation', label_key: 'meditation' },
            { value: 'video_soundtrack', label_key: 'videoSoundtrack' },
            { value: 'performance', label_key: 'performance' },
            { value: 'personal_enjoyment', label_key: 'personalEnjoyment' }
          ]},
          { id: 'additionalNotes', field_name: 'additionalNotes', field_type: 'textarea', placeholder_key: 'additionalNotes', required: false, field_order: 3 }
        ]
      }
    ]
  },
  {
    id: 'wedding',
    value: 'wedding',
    label_key: 'wedding',
    tagline_key: 'weddingTagline',
    description_key: 'weddingDescription',
    price_ron: 299,
    price_eur: 59,
    price_usd: 69,
    delivery_time_key: 'delivery5to7days',
    is_active: true,
    is_popular: false,
    is_quote_only: false,
    includes: [
      { include_key: 'romanticSong', include_order: 1 },
      { include_key: 'personalizedLyrics', include_order: 2 },
      { include_key: 'weddingTheme', include_order: 3 },
      { include_key: 'digitalDelivery', include_order: 4 }
    ],
    available_addons: ['rushDelivery', 'customVideo', 'audioMessage', 'socialMediaRights'],
    steps: [
      {
        id: 'wedding-step-1',
        step_number: 1,
        title_key: 'coupleInformation',
        fields: [
          { id: 'brideName', field_name: 'brideName', field_type: 'text', placeholder_key: 'brideName', required: true, field_order: 1 },
          { id: 'groomName', field_name: 'groomName', field_type: 'text', placeholder_key: 'groomName', required: true, field_order: 2 },
          { id: 'weddingDate', field_name: 'weddingDate', field_type: 'date', placeholder_key: 'weddingDate', required: true, field_order: 3 },
          { id: 'weddingVenue', field_name: 'weddingVenue', field_type: 'text', placeholder_key: 'weddingVenue', required: false, field_order: 4 }
        ]
      },
      {
        id: 'wedding-step-2',
        step_number: 2,
        title_key: 'loveStory',
        fields: [
          { id: 'howYouMet', field_name: 'howYouMet', field_type: 'textarea', placeholder_key: 'howYouMet', required: true, field_order: 1 },
          { id: 'favoriteMemories', field_name: 'favoriteMemories', field_type: 'textarea', placeholder_key: 'favoriteMemories', required: true, field_order: 2 },
          { id: 'specialMoments', field_name: 'specialMoments', field_type: 'textarea', placeholder_key: 'specialMoments', required: false, field_order: 3 },
          { id: 'futureDreams', field_name: 'futureDreams', field_type: 'textarea', placeholder_key: 'futureDreams', required: false, field_order: 4 }
        ]
      },
      {
        id: 'wedding-step-3',
        step_number: 3,
        title_key: 'weddingPreferences',
        fields: [
          { id: 'musicStyle', field_name: 'musicStyle', field_type: 'select', placeholder_key: 'musicStyle', required: true, field_order: 1, options: [
            { value: 'romantic_ballad', label_key: 'romanticBallad' },
            { value: 'acoustic', label_key: 'acoustic' },
            { value: 'classical', label_key: 'classical' },
            { value: 'modern_pop', label_key: 'modernPop' },
            { value: 'folk', label_key: 'folk' }
          ]},
          { id: 'songUsage', field_name: 'songUsage', field_type: 'select', placeholder_key: 'songUsage', required: true, field_order: 2, options: [
            { value: 'first_dance', label_key: 'firstDance' },
            { value: 'ceremony', label_key: 'ceremony' },
            { value: 'reception', label_key: 'reception' },
            { value: 'gift', label_key: 'gift' }
          ]},
          { id: 'referenceSong', field_name: 'referenceSong', field_type: 'url', placeholder_key: 'referenceSong', required: false, field_order: 3 }
        ]
      }
    ]
  },
  {
    id: 'baptism',
    value: 'baptism',
    label_key: 'baptism',
    tagline_key: 'baptismTagline',
    description_key: 'baptismDescription',
    price_ron: 299,
    price_eur: 59,
    price_usd: 69,
    delivery_time_key: 'delivery5to7days',
    is_active: true,
    is_popular: false,
    is_quote_only: false,
    includes: [
      { include_key: 'spiritualSong', include_order: 1 },
      { include_key: 'personalizedLyrics', include_order: 2 },
      { include_key: 'religiousTheme', include_order: 3 },
      { include_key: 'digitalDelivery', include_order: 4 }
    ],
    available_addons: ['rushDelivery', 'godparentsMelody', 'customVideo', 'audioMessage'],
    steps: [
      {
        id: 'baptism-step-1',
        step_number: 1,
        title_key: 'childInformation',
        fields: [
          { id: 'childName', field_name: 'childName', field_type: 'text', placeholder_key: 'childName', required: true, field_order: 1 },
          { id: 'baptismDate', field_name: 'baptismDate', field_type: 'date', placeholder_key: 'baptismDate', required: true, field_order: 2 },
          { id: 'church', field_name: 'church', field_type: 'text', placeholder_key: 'churchName', required: false, field_order: 3 },
          { id: 'godparentsNames', field_name: 'godparentsNames', field_type: 'text', placeholder_key: 'godparentsNames', required: false, field_order: 4 }
        ]
      },
      {
        id: 'baptism-step-2',
        step_number: 2,
        title_key: 'spiritualMessage',
        fields: [
          { id: 'blessings', field_name: 'blessings', field_type: 'textarea', placeholder_key: 'blessingsAndWishes', required: true, field_order: 1 },
          { id: 'hopeForChild', field_name: 'hopeForChild', field_type: 'textarea', placeholder_key: 'hopeForChild', required: true, field_order: 2 },
          { id: 'spiritualValues', field_name: 'spiritualValues', field_type: 'textarea', placeholder_key: 'spiritualValues', required: false, field_order: 3 }
        ]
      },
      {
        id: 'baptism-step-3',
        step_number: 3,
        title_key: 'musicalPreferences',
        fields: [
          { id: 'musicStyle', field_name: 'musicStyle', field_type: 'select', placeholder_key: 'musicStyle', required: true, field_order: 1, options: [
            { value: 'traditional_hymn', label_key: 'traditionalHymn' },
            { value: 'contemporary_christian', label_key: 'contemporaryChristian' },
            { value: 'soft_lullaby', label_key: 'softLullaby' },
            { value: 'gospel', label_key: 'gospel' }
          ]},
          { id: 'referenceSong', field_name: 'referenceSong', field_type: 'url', placeholder_key: 'referenceSong', required: false, field_order: 2 }
        ]
      }
    ]
  },
  {
    id: 'comingOfAge',
    value: 'comingOfAge',
    label_key: 'comingOfAge',
    tagline_key: 'comingOfAgeTagline',
    description_key: 'comingOfAgeDescription',
    price_ron: 299,
    price_eur: 59,
    price_usd: 69,
    delivery_time_key: 'delivery5to7days',
    is_active: true,
    is_popular: false,
    is_quote_only: false,
    includes: [
      { include_key: 'celebratorySong', include_order: 1 },
      { include_key: 'personalizedLyrics', include_order: 2 },
      { include_key: 'youthfulTheme', include_order: 3 },
      { include_key: 'digitalDelivery', include_order: 4 }
    ],
    available_addons: ['rushDelivery', 'customVideo', 'audioMessage', 'socialMediaRights'],
    steps: [
      {
        id: 'comingOfAge-step-1',
        step_number: 1,
        title_key: 'celebrantInformation',
        fields: [
          { id: 'celebrantName', field_name: 'celebrantName', field_type: 'text', placeholder_key: 'celebrantName', required: true, field_order: 1 },
          { id: 'age', field_name: 'age', field_type: 'number', placeholder_key: 'age', required: true, field_order: 2 },
          { id: 'celebrationDate', field_name: 'celebrationDate', field_type: 'date', placeholder_key: 'celebrationDate', required: true, field_order: 3 },
          { id: 'relationship', field_name: 'relationship', field_type: 'select', placeholder_key: 'relationship', required: true, field_order: 4, options: [
            { value: 'child', label_key: 'child' },
            { value: 'grandchild', label_key: 'grandchild' },
            { value: 'niece_nephew', label_key: 'nieceNephew' },
            { value: 'friend', label_key: 'friend' }
          ]}
        ]
      },
      {
        id: 'comingOfAge-step-2',
        step_number: 2,
        title_key: 'achievements',
        fields: [
          { id: 'achievements', field_name: 'achievements', field_type: 'textarea', placeholder_key: 'achievements', required: true, field_order: 1 },
          { id: 'personality', field_name: 'personality', field_type: 'textarea', placeholder_key: 'personalityTraits', required: true, field_order: 2 },
          { id: 'dreams', field_name: 'dreams', field_type: 'textarea', placeholder_key: 'futureDreams', required: false, field_order: 3 },
          { id: 'wishes', field_name: 'wishes', field_type: 'textarea', placeholder_key: 'wishesForFuture', required: false, field_order: 4 }
        ]
      },
      {
        id: 'comingOfAge-step-3',
        step_number: 3,
        title_key: 'musicalPreferences',
        fields: [
          { id: 'musicStyle', field_name: 'musicStyle', field_type: 'select', placeholder_key: 'musicStyle', required: true, field_order: 1, options: [
            { value: 'pop', label_key: 'pop' },
            { value: 'rock', label_key: 'rock' },
            { value: 'hip_hop', label_key: 'hipHop' },
            { value: 'uplifting', label_key: 'uplifting' },
            { value: 'inspirational', label_key: 'inspirational' }
          ]},
          { id: 'referenceSong', field_name: 'referenceSong', field_type: 'url', placeholder_key: 'referenceSong', required: false, field_order: 2 }
        ]
      }
    ]
  },
  {
    id: 'dj',
    value: 'dj',
    label_key: 'dj',
    tagline_key: 'djTagline',
    description_key: 'djDescription',
    price_ron: 499,
    price_eur: 99,
    price_usd: 115,
    delivery_time_key: 'delivery7to10days',
    is_active: true,
    is_popular: false,
    is_quote_only: false,
    includes: [
      { include_key: 'djMix', include_order: 1 },
      { include_key: 'clubReady', include_order: 2 },
      { include_key: 'professionalMastering', include_order: 3 },
      { include_key: 'digitalDelivery', include_order: 4 }
    ],
    available_addons: ['rushDelivery', 'separatedStems', 'extendedSong', 'commercialRights'],
    steps: [
      {
        id: 'dj-step-1',
        step_number: 1,
        title_key: 'djProjectDetails',
        fields: [
          { id: 'djName', field_name: 'djName', field_type: 'text', placeholder_key: 'djName', required: true, field_order: 1 },
          { id: 'mixType', field_name: 'mixType', field_type: 'select', placeholder_key: 'mixType', required: true, field_order: 2, options: [
            { value: 'club_mix', label_key: 'clubMix' },
            { value: 'radio_edit', label_key: 'radioEdit' },
            { value: 'extended_mix', label_key: 'extendedMix' },
            { value: 'remix', label_key: 'remix' }
          ]},
          { id: 'genre', field_name: 'genre', field_type: 'select', placeholder_key: 'musicGenre', required: true, field_order: 3, options: [
            { value: 'house', label_key: 'house' },
            { value: 'techno', label_key: 'techno' },
            { value: 'trance', label_key: 'trance' },
            { value: 'edm', label_key: 'edm' },
            { value: 'deep_house', label_key: 'deepHouse' }
          ]}
        ]
      },
      {
        id: 'dj-step-2',
        step_number: 2,
        title_key: 'mixPreferences',
        fields: [
          { id: 'originalTrack', field_name: 'originalTrack', field_type: 'url', placeholder_key: 'originalTrackUrl', required: false, field_order: 1 },
          { id: 'mixConcept', field_name: 'mixConcept', field_type: 'textarea', placeholder_key: 'mixConcept', required: true, field_order: 2 },
          { id: 'targetAudience', field_name: 'targetAudience', field_type: 'select', placeholder_key: 'targetAudience', required: true, field_order: 3, options: [
            { value: 'club_dancefloor', label_key: 'clubDancefloor' },
            { value: 'radio_play', label_key: 'radioPlay' },
            { value: 'festival_main_stage', label_key: 'festivalMainStage' },
            { value: 'lounge_bar', label_key: 'loungeBar' }
          ]}
        ]
      },
      {
        id: 'dj-step-3',
        step_number: 3,
        title_key: 'technicalRequirements',
        fields: [
          { id: 'bpm', field_name: 'bpm', field_type: 'number', placeholder_key: 'bpm', required: false, field_order: 1 },
          { id: 'key', field_name: 'key', field_type: 'text', placeholder_key: 'musicalKey', required: false, field_order: 2 },
          { id: 'referenceTracks', field_name: 'referenceTracks', field_type: 'textarea', placeholder_key: 'referenceTracks', required: false, field_order: 3 },
          { id: 'additionalNotes', field_name: 'additionalNotes', field_type: 'textarea', placeholder_key: 'additionalNotes', required: false, field_order: 4 }
        ]
      }
    ]
  }
];

export const addons: Addon[] = [
  {
    id: 'rushDelivery',
    addon_key: 'rushDelivery',
    label_key: 'rushDelivery',
    description_key: 'rushDeliveryDescription',
    price_ron: 99,
    price_eur: 20,
    price_usd: 23,
    is_active: true
  },
  {
    id: 'socialMediaRights',
    addon_key: 'socialMediaRights',
    label_key: 'socialMediaRights',
    description_key: 'socialMediaRightsDescription',
    price_ron: 0,
    price_eur: 0,
    price_usd: 0,
    is_active: true
  },
  {
    id: 'mangoRecords',
    addon_key: 'mangoRecords',
    label_key: 'mangoRecordsDistribution',
    description_key: 'mangoRecordsDescription',
    price_ron: 199,
    price_eur: 40,
    price_usd: 47,
    is_active: true
  },
  {
    id: 'customVideo',
    addon_key: 'customVideo',
    label_key: 'customVideo',
    description_key: 'customVideoDescription',
    price_ron: 149,
    price_eur: 30,
    price_usd: 35,
    is_active: true
  },
  {
    id: 'audioMessage',
    addon_key: 'audioMessage',
    label_key: 'audioMessageFromSender',
    description_key: 'audioMessageDescription',
    price_ron: 99,
    price_eur: 20,
    price_usd: 23,
    is_active: true
  },
  {
    id: 'brandedAudio',
    addon_key: 'brandedAudio',
    label_key: 'brandedAudioMessage',
    description_key: 'brandedAudioDescription',
    price_ron: 0,
    price_eur: 0,
    price_usd: 0,
    is_active: true
  },
  {
    id: 'commercialRights',
    addon_key: 'commercialRights',
    label_key: 'commercialRightsUpgrade',
    description_key: 'commercialRightsDescription',
    price_ron: 399,
    price_eur: 80,
    price_usd: 93,
    is_active: true
  },
  {
    id: 'extendedSong',
    addon_key: 'extendedSong',
    label_key: 'extendedSong',
    description_key: 'extendedSongDescription',
    price_ron: 49,
    price_eur: 10,
    price_usd: 12,
    is_active: true
  },
  {
    id: 'godparentsMelody',
    addon_key: 'godparentsMelody',
    label_key: 'godparentsMelody',
    description_key: 'godparentsMelodyDescription',
    price_ron: 199,
    price_eur: 40,
    price_usd: 47,
    is_active: true
  },
  {
    id: 'separatedStems',
    addon_key: 'separatedStems',
    label_key: 'separatedStems',
    description_key: 'separatedStemsDescription',
    price_ron: 149,
    price_eur: 30,
    price_usd: 35,
    is_active: true
  }
];

export default packages;

