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
      title: t('step1Title'),
      description: t('step1Description'),
      details: {
        intro: t('step1DetailsIntro'),
        listTitle: t('step1DetailsTitle'),
        listItems: [t('step1Detail1'), t('step1Detail2'), t('step1Detail3'), t('step1Detail4')],
        footer: t('step1DetailsFooter')
      }
    },
    {
      emoji: '',
      title: t('step2Title'),
      description: t('step2Description'),
      details: {
        intro: t('step2DetailsIntro'),
        listTitle: t('step2DetailsTitle'),
        listItems: [t('step2Detail1'), t('step2Detail2'), t('step2Detail3'), t('step2Detail4')],
        footer: t('step2DetailsFooter')
      }
    },
    {
      emoji: '',
      title: t('step3Title'),
      description: t('step3Description'),
      details: {
        intro: t('step3DetailsIntro'),
        listTitle: t('step3DetailsTitle'),
        listItems: [t('step3Detail1'), t('step3Detail2'), t('step3Detail3'), t('step3Detail4')],
        footer: t('step3DetailsFooter')
      }
    },
    {
      emoji: '',
      title: t('step4Title'),
      description: t('step4Description'),
      details: {
        intro: t('step4DetailsIntro'),
        listTitle: t('step4DetailsTitle'),
        listItems: [t('step4Detail1'), t('step4Detail2'), t('step4Detail3'), t('step4Detail4')],
        footer: t('step4DetailsFooter')
      }
    }
  ];

  // Auto-progression effect - 30 seconds per step with progress tracking
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 100 / 300; // 30 seconds = 300 intervals of 100ms
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
                  className={`relative z-10 transition-all duration-300 ${isActive ? 'w-10 h-10' : 'w-8 h-8'}`} 
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
              className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:shadow-xl transition-all duration-300 rounded-lg p-8 relative overflow-hidden"
            >
              {/* Large background icon */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-5 pointer-events-none">
                {React.createElement(stepIcons[activeStep], { 
                  className: "w-48 h-48", 
                  strokeWidth: 1 
                })}
              </div>

              {/* Header with step info */}
              <div className="mb-6 relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-lg">
                    {React.createElement(stepIcons[activeStep], { 
                      className: "w-6 h-6", 
                      strokeWidth: 2 
                    })}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-purple-300 mb-1">
                      {steps[activeStep].title}
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {steps[activeStep].description}
                    </h3>
                  </div>
                </div>
                
                <p className="text-white/80 text-lg leading-relaxed">
                  {steps[activeStep].details.intro}
                </p>
              </div>

              {/* Details List */}
              <div className="mb-6 relative z-10">
                <h4 className="text-lg font-semibold text-white mb-4">
                  {steps[activeStep].details.listTitle}
                </h4>
                <ul className="space-y-3">
                  {steps[activeStep].details.listItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-300 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-white/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer Note */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 relative z-10 border border-white/10">
                <p className="text-sm text-white/80 italic">
                  {steps[activeStep].details.footer}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AnimatedStepFlow;
