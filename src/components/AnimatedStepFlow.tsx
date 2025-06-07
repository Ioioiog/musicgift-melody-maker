import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, MessageSquare, Music, Gift, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { stepContentData } from '@/data/stepContent';
import { StepDetailsBox } from '@/components/StepDetailsBox';
import { Button } from '@/components/ui/button';
interface Step {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}
const AnimatedStepFlow = () => {
  const {
    t
  } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const stepIcons = [ShoppingCart, MessageSquare, Music, Gift];
  const steps: Step[] = stepContentData.map((stepContent, index) => ({
    icon: stepIcons[index],
    title: stepContent.getTitle(t),
    description: stepContent.getDescription(t),
    color: stepContent.styling.color,
    bgColor: stepContent.styling.bgColor
  }));

  // Auto-progression effect - 5 seconds per step
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, steps.length]);
  const handleStepClick = (index: number) => {
    setActiveStep(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };
  const handlePrevious = () => {
    setActiveStep(prev => prev === 0 ? steps.length - 1 : prev - 1);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };
  const handleNext = () => {
    setActiveStep(prev => (prev + 1) % steps.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };
  return <div className="max-w-7xl mx-auto px-4 h-full">
      {/* Horizontal Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-center">
        
        {/* Left Column - Vertical Step Indicators */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="space-y-4">
            {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;
            return <motion.div key={index} onClick={() => handleStepClick(index)} whileHover={{
              scale: 1.02
            }} onHoverStart={() => setIsPaused(true)} onHoverEnd={() => setTimeout(() => setIsPaused(false), 2000)} className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-300 shadow-lg' : isCompleted ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50 border-2 border-gray-200 hover:border-purple-200'}`}>
                  {/* Step Circle */}
                  <motion.div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg' : isCompleted ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : 'bg-white border-2 border-gray-300 text-gray-500'}`} animate={{
                scale: isActive ? 1.1 : 1
              }} transition={{
                duration: 0.3
              }}>
                    <StepIcon className="w-5 h-5" />
                    
                    {isActive && <motion.div className="absolute inset-0 rounded-full bg-purple-600 opacity-20" animate={{
                  scale: [1, 1.3, 1]
                }} transition={{
                  duration: 2,
                  repeat: Infinity
                }} />}
                  </motion.div>

                  {/* Step Info */}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium transition-colors duration-300 ${isActive || isCompleted ? 'text-purple-700' : 'text-gray-600'}`}>
                      {t('step')} {index + 1}
                    </div>
                    <div className={`text-xs transition-colors duration-300 truncate ${isActive ? 'text-purple-600' : 'text-gray-500'}`}>
                      {step.title}
                    </div>
                  </div>

                  {/* Active Indicator */}
                  {isActive && <motion.div className="w-2 h-8 bg-purple-600 rounded-full" animate={{
                opacity: [0.5, 1, 0.5]
              }} transition={{
                duration: 1.5,
                repeat: Infinity
              }} />}
                </motion.div>;
          })}
          </div>

          {/* Auto-progression indicator */}
          <motion.div className="mt-4 text-center" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 1
        }}>
            {isPaused ? <span className="flex items-center justify-center gap-2 px-3 py-2 bg-orange-50 rounded-full border border-orange-200 text-xs">
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                Auto-progression paused
              </span> : <span className="flex items-center justify-center gap-2 px-3 py-2 bg-green-50 rounded-full border border-green-200 text-xs">
                <motion.div className="w-1.5 h-1.5 bg-green-400 rounded-full" animate={{
              opacity: [0.5, 1, 0.5]
            }} transition={{
              duration: 1,
              repeat: Infinity
            }} />
                Auto-progressing
              </span>}
          </motion.div>
        </div>

        {/* Right Column - Active Step Details */}
        <div className="lg:col-span-8 xl:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div key={activeStep} initial={{
            opacity: 0,
            x: 20,
            scale: 0.98
          }} animate={{
            opacity: 1,
            x: 0,
            scale: 1
          }} exit={{
            opacity: 0,
            x: -20,
            scale: 0.98
          }} transition={{
            duration: 0.4,
            ease: "easeInOut"
          }} className="h-full">
              <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-xl border border-purple-200/30 backdrop-blur-sm overflow-hidden group hover:shadow-2xl transition-all duration-500 h-full">
                
                {/* Decorative elements */}
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-purple-400/15 to-transparent rounded-full blur-lg" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-tr from-indigo-400/10 to-transparent rounded-full blur-md" />
                
                <div className="relative z-10 p-6 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div className={`w-16 h-16 rounded-xl ${steps[activeStep].bgColor} flex items-center justify-center shadow-lg`} initial={{
                    rotate: -180,
                    scale: 0
                  }} animate={{
                    rotate: 0,
                    scale: 1
                  }} transition={{
                    duration: 0.5,
                    type: "spring",
                    bounce: 0.3
                  }}>
                      {React.createElement(steps[activeStep].icon, {
                      className: `w-8 h-8 ${steps[activeStep].color}`
                    })}
                    </motion.div>

                    <div className="flex-1">
                      <motion.div className="flex items-center gap-2 mb-2" initial={{
                      opacity: 0,
                      x: -20
                    }} animate={{
                      opacity: 1,
                      x: 0
                    }} transition={{
                      delay: 0.2
                    }}>
                        <span className="px-2 py-1 text-xs font-bold text-purple-600 bg-purple-100 rounded-full">
                          {t('step')} {activeStep + 1}
                        </span>
                      </motion.div>
                      <motion.h3 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight" initial={{
                      opacity: 0,
                      x: -20
                    }} animate={{
                      opacity: 1,
                      x: 0
                    }} transition={{
                      delay: 0.3
                    }}>
                        {steps[activeStep].title}
                      </motion.h3>
                    </div>
                  </div>

                  {/* Description */}
                  <motion.div className="mb-6" initial={{
                  opacity: 0,
                  y: 20
                }} animate={{
                  opacity: 1,
                  y: 0
                }} transition={{
                  delay: 0.4
                }}>
                    <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
                      {steps[activeStep].description}
                    </p>
                  </motion.div>
                    
                  {/* Step Details - Compact Version */}
                  <motion.div className="flex-1" initial={{
                  opacity: 0,
                  y: 20
                }} animate={{
                  opacity: 1,
                  y: 0
                }} transition={{
                  delay: 0.5
                }}>
                    <StepDetailsBox stepContent={stepContentData[activeStep]} />
                  </motion.div>

                  {/* Navigation and Progress Footer */}
                  <motion.div className="mt-6 flex items-center justify-between" initial={{
                  opacity: 0
                }} animate={{
                  opacity: 1
                }} transition={{
                  delay: 0.6
                }}>
                    {/* Modern Simple Navigation Buttons */}
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={handlePrevious} className="h-10 w-10 rounded-full border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                      </Button>
                      
                      <Button variant="outline" size="icon" onClick={handleNext} className="h-10 w-10 rounded-full border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      </Button>
                    </div>

                    {/* Progress Indicator */}
                    
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>;
};
export default AnimatedStepFlow;