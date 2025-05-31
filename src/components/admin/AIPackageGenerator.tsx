import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Wand2, Eye, Check, X, Loader2, Mic, Calendar, FileText, CheckSquare, Languages } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

type FieldType = Database['public']['Enums']['field_type'];
type PackageTagType = Database['public']['Enums']['package_tag_type'];

interface GeneratedPackage {
  generationId: string;
  generatedData: {
    package: {
      value: string;
      label_key: string;
      price: number;
      tagline_key?: string;
      description_key?: string;
      delivery_time_key?: string;
    };
    steps: Array<{
      step_number: number;
      title_key: string;
      step_order: number;
      fields: Array<{
        field_name: string;
        field_type: string;
        placeholder_key?: string;
        required: boolean;
        field_order: number;
        options?: string[];
      }>;
    }>;
    includes: Array<{
      include_key: string;
      include_order: number;
    }>;
    tags: Array<{
      tag_type: string;
      tag_label_key: string;
      styling_class: string;
    }>;
  };
}

const AIPackageGenerator = () => {
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isGeneratingTranslations, setIsGeneratingTranslations] = useState(false);
  const [generatedPackage, setGeneratedPackage] = useState<GeneratedPackage | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Helper function to get user-friendly field names in Romanian
  const getUserFriendlyFieldName = (fieldName: string): string => {
    const fieldNameMap: Record<string, string> = {
      'package': 'Pachetul selectat',
      'recipientName': 'Numele destinatarului',
      'relationship': 'Relația cu destinatarul',
      'occasion': 'Ocazia specială',
      'eventDate': 'Data evenimentului',
      'songLanguage': 'Limba cântecului',
      'pronunciationAudioRecipient': 'Pronunția numelui destinatarului',
      'story': 'Povestea voastră',
      'emotionalTone': 'Tonul emoțional dorit',
      'keyMoments': 'Momentele cheie',
      'specialWords': 'Cuvinte sau expresii speciale',
      'pronunciationAudioKeywords': 'Pronunția cuvintelor speciale',
      'musicStyle': 'Stilul muzical preferat',
      'referenceSong': 'Cântec de referință',
      'fullName': 'Numele complet',
      'email': 'Adresa de email',
      'phone': 'Numărul de telefon',
      'message': 'Mesajul dumneavoastră',
      'artistName': 'Numele artistului',
      'brandName': 'Numele brandului',
      'campaignPurpose': 'Scopul campaniei'
    };
    return fieldNameMap[fieldName] || fieldName;
  };

  // Helper function to get user-friendly placeholders in Romanian
  const getUserFriendlyPlaceholder = (fieldName: string, fieldType: string): string => {
    const placeholderMap: Record<string, string> = {
      'recipientName': 'ex. Maria Popescu',
      'relationship': 'Alegeți relația...',
      'occasion': 'Alegeți ocazia...',
      'eventDate': 'Selectați data evenimentului',
      'songLanguage': 'Alegeți limba...',
      'pronunciationAudioRecipient': 'Înregistrează pronunția corectă a numelui (maxim 30 secunde)',
      'story': 'Povestiți-ne despre relația voastră, momentele speciale împărțite, ce îl/o face unică...',
      'emotionalTone': 'Alegeți tonul emoțional...',
      'keyMoments': 'Descrieți momentele importante din relația voastră...',
      'specialWords': 'Cuvinte, expresii sau glume interne care au sens special pentru voi...',
      'pronunciationAudioKeywords': 'Înregistrează pronunția cuvintelor speciale (maxim 30 secunde)',
      'musicStyle': 'Alegeți stilul muzical...',
      'referenceSong': 'ex. https://www.youtube.com/watch?v=...',
      'fullName': 'ex. Ion Popescu',
      'email': 'ex. ion.popescu@email.com',
      'phone': 'ex. +40712345678',
      'message': 'Scrieți mesajul dumneavoastră aici...',
      'artistName': 'ex. Maria Ionescu',
      'brandName': 'ex. Compania Mea SRL',
      'campaignPurpose': 'Descrieți scopul și obiectivele campaniei...'
    };
    
    if (fieldType === 'audio-recorder') {
      return 'Înregistrează audio (maxim 30 secunde)';
    }
    
    return placeholderMap[fieldName] || 'Introduceți informația solicitată...';
  };

  // Helper function to get user-friendly field type names in Romanian
  const getUserFriendlyFieldType = (fieldType: string): string => {
    const typeMap: Record<string, string> = {
      'text': 'Text scurt',
      'textarea': 'Text lung',
      'email': 'Adresă email',
      'tel': 'Număr telefon',
      'select': 'Alegere din listă',
      'checkbox': 'Bifă',
      'checkbox-group': 'Opțiuni multiple',
      'date': 'Dată',
      'url': 'Link web',
      'file': 'Fișier',
      'audio-recorder': 'Înregistrare audio'
    };
    return typeMap[fieldType] || fieldType;
  };

  // Helper function to get field type icon
  const getFieldTypeIcon = (fieldType: string) => {
    switch (fieldType) {
      case 'audio-recorder':
        return <Mic className="w-4 h-4" />;
      case 'date':
        return <Calendar className="w-4 h-4" />;
      case 'textarea':
        return <FileText className="w-4 h-4" />;
      case 'checkbox':
      case 'checkbox-group':
        return <CheckSquare className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // Helper function to map field types to valid database enums
  const mapFieldType = (fieldType: string): FieldType => {
    const typeMap: Record<string, FieldType> = {
      'text': 'text',
      'textarea': 'textarea',
      'email': 'email',
      'tel': 'tel',
      'phone': 'tel',
      'select': 'select',
      'checkbox': 'checkbox',
      'checkbox-group': 'checkbox-group',
      'radio': 'checkbox',
      'number': 'text',
      'date': 'date',
      'url': 'url',
      'file': 'file',
      'audio-recorder': 'file' // Map audio-recorder to file in database
    };
    return typeMap[fieldType] || 'text';
  };

  // Helper function to map tag types to valid database enums
  const mapTagType = (tagType: string): PackageTagType => {
    const typeMap: Record<string, PackageTagType> = {
      'popular': 'popular',
      'hot': 'hot',
      'discount': 'discount',
      'new': 'new',
      'limited': 'limited',
      'recommended': 'popular'
    };
    return typeMap[tagType] || 'new';
  };

  const extractTranslationKeys = (packageData: GeneratedPackage['generatedData']): string[] => {
    const keys = new Set<string>();
    
    // Package keys
    keys.add(packageData.package.label_key);
    if (packageData.package.tagline_key) keys.add(packageData.package.tagline_key);
    if (packageData.package.description_key) keys.add(packageData.package.description_key);
    if (packageData.package.delivery_time_key) keys.add(packageData.package.delivery_time_key);
    
    // Steps and fields keys
    packageData.steps.forEach(step => {
      keys.add(step.title_key);
      step.fields.forEach(field => {
        if (field.placeholder_key) keys.add(field.placeholder_key);
      });
    });
    
    // Includes keys
    packageData.includes.forEach(include => {
      keys.add(include.include_key);
    });
    
    // Tags keys
    packageData.tags.forEach(tag => {
      if (tag.tag_label_key) keys.add(tag.tag_label_key);
    });
    
    return Array.from(keys);
  };

  const generateTranslations = async (translationKeys: string[]) => {
    try {
      setIsGeneratingTranslations(true);
      
      const { data, error } = await supabase.functions.invoke('generate-translations', {
        body: { translationKeys }
      });

      if (error) throw error;

      console.log('Generated translations:', data);
      toast({ title: 'Traducerile au fost generate cu succes!' });
      
      return true;
    } catch (error) {
      console.error('Error generating translations:', error);
      toast({ 
        title: 'Eroare la generarea traducerilor', 
        description: error.message, 
        variant: 'destructive' 
      });
      return false;
    } finally {
      setIsGeneratingTranslations(false);
    }
  };

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast({ title: 'Descrierea este obligatorie', variant: 'destructive' });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-package-ai', {
        body: { description }
      });

      if (error) throw error;

      setGeneratedPackage(data);
      setShowPreview(true);
      toast({ title: 'Pachetul a fost generat cu succes!' });
    } catch (error) {
      console.error('Error generating package:', error);
      toast({ title: 'Eroare la generarea pachetului', description: error.message, variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreatePackage = async () => {
    if (!generatedPackage) return;

    setIsCreating(true);
    try {
      const { generatedData } = generatedPackage;

      // First, generate and save translations
      const translationKeys = extractTranslationKeys(generatedData);
      console.log('Generating translations for keys:', translationKeys);
      
      const translationsSuccess = await generateTranslations(translationKeys);
      if (!translationsSuccess) {
        throw new Error('Failed to generate translations');
      }

      // Create package
      const { data: packageData, error: packageError } = await supabase
        .from('package_info')
        .insert(generatedData.package)
        .select()
        .single();

      if (packageError) throw packageError;

      // Create steps and fields
      for (const step of generatedData.steps) {
        const { data: stepData, error: stepError } = await supabase
          .from('steps')
          .insert({
            package_id: packageData.id,
            step_number: step.step_number,
            title_key: step.title_key,
            step_order: step.step_order,
            is_active: true
          })
          .select()
          .single();

        if (stepError) throw stepError;

        // Create fields for this step
        for (const field of step.fields) {
          const { error: fieldError } = await supabase
            .from('step_fields')
            .insert({
              step_id: stepData.id,
              field_name: field.field_name,
              field_type: mapFieldType(field.field_type),
              placeholder_key: field.placeholder_key,
              required: field.required,
              field_order: field.field_order,
              options: field.options ? JSON.stringify(field.options) : null
            });

          if (fieldError) throw fieldError;
        }
      }

      // Create package includes
      for (const include of generatedData.includes) {
        const { error: includeError } = await supabase
          .from('package_includes')
          .insert({
            package_id: packageData.id,
            include_key: include.include_key,
            include_order: include.include_order
          });

        if (includeError) throw includeError;
      }

      // Create package tags
      for (const tag of generatedData.tags) {
        const { error: tagError } = await supabase
          .from('package_tags')
          .insert({
            package_id: packageData.id,
            tag_type: mapTagType(tag.tag_type),
            tag_label_key: tag.tag_label_key,
            styling_class: tag.styling_class
          });

        if (tagError) throw tagError;
      }

      // Update generation status
      await supabase
        .from('ai_package_generations')
        .update({ 
          status: 'created',
          package_id: packageData.id
        })
        .eq('id', generatedPackage.generationId);

      toast({ title: 'Pachetul și traducerile au fost create cu succes!' });
      
      // Reset form
      setDescription('');
      setGeneratedPackage(null);
      setShowPreview(false);

    } catch (error) {
      console.error('Error creating package:', error);
      toast({ title: 'Eroare la crearea pachetului', description: error.message, variant: 'destructive' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleReject = () => {
    setGeneratedPackage(null);
    setShowPreview(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Wand2 className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold">Generator AI pentru Pachete</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generează Pachet cu AI</CardTitle>
          <p className="text-sm text-gray-600">
            Descrie pachetul pe care vrei să îl creezi și AI-ul va genera automat structura completă cu traduceri în română.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="description">Descrierea Pachetului *</Label>
            <Textarea
              id="description"
              placeholder="Descrie pachetul/serviciul pe care dorești să îl creezi. De exemplu: 'Un pachet premium pentru nunți care include cântec personalizat, videoclip profesional și distribuție pe Spotify, cu preț de 1200 RON și livrare în 10 zile'"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Includeți detalii despre: tipul serviciului, prețul aproximativ, timpul de livrare, și orice cerințe speciale.
            </p>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !description.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Se generează pachetul...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generează Pachet cu AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {showPreview && generatedPackage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Previzualizare Pachet Generat</span>
              {isGeneratingTranslations && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <Languages className="w-4 h-4" />
                  <span className="text-sm">Generez traduceri...</span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {/* Package Info */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-lg mb-3 text-purple-800">📦 Informații Pachet</h3>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex justify-between">
                      <strong>Nume Pachet:</strong> 
                      <span className="text-purple-600">{generatedPackage.generatedData.package.label_key}</span>
                    </div>
                    <div className="flex justify-between">
                      <strong>Preț:</strong> 
                      <span className="text-green-600 font-bold">{generatedPackage.generatedData.package.price} RON</span>
                    </div>
                    {generatedPackage.generatedData.package.tagline_key && (
                      <div>
                        <strong>Slogan:</strong> 
                        <p className="text-gray-700 italic mt-1">{generatedPackage.generatedData.package.tagline_key}</p>
                      </div>
                    )}
                    {generatedPackage.generatedData.package.delivery_time_key && (
                      <div className="flex justify-between">
                        <strong>Timp Livrare:</strong> 
                        <span className="text-blue-600">{generatedPackage.generatedData.package.delivery_time_key}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Steps */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    🚀 Pași de Completare ({generatedPackage.generatedData.steps.length})
                  </h3>
                  {generatedPackage.generatedData.steps.map((step, idx) => (
                    <Card key={idx} className="mb-4 border-l-4 border-l-purple-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center space-x-2">
                          <span className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                            {step.step_number}
                          </span>
                          <span>{step.title_key}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {step.fields.map((field, fieldIdx) => (
                            <div key={fieldIdx} className="bg-gray-50 p-3 rounded-md">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  {getFieldTypeIcon(field.field_type)}
                                  <span className="font-medium text-gray-800">
                                    {getUserFriendlyFieldName(field.field_name)}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="text-xs">
                                    {getUserFriendlyFieldType(field.field_type)}
                                  </Badge>
                                  {field.required && <Badge variant="destructive" className="text-xs">Obligatoriu</Badge>}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 italic">
                                "{getUserFriendlyPlaceholder(field.field_name, field.field_type)}"
                              </p>
                              {field.field_type === 'audio-recorder' && (
                                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                                  <Mic className="w-3 h-3 inline mr-1" />
                                  Înregistrare audio cu durată maximă de 30 secunde
                                </div>
                              )}
                              {field.options && field.options.length > 0 && (
                                <div className="mt-2">
                                  <span className="text-xs text-gray-500">Opțiuni disponibile:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {field.options.slice(0, 3).map((option, optIdx) => (
                                      <Badge key={optIdx} variant="secondary" className="text-xs">
                                        {option}
                                      </Badge>
                                    ))}
                                    {field.options.length > 3 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{field.options.length - 3} mai multe
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Separator />

                {/* Includes */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-lg mb-3 text-green-800 flex items-center">
                    ✨ Ce Include Pachetul
                  </h3>
                  <ul className="list-none space-y-2">
                    {generatedPackage.generatedData.includes.map((include, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-green-700">{include.include_key}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                {/* Tags */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    🏷️ Etichete Pachet
                  </h3>
                  <div className="flex space-x-2 flex-wrap">
                    {generatedPackage.generatedData.tags.map((tag, idx) => (
                      <Badge key={idx} className={`${tag.styling_class} mb-2`}>
                        {tag.tag_label_key}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className="flex space-x-3 pt-4 border-t">
              <Button 
                onClick={handleCreatePackage} 
                disabled={isCreating || isGeneratingTranslations} 
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Se creează pachetul...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Creează Pachetul + Traduceri
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleReject} 
                disabled={isCreating || isGeneratingTranslations} 
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-2" />
                Respinge & Încearcă Din Nou
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIPackageGenerator;
