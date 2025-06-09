
import type { Package } from '@/types';

export const eventPackages: Package[] = [
  {
    id: "wedding",
    value: "wedding",
    label_key: "weddingPackage",
    tagline_key: "weddingTagline", 
    description_key: "weddingDescription",
    price_ron: 599,
    price_eur: 150,
    delivery_time_key: "delivery21Days",
    is_active: true,
    includes: [
      { include_key: "professionalComposition", include_order: 1 },
      { include_key: "personalizedLyrics", include_order: 2 },
      { include_key: "highQualityRecording", include_order: 3 },
      { include_key: "weddingSpecial", include_order: 4 },
      { include_key: "mp3Download", include_order: 5 }
    ],
    available_addons: ["rushDelivery", "socialMediaRights", "mangoRecordsDistribution", "customVideo", "audioMessageFromSender", "extendedSong", "godparentsMelody"],
    steps: []
  },
  {
    id: "baptism", 
    value: "baptism",
    label_key: "baptismPackage",
    tagline_key: "baptismTagline",
    description_key: "baptismDescription",
    price_ron: 399,
    price_eur: 100, 
    delivery_time_key: "delivery14Days",
    is_active: true,
    includes: [
      { include_key: "professionalComposition", include_order: 1 },
      { include_key: "personalizedLyrics", include_order: 2 },
      { include_key: "highQualityRecording", include_order: 3 },
      { include_key: "mp3Download", include_order: 4 }
    ],
    available_addons: ["rushDelivery", "socialMediaRights", "mangoRecordsDistribution", "customVideo", "audioMessageFromSender", "extendedSong"],
    steps: []
  },
  {
    id: "comingOfAge",
    value: "comingOfAge", 
    label_key: "comingOfAgePackage",
    tagline_key: "comingOfAgeTagline",
    description_key: "comingOfAgeDescription",
    price_ron: 399,
    price_eur: 100,
    delivery_time_key: "delivery14Days",
    is_active: true,
    includes: [
      { include_key: "professionalComposition", include_order: 1 },
      { include_key: "personalizedLyrics", include_order: 2 },
      { include_key: "highQualityRecording", include_order: 3 },
      { include_key: "mp3Download", include_order: 4 }
    ],
    available_addons: ["rushDelivery", "socialMediaRights", "mangoRecordsDistribution", "customVideo", "audioMessageFromSender", "extendedSong"],
    steps: []
  }
];
