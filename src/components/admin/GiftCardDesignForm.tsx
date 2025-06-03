
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ui/image-upload";
import { useToast } from "@/hooks/use-toast";
import TemplateDataHelper from "./TemplateDataHelper";

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
    template_data: design?.template_data ? JSON.stringify(design.template_data, null, 2) : JSON.stringify({
      recipientName: "{{recipient_name}}",
      cardValue: "{{card_value}}",
      currency: "{{currency}}",
      design: {
        backgroundColor: "#4f46e5",
        textColor: "#ffffff",
        font: "Arial"
      }
    }, null, 2)
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Parse template_data JSON
      let templateData = {};
      try {
        templateData = JSON.parse(formData.template_data);
      } catch (error) {
        throw new Error('Invalid JSON in template data');
      }

      // TODO: Implement save functionality
      console.log('Saving design:', { ...formData, template_data: templateData });
      
      toast({
        title: "Success",
        description: `Design ${design ? 'updated' : 'created'} successfully!`,
      });
      
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save design",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const insertPlaceholder = (placeholder: string) => {
    const textarea = document.getElementById('template_data') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentValue = formData.template_data;
      const newValue = currentValue.substring(0, start) + placeholder + currentValue.substring(end);
      handleInputChange('template_data', newValue);
      
      // Focus back to textarea and set cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + placeholder.length, start + placeholder.length);
      }, 0);
    }
  };

  const insertExample = (example: string) => {
    handleInputChange('template_data', example);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
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
      </div>

      <ImageUpload
        label="Design Preview Image"
        value={formData.preview_image_url}
        onChange={(url) => handleInputChange('preview_image_url', url)}
        bucketName="gift-card-designs"
        maxSizeBytes={5 * 1024 * 1024} // 5MB
        acceptedTypes={['image/jpeg', 'image/png', 'image/webp', 'image/gif']}
      />

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => handleInputChange('is_active', checked)}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <div>
        <Label htmlFor="template_data">Template Data (JSON)</Label>
        <Textarea
          id="template_data"
          value={formData.template_data}
          onChange={(e) => handleInputChange('template_data', e.target.value)}
          placeholder='{"recipientName": "{{recipient_name}}", "cardValue": "{{card_value}}"}'
          rows={8}
          className="font-mono text-sm"
        />
        
        <TemplateDataHelper
          onInsertPlaceholder={insertPlaceholder}
          onInsertExample={insertExample}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : design ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default GiftCardDesignForm;
