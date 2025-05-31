
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GeneratedPackageData {
  package_info: {
    value: string;
    label_key: string;
    price: number;
    tagline_key?: string;
    description_key?: string;
    delivery_time_key?: string;
  };
  tags?: Array<{
    tag_type: string;
    tag_label_key?: string;
    styling_class?: string;
  }>;
  includes?: Array<{
    include_key: string;
    include_order: number;
  }>;
  steps?: Array<{
    step_number: number;
    title_key: string;
    step_order: number;
    fields: Array<{
      field_name: string;
      field_type: string;
      placeholder_key?: string;
      required: boolean;
      field_order: number;
      options?: Array<{ value: string; label_key: string; }>;
    }>;
  }>;
  translations?: {
    [languageCode: string]: {
      [key: string]: string;
    };
  };
}

interface AIPackageDataProcessorProps {
  generatedData: GeneratedPackageData;
  onSuccess: (packageId: string) => void;
  onError: (error: string) => void;
}

// Valid enum values from the database
const VALID_TAG_TYPES = ['popular', 'hot', 'discount', 'new', 'limited'] as const;
const VALID_FIELD_TYPES = [
  'text', 'email', 'tel', 'textarea', 'select', 'checkbox', 
  'checkbox-group', 'date', 'url', 'file', 'audio-recorder'
] as const;

type ValidTagType = typeof VALID_TAG_TYPES[number];
type ValidFieldType = typeof VALID_FIELD_TYPES[number];

// Helper functions to validate and convert enum values
const validateTagType = (tagType: string): ValidTagType => {
  return VALID_TAG_TYPES.includes(tagType as ValidTagType) 
    ? tagType as ValidTagType 
    : 'popular';
};

const validateFieldType = (fieldType: string): ValidFieldType => {
  return VALID_FIELD_TYPES.includes(fieldType as ValidFieldType) 
    ? fieldType as ValidFieldType 
    : 'text';
};

const AIPackageDataProcessor: React.FC<AIPackageDataProcessorProps> = ({
  generatedData,
  onSuccess,
  onError
}) => {
  const { toast } = useToast();

  const processGeneratedData = async () => {
    try {
      console.log('Processing generated data:', generatedData);

      // Validate required data
      if (!generatedData.package_info) {
        throw new Error('Package info is missing from generated data');
      }

      // Start transaction by creating package
      const { data: packageData, error: packageError } = await supabase
        .from('package_info')
        .insert({
          value: generatedData.package_info.value,
          label_key: generatedData.package_info.label_key,
          price: generatedData.package_info.price,
          tagline_key: generatedData.package_info.tagline_key,
          description_key: generatedData.package_info.description_key,
          delivery_time_key: generatedData.package_info.delivery_time_key,
        })
        .select()
        .single();

      if (packageError) {
        console.error('Error creating package:', packageError);
        throw new Error(`Failed to create package: ${packageError.message}`);
      }

      const packageId = packageData.id;
      console.log('Created package with ID:', packageId);

      // Create tags if provided
      if (generatedData.tags && generatedData.tags.length > 0) {
        const tagInserts = generatedData.tags.map(tag => ({
          package_id: packageId,
          tag_type: validateTagType(tag.tag_type),
          tag_label_key: tag.tag_label_key,
          styling_class: tag.styling_class,
        }));

        const { error: tagsError } = await supabase
          .from('package_tags')
          .insert(tagInserts);

        if (tagsError) {
          console.error('Error creating tags:', tagsError);
          // Don't throw - tags are optional
        }
      }

      // Create includes if provided
      if (generatedData.includes && generatedData.includes.length > 0) {
        const includeInserts = generatedData.includes.map(include => ({
          package_id: packageId,
          include_key: include.include_key,
          include_order: include.include_order,
        }));

        const { error: includesError } = await supabase
          .from('package_includes')
          .insert(includeInserts);

        if (includesError) {
          console.error('Error creating includes:', includesError);
          // Don't throw - includes are optional
        }
      }

      // Create steps and fields if provided
      if (generatedData.steps && generatedData.steps.length > 0) {
        for (const step of generatedData.steps) {
          const { data: stepData, error: stepError } = await supabase
            .from('steps')
            .insert({
              package_id: packageId,
              step_number: step.step_number,
              title_key: step.title_key,
              step_order: step.step_order,
            })
            .select()
            .single();

          if (stepError) {
            console.error('Error creating step:', stepError);
            throw new Error(`Failed to create step: ${stepError.message}`);
          }

          // Create fields for this step
          if (step.fields && step.fields.length > 0) {
            const fieldInserts = step.fields.map(field => ({
              step_id: stepData.id,
              field_name: field.field_name,
              field_type: validateFieldType(field.field_type),
              placeholder_key: field.placeholder_key,
              required: field.required,
              field_order: field.field_order,
              options: field.options ? JSON.stringify(field.options) : null,
            }));

            const { error: fieldsError } = await supabase
              .from('step_fields')
              .insert(fieldInserts);

            if (fieldsError) {
              console.error('Error creating fields:', fieldsError);
              throw new Error(`Failed to create fields: ${fieldsError.message}`);
            }
          }
        }
      }

      // Create translations if provided
      if (generatedData.translations) {
        const translationInserts = [];
        
        for (const [languageCode, translations] of Object.entries(generatedData.translations)) {
          for (const [key, translation] of Object.entries(translations)) {
            translationInserts.push({
              language_code: languageCode,
              key_name: key,
              translation: translation,
            });
          }
        }

        if (translationInserts.length > 0) {
          const { error: translationsError } = await supabase
            .from('translations')
            .upsert(translationInserts, {
              onConflict: 'language_code,key_name'
            });

          if (translationsError) {
            console.error('Error creating translations:', translationsError);
            // Don't throw - translations are optional
          }
        }
      }

      console.log('Successfully processed all generated data');
      onSuccess(packageId);

      toast({
        title: 'Package Created Successfully',
        description: 'AI-generated package has been saved to the database.',
      });

    } catch (error) {
      console.error('Error processing generated data:', error);
      onError(error.message);
      
      toast({
        title: 'Error Creating Package',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Auto-process when component mounts
  React.useEffect(() => {
    processGeneratedData();
  }, []);

  return null; // This is a processing component, no UI needed
};

export default AIPackageDataProcessor;
