import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, IText, FabricImage, Rect, Circle, Line } from 'fabric';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Type, Image as ImageIcon, Palette, Move, RotateCcw, Trash2, Square, Circle as CircleIcon, Minus, RectangleHorizontal } from 'lucide-react';

interface CanvasElement {
  id: string;
  type: 'placeholder' | 'text' | 'rectangle' | 'rounded-rectangle' | 'circle' | 'line';
  placeholder?: string;
  text?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  fontSize?: number;
  fontFamily?: string;
  color: string;
  strokeColor?: string;
  strokeWidth?: number;
  opacity?: number;
  cornerRadius?: number;
  bold?: boolean;
  italic?: boolean;
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
  selectedElementIndex?: number | null;
  onElementSelect?: (index: number | null) => void;
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
  backgroundImage,
  selectedElementIndex,
  onElementSelect
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedStrokeColor, setSelectedStrokeColor] = useState('#000000');
  const [selectedSize, setSelectedSize] = useState([24]);
  const [selectedStrokeWidth, setSelectedStrokeWidth] = useState([2]);
  const [selectedOpacity, setSelectedOpacity] = useState([100]);

  // Sync selection from parent component
  useEffect(() => {
    if (!fabricCanvas) return;

    if (selectedElementIndex !== null && selectedElementIndex !== undefined) {
      const objects = fabricCanvas.getObjects();
      const targetObject = objects[selectedElementIndex];
      if (targetObject) {
        fabricCanvas.setActiveObject(targetObject);
        setSelectedObject(targetObject);
        fabricCanvas.renderAll();
      }
    } else {
      fabricCanvas.discardActiveObject();
      setSelectedObject(null);
      fabricCanvas.renderAll();
    }
  }, [selectedElementIndex, fabricCanvas]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 1050,
      height: 600,
      backgroundColor: '#ffffff',
    });

    // Load background image if provided
    if (backgroundImage) {
      FabricImage.fromURL(backgroundImage, {
        crossOrigin: 'anonymous'
      }).then((img) => {
        const canvasAspect = canvas.width! / canvas.height!;
        const imageAspect = img.width! / img.height!;
        
        let scaleX, scaleY;
        
        if (imageAspect > canvasAspect) {
          scaleX = canvas.width! / img.width!;
          scaleY = scaleX;
        } else {
          scaleY = canvas.height! / img.height!;
          scaleX = scaleY;
        }
        
        img.set({
          scaleX: scaleX,
          scaleY: scaleY,
          left: (canvas.width! - img.width! * scaleX) / 2,
          top: (canvas.height! - img.height! * scaleY) / 2,
          selectable: false,
          evented: false
        });
        
        canvas.backgroundImage = img;
        canvas.renderAll();
      });
    }

    // Load existing elements
    value.elements.forEach((element, index) => {
      if (element.type === 'text' || element.type === 'placeholder') {
        const text = new IText(element.text || '', {
          left: element.x,
          top: element.y,
          fontSize: element.fontSize,
          fontFamily: element.fontFamily,
          fill: element.color,
          fontWeight: element.bold ? 'bold' : 'normal',
          fontStyle: element.italic ? 'italic' : 'normal'
        });
        text.set('elementId', element.id);
        text.set('elementType', element.type);
        text.set('placeholderType', element.placeholder);
        text.set('elementIndex', index);
        canvas.add(text);
      } else if (element.type === 'rectangle' || element.type === 'rounded-rectangle') {
        const rect = new Rect({
          left: element.x,
          top: element.y,
          width: element.width || 100,
          height: element.height || 60,
          fill: element.color,
          stroke: element.strokeColor,
          strokeWidth: element.strokeWidth || 0,
          opacity: (element.opacity || 100) / 100,
          rx: element.type === 'rounded-rectangle' ? (element.cornerRadius || 10) : 0,
          ry: element.type === 'rounded-rectangle' ? (element.cornerRadius || 10) : 0
        });
        rect.set('elementId', element.id);
        rect.set('elementType', element.type);
        rect.set('elementIndex', index);
        canvas.add(rect);
      } else if (element.type === 'circle') {
        const circle = new Circle({
          left: element.x,
          top: element.y,
          radius: element.radius || 50,
          fill: element.color,
          stroke: element.strokeColor,
          strokeWidth: element.strokeWidth || 0,
          opacity: (element.opacity || 100) / 100
        });
        circle.set('elementId', element.id);
        circle.set('elementType', element.type);
        circle.set('elementIndex', index);
        canvas.add(circle);
      } else if (element.type === 'line') {
        const line = new Line([element.x, element.y, element.x + (element.width || 100), element.y], {
          stroke: element.color,
          strokeWidth: element.strokeWidth || 2,
          opacity: (element.opacity || 100) / 100
        });
        line.set('elementId', element.id);
        line.set('elementType', element.type);
        line.set('elementIndex', index);
        canvas.add(line);
      }
    });

    // Handle object selection
    canvas.on('selection:created', (e) => {
      const selectedObj = e.selected?.[0];
      setSelectedObject(selectedObj);
      if (selectedObj && onElementSelect) {
        const elementIndex = selectedObj.get('elementIndex');
        if (elementIndex !== undefined) {
          onElementSelect(elementIndex);
        }
      }
    });

    canvas.on('selection:updated', (e) => {
      const selectedObj = e.selected?.[0];
      setSelectedObject(selectedObj);
      if (selectedObj && onElementSelect) {
        const elementIndex = selectedObj.get('elementIndex');
        if (elementIndex !== undefined) {
          onElementSelect(elementIndex);
        }
      }
    });

    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
      if (onElementSelect) {
        onElementSelect(null);
      }
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
      const elementId = obj.get('elementId') || `element-${index}`;
      const elementType = obj.get('elementType') || 'text';

      if (obj.type === 'i-text') {
        const textObj = obj as IText;
        elements.push({
          id: elementId,
          type: elementType,
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
      } else if (obj.type === 'rect') {
        const rectObj = obj as Rect;
        elements.push({
          id: elementId,
          type: elementType,
          x: rectObj.left || 0,
          y: rectObj.top || 0,
          width: rectObj.width || 100,
          height: rectObj.height || 60,
          color: rectObj.fill as string || '#000000',
          strokeColor: rectObj.stroke as string,
          strokeWidth: rectObj.strokeWidth || 0,
          opacity: Math.round((rectObj.opacity || 1) * 100),
          cornerRadius: elementType === 'rounded-rectangle' ? (rectObj.rx || 0) : undefined
        });
      } else if (obj.type === 'circle') {
        const circleObj = obj as Circle;
        elements.push({
          id: elementId,
          type: elementType,
          x: circleObj.left || 0,
          y: circleObj.top || 0,
          radius: circleObj.radius || 50,
          color: circleObj.fill as string || '#000000',
          strokeColor: circleObj.stroke as string,
          strokeWidth: circleObj.strokeWidth || 0,
          opacity: Math.round((circleObj.opacity || 1) * 100)
        });
      } else if (obj.type === 'line') {
        const lineObj = obj as Line;
        const coords = lineObj.calcLinePoints();
        elements.push({
          id: elementId,
          type: elementType,
          x: lineObj.left || 0,
          y: lineObj.top || 0,
          width: Math.abs(coords.x2 - coords.x1),
          color: lineObj.stroke as string || '#000000',
          strokeWidth: lineObj.strokeWidth || 2,
          opacity: Math.round((lineObj.opacity || 1) * 100)
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
      fontSize: selectedSize[0],
      fontFamily: selectedFont,
      fill: selectedColor
    });
    
    const elementIndex = value.elements.length;
    text.set('elementId', `element-${Date.now()}`);
    text.set('elementType', 'placeholder');
    text.set('placeholderType', placeholder.id);
    text.set('elementIndex', elementIndex);
    
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
    
    const elementIndex = value.elements.length;
    text.set('elementId', `element-${Date.now()}`);
    text.set('elementType', 'text');
    text.set('elementIndex', elementIndex);
    
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    updateCanvasData(fabricCanvas);
  };

  const addRectangle = () => {
    if (!fabricCanvas) return;

    const rect = new Rect({
      left: 50,
      top: 50,
      width: 150,
      height: 80,
      fill: selectedColor,
      stroke: selectedStrokeColor,
      strokeWidth: selectedStrokeWidth[0],
      opacity: selectedOpacity[0] / 100
    });
    
    const elementIndex = value.elements.length;
    rect.set('elementId', `element-${Date.now()}`);
    rect.set('elementType', 'rectangle');
    rect.set('elementIndex', elementIndex);
    
    fabricCanvas.add(rect);
    fabricCanvas.setActiveObject(rect);
    updateCanvasData(fabricCanvas);
  };

  const addRoundedRectangle = () => {
    if (!fabricCanvas) return;

    const rect = new Rect({
      left: 50,
      top: 50,
      width: 150,
      height: 80,
      fill: selectedColor,
      stroke: selectedStrokeColor,
      strokeWidth: selectedStrokeWidth[0],
      opacity: selectedOpacity[0] / 100,
      rx: 10,
      ry: 10
    });
    
    const elementIndex = value.elements.length;
    rect.set('elementId', `element-${Date.now()}`);
    rect.set('elementType', 'rounded-rectangle');
    rect.set('elementIndex', elementIndex);
    
    fabricCanvas.add(rect);
    fabricCanvas.setActiveObject(rect);
    updateCanvasData(fabricCanvas);
  };

  const addCircle = () => {
    if (!fabricCanvas) return;

    const circle = new Circle({
      left: 50,
      top: 50,
      radius: 50,
      fill: selectedColor,
      stroke: selectedStrokeColor,
      strokeWidth: selectedStrokeWidth[0],
      opacity: selectedOpacity[0] / 100
    });
    
    const elementIndex = value.elements.length;
    circle.set('elementId', `element-${Date.now()}`);
    circle.set('elementType', 'circle');
    circle.set('elementIndex', elementIndex);
    
    fabricCanvas.add(circle);
    fabricCanvas.setActiveObject(circle);
    updateCanvasData(fabricCanvas);
  };

  const addLine = () => {
    if (!fabricCanvas) return;

    const line = new Line([50, 50, 200, 50], {
      stroke: selectedColor,
      strokeWidth: selectedStrokeWidth[0],
      opacity: selectedOpacity[0] / 100
    });
    
    const elementIndex = value.elements.length;
    line.set('elementId', `element-${Date.now()}`);
    line.set('elementType', 'line');
    line.set('elementIndex', elementIndex);
    
    fabricCanvas.add(line);
    fabricCanvas.setActiveObject(line);
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
        const canvasAspect = fabricCanvas.width! / fabricCanvas.height!;
        const imageAspect = img.width! / img.height!;
        
        let scaleX, scaleY;
        
        if (imageAspect > canvasAspect) {
          scaleX = fabricCanvas.width! / img.width!;
          scaleY = scaleX;
        } else {
          scaleY = fabricCanvas.height! / img.height!;
          scaleX = scaleY;
        }
        
        img.set({
          scaleX: scaleX,
          scaleY: scaleY,
          left: (fabricCanvas.width! - img.width! * scaleX) / 2,
          top: (fabricCanvas.height! - img.height! * scaleY) / 2,
          selectable: false,
          evented: false
        });
        
        fabricCanvas.backgroundImage = img;
        fabricCanvas.renderAll();
      });
    }
    updateCanvasData(fabricCanvas);
  };

  const isTextElement = selectedObject?.type === 'i-text';
  const isShapeElement = selectedObject && ['rect', 'circle', 'line'].includes(selectedObject.type);

  return (
    <div className="space-y-6">
      {/* Top Toolbar - Element Library and Default Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Add Elements</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Text Elements */}
            <div className="mb-4">
              <Label className="text-xs font-semibold text-gray-600 mb-2 block">Text Elements</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                <Button
                  onClick={addText}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Type className="w-4 h-4 mr-2" />
                  Add Text
                </Button>
                
                {PLACEHOLDERS.map(placeholder => (
                  <Button
                    key={placeholder.id}
                    onClick={() => addPlaceholder(placeholder)}
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                  >
                    {placeholder.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Shape Elements */}
            <div>
              <Label className="text-xs font-semibold text-gray-600 mb-2 block">Shape Elements</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={addRoundedRectangle}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <RectangleHorizontal className="w-4 h-4 mr-2" />
                  Label
                </Button>
                <Button
                  onClick={addRectangle}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Rectangle
                </Button>
                <Button
                  onClick={addCircle}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <CircleIcon className="w-4 h-4 mr-2" />
                  Circle
                </Button>
                <Button
                  onClick={addLine}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Minus className="w-4 h-4 mr-2" />
                  Line
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Default Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
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
                <Label className="text-xs">Fill Color</Label>
                <Input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="h-8"
                />
              </div>
              
              <div>
                <Label className="text-xs">Stroke Color</Label>
                <Input
                  type="color"
                  value={selectedStrokeColor}
                  onChange={(e) => setSelectedStrokeColor(e.target.value)}
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
              
              <div>
                <Label className="text-xs">Stroke: {selectedStrokeWidth[0]}px</Label>
                <Slider
                  value={selectedStrokeWidth}
                  onValueChange={setSelectedStrokeWidth}
                  min={0}
                  max={10}
                  step={1}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label className="text-xs">Opacity: {selectedOpacity[0]}%</Label>
                <Slider
                  value={selectedOpacity}
                  onValueChange={setSelectedOpacity}
                  min={0}
                  max={100}
                  step={5}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Canvas and Properties Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Canvas Area - Takes 4/5 of the width */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center justify-between">
                Design Canvas (1050 × 600px - Web/Digital 7:4)
                <Button onClick={clearCanvas} variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-200 rounded-lg bg-white p-4 flex justify-center items-center">
                <canvas 
                  ref={canvasRef} 
                  className="border border-gray-300 rounded shadow-sm" 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties Panel - Takes 1/5 of the width */}
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
                  {/* Text-specific properties */}
                  {isTextElement && (
                    <>
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
                    </>
                  )}

                  {/* Shape-specific properties */}
                  {isShapeElement && (
                    <>
                      {selectedObject.type === 'rect' && selectedObject.get('elementType') === 'rounded-rectangle' && (
                        <div>
                          <Label className="text-xs">Corner Radius</Label>
                          <Input
                            type="number"
                            value={selectedObject.rx || 0}
                            onChange={(e) => {
                              const radius = parseInt(e.target.value);
                              updateSelectedObject('rx', radius);
                              updateSelectedObject('ry', radius);
                            }}
                            className="h-8"
                            min="0"
                            max="50"
                          />
                        </div>
                      )}
                      
                      <div>
                        <Label className="text-xs">Stroke Width</Label>
                        <Input
                          type="number"
                          value={selectedObject.strokeWidth || 0}
                          onChange={(e) => updateSelectedObject('strokeWidth', parseInt(e.target.value))}
                          className="h-8"
                          min="0"
                          max="20"
                        />
                      </div>

                      {selectedObject.stroke && (
                        <div>
                          <Label className="text-xs">Stroke Color</Label>
                          <Input
                            type="color"
                            value={selectedObject.stroke}
                            onChange={(e) => updateSelectedObject('stroke', e.target.value)}
                            className="h-8"
                          />
                        </div>
                      )}

                      <div>
                        <Label className="text-xs">Opacity</Label>
                        <Input
                          type="number"
                          value={Math.round((selectedObject.opacity || 1) * 100)}
                          onChange={(e) => updateSelectedObject('opacity', parseInt(e.target.value) / 100)}
                          className="h-8"
                          min="0"
                          max="100"
                        />
                      </div>
                    </>
                  )}

                  {/* Common properties for all elements */}
                  <div>
                    <Label className="text-xs">Fill Color</Label>
                    <Input
                      type="color"
                      value={isTextElement ? selectedObject.fill : selectedObject.fill}
                      onChange={(e) => updateSelectedObject('fill', e.target.value)}
                      className="h-8"
                    />
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
    </div>
  );
};

export default GiftCardCanvasEditor;
