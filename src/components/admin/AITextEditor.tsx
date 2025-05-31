
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Edit3, Save, X, Package, FileText, Tag, Gift } from 'lucide-react';

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

interface AITextEditorProps {
  generatedPackage: GeneratedPackage;
  onSave: (editedPackage: GeneratedPackage) => void;
  onCancel: () => void;
}

const AITextEditor: React.FC<AITextEditorProps> = ({ generatedPackage, onSave, onCancel }) => {
  const [editedData, setEditedData] = useState(generatedPackage.generatedData);

  const handlePackageChange = (field: string, value: string | number) => {
    setEditedData(prev => ({
      ...prev,
      package: {
        ...prev.package,
        [field]: value
      }
    }));
  };

  const handleStepChange = (stepIndex: number, field: string, value: string) => {
    setEditedData(prev => ({
      ...prev,
      steps: prev.steps.map((step, index) => 
        index === stepIndex ? { ...step, [field]: value } : step
      )
    }));
  };

  const handleFieldChange = (stepIndex: number, fieldIndex: number, field: string, value: string) => {
    setEditedData(prev => ({
      ...prev,
      steps: prev.steps.map((step, sIndex) => 
        sIndex === stepIndex ? {
          ...step,
          fields: step.fields.map((f, fIndex) => 
            fIndex === fieldIndex ? { ...f, [field]: value } : f
          )
        } : step
      )
    }));
  };

  const handleIncludeChange = (index: number, value: string) => {
    setEditedData(prev => ({
      ...prev,
      includes: prev.includes.map((include, i) => 
        i === index ? { ...include, include_key: value } : include
      )
    }));
  };

  const handleTagChange = (index: number, value: string) => {
    setEditedData(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) => 
        i === index ? { ...tag, tag_label_key: value } : tag
      )
    }));
  };

  const handleSave = () => {
    onSave({
      ...generatedPackage,
      generatedData: editedData
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Edit3 className="w-5 h-5 text-blue-600" />
          <span>Editează Textele Generate de AI</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Modifică textele generate de AI înainte de a crea pachetul final.
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 pr-4">
          <div className="space-y-6">
            {/* Package Info */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-lg mb-3 text-purple-800 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Informații Pachet
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="package-name" className="text-sm font-medium">Nume Pachet</Label>
                  <Input
                    id="package-name"
                    value={editedData.package.label_key}
                    onChange={(e) => handlePackageChange('label_key', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="package-price" className="text-sm font-medium">Preț (RON)</Label>
                    <Input
                      id="package-price"
                      type="number"
                      value={editedData.package.price}
                      onChange={(e) => handlePackageChange('price', parseInt(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="delivery-time" className="text-sm font-medium">Timp Livrare</Label>
                    <Input
                      id="delivery-time"
                      value={editedData.package.delivery_time_key || ''}
                      onChange={(e) => handlePackageChange('delivery_time_key', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                {editedData.package.tagline_key && (
                  <div>
                    <Label htmlFor="package-tagline" className="text-sm font-medium">Slogan</Label>
                    <Input
                      id="package-tagline"
                      value={editedData.package.tagline_key}
                      onChange={(e) => handlePackageChange('tagline_key', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}

                {editedData.package.description_key && (
                  <div>
                    <Label htmlFor="package-description" className="text-sm font-medium">Descriere</Label>
                    <Textarea
                      id="package-description"
                      value={editedData.package.description_key}
                      onChange={(e) => handlePackageChange('description_key', e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Steps */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Pași și Câmpuri ({editedData.steps.length})
              </h3>
              {editedData.steps.map((step, stepIndex) => (
                <Card key={stepIndex} className="mb-4 border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div>
                      <Label htmlFor={`step-title-${stepIndex}`} className="text-sm font-medium">
                        Titlu Pas {step.step_number}
                      </Label>
                      <Input
                        id={`step-title-${stepIndex}`}
                        value={step.title_key}
                        onChange={(e) => handleStepChange(stepIndex, 'title_key', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {step.fields.map((field, fieldIndex) => (
                        <div key={fieldIndex} className="bg-gray-50 p-3 rounded-md">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-800 text-sm">
                              {field.field_name}
                            </span>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {field.field_type}
                              </Badge>
                              {field.required && <Badge variant="destructive" className="text-xs">Obligatoriu</Badge>}
                            </div>
                          </div>
                          {field.placeholder_key && (
                            <div>
                              <Label htmlFor={`placeholder-${stepIndex}-${fieldIndex}`} className="text-xs text-gray-600">
                                Placeholder
                              </Label>
                              <Input
                                id={`placeholder-${stepIndex}-${fieldIndex}`}
                                value={field.placeholder_key}
                                onChange={(e) => handleFieldChange(stepIndex, fieldIndex, 'placeholder_key', e.target.value)}
                                className="mt-1 text-sm"
                                placeholder="Exemplu: ex. Maria Popescu"
                              />
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
                <Gift className="w-5 h-5 mr-2" />
                Ce Include Pachetul
              </h3>
              <div className="space-y-2">
                {editedData.includes.map((include, index) => (
                  <div key={index}>
                    <Label htmlFor={`include-${index}`} className="text-sm font-medium text-green-700">
                      Beneficiu {index + 1}
                    </Label>
                    <Input
                      id={`include-${index}`}
                      value={include.include_key}
                      onChange={(e) => handleIncludeChange(index, e.target.value)}
                      className="mt-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Tags */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Etichete Pachet
              </h3>
              <div className="space-y-2">
                {editedData.tags.map((tag, index) => (
                  <div key={index}>
                    <Label htmlFor={`tag-${index}`} className="text-sm font-medium">
                      Text Etichetă {index + 1}
                    </Label>
                    <Input
                      id={`tag-${index}`}
                      value={tag.tag_label_key}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                      className="mt-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex space-x-3 pt-4 border-t mt-4">
          <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Salvează Modificările
          </Button>
          <Button variant="outline" onClick={onCancel} className="border-red-300 text-red-600 hover:bg-red-50">
            <X className="w-4 h-4 mr-2" />
            Anulează
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AITextEditor;
