
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Gift } from 'lucide-react';
import GiftCardImageModal from './GiftCardImageModal';

interface GiftCardPreviewProps {
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

const GiftCardPreview: React.FC<GiftCardPreviewProps> = ({ 
  design, 
  formData, 
  amount, 
  currency,
  deliveryDate 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePreviewClick = () => {
    setIsModalOpen(true);
  };

  if (!design) {
    return (
      <>
        <Card 
          className="w-full max-w-md mx-auto h-64 bg-gradient-to-br from-purple-500 to-pink-500 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
          onClick={handlePreviewClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handlePreviewClick();
            }
          }}
          aria-label="Click to view gift card in full size"
        >
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
        
        <GiftCardImageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          design={design}
          formData={formData}
          amount={amount}
          currency={currency}
          deliveryDate={deliveryDate}
        />
      </>
    );
  }

  const templateData = design.template_data || {};
  const previewCode = "GIFT-XXXX-XXXX";

  // Function to replace standardized placeholders
  const replacePlaceholders = (text: string) => {
    if (!text) return '';
    
    // Format delivery date - show actual date instead of "Today"
    const formattedDeliveryDate = deliveryDate ? 
      new Date(deliveryDate).toLocaleDateString() : 
      new Date().toLocaleDateString();

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
    console.log('Preview: Template data:', templateData);
    console.log('Preview: Elements:', templateData.elements);
    
    // Use standardized template dimensions
    const templateWidth = 400;
    const templateHeight = 250;
    
    // Scale the preview to fit nicely (max width 320px)
    const maxPreviewWidth = 320;
    const previewScale = Math.min(maxPreviewWidth / templateWidth, 1);
    const previewWidth = templateWidth * previewScale;
    const previewHeight = templateHeight * previewScale;

    console.log('Preview: Using template dimensions:', { templateWidth, templateHeight });
    console.log('Preview: Preview scale and dimensions:', { previewScale, previewWidth, previewHeight });

    return (
      <>
        <Card 
          className="mx-auto relative overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{ 
            width: previewWidth,
            height: previewHeight,
            backgroundImage: design.preview_image_url ? `url(${design.preview_image_url})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          onClick={handlePreviewClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handlePreviewClick();
            }
          }}
          aria-label="Click to view gift card in full size"
        >
          <CardContent className="p-0 h-full relative">
            {design.preview_image_url && (
              <div className="absolute inset-0 bg-black/10"></div>
            )}
            
            {/* Render canvas elements with proper scaling from template coordinates */}
            {templateData.elements.map((element: any, index: number) => {
              console.log('Preview: Rendering element:', element, 'at index:', index);
              
              // Only render text elements and placeholders in preview
              if (element.type !== 'text' && element.type !== 'placeholder') {
                return null;
              }

              const elementText = replacePlaceholders(element.text || '');
              
              // Skip empty elements
              if (!elementText.trim()) {
                return null;
              }

              // Convert from template coordinates to preview coordinates
              const displayX = element.x * previewScale;
              const displayY = element.y * previewScale;
              const displayFontSize = (element.fontSize || 16) * previewScale;

              console.log('Preview: Element positioning:', {
                templateX: element.x,
                templateY: element.y,
                displayX,
                displayY,
                previewScale,
                fontSize: element.fontSize,
                displayFontSize
              });

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
                    maxWidth: previewWidth - displayX,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {elementText}
                </div>
              );
            })}

            {/* Debug overlay - shows template and preview info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="absolute top-2 left-2 bg-black/50 text-white text-xs p-1 rounded">
                Template: {templateWidth}×{templateHeight} | Preview: {Math.round(previewWidth)}×{Math.round(previewHeight)} | Scale: {previewScale.toFixed(2)}
              </div>
            )}
          </CardContent>
        </Card>

        <GiftCardImageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          design={design}
          formData={formData}
          amount={amount}
          currency={currency}
          deliveryDate={deliveryDate}
        />
      </>
    );
  }

  // Fallback to old template format for backward compatibility
  const designStyle = templateData.design || {};
  const backgroundColor = designStyle.backgroundColor || '#4f46e5';
  const textColor = designStyle.textColor || '#ffffff';
  const font = designStyle.font || 'Arial';

  return (
    <>
      <Card 
        className="w-full max-w-md mx-auto h-64 relative overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        style={{ 
          backgroundColor,
          color: textColor,
          fontFamily: font,
          backgroundImage: design.preview_image_url ? `url(${design.preview_image_url})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        onClick={handlePreviewClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handlePreviewClick();
          }
        }}
        aria-label="Click to view gift card in full size"
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
              {amount} {currency}
            </div>
            
            {formData.recipient_name && (
              <div className="text-lg mb-1">
                For: {formData.recipient_name}
              </div>
            )}
            
            {formData.sender_name && (
              <div className="text-sm opacity-90 mb-2">
                From: {formData.sender_name}
              </div>
            )}
            
            {formData.message_text && (
              <div className="text-sm opacity-90 italic">
                "{formData.message_text}"
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

      <GiftCardImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        design={design}
        formData={formData}
        amount={amount}
        currency={currency}
        deliveryDate={deliveryDate}
      />
    </>
  );
};

export default GiftCardPreview;
