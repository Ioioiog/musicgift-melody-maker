
import type { Package } from '@/types';
import { commonPackageSteps } from '../packageSteps';

export const personalPackages: Package[] = [
  {
    id: "personal",
    value: "personal",
    label_key: "personalPackage",
    tagline_key: "personalTagline",
    description_key: "personalDescription",
    price_ron: 299,
    price_eur: 75,
    delivery_time_key: "delivery14Days",
    tag: "popular",
    is_active: true,
    is_popular: true,
    includes: [
      { include_key: "professionalComposition", include_order: 1 },
      { include_key: "personalizedLyrics", include_order: 2 }, 
      { include_key: "highQualityRecording", include_order: 3 },
      { include_key: "mp3Download", include_order: 4 }
    ],
    available_addons: ["rushDelivery", "socialMediaRights", "mangoRecordsDistribution", "customVideo", "audioMessageFromSender", "extendedSong"],
    steps: commonPackageSteps
  },
  {
    id: "premium",
    value: "premium",
    label_key: "premiumPackage",
    tagline_key: "premiumTagline",
    description_key: "premiumDescription",
    price_ron: 699,
    price_eur: 175,
    delivery_time_key: "delivery21Days",
    tag: "premium",
    is_active: true,
    premium: true,
    includes: [
      { include_key: "professionalComposition", include_order: 1 },
      { include_key: "personalizedLyrics", include_order: 2 },
      { include_key: "highQualityRecording", include_order: 3 },
      { include_key: "globalDistribution", include_order: 4 },
      { include_key: "mp3Download", include_order: 5 },
      { include_key: "mixedMastered", include_order: 6 }
    ],
    available_addons: ["rushDelivery", "customVideo", "audioMessageFromSender", "extendedSong"],
    steps: commonPackageSteps
  },
  {
    id: "plus",
    value: "plus",
    label_key: "plusPackage", 
    tagline_key: "plusTagline",
    description_key: "plusDescription",
    price_ron: 499,
    price_eur: 125,
    delivery_time_key: "delivery14Days",
    is_active: true,
    includes: [
      { include_key: "professionalComposition", include_order: 1 },
      { include_key: "personalizedLyrics", include_order: 2 },
      { include_key: "highQualityRecording", include_order: 3 },
      { include_key: "extraRevisionIncluded", include_order: 4 },
      { include_key: "mp3Download", include_order: 5 }
    ],
    available_addons: [],
    steps: []
  }
];
