
export interface PackageData {
  id: string;
  value: string;
  label_key: string;
  price: number;
  tagline_key?: string;
  description_key?: string;
  delivery_time_key?: string;
  tags: Array<{
    tag_type: string;
    tag_label_key?: string;
    styling_class?: string;
  }>;
  includes: Array<{
    include_key: string;
    include_order: number;
  }>;
  steps: Array<{
    step_number: number;
    title_key: string;
    step_order: number;
    fields: Array<{
      field_name: string;
      field_type: string;
      placeholder_key?: string;
      required: boolean;
      field_order: number;
      options?: Array<{ value: string; label_key: string; }>;
      validations: any[];
      dependencies: any[];
    }>;
  }>;
  addons: any[];
}

export const packages: PackageData[] = [
  {
    id: "personal-package-id",
    value: "personal",
    label_key: "personalPackage",
    price: 300,
    tagline_key: "O melodie unică pentru momentele tale speciale",
    description_key: "Perfect pentru cadouri personalizate și momente de neuitat",
    delivery_time_key: "3-5 zile",
    tags: [
      {
        tag_type: "new",
        tag_label_key: "Nou",
        styling_class: "bg-green-100 text-green-800"
      }
    ],
    includes: [
      {
        include_key: "Cântec original din povestea ta",
        include_order: 1
      },
      {
        include_key: "Voce profesională",
        include_order: 2
      },
      {
        include_key: "Livrare rapidă",
        include_order: 3
      },
      {
        include_key: "Drepturi personale",
        include_order: 4
      },
      {
        include_key: "Consultanță creativă",
        include_order: 5
      }
    ],
    steps: [
      {
        step_number: 1,
        title_key: "Alege pachetul",
        step_order: 1,
        fields: []
      },
      {
        step_number: 2,
        title_key: "Povestea ta",
        step_order: 2,
        fields: [
          {
            field_name: "recipientName",
            field_type: "text",
            placeholder_key: "Numele destinatarului",
            required: true,
            field_order: 1,
            validations: [],
            dependencies: []
          },
          {
            field_name: "relationship",
            field_type: "select",
            placeholder_key: "Relația cu destinatarul",
            required: true,
            field_order: 2,
            options: [
              { value: "partner", label_key: "Partener/ă" },
              { value: "child", label_key: "Copil" },
              { value: "parent", label_key: "Părinte" },
              { value: "friend", label_key: "Prieten/ă" },
              { value: "sibling", label_key: "Frate/Soră" },
              { value: "grandparent", label_key: "Bunic/Bunică" },
              { value: "other", label_key: "Altă relație" }
            ],
            validations: [],
            dependencies: []
          },
          {
            field_name: "occasion",
            field_type: "select",
            placeholder_key: "Ocazia",
            required: true,
            field_order: 3,
            options: [
              { value: "birthday", label_key: "Zi de naștere" },
              { value: "anniversary", label_key: "Aniversare" },
              { value: "wedding", label_key: "Nuntă" },
              { value: "valentine", label_key: "Ziua Îndrăgostiților" },
              { value: "christmas", label_key: "Crăciun" },
              { value: "other", label_key: "Altă ocazie" }
            ],
            validations: [],
            dependencies: []
          },
          {
            field_name: "story",
            field_type: "textarea",
            placeholder_key: "Povestea voastră în câteva cuvinte",
            required: true,
            field_order: 4,
            validations: [],
            dependencies: []
          },
          {
            field_name: "musicStyle",
            field_type: "select",
            placeholder_key: "Stilul muzical preferat",
            required: false,
            field_order: 5,
            options: [
              { value: "pop", label_key: "Pop" },
              { value: "acoustic", label_key: "Acustic" },
              { value: "rock", label_key: "Rock" },
              { value: "jazz", label_key: "Jazz" },
              { value: "folk", label_key: "Folk" },
              { value: "electronic", label_key: "Electronic" }
            ],
            validations: [],
            dependencies: []
          }
        ]
      }
    ],
    addons: []
  },
  {
    id: "business-package-id",
    value: "business",
    label_key: "businessPackage",
    price: 500,
    tagline_key: "Dă-i brandului tău o voce memorabilă",
    description_key: "Creat pentru companii care vor o piesă originală pentru branding, campanii sau reclame cu impact emoțional",
    delivery_time_key: "5–7 zile",
    tags: [
      {
        tag_type: "popular",
        tag_label_key: "Popular",
        styling_class: "bg-blue-100 text-blue-800"
      }
    ],
    includes: [
      {
        include_key: "Cântec personalizat pentru afacerea ta",
        include_order: 1
      },
      {
        include_key: "Producție profesională și voce de studio",
        include_order: 2
      },
      {
        include_key: "Mix & Master de calitate superioară",
        include_order: 3
      },
      {
        include_key: "Licență comercială limitată (excludere: radio, TV, revânzare piesă)",
        include_order: 4
      },
      {
        include_key: "Fișiere audio multiple (MP3, WAV)",
        include_order: 5
      }
    ],
    steps: [
      {
        step_number: 1,
        title_key: "Alege pachetul",
        step_order: 1,
        fields: []
      },
      {
        step_number: 2,
        title_key: "Informații companie",
        step_order: 2,
        fields: [
          {
            field_name: "companyName",
            field_type: "text",
            placeholder_key: "Numele companiei",
            required: true,
            field_order: 1,
            validations: [],
            dependencies: []
          },
          {
            field_name: "companyActivity",
            field_type: "text",
            placeholder_key: "Domeniul de activitate",
            required: true,
            field_order: 2,
            validations: [],
            dependencies: []
          },
          {
            field_name: "brandMessage",
            field_type: "textarea",
            placeholder_key: "Ce mesaj vrei să transmită melodia despre brandul tău",
            required: true,
            field_order: 3,
            validations: [],
            dependencies: []
          },
          {
            field_name: "targetAudience",
            field_type: "text",
            placeholder_key: "Publicul țintă",
            required: false,
            field_order: 4,
            validations: [],
            dependencies: []
          },
          {
            field_name: "musicStyle",
            field_type: "select",
            placeholder_key: "Stilul muzical preferat",
            required: true,
            field_order: 5,
            options: [
              { value: "corporate", label_key: "Corporate" },
              { value: "energetic", label_key: "Energic" },
              { value: "calm", label_key: "Calm" },
              { value: "modern", label_key: "Modern" },
              { value: "classic", label_key: "Clasic" }
            ],
            validations: [],
            dependencies: []
          }
        ]
      }
    ],
    addons: []
  },
  {
    id: "premium-package-id",
    value: "premium",
    label_key: "premiumPackage",
    price: 500,
    tagline_key: "Experiența completă: cântec + video animat + distribuție",
    description_key: "Pachetul complet pentru cei care vor totul inclus",
    delivery_time_key: "5-7 zile",
    tags: [
      {
        tag_type: "hot",
        tag_label_key: "Popular",
        styling_class: "bg-red-100 text-red-800"
      }
    ],
    includes: [
      {
        include_key: "Cântec original cu producție completă",
        include_order: 1
      },
      {
        include_key: "Video animat DOMG",
        include_order: 2
      },
      {
        include_key: "Distribuție oficială digitală Mango Records",
        include_order: 3
      }
    ],
    steps: [
      {
        step_number: 1,
        title_key: "Alege pachetul",
        step_order: 1,
        fields: []
      },
      {
        step_number: 2,
        title_key: "Detalii cântec",
        step_order: 2,
        fields: [
          {
            field_name: "songTitle",
            field_type: "text",
            placeholder_key: "Titlul dorit pentru cântec",
            required: true,
            field_order: 1,
            validations: [],
            dependencies: []
          },
          {
            field_name: "musicStyle",
            field_type: "select",
            placeholder_key: "Stilul muzical preferat",
            required: true,
            field_order: 2,
            options: [
              { value: "pop", label_key: "Pop" },
              { value: "rock", label_key: "Rock" },
              { value: "acoustic", label_key: "Acustic" },
              { value: "electronic", label_key: "Electronic" },
              { value: "folk", label_key: "Folk" }
            ],
            validations: [],
            dependencies: []
          },
          {
            field_name: "videoStyle",
            field_type: "select",
            placeholder_key: "Stilul video-ului animat",
            required: true,
            field_order: 3,
            options: [
              { value: "romantic", label_key: "Romantic" },
              { value: "fun", label_key: "Distractiv" },
              { value: "elegant", label_key: "Elegant" },
              { value: "energetic", label_key: "Energic" }
            ],
            validations: [],
            dependencies: []
          },
          {
            field_name: "songConcept",
            field_type: "textarea",
            placeholder_key: "Conceptul și mesajul cântecului",
            required: true,
            field_order: 4,
            validations: [],
            dependencies: []
          }
        ]
      }
    ],
    addons: []
  },
  {
    id: "artist-package-id",
    value: "artist",
    label_key: "artistPackage",
    price: 8000,
    tagline_key: "Colaborare artistică completă pentru cariera ta muzicală",
    description_key: "Pachetul profesional pentru artiști care vor să își lanseze cariera muzicală",
    delivery_time_key: "14-21 zile",
    tags: [
      {
        tag_type: "premium",
        tag_label_key: "Premium",
        styling_class: "bg-purple-100 text-purple-800"
      }
    ],
    includes: [
      {
        include_key: "Colaborare artistică completă",
        include_order: 1
      },
      {
        include_key: "Producție cântec original",
        include_order: 2
      },
      {
        include_key: "Înregistrare vocală profesională",
        include_order: 3
      },
      {
        include_key: "Video clip muzical profesional",
        include_order: 4
      },
      {
        include_key: "Distribuție pe toate platformele",
        include_order: 5
      },
      {
        include_key: "Contract 50/50",
        include_order: 6
      },
      {
        include_key: "Marketing profesional",
        include_order: 7
      }
    ],
    steps: [
      {
        step_number: 1,
        title_key: "Alege pachetul",
        step_order: 1,
        fields: []
      },
      {
        step_number: 2,
        title_key: "Profilul artistic",
        step_order: 2,
        fields: [
          {
            field_name: "artistName",
            field_type: "text",
            placeholder_key: "Numele de scenă dorit",
            required: true,
            field_order: 1,
            validations: [],
            dependencies: []
          },
          {
            field_name: "musicalExperience",
            field_type: "select",
            placeholder_key: "Experiența muzicală",
            required: true,
            field_order: 2,
            options: [
              { value: "beginner", label_key: "Începător" },
              { value: "intermediate", label_key: "Intermediar" },
              { value: "advanced", label_key: "Avansat" },
              { value: "professional", label_key: "Profesionist" }
            ],
            validations: [],
            dependencies: []
          },
          {
            field_name: "preferredGenre",
            field_type: "select",
            placeholder_key: "Genul muzical preferat",
            required: true,
            field_order: 3,
            options: [
              { value: "pop", label_key: "Pop" },
              { value: "rock", label_key: "Rock" },
              { value: "hip-hop", label_key: "Hip-Hop" },
              { value: "electronic", label_key: "Electronic" },
              { value: "folk", label_key: "Folk" },
              { value: "jazz", label_key: "Jazz" }
            ],
            validations: [],
            dependencies: []
          },
          {
            field_name: "artisticVision",
            field_type: "textarea",
            placeholder_key: "Viziunea ta artistică și ce vrei să transmiți prin muzică",
            required: true,
            field_order: 4,
            validations: [],
            dependencies: []
          },
          {
            field_name: "careerGoals",
            field_type: "textarea",
            placeholder_key: "Obiectivele tale de carieră muzicală",
            required: true,
            field_order: 5,
            validations: [],
            dependencies: []
          }
        ]
      }
    ],
    addons: []
  },
  {
    id: "instrumental-package-id",
    value: "instrumental",
    label_key: "instrumentalPackage",
    price: 500,
    tagline_key: "Instrumental personalizat pentru proiectele tale",
    description_key: "Perfecte pentru podcasturi, videoclipuri, prezentări sau orice proiect care necesită muzică de fundal",
    delivery_time_key: "5-7 zile",
    tags: [],
    includes: [
      {
        include_key: "Instrumental personalizat",
        include_order: 1
      },
      {
        include_key: "Producție audio profesională",
        include_order: 2
      },
      {
        include_key: "Mix & Master final",
        include_order: 3
      },
      {
        include_key: "Fișiere audio multiple",
        include_order: 4
      },
      {
        include_key: "Stems separate pentru editare",
        include_order: 5
      }
    ],
    steps: [
      {
        step_number: 1,
        title_key: "Alege pachetul",
        step_order: 1,
        fields: []
      },
      {
        step_number: 2,
        title_key: "Specificații instrumental",
        step_order: 2,
        fields: [
          {
            field_name: "projectType",
            field_type: "select",
            placeholder_key: "Tipul proiectului",
            required: true,
            field_order: 1,
            options: [
              { value: "podcast", label_key: "Podcast" },
              { value: "video", label_key: "Video/Film" },
              { value: "presentation", label_key: "Prezentare" },
              { value: "game", label_key: "Joc" },
              { value: "commercial", label_key: "Reclamă" },
              { value: "other", label_key: "Altul" }
            ],
            validations: [],
            dependencies: []
          },
          {
            field_name: "musicGenre",
            field_type: "select",
            placeholder_key: "Genul muzical",
            required: true,
            field_order: 2,
            options: [
              { value: "ambient", label_key: "Ambient" },
              { value: "electronic", label_key: "Electronic" },
              { value: "acoustic", label_key: "Acustic" },
              { value: "cinematic", label_key: "Cinematic" },
              { value: "upbeat", label_key: "Energic" },
              { value: "relaxing", label_key: "Relaxant" }
            ],
            validations: [],
            dependencies: []
          },
          {
            field_name: "mood",
            field_type: "select",
            placeholder_key: "Atmosfera dorită",
            required: true,
            field_order: 3,
            options: [
              { value: "energetic", label_key: "Energic" },
              { value: "calm", label_key: "Calm" },
              { value: "mysterious", label_key: "Misterios" },
              { value: "uplifting", label_key: "Optimist" },
              { value: "dramatic", label_key: "Dramatic" },
              { value: "playful", label_key: "Jucăuș" }
            ],
            validations: [],
            dependencies: []
          },
          {
            field_name: "duration",
            field_type: "select",
            placeholder_key: "Durata dorită",
            required: true,
            field_order: 4,
            options: [
              { value: "30s", label_key: "30 secunde" },
              { value: "1min", label_key: "1 minut" },
              { value: "2min", label_key: "2 minute" },
              { value: "3min", label_key: "3 minute" },
              { value: "custom", label_key: "Durată personalizată" }
            ],
            validations: [],
            dependencies: []
          },
          {
            field_name: "additionalNotes",
            field_type: "textarea",
            placeholder_key: "Note adiționale și detalii specifice",
            required: false,
            field_order: 5,
            validations: [],
            dependencies: []
          }
        ]
      }
    ],
    addons: []
  },
  {
    id: "remix-package-id",
    value: "remix",
    label_key: "remixPackage",
    price: 500,
    tagline_key: "Dă o nouă viață cântecului tău preferat",
    description_key: "Transformă orice cântec într-o versiune unică și personalizată",
    delivery_time_key: "5-7 zile",
    tags: [],
    includes: [
      {
        include_key: "Remix profesional",
        include_order: 1
      },
      {
        include_key: "Producție în stilul dorit",
        include_order: 2
      },
      {
        include_key: "Mix & Master final",
        include_order: 3
      },
      {
        include_key: "Versiune extinsă și radio edit",
        include_order: 4
      },
      {
        include_key: "Fișiere audio de înaltă calitate",
        include_order: 5
      }
    ],
    steps: [
      {
        step_number: 1,
        title_key: "Alege pachetul",
        step_order: 1,
        fields: []
      },
      {
        step_number: 2,
        title_key: "Detalii remix",
        step_order: 2,
        fields: [
          {
            field_name: "originalSong",
            field_type: "text",
            placeholder_key: "Numele cântecului original și artistul",
            required: true,
            field_order: 1,
            validations: [],
            dependencies: []
          },
          {
            field_name: "remixStyle",
            field_type: "select",
            placeholder_key: "Stilul remix-ului dorit",
            required: true,
            field_order: 2,
            options: [
              { value: "electronic", label_key: "Electronic/EDM" },
              { value: "acoustic", label_key: "Acustic" },
              { value: "hip-hop", label_key: "Hip-Hop" },
              { value: "rock", label_key: "Rock" },
              { value: "reggae", label_key: "Reggae" },
              { value: "jazz", label_key: "Jazz" }
            ],
            validations: [],
            dependencies: []
          },
          {
            field_name: "tempo",
            field_type: "select",
            placeholder_key: "Tempoul dorit",
            required: true,
            field_order: 3,
            options: [
              { value: "slower", label_key: "Mai lent" },
              { value: "same", label_key: "Același tempo" },
              { value: "faster", label_key: "Mai rapid" },
              { value: "variable", label_key: "Tempo variabil" }
            ],
            validations: [],
            dependencies: []
          },
          {
            field_name: "specialRequests",
            field_type: "textarea",
            placeholder_key: "Cerințe speciale și viziunea ta pentru remix",
            required: false,
            field_order: 4,
            validations: [],
            dependencies: []
          }
        ]
      }
    ],
    addons: []
  },
  {
    id: "gift-package-id",
    value: "gift",
    label_key: "giftPackage",
    price: 0,
    tagline_key: "Oferă cadoul muzicii personalizate",
    description_key: "Cumpără orice pachet ca și cadou pentru cineva special",
    delivery_time_key: "Variabil",
    tags: [
      {
        tag_type: "special",
        tag_label_key: "Cadou",
        styling_class: "bg-pink-100 text-pink-800"
      }
    ],
    includes: [
      {
        include_key: "Card digital personalizat",
        include_order: 1
      },
      {
        include_key: "Mesaj personalizat",
        include_order: 2
      },
      {
        include_key: "Livrare automată",
        include_order: 3
      },
      {
        include_key: "Toate beneficiile pachetului selectat",
        include_order: 4
      }
    ],
    steps: [
      {
        step_number: 1,
        title_key: "Alege pachetul",
        step_order: 1,
        fields: []
      },
      {
        step_number: 2,
        title_key: "Pachetul cadou",
        step_order: 2,
        fields: [
          {
            field_name: "giftPackageType",
            field_type: "select",
            placeholder_key: "Alege pachetul pentru cadou",
            required: true,
            field_order: 1,
            options: [
              { value: "personal", label_key: "Pachet Personal" },
              { value: "business", label_key: "Pachet Business" },
              { value: "premium", label_key: "Pachet Premium" },
              { value: "artist", label_key: "Pachet Artist" },
              { value: "instrumental", label_key: "Pachet Instrumental" },
              { value: "remix", label_key: "Pachet Remix" }
            ],
            validations: [],
            dependencies: []
          },
          {
            field_name: "recipientName",
            field_type: "text",
            placeholder_key: "Numele destinatarului cadoului",
            required: true,
            field_order: 2,
            validations: [],
            dependencies: []
          },
          {
            field_name: "recipientEmail",
            field_type: "email",
            placeholder_key: "Email-ul destinatarului",
            required: true,
            field_order: 3,
            validations: [],
            dependencies: []
          },
          {
            field_name: "giftMessage",
            field_type: "textarea",
            placeholder_key: "Mesajul tău pentru destinatar",
            required: true,
            field_order: 4,
            validations: [],
            dependencies: []
          },
          {
            field_name: "deliveryDate",
            field_type: "date",
            placeholder_key: "Data livrării (opțional)",
            required: false,
            field_order: 5,
            validations: [],
            dependencies: []
          }
        ]
      }
    ],
    addons: []
  }
];

export const languages = [
  { value: 'ro', labelKey: 'romanian', flag: '🇷🇴' },
  { value: 'en', labelKey: 'english', flag: '🇺🇸' },
  { value: 'fr', labelKey: 'french', flag: '🇫🇷' },
  { value: 'de', labelKey: 'german', flag: '🇩🇪' },
  { value: 'pl', labelKey: 'polish', flag: '🇵🇱' },
];

export const addons = {
  rushDelivery: { labelKey: 'rushDelivery', price: 100 },
  commercialRights: { labelKey: 'commercialRights', price: 100 },
  distributionMangoRecords: { labelKey: 'distributionMangoRecords', price: 200 },
  customVideo: { labelKey: 'customVideo', price: 149 },
  audioMessageFromSender: { labelKey: 'audioMessageFromSender', price: 100 },
  extendedSong: { labelKey: 'extendedSong', price: 49 },
};
