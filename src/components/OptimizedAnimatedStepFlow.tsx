
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import { useLocalization } from '@/contexts/OptimizedLocalizationContext';

const OptimizedAnimatedStepFlow = () => {
  const { t } = useLocalization();
  const [activeStep, setActiveStep] = useState(0);
  const animationFrameRef = useRef<number>();
  const lastUpdateRef = useRef(Date.now());
  const STEP_DURATION = 5000; // 5 seconds per step

  // Define step content directly in the component
  const stepContent = [
    {
      ro: {
        title: t('step1Title'),
        description: t('step1Description')
      },
      en: {
        title: t('step1Title'),
        description: t('step1Description')
      }
    },
    {
      ro: {
        title: t('step2Title'),
        description: t('step2Description')
      },
      en: {
        title: t('step2Title'),
        description: t('step2Description')
      }
    },
    {
      ro: {
        title: t('step3Title'),
        description: t('step3Description')
      },
      en: {
        title: t('step3Title'),
        description: t('step3Description')
      }
    },
    {
      ro: {
        title: t('step4Title'),
        description: t('step4Description')
      },
      en: {
        title: t('step4Title'),
        description: t('step4Description')
      }
    }
  ];

  const updateActiveStep = useCallback(() => {
    const now = Date.now();
    if (now - lastUpdateRef.current >= STEP_DURATION) {
      setActiveStep(prev => (prev + 1) % stepContent.length);
      lastUpdateRef.current = now;
    }
    animationFrameRef.current = requestAnimationFrame(updateActiveStep);
  }, []);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(updateActiveStep);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateActiveStep]);

  return (
    <section 
      className="py-8 px-4 relative overflow-hidden"
      style={{
        contain: 'layout style',
        contentVisibility: 'auto',
        containIntrinsicSize: '100vw 600px'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/30 to-black/50" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {t('howItWorksTitle', 'How it works')}
          </h2>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto">
            {t('howItWorksSubtitle', 'Follow these simple steps to create your personalized song')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stepContent.map((step, index) => {
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;
            
            return (
              <motion.div
                key={index}
                className={`relative p-6 rounded-xl transition-all duration-500 ${
                  isActive 
                    ? 'bg-white/20 border-2 border-orange-400 shadow-lg' 
                    : 'bg-white/10 border border-white/30'
                }`}
                style={{ contain: 'layout style' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isActive 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-white/20 text-white'
                  }`}>
                    {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                  </div>
                  
                  {index < stepContent.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2">
                      <ChevronRight className="w-6 h-6 text-white/50" />
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">
                  {step.ro?.title || `Step ${index + 1}`}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  {step.ro?.description || `Description for step ${index + 1}`}
                </p>

                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-orange-400"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: STEP_DURATION / 1000, ease: 'linear' }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OptimizedAnimatedStepFlow;
