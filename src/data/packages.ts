import { Package, PackageInclude, Step, Field, FieldOption } from '@/types';

export interface AddonConfig {
  label_key: string;
  description_key: string;
  price: number;
  packages: string[];
  trigger_field_type?: string;
  trigger_config?: any;
}

export const addons: Record<string, AddonConfig> = {
  rushDelivery: {
    label_key: 'rushDelivery',
    description_key: 'rushDeliveryDesc',
    price: 99, // RON price, will be converted based on currency
    packages: ['personal', 'business', 'premium', 'artist', 'instrumental', 'remix']
  },
  exclusiveMangoDistribution: {
    label_key: 'exclusiveMangoDistribution',
    description_key: 'exclusiveMangoDistributionDesc',
    price: 199,
    packages: ['artist', 'business']
  },
  customVideo: {
    label_key: 'customVideo',
    description_key: 'customVideoDesc',
    price: 149,
    packages: ['personal', 'premium', 'business']
  },
  audioMessageFromSender: {
    label_key: 'audioMessageFromSender',
    description_key: 'audioMessageFromSenderDesc',
    price: 99,
    packages: ['personal', 'premium']
  },
  commercialRightsUpgrade: {
    label_key: 'commercialRightsUpgrade',
    description_key: 'commercialRightsUpgradeDesc',
    price: 399,
    packages: ['business', 'artist']
  },
  extendedSong: {
    label_key: 'extendedSong',
    description_key: 'extendedSongDesc',
    price: 49,
    packages: ['personal', 'premium', 'artist', 'instrumental']
  }
};

