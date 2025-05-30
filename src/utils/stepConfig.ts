
export const getStepsForPackage = (selectedPackage: string) => {
  const stepTitles = {
    1: "Alege pachetul",
    2: "Detalii generale", 
    3: "Poveste și detalii emoționale",
    4: "Preferințe muzicale",
    5: "Confirmare"
  };

  const commonSteps = [
    {
      step: 1,
      title: stepTitles[1],
      fields: [
        { name: "package", type: "select", placeholder: "Alege un pachet", required: true }
      ]
    }
  ];

  const packageSpecificSteps: any = {
    personal: [
      {
        step: 2,
        title: stepTitles[2],
        fields: [
          { name: "recipientName", type: "text", placeholder: "Numele persoanei pentru care este melodia", required: true },
          { name: "relationship", type: "select", placeholder: "Relația ta cu această persoană", required: true },
          { name: "occasion", type: "select", placeholder: "Ocazie (zi de naștere, nuntă etc.)", required: true },
          { name: "eventDate", type: "date", placeholder: "Data evenimentului", required: false },
          { name: "songLanguage", type: "select", placeholder: "Limba în care vrei să fie scrisă piesa", required: true },
          { name: "pronunciationAudio_recipient", type: "file", placeholder: "Înregistrare audio (dacă numele are pronunție specială)", required: false }
        ]
      },
      {
        step: 3,
        title: stepTitles[3],
        fields: [
          { name: "story", type: "textarea", placeholder: "Povestea pe care vrei să o transformăm în cântec", required: true },
          { name: "emotionalTone", type: "select", placeholder: "Tonul piesei (romantic, vesel, nostalgic etc.)", required: true },
          { name: "keyMoments", type: "textarea", placeholder: "Momente esențiale din relația voastră", required: true },
          { name: "specialWords", type: "textarea", placeholder: "Cuvinte/expresii care ar trebui să apară", required: false },
          { name: "pronunciationAudio_keywords", type: "file", placeholder: "Înregistrare audio pentru cuvinte dificile", required: false }
        ]
      },
      {
        step: 4,
        title: stepTitles[4],
        fields: [
          { name: "musicStyle", type: "select", placeholder: "Ce stil muzical preferi", required: true },
          { name: "referenceSong", type: "url", placeholder: "Exemplu de piesă cu vibe similar", required: false },
          { name: "addons", type: "checkbox-group", options: ["rushDelivery", "commercialRights", "distributieMangoRecords", "customVideo", "audioMessageFromSender", "extendedSong"] }
        ]
      },
      {
        step: 5,
        title: stepTitles[5],
        fields: [
          { name: "fullName", type: "text", placeholder: "Numele tău complet", required: true },
          { name: "email", type: "email", placeholder: "Adresa ta de e-mail", required: true },
          { name: "phone", type: "tel", placeholder: "Număr de telefon (opțional)", required: false },
          { name: "acceptMentionObligation", type: "checkbox", placeholder: "Accept că dacă public piesa, trebuie să menționez \"MusicGift.ro by Mango Records\"", required: true }
        ]
      }
    ]
  };

  return [...commonSteps, ...(packageSpecificSteps[selectedPackage] || [])];
};
