import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, Pause, RotateCcw } from 'lucide-react';
import { packages, languages, addons, relationships, occasions, emotionalTones, musicStyles } from '@/data/packages';

interface FormFieldRendererProps {
  field: any;
  formData: any;
  selectedAddons: string[];
  updateFormData: (field: string, value: any) => void;
  handleAddonChange: (addonId: string, checked: boolean) => void;
}

const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({
  field,
  formData,
  selectedAddons,
  updateFormData,
  handleAddonChange
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingStates, setRecordingStates] = useState<{[key: string]: {
    isRecording: boolean;
    audioBlob: Blob | null;
    isPlaying: boolean;
    recordingTime: number;
  }}>({});
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRefs = useRef<{[key: string]: MediaRecorder | null}>({});
  const audioRefs = useRef<{[key: string]: HTMLAudioElement | null}>({});
  const recordingTimerRefs = useRef<{[key: string]: NodeJS.Timeout | null}>({});

  const MAX_RECORDING_TIME = 45; // 45 seconds

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      Object.values(recordingTimerRefs.current).forEach(timer => {
        if (timer) clearInterval(timer);
      });
    };
  }, []);

  const getRecordingState = (fieldName: string) => {
    return recordingStates[fieldName] || {
      isRecording: false,
      audioBlob: null,
      isPlaying: false,
      recordingTime: 0
    };
  };

  const updateRecordingState = (fieldName: string, updates: Partial<typeof recordingStates[string]>) => {
    setRecordingStates(prev => ({
      ...prev,
      [fieldName]: { ...getRecordingState(fieldName), ...updates }
    }));
  };

  const startRecordingForField = async (fieldName: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRefs.current[fieldName] = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        updateRecordingState(fieldName, { audioBlob: blob });
        updateFormData(fieldName, blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      updateRecordingState(fieldName, { isRecording: true, recordingTime: 0 });

      // Start timer
      recordingTimerRefs.current[fieldName] = setInterval(() => {
        const currentState = getRecordingState(fieldName);
        if (currentState.recordingTime >= MAX_RECORDING_TIME - 1) {
          stopRecordingForField(fieldName);
          updateRecordingState(fieldName, { recordingTime: MAX_RECORDING_TIME });
        } else {
          updateRecordingState(fieldName, { recordingTime: currentState.recordingTime + 1 });
        }
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecordingForField = (fieldName: string) => {
    const mediaRecorder = mediaRecorderRefs.current[fieldName];
    const state = getRecordingState(fieldName);
    
    if (mediaRecorder && state.isRecording) {
      mediaRecorder.stop();
      updateRecordingState(fieldName, { isRecording: false });
      
      const timer = recordingTimerRefs.current[fieldName];
      if (timer) {
        clearInterval(timer);
        recordingTimerRefs.current[fieldName] = null;
      }
    }
  };

  const playAudioForField = (fieldName: string) => {
    const state = getRecordingState(fieldName);
    if (state.audioBlob) {
      const audioUrl = URL.createObjectURL(state.audioBlob);
      audioRefs.current[fieldName] = new Audio(audioUrl);
      audioRefs.current[fieldName]!.play();
      updateRecordingState(fieldName, { isPlaying: true });

      audioRefs.current[fieldName]!.onended = () => {
        updateRecordingState(fieldName, { isPlaying: false });
        URL.revokeObjectURL(audioUrl);
      };
    }
  };

  const pauseAudioForField = (fieldName: string) => {
    const audio = audioRefs.current[fieldName];
    if (audio) {
      audio.pause();
      updateRecordingState(fieldName, { isPlaying: false });
    }
  };

  const reRecordForField = (fieldName: string) => {
    updateRecordingState(fieldName, {
      audioBlob: null,
      recordingTime: 0,
      isPlaying: false
    });
    updateFormData(fieldName, null);
    
    const audio = audioRefs.current[fieldName];
    if (audio) {
      audio.pause();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddonChangeWithMutualExclusion = (addonId: string, checked: boolean) => {
    // Handle mutual exclusion between commercialRights and distributieMangoRecords
    if (checked) {
      if (addonId === 'commercialRights' && selectedAddons.includes('distributieMangoRecords')) {
        // Remove distributieMangoRecords if commercialRights is selected
        handleAddonChange('distributieMangoRecords', false);
      } else if (addonId === 'distributieMangoRecords' && selectedAddons.includes('commercialRights')) {
        // Remove commercialRights if distributieMangoRecords is selected
        handleAddonChange('commercialRights', false);
      }
    }
    
    // Apply the original change
    handleAddonChange(addonId, checked);
  };

  const isAddonDisabled = (addonId: string) => {
    // Disable commercialRights if distributieMangoRecords is selected
    if (addonId === 'commercialRights' && selectedAddons.includes('distributieMangoRecords')) {
      return true;
    }
    // Disable distributieMangoRecords if commercialRights is selected
    if (addonId === 'distributieMangoRecords' && selectedAddons.includes('commercialRights')) {
      return true;
    }
    return false;
  };

  const renderAudioRecordingField = (fieldName: string) => {
    const state = getRecordingState(fieldName);
    
    return (
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">
              Timp: {formatTime(state.recordingTime)} / {formatTime(MAX_RECORDING_TIME)}
            </span>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(state.recordingTime / MAX_RECORDING_TIME) * 100}%` }} 
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {!state.isRecording && !state.audioBlob && (
              <Button
                type="button"
                onClick={() => startRecordingForField(fieldName)}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Mic className="w-4 h-4 mr-2" />
                Începe înregistrarea
              </Button>
            )}

            {state.isRecording && (
              <Button
                type="button"
                onClick={() => stopRecordingForField(fieldName)}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                <Square className="w-4 h-4 mr-2" />
                Oprește înregistrarea
              </Button>
            )}

            {state.audioBlob && !state.isRecording && (
              <>
                <Button
                  type="button"
                  onClick={state.isPlaying ? () => pauseAudioForField(fieldName) : () => playAudioForField(fieldName)}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  {state.isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pauză
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Redă
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  onClick={() => reRecordForField(fieldName)}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Înregistrează din nou
                </Button>
              </>
            )}
          </div>

          {state.audioBlob && (
            <p className="text-xs text-green-600 mt-2 flex items-center">
              ✓ Înregistrarea audio a fost salvată cu succes
            </p>
          )}

          <p className="text-xs text-gray-500 mt-2">
            Limita de timp: 45 secunde. Înregistrează pronunția corectă.
          </p>
        </div>
      </div>
    );
  };

  const renderField = () => {
    switch (field.type) {
      case 'select':
        if (field.name === 'package') {
          return (
            <Select onValueChange={(value) => updateFormData(field.name, value)} value={formData[field.name]}>
              <SelectTrigger className="h-14 bg-white border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-all duration-200 shadow-sm hover:shadow-md">
                <SelectValue placeholder={field.placeholder} className="text-gray-700" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 shadow-xl rounded-xl z-50">
                {packages.map((pkg) => (
                  <SelectItem 
                    key={pkg.value} 
                    value={pkg.value}
                    className="hover:bg-purple-50 focus:bg-purple-50 cursor-pointer py-3 px-4 transition-colors duration-150"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {pkg.value === 'personal' ? '🎁' : 
                         pkg.value === 'business' ? '💼' : 
                         pkg.value === 'premium' ? '🌟' : 
                         pkg.value === 'artist' ? '🎤' : 
                         pkg.value === 'instrumental' ? '🎶' : 
                         pkg.value === 'remix' ? '🔁' : '🎁'}
                      </span>
                      <span className="font-medium text-gray-800">{pkg.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        if (field.name === 'songLanguage') {
          return (
            <Select onValueChange={(value) => updateFormData(field.name, value)} value={formData[field.name]}>
              <SelectTrigger className="h-14 bg-white border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-all duration-200 shadow-sm hover:shadow-md">
                <SelectValue placeholder={field.placeholder} className="text-gray-700" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 shadow-xl rounded-xl z-50">
                {languages.map((lang) => (
                  <SelectItem 
                    key={lang.value} 
                    value={lang.value}
                    className="hover:bg-purple-50 focus:bg-purple-50 cursor-pointer py-3 px-4 transition-colors duration-150"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium text-gray-800">{lang.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        if (field.name === 'relationship') {
          return (
            <Select onValueChange={(value) => updateFormData(field.name, value)} value={formData[field.name]}>
              <SelectTrigger className="h-14 bg-white border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-all duration-200 shadow-sm hover:shadow-md">
                <SelectValue placeholder={field.placeholder} className="text-gray-700" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 shadow-xl rounded-xl z-50">
                {relationships.map((rel) => (
                  <SelectItem 
                    key={rel.value} 
                    value={rel.value}
                    className="hover:bg-purple-50 focus:bg-purple-50 cursor-pointer py-3 px-4 transition-colors duration-150"
                  >
                    <span className="font-medium text-gray-800">{rel.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        if (field.name === 'occasion') {
          return (
            <Select onValueChange={(value) => updateFormData(field.name, value)} value={formData[field.name]}>
              <SelectTrigger className="h-14 bg-white border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-all duration-200 shadow-sm hover:shadow-md">
                <SelectValue placeholder={field.placeholder} className="text-gray-700" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 shadow-xl rounded-xl z-50">
                {occasions.map((occasion) => (
                  <SelectItem 
                    key={occasion.value} 
                    value={occasion.value}
                    className="hover:bg-purple-50 focus:bg-purple-50 cursor-pointer py-3 px-4 transition-colors duration-150"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{occasion.emoji}</span>
                      <span className="font-medium text-gray-800">{occasion.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        if (field.name === 'emotionalTone') {
          return (
            <Select onValueChange={(value) => updateFormData(field.name, value)} value={formData[field.name]}>
              <SelectTrigger className="h-14 bg-white border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-all duration-200 shadow-sm hover:shadow-md">
                <SelectValue placeholder={field.placeholder} className="text-gray-700" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 shadow-xl rounded-xl z-50">
                {emotionalTones.map((tone) => (
                  <SelectItem 
                    key={tone.value} 
                    value={tone.value}
                    className="hover:bg-purple-50 focus:bg-purple-50 cursor-pointer py-3 px-4 transition-colors duration-150"
                  >
                    <span className="font-medium text-gray-800">{tone.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        if (field.name === 'musicStyle') {
          return (
            <Select onValueChange={(value) => updateFormData(field.name, value)} value={formData[field.name]}>
              <SelectTrigger className="h-14 bg-white border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-all duration-200 shadow-sm hover:shadow-md">
                <SelectValue placeholder={field.placeholder} className="text-gray-700" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 shadow-xl rounded-xl z-50">
                {musicStyles.map((style) => (
                  <SelectItem 
                    key={style.value} 
                    value={style.value}
                    className="hover:bg-purple-50 focus:bg-purple-50 cursor-pointer py-3 px-4 transition-colors duration-150"
                  >
                    <span className="font-medium text-gray-800">{style.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        break;

      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={(e) => updateFormData(field.name, e.target.value)}
            className="min-h-[120px] resize-none border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-all duration-200"
          />
        );

      case 'file':
        // Handle audio recording for pronunciation fields
        if (field.name === 'pronunciationAudio_recipient' || field.name === 'pronunciationAudio_keywords') {
          return renderAudioRecordingField(field.name);
        }
        
        return (
          <Input
            type="file"
            accept="audio/*"
            onChange={(e) => updateFormData(field.name, e.target.files?.[0])}
            className="h-12 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-all duration-200"
          />
        );

      case 'url':
        return (
          <Input
            type="url"
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={(e) => updateFormData(field.name, e.target.value)}
            className="h-12 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-all duration-200"
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={(e) => updateFormData(field.name, e.target.value)}
            className="h-12 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-all duration-200"
          />
        );

      case 'checkbox-group':
        return (
          <div className="space-y-4">
            {field.options?.map((addonId: string) => {
              const addon = addons[addonId as keyof typeof addons];
              const isDisabled = isAddonDisabled(addonId);
              
              return addon ? (
                <div key={addonId}>
                  <div className={`flex items-center space-x-3 p-4 border-2 rounded-lg transition-all duration-200 ${
                    isDisabled 
                      ? 'border-gray-300 bg-gray-50 opacity-60' 
                      : 'border-gray-200 hover:bg-purple-50 hover:border-purple-300'
                  }`}>
                    <Checkbox
                      id={addonId}
                      checked={selectedAddons.includes(addonId)}
                      onCheckedChange={(checked) => handleAddonChangeWithMutualExclusion(addonId, checked as boolean)}
                      disabled={isDisabled}
                      className="border-2"
                    />
                    <Label htmlFor={addonId} className={`flex-1 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                      <span className="font-medium">{addon.label}</span>
                      <span className="text-purple-600 ml-2 font-semibold">+{addon.price} RON</span>
                      {isDisabled && (
                        <span className="block text-xs text-gray-500 mt-1">
                          {addonId === 'commercialRights' 
                            ? 'Nu poate fi selectat cu Distribuție Mango Records' 
                            : 'Nu poate fi selectat cu Drepturi comerciale'}
                        </span>
                      )}
                    </Label>
                  </div>
                  
                  {/* Show file upload field when customVideo addon is selected */}
                  {addonId === 'customVideo' && selectedAddons.includes('customVideo') && (
                    <div className="mt-3 ml-8 space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Încarcă imagini sau video pentru videoclipul personalizat
                      </Label>
                      <Input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={(e) => updateFormData('customVideoFiles', e.target.files)}
                        className="h-12 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-all duration-200"
                      />
                      <p className="text-xs text-gray-500">
                        Acceptăm imagini (JPG, PNG) și video (MP4, MOV). Poți selecta mai multe fișiere.
                      </p>
                    </div>
                  )}

                  {/* Show audio recording field when audioMessageFromSender addon is selected */}
                  {addonId === 'audioMessageFromSender' && selectedAddons.includes('audioMessageFromSender') && (
                    <div className="mt-3 ml-8 space-y-4">
                      <Label className="text-sm font-medium text-gray-700">
                        Înregistrează mesajul tău audio personal
                      </Label>
                      
                      <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-gray-600">
                            Timp: {formatTime(recordingTime)} / {formatTime(MAX_RECORDING_TIME)}
                          </span>
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${(recordingTime / MAX_RECORDING_TIME) * 100}%` }} 
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          {!isRecording && !audioBlob && (
                            <Button
                              type="button"
                              onClick={startRecording}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              <Mic className="w-4 h-4 mr-2" />
                              Începe înregistrarea
                            </Button>
                          )}

                          {isRecording && (
                            <Button
                              type="button"
                              onClick={stopRecording}
                              className="bg-gray-500 hover:bg-gray-600 text-white"
                            >
                              <Square className="w-4 h-4 mr-2" />
                              Oprește înregistrarea
                            </Button>
                          )}

                          {audioBlob && !isRecording && (
                            <>
                              <Button
                                type="button"
                                onClick={isPlaying ? pauseAudio : playAudio}
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                {isPlaying ? (
                                  <>
                                    <Pause className="w-4 h-4 mr-2" />
                                    Pauză
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-4 h-4 mr-2" />
                                    Redă
                                  </>
                                )}
                              </Button>

                              <Button
                                type="button"
                                onClick={reRecord}
                                variant="outline"
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Înregistrează din nou
                              </Button>
                            </>
                          )}
                        </div>

                        {audioBlob && (
                          <p className="text-xs text-green-600 mt-2 flex items-center">
                            ✓ Mesajul audio a fost înregistrat cu succes
                          </p>
                        )}

                        <p className="text-xs text-gray-500 mt-2">
                          Limita de timp: 45 secunde. Mesajul tău va fi incorporat în piesa finală.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : null;
            })}
          </div>
        );

      case 'checkbox':
        return (
          <div className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all duration-200">
            <Checkbox
              id={field.name}
              checked={formData[field.name]}
              onCheckedChange={(checked) => updateFormData(field.name, checked)}
              className="mt-1 border-2"
            />
            <Label htmlFor={field.name} className="text-sm leading-relaxed cursor-pointer">
              {field.placeholder}
            </Label>
          </div>
        );

      default:
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={(e) => updateFormData(field.name, e.target.value)}
            className="h-12 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-all duration-200"
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        {field.placeholder} {field.required && <span className="text-red-500">*</span>}
      </Label>
      {renderField()}
    </div>
  );
};

export default FormFieldRenderer;
