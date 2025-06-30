
export interface LandingConfig {
  countryName: string;
  countryCode: string;
  flag: string;
  currency: 'RON' | 'EUR';
  language: string;
  heroTitle: string;
  heroSubtitle: string;
  featuredPackages: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  voiceSearchKeywords: string[];
}

export const landingConfigs: Record<string, LandingConfig> = {
  ro: {
    countryName: "România",
    countryCode: "RO",
    flag: "🇷🇴",
    currency: "RON",
    language: "ro",
    heroTitle: "Cadouri muzicale din suflet 🎵",
    heroSubtitle: "Compuse de Mihai Gruia, special pentru tine sau cei dragi",
    featuredPackages: ["personal", "premium", "gift"],
    seoTitle: "Cadouri Muzicale Personalizate România | MusicGift.ro",
    seoDescription: "Creează cadouri muzicale personalizate în România. Melodii compuse de Mihai Gruia pentru momente speciale.",
    seoKeywords: "cadouri muzicale România, melodii personalizate, Mihai Gruia, cadouri muzicale București",
    voiceSearchKeywords: [
      "cadouri muzicale personalizate România",
      "cum să comand o melodie personalizată",
      "Mihai Gruia melodii personalizate",
      "cadouri muzicale București"
    ]
  },
  fr: {
    countryName: "France",
    countryCode: "FR",
    flag: "🇫🇷",
    currency: "EUR",
    language: "fr",
    heroTitle: "Cadeaux musicaux personnalisés",
    heroSubtitle: "Des chansons uniques, inspirées par Mihai Gruia (ex-Akcent)",
    featuredPackages: ["premium", "business", "wedding"],
    seoTitle: "Cadeaux Musicaux Personnalisés France | MusicGift.fr",
    seoDescription: "Créez des chansons personnalisées en France. Compositions professionnelles par Mihai Gruia d'Akcent.",
    seoKeywords: "cadeaux musicaux France, chansons personnalisées, Akcent, Mihai Gruia France",
    voiceSearchKeywords: [
      "cadeaux musicaux personnalisés France",
      "comment commander une chanson personnalisée",
      "Akcent chansons personnalisées",
      "cadeaux musicaux Paris"
    ]
  },
  nl: {
    countryName: "Netherlands",
    countryCode: "NL",
    flag: "🇳🇱",
    currency: "EUR",
    language: "en",
    heroTitle: "Music gifts from Akcent 🎶",
    heroSubtitle: "Customized musical experiences by Mihai Gruia",
    featuredPackages: ["personal", "dj", "premium"],
    seoTitle: "Personalized Music Gifts Netherlands | MusicGift.nl",
    seoDescription: "Create personalized music gifts in Netherlands. Professional compositions by Mihai Gruia from Akcent.",
    seoKeywords: "personalized music gifts Netherlands, custom songs Holland, Akcent Netherlands",
    voiceSearchKeywords: [
      "personalized music gifts Netherlands",
      "how to order custom song Holland",
      "Akcent personalized songs",
      "music gifts Amsterdam"
    ]
  },
  be: {
    countryName: "Belgium",
    countryCode: "BE",
    flag: "🇧🇪",
    currency: "EUR",
    language: "fr",
    heroTitle: "Cadeaux musicaux en Belgique",
    heroSubtitle: "Faites un cadeau original avec une chanson personnalisée",
    featuredPackages: ["wedding", "premium", "gift"],
    seoTitle: "Cadeaux Musicaux Personnalisés Belgique | MusicGift.be",
    seoDescription: "Créez des cadeaux musicaux personnalisés en Belgique. Chansons uniques par Mihai Gruia.",
    seoKeywords: "cadeaux musicaux Belgique, chansons personnalisées Bruxelles, Mihai Gruia Belgique",
    voiceSearchKeywords: [
      "cadeaux musicaux personnalisés Belgique",
      "chansons personnalisées Bruxelles",
      "cadeaux musicaux originaux Belgique"
    ]
  },
  se: {
    countryName: "Sweden",
    countryCode: "SE",
    flag: "🇸🇪",
    currency: "EUR",
    language: "en",
    heroTitle: "Create a music gift from Sweden",
    heroSubtitle: "Inspired by Akcent – delivered worldwide",
    featuredPackages: ["personal", "premium", "artist"],
    seoTitle: "Personalized Music Gifts Sweden | MusicGift.se",
    seoDescription: "Create personalized music gifts in Sweden. Professional compositions by Mihai Gruia from Akcent.",
    seoKeywords: "personalized music gifts Sweden, custom songs Stockholm, Akcent Sweden",
    voiceSearchKeywords: [
      "personalized music gifts Sweden",
      "custom songs Stockholm",
      "music gifts Sweden Akcent"
    ]
  },
  dk: {
    countryName: "Denmark",
    countryCode: "DK",
    flag: "🇩🇰",
    currency: "EUR",
    language: "en",
    heroTitle: "Danish fans love custom music gifts!",
    heroSubtitle: "A song made for someone you love, by Mihai Gruia",
    featuredPackages: ["personal", "premium", "artist"],
    seoTitle: "Personalized Music Gifts Denmark | MusicGift.dk",
    seoDescription: "Create personalized music gifts in Denmark. Professional compositions by Mihai Gruia from Akcent.",
    seoKeywords: "personalized music gifts Denmark, custom songs Copenhagen, Akcent Denmark",
    voiceSearchKeywords: [
      "personalized music gifts Denmark",
      "custom songs Copenhagen",
      "music gifts Denmark"
    ]
  },
  no: {
    countryName: "Norway",
    countryCode: "NO",
    flag: "🇳🇴",
    currency: "EUR",
    language: "en",
    heroTitle: "Send a unique musical gift from Norway",
    heroSubtitle: "Akcent-style songs with emotional impact",
    featuredPackages: ["personal", "premium", "artist"],
    seoTitle: "Personalized Music Gifts Norway | MusicGift.no",
    seoDescription: "Create personalized music gifts in Norway. Professional compositions by Mihai Gruia from Akcent.",
    seoKeywords: "personalized music gifts Norway, custom songs Oslo, Akcent Norway",
    voiceSearchKeywords: [
      "personalized music gifts Norway",
      "custom songs Oslo",
      "music gifts Norway Akcent"
    ]
  },
  gr: {
    countryName: "Greece",
    countryCode: "GR",
    flag: "🇬🇷",
    currency: "EUR",
    language: "en",
    heroTitle: "Personalized music gifts in Greece 🇬🇷",
    heroSubtitle: "Create unforgettable memories through song",
    featuredPackages: ["wedding", "personal", "premium"],
    seoTitle: "Personalized Music Gifts Greece | MusicGift.gr",
    seoDescription: "Create personalized music gifts in Greece. Professional compositions by Mihai Gruia from Akcent.",
    seoKeywords: "personalized music gifts Greece, custom songs Athens, Akcent Greece",
    voiceSearchKeywords: [
      "personalized music gifts Greece",
      "custom songs Athens",
      "music gifts Greece"
    ]
  },
  tr: {
    countryName: "Turkey",
    countryCode: "TR",
    flag: "🇹🇷",
    currency: "EUR",
    language: "en",
    heroTitle: "Müzikal hediyeler Türkiye için 🎶",
    heroSubtitle: "Kişiye özel şarkılar – Mihai Gruia'dan",
    featuredPackages: ["wedding", "personal", "premium"],
    seoTitle: "Personalized Music Gifts Turkey | MusicGift.tr",
    seoDescription: "Create personalized music gifts in Turkey. Professional compositions by Mihai Gruia from Akcent.",
    seoKeywords: "personalized music gifts Turkey, custom songs Istanbul, Akcent Turkey",
    voiceSearchKeywords: [
      "personalized music gifts Turkey",
      "custom songs Istanbul",
      "müzikal hediyeler Türkiye"
    ]
  },
  bg: {
    countryName: "Bulgaria",
    countryCode: "BG",
    flag: "🇧🇬",
    currency: "EUR",
    language: "en",
    heroTitle: "Музикални подаръци за България 🇧🇬",
    heroSubtitle: "Персонализирани песни от Mihai Gruia",
    featuredPackages: ["personal", "gift", "premium"],
    seoTitle: "Personalized Music Gifts Bulgaria | MusicGift.bg",
    seoDescription: "Create personalized music gifts in Bulgaria. Professional compositions by Mihai Gruia from Akcent.",
    seoKeywords: "personalized music gifts Bulgaria, custom songs Sofia, Akcent Bulgaria",
    voiceSearchKeywords: [
      "personalized music gifts Bulgaria",
      "custom songs Sofia",
      "музикални подаръци България"
    ]
  },
  in: {
    countryName: "India",
    countryCode: "IN",
    flag: "🇮🇳",
    currency: "EUR",
    language: "en",
    heroTitle: "Celebrate with a personalized song in India 🎉",
    heroSubtitle: "A music gift full of emotions by Mihai Gruia",
    featuredPackages: ["personal", "premium", "gift"],
    seoTitle: "Personalized Music Gifts India | MusicGift.in",
    seoDescription: "Create personalized music gifts in India. Professional compositions by Mihai Gruia from Akcent.",
    seoKeywords: "personalized music gifts India, custom songs Mumbai, Akcent India",
    voiceSearchKeywords: [
      "personalized music gifts India",
      "custom songs Mumbai Delhi",
      "music gifts India"
    ]
  },
  pk: {
    countryName: "Pakistan",
    countryCode: "PK",
    flag: "🇵🇰",
    currency: "EUR",
    language: "en",
    heroTitle: "Music gifts for Pakistan 🇵🇰",
    heroSubtitle: "Unique songs created by Mihai Gruia",
    featuredPackages: ["personal", "premium", "gift"],
    seoTitle: "Personalized Music Gifts Pakistan | MusicGift.pk",
    seoDescription: "Create personalized music gifts in Pakistan. Professional compositions by Mihai Gruia from Akcent.",
    seoKeywords: "personalized music gifts Pakistan, custom songs Karachi, Akcent Pakistan",
    voiceSearchKeywords: [
      "personalized music gifts Pakistan",
      "custom songs Karachi Lahore",
      "music gifts Pakistan"
    ]
  },
  ph: {
    countryName: "Philippines",
    countryCode: "PH",
    flag: "🇵🇭",
    currency: "EUR",
    language: "en",
    heroTitle: "Heartfelt music gifts in the Philippines 🇵🇭",
    heroSubtitle: "Create a memory with a song made just for them",
    featuredPackages: ["personal", "premium", "gift"],
    seoTitle: "Personalized Music Gifts Philippines | MusicGift.ph",
    seoDescription: "Create personalized music gifts in Philippines. Professional compositions by Mihai Gruia from Akcent.",
    seoKeywords: "personalized music gifts Philippines, custom songs Manila, Akcent Philippines",
    voiceSearchKeywords: [
      "personalized music gifts Philippines",
      "custom songs Manila Cebu",
      "music gifts Philippines"
    ]
  }
};

export const getCountryConfig = (countryCode: string): LandingConfig => {
  return landingConfigs[countryCode.toLowerCase()] || landingConfigs.ro;
};

export const getSupportedCountries = (): string[] => {
  return Object.keys(landingConfigs);
};
