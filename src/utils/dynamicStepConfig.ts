
import type { Step, Field } from '@/types';

// Mapping of field names to their corresponding translation keys
const fieldNameToLabelKey: Record<string, string> = {
  // General fields
  songTheme: 'songTheme',
  songLanguage: 'songLanguage',
  songStyle: 'musicStyle',
  vocalPreference: 'voicePreference',
  songStyleYoutube: 'referenceSong',
  
  // Recipient fields
  recipientName: 'recipientName',
  recipientNamePronunciation: 'pronunciationAudioRecipient',
  recipientRelation: 'relationship',
  recipientAge: 'recipientAge',
  recipientPersonality: 'recipientPersonality',
  
  // Message fields
  specialMessage: 'specialMessage',
  specialMemories: 'specialMemories',
  sharedExperiences: 'sharedExperiences',
  insideJokes: 'insideJokes',
  futureWishes: 'futureWishes',
  
  // Occasion fields
  occasion: 'occasion',
  eventDate: 'eventDate',
  specialOccasion: 'specialOccasion',
  
  // Music preferences
  favoriteGenre: 'favoriteGenre',
  hobbies: 'hobbies',
  emotionalTone: 'emotionalTone',
  keyMoments: 'keyMoments',
  specialWords: 'specialWords',
  pronunciationAudioKeywords: 'pronunciationAudioKeywords',
  referenceSong: 'referenceSong',
  
  // Contact fields
  fullName: 'fullName',
  email: 'email',
  phone: 'phone',
  address: 'address',
  city: 'city',
  
  // Business fields
  businessName: 'businessName',
  businessIndustry: 'businessIndustry',
  businessValues: 'businessValues',
  companySize: 'companySize',
  targetMarket: 'targetMarket',
  brandPersonality: 'brandPersonality',
  companyHistory: 'companyHistory',
  uniqueSellingProposition: 'uniqueSellingProposition',
  
  // Song requirements
  songPurpose: 'songPurpose',
  targetAudience: 'targetAudience',
  usageContext: 'usageContext',
  desiredEmotionalResponse: 'desiredEmotionalResponse',
  keyMessages: 'keyMessages',
  brandGuidelines: 'brandGuidelines',
  additionalInfo: 'additionalInfo',
  competitorAnalysis: 'competitorAnalysis',
  callToAction: 'callToAction',
  seasonalTemporalRelevance: 'seasonalTemporalRelevance',
  
  // Original song fields
  originalSongTitle: 'originalSongTitle',
  originalArtist: 'originalArtist',
  originalSongLink: 'originalSongLink',
  
  // Remix fields
  remixStyle: 'remixStyle',
  remixMood: 'remixMood',
  remixInstructions: 'remixInstructions',
  
  // Instrumental fields
  instrumentalStyle: 'instrumentalStyle',
  instrumentalMood: 'instrumentalMood',
  instrumentalTempo: 'instrumentalTempo',
  instrumentalDescription: 'instrumentalDescription',
  instrumentalReferences: 'instrumentalReferences',
  loopRequirements: 'loopRequirements',
  
  // Wedding fields
  coupleNames: 'coupleNames',
  coupleType: 'coupleType',
  howMet: 'howMet',
  coupleNamesPronunciation: 'coupleNamesPronunciation',
  relationshipDuration: 'relationshipDuration',
  weddingDate: 'weddingDate',
  weddingVenueType: 'weddingVenueType',
  weddingThemeStyle: 'weddingThemeStyle',
  loveStory: 'loveStory',
  songAtmosphere: 'songAtmosphere',
  musicalStyle: 'musicalStyle',
  voicePreference: 'voicePreference',
  
  // Baptism fields
  childName: 'childName',
  nameMeaning: 'nameMeaning',
  birthStory: 'birthStory',
  childNamePronunciation: 'childNamePronunciation',
  childAge: 'childAge',
  parentsNames: 'parentsNames',
  familyTraditions: 'familyTraditions',
  baptismDate: 'baptismDate',
  churchVenue: 'churchVenue',
  blessingPrayerElements: 'blessingPrayerElements',
  childPersonality: 'childPersonality',
  futureHopes: 'futureHopes',
  familyMessage: 'familyMessage',
  godparentsMention: 'godparentsMention',
  godparentsNames: 'godparentsNames',
  
  // Coming of age fields
  celebrantName: 'celebrantName',
  celebrantNamePronunciation: 'celebrantNamePronunciation',
  ageMilestone: 'ageMilestone',
  personalAchievements: 'personalAchievements',
  personalityTraits: 'personalityTraits',
  futureAspirations: 'futureAspirations',
  favoriteMemories: 'favoriteMemories',
  songVibe: 'songVibe',
  favoriteArtists: 'favoriteArtists',
  lyricalThemes: 'lyricalThemes',
  culturalReferences: 'culturalReferences',
  energyLevel: 'energyLevel',
  collaborationPreference: 'collaborationPreference',
  
  // Artist package fields
  realName: 'fullName',
  yearsActive: 'yearsActive',
  previousReleases: 'previousReleases',
  performanceExperience: 'performanceExperience',
  socialMediaFollowing: 'socialMediaFollowing',
  musicEducationTraining: 'musicEducationTraining',
  careerGoals: 'careerGoals',
  vocalStyle: 'vocalStyle',
  musicalComplexity: 'musicalComplexity',
  marketingBudget: 'marketingBudget',
  releaseStrategy: 'releaseStrategy',
  
  // Instrumental package enhanced fields
  instrumentalLength: 'instrumentalLength',
  intendedUse: 'intendedUse',
  
  // Legal fields
  invoiceType: 'invoiceType',
  companyName: 'companyName',
  vatCode: 'vatCode',
  registrationNumber: 'registrationNumber',
  companyAddress: 'companyAddress',
  representativeName: 'representativeName',
  acceptMentionObligation: 'acceptMentionObligation',
  acceptDistribution: 'acceptDistribution',
  finalNote: 'finalNote'
};

