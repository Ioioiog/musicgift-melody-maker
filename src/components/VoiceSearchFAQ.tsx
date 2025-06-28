
import React from 'react';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, Volume2, Search } from 'lucide-react';

const VoiceSearchFAQ: React.FC = () => {
  const { t } = useLanguage();

  const voiceSearchFAQs = [
    {
      question: "Cum pot să comand o melodie personalizată?",
      answer: "Pentru a comanda o melodie personalizată, accesați pagina de comenzi, alegeți pachetul dorit, completați formularul cu povestea dumneavoastră și efectuați plata. Procesul durează doar 5 minute și veți primi melodia în 3-5 zile lucrătoare.",
      category: "ordering"
    },
    {
      question: "Cât costă să fac o melodie pentru nuntă?",
      answer: "Pachetul de nuntă costă 899 RON și include o melodie personalizată profesională, înregistrare vocală de calitate studio, o revizuire gratuită și livrare în format digital de înaltă calitate. Este cadoul perfect pentru cuplurile care își doresc ceva cu adevărat special.",
      category: "pricing"
    },
    {
      question: "În cât timp primesc cadoul muzical?",
      answer: "Cadoul dumneavoastră muzical va fi gata în 3-5 zile lucrătoare după confirmarea comenzii. Pentru pachetele mai complexe, timpul de livrare poate fi de până la 7 zile. Veți fi notificat prin email când melodia este gata pentru descărcare.",
      category: "delivery"
    },
    {
      question: "Care sunt cele mai bune cadouri muzicale pentru aniversări?",
      answer: "Pentru aniversări recomandăm Pachetul Personal (399 RON) sau Pachetul Premium (599 RON). Acestea includ melodii personalizate cu versuri care spun povestea persoanei sărbătorite, fiind cadouri emoționante și de neuitat.",
      category: "gifts"
    },
    {
      question: "Unde pot să găsesc servicii de compoziții muzicale în România?",
      answer: "MusicGift.ro oferă servicii profesionale de compoziții muzicale personalizate în toată România. Avem peste 20 de ani de experiență și am creat peste 2000 de melodii personalizate pentru clienți din București, Cluj-Napoca, Timișoara, Iași și din întreaga țară.",
      category: "location"
    },
    {
      question: "Cum să fac un cadou muzical pentru soțul meu?",
      answer: "Pentru soțul dumneavoastră, alegeți Pachetul Personal sau Premium și povestiți-ne despre momentele speciale pe care le-ați trăit împreună. Vom crea o melodie care să capteze esența relației voastre și să devină coloana sonoră a poveștii voastre de dragoste.",
      category: "relationship"
    },
    {
      question: "Pot să aleg stilul muzical pentru melodia mea?",
      answer: "Da, puteți alege din diverse stiluri muzicale: pop, rock, folk, jazz, clasic, hip-hop, country și multe altele. În formularul de comandă, specificați stilul preferat și compozitorii noștri vor crea melodia în genul muzical dorit.",
      category: "customization"
    },
    {
      question: "Ce servicii de înregistrări oferă MusicGift.ro?",
      answer: "Oferim servicii complete de înregistrări profesionale: compoziții personalizate, înregistrări vocale și instrumentale, mixaj și mastering professional, producție muzicală completă și consultanță artistică. Toate serviciile sunt realizate în studio-uri de înaltă calitate.",
      category: "services"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Volume2 className="w-8 h-8 text-blue-600" />
            <MessageCircle className="w-8 h-8 text-purple-600" />
            <Search className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Întrebări Frecvente despre Cadourile Muzicale
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Găsiți răspunsuri rapide la întrebările despre serviciile noastre de compoziții muzicale personalizate
          </p>
        </motion.div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              Răspunsuri la Întrebările Dumneavoastră
            </CardTitle>
            <CardDescription>
              Optimizat pentru căutări vocale - întrebați asistentul vocal preferat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {voiceSearchFAQs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left hover:text-blue-600 transition-colors">
                    <span className="font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-2 pb-4 text-gray-700 leading-relaxed">
                      {faq.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Voice Search Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Volume2 className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Căutare Vocală</span>
              </div>
              <p className="text-sm text-gray-600">
                Puteți întreba asistentul vocal: "OK Google, cât costă o melodie personalizată?" sau 
                "Alexa, unde pot comanda cadouri muzicale în România?"
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default VoiceSearchFAQ;
