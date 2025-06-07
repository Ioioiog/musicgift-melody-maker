
export interface StepContent {
  id: number;
  title: string;
  description: string;
  details: {
    intro: string;
    listTitle: string;
    listItems: string[];
    footer: string;
  };
  styling: {
    color: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
  };
}

export const stepContentData: StepContent[] = [
  {
    id: 1,
    title: "Choose Your Package",
    description: "Every special song begins with the right foundation. Explore our selection of carefully designed packages and choose the one that best matches your occasion, sentiment, and budget — whether it's a heartfelt birthday tribute, a romantic surprise, a wedding anthem, or a unique gift just because.",
    details: {
      intro: "Every special song begins with the right foundation. Explore our selection of carefully designed packages and choose the one that best matches your occasion, sentiment, and budget — whether it's a heartfelt birthday tribute, a romantic surprise, a wedding anthem, or a unique gift just because.",
      listTitle: "Every package includes:",
      listItems: [
        "Professionally produced music with rich instrumentation",
        "Custom lyrics inspired by your story",
        "High-quality audio files delivered in MP3 and WAV formats",
        "A beautifully designed visual cover to accompany your song"
      ],
      footer: "Not sure which one to pick? We'll guide you."
    },
    styling: {
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-400",
      textColor: "text-blue-800"
    }
  },
  {
    id: 2,
    title: "Share Your Story",
    description: "This is your moment to open up. Your song will be shaped by the story you tell us — the moments that moved you, the people who matter, and the memories you want to preserve through music.",
    details: {
      intro: "This is your moment to open up. Your song will be shaped by the story you tell us — the moments that moved you, the people who matter, and the memories you want to preserve through music.",
      listTitle: "You can include:",
      listItems: [
        "Memorable events, personal milestones, and heartfelt memories",
        "Names, dates, and personal details that bring your story to life",
        "The mood and musical style you prefer (calm, joyful, dramatic, etc.)",
        "Optional voice recordings or photos to spark creative inspiration"
      ],
      footer: "The more you share, the more meaningful the final song will be."
    },
    styling: {
      color: "text-green-600",
      bgColor: "bg-green-100",
      borderColor: "border-green-400",
      textColor: "text-green-800"
    }
  },
  {
    id: 3,
    title: "We Create the Music",
    description: "Once we receive your story, our team gets to work crafting a song that captures its essence. From songwriting to arrangement to performance, we handle every step with care and creativity.",
    details: {
      intro: "Once we receive your story, our team gets to work crafting a song that captures its essence. From songwriting to arrangement to performance, we handle every step with care and creativity.",
      listTitle: "Here's how it comes together:",
      listItems: [
        "Your story is transformed into original lyrics",
        "The melody is composed and arranged to match the mood",
        "Talented vocalists record the performance",
        "Audio is professionally mixed and mastered for a polished result"
      ],
      footer: "The result is a one-of-a-kind song made just for you."
    },
    styling: {
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      borderColor: "border-purple-400",
      textColor: "text-purple-800"
    }
  },
  {
    id: 4,
    title: "Receive Your Musical Gift",
    description: "In 3 to 7 business days, your personalized song will be delivered directly to your inbox. You'll receive everything you need to enjoy it, share it, or gift it to someone special.",
    details: {
      intro: "In 3 to 7 business days, your personalized song will be delivered directly to your inbox. You'll receive everything you need to enjoy it, share it, or gift it to someone special.",
      listTitle: "You'll receive:",
      listItems: [
        "Your custom song in MP3 and WAV formats",
        "A visual cover designed to match the theme of your track",
        "Optionally, a video version or social-media-ready formats",
        "A secure link to download your files, available for 6 months"
      ],
      footer: "Your music is ready to be enjoyed — again and again."
    },
    styling: {
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      borderColor: "border-orange-400",
      textColor: "text-orange-800"
    }
  }
];
