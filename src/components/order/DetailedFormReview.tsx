
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Music, User, Heart, Calendar, MessageSquare, Building } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DetailedFormReviewProps {
  formData: Record<string, any>;
}

const DetailedFormReview: React.FC<DetailedFormReviewProps> = ({ formData }) => {
  const { t } = useLanguage();

  // Field name to translation key mapping (from FormFieldRenderer)
  const fieldNameToLabelKey: Record<string, string> = {
    song: 'song',
    artist: 'artist',
    recipientName: 'recipientName',
    message: 'message',
    occasion: 'occasion',
    music: 'music',
    business: 'business',
    wedding: 'wedding',
    baptism: 'baptism',
    customerName: 'customerName',
    date: 'date',
    phoneNumber: 'phoneNumber',
    email: 'email',
    address: 'address',
    city: 'city',
    companyName: 'companyName',
    vatNumber: 'vatNumber',
    registrationNumber: 'registrationNumber',
    legalAddress: 'legalAddress',
    invoiceType: 'invoiceType'
  };

  const formatFieldValue = (key: string, value: any): string => {
    if (!value) return '';
    
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    if (typeof value === 'object' && value.url) {
      return value.fileName || 'File uploaded';
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    return String(value);
  };

  const getFieldIcon = (key: string) => {
    if (['song', 'artist', 'music'].includes(key)) return <Music className="w-4 h-4" />;
    if (['recipientName', 'customerName'].includes(key)) return <User className="w-4 h-4" />;
    if (['message'].includes(key)) return <MessageSquare className="w-4 h-4" />;
    if (['occasion', 'wedding', 'baptism'].includes(key)) return <Heart className="w-4 h-4" />;
    if (['date'].includes(key)) return <Calendar className="w-4 h-4" />;
    if (['business', 'companyName'].includes(key)) return <Building className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const categorizeFields = () => {
    const categories = {
      songDetails: ['song', 'artist', 'music'],
      recipientInfo: ['recipientName', 'customerName'],
      messageAndOccasion: ['message', 'occasion', 'wedding', 'baptism'],
      eventDetails: ['date', 'phoneNumber'],
      businessInfo: ['business', 'companyName', 'vatNumber', 'registrationNumber', 'legalAddress'],
      other: []
    };

    const categorizedData: Record<string, Array<{key: string, value: any}>> = {};
    
    Object.entries(formData).forEach(([key, value]) => {
      if (!value || key === 'fullName' || key === 'email' || key === 'phone' || key === 'address' || key === 'city' || key === 'invoiceType') {
        return; // Skip empty values and basic info already shown elsewhere
      }

      let categoryFound = false;
      Object.entries(categories).forEach(([categoryKey, fields]) => {
        if (fields.includes(key)) {
          if (!categorizedData[categoryKey]) categorizedData[categoryKey] = [];
          categorizedData[categoryKey].push({ key, value });
          categoryFound = true;
        }
      });

      if (!categoryFound) {
        if (!categorizedData.other) categorizedData.other = [];
        categorizedData.other.push({ key, value });
      }
    });

    return categorizedData;
  };

  const categorizedData = categorizeFields();
  const hasDetailedData = Object.keys(categorizedData).length > 0;

  if (!hasDetailedData) {
    return null;
  }

  const categoryTitles = {
    songDetails: 'Song Details',
    recipientInfo: 'Recipient Information',
    messageAndOccasion: 'Message & Occasion',
    eventDetails: 'Event Details',
    businessInfo: 'Business Information',
    other: 'Additional Information'
  };

  return (
    <Card className="bg-white/10 border-white/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-white text-base">
          <FileText className="w-4 h-4" />
          {t('detailedOrderInformation', 'Detailed Order Information')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {Object.entries(categorizedData).map(([categoryKey, fields]) => (
          <div key={categoryKey} className="space-y-2">
            <h4 className="text-sm font-medium text-orange-300 flex items-center gap-2">
              {getFieldIcon(categoryKey)}
              {t(categoryKey, categoryTitles[categoryKey as keyof typeof categoryTitles] || categoryKey)}
            </h4>
            <div className="space-y-1 pl-6">
              {fields.map(({ key, value }) => (
                <div key={key} className="flex justify-between items-start text-sm">
                  <span className="text-white/70 capitalize">
                    {t(fieldNameToLabelKey[key] || key, key.replace(/([A-Z])/g, ' $1').trim())}:
                  </span>
                  <span className="text-white/90 text-right max-w-[60%] break-words">
                    {formatFieldValue(key, value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DetailedFormReview;
