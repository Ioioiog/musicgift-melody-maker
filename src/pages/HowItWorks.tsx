
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckCircle, ArrowRight, ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const HowItWorks = () => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  const steps = [
    {
      title: t('choosePackage'),
      description: t('choosePackageDesc'),
      details: t('choosePackageDetails') || 'Browse our carefully crafted packages and select the one that best fits your needs and budget.',
      icon: '🎁'
    },
    {
      title: t('tellYourStory'),
      description: t('tellYourStoryDesc'),
      details: t('tellYourStoryDetails') || 'Share the special moments, memories, and emotions you want to capture in your personalized song.',
      icon: '💭'
    },
    {
      title: t('weCreate'),
      description: t('weCreateDesc'),
      details: t('weCreateDetails') || 'Our AI composers and musicians work together to create a unique song tailored to your story.',
      icon: '🎵'
    },
    {
      title: t('deliverDelight'),
      description: t('deliverDelightDesc'),
      details: t('deliverDelightDetails') || 'Receive your custom song and watch as it brings joy and creates lasting memories.',
      icon: '✨'
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = (prev + 1) % steps.length;
        if (nextStep === 0) {
          setCompletedSteps([0, 1, 2, 3]);
          setTimeout(() => setCompletedSteps([]), 1000);
        }
        return nextStep;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
    setCompletedSteps(prev => [...new Set([...prev, index])]);
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev === 0 ? steps.length - 1 : prev - 1);
  };

  const handleNext = () => {
    setCurrentStep(prev => (prev + 1) % steps.length);
  };

  const resetAnimation = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Page Title */}
      <section className="py-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h1 
            className="text-3xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t('howItWorksTitle')}
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl opacity-90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('howItWorksSubtitle') || 'Discover the magic behind creating your personalized musical gift'}
          </motion.p>
        </div>
      </section>

      {/* Enhanced Animated Steps Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {/* Floating Notes Top */}
        <motion.div 
          className="absolute top-10 left-[-10%] text-[60px] text-purple-300 opacity-10 whitespace-nowrap" 
          animate={{ x: ["-100px", "110vw"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          ♪ ♫ ♩ ♬
        </motion.div>

        {/* Floating Notes Bottom */}
        <motion.div 
          className="absolute bottom-10 right-[-10%] text-[40px] text-orange-300 opacity-15 whitespace-nowrap" 
          animate={{ x: ["100px", "-110vw"] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          🎵 🎶 🎼 🎹
        </motion.div>

        <div className="max-w-6xl mx-auto px-4">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-purple-700">
                {t('processOverview') || 'Process Overview'}
              </h2>
              <div className="text-sm text-gray-600">
                {Math.round(progress)}% {t('complete') || 'Complete'}
              </div>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Control Panel */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? t('pause') || 'Pause' : t('play') || 'Play'}
            </Button>
            <Button onClick={handlePrevious} variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t('previous') || 'Previous'}
            </Button>
            <Button onClick={handleNext} variant="outline" className="flex items-center gap-2">
              {t('next') || 'Next'}
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button onClick={resetAnimation} variant="outline" className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              {t('reset') || 'Reset'}
            </Button>
          </div>

          <div className="max-w-5xl mx-auto px-4 bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-6 md:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {steps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = completedSteps.includes(index);
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0.3, y: 40, scale: 0.85, rotateX: 15 }}
                    animate={isActive ? {
                      opacity: 1,
                      y: -5,
                      scale: 1.05,
                      rotateX: 0,
                      transition: { duration: 1.2, type: "spring", bounce: 0.4 }
                    } : isCompleted ? {
                      opacity: 0.8,
                      y: 0,
                      scale: 0.98,
                      rotateX: -2
                    } : {
                      opacity: 0.3,
                      y: 40,
                      scale: 0.85,
                      rotateX: 15
                    }}
                    whileHover={{ y: -15, scale: 1.08, rotateX: -5 }}
                    className={`cursor-pointer p-4 text-center rounded-xl transform transition-all duration-300 relative ${
                      isActive ? "z-10 ring-2 ring-purple-400" : "z-0"
                    }`}
                    onClick={() => handleStepClick(index)}
                  >
                    {/* Step Circle with Icon */}
                    <motion.div
                      className={`w-20 h-20 mx-auto rounded-full border-4 flex items-center justify-center text-white font-bold text-xl shadow-md mb-4 relative ${
                        isActive 
                          ? "bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-400" 
                          : isCompleted
                          ? "bg-gradient-to-br from-green-500 to-green-600 shadow-green-400"
                          : "bg-gradient-to-br from-gray-300 to-gray-200"
                      }`}
                      animate={isActive ? {
                        scale: [1, 1.2, 1],
                        rotateY: 360
                      } : {}}
                      transition={isActive ? {
                        duration: 1,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "loop"
                      } : {}}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-8 h-8" />
                      ) : (
                        <span className="text-2xl">{step.icon}</span>
                      )}
                      
                      {/* Step Number Badge */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-gray-600 shadow-md">
                        {index + 1}
                      </div>
                    </motion.div>

                    {/* Step Content */}
                    <div>
                      <h3 className="text-lg font-semibold text-purple-700 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">{step.description}</p>
                      
                      {/* Details Toggle */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 mt-2"
                          >
                            {step.details}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Current Step Details */}
            <motion.div 
              className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200"
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
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
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;
