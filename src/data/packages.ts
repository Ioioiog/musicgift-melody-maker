import { z } from 'zod';

export const textFieldSchema = z.object({
  id: z.string(),
  type: z.literal('text'),
  label: z.string(),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  validation: z.object({
      minLength: z.number().optional(),
      maxLength: z.number().optional(),
      pattern: z.string().optional(),
      message: z.string().optional()
  }).optional()
});

export const textareaFieldSchema = z.object({
  id: z.string(),
  type: z.literal('textarea'),
  label: z.string(),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  validation: z.object({
      minLength: z.number().optional(),
      maxLength: z.number().optional(),
      pattern: z.string().optional(),
      message: z.string().optional()
  }).optional()
});

export const numberFieldSchema = z.object({
  id: z.string(),
  type: z.literal('number'),
  label: z.string(),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  validation: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
      message: z.string().optional()
  }).optional()
});

export const dateFieldSchema = z.object({
  id: z.string(),
  type: z.literal('date'),
  label: z.string(),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  validation: z.object({
      min: z.string().optional(),
      max: z.string().optional(),
      message: z.string().optional()
  }).optional()
});

export const selectFieldSchema = z.object({
  id: z.string(),
  type: z.literal('select'),
  label: z.string(),
  required: z.boolean().optional(),
  options: z.array(z.object({
      value: z.string(),
      label: z.string()
  })),
  placeholder: z.string().optional()
});

export const radioFieldSchema = z.object({
  id: z.string(),
  type: z.literal('radio'),
  label: z.string(),
  required: z.boolean().optional(),
  options: z.array(z.object({
      value: z.string(),
      label: z.string()
  }))
});

export const checkboxFieldSchema = z.object({
  id: z.string(),
  type: z.literal('checkbox'),
  label: z.string(),
  required: z.boolean().optional(),
  text: z.string().optional()
});

const baseFieldSchema = z.discriminatedUnion("type", [
  textFieldSchema,
  textareaFieldSchema,
  numberFieldSchema,
  dateFieldSchema,
  selectFieldSchema,
  radioFieldSchema,
  checkboxFieldSchema
]);

export type BaseField = z.infer<typeof baseFieldSchema>;

export type PackageType = 'wedding' | 'baptism' | 'comingOfAge' | 'anniversary' | 'birthday' | 'custom';

export interface Package {
  id: string;
  type: PackageType;
  name: string;
  basePrice: {
    EUR: number;
    RON: number;
  };
  description: string;
  features: string[];
  isPopular?: boolean;
  steps: {
    id: string;
    title: string;
    description: string;
    fields: BaseField[];
  }[];
}