export const transformStepsForWizard = (steps: any[]): Step[] => {
  console.log('🔍 transformStepsForWizard - Input steps:', steps);
  
  const transformedSteps = steps.map((step, index) => {
    console.log(`🔍 Transforming step ${index + 1}:`, {
      id: step.id,
      title_key: step.title_key,
      step_number: step.step_number,
      fieldsCount: step.fields?.length || 0,
      rawFields: step.fields
    });

    const transformedStep = {
      id: step.id || (index + 1).toString(),
      step_number: step.step_number || index + 1,
      title_key: step.title_key || step.title,
      fields: step.step_fields?.map((field: any): Field => {
        console.log(`🔍 Transforming field:`, field);
        return {
          id: field.id || field.field_name,
          field_name: field.field_name,
          field_type: field.field_type,
          // Use provided label_key or fallback to mapped value or field_name
          label_key: field.label_key || fieldNameToLabelKey[field.field_name] || field.field_name,
          placeholder_key: field.placeholder_key,
          required: field.is_required || field.required || false,
          field_order: field.field_order || 0,
          options: field.field_options ? (
            typeof field.field_options === 'string' 
              ? JSON.parse(field.field_options) 
              : field.field_options
          ) : undefined
        };
      }) || step.fields?.map((field: any): Field => {
        console.log(`🔍 Transforming direct field:`, field);
        return {
          id: field.id || field.field_name,
          field_name: field.field_name,
          field_type: field.field_type,
          // Use provided label_key or fallback to mapped value or field_name
          label_key: field.label_key || fieldNameToLabelKey[field.field_name] || field.field_name,
          placeholder_key: field.placeholder_key,
          required: field.is_required || field.required || false,
          field_order: field.field_order || 0,
          options: field.field_options ? (
            typeof field.field_options === 'string' 
              ? JSON.parse(field.field_options) 
              : field.field_options
          ) : undefined
        };
      }) || []
    };

    console.log(`🔍 Transformed step ${index + 1} result:`, {
      id: transformedStep.id,
      title_key: transformedStep.title_key,
      fieldsCount: transformedStep.fields.length,
      fields: transformedStep.fields.map(f => ({ 
        field_name: f.field_name, 
        field_type: f.field_type,
        label_key: f.label_key 
      }))
    });

    return transformedStep;
  });

  console.log('🔍 transformStepsForWizard - Final result:', transformedSteps);
  return transformedSteps;
};
