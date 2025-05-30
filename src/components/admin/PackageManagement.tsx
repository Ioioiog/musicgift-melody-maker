
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { usePackages } from '@/hooks/usePackageData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PackageManagement = () => {
  const { data: packages = [], refetch } = usePackages();
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
      if (isCreating) {
        const { error } = await supabase
          .from('package_info')
          .insert(formData);
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
      setFormData({
        value: '',
        label_key: '',
        price: 0,
        tagline_key: '',
        description_key: '',
        delivery_time_key: ''
      });
      refetch();
    } catch (error) {
      console.error('Error saving package:', error);
      toast({ title: 'Error saving package', variant: 'destructive' });
    }
  };

  const handleEdit = (pkg: any) => {
    setEditingPackage(pkg.id);
    setFormData({
      value: pkg.value,
      label_key: pkg.label_key,
      price: pkg.price,
      tagline_key: pkg.tagline_key || '',
      description_key: pkg.description_key || '',
      delivery_time_key: pkg.delivery_time_key || ''
    });
  };

  const handleDelete = async (packageId: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    
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
      toast({ title: 'Error deleting package', variant: 'destructive' });
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingPackage(null);
    setFormData({
      value: '',
      label_key: '',
      price: 0,
      tagline_key: '',
      description_key: '',
      delivery_time_key: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Package Management</h2>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating || editingPackage}>
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
                <Label htmlFor="value">Package Value</Label>
                <Input
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="e.g., personal, premium"
                />
              </div>
              <div>
                <Label htmlFor="price">Price (RON)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="label_key">Label Key</Label>
              <Input
                id="label_key"
                value={formData.label_key}
                onChange={(e) => setFormData({ ...formData, label_key: e.target.value })}
                placeholder="e.g., personalPackage"
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
        {packages.map((pkg) => (
          <Card key={pkg.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold">{pkg.value}</h3>
                    <Badge variant="secondary">{pkg.price} RON</Badge>
                    {pkg.tags?.map((tag: any) => (
                      <Badge key={tag.id} className={tag.styling_class}>
                        {tag.tag_label_key}
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
                    <p className="text-sm text-gray-600">
                      <strong>Delivery:</strong> {pkg.delivery_time_key}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(pkg)}
                    disabled={isCreating || editingPackage}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(pkg.id)}
                    disabled={isCreating || editingPackage}
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

export default PackageManagement;
