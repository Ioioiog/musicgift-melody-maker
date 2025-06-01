import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback, useMemo } from "react";
import { CheckCircle, ArrowRight, ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
const HowItWorks = () => {
  const {
    t
  } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true); // Start playing by default
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const steps = useMemo(() => [{
    title: t('choosePackage'),
    description: t('choosePackageDesc'),
    details: t('choosePackageDetails') || 'Browse our carefully crafted packages and select the one that best fits your needs and budget.',
    icon: '🎁'
  }, {
    title: t('tellYourStory'),
    description: t('tellYourStoryDesc'),
    details: t('tellYourStoryDetails') || 'Share the special moments, memories, and emotions you want to capture in your personalized song.',
    icon: '💭'
  }, {
    title: t('weCreate'),
    description: t('weCreateDesc'),
    details: t('weCreateDetails') || 'Our AI composers and musicians work together to create a unique song tailored to your story.',
    icon: '🎵'
  }, {
    title: t('deliverDelight'),
    description: t('deliverDelightDesc'),
    details: t('deliverDelightDetails') || 'Receive your custom song and watch as it brings joy and creates lasting memories.',
    icon: '✨'
  }], [t]);
  const progress = useMemo(() => (currentStep + 1) / steps.length * 100, [currentStep, steps.length]);
  const handleNextStep = useCallback(() => {
    setCurrentStep(prev => {
      const nextStep = (prev + 1) % steps.length;
      if (nextStep === 0) {
        // Completed full cycle
        setCompletedSteps(new Set([0, 1, 2, 3]));
        setTimeout(() => setCompletedSteps(new Set()), 2000);
      }
      return nextStep;
    });
  }, [steps.length]);
  const handlePrevious = useCallback(() => {
    setCurrentStep(prev => prev === 0 ? steps.length - 1 : prev - 1);
  }, [steps.length]);
  const handleNext = useCallback(() => {
    handleNextStep();
  }, [handleNextStep]);
  const handleStepClick = useCallback((index: number) => {
    setCurrentStep(index);
    setCompletedSteps(prev => new Set([...prev, index]));
  }, []);
  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);
  const resetAnimation = useCallback(() => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setIsPlaying(false);
  }, []);

  // Auto-play effect with 4-second interval
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(handleNextStep, 4000);
    return () => clearInterval(interval);
  }, [isPlaying, handleNextStep]);
  return <div className="min-h-screen">
      <Navigation />
      
      {/* Page Title */}
      <section className="py-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h1 className="text-3xl md:text-5xl font-bold mb-4" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            {t('howItWorksTitle')}
          </motion.h1>
          <motion.p className="text-lg md:text-xl opacity-90" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }}>
            {t('howItWorksSubtitle') || 'Discover the magic behind creating your personalized musical gift'}
          </motion.p>
        </div>
      </section>

      {/* Enhanced Steps Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {/* Simplified floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute top-10 left-0 text-6xl text-purple-300 opacity-20" animate={{
          x: [0, 100]
        }} transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}>
            ♪
          </motion.div>
          <motion.div className="absolute bottom-10 right-0 text-4xl text-orange-300 opacity-20" animate={{
          x: [0, -100]
        }} transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}>
            🎵
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto px-4">
          {/* Progress Bar */}
          <div className="mb-8">
            
            <div className="w-full bg-gray-300 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500" style={{
              width: `${progress}%`
            }} />
            </div>
          </div>

          {/* Control Panel */}
          

          <div className="max-w-5xl mx-auto px-4 bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-6 md:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = completedSteps.has(index);
              return <div key={index} className={`cursor-pointer p-4 text-center rounded-xl transform transition-all duration-300 ${isActive ? "scale-105 ring-2 ring-purple-400" : "hover:scale-102"}`} onClick={() => handleStepClick(index)}>
                    {/* Step Circle with Icon */}
                    <div className={`w-20 h-20 mx-auto rounded-full border-4 flex items-center justify-center text-white font-bold text-xl shadow-md mb-4 relative transition-all duration-300 ${isActive ? "bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-400" : isCompleted ? "bg-gradient-to-br from-green-500 to-green-600 shadow-green-400" : "bg-gradient-to-br from-gray-300 to-gray-400"}`}>
                      {isCompleted ? <CheckCircle className="w-8 h-8" /> : <span className="text-2xl">{step.icon}</span>}
                      
                      {/* Step Number Badge */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-gray-600 shadow-md">
                        {index + 1}
                      </div>
                    </div>

                    {/* Step Content */}
                    <div>
                      <h3 className="text-lg font-semibold text-purple-700 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">{step.description}</p>
                      
                      {/* Details for active step */}
                      <AnimatePresence>
                        {isActive && <motion.div initial={{
                      opacity: 0,
                      height: 0
                    }} animate={{
                      opacity: 1,
                      height: "auto"
                    }} exit={{
                      opacity: 0,
                      height: 0
                    }} transition={{
                      duration: 0.3
                    }} className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 mt-2">
                            {step.details}
                          </motion.div>}
                      </AnimatePresence>
                    </div>
                  </div>;
            })}
            </div>

            {/* Current Step Details */}
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{steps[currentStep].icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-purple-700">
                    {t('step')} {currentStep + 1}: {steps[currentStep].title}
                  </h3>
                  <p className="text-gray-600">{steps[currentStep].description}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {steps[currentStep].details}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default HowItWorks;