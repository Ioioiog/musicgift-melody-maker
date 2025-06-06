
import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, IText, FabricImage } from 'fabric';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Type, Image as ImageIcon, Palette, Move, RotateCcw, Trash2 } from 'lucide-react';

interface CanvasElement {
  id: string;
  type: 'placeholder' | 'text';
  placeholder?: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  bold: boolean;
  italic: boolean;
}

interface CanvasData {
  backgroundImage?: string;
  canvasWidth: number;
  canvasHeight: number;
  elements: CanvasElement[];
}

interface GiftCardCanvasEditorProps {
  value: CanvasData;
  onChange: (data: CanvasData) => void;
  backgroundImage?: string;
}

const PLACEHOLDERS = [
  { id: 'recipient_name', label: 'Recipient Name', text: '{{recipient_name}}' },
  { id: 'sender_name', label: 'Sender Name', text: '{{sender_name}}' },
  { id: 'card_value', label: 'Card Value', text: '{{card_value}}' },
  { id: 'currency', label: 'Currency', text: '{{currency}}' },
  { id: 'message', label: 'Message', text: '{{message}}' },
  { id: 'code', label: 'Code', text: '{{code}}' }
];

const FONTS = ['Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana', 'Impact'];

const GiftCardCanvasEditor: React.FC<GiftCardCanvasEditorProps> = ({
  value,
  onChange,
  backgroundImage
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedSize, setSelectedSize] = useState([24]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 400,
      height: 250,
      backgroundColor: '#ffffff',
    });

    // Load background image if provided
    if (backgroundImage) {
      FabricImage.fromURL(backgroundImage, {
        crossOrigin: 'anonymous'
      }).then((img) => {
        img.set({
          scaleX: canvas.width! / img.width!,
          scaleY: canvas.height! / img.height!,
          selectable: false,
          evented: false
        });
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      });
    }

    // Load existing elements
    value.elements.forEach(element => {
      const text = new IText(element.text, {
        left: element.x,
        top: element.y,
        fontSize: element.fontSize,
        fontFamily: element.fontFamily,
        fill: element.color,
        fontWeight: element.bold ? 'bold' : 'normal',
        fontStyle: element.italic ? 'italic' : 'normal'
      });
      text.set('elementId', element.id);
      text.set('placeholderType', element.placeholder);
      canvas.add(text);
    });

    // Handle object selection
    canvas.on('selection:created', (e) => {
      setSelectedObject(e.selected?.[0]);
    });

    canvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected?.[0]);
    });

    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    // Handle object modifications
    canvas.on('object:modified', () => {
      updateCanvasData(canvas);
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [backgroundImage]);

  const updateCanvasData = (canvas: FabricCanvas) => {
    const elements: CanvasElement[] = [];
    
    canvas.getObjects().forEach((obj, index) => {
      if (obj.type === 'i-text') {
        const textObj = obj as IText;
        elements.push({
          id: textObj.get('elementId') || `element-${index}`,
          type: textObj.get('placeholderType') ? 'placeholder' : 'text',
          placeholder: textObj.get('placeholderType'),
          text: textObj.text || '',
          x: textObj.left || 0,
          y: textObj.top || 0,
          fontSize: textObj.fontSize || 24,
          fontFamily: textObj.fontFamily || 'Arial',
          color: textObj.fill as string || '#000000',
          bold: textObj.fontWeight === 'bold',
          italic: textObj.fontStyle === 'italic'
        });
      }
    });

    onChange({
      ...value,
      elements
    });
  };

  const addPlaceholder = (placeholder: typeof PLACEHOLDERS[0]) => {
    if (!fabricCanvas) return;

    const text = new IText(placeholder.text, {
      left: 50,
      top: 50,
      fontSize: 24,
      fontFamily: selectedFont,
      fill: selectedColor
    });
    
    text.set('elementId', `element-${Date.now()}`);
    text.set('placeholderType', placeholder.id);
    
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    updateCanvasData(fabricCanvas);
  };

  const addText = () => {
    if (!fabricCanvas) return;

    const text = new IText('Your text here', {
      left: 50,
      top: 50,
      fontSize: selectedSize[0],
      fontFamily: selectedFont,
      fill: selectedColor
    });
    
    text.set('elementId', `element-${Date.now()}`);
    
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    updateCanvasData(fabricCanvas);
  };

  const updateSelectedObject = (property: string, value: any) => {
    if (!selectedObject || !fabricCanvas) return;

    selectedObject.set(property, value);
    fabricCanvas.renderAll();
    updateCanvasData(fabricCanvas);
  };

  const deleteSelectedObject = () => {
    if (!selectedObject || !fabricCanvas) return;

    fabricCanvas.remove(selectedObject);
    setSelectedObject(null);
    updateCanvasData(fabricCanvas);
  };

  const clearCanvas = () => {
    if (!fabricCanvas) return;
    
    fabricCanvas.clear();
    if (backgroundImage) {
      FabricImage.fromURL(backgroundImage, {
        crossOrigin: 'anonymous'
      }).then((img) => {
        img.set({
          scaleX: fabricCanvas.width! / img.width!,
          scaleY: fabricCanvas.height! / img.height!,
          selectable: false,
          evented: false
        });
        fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(canvas));
      });
    }
    updateCanvasData(fabricCanvas);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Element Library */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Add Elements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={addText}
              variant="outline"
              className="w-full justify-start"
              size="sm"
            >
              <Type className="w-4 h-4 mr-2" />
              Add Text
            </Button>
            
            <div className="space-y-2">
              <Label className="text-xs font-medium">Placeholders</Label>
              {PLACEHOLDERS.map(placeholder => (
                <Button
                  key={placeholder.id}
                  onClick={() => addPlaceholder(placeholder)}
                  variant="ghost"
                  className="w-full justify-start text-xs"
                  size="sm"
                >
                  {placeholder.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Global Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Default Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs">Font</Label>
              <Select value={selectedFont} onValueChange={setSelectedFont}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONTS.map(font => (
                    <SelectItem key={font} value={font}>{font}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-xs">Color</Label>
              <Input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="h-8"
              />
            </div>
            
            <div>
              <Label className="text-xs">Size: {selectedSize[0]}px</Label>
              <Slider
                value={selectedSize}
                onValueChange={setSelectedSize}
                min={12}
                max={72}
                step={1}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Canvas Area */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center justify-between">
              Design Canvas
              <div className="flex gap-2">
                <Button onClick={clearCanvas} variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <canvas ref={canvasRef} className="max-w-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Properties Panel */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {selectedObject ? 'Element Properties' : 'Select an element'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedObject ? (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Font Family</Label>
                  <Select
                    value={selectedObject.fontFamily}
                    onValueChange={(value) => updateSelectedObject('fontFamily', value)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONTS.map(font => (
                        <SelectItem key={font} value={font}>{font}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-xs">Font Size</Label>
                  <Input
                    type="number"
                    value={selectedObject.fontSize}
                    onChange={(e) => updateSelectedObject('fontSize', parseInt(e.target.value))}
                    className="h-8"
                    min="8"
                    max="100"
                  />
                </div>
                
                <div>
                  <Label className="text-xs">Color</Label>
                  <Input
                    type="color"
                    value={selectedObject.fill}
                    onChange={(e) => updateSelectedObject('fill', e.target.value)}
                    className="h-8"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => updateSelectedObject('fontWeight', 
                      selectedObject.fontWeight === 'bold' ? 'normal' : 'bold'
                    )}
                    variant={selectedObject.fontWeight === 'bold' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                  >
                    B
                  </Button>
                  <Button
                    onClick={() => updateSelectedObject('fontStyle', 
                      selectedObject.fontStyle === 'italic' ? 'normal' : 'italic'
                    )}
                    variant={selectedObject.fontStyle === 'italic' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                  >
                    I
                  </Button>
                </div>
                
                <Button
                  onClick={deleteSelectedObject}
                  variant="destructive"
                  size="sm"
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Click on an element to edit its properties</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GiftCardCanvasEditor;
