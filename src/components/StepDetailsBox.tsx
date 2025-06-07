
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
      transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      className={`${styling.bgColor} p-4 md:p-6 rounded-xl border-l-4 ${styling.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}
    >
      {/* Compact decorative elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-10 translate-x-10" />
      
      <div className={`${styling.textColor} relative z-10`}>
        {/* Compact title */}
        <motion.div 
          className="flex items-center gap-3 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${styling.borderColor.replace('border-', 'bg-')} shadow-md`}>
            <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
          <h4 className="text-lg font-bold">
            {details.listTitle}
          </h4>
        </motion.div>
        
        {/* Compact list */}
        <div className="space-y-3 mb-4">
          {details.listItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: 0.4 + index * 0.1,
                ease: "easeOut"
              }}
              className="flex items-start gap-3 group/item hover:translate-x-1 transition-transform duration-200"
            >
              <div className={`flex-shrink-0 w-5 h-5 rounded-full ${styling.borderColor.replace('border-', 'bg-')} flex items-center justify-center mt-0.5 shadow-sm`}>
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
              <p className={`${styling.textColor.replace('800', '700')} text-sm leading-relaxed flex-1`}>
                {item}
              </p>
            </motion.div>
          ))}
        </div>
        
        {/* Compact footer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="relative"
        >
          <div className={`w-full h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-15 mb-3`} />
          
          <div className="bg-white/30 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/15">
            <p className={`${styling.textColor} text-xs italic font-medium text-center`}>
              {details.footer}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
