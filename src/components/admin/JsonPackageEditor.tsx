
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Save, Download, Upload, Eye, Edit, Trash2, Copy } from 'lucide-react';
import { usePackages } from '@/hooks/usePackageData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CompletePackageData {
  id?: string;
  value: string;
  label_key: string;
  price: number;
  tagline_key?: string;
  description_key?: string;
  delivery_time_key?: string;
  tags: Array<{
    tag_type: string;
    tag_label_key?: string;
    styling_class?: string;
  }>;
  includes: Array<{
    include_key: string;
    include_order: number;
  }>;
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
      options?: any[];
      validations?: Array<{
        validation_type: string;
        validation_value?: string;
        error_message_key?: string;
      }>;
      dependencies?: Array<{
        depends_on_field: string;
        condition: string;
        condition_value: string;
      }>;
    }>;
  }>;
  addons: Array<{
    addon_key: string;
    label_key: string;
    description_key?: string;
    price: number;
  }>;
}

const JsonPackageEditor = () => {
  const { data: packages = [], refetch } = usePackages();
  const [selectedPackage, setSelectedPackage] = useState<CompletePackageData | null>(null);
  const [jsonData, setJsonData] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [jsonError, setJsonError] = useState('');
  const { toast } = useToast();

  const loadCompletePackageData = async (packageId: string) => {
    try {
      // Load package info
      const { data: packageInfo, error: packageError } = await supabase
        .from('package_info')
        .select(`
          *,
          tags:package_tags(*),
          includes:package_includes(*)
        `)
        .eq('id', packageId)
        .single();

      if (packageError) throw packageError;

      // Load steps with fields
      const { data: steps, error: stepsError } = await supabase
        .from('steps')
        .select(`
          *,
          fields:step_fields(
            *,
            validations:field_validation(*),
            dependencies:field_dependencies(*)
          )
        `)
        .eq('package_id', packageId)
        .order('step_order');

      if (stepsError) throw stepsError;

      // Load package addons
      const { data: packageAddons, error: addonsError } = await supabase
        .from('package_addons')
        .select(`
          *,
          addon:addons(*)
        `)
        .eq('package_id', packageId);

      if (addonsError) throw addonsError;

      // Construct complete package data
      const completeData: CompletePackageData = {
        id: packageInfo.id,
        value: packageInfo.value,
        label_key: packageInfo.label_key,
        price: packageInfo.price,
        tagline_key: packageInfo.tagline_key,
        description_key: packageInfo.description_key,
        delivery_time_key: packageInfo.delivery_time_key,
        tags: packageInfo.tags || [],
        includes: packageInfo.includes || [],
        steps: steps?.map(step => ({
          step_number: step.step_number,
          title_key: step.title_key,
          step_order: step.step_order,
          fields: step.fields?.map((field: any) => ({
            field_name: field.field_name,
            field_type: field.field_type,
            placeholder_key: field.placeholder_key,
            required: field.required,
            field_order: field.field_order,
            options: field.options ? JSON.parse(field.options) : undefined,
            validations: field.validations || [],
            dependencies: field.dependencies || []
          })) || []
        })) || [],
        addons: packageAddons?.map((pa: any) => pa.addon).filter(Boolean) || []
      };

      setSelectedPackage(completeData);
      setJsonData(JSON.stringify(completeData, null, 2));
    } catch (error) {
      console.error('Error loading complete package data:', error);
      toast({ title: 'Error loading package data', variant: 'destructive' });
    }
  };

  const validateJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      setJsonError('');
      return parsed;
    } catch (error) {
      setJsonError('Invalid JSON format');
      return null;
    }
  };

  const handleJsonChange = (value: string) => {
    setJsonData(value);
    validateJson(value);
  };

  const savePackageFromJson = async () => {
    const packageData = validateJson(jsonData);
    if (!packageData) {
      toast({ title: 'Invalid JSON format', variant: 'destructive' });
      return;
    }

    try {
      let packageId = packageData.id;

      // Save or update package info
      if (isCreating || !packageId) {
        const { data: newPackage, error: packageError } = await supabase
          .from('package_info')
          .insert({
            value: packageData.value,
            label_key: packageData.label_key,
            price: packageData.price,
            tagline_key: packageData.tagline_key,
            description_key: packageData.description_key,
            delivery_time_key: packageData.delivery_time_key
          })
          .select()
          .single();

        if (packageError) throw packageError;
        packageId = newPackage.id;
      } else {
        const { error: updateError } = await supabase
          .from('package_info')
          .update({
            value: packageData.value,
            label_key: packageData.label_key,
            price: packageData.price,
            tagline_key: packageData.tagline_key,
            description_key: packageData.description_key,
            delivery_time_key: packageData.delivery_time_key
          })
          .eq('id', packageId);

        if (updateError) throw updateError;
      }

      // Clear existing related data if updating
      if (!isCreating && packageId) {
        // Delete tags and includes first
        await supabase.from('package_tags').delete().eq('package_id', packageId);
        await supabase.from('package_includes').delete().eq('package_id', packageId);

        // Get step IDs for this package
        const { data: stepIds, error: stepIdsError } = await supabase
          .from('steps')
          .select('id')
          .eq('package_id', packageId);

        if (stepIdsError) throw stepIdsError;

        if (stepIds && stepIds.length > 0) {
          const stepIdArray = stepIds.map(step => step.id);

          // Get field IDs for these steps
          const { data: fieldIds, error: fieldIdsError } = await supabase
            .from('step_fields')
            .select('id')
            .in('step_id', stepIdArray);

          if (fieldIdsError) throw fieldIdsError;

          if (fieldIds && fieldIds.length > 0) {
            const fieldIdArray = fieldIds.map(field => field.id);

            // Delete field validations and dependencies
            await supabase.from('field_validation').delete().in('field_id', fieldIdArray);
            await supabase.from('field_dependencies').delete().in('field_id', fieldIdArray);
          }

          // Delete fields
          await supabase.from('step_fields').delete().in('step_id', stepIdArray);
        }

        // Delete steps
        await supabase.from('steps').delete().eq('package_id', packageId);
      }

      // Save tags
      if (packageData.tags?.length > 0) {
        await supabase.from('package_tags').insert(
          packageData.tags.map(tag => ({
            package_id: packageId,
            tag_type: tag.tag_type,
            tag_label_key: tag.tag_label_key,
            styling_class: tag.styling_class
          }))
        );
      }

      // Save includes
      if (packageData.includes?.length > 0) {
        await supabase.from('package_includes').insert(
          packageData.includes.map(include => ({
            package_id: packageId,
            include_key: include.include_key,
            include_order: include.include_order
          }))
        );
      }

      // Save steps and fields
      for (const step of packageData.steps || []) {
        const { data: newStep, error: stepError } = await supabase
          .from('steps')
          .insert({
            package_id: packageId,
            step_number: step.step_number,
            title_key: step.title_key,
            step_order: step.step_order
          })
          .select()
          .single();

        if (stepError) throw stepError;

        // Save fields for this step
        for (const field of step.fields || []) {
          const { data: newField, error: fieldError } = await supabase
            .from('step_fields')
            .insert({
              step_id: newStep.id,
              field_name: field.field_name,
              field_type: field.field_type,
              placeholder_key: field.placeholder_key,
              required: field.required,
              field_order: field.field_order,
              options: field.options ? JSON.stringify(field.options) : null
            })
            .select()
            .single();

          if (fieldError) throw fieldError;

          // Save validations
          if (field.validations?.length > 0) {
            await supabase.from('field_validation').insert(
              field.validations.map(validation => ({
                field_id: newField.id,
                validation_type: validation.validation_type,
                validation_value: validation.validation_value,
                error_message_key: validation.error_message_key
              }))
            );
          }

          // Save dependencies
          if (field.dependencies?.length > 0) {
            await supabase.from('field_dependencies').insert(
              field.dependencies.map(dependency => ({
                field_id: newField.id,
                depends_on_field: dependency.depends_on_field,
                condition: dependency.condition,
                condition_value: dependency.condition_value
              }))
            );
          }
        }
      }

      toast({ title: `Package ${isCreating ? 'created' : 'updated'} successfully` });
      setIsEditing(false);
      setIsCreating(false);
      refetch();
    } catch (error) {
      console.error('Error saving package:', error);
      toast({ title: 'Error saving package', variant: 'destructive' });
    }
  };

  const createNewPackage = () => {
    const template: CompletePackageData = {
      value: '',
      label_key: '',
      price: 0,
      tags: [],
      includes: [],
      steps: [],
      addons: []
    };
    setSelectedPackage(template);
    setJsonData(JSON.stringify(template, null, 2));
    setIsCreating(true);
    setIsEditing(true);
  };

  const exportJson = () => {
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `package-${selectedPackage?.value || 'export'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setJsonData(content);
        const parsed = validateJson(content);
        if (parsed) {
          setSelectedPackage(parsed);
          setIsEditing(true);
          setIsCreating(!parsed.id);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">JSON Package Editor</h2>
        <div className="flex space-x-2">
          <Button onClick={createNewPackage}>
            <Plus className="w-4 h-4 mr-2" />
            New Package
          </Button>
          <input
            type="file"
            accept=".json"
            onChange={importJson}
            className="hidden"
            id="import-json"
          />
          <Button variant="outline" onClick={() => document.getElementById('import-json')?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Package List */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Packages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="flex items-center justify-between p-3 border rounded cursor-pointer hover:bg-gray-50"
                onClick={() => loadCompletePackageData(pkg.id)}
              >
                <div>
                  <h4 className="font-medium">{pkg.value}</h4>
                  <p className="text-sm text-gray-600">{pkg.label_key}</p>
                </div>
                <Badge variant="secondary">{pkg.price} RON</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* JSON Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              JSON Editor
              {selectedPackage && (
                <div className="flex space-x-2">
                  {!isEditing ? (
                    <Button size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <>
                      <Button size="sm" onClick={savePackageFromJson}>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => {
                        setIsEditing(false);
                        setIsCreating(false);
                        if (selectedPackage?.id) {
                          loadCompletePackageData(selectedPackage.id);
                        }
                      }}>
                        Cancel
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="outline" onClick={exportJson}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPackage ? (
              <div className="space-y-4">
                {jsonError && (
                  <div className="text-red-500 text-sm">{jsonError}</div>
                )}
                <Textarea
                  value={jsonData}
                  onChange={(e) => handleJsonChange(e.target.value)}
                  className="min-h-[500px] font-mono text-sm"
                  placeholder="JSON package data will appear here..."
                  readOnly={!isEditing}
                />
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Select a package from the list or create a new one to start editing
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedPackage && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">{selectedPackage.value}</h3>
                <p className="text-sm text-gray-600">Price: {selectedPackage.price} RON</p>
              </div>
              
              {selectedPackage.steps?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Steps ({selectedPackage.steps.length})</h4>
                  <div className="space-y-2">
                    {selectedPackage.steps.map((step, index) => (
                      <div key={index} className="border rounded p-2">
                        <p className="font-medium">Step {step.step_number}: {step.title_key}</p>
                        <p className="text-sm text-gray-600">
                          {step.fields?.length || 0} fields
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JsonPackageEditor;
