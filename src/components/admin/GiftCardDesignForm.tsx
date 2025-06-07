
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

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - Settings Panel */}
        <div className="w-80 bg-white border-r flex flex-col overflow-hidden">
          {/* Design Settings */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Design Settings</h3>
            <div className="space-y-4">
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
            </div>
          </div>

          {/* Canvas Info */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Canvas Info</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Size:</span>
                <span>{formData.template_data.canvasWidth} × {formData.template_data.canvasHeight}px</span>
              </div>
              <div className="flex justify-between">
                <span>Elements:</span>
                <span>{formData.template_data.elements?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Element Properties */}
          <div className="flex-1 overflow-auto">
            {selectedElement ? (
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Element Properties
                  </h3>
                  <button
                    onClick={() => setSelectedElementIndex(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="text-sm font-medium text-gray-700 mb-3">
                    {selectedElement.type || 'Element'} {(selectedElementIndex || 0) + 1}
                  </div>

                  {selectedElement.type === 'shape' && (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm">Fill Color</Label>
                        <input
                          type="color"
                          value={selectedElement.fill || '#000000'}
                          onChange={(e) => updateSelectedElementProperty('fill', e.target.value)}
                          className="w-full h-10 rounded border cursor-pointer mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm">Border Color</Label>
                        <input
                          type="color"
                          value={selectedElement.stroke || '#000000'}
                          onChange={(e) => updateSelectedElementProperty('stroke', e.target.value)}
                          className="w-full h-10 rounded border cursor-pointer mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm">Border Width</Label>
                        <Input
                          type="number"
                          value={selectedElement.strokeWidth || 1}
                          onChange={(e) => updateSelectedElementProperty('strokeWidth', parseInt(e.target.value))}
                          className="mt-1"
                          min="0"
                          max="20"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm">Opacity</Label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={selectedElement.opacity || 1}
                          onChange={(e) => updateSelectedElementProperty('opacity', parseFloat(e.target.value))}
                          className="w-full mt-1"
                        />
                        <div className="text-xs text-gray-500 text-center mt-1">
                          {Math.round((selectedElement.opacity || 1) * 100)}%
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedElement.type === 'text' && (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm">Text</Label>
                        <Input
                          value={selectedElement.text || ''}
                          onChange={(e) => updateSelectedElementProperty('text', e.target.value)}
                          className="mt-1"
                          placeholder="Enter text"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm">Text Color</Label>
                        <input
                          type="color"
                          value={selectedElement.fill || '#000000'}
                          onChange={(e) => updateSelectedElementProperty('fill', e.target.value)}
                          className="w-full h-10 rounded border cursor-pointer mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm">Font Size</Label>
                        <Input
                          type="number"
                          value={selectedElement.fontSize || 16}
                          onChange={(e) => updateSelectedElementProperty('fontSize', parseInt(e.target.value))}
                          className="mt-1"
                          min="8"
                          max="72"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm">Font Weight</Label>
                        <select
                          value={selectedElement.fontWeight || 'normal'}
                          onChange={(e) => updateSelectedElementProperty('fontWeight', e.target.value)}
                          className="w-full h-10 px-3 border rounded mt-1"
                        >
                          <option value="normal">Normal</option>
                          <option value="bold">Bold</option>
                          <option value="lighter">Light</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p className="text-sm">Select an element on the canvas to edit its properties</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-6">
            <div className="h-full flex items-center justify-center">
              <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-xl border border-purple-200/30 backdrop-blur-sm overflow-hidden group hover:shadow-2xl transition-all duration-500">
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-purple-400/15 to-transparent rounded-full blur-lg"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-tr from-indigo-400/10 to-transparent rounded-full blur-md"></div>
                <div className="relative z-10 p-8">
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
