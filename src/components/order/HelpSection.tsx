
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, Clock } from 'lucide-react';

const HelpSection: React.FC = () => {
  return (
    <Card className="border-purple-200 bg-purple-50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-purple-900">Need Help?</h3>
        </div>
        <div className="space-y-3 text-sm text-purple-700">
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            +40 721 234 567
          </div>
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            info@musicgift.ro
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Mon-Fri: 9AM-6PM
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HelpSection;
