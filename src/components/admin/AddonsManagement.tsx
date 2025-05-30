
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Addon {
  id: string;
  addon_key: string;
  label_key: string;
  description_key?: string;
  price: number;
  is_active: boolean;
  trigger_field_type?: string;
  trigger_field_config: any;
  trigger_condition: string;
  trigger_condition_value?: string;
}

const AddonsManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAddon, setSelectedAddon] = useState<Addon | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Addon>>({
    addon_key: '',
    label_key: '',
    description_key: '',
    price: 0,
    is_active: true,
    trigger_field_type: undefined,
    trigger_field_config: {},
    trigger_condition: 'always',
    trigger_condition_value: ''
  });

  // Fetch addons
  const { data: addons = [], isLoading } = useQuery({
    queryKey: ['addons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('addons')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Create/Update addon mutation
  const saveAddonMutation = useMutation({
    mutationFn: async (addonData: Partial<Addon>) => {
      if (selectedAddon) {
        const { error } = await supabase
          .from('addons')
          .update(addonData)
          .eq('id', selectedAddon.id);
        if (error) throw error;
      } else {
        // Ensure required fields are present for insert
        const insertData = {
          addon_key: addonData.addon_key!,
          label_key: addonData.label_key!,
          description_key: addonData.description_key,
          price: addonData.price || 0,
          is_active: addonData.is_active !== undefined ? addonData.is_active : true,
          trigger_field_type: addonData.trigger_field_type || null,
          trigger_field_config: addonData.trigger_field_config || {},
          trigger_condition: addonData.trigger_condition || 'always',
          trigger_condition_value: addonData.trigger_condition_value || null
        };
        
        const { error } = await supabase
          .from('addons')
          .insert(insertData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addons'] });
      toast({
        title: 'Success',
        description: `Addon ${selectedAddon ? 'updated' : 'created'} successfully`
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to ${selectedAddon ? 'update' : 'create'} addon`,
        variant: 'destructive'
      });
    }
  });

  // Delete addon mutation
  const deleteAddonMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('addons')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addons'] });
      toast({
        title: 'Success',
        description: 'Addon deleted successfully'
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete addon',
        variant: 'destructive'
      });
    }
  });

  const resetForm = () => {
    setFormData({
      addon_key: '',
      label_key: '',
      description_key: '',
      price: 0,
      is_active: true,
      trigger_field_type: undefined,
      trigger_field_config: {},
      trigger_condition: 'always',
      trigger_condition_value: ''
    });
    setSelectedAddon(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (addon: Addon) => {
    setSelectedAddon(addon);
    setFormData(addon);
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.addon_key || !formData.label_key) {
      toast({
        title: 'Validation Error',
        description: 'Addon key and label are required',
        variant: 'destructive'
      });
      return;
    }

    saveAddonMutation.mutate(formData);
  };

  const updateTriggerConfig = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      trigger_field_config: {
        ...prev.trigger_field_config,
        [key]: value
      }
    }));
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading addons...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Addons Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Addon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedAddon ? 'Edit' : 'Create'} Addon</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList>
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="trigger">Conditional Fields</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="addon_key">Addon Key *</Label>
                    <Input
                      id="addon_key"
                      value={formData.addon_key}
                      onChange={(e) => setFormData(prev => ({ ...prev, addon_key: e.target.value }))}
                      placeholder="voice_message"
                    />
                  </div>
                  <div>
                    <Label htmlFor="label_key">Label *</Label>
                    <Input
                      id="label_key"
                      value={formData.label_key}
                      onChange={(e) => setFormData(prev => ({ ...prev, label_key: e.target.value }))}
                      placeholder="Voice Message"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description_key">Description</Label>
                  <Textarea
                    id="description_key"
                    value={formData.description_key || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description_key: e.target.value }))}
                    placeholder="Add a personal voice message to your song"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (RON)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                    />
                    <Label>Active</Label>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="trigger" className="space-y-4">
                <div>
                  <Label>Trigger Field Type</Label>
                  <Select
                    value={formData.trigger_field_type || 'none'}
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      trigger_field_type: value === 'none' ? undefined : value 
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No additional field</SelectItem>
                      <SelectItem value="audio-recorder">Audio Recorder</SelectItem>
                      <SelectItem value="file">File Upload</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.trigger_field_type === 'audio-recorder' && (
                  <div>
                    <Label>Max Duration (seconds)</Label>
                    <Input
                      type="number"
                      value={formData.trigger_field_config?.maxDuration || 30}
                      onChange={(e) => updateTriggerConfig('maxDuration', parseInt(e.target.value) || 30)}
                    />
                  </div>
                )}
                
                {formData.trigger_field_type === 'file' && (
                  <div className="space-y-2">
                    <Label>Allowed File Types</Label>
                    <Input
                      value={formData.trigger_field_config?.allowedTypes?.join(', ') || ''}
                      onChange={(e) => updateTriggerConfig('allowedTypes', e.target.value.split(', ').filter(Boolean))}
                      placeholder="image/jpeg, image/png"
                    />
                    <Label>Max File Size</Label>
                    <Input
                      value={formData.trigger_field_config?.maxSize || ''}
                      onChange={(e) => updateTriggerConfig('maxSize', e.target.value)}
                      placeholder="5MB"
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Trigger Condition</Label>
                    <Select
                      value={formData.trigger_condition}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, trigger_condition: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="always">Always Show</SelectItem>
                        <SelectItem value="package_equals">When Package Equals</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.trigger_condition === 'package_equals' && (
                    <div>
                      <Label>Package Value</Label>
                      <Input
                        value={formData.trigger_condition_value || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, trigger_condition_value: e.target.value }))}
                        placeholder="personal"
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={saveAddonMutation.isPending}>
                {saveAddonMutation.isPending ? 'Saving...' : 'Save Addon'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {addons.map((addon) => (
          <Card key={addon.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{addon.label_key}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{addon.description_key}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={addon.is_active ? 'default' : 'secondary'}>
                    {addon.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <span className="font-semibold text-purple-600">{addon.price} RON</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Key: {addon.addon_key}</span>
                  {addon.trigger_field_type && (
                    <Badge variant="outline">
                      <Settings className="w-3 h-3 mr-1" />
                      {addon.trigger_field_type}
                    </Badge>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(addon)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => deleteAddonMutation.mutate(addon.id)}
                    disabled={deleteAddonMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AddonsManagement;
