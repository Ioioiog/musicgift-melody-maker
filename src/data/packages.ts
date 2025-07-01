
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
    steps: []
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
    steps: []
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
    steps: []
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
    steps: []
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
    steps: []
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
    steps: []
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
    steps: []
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
    steps: []
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
    steps: []
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
    steps: []
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
