
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Play, Pause } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FormDataRendererProps {
  formData: any;
}

const FormDataRenderer = ({ formData }: FormDataRendererProps) => {
  const { t } = useLanguage();
  const [playingAudio, setPlayingAudio] = React.useState<string | null>(null);

  // Field key to translation mapping
  const getFieldLabel = (key: string): string => {
    const fieldMappings: Record<string, string> = {
      // Basic fields
      recipientName: t('recipientName'),
      fullName: t('fullName'),
      email: t('email'),
      phone: t('phone'),
      songTheme: t('songTheme'),
      songLanguage: t('songLanguage'),
      musicStyle: t('musicStyle'),
      emotionalTone: t('emotionalTone'),
      story: t('story'),
      relationship: t('relationship'),
      occasion: t('occasion'),
      eventDate: t('eventDate'),
      
      // Business fields
      businessName: t('businessName'),
      businessIndustry: t('businessIndustry'),
      businessValues: t('businessValues'),
      companySize: t('companySize'),
      targetMarket: t('targetMarket'),
      brandPersonality: t('brandPersonality'),
      
      // Recipient details
      recipientAge: t('recipientAge'),
      recipientPersonality: t('recipientPersonality'),
      favoriteGenre: t('favoriteGenre'),
      hobbies: t('hobbies'),
      
      // Song requirements
      songPurpose: t('songPurpose'),
      targetAudience: t('targetAudience'),
      keyMessages: t('keyMessages'),
      
      // Couple details
      coupleNames: t('coupleNames'),
      relationshipDuration: t('relationshipDuration'),
      weddingDate: t('weddingDate'),
      loveStory: t('loveStory'),
      
      // Child information
      childName: t('childName'),
      childAge: t('childAge'),
      parentsNames: t('parentsNames'),
      baptismDate: t('baptismDate'),
      
      // Voice preferences
      voicePreference: t('voicePreference'),
      vocalPreference: t('selectVocalPreference'),
      
      // Special fields
      addonFieldValues: t('selectAddons'),
      uploadedFiles: t('uploadedFiles'),
      savedAudio: t('savedAudio'),
      
      // Legal fields
      acceptMentionObligation: t('acceptMentionObligation'),
      acceptDistribution: t('acceptDistribution'),
      finalNote: t('finalNote'),
    };

    return fieldMappings[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const formatValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400 italic">Not provided</span>;
    }

    if (typeof value === 'boolean') {
      return (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Yes" : "No"}
        </Badge>
      );
    }

    if (typeof value === 'string' && value.startsWith('data:audio/')) {
      return (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const audio = new Audio(value);
              if (playingAudio === value) {
                audio.pause();
                setPlayingAudio(null);
              } else {
                audio.play();
                setPlayingAudio(value);
                audio.onended = () => setPlayingAudio(null);
              }
            }}
          >
            {playingAudio === value ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {playingAudio === value ? "Pause" : "Play"} Audio
          </Button>
        </div>
      );
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="text-gray-400 italic">None</span>;
      }
      
      // Handle file uploads
      if (value[0] && typeof value[0] === 'object' && value[0].name) {
        return (
          <div className="space-y-2">
            {value.map((file: any, index: number) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium">{file.name}</span>
                {file.size && (
                  <Badge variant="secondary">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </Badge>
                )}
                {file.url && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={file.url} download={file.name}>
                      <Download className="w-3 h-3" />
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        );
      }
      
      return (
        <div className="space-y-1">
          {value.map((item, index) => (
            <Badge key={index} variant="secondary" className="mr-1">
              {String(item)}
            </Badge>
          ))}
        </div>
      );
    }

    if (typeof value === 'object') {
      return <FormDataSection data={value} />;
    }

    return <span>{String(value)}</span>;
  };

  const FormDataSection = ({ data }: { data: any }) => {
    if (!data || typeof data !== 'object') return null;

    return (
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="border-l-2 border-gray-200 pl-3">
            <div className="text-sm font-medium text-gray-700 mb-1">
              {getFieldLabel(key)}
            </div>
            <div className="text-sm">
              {formatValue(value)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!formData || typeof formData !== 'object') {
    return (
      <Card>
        <CardContent className="p-4">
          <span className="text-gray-400 italic">No form data available</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(formData).map(([key, value]) => (
        <Card key={key}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{getFieldLabel(key)}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {formatValue(value)}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FormDataRenderer;
