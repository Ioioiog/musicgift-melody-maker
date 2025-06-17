
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Gift } from 'lucide-react';

interface GiftCardImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  design: any;
  formData: {
    sender_name: string;
    recipient_name: string;
    message_text: string;
  };
  amount: number;
  currency: string;
  deliveryDate?: string;
}

const GiftCardImageModal: React.FC<GiftCardImageModalProps> = ({
  isOpen,
  onClose,
  design,
  formData,
  amount,
  currency,
  deliveryDate
}) => {
  // Handle keyboard events for accessibility
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!design) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Gift Card Preview</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-4">
            <Card className="w-full max-w-lg h-80 bg-gradient-to-br from-purple-500 to-pink-500">
              <CardContent className="p-8 h-full flex flex-col justify-between text-white">
                <div className="flex items-center gap-2">
                  <Gift className="w-8 h-8" />
                  <span className="font-bold text-lg">Gift Card</span>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold">{amount} {currency}</div>
                  <div className="text-lg opacity-90">Default Design</div>
                </div>
                <div className="text-sm opacity-75">GIFT-XXXX-XXXX</div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const templateData = design.template_data || {};
  const previewCode = "GIFT-XXXX-XXXX";

  // Function to replace standardized placeholders
  const replacePlaceholders = (text: string) => {
    if (!text) return '';
    
    const formattedDeliveryDate = deliveryDate ? 
      new Date(deliveryDate).toLocaleDateString() : 
      'Today';

    return text
      .replace(/Recipient Name/g, formData.recipient_name || 'Recipient Name')
      .replace(/Sender Name/g, formData.sender_name || 'Your Name')
      .replace(/Personal Message/g, formData.message_text || 'Happy gifting!')
      .replace(/Gift Amount/g, amount.toString())
      .replace(/Currency/g, currency)
      .replace(/Gift Code/g, previewCode)
      .replace(/Delivery Date/g, formattedDeliveryDate);
  };

  // Handle new canvas-based design structure
  if (templateData.elements && Array.isArray(templateData.elements)) {
    // Use larger dimensions for modal view
    const templateWidth = 600;
    const templateHeight = 375;

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Gift Card Preview - {design.name}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-4">
            <Card 
              className="relative overflow-hidden"
              style={{ 
                width: templateWidth,
                height: templateHeight,
                backgroundImage: design.preview_image_url ? `url(${design.preview_image_url})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <CardContent className="p-0 h-full relative">
                {design.preview_image_url && (
                  <div className="absolute inset-0 bg-black/10"></div>
                )}
                
                {/* Render canvas elements with larger scale for modal */}
                {templateData.elements.map((element: any, index: number) => {
                  if (element.type !== 'text' && element.type !== 'placeholder') {
                    return null;
                  }

                  const elementText = replacePlaceholders(element.text || '');
                  
                  if (!elementText.trim()) {
                    return null;
                  }

                  // Scale up for modal view (1.5x larger than template)
                  const modalScale = 1.5;
                  const displayX = element.x * modalScale;
                  const displayY = element.y * modalScale;
                  const displayFontSize = (element.fontSize || 16) * modalScale;

                  return (
                    <div
                      key={element.id || index}
                      className="absolute whitespace-nowrap pointer-events-none select-none"
                      style={{
                        left: displayX,
                        top: displayY,
                        fontSize: displayFontSize,
                        fontFamily: element.fontFamily || 'Arial',
                        color: element.color || '#000000',
                        fontWeight: element.bold ? 'bold' : 'normal',
                        fontStyle: element.italic ? 'italic' : 'normal',
                        zIndex: 10,
                        maxWidth: templateWidth - displayX,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {elementText}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Fallback to old template format for backward compatibility
  const designStyle = templateData.design || {};
  const backgroundColor = designStyle.backgroundColor || '#4f46e5';
  const textColor = designStyle.textColor || '#ffffff';
  const font = designStyle.font || 'Arial';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gift Card Preview - {design.name}</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center p-4">
          <Card 
            className="w-full max-w-lg h-80 relative overflow-hidden"
            style={{ 
              backgroundColor,
              color: textColor,
              fontFamily: font,
              backgroundImage: design.preview_image_url ? `url(${design.preview_image_url})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <CardContent className="p-8 h-full flex flex-col justify-between relative">
              {design.preview_image_url && (
                <div className="absolute inset-0 bg-black/30"></div>
              )}
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-8 h-8" />
                  <span className="font-bold text-lg">{design.name}</span>
                </div>
              </div>

              <div className="relative z-10 text-center">
                <div className="text-4xl font-bold mb-2">
                  {amount} {currency}
                </div>
                
                {formData.recipient_name && (
                  <div className="text-xl mb-1">
                    For: {formData.recipient_name}
                  </div>
                )}
                
                {formData.sender_name && (
                  <div className="text-lg opacity-90 mb-2">
                    From: {formData.sender_name}
                  </div>
                )}
                
                {formData.message_text && (
                  <div className="text-lg opacity-90 italic">
                    "{formData.message_text}"
                  </div>
                )}
              </div>

              <div className="relative z-10">
                <div className="text-sm opacity-75 font-mono">
                  {previewCode}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GiftCardImageModal;
