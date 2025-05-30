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
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Step = Tables<'steps'> & {
  package_info?: {
    label_key: string;
    value: string;
  };
};

type PackageData = Tables<'package_info'>;

const StepsManagement = () => {
  const [selectedPackage, setSelectedPackage] = useState('');
  const [editingStep, setEditingStep] = useState<Step | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch packages
  const { data: packages = [] } = useQuery({
    queryKey: ['admin-packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('package_info')
        .select('id, label_key, value')
        .eq('is_active', true)
        .order('value');
      if (error) throw error;
      return data as PackageData[];
    }
  });

  // Fetch steps for selected package
  const { data: steps = [], isLoading } = useQuery({
    queryKey: ['admin-steps', selectedPackage],
    queryFn: async () => {
      if (!selectedPackage) return [];
      const { data, error } = await supabase
        .from('steps')
        .select(`
          *,
          package_info:package_info(label_key, value)
        `)
        .eq('package_id', selectedPackage)
        .order('step_order');
      if (error) throw error;
      return data as Step[];
    },
    enabled: !!selectedPackage
  });

  // Create step mutation
  const createStepMutation = useMutation({
    mutationFn: async (stepData: TablesInsert<'steps'>) => {
      const { data, error } = await supabase
        .from('steps')
        .insert(stepData)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-steps'] });
      toast({ title: 'Step created successfully' });
      setDialogOpen(false);
      setEditingStep(null);
    },
    onError: (error) => {
      toast({ title: 'Error creating step', description: error.message, variant: 'destructive' });
    }
  });

  // Update step mutation
  const updateStepMutation = useMutation({
    mutationFn: async ({ id, ...stepData }: { id: string } & TablesUpdate<'steps'>) => {
      const { data, error } = await supabase
        .from('steps')
        .update(stepData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-steps'] });
      toast({ title: 'Step updated successfully' });
      setDialogOpen(false);
      setEditingStep(null);
    },
    onError: (error) => {
      toast({ title: 'Error updating step', description: error.message, variant: 'destructive' });
    }
  });

  // Delete step mutation
  const deleteStepMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('steps')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-steps'] });
      toast({ title: 'Step deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error deleting step', description: error.message, variant: 'destructive' });
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const stepData: TablesInsert<'steps'> = {
      package_id: selectedPackage,
      step_number: parseInt(formData.get('step_number') as string),
      title_key: formData.get('title_key') as string,
      step_order: parseInt(formData.get('step_order') as string),
      is_active: formData.get('is_active') === 'on'
    };

    if (editingStep) {
      updateStepMutation.mutate({ id: editingStep.id, ...stepData });
    } else {
      createStepMutation.mutate(stepData);
    }
  };

  const openCreateDialog = () => {
    setEditingStep(null);
    setDialogOpen(true);
  };

  const openEditDialog = (step: Step) => {
    setEditingStep(step);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Steps Management</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} disabled={!selectedPackage}>
              <Plus className="w-4 h-4 mr-2" />
              Add Step
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingStep ? 'Edit Step' : 'Create Step'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="step_number">Step Number</Label>
                <Input 
                  id="step_number" 
                  name="step_number" 
                  type="number" 
                  defaultValue={editingStep?.step_number} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="title_key">Title Key</Label>
                <Input 
                  id="title_key" 
                  name="title_key" 
                  defaultValue={editingStep?.title_key} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="step_order">Step Order</Label>
                <Input 
                  id="step_order" 
                  name="step_order" 
                  type="number" 
                  defaultValue={editingStep?.step_order} 
                  required 
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="is_active" 
                  name="is_active" 
                  defaultChecked={editingStep?.is_active ?? true} 
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1">
                  {editingStep ? 'Update' : 'Create'}
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
          <CardTitle>Package Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedPackage} onValueChange={setSelectedPackage}>
            <SelectTrigger>
              <SelectValue placeholder="Select a package to manage its steps" />
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

      {selectedPackage && (
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">Loading steps...</div>
            ) : steps.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No steps found for this package</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Step Number</TableHead>
                    <TableHead>Title Key</TableHead>
                    <TableHead>Step Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {steps.map((step) => (
                    <TableRow key={step.id}>
                      <TableCell>{step.step_number}</TableCell>
                      <TableCell>{step.title_key}</TableCell>
                      <TableCell>{step.step_order}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          step.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {step.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => openEditDialog(step)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => deleteStepMutation.mutate(step.id)}
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

export default StepsManagement;
