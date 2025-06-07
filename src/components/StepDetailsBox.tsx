
import React from 'react';
import { StepContent } from '@/data/stepContent';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';

interface StepDetailsBoxProps {
  stepContent: StepContent;
}

export const StepDetailsBox: React.FC<StepDetailsBoxProps> = ({
  stepContent
}) => {
  const { t } = useLanguage();
  const details = stepContent.getDetails(t);
  const { styling } = stepContent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      className={`${styling.bgColor} p-8 md:p-10 rounded-2xl border-l-6 ${styling.borderColor} shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden group`}
    >
      {/* Enhanced decorative background elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-white/15 to-transparent rounded-full -translate-y-20 translate-x-20 group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/8 to-transparent rounded-full translate-y-12 -translate-x-12 group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute top-1/2 right-8 w-16 h-16 bg-gradient-to-br from-white/5 to-transparent rounded-full animate-pulse" />
      
      <div className={`${styling.textColor} relative z-10`}>
        {/* Enhanced title with icon and better styling */}
        <motion.div 
          className="flex items-center gap-4 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${styling.borderColor.replace('border-', 'bg-')} shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
            <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <h4 className="text-2xl font-bold tracking-tight">
            {details.listTitle}
          </h4>
        </motion.div>
        
        {/* Enhanced list with improved icons and animations */}
        <div className="space-y-5 mb-8">
          {details.listItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: 0.5 + index * 0.1,
                ease: "easeOut"
              }}
              className="flex items-start gap-4 group/item hover:translate-x-2 transition-transform duration-300"
            >
              <div className={`flex-shrink-0 w-7 h-7 rounded-full ${styling.borderColor.replace('border-', 'bg-')} flex items-center justify-center mt-1 shadow-md group-hover/item:scale-110 group-hover/item:shadow-lg transition-all duration-300`}>
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
              <p className={`${styling.textColor.replace('800', '700')} text-lg leading-relaxed flex-1 font-medium`}>
                {item}
              </p>
            </motion.div>
          ))}
        </div>
        
        {/* Enhanced footer with gradient border and better styling */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9 }}
          className="relative mt-8"
        >
          {/* Gradient separator */}
          <div className={`w-full h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-20 mb-6`} />
          
          {/* Enhanced footer content */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-xl blur-sm" />
            <div className="relative bg-white/40 backdrop-blur-md rounded-xl px-6 py-4 border border-white/20 shadow-inner">
              <p className={`${styling.textColor} text-base italic font-semibold text-center leading-relaxed`}>
                {details.footer}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Subtle floating particles effect */}
        <div className="absolute top-4 left-4 w-1 h-1 bg-current opacity-30 rounded-full animate-pulse" />
        <div className="absolute top-8 right-12 w-1 h-1 bg-current opacity-20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-6 left-8 w-1 h-1 bg-current opacity-25 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </motion.div>
  );
};
