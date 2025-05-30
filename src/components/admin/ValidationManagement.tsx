
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { Tables, Enums } from '@/integrations/supabase/types';

type FieldValidation = Tables<'field_validation'> & {
  field?: {
    field_name: string;
    step?: {
      title_key: string;
      step_number: number;
    };
  };
};

type FieldData = Tables<'step_fields'> & {
  step?: {
    title_key: string;
    step_number: number;
  };
};

const validationTypes: Enums<'validation_rule_type'>[] = [
  'required', 'min_length', 'max_length', 'pattern', 'custom'
];

const ValidationManagement = () => {
  const [selectedField, setSelectedField] = useState('');
  const [editingValidation, setEditingValidation] = useState<FieldValidation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all fields
  const { data: fields = [] } = useQuery({
    queryKey: ['admin-all-fields'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('step_fields')
        .select(`
          id, 
          field_name,
          step:steps(title_key, step_number, package_info:package_info(label_key))
        `)
        .order('field_name');
      if (error) throw error;
      return data as FieldData[];
    }
  });

  // Fetch validations for selected field
  const { data: validations = [], isLoading } = useQuery({
    queryKey: ['admin-validations', selectedField],
    queryFn: async () => {
      if (!selectedField) return [];
      const { data, error } = await supabase
        .from('field_validation')
        .select(`
          *,
          field:step_fields(
            field_name,
            step:steps(title_key, step_number)
          )
        `)
        .eq('field_id', selectedField)
        .order('validation_type');
      if (error) throw error;
      return data as FieldValidation[];
    },
    enabled: !!selectedField
  });

  // Create validation mutation
  const createValidationMutation = useMutation({
    mutationFn: async (validationData: Tables<'field_validation'>['Insert']) => {
      const { data, error } = await supabase
        .from('field_validation')
        .insert(validationData)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-validations'] });
      toast({ title: 'Validation rule created successfully' });
      setDialogOpen(false);
      setEditingValidation(null);
    },
    onError: (error) => {
      toast({ title: 'Error creating validation rule', description: error.message, variant: 'destructive' });
    }
  });

  // Update validation mutation
  const updateValidationMutation = useMutation({
    mutationFn: async ({ id, ...validationData }: { id: string } & Tables<'field_validation'>['Update']) => {
      const { data, error } = await supabase
        .from('field_validation')
        .update(validationData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-validations'] });
      toast({ title: 'Validation rule updated successfully' });
      setDialogOpen(false);
      setEditingValidation(null);
    },
    onError: (error) => {
      toast({ title: 'Error updating validation rule', description: error.message, variant: 'destructive' });
    }
  });

  // Delete validation mutation
  const deleteValidationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('field_validation')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-validations'] });
      toast({ title: 'Validation rule deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error deleting validation rule', description: error.message, variant: 'destructive' });
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const validationData: Tables<'field_validation'>['Insert'] = {
      field_id: selectedField,
      validation_type: formData.get('validation_type') as Enums<'validation_rule_type'>,
      validation_value: formData.get('validation_value') as string || null,
      error_message_key: formData.get('error_message_key') as string || null,
      is_active: formData.get('is_active') === 'on'
    };

    if (editingValidation) {
      updateValidationMutation.mutate({ id: editingValidation.id, ...validationData });
    } else {
      createValidationMutation.mutate(validationData);
    }
  };

  const openCreateDialog = () => {
    setEditingValidation(null);
    setDialogOpen(true);
  };

  const openEditDialog = (validation: FieldValidation) => {
    setEditingValidation(validation);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Validation Management</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} disabled={!selectedField}>
              <Plus className="w-4 h-4 mr-2" />
              Add Validation Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingValidation ? 'Edit Validation Rule' : 'Create Validation Rule'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="validation_type">Validation Type</Label>
                <Select name="validation_type" defaultValue={editingValidation?.validation_type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select validation type" />
                  </SelectTrigger>
                  <SelectContent>
                    {validationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace('_', ' ').toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="validation_value">Validation Value</Label>
                <Input 
                  id="validation_value" 
                  name="validation_value" 
                  defaultValue={editingValidation?.validation_value || ''} 
                  placeholder="e.g., 5 for min_length, regex pattern for pattern validation"
                />
              </div>
              <div>
                <Label htmlFor="error_message_key">Error Message Key</Label>
                <Input 
                  id="error_message_key" 
                  name="error_message_key" 
                  defaultValue={editingValidation?.error_message_key || ''} 
                  placeholder="Translation key for error message"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="is_active" 
                  name="is_active" 
                  defaultChecked={editingValidation?.is_active ?? true} 
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1">
                  {editingValidation ? 'Update' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Field Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedField} onValueChange={setSelectedField}>
            <SelectTrigger>
              <SelectValue placeholder="Select a field to manage its validation rules" />
            </SelectTrigger>
            <SelectContent>
              {fields.map((field) => (
                <SelectItem key={field.id} value={field.id}>
                  {field.field_name} (Step {field.step?.step_number}: {field.step?.title_key})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedField && (
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">Loading validation rules...</div>
            ) : validations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No validation rules found for this field</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Validation Type</TableHead>
                    <TableHead>Validation Value</TableHead>
                    <TableHead>Error Message Key</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validations.map((validation) => (
                    <TableRow key={validation.id}>
                      <TableCell>{validation.validation_type.replace('_', ' ').toUpperCase()}</TableCell>
                      <TableCell>{validation.validation_value || '-'}</TableCell>
                      <TableCell>{validation.error_message_key || '-'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          validation.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {validation.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => openEditDialog(validation)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => deleteValidationMutation.mutate(validation.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ValidationManagement;
