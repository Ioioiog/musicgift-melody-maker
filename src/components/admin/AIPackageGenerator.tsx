
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Wand2, Eye, Check, X, Loader2 } from 'lucide-react';
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
  const [formData, setFormData] = useState({
    description: '',
    price: '',
    deliveryTime: '',
    additionalRequirements: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [generatedPackage, setGeneratedPackage] = useState<GeneratedPackage | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

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
      'radio': 'checkbox', // Map radio to checkbox as radio isn't in enum
      'number': 'text', // Map number to text
      'date': 'date',
      'url': 'url',
      'file': 'file'
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
      'recommended': 'popular' // Map recommended to popular
    };
    return typeMap[tagType] || 'new';
  };

  const handleGenerate = async () => {
    if (!formData.description.trim()) {
      toast({ title: 'Description is required', variant: 'destructive' });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-package-ai', {
        body: {
          description: formData.description,
          price: formData.price ? parseInt(formData.price) : null,
          deliveryTime: formData.deliveryTime,
          additionalRequirements: formData.additionalRequirements
        }
      });

      if (error) throw error;

      setGeneratedPackage(data);
      setShowPreview(true);
      toast({ title: 'Package generated successfully!' });
    } catch (error) {
      console.error('Error generating package:', error);
      toast({ title: 'Error generating package', description: error.message, variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreatePackage = async () => {
    if (!generatedPackage) return;

    setIsCreating(true);
    try {
      const { generatedData } = generatedPackage;

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

      toast({ title: 'Package created successfully!' });
      
      // Reset form
      setFormData({
        description: '',
        price: '',
        deliveryTime: '',
        additionalRequirements: ''
      });
      setGeneratedPackage(null);
      setShowPreview(false);

    } catch (error) {
      console.error('Error creating package:', error);
      toast({ title: 'Error creating package', description: error.message, variant: 'destructive' });
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
        <h2 className="text-2xl font-bold">AI Package Generator</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Package with AI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="description">Package Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the package/service you want to create. Include what it includes, who it's for, and what the process should look like..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (RON)</Label>
              <Input
                id="price"
                type="number"
                placeholder="e.g., 500"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="deliveryTime">Delivery Time</Label>
              <Input
                id="deliveryTime"
                placeholder="e.g., 7-10 business days"
                value={formData.deliveryTime}
                onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="additionalRequirements">Additional Requirements</Label>
            <Textarea
              id="additionalRequirements"
              placeholder="Any specific fields, steps, or requirements for this package..."
              value={formData.additionalRequirements}
              onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
              rows={2}
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !formData.description.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Package...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Package with AI
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
              <span>Generated Package Preview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {/* Package Info */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Package Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Value:</strong> {generatedPackage.generatedData.package.value}</div>
                    <div><strong>Label:</strong> {generatedPackage.generatedData.package.label_key}</div>
                    <div><strong>Price:</strong> {generatedPackage.generatedData.package.price} RON</div>
                    <div><strong>Tagline:</strong> {generatedPackage.generatedData.package.tagline_key}</div>
                  </div>
                </div>

                <Separator />

                {/* Steps */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Steps ({generatedPackage.generatedData.steps.length})</h3>
                  {generatedPackage.generatedData.steps.map((step, idx) => (
                    <Card key={idx} className="mb-3">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          Step {step.step_number}: {step.title_key}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {step.fields.map((field, fieldIdx) => (
                            <div key={fieldIdx} className="flex items-center justify-between text-sm">
                              <span>{field.field_name}</span>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline">{mapFieldType(field.field_type)}</Badge>
                                {field.required && <Badge variant="destructive">Required</Badge>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Separator />

                {/* Includes */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Package Includes</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {generatedPackage.generatedData.includes.map((include, idx) => (
                      <li key={idx}>{include.include_key}</li>
                    ))}
                  </ul>
                </div>

                <Separator />

                {/* Tags */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Tags</h3>
                  <div className="flex space-x-2">
                    {generatedPackage.generatedData.tags.map((tag, idx) => (
                      <Badge key={idx} className={tag.styling_class}>
                        {tag.tag_label_key} ({mapTagType(tag.tag_type)})
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className="flex space-x-3">
              <Button onClick={handleCreatePackage} disabled={isCreating} className="flex-1">
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Package...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Create Package
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleReject} disabled={isCreating}>
                <X className="w-4 h-4 mr-2" />
                Reject & Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIPackageGenerator;
