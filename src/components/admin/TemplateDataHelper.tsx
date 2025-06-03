
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TemplateDataHelperProps {
  onInsertPlaceholder: (placeholder: string) => void;
  onInsertExample: (example: string) => void;
}

const TemplateDataHelper: React.FC<TemplateDataHelperProps> = ({
  onInsertPlaceholder,
  onInsertExample
}) => {
  const { toast } = useToast();

  const placeholders = [
    { key: 'recipient_name', label: 'Recipient Name', value: '{{recipient_name}}' },
    { key: 'card_value', label: 'Card Value', value: '{{card_value}}' },
    { key: 'currency', label: 'Currency', value: '{{currency}}' },
    { key: 'sender_name', label: 'Sender Name', value: '{{sender_name}}' },
    { key: 'message', label: 'Personal Message', value: '{{message}}' }
  ];

  const exampleTemplate = JSON.stringify({
    recipientName: "{{recipient_name}}",
    cardValue: "{{card_value}}",
    currency: "{{currency}}",
    senderName: "{{sender_name}}",
    personalMessage: "{{message}}",
    design: {
      backgroundColor: "#4f46e5",
      textColor: "#ffffff",
      accentColor: "#fbbf24",
      font: "Arial",
      fontSize: "16px",
      borderRadius: "12px",
      padding: "20px"
    },
    layout: {
      logoPosition: "top-center",
      textAlignment: "center",
      showBorder: true,
      shadowEffect: true
    }
  }, null, 2);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Template data copied successfully!",
    });
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm">Template Data Helper</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Available Placeholders:</h4>
          <div className="grid grid-cols-2 gap-2">
            {placeholders.map((placeholder) => (
              <Button
                key={placeholder.key}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onInsertPlaceholder(`"${placeholder.value}"`)}
                className="justify-start text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                {placeholder.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Example Template:</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(exampleTemplate)}
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </Button>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onInsertExample(exampleTemplate)}
            className="w-full"
          >
            Use Example Template
          </Button>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Tip:</strong> Use placeholders like <code>{{"{"}recipient_name{"}"}</code> to dynamically insert gift card data.</p>
          <p><strong>Available data:</strong> recipient_name, card_value, currency, sender_name, message</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateDataHelper;
