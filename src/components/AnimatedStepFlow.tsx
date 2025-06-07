
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, MessageSquare, Music, Gift, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
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
  const [progress, setProgress] = useState(0);

  const stepIcons = [ShoppingCart, MessageSquare, Music, Gift];
  
  const steps: Step[] = stepContentData.map((stepContent, index) => ({
    icon: stepIcons[index],
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

  // Get 3D style classes for each step
  const get3DIconClasses = (stepIndex: number, isActive: boolean) => {
    const baseClasses = "transition-all duration-300 transform";
    const activeClasses = isActive ? "scale-110" : "hover:scale-105";
    
    switch (stepIndex) {
      case 0: // Order button
        return `${baseClasses} ${activeClasses} shadow-lg hover:shadow-xl bg-gradient-to-br from-blue-400 to-blue-600 
                border-2 border-blue-300 hover:from-blue-500 hover:to-blue-700 active:scale-95 
                hover:-translate-y-0.5 active:translate-y-0.5 hover:shadow-blue-500/25`;
      case 1: // Message/Form
        return `${baseClasses} ${activeClasses} shadow-lg hover:shadow-xl bg-gradient-to-br from-green-400 to-green-600 
                border-2 border-green-300 hover:from-green-500 hover:to-green-700 
                hover:-translate-y-1 hover:-rotate-1 hover:shadow-green-500/25 
                relative before:absolute before:inset-0 before:bg-white/10 before:rounded-lg`;
      case 2: // Recording/Microphone
        return `${baseClasses} ${activeClasses} shadow-lg hover:shadow-xl bg-gradient-to-br from-purple-400 to-purple-600 
                border-2 border-purple-300 hover:from-purple-500 hover:to-purple-700 
                hover:-translate-y-0.5 hover:shadow-purple-500/25`;
      case 3: // Gift
        return `${baseClasses} ${activeClasses} shadow-lg hover:shadow-xl bg-gradient-to-br from-orange-400 to-orange-600 
                border-2 border-orange-300 hover:from-orange-500 hover:to-orange-700 
                hover:-translate-y-1 hover:rotate-1 hover:shadow-orange-500/25`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 h-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full items-start">
        
        {/* Enhanced Left Column - Step Indicators */}
        <div className="lg:col-span-3">
          <div className="space-y-6">
            {/* Progress Header */}
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

            {/* Enhanced Step Indicators */}
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              const isPrevious = index < activeStep;
              const isNext = index > activeStep;
              
              return (
                <motion.div 
                  key={index}
                  onClick={() => handleStepClick(index)}
                  className={`relative group cursor-pointer transition-all duration-300 ${
                    isActive 
                      ? 'transform scale-[1.02]' 
                      : 'hover:transform hover:scale-[1.01]'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-5 top-16 w-0.5 h-8 bg-gradient-to-b from-gray-300 to-transparent z-0" />
                  )}
                  
                  {/* Step Card */}
                  <div className={`relative z-10 p-4 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-50 to-indigo-50 shadow-lg border-2 border-purple-200/50 backdrop-blur-sm' 
                      : isPrevious
                      ? 'bg-white/70 shadow-md border border-green-200/50 backdrop-blur-sm'
                      : 'bg-white/50 shadow-sm border border-gray-200/50 backdrop-blur-sm hover:bg-white/70 hover:shadow-md'
                  }`}>
                    
                    {/* Step Number and Icon */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg' 
                          : isPrevious
                          ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                      }`}>
                        {isPrevious ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-5 h-5 bg-white rounded-full flex items-center justify-center"
                          >
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                          </motion.div>
                        ) : (
                          <span className="text-sm">{index + 1}</span>
                        )}
                        
                        {/* Active Step Pulse Effect */}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 rounded-xl bg-purple-400/30"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </div>
                      
                      {/* Step Icon */}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        isActive ? 'bg-white shadow-md' : 'bg-gray-50 group-hover:bg-white'
                      }`}>
                        {React.createElement(step.icon, {
                          className: `w-5 h-5 ${isActive ? 'text-purple-600' : 'text-gray-500'}`
                        })}
                      </div>
                    </div>
                    
                    {/* Step Content */}
                    <div className="space-y-2">
                      <h4 className={`font-semibold transition-colors duration-300 ${
                        isActive ? 'text-purple-700' : isPrevious ? 'text-green-700' : 'text-gray-700'
                      }`}>
                        {step.title}
                      </h4>
                      
                      <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                        isActive ? 'text-purple-600' : isPrevious ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {step.description.length > 80 ? 
                          `${step.description.substring(0, 80)}...` : 
                          step.description
                        }
                      </p>
                    </div>

                    {/* Active Step Indicator */}
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full shadow-lg" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}

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
              {/* Header with 3D Icon */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${get3DIconClasses(activeStep, true)}`}>
                    {React.createElement(steps[activeStep].icon, {
                      className: "w-8 h-8 text-white drop-shadow-sm"
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
