
export const packages = [
  { 
    value: 'personal', 
    label: 'Pachet Personal',
    price: 300,
    tagline: 'Un cântec scris cu suflet – doar pentru tine și cei dragi.',
    description: 'Ideal pentru aniversări, nunți sau ocazii speciale – transformăm povestea ta într-un cadou muzical unic și emoționant.',
    details: {
      price: '300 RON',
      deliveryTime: '3-5 zile',
      includes: [
        'Cântec original creat după povestea ta',
        'Voce profesionistă din echipa MusicGift',
        'Livrare rapidă în 3–5 zile',
        'Drepturi de utilizare personală (non-comercial)',
        'Consultare creativă bazată pe poveste și preferințe muzicale'
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
  { value: 'ro', label: 'Română', flag: '🇷🇴' },
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { value: 'pl', label: 'Polski', flag: '🇵🇱' },
];

export const relationships = [
  { value: 'partner', label: 'Partener/Soție/Soț' },
  { value: 'child', label: 'Copil' },
  { value: 'parent', label: 'Părinte' },
  { value: 'sibling', label: 'Frate/Soră' },
  { value: 'friend', label: 'Prieten(ă)' },
  { value: 'grandparent', label: 'Bunic/Bunică' },
  { value: 'other', label: 'Altă relație' }
];

export const occasions = [
  { value: 'birthday', label: 'Zi de naștere', emoji: '🎂' },
  { value: 'wedding', label: 'Nuntă', emoji: '💒' },
  { value: 'anniversary', label: 'Aniversare', emoji: '💕' },
  { value: 'valentine', label: 'Ziua Îndrăgostiților', emoji: '💝' },
  { value: 'graduation', label: 'Absolvire', emoji: '🎓' },
  { value: 'christmas', label: 'Crăciun', emoji: '🎄' },
  { value: 'other', label: 'Altă ocazie', emoji: '🎉' }
];

export const emotionalTones = [
  { value: 'romantic', label: 'Romantic' },
  { value: 'happy', label: 'Vesel/Bucuros' },
  { value: 'nostalgic', label: 'Nostalgic' },
  { value: 'emotional', label: 'Emoționant' },
  { value: 'energetic', label: 'Energic' },
  { value: 'peaceful', label: 'Liniștit/Calm' }
];

export const musicStyles = [
  { value: 'pop', label: 'Pop' },
  { value: 'acoustic', label: 'Acustic' },
  { value: 'rock', label: 'Rock' },
  { value: 'jazz', label: 'Jazz' },
  { value: 'folk', label: 'Folk' },
  { value: 'electronic', label: 'Electronic' },
  { value: 'classical', label: 'Clasic' },
  { value: 'reggae', label: 'Reggae' },
  { value: 'country', label: 'Country' }
];

export const addons = {
  rushDelivery: { label: 'Livrare prioritară în 24–48h', price: 100 },
  commercialRights: { label: 'Drepturi comerciale pentru YouTube, Spotify etc.', price: 100 },
  distributieMangoRecords: { label: 'Distribuție oficială prin Mango Records', price: 200 },
  customVideo: { label: 'Videoclip personalizat cu pozele tale', price: 149 },
  audioMessageFromSender: { label: 'Mesaj audio personalizat încorporat în piesă', price: 100 },
  extendedSong: { label: 'Melodie extinsă cu 3 strofe în loc de 2', price: 49 },
};
