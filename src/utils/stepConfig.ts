
export const getStepsForPackage = (selectedPackage: string) => {
  const stepTitles = {
    1: "Package",
    2: "Details", 
    3: "Story",
    4: "Preferences",
    5: "Contact"
  };

  const commonSteps = [
    {
      step: 1,
      title: stepTitles[1],
      fields: [
        { name: "package", type: "select", placeholder: "Alege un pachet", required: true }
      ]
    },
    {
      step: 2,
      title: stepTitles[2],
      fields: [
        { name: "fullName", type: "text", placeholder: "Nume complet", required: true },
        { name: "email", type: "email", placeholder: "Email", required: true },
        { name: "phone", type: "tel", placeholder: "Telefon", required: true },
        { name: "language", type: "select", placeholder: "Limba piesei", required: true }
      ]
    }
  ];

  const packageSpecificSteps: any = {
    personal: [
      {
        step: 3,
        title: stepTitles[3],
        fields: [
          { name: "recipientName", type: "text", placeholder: "Recipient's Name", required: true },
          { name: "occasion", type: "select", placeholder: "Occasion", required: true, options: ["Birthday", "Anniversary", "Wedding", "Valentine's Day", "Graduation", "Other"] },
          { name: "story", type: "textarea", placeholder: "Tell us your story...", required: true }
        ]
      },
      {
        step: 4,
        title: stepTitles[4],
        fields: [
          { name: "addons", type: "checkbox-group", options: ["rushDelivery", "commercialRights", "distributieMangoRecords", "customVideo", "audioMessageFromSender", "extendedSong"] }
        ]
      },
      {
        step: 5,
        title: stepTitles[5],
        fields: [
          { name: "acceptMention", type: "checkbox", placeholder: "Accept să menționez MusicGift.ro by Mango Records dacă public melodia", required: true }
        ]
      }
    ]
  };

  return [...commonSteps, ...(packageSpecificSteps[selectedPackage] || [])];
};
