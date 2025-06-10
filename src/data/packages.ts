
// Package step configurations for the order wizard
export const packageSteps = {
  personal: [
    {
      step_number: 1,
      title_key: "generalDetails",
      fields: [
        { 
          id: "1", 
          field_name: "recipientName", 
          field_type: "text", 
          placeholder_key: "recipientName", 
          required: true, 
          field_order: 1 
        },
        { 
          id: "2", 
          field_name: "vocalPreference", 
          field_type: "select", 
          placeholder_key: "vocalPreference", 
          required: true, 
          field_order: 2,
          options: [
            { value: "male", label_key: "voiceMale" },
            { value: "female", label_key: "voiceFemale" },
            { value: "duet", label_key: "voiceDuet" }
          ]
        },
        { 
          id: "3", 
          field_name: "songStyleExample", 
          field_type: "textarea", 
          placeholder_key: "songStyleExample", 
          required: false, 
          field_order: 3 
        },
        { 
          id: "4", 
          field_name: "relationship", 
          field_type: "select", 
          placeholder_key: "relationship", 
          required: true, 
          field_order: 4 
        },
        { 
          id: "5", 
          field_name: "songLanguage", 
          field_type: "select", 
          placeholder_key: "songLanguage", 
          required: true, 
          field_order: 5,
          options: [
            { value: "romanian", label_key: "romanianLanguage" },
            { value: "english", label_key: "englishLanguage" },
            { value: "french", label_key: "frenchLanguage" },
            { value: "italian", label_key: "italianLanguage" }
          ]
        }
      ]
    },
    {
      step_number: 2,
      title_key: "recipientDetails",
      fields: [
        { 
          id: "6", 
          field_name: "recipientPronunciation", 
          field_type: "audio", 
          placeholder_key: "recipientPronunciation", 
          required: false, 
          field_order: 1 
        },
        { 
          id: "7", 
          field_name: "recipientFavoriteGenre", 
          field_type: "text", 
          placeholder_key: "recipientFavoriteGenre", 
          required: false, 
          field_order: 2 
        },
        { 
          id: "8", 
          field_name: "recipientHobbies", 
          field_type: "textarea", 
          placeholder_key: "recipientHobbies", 
          required: false, 
          field_order: 3 
        },
        { 
          id: "9", 
          field_name: "specialOccasion", 
          field_type: "select", 
          placeholder_key: "specialOccasion", 
          required: false, 
          field_order: 4,
          options: [
            { value: "birthday", label_key: "occasionBirthday" },
            { value: "anniversary", label_key: "occasionAnniversary" },
            { value: "graduation", label_key: "occasionGraduation" },
            { value: "apology", label_key: "occasionApology" },
            { value: "thankyou", label_key: "occasionThankYou" },
            { value: "justbecause", label_key: "occasionJustBecause" }
          ]
        },
        { 
          id: "10", 
          field_name: "eventDate", 
          field_type: "date", 
          placeholder_key: "eventDate", 
          required: false, 
          field_order: 5 
        }
      ]
    },
    {
      step_number: 3,
      title_key: "messageDetails",
      fields: [
        { 
          id: "11", 
          field_name: "story", 
          field_type: "textarea", 
          placeholder_key: "story", 
          required: true, 
          field_order: 1 
        },
        { 
          id: "12", 
          field_name: "specialMemories", 
          field_type: "textarea", 
          placeholder_key: "specialMemories", 
          required: false, 
          field_order: 2 
        },
        { 
          id: "13", 
          field_name: "sharedExperiences", 
          field_type: "textarea", 
          placeholder_key: "sharedExperiences", 
          required: false, 
          field_order: 3 
        },
        { 
          id: "14", 
          field_name: "insideJokes", 
          field_type: "textarea", 
          placeholder_key: "insideJokes", 
          required: false, 
          field_order: 4 
        },
        { 
          id: "15", 
          field_name: "futureWishes", 
          field_type: "textarea", 
          placeholder_key: "futureWishes", 
          required: false, 
          field_order: 5 
        },
        { 
          id: "16", 
          field_name: "emotionalTone", 
          field_type: "select", 
          placeholder_key: "emotionalTone", 
          required: true, 
          field_order: 6 
        },
        { 
          id: "17", 
          field_name: "keyMoments", 
          field_type: "textarea", 
          placeholder_key: "keyMoments", 
          required: true, 
          field_order: 7 
        },
        { 
          id: "18", 
          field_name: "specialWords", 
          field_type: "textarea", 
          placeholder_key: "specialWords", 
          required: false, 
          field_order: 8 
        }
      ]
    },
    {
      step_number: 4,
      title_key: "musicalPreferences",
      fields: [
        { 
          id: "19", 
          field_name: "musicStyle", 
          field_type: "select", 
          placeholder_key: "musicStyle", 
          required: true, 
          field_order: 1 
        },
        { 
          id: "20", 
          field_name: "referenceSong", 
          field_type: "url", 
          placeholder_key: "referenceSong", 
          required: false, 
          field_order: 2 
        }
      ]
    }
  ],
  premium: [
    {
      step_number: 1,
      title_key: "generalDetails",
      fields: [
        { 
          id: "21", 
          field_name: "recipientName", 
          field_type: "text", 
          placeholder_key: "recipientName", 
          required: true, 
          field_order: 1 
        },
        { 
          id: "22", 
          field_name: "vocalPreference", 
          field_type: "select", 
          placeholder_key: "vocalPreference", 
          required: true, 
          field_order: 2,
          options: [
            { value: "male", label_key: "voiceMale" },
            { value: "female", label_key: "voiceFemale" },
            { value: "duet", label_key: "voiceDuet" }
          ]
        },
        { 
          id: "23", 
          field_name: "songStyleExample", 
          field_type: "textarea", 
          placeholder_key: "songStyleExample", 
          required: false, 
          field_order: 3 
        },
        { 
          id: "24", 
          field_name: "relationship", 
          field_type: "select", 
          placeholder_key: "relationship", 
          required: true, 
          field_order: 4 
        },
        { 
          id: "25", 
          field_name: "songLanguage", 
          field_type: "select", 
          placeholder_key: "songLanguage", 
          required: true, 
          field_order: 5,
          options: [
            { value: "romanian", label_key: "romanianLanguage" },
            { value: "english", label_key: "englishLanguage" },
            { value: "french", label_key: "frenchLanguage" },
            { value: "italian", label_key: "italianLanguage" }
          ]
        }
      ]
    },
    {
      step_number: 2,
      title_key: "recipientDetails",
      fields: [
        { 
          id: "26", 
          field_name: "recipientPronunciation", 
          field_type: "audio", 
          placeholder_key: "recipientPronunciation", 
          required: false, 
          field_order: 1 
        },
        { 
          id: "27", 
          field_name: "recipientFavoriteGenre", 
          field_type: "text", 
          placeholder_key: "recipientFavoriteGenre", 
          required: false, 
          field_order: 2 
        },
        { 
          id: "28", 
          field_name: "recipientHobbies", 
          field_type: "textarea", 
          placeholder_key: "recipientHobbies", 
          required: false, 
          field_order: 3 
        },
        { 
          id: "29", 
          field_name: "specialOccasion", 
          field_type: "select", 
          placeholder_key: "specialOccasion", 
          required: false, 
          field_order: 4,
          options: [
            { value: "birthday", label_key: "occasionBirthday" },
            { value: "anniversary", label_key: "occasionAnniversary" },
            { value: "graduation", label_key: "occasionGraduation" },
            { value: "apology", label_key: "occasionApology" },
            { value: "thankyou", label_key: "occasionThankYou" },
            { value: "justbecause", label_key: "occasionJustBecause" }
          ]
        },
        { 
          id: "30", 
          field_name: "eventDate", 
          field_type: "date", 
          placeholder_key: "eventDate", 
          required: false, 
          field_order: 5 
        }
      ]
    },
    {
      step_number: 3,
      title_key: "messageDetails",
      fields: [
        { 
          id: "31", 
          field_name: "story", 
          field_type: "textarea", 
          placeholder_key: "story", 
          required: true, 
          field_order: 1 
        },
        { 
          id: "32", 
          field_name: "specialMemories", 
          field_type: "textarea", 
          placeholder_key: "specialMemories", 
          required: false, 
          field_order: 2 
        },
        { 
          id: "33", 
          field_name: "sharedExperiences", 
          field_type: "textarea", 
          placeholder_key: "sharedExperiences", 
          required: false, 
          field_order: 3 
        },
        { 
          id: "34", 
          field_name: "insideJokes", 
          field_type: "textarea", 
          placeholder_key: "insideJokes", 
          required: false, 
          field_order: 4 
        },
        { 
          id: "35", 
          field_name: "futureWishes", 
          field_type: "textarea", 
          placeholder_key: "futureWishes", 
          required: false, 
          field_order: 5 
        },
        { 
          id: "36", 
          field_name: "emotionalTone", 
          field_type: "select", 
          placeholder_key: "emotionalTone", 
          required: true, 
          field_order: 6 
        },
        { 
          id: "37", 
          field_name: "keyMoments", 
          field_type: "textarea", 
          placeholder_key: "keyMoments", 
          required: true, 
          field_order: 7 
        },
        { 
          id: "38", 
          field_name: "specialWords", 
          field_type: "textarea", 
          placeholder_key: "specialWords", 
          required: false, 
          field_order: 8 
        }
      ]
    },
    {
      step_number: 4,
      title_key: "musicalPreferences",
      fields: [
        { 
          id: "39", 
          field_name: "musicStyle", 
          field_type: "select", 
          placeholder_key: "musicStyle", 
          required: true, 
          field_order: 1 
        },
        { 
          id: "40", 
          field_name: "referenceSong", 
          field_type: "url", 
          placeholder_key: "referenceSong", 
          required: false, 
          field_order: 2 
        }
      ]
    }
  ]
};

// Mock packages data to maintain compatibility with existing components
export const packages = [
  {
    id: '1',
    value: 'personal',
    label_key: 'personalPackage',
    description_key: 'personalPackageDesc',
    price_ron: 29900,
    price_eur: 6000,
    price_usd: 6500,
    delivery_time_key: '3-5 days',
    includes: []
  },
  {
    id: '2',
    value: 'premium',
    label_key: 'premiumPackage',
    description_key: 'premiumPackageDesc',
    price_ron: 59900,
    price_eur: 12000,
    price_usd: 13000,
    delivery_time_key: '5-7 days',
    includes: []
  }
];

// Mock addons data
export const addOns = [];

// Type definition for compatibility
export interface PackageData {
  id: string;
  value: string;
  label_key: string;
  description_key: string;
  price_ron: number;
  price_eur: number;
  price_usd: number;
  delivery_time_key: string;
  includes: any[];
}
