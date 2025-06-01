
export const samplePackages = [
  {
    id: "44a53f92-860c-4cc3-a6e2-152ebd1931d5",
    value: "business",
    label_key: "Pachet Business",
    price: 500,
    tagline_key: "Dă-i brandului tău o voce memorabilă.",
    description_key: "Creat pentru companii care vor o piesă originală pentru branding, campanii sau reclame cu impact emoțional.",
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
          }
        ]
      }
    ],
    addons: []
  },
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
              { value: "friend", label_key: "Prieten/ă" }
            ],
            validations: [],
            dependencies: []
          },
          {
            field_name: "story",
            field_type: "textarea",
            placeholder_key: "Povestea voastră în câteva cuvinte",
            required: true,
            field_order: 3,
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
              { value: "electronic", label_key: "Electronic" }
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
          }
        ]
      }
    ],
    addons: []
  }
];
