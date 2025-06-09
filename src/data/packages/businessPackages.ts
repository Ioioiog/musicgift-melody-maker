
import type { Package } from '@/types';

export const businessPackages: Package[] = [
  {
    id: "business",
    value: "business",
    label_key: "businessPackage",
    tagline_key: "businessTagline",
    description_key: "businessDescription", 
    price_ron: 999,
    price_eur: 250,
    delivery_time_key: "delivery30Days",
    tag: "business",
    is_active: true,
    includes: [
      { include_key: "professionalComposition", include_order: 1 },
      { include_key: "personalizedLyrics", include_order: 2 },
      { include_key: "highQualityRecording", include_order: 3 },
      { include_key: "commercialRights", include_order: 4 },
      { include_key: "mp3Download", include_order: 5 }
    ],
    available_addons: ["rushDelivery", "mangoRecordsDistribution", "customVideo", "brandedAudioMessage", "commercialRightsUpgrade"],
    steps: []
  },
  {
    id: "artist",
    value: "artist",
    label_key: "artistPackage",
    tagline_key: "artistTagline",
    description_key: "artistDescription", 
    price_ron: 1299,
    price_eur: 325,
    delivery_time_key: "delivery45Days",
    is_active: true,
    includes: [
      { include_key: "professionalComposition", include_order: 1 },
      { include_key: "personalizedLyrics", include_order: 2 },
      { include_key: "highQualityRecording", include_order: 3 },
      { include_key: "globalDistribution", include_order: 4 },
      { include_key: "commercialRights", include_order: 5 },
      { include_key: "mp3Download", include_order: 6 }
    ],
    available_addons: [],
    steps: []
  }
];
