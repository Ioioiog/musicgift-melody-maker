
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X, AlertCircle } from 'lucide-react';
import { usePackages } from '@/hooks/usePackageData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PackageManagement = () => {
  const { data: packages = [], refetch, isLoading, error } = usePackages();
  const [editingPackage, setEditingPackage] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    value: '',
    label_key: '',
    price: 0,
    tagline_key: '',
    description_key: '',
    delivery_time_key: ''
  });
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.value || !formData.label_key) {
        toast({ 
          title: 'Validation Error', 
          description: 'Package value and label key are required',
          variant: 'destructive' 
        });
        return;
      }

      if (isCreating) {
        const { error } = await supabase
          .from('package_info')
          .insert({
            ...formData,
            is_active: true
          });
        if (error) throw error;
        toast({ title: 'Package created successfully' });
      } else if (editingPackage) {
        const { error } = await supabase
          .from('package_info')
          .update(formData)
          .eq('id', editingPackage);
        if (error) throw error;
        toast({ title: 'Package updated successfully' });
      }
      
      setIsCreating(false);
      setEditingPackage(null);
      resetForm();
      refetch();
    } catch (error) {
      console.error('Error saving package:', error);
      toast({ 
        title: 'Error saving package', 
        description: error.message || 'Unknown error occurred',
        variant: 'destructive' 
      });
    }
  };

  const handleEdit = (pkg: any) => {
    setEditingPackage(pkg.id);
    setFormData({
      value: pkg.originalValue || pkg.value, // Use originalValue for database operations
      label_key: pkg.label_key,
      price: pkg.price,
      tagline_key: pkg.tagline_key || '',
      description_key: pkg.description_key || '',
      delivery_time_key: pkg.delivery_time_key || ''
    });
  };

  const handleDelete = async (packageId: string) => {
    if (!confirm('Are you sure you want to delete this package? This will also delete all associated steps, fields, and tags.')) return;
    
    try {
      const { error } = await supabase
        .from('package_info')
        .delete()
        .eq('id', packageId);
      
      if (error) throw error;
      toast({ title: 'Package deleted successfully' });
      refetch();
    } catch (error) {
      console.error('Error deleting package:', error);
      toast({ 
        title: 'Error deleting package', 
        description: error.message || 'Unknown error occurred',
        variant: 'destructive' 
      });
    }
  };

  const resetForm = () => {
    setFormData({
      value: '',
      label_key: '',
      price: 0,
      tagline_key: '',
      description_key: '',
      delivery_time_key: ''
    });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingPackage(null);
    resetForm();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading packages...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-md">
        <AlertCircle className="w-5 h-5" />
        <div>
          <div className="font-medium">Error loading packages</div>
          <div className="text-sm">{error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Package Management</h2>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating || !!editingPackage}>
          <Plus className="w-4 h-4 mr-2" />
          Add Package
        </Button>
      </div>

      {(isCreating || editingPackage) && (
        <Card>
          <CardHeader>
            <CardTitle>{isCreating ? 'Create New Package' : 'Edit Package'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="value">Package Value *</Label>
                <Input
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="e.g., personal, premium"
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Price (RON) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="label_key">Label Key *</Label>
              <Input
                id="label_key"
                value={formData.label_key}
                onChange={(e) => setFormData({ ...formData, label_key: e.target.value })}
                placeholder="e.g., personalPackage"
                required
              />
            </div>

            <div>
              <Label htmlFor="tagline_key">Tagline Key</Label>
              <Input
                id="tagline_key"
                value={formData.tagline_key}
                onChange={(e) => setFormData({ ...formData, tagline_key: e.target.value })}
                placeholder="e.g., personalTagline"
              />
            </div>

            <div>
              <Label htmlFor="delivery_time_key">Delivery Time Key</Label>
              <Input
                id="delivery_time_key"
                value={formData.delivery_time_key}
                onChange={(e) => setFormData({ ...formData, delivery_time_key: e.target.value })}
                placeholder="e.g., deliveryTime7Days"
              />
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

      <div className="grid gap-4">
        {packages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No packages found. Create your first package above.
          </div>
        ) : (
          packages.map((pkg) => (
            <Card key={pkg.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{pkg.value}</h3>
                      <Badge variant="secondary">{pkg.price} RON</Badge>
                      {pkg.tags?.map((tag: any) => (
                        <Badge key={tag.id} className={tag.styling_class || "bg-gray-100 text-gray-700"}>
                          {tag.tag_label_key || tag.tag_type}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Label:</strong> {pkg.label_key}
                    </p>
                    {pkg.tagline_key && (
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Tagline:</strong> {pkg.tagline_key}
                      </p>
                    )}
                    {pkg.delivery_time_key && (
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Delivery:</strong> {pkg.delivery_time_key}
                      </p>
                    )}
                    {pkg.includes && pkg.includes.length > 0 && (
                      <p className="text-sm text-gray-600">
                        <strong>Includes:</strong> {pkg.includes.length} items
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(pkg)}
                      disabled={isCreating || !!editingPackage}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(pkg.id)}
                      disabled={isCreating || !!editingPackage}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PackageManagement;
