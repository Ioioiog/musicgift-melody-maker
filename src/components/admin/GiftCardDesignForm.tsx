
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ui/image-upload";
import { useToast } from "@/hooks/use-toast";
import { useCreateGiftCardDesign, useUpdateGiftCardDesign } from "@/hooks/useGiftCards";
import GiftCardCanvasEditor from "./GiftCardCanvasEditor";

interface GiftCardDesignFormProps {
  design?: any;
  onSuccess: () => void;
}

const GiftCardDesignForm: React.FC<GiftCardDesignFormProps> = ({ design, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: design?.name || '',
    theme: design?.theme || '',
    preview_image_url: design?.preview_image_url || '',
    is_active: design?.is_active ?? true,
    template_data: design?.template_data || {
      canvasWidth: 400,
      canvasHeight: 250,
      elements: []
    }
  });

  const { toast } = useToast();
  const createDesignMutation = useCreateGiftCardDesign();
  const updateDesignMutation = useUpdateGiftCardDesign();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const designData = {
        name: formData.name,
        theme: formData.theme,
        preview_image_url: formData.preview_image_url,
        is_active: formData.is_active,
        template_data: formData.template_data
      };

      if (design) {
        await updateDesignMutation.mutateAsync({
          id: design.id,
          designData
        });
      } else {
        await createDesignMutation.mutateAsync(designData);
      }
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save design",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCanvasDataChange = (canvasData: any) => {
    setFormData(prev => ({
      ...prev,
      template_data: {
        ...canvasData,
        backgroundImage: prev.preview_image_url
      }
    }));
  };

  const isSubmitting = createDesignMutation.isPending || updateDesignMutation.isPending;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header with title and action buttons */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {design ? 'Edit Design' : 'Create New Design'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Design your gift card template with the canvas editor
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            {isSubmitting ? 'Saving...' : design ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Design Controls */}
        <div className="w-80 bg-white border-r overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Design Settings</h3>
              
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Design Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter design name"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="theme" className="text-sm font-medium text-gray-700">
                  Theme
                </Label>
                <Input
                  id="theme"
                  value={formData.theme}
                  onChange={(e) => handleInputChange('theme', e.target.value)}
                  placeholder="e.g., Birthday, Christmas, Valentine"
                  className="mt-1"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Active Design
                </Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Background Image</h3>
              <ImageUpload
                label=""
                value={formData.preview_image_url}
                onChange={(url) => handleInputChange('preview_image_url', url)}
                bucketName="gift-card-designs"
                maxSizeBytes={5 * 1024 * 1024}
                acceptedTypes={['image/jpeg', 'image/png', 'image/webp', 'image/gif']}
              />
            </div>

            {/* Canvas dimensions info */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Canvas Info</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Width: {formData.template_data.canvasWidth}px</p>
                <p>Height: {formData.template_data.canvasHeight}px</p>
                <p>Elements: {formData.template_data.elements?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Canvas Header */}
          <div className="bg-white border-b px-6 py-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Canvas Editor</h2>
              <div className="text-sm text-gray-500">
                Design your gift card layout
              </div>
            </div>
          </div>

          {/* Canvas Container */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="flex justify-center items-start min-h-full">
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
                <GiftCardCanvasEditor
                  value={formData.template_data}
                  onChange={handleCanvasDataChange}
                  backgroundImage={formData.preview_image_url}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick save indicator */}
      {(createDesignMutation.isPending || updateDesignMutation.isPending) && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          Saving design...
        </div>
      )}
    </div>
  );
};

export default GiftCardDesignForm;
