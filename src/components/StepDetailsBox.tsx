
import React from 'react';
import { StepContent } from '@/data/stepContent';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={`${styling.bgColor} p-8 rounded-xl border-l-4 ${styling.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-10 -translate-x-10" />
      
      <div className={`${styling.textColor} relative z-10`}>
        {/* Title with enhanced styling */}
        <motion.h4 
          className="text-xl font-bold mb-5 flex items-center gap-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className={`w-2 h-2 rounded-full ${styling.borderColor.replace('border-', 'bg-')} animate-pulse`} />
          {details.listTitle}
        </motion.h4>
        
        {/* Enhanced list with check icons and better spacing */}
        <div className="space-y-4 mb-6">
          {details.listItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              className="flex items-start gap-4 group"
            >
              <div className={`flex-shrink-0 w-6 h-6 rounded-full ${styling.borderColor.replace('border-', 'bg-')} flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-200`}>
                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              </div>
              <p className={`${styling.textColor.replace('800', '700')} text-base leading-relaxed flex-1`}>
                {item}
              </p>
            </motion.div>
          ))}
        </div>
        
        {/* Enhanced footer with better styling */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="relative"
        >
          <div className={`w-full h-px ${styling.borderColor.replace('border-', 'bg-')} opacity-30 mb-4`} />
          <p className={`${styling.textColor} text-sm italic font-medium text-center px-4 py-2 rounded-lg bg-white/30 backdrop-blur-sm`}>
            {details.footer}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
