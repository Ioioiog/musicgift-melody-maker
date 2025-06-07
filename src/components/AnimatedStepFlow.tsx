import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, MessageSquare, Music, Gift } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { stepContentData } from '@/data/stepContent';
import { StepDetailsBox } from '@/components/StepDetailsBox';

interface Step {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

const AnimatedStepFlow = () => {
  const { t } = useLanguage();
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

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Step Indicators */}
      <div className="relative mb-12">
        {/* Progress Line */}
        <div className="absolute top-8 left-0 w-full h-1 bg-gray-200 rounded-full">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>

        {/* Step Circles */}
        <div className="relative flex justify-between items-center py-[20px]">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;

            return (
              <motion.div
                key={index}
                onClick={() => handleStepClick(index)}
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setIsPaused(true)}
                onHoverEnd={() => setTimeout(() => setIsPaused(false), 2000)}
                className="flex flex-col items-center cursor-pointer group py-0"
              >
                {/* Step Circle */}
                <motion.div
                  className={`relative w-16 h-16 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500 ease-in-out ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-xl ring-4 ring-purple-200'
                      : isCompleted
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                      : 'bg-white border-2 border-gray-300 text-gray-500 hover:border-purple-300'
                  }`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: isActive ? 1.1 : 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <StepIcon className="w-6 h-6" />
                  
                  {/* Pulse animation for active step */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-purple-600 opacity-20"
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>

                {/* Step Number */}
                <motion.div
                  className={`mt-3 text-center transition-all duration-300 ${
                    isActive || isCompleted ? 'text-purple-700 font-semibold' : 'text-gray-500 font-medium'
                  }`}
                  animate={{ scale: isActive ? 1.05 : 1 }}
                >
                  <span className="text-sm lg:text-base whitespace-nowrap">
                    {t('step')} {index + 1}
                  </span>
                  {isActive && (
                    <motion.div
                      className="w-2 h-2 bg-purple-600 rounded-full mx-auto mt-1"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Active Step Details */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative"
        >
          <motion.div 
            className="relative bg-gradient-to-br from-white via-white to-gray-50/30 rounded-3xl shadow-2xl border border-purple-200/50 backdrop-blur-sm overflow-hidden group hover:shadow-3xl transition-all duration-700"
            whileHover={{ 
              y: -4,
              boxShadow: "0 25px 60px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(147, 51, 234, 0.1)"
            }}
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)"
            }}
          >
            {/* Enhanced decorative elements with gradients */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-purple-400/20 via-blue-400/15 to-transparent rounded-full blur-xl group-hover:scale-110 transition-transform duration-1000" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-tr from-indigo-400/15 via-purple-400/10 to-transparent rounded-full blur-lg group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute top-1/3 right-8 w-20 h-20 bg-gradient-to-br from-pink-400/10 via-purple-300/8 to-transparent rounded-full blur-md animate-pulse" />
            
            {/* Subtle animated border effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-blue-500/10 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" 
                 style={{ 
                   mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                   maskComposite: "xor",
                   WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                   WebkitMaskComposite: "xor",
                   padding: "2px"
                 }} />
            
            <div className="relative z-10 p-6 lg:p-8 xl:p-12">
              <div className="flex items-center gap-6 mb-8">
                {/* Large Icon with enhanced styling */}
                <motion.div
                  className={`relative w-24 h-24 rounded-2xl ${steps[activeStep].bgColor} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500`}
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                  whileHover={{ 
                    scale: 1.05,
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.6 }
                  }}
                >
                  {React.createElement(steps[activeStep].icon, {
                    className: `w-12 h-12 ${steps[activeStep].color}`
                  })}
                  {/* Icon glow effect */}
                  <div className={`absolute inset-0 rounded-2xl ${steps[activeStep].bgColor} opacity-50 blur-xl scale-110 group-hover:opacity-70 transition-opacity duration-500`} />
                </motion.div>

                {/* Enhanced Title Section */}
                <div className="flex-1">
                  <motion.div
                    className="flex items-center gap-3 mb-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="px-3 py-1 text-sm font-bold text-purple-600 bg-purple-100 rounded-full border border-purple-200 shadow-sm">
                      {t('step')} {activeStep + 1}
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent" />
                  </motion.div>
                  <motion.h3
                    className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {steps[activeStep].title}
                  </motion.h3>
                </div>
              </div>

              {/* Enhanced Description */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed font-medium">
                  {steps[activeStep].description}
                </p>
              </motion.div>
                
              {/* Step-specific details using the centralized content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <StepDetailsBox stepContent={stepContentData[activeStep]} />
              </motion.div>

              {/* Enhanced Progress indicator */}
              <motion.div
                className="mt-10 flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">
                    Progress: {activeStep + 1} of {steps.length}
                  </span>
                  <div className="flex gap-2">
                    {steps.map((_, index) => (
                      <motion.div
                        key={index}
                        className={`h-2 rounded-full transition-all duration-500 ${
                          index === activeStep 
                            ? 'bg-gradient-to-r from-purple-500 to-purple-600 w-8 shadow-md' 
                            : index < activeStep
                            ? 'bg-green-400 w-3'
                            : 'bg-gray-200 w-3'
                        }`}
                        whileHover={{ scale: 1.2 }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Estimated time indicator */}
                <div className="text-sm text-gray-500 font-medium">
                  ~{2 + activeStep} min read
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Auto-progression indicator */}
      <motion.div
        className="text-center mt-8 text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {isPaused ? (
          <span className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-50 rounded-full border border-orange-200">
            <div className="w-2 h-2 bg-orange-400 rounded-full" />
            Auto-progression paused
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
            <motion.div
              className="w-2 h-2 bg-green-400 rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            Auto-progressing through steps
          </span>
        )}
      </motion.div>
    </div>
  );
};

export default AnimatedStepFlow;
