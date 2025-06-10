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
