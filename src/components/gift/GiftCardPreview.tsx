
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Gift } from 'lucide-react';

interface GiftCardPreviewProps {
  design: any;
  formData: {
    sender_name: string;
    recipient_name: string;
    message_text: string;
  };
  amount: number;
  currency: string;
}

const GiftCardPreview: React.FC<GiftCardPreviewProps> = ({ 
  design, 
  formData, 
  amount, 
  currency 
}) => {
  if (!design) {
    return (
      <Card className="w-full max-w-md mx-auto h-64 bg-gradient-to-br from-purple-500 to-pink-500">
        <CardContent className="p-6 h-full flex flex-col justify-between text-white">
          <div className="flex items-center gap-2">
            <Gift className="w-6 h-6" />
            <span className="font-bold">Gift Card</span>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{amount} {currency}</div>
            <div className="text-sm opacity-90">Default Design</div>
          </div>
          <div className="text-xs opacity-75">GIFT-XXXX-XXXX</div>
        </CardContent>
      </Card>
    );
  }

  const templateData = design.template_data || {};
  const previewCode = "GIFT-XXXX-XXXX";

  // Function to replace placeholders in text
  const replacePlaceholders = (text: string) => {
    if (!text) return '';
    return text
      .replace(/\{\{recipient_name\}\}/g, formData.recipient_name || 'Recipient Name')
      .replace(/\{\{sender_name\}\}/g, formData.sender_name || 'Your Name')
      .replace(/\{\{message\}\}/g, formData.message_text || 'Happy gifting!')
      .replace(/\{\{card_value\}\}/g, amount.toString())
      .replace(/\{\{currency\}\}/g, currency)
      .replace(/\{\{code\}\}/g, previewCode);
  };

  // Handle new canvas-based design structure
  if (templateData.elements && Array.isArray(templateData.elements)) {
    const cardWidth = templateData.canvasWidth || 400;
    const cardHeight = templateData.canvasHeight || 250;
    const scale = 320 / cardWidth; // Scale to fit preview

    return (
      <Card 
        className="w-full max-w-md mx-auto relative overflow-hidden"
        style={{ 
          height: cardHeight * scale,
          backgroundImage: design.preview_image_url ? `url(${design.preview_image_url})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <CardContent className="p-0 h-full relative">
          {design.preview_image_url && (
            <div className="absolute inset-0 bg-black/10"></div>
          )}
          
          {/* Render canvas elements */}
          {templateData.elements.map((element: any, index: number) => (
            <div
              key={element.id || index}
              className="absolute whitespace-nowrap"
              style={{
                left: element.x * scale,
                top: element.y * scale,
                fontSize: element.fontSize * scale,
                fontFamily: element.fontFamily,
                color: element.color,
                fontWeight: element.bold ? 'bold' : 'normal',
                fontStyle: element.italic ? 'italic' : 'normal',
                zIndex: 10
              }}
            >
              {replacePlaceholders(element.text)}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Fallback to old template format for backward compatibility
  const designStyle = templateData.design || {};
  const backgroundColor = designStyle.backgroundColor || '#4f46e5';
  const textColor = designStyle.textColor || '#ffffff';
  const font = designStyle.font || 'Arial';

  return (
    <Card 
      className="w-full max-w-md mx-auto h-64 relative overflow-hidden"
      style={{ 
        backgroundColor,
        color: textColor,
        fontFamily: font,
        backgroundImage: design.preview_image_url ? `url(${design.preview_image_url})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <CardContent className="p-6 h-full flex flex-col justify-between relative">
        {design.preview_image_url && (
          <div className="absolute inset-0 bg-black/30"></div>
        )}
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-6 h-6" />
            <span className="font-bold">{design.name}</span>
          </div>
        </div>

        <div className="relative z-10 text-center">
          <div className="text-3xl font-bold mb-2">
            {replacePlaceholders(templateData.cardValue || '{{card_value}}')} {replacePlaceholders(templateData.currency || '{{currency}}')}
          </div>
          
          {templateData.recipientName && (
            <div className="text-lg mb-1">
              For: {replacePlaceholders(templateData.recipientName)}
            </div>
          )}
          
          {templateData.senderName && (
            <div className="text-sm opacity-90 mb-2">
              From: {replacePlaceholders(templateData.senderName)}
            </div>
          )}
          
          {templateData.personalMessage && formData.message_text && (
            <div className="text-sm opacity-90 italic">
              "{replacePlaceholders(templateData.personalMessage)}"
            </div>
          )}
        </div>

        <div className="relative z-10">
          <div className="text-xs opacity-75 font-mono">
            {previewCode}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GiftCardPreview;
