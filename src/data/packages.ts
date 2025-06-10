import { Package, Addon } from '@/types';

const packages: Package[] = [
  {
    value: "personal",
    label: "Personal Song",
    label_key: "personalSong",
    description: "A unique song for someone special",
    description_key: "personalSongDescription",
    price_ron: 299,
    price_eur: 59,
    price_usd: 64,
    color: "from-green-400 to-blue-500",
    features: [
      "Personalized lyrics",
      "Professional vocals",
      "High-quality audio",
      "Digital delivery",
      "Full rights",
      "Fast turnaround"
    ],
    includes: [
      { id: "personal-1", include_key: "personalInclude1", include_order: 1 },
      { id: "personal-2", include_key: "personalInclude2", include_order: 2 },
      { id: "personal-3", include_key: "personalInclude3", include_order: 3 },
      { id: "personal-4", include_key: "personalInclude4", include_order: 4 }
    ],
    available_addons: ["rushDelivery", "socialMediaRights"],
    is_active: true,
    category: "basic"
  },
  {
    value: "premium",
    label: "Premium Song",
    label_key: "premiumSong",
    description: "A top-tier song with global distribution",
    description_key: "premiumSongDescription",
    price_ron: 799,
    price_eur: 159,
    price_usd: 172,
    color: "from-orange-400 to-red-500",
    features: [
      "All 'Personal Song' features",
      "Studio-quality recording",
      "Global distribution",
      "Music video",
      "Marketing support",
      "Dedicated producer"
    ],
    includes: [
      { id: "premium-1", include_key: "premiumInclude1", include_order: 1 },
      { id: "premium-2", include_key: "premiumInclude2", include_order: 2 },
      { id: "premium-3", include_key: "premiumInclude3", include_order: 3 }
    ],
    available_addons: ["rushDelivery", "socialMediaRights", "mangoRecordsDistribution", "customVideo"],
    is_active: true,
    category: "advanced"
  },
  {
    value: "business",
    label: "Business Jingle",
    label_key: "businessJingle",
    description: "Custom music to elevate your brand",
    description_key: "businessJingleDescription",
    price_ron: 999,
    price_eur: 199,
    price_usd: 215,
    color: "from-yellow-400 to-yellow-600",
    features: [
      "Unique brand jingle",
      "Multi-platform usage",
      "Full commercial rights",
      "Voiceover options",
      "Sound effects",
      "Unlimited revisions"
    ],
    includes: [
      { id: "business-1", include_key: "businessInclude1", include_order: 1 },
      { id: "business-2", include_key: "businessInclude2", include_order: 2 },
      { id: "business-3", include_key: "businessInclude3", include_order: 3 },
      { id: "business-4", include_key: "businessInclude4", include_order: 4 },
      { id: "business-5", include_key: "businessInclude5", include_order: 5 }
    ],
    available_addons: ["rushDelivery", "socialMediaRights", "mangoRecordsDistribution", "customVideo"],
    is_active: true,
    category: "commercial"
  },
  {
    value: "artist",
    label: "Artist Song",
    label_key: "artistSong",
    description: "Launch your music career with a hit song",
    description_key: "artistSongDescription",
    price_ron: 1499,
    price_eur: 299,
    price_usd: 323,
    color: "from-purple-400 to-pink-500",
    features: [
      "Professional songwriting",
      "Studio production",
      "Mixing and mastering",
      "Distribution support",
      "Artist branding",
      "Long-term support"
    ],
    includes: [
      { id: "artist-1", include_key: "artistInclude1", include_order: 1 },
      { id: "artist-2", include_key: "artistInclude2", include_order: 2 },
      { id: "artist-3", include_key: "artistInclude3", include_order: 3 },
      { id: "artist-4", include_key: "artistInclude4", include_order: 4 }
    ],
    available_addons: ["rushDelivery", "socialMediaRights", "mangoRecordsDistribution", "customVideo"],
    is_active: true,
    category: "advanced"
  },
  {
    value: "remix",
    label: "Remix Package",
    label_key: "remixPackage",
    description: "Transform your song with a professional remix",
    description_key: "remixPackageDescription",
    price_ron: 699,
    price_eur: 139,
    price_usd: 150,
    color: "from-teal-400 to-green-500",
    features: [
      "Professional remixing",
      "Genre transformation",
      "Mixing and mastering",
      "Distribution support",
      "Radio edit",
      "Extended version"
    ],
    includes: [
      { id: "remix-1", include_key: "remixInclude1", include_order: 1 },
      { id: "remix-2", include_key: "remixInclude2", include_order: 2 },
      { id: "remix-3", include_key: "remixInclude3", include_order: 3 },
      { id: "remix-4", include_key: "remixInclude4", include_order: 4 },
      { id: "remix-5", include_key: "remixInclude5", include_order: 5 },
      { id: "remix-6", include_key: "remixInclude6", include_order: 6 }
    ],
    available_addons: ["rushDelivery", "socialMediaRights", "mangoRecordsDistribution", "customVideo"],
    is_active: true,
    category: "advanced"
  },
  {
    value: "instrumental",
    label: "Instrumental Track",
    label_key: "instrumentalTrack",
    description: "High-quality instrumental for any project",
    description_key: "instrumentalTrackDescription",
    price_ron: 499,
    price_eur: 99,
    price_usd: 107,
    color: "from-blue-400 to-purple-500",
    features: [
      "Custom instrumental track",
      "Multiple genres",
      "Full commercial rights",
      "Mixing and mastering",
      "Loopable version",
      "Stem files"
    ],
    includes: [
      { id: "instrumental-1", include_key: "instrumentalInclude1", include_order: 1 },
      { id: "instrumental-2", include_key: "instrumentalInclude2", include_order: 2 },
      { id: "instrumental-3", include_key: "instrumentalInclude3", include_order: 3 },
      { id: "instrumental-4", include_key: "instrumentalInclude4", include_order: 4 },
      { id: "instrumental-5", include_key: "instrumentalInclude5", include_order: 5 }
    ],
    available_addons: ["rushDelivery", "socialMediaRights", "mangoRecordsDistribution", "customVideo"],
    is_active: true,
    category: "basic"
  },
  {
    value: "plus",
    label: "Plus Package",
    label_key: "plusPackage",
    description: "Quick musical message for any occasion",
    description_key: "plusPackageDescription",
    price_ron: 199,
    price_eur: 39,
    price_usd: 43,
    color: "from-indigo-400 to-violet-500",
    features: [
      "Short musical message",
      "Personalized lyrics",
      "Professional vocals",
      "Digital delivery",
      "Fast turnaround",
      "Simple and easy"
    ],
    includes: [
      { id: "plus-1", include_key: "plusInclude1", include_order: 1 },
      { id: "plus-2", include_key: "plusInclude2", include_order: 2 },
      { id: "plus-3", include_key: "plusInclude3", include_order: 3 }
    ],
    available_addons: ["rushDelivery"],
    is_active: true,
    category: "basic"
  },
  {
    value: "gift",
    label: "Gift Card",
    label_key: "giftCard",
    description: "Give the gift of music",
    description_key: "giftCardDescription",
    price_ron: 299,
    price_eur: 59,
    price_usd: 64,
    color: "from-pink-400 to-purple-500",
    features: [
      "Custom amount",
      "Personalized message",
      "Digital delivery",
      "Easy to redeem",
      "No expiration",
      "Perfect for any occasion"
    ],
    includes: [
      { id: "gift-1", include_key: "giftInclude1", include_order: 1 },
      { id: "gift-2", include_key: "giftInclude2", include_order: 2 },
      { id: "gift-3", include_key: "giftInclude3", include_order: 3 }
    ],
    available_addons: [],
    is_active: true,
    category: "other"
  },
  {
    value: "wedding",
    label: "Wedding Packages",
    label_key: "weddingPackage",
    description: "Create the perfect soundtrack for your special day",
    description_key: "weddingPackageDescription", 
    price_ron: 699,
    price_eur: 139,
    price_usd: 149,
    color: "from-pink-400 to-rose-500",
    features: [
      "Custom wedding dance song",
      "Professional vocals",
      "Wedding ceremony version",
      "Reception version",
      "Digital delivery",
      "Commercial usage rights"
    ],
    includes: [
      { id: "wedding-1", include_key: "weddingInclude1", include_order: 1 },
      { id: "wedding-2", include_key: "weddingInclude2", include_order: 2 },
      { id: "wedding-3", include_key: "weddingInclude3", include_order: 3 },
      { id: "wedding-4", include_key: "weddingInclude4", include_order: 4 },
      { id: "wedding-5", include_key: "weddingInclude5", include_order: 5 },
      { id: "wedding-6", include_key: "weddingInclude6", include_order: 6 },
      { id: "wedding-7", include_key: "weddingInclude7", include_order: 7 },
      { id: "wedding-8", include_key: "weddingInclude8", include_order: 8 }
    ],
    available_addons: ["rushDelivery", "socialMediaRights", "mangoRecordsDistribution", "customVideo", "godparentsMelody"],
    is_active: true,
    category: "special_occasion"
  },
  {
    value: "baptism", 
    label: "Baptism Packages",
    label_key: "baptismPackage",
    description: "A blessed melody for your child's baptism",
    description_key: "baptismPackageDescription",
    price_ron: 499,
    price_eur: 99, 
    price_usd: 109,
    color: "from-blue-400 to-cyan-500",
    features: [
      "Personalized baptism song",
      "Child-friendly melody",
      "Family blessing version",
      "Ceremony version", 
      "Digital delivery",
      "Keepsake audio file"
    ],
    includes: [
      { id: "baptism-1", include_key: "baptismInclude1", include_order: 1 },
      { id: "baptism-2", include_key: "baptismInclude2", include_order: 2 },
      { id: "baptism-3", include_key: "baptismInclude3", include_order: 3 },
      { id: "baptism-4", include_key: "baptismInclude4", include_order: 4 },
      { id: "baptism-5", include_key: "baptismInclude5", include_order: 5 },
      { id: "baptism-6", include_key: "baptismInclude6", include_order: 6 }
    ],
    available_addons: ["rushDelivery", "socialMediaRights", "customVideo", "godparentsMelody"],
    is_active: true,
    category: "special_occasion"
  },
  {
    value: "comingOfAge",
    label: "Coming of Age Packages", 
    label_key: "comingOfAgePackage",
    description: "Celebrate the transition to adulthood",
    description_key: "comingOfAgePackageDescription",
    price_ron: 599,
    price_eur: 119,
    price_usd: 129, 
    color: "from-purple-400 to-indigo-500",
    features: [
      "18th birthday anthem",
      "Coming of age lyrics",
      "Celebration version",
      "Reflection version",
      "Digital delivery", 
      "Social media ready"
    ],
    includes: [
      { id: "comingOfAge-1", include_key: "comingOfAgeInclude1", include_order: 1 },
      { id: "comingOfAge-2", include_key: "comingOfAgeInclude2", include_order: 2 },
      { id: "comingOfAge-3", include_key: "comingOfAgeInclude3", include_order: 3 },
      { id: "comingOfAge-4", include_key: "comingOfAgeInclude4", include_order: 4 },
      { id: "comingOfAge-5", include_key: "comingOfAgeInclude5", include_order: 5 },
      { id: "comingOfAge-6", include_key: "comingOfAgeInclude6", include_order: 6 }
    ],
    available_addons: ["rushDelivery", "socialMediaRights", "mangoRecordsDistribution", "customVideo"],
    is_active: true,
    category: "special_occasion"
  }
];