export const packages: Package[] = [
  // Enhanced Personal Package
  {
    value: 'personal',
    label_key: 'personalPackage',
    tagline_key: 'personalTagline',
    description_key: 'personalDescription',
    price_ron: 299,
    price_eur: 59,
    delivery_time_key: 'personalDelivery',
    tag: 'popular',
    includes: [
      { include_key: 'personalInclude1', include_order: 1 },
      { include_key: 'personalInclude2', include_order: 2 },
      { include_key: 'personalInclude3', include_order: 3 },
      { include_key: 'personalInclude4', include_order: 4 }
    ],
    steps: [
      {
        id: 'personal-step-1',
        step_number: 1,
        title_key: 'songStoryCollection',
        fields: [
          {
            id: 'recipient-name',
            field_name: 'recipientName',
            field_type: 'text',
            label_key: 'recipientName',
            placeholder_key: 'recipientNamePlaceholder',
            required: true,
            field_order: 1
          },
          {
            id: 'relationship',
            field_name: 'relationship',
            field_type: 'select',
            label_key: 'relationshipType',
            placeholder_key: 'selectRelationship',
            required: true,
            field_order: 2,
            options: [
              { value: 'spouse', label_key: 'spouse' },
              { value: 'child', label_key: 'child' },
              { value: 'parent', label_key: 'parent' },
              { value: 'friend', label_key: 'friend' },
              { value: 'sibling', label_key: 'sibling' },
              { value: 'grandparent', label_key: 'grandparent' },
              { value: 'other', label_key: 'other' }
            ]
          },
          {
            id: 'story-details',
            field_name: 'storyDetails',
            field_type: 'textarea',
            label_key: 'yourStory',
            placeholder_key: 'storyDetailsPlaceholder',
            required: true,
            field_order: 3
          },
          {
            id: 'special-keywords',
            field_name: 'specialKeywords',
            field_type: 'text',
            label_key: 'specialKeywords',
            placeholder_key: 'specialKeywordsPlaceholder',
            required: false,
            field_order: 4
          },
          {
            id: 'keyword-pronunciation',
            field_name: 'keywordPronunciation',
            field_type: 'audio_recorder',
            label_key: 'keywordPronunciation',
            placeholder_key: 'recordPronunciation',
            required: false,
            field_order: 5
          }
        ]
      },
      {
        id: 'personal-step-2',
        step_number: 2,
        title_key: 'musicalPreferences',
        fields: [
          {
            id: 'genre',
            field_name: 'genre',
            field_type: 'select',
            label_key: 'musicGenre',
            placeholder_key: 'selectGenre',
            required: true,
            field_order: 1,
            options: [
              { value: 'pop', label_key: 'pop' },
              { value: 'rock', label_key: 'rock' },
              { value: 'folk', label_key: 'folk' },
              { value: 'ballad', label_key: 'ballad' },
              { value: 'country', label_key: 'country' },
              { value: 'jazz', label_key: 'jazz' },
              { value: 'classical', label_key: 'classical' }
            ]
          },
          {
            id: 'mood',
            field_name: 'mood',
            field_type: 'select',
            label_key: 'songMood',
            placeholder_key: 'selectMood',
            required: true,
            field_order: 2,
            options: [
              { value: 'romantic', label_key: 'romantic' },
              { value: 'joyful', label_key: 'joyful' },
              { value: 'emotional', label_key: 'emotional' },
              { value: 'uplifting', label_key: 'uplifting' },
              { value: 'nostalgic', label_key: 'nostalgic' },
              { value: 'peaceful', label_key: 'peaceful' }
            ]
          },
          {
            id: 'voice-type',
            field_name: 'voiceType',
            field_type: 'select',
            label_key: 'voiceType',
            placeholder_key: 'selectVoiceType',
            required: true,
            field_order: 3,
            options: [
              { value: 'male', label_key: 'maleVoice' },
              { value: 'female', label_key: 'femaleVoice' },
              { value: 'duet', label_key: 'duetVoice' }
            ]
          },
          {
            id: 'language',
            field_name: 'language',
            field_type: 'select',
            label_key: 'songLanguage',
            placeholder_key: 'selectLanguage',
            required: true,
            field_order: 4,
            options: [
              { value: 'romanian', label_key: 'romanian' },
              { value: 'english', label_key: 'english' },
              { value: 'spanish', label_key: 'spanish' },
              { value: 'french', label_key: 'french' },
              { value: 'italian', label_key: 'italian' }
            ]
          },
          {
            id: 'style-references',
            field_name: 'styleReferences',
            field_type: 'textarea',
            label_key: 'styleReferences',
            placeholder_key: 'styleReferencesPlaceholder',
            required: false,
            field_order: 5
          }
        ]
      },
      {
        id: 'personal-step-3',
        step_number: 3,
        title_key: 'contactInformation',
        fields: [
          {
            id: 'full-name',
            field_name: 'fullName',
            field_type: 'text',
            label_key: 'fullName',
            placeholder_key: 'fullNamePlaceholder',
            required: true,
            field_order: 1
          },
          {
            id: 'email',
            field_name: 'email',
            field_type: 'email',
            label_key: 'emailAddress',
            placeholder_key: 'emailPlaceholder',
            required: true,
            field_order: 2
          },
          {
            id: 'phone',
            field_name: 'phone',
            field_type: 'tel',
            label_key: 'phoneNumber',
            placeholder_key: 'phonePlaceholder',
            required: false,
            field_order: 3
          }
        ]
      },
      {
        id: 'personal-step-4',
        step_number: 4,
        title_key: 'addonsSelection',
        fields: [
          {
            id: 'addons',
            field_name: 'addons',
            field_type: 'addon_selection',
            label_key: 'selectAddons',
            placeholder_key: 'addonsPlaceholder',
            required: false,
            field_order: 1
          }
        ]
      },
      {
        id: 'personal-step-5',
        step_number: 5,
        title_key: 'finalConfirmation',
        fields: [
          {
            id: 'terms-accepted',
            field_name: 'termsAccepted',
            field_type: 'checkbox',
            label_key: 'acceptTerms',
            placeholder_key: 'acceptTermsPlaceholder',
            required: true,
            field_order: 1
          },
          {
            id: 'privacy-accepted',
            field_name: 'privacyAccepted',
            field_type: 'checkbox',
            label_key: 'acceptPrivacy',
            placeholder_key: 'acceptPrivacyPlaceholder',
            required: true,
            field_order: 2
          }
        ]
      }
    ]
  },

  // Enhanced Business Package
  {
    value: 'business',
    label_key: 'businessPackage',
    tagline_key: 'businessTagline',
    description_key: 'businessDescription',
    price_ron: 499,
    price_eur: 99,
    delivery_time_key: 'businessDelivery',
    tag: 'premium',
    includes: [
      { include_key: 'businessInclude1', include_order: 1 },
      { include_key: 'businessInclude2', include_order: 2 },
      { include_key: 'businessInclude3', include_order: 3 },
      { include_key: 'businessInclude4', include_order: 4 }
    ],
    steps: [
      {
        id: 'business-step-1',
        step_number: 1,
        title_key: 'companyBrandInfo',
        fields: [
          {
            id: 'company-name',
            field_name: 'companyName',
            field_type: 'text',
            label_key: 'companyName',
            placeholder_key: 'companyNamePlaceholder',
            required: true,
            field_order: 1
          },
          {
            id: 'brand-message',
            field_name: 'brandMessage',
            field_type: 'textarea',
            label_key: 'brandMessage',
            placeholder_key: 'brandMessagePlaceholder',
            required: true,
            field_order: 2
          },
          {
            id: 'target-audience',
            field_name: 'targetAudience',
            field_type: 'textarea',
            label_key: 'targetAudience',
            placeholder_key: 'targetAudiencePlaceholder',
            required: true,
            field_order: 3
          },
          {
            id: 'business-goals',
            field_name: 'businessGoals',
            field_type: 'textarea',
            label_key: 'businessGoals',
            placeholder_key: 'businessGoalsPlaceholder',
            required: true,
            field_order: 4
          },
          {
            id: 'company-pronunciation',
            field_name: 'companyPronunciation',
            field_type: 'audio_recorder',
            label_key: 'companyPronunciation',
            placeholder_key: 'recordCompanyName',
            required: false,
            field_order: 5
          }
        ]
      },
      {
        id: 'business-step-2',
        step_number: 2,
        title_key: 'professionalRequirements',
        fields: [
          {
            id: 'professional-tone',
            field_name: 'professionalTone',
            field_type: 'select',
            label_key: 'professionalTone',
            placeholder_key: 'selectTone',
            required: true,
            field_order: 1,
            options: [
              { value: 'corporate', label_key: 'corporate' },
              { value: 'friendly', label_key: 'friendly' },
              { value: 'inspiring', label_key: 'inspiring' },
              { value: 'energetic', label_key: 'energetic' },
              { value: 'trustworthy', label_key: 'trustworthy' }
            ]
          },
          {
            id: 'brand-voice',
            field_name: 'brandVoice',
            field_type: 'textarea',
            label_key: 'brandVoice',
            placeholder_key: 'brandVoicePlaceholder',
            required: true,
            field_order: 2
          },
          {
            id: 'commercial-use',
            field_name: 'commercialUse',
            field_type: 'select',
            label_key: 'commercialUse',
            placeholder_key: 'selectCommercialUse',
            required: true,
            field_order: 3,
            options: [
              { value: 'advertising', label_key: 'advertising' },
              { value: 'marketing', label_key: 'marketing' },
              { value: 'branding', label_key: 'branding' },
              { value: 'events', label_key: 'events' },
              { value: 'presentations', label_key: 'presentations' }
            ]
          }
        ]
      },
      {
        id: 'business-step-3',
        step_number: 3,
        title_key: 'contactDetails',
        fields: [
          {
            id: 'company-contact',
            field_name: 'companyContact',
            field_type: 'text',
            label_key: 'companyContact',
            placeholder_key: 'companyContactPlaceholder',
            required: true,
            field_order: 1
          },
          {
            id: 'decision-maker',
            field_name: 'decisionMaker',
            field_type: 'text',
            label_key: 'decisionMaker',
            placeholder_key: 'decisionMakerPlaceholder',
            required: true,
            field_order: 2
          },
          {
            id: 'business-email',
            field_name: 'businessEmail',
            field_type: 'email',
            label_key: 'businessEmail',
            placeholder_key: 'businessEmailPlaceholder',
            required: true,
            field_order: 3
          },
          {
            id: 'business-phone',
            field_name: 'businessPhone',
            field_type: 'tel',
            label_key: 'businessPhone',
            placeholder_key: 'businessPhonePlaceholder',
            required: true,
            field_order: 4
          }
        ]
      },
      {
        id: 'business-step-4',
        step_number: 4,
        title_key: 'commercialAddons',
        fields: [
          {
            id: 'business-addons',
            field_name: 'businessAddons',
            field_type: 'addon_selection',
            label_key: 'selectBusinessAddons',
            placeholder_key: 'businessAddonsPlaceholder',
            required: false,
            field_order: 1
          }
        ]
      },
      {
        id: 'business-step-5',
        step_number: 5,
        title_key: 'businessTerms',
        fields: [
          {
            id: 'business-terms',
            field_name: 'businessTerms',
            field_type: 'checkbox',
            label_key: 'acceptBusinessTerms',
            placeholder_key: 'acceptBusinessTermsPlaceholder',
            required: true,
            field_order: 1
          },
          {
            id: 'commercial-license',
            field_name: 'commercialLicense',
            field_type: 'checkbox',
            label_key: 'acceptCommercialLicense',
            placeholder_key: 'acceptCommercialLicensePlaceholder',
            required: true,
            field_order: 2
          }
        ]
      }
    ]
  },

  // Enhanced Premium Package
  {
    value: 'premium',
    label_key: 'premiumPackage',
    tagline_key: 'premiumTagline',
    description_key: 'premiumDescription',
    price_ron: 499,
    price_eur: 99,
    delivery_time_key: 'premiumDelivery',
    includes: [
      { include_key: 'premiumInclude1', include_order: 1 },
      { include_key: 'premiumInclude2', include_order: 2 },
      { include_key: 'premiumInclude3', include_order: 3 }
    ],
    steps: [
      {
        id: 'premium-step-1',
        step_number: 1,
        title_key: 'detailedPersonalStory',
        fields: [
          {
            id: 'comprehensive-recipient',
            field_name: 'comprehensiveRecipient',
            field_type: 'textarea',
            label_key: 'comprehensiveRecipient',
            placeholder_key: 'comprehensiveRecipientPlaceholder',
            required: true,
            field_order: 1
          },
          {
            id: 'relationship-details',
            field_name: 'relationshipDetails',
            field_type: 'textarea',
            label_key: 'relationshipDetails',
            placeholder_key: 'relationshipDetailsPlaceholder',
            required: true,
            field_order: 2
          },
          {
            id: 'special-memories',
            field_name: 'specialMemories',
            field_type: 'textarea',
            label_key: 'specialMemories',
            placeholder_key: 'specialMemoriesPlaceholder',
            required: true,
            field_order: 3
          },
          {
            id: 'emotional-context',
            field_name: 'emotionalContext',
            field_type: 'textarea',
            label_key: 'emotionalContext',
            placeholder_key: 'emotionalContextPlaceholder',
            required: true,
            field_order: 4
          }
        ]
      },
      {
        id: 'premium-step-2',
        step_number: 2,
        title_key: 'advancedMusicalPreferences',
        fields: [
          {
            id: 'detailed-style',
            field_name: 'detailedStyle',
            field_type: 'textarea',
            label_key: 'detailedStyle',
            placeholder_key: 'detailedStylePlaceholder',
            required: true,
            field_order: 1
          },
          {
            id: 'voice-coaching',
            field_name: 'voiceCoaching',
            field_type: 'select',
            label_key: 'voiceCoachingPreference',
            placeholder_key: 'selectVoiceCoaching',
            required: false,
            field_order: 2,
            options: [
              { value: 'professional', label_key: 'professionalCoaching' },
              { value: 'emotional', label_key: 'emotionalCoaching' },
              { value: 'technical', label_key: 'technicalCoaching' },
              { value: 'none', label_key: 'noCoaching' }
            ]
          },
          {
            id: 'instrumentation',
            field_name: 'instrumentation',
            field_type: 'textarea',
            label_key: 'instrumentationChoices',
            placeholder_key: 'instrumentationPlaceholder',
            required: false,
            field_order: 3
          }
        ]
      },
      {
        id: 'premium-step-3',
        step_number: 3,
        title_key: 'premiumOptions',
        fields: [
          {
            id: 'extended-versions',
            field_name: 'extendedVersions',
            field_type: 'checkbox',
            label_key: 'extendedVersions',
            placeholder_key: 'extendedVersionsPlaceholder',
            required: false,
            field_order: 1
          },
          {
            id: 'multiple-arrangements',
            field_name: 'multipleArrangements',
            field_type: 'checkbox',
            label_key: 'multipleArrangements',
            placeholder_key: 'multipleArrangementsPlaceholder',
            required: false,
            field_order: 2
          },
          {
            id: 'revision-rounds',
            field_name: 'revisionRounds',
            field_type: 'select',
            label_key: 'revisionRounds',
            placeholder_key: 'selectRevisionRounds',
            required: false,
            field_order: 3,
            options: [
              { value: '1', label_key: 'oneRevision' },
              { value: '2', label_key: 'twoRevisions' },
              { value: '3', label_key: 'threeRevisions' }
            ]
          }
        ]
      },
      {
        id: 'premium-step-4',
        step_number: 4,
        title_key: 'contactAndDelivery',
        fields: [
          {
            id: 'priority-contact',
            field_name: 'priorityContact',
            field_type: 'text',
            label_key: 'priorityContact',
            placeholder_key: 'priorityContactPlaceholder',
            required: true,
            field_order: 1
          },
          {
            id: 'delivery-timeline',
            field_name: 'deliveryTimeline',
            field_type: 'select',
            label_key: 'deliveryTimeline',
            placeholder_key: 'selectDeliveryTimeline',
            required: true,
            field_order: 2,
            options: [
              { value: 'standard', label_key: 'standardDelivery' },
              { value: 'priority', label_key: 'priorityDelivery' },
              { value: 'express', label_key: 'expressDelivery' }
            ]
          },
          {
            id: 'communication-preference',
            field_name: 'communicationPreference',
            field_type: 'select',
            label_key: 'communicationPreference',
            placeholder_key: 'selectCommunication',
            required: true,
            field_order: 3,
            options: [
              { value: 'email', label_key: 'emailComm' },
              { value: 'phone', label_key: 'phoneComm' },
              { value: 'video', label_key: 'videoComm' }
            ]
          }
        ]
      },
      {
        id: 'premium-step-5',
        step_number: 5,
        title_key: 'premiumServiceTerms',
        fields: [
          {
            id: 'premium-terms',
            field_name: 'premiumTerms',
            field_type: 'checkbox',
            label_key: 'acceptPremiumTerms',
            placeholder_key: 'acceptPremiumTermsPlaceholder',
            required: true,
            field_order: 1
          },
          {
            id: 'quality-guarantee',
            field_name: 'qualityGuarantee',
            field_type: 'checkbox',
            label_key: 'acceptQualityGuarantee',
            placeholder_key: 'acceptQualityGuaranteePlaceholder',
            required: true,
            field_order: 2
          }
        ]
      }
    ]
  },

  // Enhanced Artist Package
  {
    value: 'artist',
    label_key: 'artistPackage',
    tagline_key: 'artistTagline',
    description_key: 'artistDescription',
    price_ron: 7999,
    price_eur: 1599,
    delivery_time_key: 'artistDelivery',
    includes: [
      { include_key: 'artistInclude1', include_order: 1 },
      { include_key: 'artistInclude2', include_order: 2 },
      { include_key: 'artistInclude3', include_order: 3 },
      { include_key: 'artistInclude4', include_order: 4 }
    ],
    steps: [
      {
        id: 'artist-step-1',
        step_number: 1,
        title_key: 'artistProfile',
        fields: [
          {
            id: 'stage-name',
            field_name: 'stageName',
            field_type: 'text',
            label_key: 'stageName',
            placeholder_key: 'stageNamePlaceholder',
            required: true,
            field_order: 1
          },
          {
            id: 'artistic-vision',
            field_name: 'artisticVision',
            field_type: 'textarea',
            label_key: 'artisticVision',
            placeholder_key: 'artisticVisionPlaceholder',
            required: true,
            field_order: 2
          },
          {
            id: 'career-goals',
            field_name: 'careerGoals',
            field_type: 'textarea',
            label_key: 'careerGoals',
            placeholder_key: 'careerGoalsPlaceholder',
            required: true,
            field_order: 3
          },
          {
            id: 'current-projects',
            field_name: 'currentProjects',
            field_type: 'textarea',
            label_key: 'currentProjects',
            placeholder_key: 'currentProjectsPlaceholder',
            required: false,
            field_order: 4
          },
          {
            id: 'media-links',
            field_name: 'mediaLinks',
            field_type: 'textarea',
            label_key: 'mediaLinks',
            placeholder_key: 'mediaLinksPlaceholder',
            required: false,
            field_order: 5
          }
        ]
      },
      {
        id: 'artist-step-2',
        step_number: 2,
        title_key: 'musicalConceptVision',
        fields: [
          {
            id: 'genre-exploration',
            field_name: 'genreExploration',
            field_type: 'textarea',
            label_key: 'genreExploration',
            placeholder_key: 'genreExplorationPlaceholder',
            required: true,
            field_order: 1
          },
          {
            id: 'artistic-direction',
            field_name: 'artisticDirection',
            field_type: 'textarea',
            label_key: 'artisticDirection',
            placeholder_key: 'artisticDirectionPlaceholder',
            required: true,
            field_order: 2
          },
          {
            id: 'collaboration-preferences',
            field_name: 'collaborationPreferences',
            field_type: 'textarea',
            label_key: 'collaborationPreferences',
            placeholder_key: 'collaborationPreferencesPlaceholder',
            required: false,
            field_order: 3
          },
          {
            id: 'creative-brief',
            field_name: 'creativeBrief',
            field_type: 'textarea',
            label_key: 'creativeBrief',
            placeholder_key: 'creativeBriefPlaceholder',
            required: true,
            field_order: 4
          }
        ]
      },
      {
        id: 'artist-step-3',
        step_number: 3,
        title_key: 'professionalRequirements',
        fields: [
          {
            id: 'commercial-rights-needed',
            field_name: 'commercialRightsNeeded',
            field_type: 'checkbox',
            label_key: 'commercialRightsNeeded',
            placeholder_key: 'commercialRightsNeededPlaceholder',
            required: false,
            field_order: 1
          },
          {
            id: 'distribution-strategy',
            field_name: 'distributionStrategy',
            field_type: 'textarea',
            label_key: 'distributionStrategy',
            placeholder_key: 'distributionStrategyPlaceholder',
            required: true,
            field_order: 2
          },
          {
            id: 'promotional-needs',
            field_name: 'promotionalNeeds',
            field_type: 'textarea',
            label_key: 'promotionalNeeds',
            placeholder_key: 'promotionalNeedsPlaceholder',
            required: false,
            field_order: 3
          },
          {
            id: 'licensing-requirements',
            field_name: 'licensingRequirements',
            field_type: 'textarea',
            label_key: 'licensingRequirements',
            placeholder_key: 'licensingRequirementsPlaceholder',
            required: false,
            field_order: 4
          }
        ]
      },
      {
        id: 'artist-step-4',
        step_number: 4,
        title_key: 'contactCollaboration',
        fields: [
          {
            id: 'professional-contact',
            field_name: 'professionalContact',
            field_type: 'text',
            label_key: 'professionalContact',
            placeholder_key: 'professionalContactPlaceholder',
            required: true,
            field_order: 1
          },
          {
            id: 'team-members',
            field_name: 'teamMembers',
            field_type: 'textarea',
            label_key: 'teamMembers',
            placeholder_key: 'teamMembersPlaceholder',
            required: false,
            field_order: 2
          },
          {
            id: 'management-info',
            field_name: 'managementInfo',
            field_type: 'textarea',
            label_key: 'managementInfo',
            placeholder_key: 'managementInfoPlaceholder',
            required: false,
            field_order: 3
          }
        ]
      },
      {
        id: 'artist-step-5',
        step_number: 5,
        title_key: 'artistAgreement',
        fields: [
          {
            id: 'artist-agreement',
            field_name: 'artistAgreement',
            field_type: 'checkbox',
            label_key: 'acceptArtistAgreement',
            placeholder_key: 'acceptArtistAgreementPlaceholder',
            required: true,
            field_order: 1
          },
          {
            id: 'commercial-terms',
            field_name: 'commercialTerms',
            field_type: 'checkbox',
            label_key: 'acceptCommercialTerms',
            placeholder_key: 'acceptCommercialTermsPlaceholder',
            required: true,
            field_order: 2
          }
        ]
      }
    ]
  },

  // Enhanced Instrumental Package
  {
    value: 'instrumental',
    label_key: 'instrumentalPackage',
    tagline_key: 'instrumentalTagline',
    description_key: 'instrumentalDescription',
    price_ron: 499,
    price_eur: 99,
    delivery_time_key: 'instrumentalDelivery',
    includes: [
      { include_key: 'instrumentalInclude1', include_order: 1 },
      { include_key: 'instrumentalInclude2', include_order: 2 },
      { include_key: 'instrumentalInclude3', include_order: 3 },
      { include_key: 'instrumentalInclude4', include_order: 4 },
      { include_key: 'instrumentalInclude5', include_order: 5 }
    ],
    steps: [
      {
        id: 'instrumental-step-1',
        step_number: 1,
        title_key: 'instrumentalConcept',
        fields: [
          {
            id: 'instrumental-title',
            field_name: 'instrumentalTitle',
            field_type: 'text',
            label_key: 'instrumentalTitle',
            placeholder_key: 'instrumentalTitlePlaceholder',
            required: true,
            field_order: 1
          },
          {
            id: 'instrumental-genre',
            field_name: 'instrumentalGenre',
            field_type: 'select',
            label_key: 'instrumentalGenre',
            placeholder_key: 'selectInstrumentalGenre',
            required: true,
            field_order: 2,
            options: [
              { value: 'cinematic', label_key: 'cinematic' },
              { value: 'ambient', label_key: 'ambient' },
              { value: 'electronic', label_key: 'electronic' },
              { value: 'orchestral', label_key: 'orchestral' },
              { value: 'acoustic', label_key: 'acoustic' },
              { value: 'hip-hop', label_key: 'hipHop' },
              { value: 'rock', label_key: 'rock' }
            ]
          },
          {
            id: 'intended-use',
            field_name: 'intendedUse',
            field_type: 'select',
            label_key: 'intendedUse',
            placeholder_key: 'selectIntendedUse',
            required: true,
            field_order: 3,
            options: [
              { value: 'songwriting', label_key: 'songwriting' },
              { value: 'background', label_key: 'backgroundMusic' },
              { value: 'commercial', label_key: 'commercialUse' },
              { value: 'meditation', label_key: 'meditation' },
              { value: 'gaming', label_key: 'gaming' }
            ]
          },
          {
            id: 'mood-atmosphere',
            field_name: 'moodAtmosphere',
            field_type: 'textarea',
            label_key: 'moodAtmosphere',
            placeholder_key: 'moodAtmospherePlaceholder',
            required: true,
            field_order: 4
          }
        ]
      },
      {
        id: 'instrumental-step-2',
        step_number: 2,
        title_key: 'musicalArrangement',
        fields: [
          {
            id: 'preferred-instruments',
            field_name: 'preferredInstruments',
            field_type: 'textarea',
            label_key: 'preferredInstruments',
            placeholder_key: 'preferredInstrumentsPlaceholder',
            required: true,
            field_order: 1
          },
          {
            id: 'tempo-specifications',
            field_name: 'tempoSpecifications',
            field_type: 'select',
            label_key: 'tempoSpecifications',
            placeholder_key: 'selectTempo',
            required: true,
            field_order: 2,
            options: [
              { value: 'slow', label_key: 'slowTempo' },
              { value: 'moderate', label_key: 'moderateTempo' },
              { value: 'fast', label_key: 'fastTempo' },
              { value: 'variable', label_key: 'variableTempo' }
            ]
          },
          {
            id: 'style-references-inst',
            field_name: 'styleReferencesInst',
            field_type: 'textarea',
            label_key: 'styleReferences',
            placeholder_key: 'styleReferencesInstPlaceholder',
            required: false,
            field_order: 3
          },
          {
            id: 'song-structure',
            field_name: 'songStructure',
            field_type: 'textarea',
            label_key: 'songStructure',
            placeholder_key: 'songStructurePlaceholder',
            required: false,
            field_order: 4
          }
        ]
      },
      {
        id: 'instrumental-step-3',
        step_number: 3,
        title_key: 'technicalSpecifications',
        fields: [
          {
            id: 'song-length',
            field_name: 'songLength',
            field_type: 'select',
            label_key: 'songLength',
            placeholder_key: 'selectSongLength',
            required: true,
            field_order: 1,
            options: [
              { value: '1-2min', label_key: 'oneToTwoMin' },
              { value: '2-3min', label_key: 'twoToThreeMin' },
              { value: '3-4min', label_key: 'threeToFourMin' },
              { value: '4-5min', label_key: 'fourToFiveMin' },
              { value: 'custom', label_key: 'customLength' }
            ]
          },
          {
            id: 'format-requirements',
            field_name: 'formatRequirements',
            field_type: 'select',
            label_key: 'formatRequirements',
            placeholder_key: 'selectFormat',
            required: true,
            field_order: 2,
            options: [
              { value: 'wav', label_key: 'wavFormat' },
              { value: 'mp3', label_key: 'mp3Format' },
              { value: 'both', label_key: 'bothFormats' }
            ]
          },
          {
            id: 'mastering-preferences',
            field_name: 'masteringPreferences',
            field_type: 'select',
            label_key: 'masteringPreferences',
            placeholder_key: 'selectMastering',
            required: true,
            field_order: 3,
            options: [
              { value: 'standard', label_key: 'standardMastering' },
              { value: 'professional', label_key: 'professionalMastering' },
              { value: 'broadcast', label_key: 'broadcastMastering' }
            ]
          }
        ]
      },
      {
        id: 'instrumental-step-4',
        step_number: 4,
        title_key: 'contactInformation',
        fields: [
          {
            id: 'composer-details',
            field_name: 'composerDetails',
            field_type: 'text',
            label_key: 'composerDetails',
            placeholder_key: 'composerDetailsPlaceholder',
            required: true,
            field_order: 1
          },
          {
            id: 'usage-context',
            field_name: 'usageContext',
            field_type: 'textarea',
            label_key: 'usageContext',
            placeholder_key: 'usageContextPlaceholder',
            required: false,
            field_order: 2
          },
          {
            id: 'timeline-requirements',
            field_name: 'timelineRequirements',
            field_type: 'select',
            label_key: 'timelineRequirements',
            placeholder_key: 'selectTimeline',
            required: true,
            field_order: 3,
            options: [
              { value: 'standard', label_key: 'standardTimeline' },
              { value: 'rush', label_key: 'rushTimeline' },
              { value: 'flexible', label_key: 'flexibleTimeline' }
            ]
          }
        ]
      },
      {
        id: 'instrumental-step-5',
        step_number: 5,
        title_key: 'usageRights',
        fields: [
          {
            id: 'usage-rights',
            field_name: 'usageRights',
            field_type: 'checkbox',
            label_key: 'acceptUsageRights',
            placeholder_key: 'acceptUsageRightsPlaceholder',
            required: true,
            field_order: 1
          },
          {
            id: 'licensing-terms',
            field_name: 'licensingTerms',
            field_type: 'checkbox',
            label_key: 'acceptLicensingTerms',
            placeholder_key: 'acceptLicensingTermsPlaceholder',
            required: true,
            field_order: 2
          }
        ]
      }
    ]
  },

  // Enhanced Remix Package
  {
    value: 'remix',
    label_key: 'remixPackage',
    tagline_key: 'remixTagline',
    description_key: 'remixDescription',
    price_ron: 499,
    price_eur: 99,
    delivery_time_key: 'remixDelivery',
    includes: [
      { include_key: 'remixInclude1', include_order: 1 },
      { include_key: 'remixInclude2', include_order: 2 },
      { include_key: 'remixInclude3', include_order: 3 },
      { include_key: 'remixInclude4', include_order: 4 },
      { include_key: 'remixInclude5', include_order: 5 },
      { include_key: 'remixInclude6', include_order: 6 }
    ],
    steps: [
      {
        id: 'remix-step-1',
        step_number: 1,
        title_key: 'originalSongDetails',
        fields: [
          {
            id: 'original-song-link',
            field_name: 'originalSongLink',
            field_type: 'text',
            label_key: 'originalSongLink',
            placeholder_key: 'originalSongLinkPlaceholder',
            required: false,
            field_order: 1
          },
          {
            id: 'original-song-upload',
            field_name: 'originalSongUpload',
            field_type: 'file_upload',
            label_key: 'originalSongUpload',
            placeholder_key: 'originalSongUploadPlaceholder',
            required: false,
            field_order: 2
          },
          {
            id: 'ownership-confirmation',
            field_name: 'ownershipConfirmation',
            field_type: 'checkbox',
            label_key: 'ownershipConfirmation',
            placeholder_key: 'ownershipConfirmationPlaceholder',
            required: true,
            field_order: 3
          },
          {
            id: 'current-style-analysis',
            field_name: 'currentStyleAnalysis',
            field_type: 'textarea',
            label_key: 'currentStyleAnalysis',
            placeholder_key: 'currentStyleAnalysisPlaceholder',
            required: true,
            field_order: 4
          }
        ]
      },
      {
        id: 'remix-step-2',
        step_number: 2,
        title_key: 'remixVision',
        fields: [
          {
            id: 'target-genre',
            field_name: 'targetGenre',
            field_type: 'select',
            label_key: 'targetGenre',
            placeholder_key: 'selectTargetGenre',
            required: true,
            field_order: 1,
            options: [
              { value: 'electronic', label_key: 'electronic' },
              { value: 'acoustic', label_key: 'acoustic' },
              { value: 'rock', label_key: 'rock' },
              { value: 'pop', label_key: 'pop' },
              { value: 'hip-hop', label_key: 'hipHop' },
              { value: 'jazz', label_key: 'jazz' },
              { value: 'classical', label_key: 'classical' }
            ]
          },
          {
            id: 'style-transformation',
            field_name: 'styleTransformation',
            field_type: 'textarea',
            label_key: 'styleTransformation',
            placeholder_key: 'styleTransformationPlaceholder',
            required: true,
            field_order: 2
          },
          {
            id: 'creative-direction',
            field_name: 'creativeDirection',
            field_type: 'textarea',
            label_key: 'creativeDirection',
            placeholder_key: 'creativeDirectionPlaceholder',
            required: true,
            field_order: 3
          },
          {
            id: 'inspiration-references',
            field_name: 'inspirationReferences',
            field_type: 'textarea',
            label_key: 'inspirationReferences',
            placeholder_key: 'inspirationReferencesPlaceholder',
            required: false,
            field_order: 4
          }
        ]
      },
      {
        id: 'remix-step-3',
        step_number: 3,
        title_key: 'technicalRequirements',
        fields: [
          {
            id: 'stems-availability',
            field_name: 'stemsAvailability',
            field_type: 'select',
            label_key: 'stemsAvailability',
            placeholder_key: 'selectStemsAvailability',
            required: true,
            field_order: 1,
            options: [
              { value: 'available', label_key: 'stemsAvailable' },
              { value: 'partial', label_key: 'partialStems' },
              { value: 'none', label_key: 'noStems' }
            ]
          },
          {
            id: 'format-specifications',
            field_name: 'formatSpecifications',
            field_type: 'select',
            label_key: 'formatSpecifications',
            placeholder_key: 'selectFormatSpecs',
            required: true,
            field_order: 2,
            options: [
              { value: 'wav', label_key: 'wavFormat' },
              { value: 'mp3', label_key: 'mp3Format' },
              { value: 'both', label_key: 'bothFormats' }
            ]
          },
          {
            id: 'mastering-needs',
            field_name: 'masteringNeeds',
            field_type: 'select',
            label_key: 'masteringNeeds',
            placeholder_key: 'selectMasteringNeeds',
            required: true,
            field_order: 3,
            options: [
              { value: 'standard', label_key: 'standardMastering' },
              { value: 'professional', label_key: 'professionalMastering' },
              { value: 'radio-ready', label_key: 'radioReadyMastering' }
            ]
          }
        ]
      },
      {
        id: 'remix-step-4',
        step_number: 4,
        title_key: 'contactLegalVerification',
        fields: [
          {
            id: 'ownership-documentation',
            field_name: 'ownershipDocumentation',
            field_type: 'file_upload',
            label_key: 'ownershipDocumentation',
            placeholder_key: 'ownershipDocumentationPlaceholder',
            required: false,
            field_order: 1
          },
          {
            id: 'contact-details-remix',
            field_name: 'contactDetailsRemix',
            field_type: 'text',
            label_key: 'contactDetails',
            placeholder_key: 'contactDetailsRemixPlaceholder',
            required: true,
            field_order: 2
          },
          {
            id: 'remix-timeline',
            field_name: 'remixTimeline',
            field_type: 'select',
            label_key: 'remixTimeline',
            placeholder_key: 'selectRemixTimeline',
            required: true,
            field_order: 3,
            options: [
              { value: 'standard', label_key: 'standardTimeline' },
              { value: 'priority', label_key: 'priorityTimeline' },
              { value: 'express', label_key: 'expressTimeline' }
            ]
          }
        ]
      },
      {
        id: 'remix-step-5',
        step_number: 5,
        title_key: 'remixRights',
        fields: [
          {
            id: 'remix-rights-agreement',
            field_name: 'remixRightsAgreement',
            field_type: 'checkbox',
            label_key: 'acceptRemixRights',
            placeholder_key: 'acceptRemixRightsPlaceholder',
            required: true,
            field_order: 1
          },
          {
            id: 'distribution-agreement',
            field_name: 'distributionAgreement',
            field_type: 'checkbox',
            label_key: 'acceptDistributionAgreement',
            placeholder_key: 'acceptDistributionAgreementPlaceholder',
            required: true,
            field_order: 2
          }
        ]
      }
    ]
  }
];

export type PackageData = Package;
