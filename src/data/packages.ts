
export const packages = [
  { 
    value: 'personal', 
    label: 'Pachet Personal',
    price: 300,
    details: {
      price: '300 RON',
      deliveryTime: '7-10 zile',
      includes: [
        'Melodie personalizată compusă special pentru tine',
        'Producție audio profesională',
        'Voce înregistrată de artist profesionist',
        'Mix și master final',
        'Fișier audio de înaltă calitate (WAV + MP3)'
      ]
    }
  },
  { 
    value: 'business', 
    label: 'Pachet Business',
    price: 500,
    details: {
      price: '500 RON',
      deliveryTime: '5-7 zile',
      includes: [
        'Melodie comercială pentru brand/companie',
        'Producție audio profesională',
        'Voce înregistrată de artist profesionist',
        'Mix și master final',
        'Drepturi comerciale de bază incluse',
        'Fișiere audio multiple (WAV, MP3, instrumental)'
      ]
    }
  },
  { 
    value: 'premium', 
    label: 'Premium Package',
    price: 1000,
    details: {
      price: '1000 RON',
      deliveryTime: '7-10 zile',
      includes: [
        'Melodie premium cu producție avansată',
        'Distribuție automată pe platforme digitale',
        'Videoclip lyric inclus',
        'Mix și master profesional',
        'Promovare pe rețelele sociale Mango Records'
      ]
    }
  },
  { 
    value: 'artist', 
    label: 'Pachet Artist',
    price: 8000,
    details: {
      price: '8000 RON',
      deliveryTime: '14-21 zile',
      includes: [
        'Colaborare artistică completă',
        'Producția unei melodii originale',
        'Înregistrare vocală profesională',
        'Videoclip muzical profesional',
        'Distribuție pe toate platformele',
        'Contract 50/50 cu Mango Records',
        'Promovare și marketing profesional'
      ]
    }
  },
  { 
    value: 'instrumental', 
    label: 'Pachet Instrumental',
    price: 500,
    details: {
      price: '500 RON',
      deliveryTime: '5-7 zile',
      includes: [
        'Instrumental personalizat în genul dorit',
        'Producție audio profesională',
        'Mix și master final',
        'Fișiere audio multiple (WAV, MP3)',
        'Stems separate pentru mixing'
      ]
    }
  },
  { 
    value: 'remix', 
    label: 'Pachet Remix',
    price: 500,
    details: {
      price: '500 RON',
      deliveryTime: '5-7 zile',
      includes: [
        'Remix profesional al piesei tale',
        'Producție în stilul dorit',
        'Mix și master final',
        'Versiune extended și radio edit',
        'Fișiere audio de înaltă calitate'
      ]
    }
  },
  { 
    value: 'gift', 
    label: 'Pachet Cadou',
    price: 0,
    details: {
      price: 'Variabil',
      deliveryTime: 'Conform pachetului ales',
      includes: [
        'Card cadou digital personalizat',
        'Mesaj personalizat pentru destinatar',
        'Trimitere automată la data dorită',
        'Toate beneficiile pachetului selectat'
      ]
    }
  },
];

export const languages = [
  { value: 'ro', label: 'Română' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'pl', label: 'Polski' },
];

export const addons = {
  rushDelivery: { label: 'Livrare rapidă (24–48h)', price: 100 },
  commercialRights: { label: 'Drepturi comerciale', price: 100 },
  distributieMangoRecords: { label: 'Distribuție Mango Records', price: 200 },
  customVideo: { label: 'Videoclip personalizat', price: 149 },
  audioMessageFromSender: { label: 'Mesaj audio de la expeditor', price: 100 },
  commercialRightsUpgrade: { label: 'Upgrade drepturi comerciale', price: 400 },
  extendedSong: { label: 'Melodie extinsă (3 strofe)', price: 49 },
};
