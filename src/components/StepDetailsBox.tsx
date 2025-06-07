
import React from 'react';
import { StepContent } from '@/data/stepContent';

interface StepDetailsBoxProps {
  stepContent: StepContent;
}

export const StepDetailsBox: React.FC<StepDetailsBoxProps> = ({ stepContent }) => {
  const { details, styling } = stepContent;

  return (
    <div className={`${styling.bgColor} p-6 rounded-lg border-l-4 ${styling.borderColor}`}>
      <div className={styling.textColor}>
        <p className="mb-4">{details.intro}</p>
        
        <p className="font-medium mb-3">{details.listTitle}</p>
        <ul className={`${styling.textColor.replace('800', '700')} text-base space-y-2 mb-4`}>
          {details.listItems.map((item, index) => (
            <li key={index}>• {item}</li>
          ))}
        </ul>
        
        <p className={`${styling.textColor} text-sm italic`}>{details.footer}</p>
      </div>
    </div>
  );
};
