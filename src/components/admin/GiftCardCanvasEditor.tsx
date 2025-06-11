import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, IText, FabricImage, Rect, Circle, Line } from 'fabric';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Type, Image as ImageIcon, Palette, Move, RotateCcw, Trash2, Square, Circle as CircleIcon, Minus, RectangleHorizontal, ChevronDown, ChevronRight, Plus } from 'lucide-react';

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
  const [toolsExpanded, setToolsExpanded] = useState(true);

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
      fontSize: 24,
      fontFamily: 'Arial',
      fill: '#000000'
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
      fontSize: 24,
      fontFamily: 'Arial',
      fill: '#000000'
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
      fill: '#000000',
      stroke: '#000000',
      strokeWidth: 0,
      opacity: 1
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
      fill: '#000000',
      stroke: '#000000',
      strokeWidth: 0,
      opacity: 1,
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
      fill: '#000000',
      stroke: '#000000',
      strokeWidth: 0,
      opacity: 1
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
      stroke: '#000000',
      strokeWidth: 2,
      opacity: 1
    });
    
    const elementIndex = value.elements.length;
    line.set('elementId', `element-${Date.now()}`);
    line.set('elementType', 'line');
    line.set('elementIndex', elementIndex);
    
    fabricCanvas.add(line);
    fabricCanvas.setActiveObject(line);
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

  return (
    <div className="space-y-4">
      {/* Integrated Tools Section - Moved to Sidebar in Parent Component */}
      <Collapsible open={toolsExpanded} onOpenChange={setToolsExpanded}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Elements
            </span>
            {toolsExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          {/* Text Elements */}
          <div>
            <Label className="text-sm font-semibold text-gray-600 mb-2 block">Text Elements</Label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <Button
                onClick={addText}
                variant="outline"
                size="sm"
                className="flex items-center justify-center"
              >
                <Type className="w-4 h-4 mr-1" />
                Text
              </Button>
              
              {PLACEHOLDERS.map(placeholder => (
                <Button
                  key={placeholder.id}
                  onClick={() => addPlaceholder(placeholder)}
                  variant="ghost"
                  size="sm"
                  className="text-xs justify-start"
                >
                  {placeholder.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Shape Elements */}
          <div>
            <Label className="text-sm font-semibold text-gray-600 mb-2 block">Shape Elements</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={addRoundedRectangle}
                variant="outline"
                size="sm"
                className="flex items-center justify-center"
              >
                <RectangleHorizontal className="w-4 h-4 mr-1" />
                Label
              </Button>
              <Button
                onClick={addRectangle}
                variant="outline"
                size="sm"
                className="flex items-center justify-center"
              >
                <Square className="w-4 h-4 mr-1" />
                Rectangle
              </Button>
              <Button
                onClick={addCircle}
                variant="outline"
                size="sm"
                className="flex items-center justify-center"
              >
                <CircleIcon className="w-4 h-4 mr-1" />
                Circle
              </Button>
              <Button
                onClick={addLine}
                variant="outline"
                size="sm"
                className="flex items-center justify-center"
              >
                <Minus className="w-4 h-4 mr-1" />
                Line
              </Button>
            </div>
          </div>

          {/* Canvas Actions */}
          <div className="pt-2 border-t">
            <Button onClick={clearCanvas} variant="outline" size="sm" className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear Canvas
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Canvas Area - Clean and Spacious */}
      <div className="border border-gray-200 rounded-lg bg-white p-4 flex justify-center items-center">
        <canvas 
          ref={canvasRef} 
          className="border border-gray-300 rounded shadow-sm" 
        />
      </div>
    </div>
  );
};

export default GiftCardCanvasEditor;
