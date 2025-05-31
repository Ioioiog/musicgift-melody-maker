import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Save, Download, Upload, Eye, Edit, Trash2, Copy, Wrench, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { usePackages } from '@/hooks/usePackageData';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { validatePackageData, getIssueSummary } from '@/utils/packageValidation';

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
  const { data: userRole } = useUserRole();
  const [selectedPackage, setSelectedPackage] = useState<CompletePackageData | null>(null);
  const [jsonData, setJsonData] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [jsonError, setJsonError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isRepairing, setIsRepairing] = useState(false);
  const [validationIssues, setValidationIssues] = useState<any[]>([]);
  const [showRepairPreview, setShowRepairPreview] = useState(false);
  const [repairPreviewData, setRepairPreviewData] = useState<any>(null);
  const { toast } = useToast();

  const isSuperAdmin = userRole === 'super_admin';

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
      
      // Validate the parsed data
      const issues = validatePackageData(parsed);
      setValidationIssues(issues);
      
      return parsed;
    } catch (error) {
      setJsonError('Invalid JSON format');
      setValidationIssues([]);
      return null;
    }
  };

  const handleJsonChange = (value: string) => {
    setJsonData(value);
    validateJson(value);
  };

  const repairPackageJson = async () => {
    const packageData = validateJson(jsonData);
    if (!packageData) {
      toast({ title: 'Cannot repair invalid JSON', variant: 'destructive' });
      return;
    }

    setIsRepairing(true);

    try {
      console.log('Calling AI repair function...');
      
      const { data, error } = await supabase.functions.invoke('repair-package-json', {
        body: { packageData },
      });

      console.log('AI repair response:', data, error);

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to repair package JSON');
      }

      if (!data?.success || !data?.repaired_data) {
        console.error('Invalid response from AI repair:', data);
        throw new Error(data?.error || 'Invalid response from AI repair');
      }

      console.log('Successfully repaired data:', data.repaired_data);
      setRepairPreviewData(data.repaired_data);
      setShowRepairPreview(true);

      toast({
        title: 'Package Repaired',
        description: 'AI has analyzed and repaired the package data. Review the changes.',
      });

    } catch (error) {
      console.error('Error repairing package:', error);
      toast({
        title: 'Repair Failed',
        description: error.message || 'Failed to repair package with AI',
        variant: 'destructive',
      });
    } finally {
      setIsRepairing(false);
    }
  };

  const applyRepairChanges = () => {
    if (repairPreviewData) {
      setJsonData(JSON.stringify(repairPreviewData, null, 2));
      setSelectedPackage(repairPreviewData);
      setShowRepairPreview(false);
      setRepairPreviewData(null);
      validateJson(JSON.stringify(repairPreviewData, null, 2));
      
      toast({
        title: 'Repair Applied',
        description: 'The repaired package data has been applied to the editor.',
      });
    }
  };

  const cancelRepair = () => {
    setShowRepairPreview(false);
    setRepairPreviewData(null);
  };

  const deletePackage = async () => {
    if (!selectedPackage?.id || !isSuperAdmin) {
      toast({ title: 'Not authorized to delete packages', variant: 'destructive' });
      return;
    }

    if (deleteConfirmation !== selectedPackage.value) {
      toast({ title: 'Package name confirmation does not match', variant: 'destructive' });
      return;
    }

    setIsDeleting(true);

    try {
      const packageId = selectedPackage.id;

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

      // Delete package tags and includes
      await supabase.from('package_tags').delete().eq('package_id', packageId);
      await supabase.from('package_includes').delete().eq('package_id', packageId);

      // Delete package addons associations
      await supabase.from('package_addons').delete().eq('package_id', packageId);

      // Delete any orders related to this package
      await supabase.from('orders').delete().eq('package_id', packageId);

      // Finally, delete the package itself
      const { error: packageDeleteError } = await supabase
        .from('package_info')
        .delete()
        .eq('id', packageId);

      if (packageDeleteError) throw packageDeleteError;

      toast({ title: 'Package deleted successfully' });
      
      // Clear the selected package and refresh the list
      setSelectedPackage(null);
      setJsonData('');
      setDeleteConfirmation('');
      refetch();
    } catch (error) {
      console.error('Error deleting package:', error);
      toast({ title: 'Error deleting package', variant: 'destructive' });
    } finally {
      setIsDeleting(false);
    }
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

  const issuesSummary = getIssueSummary(validationIssues);

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
                  {/* AI Repair Button */}
                  {issuesSummary.hasIssues && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={repairPackageJson}
                      disabled={isRepairing}
                      className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                    >
                      {isRepairing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Repairing...
                        </>
                      ) : (
                        <>
                          <Wrench className="w-4 h-4 mr-2" />
                          AI Repair
                        </>
                      )}
                    </Button>
                  )}
                  
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
                  
                  {/* Delete Button - Only for Super Admins */}
                  {isSuperAdmin && selectedPackage?.id && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Package</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the package 
                            "{selectedPackage.value}" and all its associated data including steps, 
                            fields, validations, dependencies, tags, includes, and any orders.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="delete-confirmation">
                              Type the package name "{selectedPackage.value}" to confirm deletion:
                            </Label>
                            <Input
                              id="delete-confirmation"
                              value={deleteConfirmation}
                              onChange={(e) => setDeleteConfirmation(e.target.value)}
                              placeholder="Enter package name to confirm"
                            />
                          </div>
                          <div className="text-sm text-gray-600">
                            <p><strong>Package Details:</strong></p>
                            <p>• Name: {selectedPackage.value}</p>
                            <p>• Price: {selectedPackage.price} RON</p>
                            <p>• Steps: {selectedPackage.steps?.length || 0}</p>
                            <p>• Tags: {selectedPackage.tags?.length || 0}</p>
                            <p>• Includes: {selectedPackage.includes?.length || 0}</p>
                          </div>
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setDeleteConfirmation('')}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={deletePackage}
                            disabled={deleteConfirmation !== selectedPackage.value || isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {isDeleting ? 'Deleting...' : 'Delete Package'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPackage ? (
              <div className="space-y-4">
                {/* Validation Issues Summary */}
                {issuesSummary.hasIssues && (
                  <div className={`flex items-center p-3 rounded-lg ${
                    issuesSummary.errors > 0 
                      ? 'bg-red-50 text-red-800 border border-red-200' 
                      : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                  }`}>
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <div className="flex-1">
                      <span className="font-medium">
                        {issuesSummary.errors > 0 ? 'Issues Detected' : 'Warnings'}: 
                      </span>
                      <span className="ml-2">
                        {issuesSummary.errors > 0 && `${issuesSummary.errors} errors`}
                        {issuesSummary.errors > 0 && issuesSummary.warnings > 0 && ', '}
                        {issuesSummary.warnings > 0 && `${issuesSummary.warnings} warnings`}
                      </span>
                    </div>
                    {issuesSummary.hasIssues && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={repairPackageJson}
                        disabled={isRepairing}
                        className="ml-2"
                      >
                        {isRepairing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Wrench className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                )}

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

      {/* Repair Preview Dialog */}
      {showRepairPreview && repairPreviewData && (
        <AlertDialog open={showRepairPreview} onOpenChange={setShowRepairPreview}>
          <AlertDialogContent className="max-w-4xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                AI Repair Complete
              </AlertDialogTitle>
              <AlertDialogDescription>
                The AI has analyzed and repaired your package JSON. Review the changes below and apply them if they look correct.
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="space-y-4">
              <div className="max-h-96 overflow-auto">
                <Label htmlFor="repaired-json">Repaired JSON:</Label>
                <Textarea
                  id="repaired-json"
                  value={JSON.stringify(repairPreviewData, null, 2)}
                  readOnly
                  className="mt-2 min-h-[300px] font-mono text-sm"
                />
              </div>
              
              <div className="text-sm text-gray-600">
                <p><strong>Common fixes applied:</strong></p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Fixed field type inconsistencies (e.g., 'textare' → 'textarea')</li>
                  <li>Corrected enum values to match database constraints</li>
                  <li>Standardized options format for select fields</li>
                  <li>Ensured proper sequential ordering</li>
                  <li>Added missing required fields</li>
                </ul>
              </div>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelRepair}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={applyRepairChanges}
                className="bg-green-600 hover:bg-green-700"
              >
                Apply Repairs
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Validation Issues Details */}
      {validationIssues.length > 0 && selectedPackage && (
        <Card>
          <CardHeader>
            <CardTitle>Validation Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {validationIssues.map((issue, index) => (
                <div
                  key={index}
                  className={`p-3 rounded border ${
                    issue.type === 'error' 
                      ? 'bg-red-50 border-red-200 text-red-800' 
                      : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                  }`}
                >
                  <div className="flex items-start">
                    <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium">{issue.field}</p>
                      <p className="text-sm">{issue.message}</p>
                      {issue.suggestion && (
                        <p className="text-xs mt-1 opacity-75">{issue.suggestion}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
