
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePackages } from '@/hooks/usePackageData';

const DependenciesManagement = () => {
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingDependency, setEditingDependency] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    field_id: '',
    depends_on_field: '',
    condition: 'equals' as 'equals' | 'not_equals' | 'contains' | 'not_contains',
    condition_value: ''
  });
  
  const { data: packages = [] } = usePackages();
  const { toast } = useToast();

  const { data: fields = [] } = useQuery({
    queryKey: ['package-fields', selectedPackage],
    queryFn: async () => {
      if (!selectedPackage) return [];
      
      const { data: steps, error } = await supabase
        .from('steps')
        .select(`
          id,
          step_number,
          fields:step_fields(
            id,
            field_name,
            field_type
          )
        `)
        .eq('package_id', selectedPackage)
        .eq('is_active', true)
        .order('step_order');

      if (error) throw error;
      
      return steps.flatMap(step => 
        step.fields.map((field: any) => ({
          ...field,
          step_number: step.step_number
        }))
      );
    },
    enabled: !!selectedPackage
  });

  const { data: dependencies = [], refetch: refetchDependencies } = useQuery({
    queryKey: ['field-dependencies-admin', selectedPackage],
    queryFn: async () => {
      if (!selectedPackage) return [];

      const fieldIds = fields.map(f => f.id);
      if (fieldIds.length === 0) return [];

      const { data, error } = await supabase
        .from('field_dependencies')
        .select(`
          *,
          field:step_fields(field_name)
        `)
        .in('field_id', fieldIds)
        .eq('is_active', true);

      if (error) throw error;
      return data;
    },
    enabled: !!selectedPackage && fields.length > 0
  });

  const handleSave = async () => {
    try {
      if (isCreating) {
        const { error } = await supabase
          .from('field_dependencies')
          .insert(formData);
        if (error) throw error;
        toast({ title: 'Dependency created successfully' });
      } else if (editingDependency) {
        const { error } = await supabase
          .from('field_dependencies')
          .update(formData)
          .eq('id', editingDependency);
        if (error) throw error;
        toast({ title: 'Dependency updated successfully' });
      }
      
      handleCancel();
      refetchDependencies();
    } catch (error) {
      console.error('Error saving dependency:', error);
      toast({ title: 'Error saving dependency', variant: 'destructive' });
    }
  };

  const handleEdit = (dependency: any) => {
    setEditingDependency(dependency.id);
    setFormData({
      field_id: dependency.field_id,
      depends_on_field: dependency.depends_on_field,
      condition: dependency.condition,
      condition_value: dependency.condition_value
    });
  };

  const handleDelete = async (dependencyId: string) => {
    if (!confirm('Are you sure you want to delete this dependency?')) return;
    
    try {
      const { error } = await supabase
        .from('field_dependencies')
        .delete()
        .eq('id', dependencyId);
      
      if (error) throw error;
      toast({ title: 'Dependency deleted successfully' });
      refetchDependencies();
    } catch (error) {
      console.error('Error deleting dependency:', error);
      toast({ title: 'Error deleting dependency', variant: 'destructive' });
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingDependency(null);
    setFormData({
      field_id: '',
      depends_on_field: '',
      condition: 'equals',
      condition_value: ''
    });
  };

  const getFieldName = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    return field ? field.field_name : 'Unknown Field';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Field Dependencies</h2>
        <Button 
          onClick={() => setIsCreating(true)} 
          disabled={!selectedPackage || isCreating || editingDependency}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Dependency
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Package</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedPackage} onValueChange={setSelectedPackage}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a package to manage dependencies" />
            </SelectTrigger>
            <SelectContent>
              {packages.map((pkg) => (
                <SelectItem key={pkg.id} value={pkg.id}>
                  {pkg.label_key} ({pkg.value})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {(isCreating || editingDependency) && (
        <Card>
          <CardHeader>
            <CardTitle>{isCreating ? 'Create New Dependency' : 'Edit Dependency'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Target Field</Label>
                <Select 
                  value={formData.field_id} 
                  onValueChange={(value) => setFormData({ ...formData, field_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map((field) => (
                      <SelectItem key={field.id} value={field.id}>
                        {field.field_name} (Step {field.step_number})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Depends On Field</Label>
                <Select 
                  value={formData.depends_on_field} 
                  onValueChange={(value) => setFormData({ ...formData, depends_on_field: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select dependency field" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map((field) => (
                      <SelectItem key={field.id} value={field.field_name}>
                        {field.field_name} (Step {field.step_number})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Condition</Label>
                <Select 
                  value={formData.condition} 
                  onValueChange={(value: any) => setFormData({ ...formData, condition: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="not_equals">Not Equals</SelectItem>
                    <SelectItem value="contains">Contains</SelectItem>
                    <SelectItem value="not_contains">Not Contains</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Condition Value</Label>
                <Input
                  value={formData.condition_value}
                  onChange={(e) => setFormData({ ...formData, condition_value: e.target.value })}
                  placeholder="Enter condition value"
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedPackage && (
        <div className="grid gap-4">
          {dependencies.map((dependency) => (
            <Card key={dependency.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {getFieldName(dependency.field_id)}
                      </h3>
                      <Badge variant="secondary">{dependency.condition}</Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Depends on:</strong> {dependency.depends_on_field}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Value:</strong> {dependency.condition_value}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(dependency)}
                      disabled={isCreating || editingDependency}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(dependency.id)}
                      disabled={isCreating || editingDependency}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {dependencies.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                No dependencies configured for this package.
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default DependenciesManagement;
