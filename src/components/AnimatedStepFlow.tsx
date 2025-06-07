
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

  // Get circle classes for each step state
  const getCircleClasses = (stepIndex: number) => {
    const isActive = stepIndex === activeStep;
    const isPrevious = stepIndex < activeStep;
    
    if (isActive) {
      return "w-20 h-20 flex items-center justify-center rounded-full bg-purple-600 text-white shadow-xl text-xl font-semibold scale-105 transition-all duration-300 cursor-pointer";
    } else if (isPrevious) {
      return "w-20 h-20 flex items-center justify-center rounded-full bg-green-500 text-white shadow-lg text-xl font-semibold transition-all duration-300 cursor-pointer hover:scale-105";
    } else {
      return "w-20 h-20 flex items-center justify-center rounded-full bg-white shadow-md text-gray-700 text-xl font-semibold transition-all duration-300 cursor-pointer hover:scale-105";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 h-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full items-start">
        
        {/* Enhanced Left Column - Step Indicators */}
        <div className="lg:col-span-3">
          <div className="space-y-6">
            {/* Circular Step Indicators */}
            <div className="flex flex-col items-center space-y-8">
              {steps.map((step, index) => {
                const isActive = index === activeStep;
                
                return (
                  <div key={index} className="relative flex flex-col items-center">
                    {/* Connection Line */}
                    {index < steps.length - 1 && (
                      <div className="absolute top-20 w-0.5 h-8 bg-gradient-to-b from-gray-300 to-transparent z-0" />
                    )}
                    
                    {/* Circular Step */}
                    <motion.div
                      onClick={() => handleStepClick(index)}
                      className={getCircleClasses(index)}
                      whileHover={{ scale: isActive ? 1.05 : 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {step.emoji}
                      
                      {/* Active Step Pulse Effect */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-purple-400/30"
                          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </motion.div>
                    
                    {/* Step Number */}
                    <div className="mt-2 text-sm font-medium text-gray-500">
                      Step {index + 1}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress Header - moved after steps */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800">Process Flow</h3>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Step {activeStep + 1} of {steps.length} • Auto-advancing in {Math.ceil((100 - progress) * 0.3)}s
              </p>
            </div>

            {/* Quick Navigation */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/30">
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handlePrevious}
                  className="h-8 px-3 bg-white/50 hover:bg-white/80 border-purple-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex items-center gap-1">
                  {steps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleStepClick(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === activeStep 
                          ? 'bg-purple-600 w-6' 
                          : index < activeStep
                          ? 'bg-green-400'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleNext}
                  className="h-8 px-3 bg-white/50 hover:bg-white/80 border-purple-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Step Content */}
        <div className="lg:col-span-9">
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
