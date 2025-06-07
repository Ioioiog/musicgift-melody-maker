
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { stepContentData } from '@/data/stepContent';
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

  const stepEmojis = ['🛒', '📝', '🎙️', '🎁'];
  
  const steps: Step[] = stepContentData.map((stepContent, index) => ({
    emoji: stepEmojis[index],
    title: stepContent.getTitle(t),
    description: stepContent.getDescription(t),
    details: stepContent.getDetails(t)
  }));

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
      <div className="flex flex-col lg:flex-row items-start gap-8 p-8">
        
        {/* Step Circles */}
        <div className="flex lg:flex-col gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              onClick={() => handleStepClick(idx)}
              className={`cursor-pointer w-24 h-24 rounded-full flex items-center justify-center text-xl font-bold shadow-lg transition-all duration-300 
                ${activeStep === idx ? 'bg-purple-600 text-white scale-105' : 'bg-white text-gray-700'}`}
            >
              <span>{step.emoji}</span>
            </div>
          ))}
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
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
            >
              {/* Header with Emoji Icon */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-lg text-2xl">
                    {steps[activeStep].emoji}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-purple-600 mb-1">
                      {t('step')} {activeStep + 1}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {steps[activeStep].title}
                    </h3>
                  </div>
                </div>
                
                <p className="text-gray-600 text-lg leading-relaxed">
                  {steps[activeStep].description}
                </p>
              </div>

              {/* Details List */}
              <div className="mb-6">
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
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 italic">
                  {steps[activeStep].details.footer}
                </p>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
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
