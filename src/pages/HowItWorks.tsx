
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const HowItWorks = () => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      title: t('choosePackage'),
      description: t('choosePackageDesc'),
    },
    {
      title: t('tellYourStory'), 
      description: t('tellYourStoryDesc'),
    },
    {
      title: t('weCreate'),
      description: t('weCreateDesc'),
    },
    {
      title: t('deliverDelight'), 
      description: t('deliverDelightDesc'),
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Page Title */}
      <section className="pt-24 pb-8 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">{t('howItWorksTitle')}</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('howItWorksSubtitle')}
          </p>
        </div>
      </section>

      {/* Animated Steps Section */}
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

        <div className="max-w-5xl mx-auto px-4 bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-purple-700 mb-10">
            {t('howItWorksTitle')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0.3, y: 40, scale: 0.85, rotateX: 15 }}
                  animate={
                    isActive
                      ? {
                          opacity: 1,
                          y: -5,
                          scale: 1.05,
                          rotateX: 0,
                          transition: {
                            duration: 1.2,
                            type: "spring",
                            bounce: 0.4,
                          },
                        }
                      : isCompleted
                      ? { opacity: 0.8, y: 0, scale: 0.98, rotateX: -2 }
                      : { opacity: 0.3, y: 40, scale: 0.85, rotateX: 15 }
                  }
                  whileHover={{ y: -15, scale: 1.08, rotateX: -5 }}
                  className={`cursor-pointer p-4 text-center rounded-xl transform transition-transform duration-300 ${
                    isActive ? "z-10" : "z-0"
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  <motion.div
                    className={`w-20 h-20 mx-auto rounded-full border-4 flex items-center justify-center text-white font-bold text-2xl shadow-md mb-4 ${
                      isActive
                        ? "bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-400"
                        : "bg-gradient-to-br from-gray-300 to-gray-200"
                    }`}
                    animate={
                      isActive
                        ? {
                            scale: [1, 1.2, 1],
                            rotateY: 360,
                          }
                        : {}
                    }
                    transition={
                      isActive
                        ? {
                            duration: 1,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatType: "loop",
                          }
                        : {}
                    }
                  >
                    {index + 1}
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-700 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;