export const packages: Package[] = [
  // Custom Package
  {
    id: 'custom',
    type: 'custom',
    name: 'Custom',
    basePrice: { EUR: 100, RON: 500 },
    description: 'A unique song tailored to your specific needs',
    features: [
      'Fully personalized lyrics',
      'Professional composition',
      'High-quality recording',
      'Personal or commercial rights',
      'Express delivery available'
    ],
    steps: [
      {
        id: 'custom_step1',
        title: 'Your Information',
        description: 'Tell us about yourself',
        fields: [
          {
            id: 'firstName',
            type: 'text',
            label: 'FirstName',
            required: true,
            placeholder: 'Enter your first name'
          },
          {
            id: 'lastName',
            type: 'text',
            label: 'LastName',
            required: true,
            placeholder: 'Enter your last name'
          },
          {
            id: 'email',
            type: 'text',
            label: 'Email',
            required: true,
            placeholder: 'Enter your email address',
            validation: {
              pattern: '^\\S+@\\S+\\.\\S+$',
              message: 'Enter a valid email address'
            }
          }
        ]
      },
      {
        id: 'custom_step2',
        title: 'Song Details',
        description: 'Describe your custom song',
        fields: [
          {
            id: 'songTitle',
            type: 'text',
            label: 'SongTitle',
            required: true,
            placeholder: 'Enter a title for your song'
          },
          {
            id: 'songDescription',
            type: 'textarea',
            label: 'SongDescription',
            required: true,
            placeholder: 'Describe the song you want'
          },
          {
            id: 'useCase',
            type: 'select',
            label: 'UseCase',
            required: true,
            options: [
              { value: 'personal', label: 'useCasePersonal' },
              { value: 'commercial', label: 'useCaseCommercial' }
            ],
            placeholder: 'Select the use case'
          }
        ]
      }
    ]
  },

  // Wedding Package
  {
    id: 'wedding',
    type: 'wedding',
    name: 'Wedding',
    basePrice: { EUR: 150, RON: 750 },
    description: 'A romantic and elegant song for your special day',
    features: [
      'Professional composition',
      'High-quality recording',
      'Commercial rights included',
      'One free revision included',
      'Express delivery available'
    ],
    isPopular: true,
    steps: [
      {
        id: 'wedding_step1',
        title: 'Couple Information',
        description: 'Tell us about the couple',
        fields: [
          {
            id: 'groomFirstName',
            type: 'text',
            label: 'GroomFirstName',
            required: true,
            placeholder: 'Enter groom\'s first name'
          },
          {
            id: 'groomLastName',
            type: 'text',
            label: 'GroomLastName',
            required: true,
            placeholder: 'Enter groom\'s last name'
          },
          {
            id: 'brideFirstName',
            type: 'text',
            label: 'BrideFirstName',
            required: true,
            placeholder: 'Enter bride\'s first name'
          },
          {
            id: 'brideLastName',
            type: 'text',
            label: 'BrideLastName',
            required: true,
            placeholder: 'Enter bride\'s last name'
          }
        ]
      },
      {
        id: 'wedding_step2',
        title: 'Song Details',
        description: 'Customize your wedding song',
        fields: [
          {
            id: 'songTitle',
            type: 'text',
            label: 'SongTitle',
            required: true,
            placeholder: 'Enter a title for your wedding song'
          },
          {
            id: 'weddingDate',
            type: 'date',
            label: 'WeddingDate',
            required: true,
            placeholder: 'Select your wedding date'
          },
          {
            id: 'story',
            type: 'textarea',
            label: 'YourStory',
            required: true,
            placeholder: 'Share your love story'
          },
          {
            id: 'voicePreference',
            type: 'radio',
            label: 'Voice Preference',
            required: true,
            options: [
              { value: 'female', label: 'voiceFemale' },
              { value: 'male', label: 'voiceMale' },
              { value: 'duet', label: 'voiceDuet' }
            ]
          }
        ]
      },
      {
        id: 'wedding_step3',
        title: 'Contact Information',
        description: 'Enter your contact details',
        fields: [
          {
            id: 'firstName',
            type: 'text',
            label: 'FirstName',
            required: true,
            placeholder: 'Enter your first name'
          },
          {
            id: 'lastName',
            type: 'text',
            label: 'LastName',
            required: true,
            placeholder: 'Enter your last name'
          },
          {
            id: 'email',
            type: 'text',
            label: 'Email',
            required: true,
            placeholder: 'Enter your email address',
            validation: {
              pattern: '^\\S+@\\S+\\.\\S+$',
              message: 'Enter a valid email address'
            }
          }
        ]
      }
    ]
  },

  // Baptism Package
  {
    id: 'baptism',
    type: 'baptism',
    name: 'Baptism',
    basePrice: { EUR: 120, RON: 600 },
    description: 'A blessed song for your little angel',
    features: [
      'Gentle and soothing melody',
      'Professional composition',
      'High-quality recording',
      'Personal use rights',
      'Express delivery available'
    ],
    steps: [
      {
        id: 'baptism_step1',
        title: 'Baby Information',
        description: 'Tell us about the precious little one',
        fields: [
          {
            id: 'babyFirstName',
            type: 'text',
            label: 'BabyFirstName',
            required: true,
            placeholder: 'Enter baby\'s first name'
          },
          {
            id: 'babyMiddleName',
            type: 'text',
            label: 'BabyMiddleName',
            placeholder: 'Enter baby\'s middle name (optional)'
          },
          {
            id: 'babyLastName',
            type: 'text',
            label: 'BabyLastName',
            required: true,
            placeholder: 'Enter baby\'s last name'
          },
          {
            id: 'baptismDate',
            type: 'date',
            label: 'BaptismDate',
            required: true,
            placeholder: 'Select baptism date'
          }
        ]
      },
      {
        id: 'baptism_step2',
        title: 'Song Preferences',
        description: 'Customize your baptism song',
        fields: [
          {
            id: 'songTitle',
            type: 'text',
            label: 'SongTitle',
            required: true,
            placeholder: 'Enter a title for the baptism song'
          },
          {
            id: 'story',
            type: 'textarea',
            label: 'YourStory',
            required: true,
            placeholder: 'Share a story or wish for the baby'
          },
          {
            id: 'voicePreference',
            type: 'radio',
            label: 'Voice Preference',
            required: true,
            options: [
              { value: 'female', label: 'voiceFemale' },
              { value: 'male', label: 'voiceMale' },
              { value: 'duet', label: 'voiceDuet' }
            ]
          }
        ]
      },
      {
        id: 'baptism_step3',
        title: 'Contact Information',
        description: 'Enter your contact details',
        fields: [
          {
            id: 'firstName',
            type: 'text',
            label: 'FirstName',
            required: true,
            placeholder: 'Enter your first name'
          },
          {
            id: 'lastName',
            type: 'text',
            label: 'LastName',
            required: true,
            placeholder: 'Enter your last name'
          },
          {
            id: 'email',
            type: 'text',
            label: 'Email',
            required: true,
            placeholder: 'Enter your email address',
            validation: {
              pattern: '^\\S+@\\S+\\.\\S+$',
              message: 'Enter a valid email address'
            }
          }
        ]
      }
    ]
  },

  // Coming of Age Package
  {
    id: 'comingOfAge',
    type: 'comingOfAge',
    name: 'Coming of Age',
    basePrice: { EUR: 130, RON: 650 },
    description: 'Celebrate this important milestone with a special song',
    features: [
      'Age-appropriate lyrics',
      'Professional composition',
      'High-quality recording',
      'Personal use rights',
      'Express delivery available'
    ],
    steps: [
      {
        id: 'comingOfAge_step1',
        title: 'Celebrant Information',
        description: 'Tell us about the young person',
        fields: [
          {
            id: 'celebrantFirstName',
            type: 'text',
            label: 'CelebrantFirstName',
            required: true,
            placeholder: 'Enter celebrant\'s first name'
          },
          {
            id: 'celebrantLastName',
            type: 'text',
            label: 'CelebrantLastName',
            required: true,
            placeholder: 'Enter celebrant\'s last name'
          },
          {
            id: 'birthDate',
            type: 'date',
            label: 'BirthDate',
            required: true,
            placeholder: 'Select celebrant\'s birth date'
          }
        ]
      },
      {
        id: 'comingOfAge_step2',
        title: 'Song Details',
        description: 'Customize the coming of age song',
        fields: [
          {
            id: 'songTitle',
            type: 'text',
            label: 'SongTitle',
            required: true,
            placeholder: 'Enter a title for the song'
          },
          {
            id: 'story',
            type: 'textarea',
            label: 'YourStory',
            required: true,
            placeholder: 'Share a story or wish for the celebrant'
          },
          {
            id: 'voicePreference',
            type: 'radio',
            label: 'Voice Preference',
            required: true,
            options: [
              { value: 'female', label: 'voiceFemale' },
              { value: 'male', label: 'voiceMale' },
              { value: 'duet', label: 'voiceDuet' }
            ]
          }
        ]
      },
      {
        id: 'comingOfAge_step3',
        title: 'Contact Information',
        description: 'Enter your contact details',
        fields: [
          {
            id: 'firstName',
            type: 'text',
            label: 'FirstName',
            required: true,
            placeholder: 'Enter your first name'
          },
          {
            id: 'lastName',
            type: 'text',
            label: 'LastName',
            required: true,
            placeholder: 'Enter your last name'
          },
          {
            id: 'email',
            type: 'text',
            label: 'Email',
            required: true,
            placeholder: 'Enter your email address',
            validation: {
              pattern: '^\\S+@\\S+\\.\\S+$',
              message: 'Enter a valid email address'
            }
          }
        ]
      }
    ]
  },

  // Anniversary Package
  {
    id: 'anniversary',
    type: 'anniversary',
    name: 'Anniversary',
    basePrice: { EUR: 140, RON: 700 },
    description: 'A heartfelt song to celebrate years of love',
    features: [
      'Personalized lyrics',
      'Professional composition',
      'High-quality recording',
      'Personal use rights',
      'Express delivery available'
    ],
    steps: [
      {
        id: 'anniversary_step1',
        title: 'Couple Information',
        description: 'Tell us about the couple',
        fields: [
          {
            id: 'partner1FirstName',
            type: 'text',
            label: 'Partner1FirstName',
            required: true,
            placeholder: 'Enter first partner\'s first name'
          },
          {
            id: 'partner1LastName',
            type: 'text',
            label: 'Partner1LastName',
            required: true,
            placeholder: 'Enter first partner\'s last name'
          },
          {
            id: 'partner2FirstName',
            type: 'text',
            label: 'Partner2FirstName',
            required: true,
            placeholder: 'Enter second partner\'s first name'
          },
          {
            id: 'partner2LastName',
            type: 'text',
            label: 'Partner2LastName',
            required: true,
            placeholder: 'Enter second partner\'s last name'
          }
        ]
      },
      {
        id: 'anniversary_step2',
        title: 'Song Details',
        description: 'Customize your anniversary song',
        fields: [
          {
            id: 'songTitle',
            type: 'text',
            label: 'SongTitle',
            required: true,
            placeholder: 'Enter a title for your anniversary song'
          },
          {
            id: 'anniversaryDate',
            type: 'date',
            label: 'AnniversaryDate',
            required: true,
            placeholder: 'Select your anniversary date'
          },
          {
            id: 'yearsTogether',
            type: 'number',
            label: 'YearsTogether',
            required: true,
            placeholder: 'Enter the number of years together'
          },
          {
            id: 'story',
            type: 'textarea',
            label: 'YourStory',
            required: true,
            placeholder: 'Share your story as a couple'
          }
        ]
      },
      {
        id: 'anniversary_step3',
        title: 'Contact Information',
        description: 'Enter your contact details',
        fields: [
          {
            id: 'firstName',
            type: 'text',
            label: 'FirstName',
            required: true,
            placeholder: 'Enter your first name'
          },
          {
            id: 'lastName',
            type: 'text',
            label: 'LastName',
            required: true,
            placeholder: 'Enter your last name'
          },
          {
            id: 'email',
            type: 'text',
            label: 'Email',
            required: true,
            placeholder: 'Enter your email address',
            validation: {
              pattern: '^\\S+@\\S+\\.\\S+$',
              message: 'Enter a valid email address'
            }
          }
        ]
      }
    ]
  },

  // Birthday Package
  {
    id: 'birthday',
    type: 'birthday',
    name: 'Birthday',
    basePrice: { EUR: 110, RON: 550 },
    description: 'A joyful song to celebrate another year of life',
    features: [
      'Upbeat and cheerful melody',
      'Professional composition',
      'High-quality recording',
      'Personal use rights',
      'Express delivery available'
    ],
    steps: [
      {
        id: 'birthday_step1',
        title: 'Birthday Person Information',
        description: 'Tell us about the birthday person',
        fields: [
          {
            id: 'firstName',
            type: 'text',
            label: 'FirstName',
            required: true,
            placeholder: 'Enter birthday person\'s first name'
          },
          {
            id: 'lastName',
            type: 'text',
            label: 'LastName',
            required: true,
            placeholder: 'Enter birthday person\'s last name'
          },
          {
            id: 'birthDate',
            type: 'date',
            label: 'BirthDate',
            required: true,
            placeholder: 'Select birthday person\'s birth date'
          }
        ]
      },
      {
        id: 'birthday_step2',
        title: 'Song Details',
        description: 'Customize your birthday song',
        fields: [
          {
            id: 'songTitle',
            type: 'text',
            label: 'SongTitle',
            required: true,
            placeholder: 'Enter a title for the birthday song'
          },
          {
            id: 'story',
            type: 'textarea',
            label: 'YourStory',
            required: true,
            placeholder: 'Share a story or wish for the birthday person'
          }
        ]
      },
      {
        id: 'birthday_step3',
        title: 'Contact Information',
        description: 'Enter your contact details',
        fields: [
          {
            id: 'firstName',
            type: 'text',
            label: 'FirstName',
            required: true,
            placeholder: 'Enter your first name'
          },
          {
            id: 'lastName',
            type: 'text',
            label: 'LastName',
            required: true,
            placeholder: 'Enter your last name'
          },
          {
            id: 'email',
            type: 'text',
            label: 'Email',
            required: true,
            placeholder: 'Enter your email address',
            validation: {
              pattern: '^\\S+@\\S+\\.\\S+$',
              message: 'Enter a valid email address'
            }
          }
        ]
      }
    ]
  }
];
