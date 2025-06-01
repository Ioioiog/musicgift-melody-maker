import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, MessageSquare, Music, Gift } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const steps: Step[] = [{
    icon: ShoppingCart,
    title: t('step1Title'),
    description: t('step1Description'),
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  }, {
    icon: MessageSquare,
    title: t('step2Title'),
    description: t('step2Description'),
    color: "text-green-600",
    bgColor: "bg-green-100"
  }, {
    icon: Music,
    title: t('step3Title'),
    description: t('step3Description'),
    color: "text-purple-600",
    bgColor: "bg-purple-100"
  }, {
    icon: Gift,
    title: t('step4Title'),
    description: t('step4Description'),
    color: "text-orange-600",
    bgColor: "bg-orange-100"
  }];

  // Auto-progression effect
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, steps.length]);
  const handleStepClick = (index: number) => {
    setActiveStep(index);
    setIsPaused(true);
    // Resume auto-progression after 8 seconds
    setTimeout(() => setIsPaused(false), 8000);
  };
  return <div className="max-w-6xl mx-auto px-4">
      {/* Step Indicators */}
      <div className="relative mb-12">
        {/* Progress Line */}
        <div className="absolute top-8 left-0 w-full h-1 bg-gray-200 rounded-full">
          <motion.div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" initial={{
          width: "0%"
        }} animate={{
          width: `${(activeStep + 1) / steps.length * 100}%`
        }} transition={{
          duration: 0.8,
          ease: "easeInOut"
        }} />
        </div>

        {/* Step Circles */}
        <div className="relative flex justify-between items-center py-[2px]">
          {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;
          return <motion.div key={index} className="flex flex-col items-center cursor-pointer group" onClick={() => handleStepClick(index)} whileHover={{
            scale: 1.05
          }} onHoverStart={() => setIsPaused(true)} onHoverEnd={() => setTimeout(() => setIsPaused(false), 2000)}>
                {/* Step Circle */}
                <motion.div className={`relative w-16 h-16 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500 ease-in-out ${isActive ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-xl ring-4 ring-purple-200' : isCompleted ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' : 'bg-white border-2 border-gray-300 text-gray-500 hover:border-purple-300'}`} initial={{
              scale: 0.8,
              opacity: 0
            }} animate={{
              scale: isActive ? 1.1 : 1,
              opacity: 1
            }} transition={{
              duration: 0.3,
              delay: index * 0.1
            }}>
                  <StepIcon className="w-6 h-6" />
                  
                  {/* Pulse animation for active step */}
                  {isActive && <motion.div className="absolute inset-0 rounded-full bg-purple-600 opacity-20" animate={{
                scale: [1, 1.4, 1]
              }} transition={{
                duration: 2,
                repeat: Infinity
              }} />}
                </motion.div>

                {/* Step Number */}
                <motion.div className={`mt-3 text-center transition-all duration-300 ${isActive || isCompleted ? 'text-purple-700 font-semibold' : 'text-gray-500 font-medium'}`} animate={{
              scale: isActive ? 1.05 : 1
            }}>
                  <span className="text-sm lg:text-base whitespace-nowrap">
                    {t('step')} {index + 1}
                  </span>
                  {isActive && <motion.div className="w-2 h-2 bg-purple-600 rounded-full mx-auto mt-1" animate={{
                opacity: [0.5, 1, 0.5]
              }} transition={{
                duration: 1.5,
                repeat: Infinity
              }} />}
                </motion.div>
              </motion.div>;
        })}
        </div>
      </div>

      {/* Active Step Details */}
      <AnimatePresence mode="wait">
        <motion.div key={activeStep} initial={{
        opacity: 0,
        y: 20,
        scale: 0.95
      }} animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }} exit={{
        opacity: 0,
        y: -20,
        scale: 0.95
      }} transition={{
        duration: 0.5,
        ease: "easeInOut"
      }} className="relative">
          <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-200 p-8 lg:p-12 px-[22px] py-[28px]">
            {/* Decorative corner elements */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-purple-100 to-transparent rounded-full opacity-50" />
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-tr from-blue-100 to-transparent rounded-full opacity-30" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-6">
                {/* Large Icon */}
                <motion.div className={`w-20 h-20 rounded-full ${steps[activeStep].bgColor} flex items-center justify-center`} initial={{
                rotate: -180,
                scale: 0
              }} animate={{
                rotate: 0,
                scale: 1
              }} transition={{
                duration: 0.6,
                type: "spring",
                bounce: 0.3
              }}>
                  {React.createElement(steps[activeStep].icon, {
                  className: `w-10 h-10 ${steps[activeStep].color}`
                })}
                </motion.div>

                {/* Title */}
                <div>
                  <motion.div className="text-lg font-bold text-purple-600 mb-2" initial={{
                  opacity: 0,
                  x: -20
                }} animate={{
                  opacity: 1,
                  x: 0
                }} transition={{
                  delay: 0.2
                }}>
                    {t('step')} {activeStep + 1}
                  </motion.div>
                  <motion.h3 className="text-3xl lg:text-4xl font-bold text-gray-900" initial={{
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
              <motion.p className="text-lg lg:text-xl text-gray-600 leading-relaxed" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.4
            }}>
                {steps[activeStep].description}
              </motion.p>

              {/* Progress indicator */}
              <motion.div className="mt-8 flex items-center gap-2" initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              delay: 0.5
            }}>
                <span className="text-sm text-gray-500">
                  {activeStep + 1} / {steps.length}
                </span>
                <div className="flex gap-1">
                  {steps.map((_, index) => <div key={index} className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeStep ? 'bg-purple-600 w-6' : 'bg-gray-300'}`} />)}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Auto-progression indicator */}
      <motion.div className="text-center mt-6 text-sm text-gray-500" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 1
    }}>
        {isPaused ? <span className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full" />
            Auto-progression paused
          </span> : <span className="flex items-center justify-center gap-2">
            <motion.div className="w-2 h-2 bg-green-400 rounded-full" animate={{
          opacity: [0.5, 1, 0.5]
        }} transition={{
          duration: 1,
          repeat: Infinity
        }} />
            Auto-progressing through steps
          </span>}
      </motion.div>
    </div>;
};
export default AnimatedStepFlow;