const addons: Addon[] = [
  {
    id: "rush-delivery",
    addon_key: "rushDelivery",
    label_key: "rushDeliveryAddon",
    description_key: "rushDeliveryAddonDescription",
    price_ron: 149,
    price_eur: 29,
    price_usd: 32,
    is_active: true,
  },
  {
    id: "social-media-rights",
    addon_key: "socialMediaRights",
    label_key: "socialMediaRightsAddon",
    description_key: "socialMediaRightsAddonDescription",
    price_ron: 99,
    price_eur: 19,
    price_usd: 21,
    is_active: true,
  },
  {
    id: "mango-records-distribution",
    addon_key: "mangoRecordsDistribution",
    label_key: "mangoRecordsDistributionAddon",
    description_key: "mangoRecordsDistributionAddonDescription",
    price_ron: 249,
    price_eur: 49,
    price_usd: 53,
    is_active: true,
  },
  {
    id: "custom-video",
    addon_key: "customVideo",
    label_key: "customVideoAddon",
    description_key: "customVideoAddonDescription",
    price_ron: 399,
    price_eur: 79,
    price_usd: 86,
    is_active: true,
  },
  {
    id: "godparents-melody",
    addon_key: "godparentsMelody",
    label_key: "godparentsMelodyAddon",
    description_key: "godparentsMelodyAddonDescription",
    price_ron: 199,
    price_eur: 39,
    price_usd: 42,
    is_active: true,
    trigger_field_type: "godparents-details",
    trigger_field_config: {
      fields: [
        "godparentsNames",
        "godparentsNamesPronunciation", 
        "godparentsRelationshipToCouple",
        "godparentsSpecialQualities",
        "godparentsRoleInWedding",
        "messageToGodparents",
        "godparentsMelodyStyle"
      ]
    }
  }
];

export { packages, addons };
