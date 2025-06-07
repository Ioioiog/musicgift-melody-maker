
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, MessageSquare, Music, Gift, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { stepContentData } from '@/data/stepContent';
import { Button } from '@/components/ui/button';

interface Step {
  icon: React.ComponentType<any>;
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

  const stepIcons = [ShoppingCart, MessageSquare, Music, Gift];
  
  const steps: Step[] = stepContentData.map((stepContent, index) => ({
    icon: stepIcons[index],
    title: stepContent.getTitle(t),
    description: stepContent.getDescription(t),
    details: stepContent.getDetails(t)
  }));

  // Auto-progression effect - 8 seconds per step
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [steps.length]);

  const handleStepClick = (index: number) => {
    setActiveStep(index);
  };

  const handlePrevious = () => {
    setActiveStep(prev => prev === 0 ? steps.length - 1 : prev - 1);
  };

  const handleNext = () => {
    setActiveStep(prev => (prev + 1) % steps.length);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 h-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full items-start">
        
        {/* Left Column - Simple Step Indicators */}
        <div className="lg:col-span-3">
          <div className="space-y-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === activeStep;
              
              return (
                <motion.div 
                  key={index}
                  onClick={() => handleStepClick(index)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                    isActive 
                      ? 'bg-white shadow-md border-l-4 border-purple-600' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Step Number Circle */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                    isActive 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  
                  {/* Step Title */}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${
                      isActive ? 'text-purple-700' : 'text-gray-700'
                    }`}>
                      {step.title}
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    {React.createElement(steps[activeStep].icon, {
                      className: "w-6 h-6 text-purple-600"
                    })}
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
