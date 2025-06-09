
import type { Package } from '@/types';

export const specialtyPackages: Package[] = [
  {
    id: "gift",
    value: "gift",
    label_key: "giftPackage",
    tagline_key: "giftTagline", 
    description_key: "giftDescription",
    price_ron: 299,
    price_eur: 75,
    delivery_time_key: "delivery14Days",
    tag: "gift",
    is_active: true,
    includes: [
      { include_key: "professionalComposition", include_order: 1 },
      { include_key: "personalizedLyrics", include_order: 2 },
      { include_key: "highQualityRecording", include_order: 3 },
      { include_key: "mp3Download", include_order: 4 }
    ],
    available_addons: [],
    steps: []
  },
  {
    id: "remix",
    value: "remix", 
    label_key: "remixPackage",
    tagline_key: "remixTagline",
    description_key: "remixDescription",
    price_ron: 199,
    price_eur: 50,
    delivery_time_key: "delivery7Days",
    is_active: true,
    includes: [
      { include_key: "professionalRemix", include_order: 1 },
      { include_key: "mp3Download", include_order: 2 }
    ],
    available_addons: ["rushDelivery", "mangoRecordsDistribution", "customVideo"],
    steps: []
  },
  {
    id: "instrumental",
    value: "instrumental",
    label_key: "instrumentalPackage", 
    tagline_key: "instrumentalTagline",
    description_key: "instrumentalDescription",
    price_ron: 399,
    price_eur: 100,
    delivery_time_key: "delivery14Days", 
    is_active: true,
    includes: [
      { include_key: "professionalComposition", include_order: 1 },
      { include_key: "instrumentalOnly", include_order: 2 },
      { include_key: "mp3Download", include_order: 3 }
    ],
    available_addons: ["rushDelivery", "mangoRecordsDistribution", "customVideo", "separatedStems"],
    steps: []
  }
];
