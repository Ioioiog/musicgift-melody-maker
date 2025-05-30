
export const packages = [
  { 
    value: 'personal', 
    labelKey: 'personalPackage',
    price: 300,
    taglineKey: 'personalPackageDesc',
    descriptionKey: 'personalPackageTagline',
    details: {
      priceKey: '300 RON',
      deliveryTimeKey: 'deliveryTime3to5',
      includesKeys: [
        'originalSongFromStory',
        'professionalVoice',
        'rapidDelivery',
        'personalRights',
        'creativeConsultation'
      ]
    }
  },
  { 
    value: 'business', 
    labelKey: 'businessPackage',
    price: 500,
    details: {
      priceKey: '500 RON',
      deliveryTimeKey: 'deliveryTime5to7',
      includesKeys: [
        'commercialSong',
        'professionalAudioProduction',
        'professionalArtistVoice',
        'finalMixMaster',
        'basicCommercialRights',
        'multipleAudioFiles'
      ]
    }
  },
  { 
    value: 'premium', 
    labelKey: 'premiumPackage',
    price: 1000,
    details: {
      priceKey: '1000 RON',
      deliveryTimeKey: 'deliveryTime7to10',
      includesKeys: [
        'premiumAdvancedProduction',
        'automaticDigitalDistribution',
        'lyricVideoIncluded',
        'professionalMixMaster',
        'socialMediaPromotion'
      ]
    }
  },
  { 
    value: 'artist', 
    labelKey: 'artistPackage',
    price: 8000,
    details: {
      priceKey: '8000 RON',
      deliveryTimeKey: 'deliveryTime14to21',
      includesKeys: [
        'fullArtisticCollaboration',
        'originalSongProduction',
        'professionalVocalRecording',
        'professionalMusicVideo',
        'distributionAllPlatforms',
        'contract5050',
        'professionalMarketing'
      ]
    }
  },
  { 
    value: 'instrumental', 
    labelKey: 'instrumentalPackage',
    price: 500,
    details: {
      priceKey: '500 RON',
      deliveryTimeKey: 'deliveryTime5to7',
      includesKeys: [
        'customInstrumental',
        'professionalAudioProduction',
        'finalMixMaster',
        'multipleAudioFiles',
        'separateStems'
      ]
    }
  },
  { 
    value: 'remix', 
    labelKey: 'remixPackage',
    price: 500,
    details: {
      priceKey: '500 RON',
      deliveryTimeKey: 'deliveryTime5to7',
      includesKeys: [
        'professionalRemix',
        'productionDesiredStyle',
        'finalMixMaster',
        'extendedRadioEdit',
        'highQualityAudioFiles'
      ]
    }
  },
  { 
    value: 'gift', 
    labelKey: 'giftPackage',
    price: 0,
    details: {
      priceKey: 'Variabil',
      deliveryTimeKey: 'deliveryTimeVaries',
      includesKeys: [
        'personalizedDigitalCard',
        'personalizedMessage',
        'automaticDelivery',
        'allSelectedPackageBenefits'
      ]
    }
  },
];

export const languages = [
  { value: 'ro', labelKey: 'romanian', flag: '🇷🇴' },
  { value: 'en', labelKey: 'english', flag: '🇺🇸' },
  { value: 'fr', labelKey: 'french', flag: '🇫🇷' },
  { value: 'de', labelKey: 'german', flag: '🇩🇪' },
  { value: 'pl', labelKey: 'polish', flag: '🇵🇱' },
];

export const relationships = [
  { value: 'partner', labelKey: 'partner' },
  { value: 'child', labelKey: 'child' },
  { value: 'parent', labelKey: 'parent' },
  { value: 'sibling', labelKey: 'sibling' },
  { value: 'friend', labelKey: 'friend' },
  { value: 'grandparent', labelKey: 'grandparent' },
  { value: 'other', labelKey: 'otherRelation' }
];

export const occasions = [
  { value: 'birthday', labelKey: 'birthday', emoji: '🎂' },
  { value: 'wedding', labelKey: 'wedding', emoji: '💒' },
  { value: 'anniversary', labelKey: 'anniversary', emoji: '💕' },
  { value: 'valentine', labelKey: 'valentine', emoji: '💝' },
  { value: 'graduation', labelKey: 'graduation', emoji: '🎓' },
  { value: 'christmas', labelKey: 'christmas', emoji: '🎄' },
  { value: 'other', labelKey: 'otherOccasion', emoji: '🎉' }
];

export const emotionalTones = [
  { value: 'romantic', labelKey: 'romantic' },
  { value: 'happy', labelKey: 'happy' },
  { value: 'nostalgic', labelKey: 'nostalgic' },
  { value: 'emotional', labelKey: 'emotional' },
  { value: 'energetic', labelKey: 'energetic' },
  { value: 'peaceful', labelKey: 'peaceful' }
];

export const musicStyles = [
  { value: 'pop', labelKey: 'pop' },
  { value: 'acoustic', labelKey: 'acoustic' },
  { value: 'rock', labelKey: 'rock' },
  { value: 'jazz', labelKey: 'jazz' },
  { value: 'folk', labelKey: 'folk' },
  { value: 'electronic', labelKey: 'electronic' },
  { value: 'classical', labelKey: 'classical' },
  { value: 'reggae', labelKey: 'reggae' },
  { value: 'country', labelKey: 'country' }
];

export const addons = {
  rushDelivery: { labelKey: 'rushDelivery', price: 100 },
  commercialRights: { labelKey: 'commercialRights', price: 100 },
  distributionMangoRecords: { labelKey: 'distributionMangoRecords', price: 200 },
  customVideo: { labelKey: 'customVideo', price: 149 },
  audioMessageFromSender: { labelKey: 'audioMessageFromSender', price: 100 },
  extendedSong: { labelKey: 'extendedSong', price: 49 },
};
