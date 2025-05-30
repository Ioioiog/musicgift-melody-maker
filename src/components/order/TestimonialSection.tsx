
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const TestimonialSection: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <Card className="border-purple-200">
      <CardContent className="p-6">
        <blockquote className="text-sm text-gray-600 italic mb-4">
          {t('testimonialQuote')}
        </blockquote>
        <cite className="text-purple-600 font-medium">{t('testimonialAuthor')}</cite>
      </CardContent>
    </Card>
  );
};

export default TestimonialSection;
