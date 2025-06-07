
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

  const [selectedElementIndex, setSelectedElementIndex] = useState<number | null>(null);

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

  const updateElementProperty = (elementIndex: number, property: string, value: any) => {
    const updatedElements = [...formData.template_data.elements];
    updatedElements[elementIndex] = {
      ...updatedElements[elementIndex],
      [property]: value
    };
    
    handleCanvasDataChange({
      ...formData.template_data,
      elements: updatedElements
    });
  };

  const updateSelectedElementProperty = (property: string, value: any) => {
    if (selectedElementIndex !== null) {
      updateElementProperty(selectedElementIndex, property, value);
    }
  };

  const selectedElement = selectedElementIndex !== null ? formData.template_data.elements[selectedElementIndex] : null;

  const isSubmitting = createDesignMutation.isPending || updateDesignMutation.isPending;

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header with title and action buttons */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center flex-shrink-0">
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

      {/* Main Content - Single Column */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Design Settings Section */}
        <div className="bg-white border-b px-6 py-4 flex-shrink-0">
          <div className="space-y-4 max-w-md">
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
                placeholder="e.g., Birthday, Christmas"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Background Image
              </Label>
              <ImageUpload
                label=""
                value={formData.preview_image_url}
                onChange={(url) => handleInputChange('preview_image_url', url)}
                bucketName="gift-card-designs"
                maxSizeBytes={5 * 1024 * 1024}
                acceptedTypes={['image/jpeg', 'image/png', 'image/webp', 'image/gif']}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange('is_active', checked)}
              />
              <Label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                Active
              </Label>
            </div>

            <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
              <div>Canvas Size: {formData.template_data.canvasWidth} × {formData.template_data.canvasHeight}px</div>
              <div>Elements: {formData.template_data.elements?.length || 0}</div>
            </div>
          </div>
        </div>

        {/* Element Properties Section */}
        {selectedElement && (
          <div className="bg-white border-b px-6 py-4 flex-shrink-0">
            <div className="flex items-center gap-6">
              <h3 className="text-lg font-medium text-gray-900">
                Editing: {selectedElement.type || 'Element'} {(selectedElementIndex || 0) + 1}
              </h3>
              
              {selectedElement.type === 'shape' && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Fill:</Label>
                    <input
                      type="color"
                      value={selectedElement.fill || '#000000'}
                      onChange={(e) => updateSelectedElementProperty('fill', e.target.value)}
                      className="w-8 h-8 rounded border cursor-pointer"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Border:</Label>
                    <input
                      type="color"
                      value={selectedElement.stroke || '#000000'}
                      onChange={(e) => updateSelectedElementProperty('stroke', e.target.value)}
                      className="w-8 h-8 rounded border cursor-pointer"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Width:</Label>
                    <Input
                      type="number"
                      value={selectedElement.strokeWidth || 1}
                      onChange={(e) => updateSelectedElementProperty('strokeWidth', parseInt(e.target.value))}
                      className="w-16 h-8"
                      min="0"
                      max="20"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Opacity:</Label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={selectedElement.opacity || 1}
                      onChange={(e) => updateSelectedElementProperty('opacity', parseFloat(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-xs text-gray-500 w-8">
                      {Math.round((selectedElement.opacity || 1) * 100)}%
                    </span>
                  </div>
                </div>
              )}

              {selectedElement.type === 'text' && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Text:</Label>
                    <Input
                      value={selectedElement.text || ''}
                      onChange={(e) => updateSelectedElementProperty('text', e.target.value)}
                      className="w-40 h-8"
                      placeholder="Enter text"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Color:</Label>
                    <input
                      type="color"
                      value={selectedElement.fill || '#000000'}
                      onChange={(e) => updateSelectedElementProperty('fill', e.target.value)}
                      className="w-8 h-8 rounded border cursor-pointer"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Size:</Label>
                    <Input
                      type="number"
                      value={selectedElement.fontSize || 16}
                      onChange={(e) => updateSelectedElementProperty('fontSize', parseInt(e.target.value))}
                      className="w-16 h-8"
                      min="8"
                      max="72"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Weight:</Label>
                    <select
                      value={selectedElement.fontWeight || 'normal'}
                      onChange={(e) => updateSelectedElementProperty('fontWeight', e.target.value)}
                      className="h-8 px-2 border rounded"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                      <option value="lighter">Light</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedElementIndex(null)}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="h-full flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <GiftCardCanvasEditor
                value={formData.template_data}
                onChange={handleCanvasDataChange}
                backgroundImage={formData.preview_image_url}
                selectedElementIndex={selectedElementIndex}
                onElementSelect={setSelectedElementIndex}
              />
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
