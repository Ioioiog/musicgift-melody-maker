
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const TestimonialSection: React.FC = () => {
  return (
    <Card className="border-purple-200">
      <CardContent className="p-6">
        <blockquote className="text-sm text-gray-600 italic mb-4">
          "Working with MusicGift was amazing. They understood our story perfectly and created something magical!"
        </blockquote>
        <cite className="text-purple-600 font-medium">— Radu & Elena</cite>
      </CardContent>
    </Card>
  );
};

export default TestimonialSection;
