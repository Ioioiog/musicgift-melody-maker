
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, ChevronRight, ChevronLeft, Save, Package, Settings, FileText, GitBranch, CheckSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Enums } from '@/integrations/supabase/types';

type FieldType = Enums<'field_type'>;
type ValidationRuleType = Enums<'validation_rule_type'>;
type DependencyCondition = 'equals' | 'not_equals' | 'contains' | 'not_contains';

interface PackageData {
  value: string;
  label_key: string;
  price: number;
  tagline_key: string;
  description_key: string;
  delivery_time_key: string;
}

interface StepData {
  step_number: number;
  title_key: string;
  step_order: number;
  fields: FieldData[];
}

interface FieldData {
  field_name: string;
  field_type: FieldType;
  placeholder_key: string;
  required: boolean;
  field_order: number;
  options: string[];
  validations: ValidationData[];
  dependencies: DependencyData[];
}

interface ValidationData {
  validation_type: ValidationRuleType;
  validation_value: string;
  error_message_key: string;
}

interface DependencyData {
  depends_on_field: string;
  condition: DependencyCondition;
  condition_value: string;
}

const fieldTypes: FieldType[] = [
  'text', 'email', 'tel', 'textarea', 'select', 
  'checkbox', 'checkbox-group', 'date', 'url', 'file'
];

const validationTypes: ValidationRuleType[] = [
  'required', 'min_length', 'max_length', 'pattern', 'custom'
];

const dependencyConditions: DependencyCondition[] = [
  'equals', 'not_equals', 'contains', 'not_contains'
];

const PackageCreationWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const [packageData, setPackageData] = useState<PackageData>({
    value: '',
    label_key: '',
    price: 0,
    tagline_key: '',
    description_key: '',
    delivery_time_key: ''
  });

  const [steps, setSteps] = useState<StepData[]>([
    {
      step_number: 1,
      title_key: '',
      step_order: 1,
      fields: []
    }
  ]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);

  const totalSteps = 5;

  const stepTitles = [
    { icon: Package, title: 'Informații Pachet', description: 'Configurează detaliile de bază ale pachetului' },
    { icon: Settings, title: 'Pași și Structură', description: 'Definește pașii procesului' },
    { icon: FileText, title: 'Câmpuri Formular', description: 'Adaugă câmpurile pentru fiecare pas' },
    { icon: CheckSquare, title: 'Validări', description: 'Configurează regulile de validare' },
    { icon: GitBranch, title: 'Dependențe și Finalizare', description: 'Configurează dependențele și salvează' }
  ];

  const addStep = () => {
    const newStep: StepData = {
      step_number: steps.length + 1,
      title_key: '',
      step_order: steps.length + 1,
      fields: []
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      const newSteps = steps.filter((_, i) => i !== index);
      setSteps(newSteps);
      if (currentStepIndex >= newSteps.length) {
        setCurrentStepIndex(newSteps.length - 1);
      }
    }
  };

  const updateStep = (index: number, field: keyof StepData, value: any) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const addField = (stepIndex: number) => {
    const newField: FieldData = {
      field_name: '',
      field_type: 'text',
      placeholder_key: '',
      required: false,
      field_order: steps[stepIndex].fields.length + 1,
      options: [],
      validations: [],
      dependencies: []
    };
    
    const newSteps = [...steps];
    newSteps[stepIndex].fields.push(newField);
    setSteps(newSteps);
  };

  const removeField = (stepIndex: number, fieldIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex].fields = newSteps[stepIndex].fields.filter((_, i) => i !== fieldIndex);
    setSteps(newSteps);
  };

  const updateField = (stepIndex: number, fieldIndex: number, field: keyof FieldData, value: any) => {
    const newSteps = [...steps];
    newSteps[stepIndex].fields[fieldIndex] = { 
      ...newSteps[stepIndex].fields[fieldIndex], 
      [field]: value 
    };
    setSteps(newSteps);
  };

  const addValidation = (stepIndex: number, fieldIndex: number) => {
    const newValidation: ValidationData = {
      validation_type: 'required',
      validation_value: '',
      error_message_key: ''
    };
    
    const newSteps = [...steps];
    newSteps[stepIndex].fields[fieldIndex].validations.push(newValidation);
    setSteps(newSteps);
  };

  const addDependency = (stepIndex: number, fieldIndex: number) => {
    const newDependency: DependencyData = {
      depends_on_field: '',
      condition: 'equals',
      condition_value: ''
    };
    
    const newSteps = [...steps];
    newSteps[stepIndex].fields[fieldIndex].dependencies.push(newDependency);
    setSteps(newSteps);
  };

  const handleCreatePackage = async () => {
    setIsCreating(true);
    try {
      // Create package
      const { data: packageResult, error: packageError } = await supabase
        .from('package_info')
        .insert(packageData)
        .select()
        .single();

      if (packageError) throw packageError;

      // Create steps and fields
      for (const step of steps) {
        const { data: stepResult, error: stepError } = await supabase
          .from('steps')
          .insert({
            package_id: packageResult.id,
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
          const { data: fieldResult, error: fieldError } = await supabase
            .from('step_fields')
            .insert({
              step_id: stepResult.id,
              field_name: field.field_name,
              field_type: field.field_type,
              placeholder_key: field.placeholder_key,
              required: field.required,
              field_order: field.field_order,
              options: field.options.length > 0 ? field.options : null
            })
            .select()
            .single();

          if (fieldError) throw fieldError;

          // Create validations
          for (const validation of field.validations) {
            const { error: validationError } = await supabase
              .from('field_validation')
              .insert({
                field_id: fieldResult.id,
                validation_type: validation.validation_type,
                validation_value: validation.validation_value || null,
                error_message_key: validation.error_message_key || null,
                is_active: true
              });

            if (validationError) throw validationError;
          }

          // Create dependencies
          for (const dependency of field.dependencies) {
            const { error: dependencyError } = await supabase
              .from('field_dependencies')
              .insert({
                field_id: fieldResult.id,
                depends_on_field: dependency.depends_on_field,
                condition: dependency.condition,
                condition_value: dependency.condition_value,
                is_active: true
              });

            if (dependencyError) throw dependencyError;
          }
        }
      }

      toast({ title: 'Pachetul a fost creat cu succes!' });
      
      // Reset form
      setPackageData({
        value: '',
        label_key: '',
        price: 0,
        tagline_key: '',
        description_key: '',
        delivery_time_key: ''
      });
      setSteps([{
        step_number: 1,
        title_key: '',
        step_order: 1,
        fields: []
      }]);
      setCurrentStep(1);

    } catch (error) {
      console.error('Error creating package:', error);
      toast({ title: 'Eroare la crearea pachetului', description: error.message, variant: 'destructive' });
    } finally {
      setIsCreating(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="value">Valoare Pachet</Label>
                <Input
                  id="value"
                  value={packageData.value}
                  onChange={(e) => setPackageData({ ...packageData, value: e.target.value })}
                  placeholder="ex: premium, standard"
                />
              </div>
              <div>
                <Label htmlFor="price">Preț (RON)</Label>
                <Input
                  id="price"
                  type="number"
                  value={packageData.price}
                  onChange={(e) => setPackageData({ ...packageData, price: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="label_key">Cheie Etichetă</Label>
              <Input
                id="label_key"
                value={packageData.label_key}
                onChange={(e) => setPackageData({ ...packageData, label_key: e.target.value })}
                placeholder="ex: pachetPremium"
              />
            </div>

            <div>
              <Label htmlFor="tagline_key">Cheie Tagline</Label>
              <Input
                id="tagline_key"
                value={packageData.tagline_key}
                onChange={(e) => setPackageData({ ...packageData, tagline_key: e.target.value })}
                placeholder="ex: taglinePremium"
              />
            </div>

            <div>
              <Label htmlFor="delivery_time_key">Cheie Timp Livrare</Label>
              <Input
                id="delivery_time_key"
                value={packageData.delivery_time_key}
                onChange={(e) => setPackageData({ ...packageData, delivery_time_key: e.target.value })}
                placeholder="ex: timpLivrare7Zile"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Pași Proces ({steps.length})</h3>
              <Button onClick={addStep} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Adaugă Pas
              </Button>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <Card key={index} className={index === currentStepIndex ? 'ring-2 ring-primary' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">Pas {step.step_number}</Badge>
                      <Button
                        onClick={() => removeStep(index)}
                        size="sm"
                        variant="destructive"
                        disabled={steps.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Titlu Pas</Label>
                        <Input
                          value={step.title_key}
                          onChange={(e) => updateStep(index, 'title_key', e.target.value)}
                          placeholder="ex: informatiiPersonale"
                        />
                      </div>
                      <div>
                        <Label>Ordine Pas</Label>
                        <Input
                          type="number"
                          value={step.step_order}
                          onChange={(e) => updateStep(index, 'step_order', parseInt(e.target.value) || 1)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Câmpuri Formular</h3>
                <p className="text-sm text-gray-600">
                  Pas curent: {steps[currentStepIndex]?.title_key || `Pas ${currentStepIndex + 1}`}
                </p>
              </div>
              <div className="flex space-x-2">
                <Select value={currentStepIndex.toString()} onValueChange={(value) => setCurrentStepIndex(parseInt(value))}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {steps.map((step, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {step.title_key || `Pas ${index + 1}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => addField(currentStepIndex)} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Adaugă Câmp
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {steps[currentStepIndex]?.fields.map((field, fieldIndex) => (
                <Card key={fieldIndex}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="outline">Câmp {fieldIndex + 1}</Badge>
                      <Button
                        onClick={() => removeField(currentStepIndex, fieldIndex)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label>Nume Câmp</Label>
                        <Input
                          value={field.field_name}
                          onChange={(e) => updateField(currentStepIndex, fieldIndex, 'field_name', e.target.value)}
                          placeholder="ex: numeComplet"
                        />
                      </div>
                      <div>
                        <Label>Tip Câmp</Label>
                        <Select
                          value={field.field_type}
                          onValueChange={(value: FieldType) => updateField(currentStepIndex, fieldIndex, 'field_type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fieldTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label>Placeholder</Label>
                        <Input
                          value={field.placeholder_key}
                          onChange={(e) => updateField(currentStepIndex, fieldIndex, 'placeholder_key', e.target.value)}
                          placeholder="ex: introducetiNumele"
                        />
                      </div>
                      <div>
                        <Label>Ordine Câmp</Label>
                        <Input
                          type="number"
                          value={field.field_order}
                          onChange={(e) => updateField(currentStepIndex, fieldIndex, 'field_order', parseInt(e.target.value) || 1)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-4">
                      <Checkbox
                        checked={field.required}
                        onCheckedChange={(checked) => updateField(currentStepIndex, fieldIndex, 'required', checked)}
                      />
                      <Label>Obligatoriu</Label>
                    </div>

                    {(field.field_type === 'select' || field.field_type === 'checkbox-group') && (
                      <div>
                        <Label>Opțiuni (una pe linie)</Label>
                        <Textarea
                          value={field.options.join('\n')}
                          onChange={(e) => updateField(currentStepIndex, fieldIndex, 'options', e.target.value.split('\n').filter(o => o.trim()))}
                          placeholder="Opțiunea 1&#10;Opțiunea 2&#10;Opțiunea 3"
                          rows={3}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {steps[currentStepIndex]?.fields.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nu există câmpuri pentru acest pas. Adaugă primul câmp.
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configurare Validări</h3>
            
            <div className="space-y-4">
              {steps.map((step, stepIndex) => (
                <Card key={stepIndex}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {step.title_key || `Pas ${stepIndex + 1}`} ({step.fields.length} câmpuri)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {step.fields.map((field, fieldIndex) => (
                      <div key={fieldIndex} className="mb-4 p-4 border rounded">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{field.field_name}</h4>
                          <Button
                            onClick={() => addValidation(stepIndex, fieldIndex)}
                            size="sm"
                            variant="outline"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Validare
                          </Button>
                        </div>

                        {field.validations.map((validation, validationIndex) => (
                          <div key={validationIndex} className="grid grid-cols-3 gap-2 mb-2">
                            <Select
                              value={validation.validation_type}
                              onValueChange={(value: ValidationRuleType) => {
                                const newSteps = [...steps];
                                newSteps[stepIndex].fields[fieldIndex].validations[validationIndex].validation_type = value;
                                setSteps(newSteps);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {validationTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            <Input
                              placeholder="Valoare validare"
                              value={validation.validation_value}
                              onChange={(e) => {
                                const newSteps = [...steps];
                                newSteps[stepIndex].fields[fieldIndex].validations[validationIndex].validation_value = e.target.value;
                                setSteps(newSteps);
                              }}
                            />
                            
                            <Input
                              placeholder="Cheie mesaj eroare"
                              value={validation.error_message_key}
                              onChange={(e) => {
                                const newSteps = [...steps];
                                newSteps[stepIndex].fields[fieldIndex].validations[validationIndex].error_message_key = e.target.value;
                                setSteps(newSteps);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configurare Dependențe și Finalizare</h3>
            
            <div className="space-y-4">
              {steps.map((step, stepIndex) => (
                <Card key={stepIndex}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {step.title_key || `Pas ${stepIndex + 1}`}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {step.fields.map((field, fieldIndex) => (
                      <div key={fieldIndex} className="mb-4 p-4 border rounded">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{field.field_name}</h4>
                          <Button
                            onClick={() => addDependency(stepIndex, fieldIndex)}
                            size="sm"
                            variant="outline"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Dependență
                          </Button>
                        </div>

                        {field.dependencies.map((dependency, depIndex) => (
                          <div key={depIndex} className="grid grid-cols-3 gap-2 mb-2">
                            <Input
                              placeholder="Câmp dependent"
                              value={dependency.depends_on_field}
                              onChange={(e) => {
                                const newSteps = [...steps];
                                newSteps[stepIndex].fields[fieldIndex].dependencies[depIndex].depends_on_field = e.target.value;
                                setSteps(newSteps);
                              }}
                            />
                            
                            <Select
                              value={dependency.condition}
                              onValueChange={(value: DependencyCondition) => {
                                const newSteps = [...steps];
                                newSteps[stepIndex].fields[fieldIndex].dependencies[depIndex].condition = value;
                                setSteps(newSteps);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {dependencyConditions.map((condition) => (
                                  <SelectItem key={condition} value={condition}>
                                    {condition}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            <Input
                              placeholder="Valoare condiție"
                              value={dependency.condition_value}
                              onChange={(e) => {
                                const newSteps = [...steps];
                                newSteps[stepIndex].fields[fieldIndex].dependencies[depIndex].condition_value = e.target.value;
                                setSteps(newSteps);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2 text-green-800">Sumar Pachet</h4>
                <div className="text-sm space-y-1 text-green-700">
                  <p><strong>Nume:</strong> {packageData.label_key}</p>
                  <p><strong>Preț:</strong> {packageData.price} RON</p>
                  <p><strong>Pași:</strong> {steps.length}</p>
                  <p><strong>Total câmpuri:</strong> {steps.reduce((total, step) => total + step.fields.length, 0)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Asistent Creare Pachet</h2>
          <p className="text-gray-600">Ghid pas cu pas pentru crearea unui pachet complet</p>
        </div>
        <Badge variant="outline">
          Pas {currentStep} din {totalSteps}
        </Badge>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center space-x-4 mb-6">
        {stepTitles.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const Icon = step.icon;

          return (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isActive
                    ? 'border-primary bg-primary text-white'
                    : isCompleted
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 bg-white text-gray-500'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              {index < stepTitles.length - 1 && (
                <ChevronRight className="w-5 h-5 mx-2 text-gray-400" />
              )}
            </div>
          );
        })}
      </div>

      {/* Current Step Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {React.createElement(stepTitles[currentStep - 1].icon, { className: "w-5 h-5" })}
            <span>{stepTitles[currentStep - 1].title}</span>
          </CardTitle>
          <p className="text-sm text-gray-600">{stepTitles[currentStep - 1].description}</p>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Înapoi
        </Button>

        <div className="flex space-x-2">
          {currentStep < totalSteps ? (
            <Button
              onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
            >
              Următorul
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleCreatePackage}
              disabled={isCreating}
              className="bg-green-600 hover:bg-green-700"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creează Pachetul...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Creează Pachetul
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageCreationWizard;
