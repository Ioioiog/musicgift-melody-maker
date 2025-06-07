
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
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Canvas editor section - Full width */}
        <div>
          <Label>Canvas Design</Label>
          <div className="mt-2 border rounded-lg p-4 bg-gray-50">
            <GiftCardCanvasEditor
              value={formData.template_data}
              onChange={handleCanvasDataChange}
              backgroundImage={formData.preview_image_url}
            />
          </div>
        </div>

        {/* Form fields section - Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Design Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Input
                id="theme"
                value={formData.theme}
                onChange={(e) => handleInputChange('theme', e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange('is_active', checked)}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>

          <div>
            <ImageUpload
              label="Background Image"
              value={formData.preview_image_url}
              onChange={(url) => handleInputChange('preview_image_url', url)}
              bucketName="gift-card-designs"
              maxSizeBytes={5 * 1024 * 1024}
              acceptedTypes={['image/jpeg', 'image/png', 'image/webp', 'image/gif']}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : design ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GiftCardDesignForm;
