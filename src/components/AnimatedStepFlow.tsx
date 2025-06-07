
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, ShoppingCart, FileText, Mic, Gift } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface Step {
  emoji: string;
  title: string;
  description: string;
  details: {
    intro: string;
    listTitle: string;
    listItems: string[];
    footer: string;
  };
}

const AnimatedStepFlow = () => {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // Modern lucide icons for each step
  const stepIcons = [ShoppingCart, FileText, Mic, Gift];
  
  const steps: Step[] = [
    {
      emoji: '',
      title: 'Pasul 1',
      description: 'Alege pachetul tău',
      details: {
        intro: 'Fiecare melodie specială începe cu o alegere cat mai potrivită. Explorează selecția noastră de pachete atent concepute și alege pe cel care se potrivește cel mai bine ocaziei, sentimentului și bugetului tău — fie că este un cadou pentru ziua de naștere, o surpriză romantică, un dar de nuntă sau melodia pe care sa dansați sau poate un cadou unic doar așa, pentru ca te-ai saturat sa duci un alt parfum la ziua cuiva!',
        listTitle: 'Fiecare pachet include:',
        listItems: [
          'Muzică produsă profesional, cu atentie, de o echipǎ cu experiențǎ in muzica',
          'Versuri personalizate inspirate din povestea ta',
          'Fișiere audio de înaltă calitate livrate în formatele MP3 și WAV sau Midi (Logic Pro)',
          'O copertă vizuală frumos concepută care să însoțească melodia ta'
        ],
        footer: 'Nu ești sigur pe care să îl alegi? Te vom ghida.'
      }
    },
    {
      emoji: '',
      title: 'Pasul 2',
      description: 'Împărtășește-ți povestea',
      details: {
        intro: 'Acesta este momentul tău să te deschizi. Melodia ta va fi modelată de povestea pe care ne-o spui — momentele care te-au mișcat, oamenii care contează și amintirile pe care vrei să le păstrezi prin muzică.',
        listTitle: 'Poți include:',
        listItems: [
          'Evenimente memorabile, repere personale și amintiri pline de suflet',
          'Nume, date și detalii personale care dau viață poveștii tale',
          'Starea de spirit și stilul muzical pe care îl preferi (calm, vesel, dramatic, etc.)',
          'Înregistrări vocale sau fotografii opționale pentru a aprinde inspirația creativă'
        ],
        footer: 'Cu cât împărtășești mai mult, cu atât melodia va fi mai personalǎ si mai de efect.'
      }
    },
    {
      emoji: '',
      title: 'Pasul 3',
      description: 'Noi creăm muzica',
      details: {
        intro: 'Odată ce primim povestea ta, echipa noastră se pune pe treabă să creeze o melodie care să îi surprindă esența. Nu-ti face griji, eşti pe mâna unor profesionişti, gestionăm fiecare pas cu grijă și creativitate.',
        listTitle: 'Iată cum se îmbină totul:',
        listItems: [
          'Povestea ta este transformată în versuri originale',
          'Melodia este compusă și aranjată pentru a se potrivi cu starea de spirit',
          'Adǎugǎm vocea si avem grijǎ ca interpretarea sa fie in armonie perfectǎ cu cerințele tale',
          'Sunetul este mixat și masterizat profesional pentru un rezultat lustruit'
        ],
        footer: 'Rezultatul este o melodie unică în felul ei, făcută special pentru tine.'
      }
    },
    {
      emoji: '',
      title: 'Pasul 4',
      description: 'Primește cadoul tău muzical',
      details: {
        intro: 'În 3 până la 7 zile lucrătoare, melodia ta personalizată va fi livrată direct în căsuța ta poștală. Vei primi tot ce ai nevoie pentru a te bucura de ea, să o împărtășești sau să o oferi cadou unei persoane speciale.',
        listTitle: 'Vei primi:',
        listItems: [
          'Melodia ta personalizată în formatul MP3 și WAV la cerere',
          'O copertă vizuală concepută să se potrivească cu tema piesei tale, dacǎ nu ne dai tu o pozǎ potrivitǎ sau preferatǎ',
          'Opțional, o versiune video sau formate pregătite pentru rețelele sociale',
          'Un link securizat pentru a descărca fișierele tale, disponibil timp de 6 luni'
        ],
        footer: 'Muzica ta este gata să fie savurată — din nou și din nou.'
      }
    }
  ];

  // Auto-progression effect - 30 seconds per step with progress tracking
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / 300); // 30 seconds = 300 intervals of 100ms
        if (newProgress >= 100) {
          return 0;
        }
        return newProgress;
      });
    }, 100);

    const stepInterval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length);
      setProgress(0);
    }, 30000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [steps.length]);

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    setProgress(0);
  };

  const handlePrevious = () => {
    setActiveStep(prev => prev === 0 ? steps.length - 1 : prev - 1);
    setProgress(0);
  };

  const handleNext = () => {
    setActiveStep(prev => (prev + 1) % steps.length);
    setProgress(0);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 h-full">
      <div className="flex flex-col lg:flex-row items-start gap-8 p-8 max-w-6xl mx-auto">
        
        {/* Modern Step Circles with Lucide Icons */}
        <div className="flex lg:flex-col gap-6">
          {steps.map((step, idx) => {
            const IconComponent = stepIcons[idx];
            const isActive = activeStep === idx;
            const isPrevious = idx < activeStep;
            
            return (
              <motion.div
                key={idx}
                onClick={() => handleStepClick(idx)}
                className={`cursor-pointer w-28 h-28 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 relative overflow-hidden group
                  ${isActive 
                    ? 'bg-gradient-to-br from-purple-500 to-purple-700 text-white scale-110 shadow-purple-300/50' 
                    : isPrevious
                    ? 'bg-gradient-to-br from-green-400 to-green-600 text-white scale-105 shadow-green-300/30'
                    : 'bg-white text-gray-600 hover:bg-gray-50 hover:scale-105 shadow-gray-200/50'
                  }`}
                whileHover={{ scale: isActive ? 1.15 : 1.1 }}
                whileTap={{ scale: isActive ? 1.05 : 1.0 }}
              >
                {/* Background gradient overlay */}
                <div className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
                  isActive ? 'bg-gradient-to-tr from-white/20 to-transparent opacity-100' : 'opacity-0'
                }`} />
                
                {/* Progress ring for active step */}
                {isActive && (
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="47"
                      fill="none"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="2"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="47"
                      fill="none"
                      stroke="rgba(255,255,255,0.8)"
                      strokeWidth="2"
                      strokeDasharray={`${2 * Math.PI * 47}`}
                      strokeDashoffset={`${2 * Math.PI * 47 * (1 - progress / 100)}`}
                      className="transition-all duration-100 ease-out"
                    />
                  </svg>
                )}
                
                {/* Check mark for completed steps */}
                {isPrevious && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
                
                {/* Icon */}
                <IconComponent 
                  className={`relative z-10 transition-all duration-300 ${
                    isActive ? 'w-10 h-10' : 'w-8 h-8'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Progress Header */}
        <div className="lg:hidden w-full mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-600">
              {t('step')} {activeStep + 1} of {steps.length}
            </span>
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="w-4 h-4" />
              <span className="text-xs">30s auto</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Right Column - Step Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 relative overflow-hidden"
            >
              {/* Large background icon */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-5 pointer-events-none">
                {React.createElement(stepIcons[activeStep], { 
                  className: "w-48 h-48", 
                  strokeWidth: 1 
                })}
              </div>

              {/* Header with smaller icon */}
              <div className="mb-6 relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-lg">
                    {React.createElement(stepIcons[activeStep], { className: "w-6 h-6", strokeWidth: 2 })}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-purple-600 mb-1">
                      {steps[activeStep].title}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {steps[activeStep].description}
                    </h3>
                  </div>
                </div>
                
                <p className="text-gray-600 text-lg leading-relaxed">
                  {steps[activeStep].details.intro}
                </p>
              </div>

              {/* Details List */}
              <div className="mb-6 relative z-10">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  {steps[activeStep].details.listTitle}
                </h4>
                <ul className="space-y-3">
                  {steps[activeStep].details.listItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer Note */}
              <div className="bg-gray-50 rounded-lg p-4 relative z-10">
                <p className="text-sm text-gray-600 italic">
                  {steps[activeStep].details.footer}
                </p>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 relative z-10">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === activeStep ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AnimatedStepFlow;
