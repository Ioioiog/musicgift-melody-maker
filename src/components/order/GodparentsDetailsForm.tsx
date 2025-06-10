
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import AudioRecorder from './AudioRecorder';

interface GodparentsDetailsFormProps {
  values: any;
  onChange: (field: string, value: any) => void;
  addonKey: string;
}

const GodparentsDetailsForm: React.FC<GodparentsDetailsFormProps> = ({
  values,
  onChange,
  addonKey
}) => {
  const { t } = useLanguage();

  const handleFieldChange = (fieldName: string, value: any) => {
    const updatedValues = {
      ...values,
      [fieldName]: value
    };
    onChange(addonKey, updatedValues);
  };

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      handleFieldChange('godparentsNamesPronunciation', files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-white mb-2">
        {t('godparentsDetails', 'Godparents Details')}
      </h4>
      
      {/* Godparents Names */}
      <div className="space-y-1">
        <Label className="text-xs font-medium text-white">
          {t('godparentsNames', 'Godparents Names')} <span className="text-orange-400">*</span>
        </Label>
        <Input
          type="text"
          value={values?.godparentsNames || ''}
          onChange={(e) => handleFieldChange('godparentsNames', e.target.value)}
          placeholder={t('godparentsNamesPlaceholder', 'Enter the godparents\' names')}
          className="h-8 text-sm border-2 border-white/30 bg-white/10 focus:border-orange-500 focus:ring-orange-500 focus:bg-white/20 transition-all duration-200 text-white placeholder:text-white/60"
          required
        />
      </div>

      {/* Godparents Names Pronunciation */}
      <div className="space-y-1">
        <Label className="text-xs font-medium text-white">
          {t('godparentsNamesPronunciation', 'Godparents Names Pronunciation')} <span className="text-white/60">{t('optional', '(Optional)')}</span>
        </Label>
        <div className="bg-white/10 border-2 border-white/30 rounded-lg p-2">
          <AudioRecorder
            value={values?.godparentsNamesPronunciation || null}
            onChange={(audioFile) => handleFieldChange('godparentsNamesPronunciation', audioFile)}
            maxDuration={30}
          />
        </div>
      </div>

      {/* Godparents Relationship to Couple */}
      <div className="space-y-1">
        <Label className="text-xs font-medium text-white">
          {t('godparentsRelationshipToCouple', 'How do you know the godparents?')} <span className="text-orange-400">*</span>
        </Label>
        <Input
          type="text"
          value={values?.godparentsRelationshipToCouple || ''}
          onChange={(e) => handleFieldChange('godparentsRelationshipToCouple', e.target.value)}
          placeholder={t('godparentsRelationshipToCouplelaceholder', 'Describe your relationship with the godparents')}
          className="h-8 text-sm border-2 border-white/30 bg-white/10 focus:border-orange-500 focus:ring-orange-500 focus:bg-white/20 transition-all duration-200 text-white placeholder:text-white/60"
          required
        />
      </div>

      {/* Godparents Special Qualities */}
      <div className="space-y-1">
        <Label className="text-xs font-medium text-white">
          {t('godparentsSpecialQualities', 'What makes them special as godparents?')} <span className="text-orange-400">*</span>
        </Label>
        <Textarea
          value={values?.godparentsSpecialQualities || ''}
          onChange={(e) => handleFieldChange('godparentsSpecialQualities', e.target.value)}
          placeholder={t('godparentsSpecialQualitiesPlaceholder', 'Describe their special qualities and why they were chosen')}
          className="min-h-[60px] text-sm border-2 border-white/30 bg-white/10 focus:border-orange-500 focus:ring-orange-500 focus:bg-white/20 transition-all duration-200 text-white placeholder:text-white/60"
          required
        />
      </div>

      {/* Godparents Role in Wedding */}
      <div className="space-y-1">
        <Label className="text-xs font-medium text-white">
          {t('godparentsRoleInWedding', 'Their specific role in the ceremony')} <span className="text-orange-400">*</span>
        </Label>
        <Textarea
          value={values?.godparentsRoleInWedding || ''}
          onChange={(e) => handleFieldChange('godparentsRoleInWedding', e.target.value)}
          placeholder={t('godparentsRoleInWeddingPlaceholder', 'Describe their role during the wedding ceremony')}
          className="min-h-[60px] text-sm border-2 border-white/30 bg-white/10 focus:border-orange-500 focus:ring-orange-500 focus:bg-white/20 transition-all duration-200 text-white placeholder:text-white/60"
          required
        />
      </div>

      {/* Message to Godparents */}
      <div className="space-y-1">
        <Label className="text-xs font-medium text-white">
          {t('messageToGodparents', 'What you want to express to them')} <span className="text-orange-400">*</span>
        </Label>
        <Textarea
          value={values?.messageToGodparents || ''}
          onChange={(e) => handleFieldChange('messageToGodparents', e.target.value)}
          placeholder={t('messageToGodparentsPlaceholder', 'Your personal message to the godparents')}
          className="min-h-[60px] text-sm border-2 border-white/30 bg-white/10 focus:border-orange-500 focus:ring-orange-500 focus:bg-white/20 transition-all duration-200 text-white placeholder:text-white/60"
          required
        />
      </div>

      {/* Godparents Melody Style */}
      <div className="space-y-1">
        <Label className="text-xs font-medium text-white">
          {t('godparentsMelodyStyle', 'What style do you want the song to have?')} <span className="text-orange-400">*</span>
        </Label>
        <Textarea
          value={values?.godparentsMelodyStyle || ''}
          onChange={(e) => handleFieldChange('godparentsMelodyStyle', e.target.value)}
          placeholder={t('godparentsMelodyStylePlaceholder', 'Describe the style or share a YouTube link with similar song style')}
          className="min-h-[60px] text-sm border-2 border-white/30 bg-white/10 focus:border-orange-500 focus:ring-orange-500 focus:bg-white/20 transition-all duration-200 text-white placeholder:text-white/60"
          required
        />
      </div>
    </div>
  );
};

export default GodparentsDetailsForm;
