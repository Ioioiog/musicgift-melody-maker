
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X, AlertCircle, Eye } from 'lucide-react';
import { packages } from '@/data/packages';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { Package } from '@/types';

const PackageManagement = () => {
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

      // For static data, we can only show success message
      // In a real implementation, this would save to database
      if (isCreating) {
        toast({ title: 'Package created successfully (Note: This is static data)' });
      } else if (editingPackage) {
        toast({ title: 'Package updated successfully (Note: This is static data)' });
      }
      
      setIsCreating(false);
      setEditingPackage(null);
      resetForm();
    } catch (error) {
      console.error('Error saving package:', error);
      toast({ 
        title: 'Error saving package', 
        description: 'This is static data and cannot be modified',
        variant: 'destructive' 
      });
    }
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg.id || pkg.value);
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
    if (!confirm('Are you sure you want to delete this package? Note: This is static data and cannot be actually deleted.')) return;
    
    try {
      // For static data, we can only show a message
      toast({ title: 'Package deleted successfully (Note: This is static data)' });
    } catch (error) {
      console.error('Error deleting package:', error);
      toast({ 
        title: 'Error deleting package', 
        description: 'This is static data and cannot be modified',
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

  const getTagColor = (tag?: string) => {
    switch (tag) {
      case 'popular': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'new': return 'bg-green-100 text-green-800';
      case 'gift': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Package Management</h2>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating || !!editingPackage}>
          <Plus className="w-4 h-4 mr-2" />
          Add Package
        </Button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <div>
            <div className="font-medium text-yellow-800">Static Data Mode</div>
            <div className="text-sm text-yellow-700">
              Currently displaying packages from static data (packages.ts). 
              Changes made here won't persist unless connected to a database.
            </div>
          </div>
        </div>
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
            <Card key={pkg.id || pkg.value}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{pkg.value}</h3>
                      <Badge variant="secondary">{pkg.price} RON</Badge>
                      {pkg.tag && (
                        <Badge className={getTagColor(pkg.tag)}>
                          {pkg.tag}
                        </Badge>
                      )}
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
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Includes:</strong> {pkg.includes.length} items
                      </p>
                    )}
                    {pkg.steps && pkg.steps.length > 0 && (
                      <p className="text-sm text-gray-600">
                        <strong>Steps:</strong> {pkg.steps.length} form steps
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Package Details: {pkg.value}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Basic Info:</h4>
                              <p><strong>Value:</strong> {pkg.value}</p>
                              <p><strong>Price:</strong> {pkg.price} RON</p>
                              <p><strong>Tag:</strong> {pkg.tag || 'None'}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Keys:</h4>
                              <p><strong>Label:</strong> {pkg.label_key}</p>
                              <p><strong>Tagline:</strong> {pkg.tagline_key}</p>
                              <p><strong>Delivery:</strong> {pkg.delivery_time_key}</p>
                            </div>
                          </div>
                          
                          {pkg.includes && pkg.includes.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Includes ({pkg.includes.length}):</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm">
                                {pkg.includes.map((include, index) => (
                                  <li key={index}>{include.include_key}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {pkg.steps && pkg.steps.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Form Steps ({pkg.steps.length}):</h4>
                              <div className="space-y-3">
                                {pkg.steps.map((step) => (
                                  <div key={step.id} className="border rounded p-3">
                                    <h5 className="font-medium">Step {step.step_number}: {step.title_key}</h5>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {step.fields.length} fields
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                    
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
                      onClick={() => handleDelete(pkg.id || pkg.value)}
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
