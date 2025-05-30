
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { Tables, Enums } from '@/integrations/supabase/types';

type StepField = Tables<'step_fields'> & {
  step?: {
    title_key: string;
    step_number: number;
  };
};

type StepData = Tables<'steps'> & {
  package_info?: {
    label_key: string;
    value: string;
  };
};

const fieldTypes: Enums<'field_type'>[] = [
  'text', 'email', 'tel', 'textarea', 'select', 
  'checkbox', 'checkbox-group', 'date', 'url', 'file'
];

const FieldsManagement = () => {
  const [selectedStep, setSelectedStep] = useState('');
  const [editingField, setEditingField] = useState<StepField | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [optionsText, setOptionsText] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all steps
  const { data: steps = [] } = useQuery({
    queryKey: ['admin-all-steps'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('steps')
        .select(`
          id, 
          title_key, 
          step_number,
          package_info:package_info(label_key, value)
        `)
        .eq('is_active', true)
        .order('step_number');
      if (error) throw error;
      return data as StepData[];
    }
  });

  // Fetch fields for selected step
  const { data: fields = [], isLoading } = useQuery({
    queryKey: ['admin-fields', selectedStep],
    queryFn: async () => {
      if (!selectedStep) return [];
      const { data, error } = await supabase
        .from('step_fields')
        .select(`
          *,
          step:steps(title_key, step_number)
        `)
        .eq('step_id', selectedStep)
        .order('field_order');
      if (error) throw error;
      return data as StepField[];
    },
    enabled: !!selectedStep
  });

  // Create field mutation
  const createFieldMutation = useMutation({
    mutationFn: async (fieldData: Tables<'step_fields'>['Insert']) => {
      const { data, error } = await supabase
        .from('step_fields')
        .insert(fieldData)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-fields'] });
      toast({ title: 'Field created successfully' });
      setDialogOpen(false);
      setEditingField(null);
      setOptionsText('');
    },
    onError: (error) => {
      toast({ title: 'Error creating field', description: error.message, variant: 'destructive' });
    }
  });

  // Update field mutation
  const updateFieldMutation = useMutation({
    mutationFn: async ({ id, ...fieldData }: { id: string } & Tables<'step_fields'>['Update']) => {
      const { data, error } = await supabase
        .from('step_fields')
        .update(fieldData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-fields'] });
      toast({ title: 'Field updated successfully' });
      setDialogOpen(false);
      setEditingField(null);
      setOptionsText('');
    },
    onError: (error) => {
      toast({ title: 'Error updating field', description: error.message, variant: 'destructive' });
    }
  });

  // Delete field mutation
  const deleteFieldMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('step_fields')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-fields'] });
      toast({ title: 'Field deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error deleting field', description: error.message, variant: 'destructive' });
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    let options = null;
    if (optionsText.trim()) {
      try {
        options = optionsText.split('\n').filter(line => line.trim()).map(line => line.trim());
      } catch (error) {
        toast({ title: 'Invalid options format', variant: 'destructive' });
        return;
      }
    }

    const fieldData: Tables<'step_fields'>['Insert'] = {
      step_id: selectedStep,
      field_name: formData.get('field_name') as string,
      field_type: formData.get('field_type') as Enums<'field_type'>,
      placeholder_key: formData.get('placeholder_key') as string || null,
      required: formData.get('required') === 'on',
      field_order: parseInt(formData.get('field_order') as string),
      options: options
    };

    if (editingField) {
      updateFieldMutation.mutate({ id: editingField.id, ...fieldData });
    } else {
      createFieldMutation.mutate(fieldData);
    }
  };

  const openCreateDialog = () => {
    setEditingField(null);
    setOptionsText('');
    setDialogOpen(true);
  };

  const openEditDialog = (field: StepField) => {
    setEditingField(field);
    setOptionsText(Array.isArray(field.options) ? field.options.join('\n') : '');
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Fields Management</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} disabled={!selectedStep}>
              <Plus className="w-4 h-4 mr-2" />
              Add Field
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingField ? 'Edit Field' : 'Create Field'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="field_name">Field Name</Label>
                <Input 
                  id="field_name" 
                  name="field_name" 
                  defaultValue={editingField?.field_name} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="field_type">Field Type</Label>
                <Select name="field_type" defaultValue={editingField?.field_type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field type" />
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
              <div>
                <Label htmlFor="placeholder_key">Placeholder Key</Label>
                <Input 
                  id="placeholder_key" 
                  name="placeholder_key" 
                  defaultValue={editingField?.placeholder_key || ''} 
                />
              </div>
              <div>
                <Label htmlFor="field_order">Field Order</Label>
                <Input 
                  id="field_order" 
                  name="field_order" 
                  type="number" 
                  defaultValue={editingField?.field_order} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="options">Options (one per line, for select/checkbox-group fields)</Label>
                <Textarea 
                  id="options" 
                  name="options" 
                  value={optionsText}
                  onChange={(e) => setOptionsText(e.target.value)}
                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                  rows={4}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="required" 
                  name="required" 
                  defaultChecked={editingField?.required ?? false} 
                />
                <Label htmlFor="required">Required</Label>
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1">
                  {editingField ? 'Update' : 'Create'}
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
          <CardTitle>Step Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedStep} onValueChange={setSelectedStep}>
            <SelectTrigger>
              <SelectValue placeholder="Select a step to manage its fields" />
            </SelectTrigger>
            <SelectContent>
              {steps.map((step) => (
                <SelectItem key={step.id} value={step.id}>
                  Step {step.step_number}: {step.title_key} ({step.package_info?.label_key})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedStep && (
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">Loading fields...</div>
            ) : fields.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No fields found for this step</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Required</TableHead>
                    <TableHead>Has Options</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field) => (
                    <TableRow key={field.id}>
                      <TableCell>{field.field_name}</TableCell>
                      <TableCell>{field.field_type}</TableCell>
                      <TableCell>{field.field_order}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          field.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {field.required ? 'Required' : 'Optional'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {field.options && Array.isArray(field.options) && field.options.length > 0 ? 'Yes' : 'No'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => openEditDialog(field)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => deleteFieldMutation.mutate(field.id)}
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

export default FieldsManagement;
