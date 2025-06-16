import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Canvas as FabricCanvas, IText, FabricImage, Rect, Circle, Line, Object as FabricObject } from 'fabric';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Type, Image as ImageIcon, Palette, Move, RotateCcw, Trash2, Square, Circle as CircleIcon, Minus, RectangleHorizontal, ChevronDown, ChevronRight, Plus, Save, Undo, Redo, FileText } from 'lucide-react';

// Enhanced TypeScript interfaces
interface ElementBase {
  id: string;
  type: 'text' | 'placeholder' | 'rectangle' | 'rounded-rectangle' | 'circle' | 'line' | 'image';
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  opacity?: number;
}

interface TextElement extends ElementBase {
  type: 'text' | 'placeholder';
  text: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  textAlign?: 'left' | 'center' | 'right';
}

interface ShapeElement extends ElementBase {
  type: 'rectangle' | 'rounded-rectangle' | 'circle';
  color?: string;
  strokeColor?: string;
  strokeWidth?: number;
  cornerRadius?: number; // for rounded-rectangle
}

interface LineElement extends ElementBase {
  type: 'line';
  x2: number;
  y2: number;
  color?: string;
  strokeWidth?: number;
  strokeDashArray?: number[];
}

interface ImageElement extends ElementBase {
  type: 'image';
  src: string;
  scaleX?: number;
  scaleY?: number;
}

type Element = TextElement | ShapeElement | LineElement | ImageElement;

interface CanvasData {
  elements: Element[];
  width: number;
  height: number;
  backgroundColor?: string;
}

interface GiftCardCanvasEditorProps {
  value: CanvasData;
  onChange: (data: CanvasData) => void;
  backgroundImage?: string;
  selectedElementIndex?: number | null;
  onElementSelect?: (index: number | null) => void;
  readOnly?: boolean;
  maxUndoSteps?: number;
}

// Constants
const SCALE_FACTOR = 2;
const CANVAS_DISPLAY_WIDTH = 600;
const CANVAS_DISPLAY_HEIGHT = 400;
const DEFAULT_FONT_SIZE = 16;
const DEFAULT_STROKE_WIDTH = 2;
const DEFAULT_OPACITY = 100;

// Utility functions
const generateId = (): string => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const templateToCanvas = (coord: number): number => coord * SCALE_FACTOR;
const canvasToTemplate = (coord: number): number => coord / SCALE_FACTOR;

const debounce = <T extends (...args: any[]) => void>(func: T, delay: number): T => {
  let timeoutId: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
};

// Custom hook for undo/redo functionality
const useUndoRedo = (initialState: CanvasData, maxSteps: number = 50) => {
  const [history, setHistory] = useState<CanvasData[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const addToHistory = useCallback((state: CanvasData) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(state);
      return newHistory.slice(-maxSteps);
    });
    setCurrentIndex(prev => Math.min(prev + 1, maxSteps - 1));
  }, [currentIndex, maxSteps]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      return history[currentIndex - 1];
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return history[currentIndex + 1];
    }
    return null;
  }, [currentIndex, history]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return { addToHistory, undo, redo, canUndo, canRedo };
};

const GiftCardCanvasEditor: React.FC<GiftCardCanvasEditorProps> = ({
  value,
  onChange,
  backgroundImage,
  selectedElementIndex,
  onElementSelect,
  readOnly = false,
  maxUndoSteps = 50
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [toolsExpanded, setToolsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { addToHistory, undo, redo, canUndo, canRedo } = useUndoRedo(value, maxUndoSteps);

  // Memoized element lookup for performance
  const elementMap = useMemo(() => {
    const map = new Map<string, Element>();
    value.elements.forEach(element => {
      map.set(element.id, element);
    });
    return map;
  }, [value.elements]);

  // Debounced onChange to prevent excessive updates
  const debouncedOnChange = useMemo(
    () => debounce((data: CanvasData) => {
      onChange(data);
      addToHistory(data);
    }, 300),
    [onChange, addToHistory]
  );

  // Enhanced object creation functions
  const createFabricObject = useCallback((element: Element, index: number): FabricObject | null => {
    try {
      let fabricObject: FabricObject;

      switch (element.type) {
        case 'text':
        case 'placeholder':
          const textElement = element as TextElement;
          const displayText = element.type === 'placeholder' ? `[${textElement.text || 'Placeholder'}]` : textElement.text || '';
          fabricObject = new IText(displayText, {
            left: templateToCanvas(textElement.x),
            top: templateToCanvas(textElement.y),
            fontSize: templateToCanvas(textElement.fontSize || DEFAULT_FONT_SIZE),
            fontFamily: textElement.fontFamily || 'Arial',
            fill: textElement.color || '#000000',
            fontWeight: textElement.bold ? 'bold' : 'normal',
            fontStyle: textElement.italic ? 'italic' : 'normal',
            underline: textElement.underline || false,
            textAlign: textElement.textAlign || 'left',
            selectable: !readOnly,
            editable: !readOnly && element.type === 'text',
            backgroundColor: element.type === 'placeholder' ? '#e3f2fd' : undefined,
          });
          break;

        case 'rectangle':
        case 'rounded-rectangle':
          const rectElement = element as ShapeElement;
          fabricObject = new Rect({
            left: templateToCanvas(rectElement.x),
            top: templateToCanvas(rectElement.y),
            width: templateToCanvas(rectElement.width || 100),
            height: templateToCanvas(rectElement.height || 50),
            fill: rectElement.color || '#cccccc',
            stroke: rectElement.strokeColor || '',
            strokeWidth: templateToCanvas(rectElement.strokeWidth || 0),
            opacity: (rectElement.opacity || DEFAULT_OPACITY) / 100,
            rx: element.type === 'rounded-rectangle' ? templateToCanvas(rectElement.cornerRadius || 10) : 0,
            ry: element.type === 'rounded-rectangle' ? templateToCanvas(rectElement.cornerRadius || 10) : 0,
            selectable: !readOnly,
          });
          break;

        case 'circle':
          const circleElement = element as ShapeElement;
          fabricObject = new Circle({
            left: templateToCanvas(circleElement.x),
            top: templateToCanvas(circleElement.y),
            radius: templateToCanvas((circleElement.width || 50) / 2),
            fill: circleElement.color || '#cccccc',
            stroke: circleElement.strokeColor || '',
            strokeWidth: templateToCanvas(circleElement.strokeWidth || 0),
            opacity: (circleElement.opacity || DEFAULT_OPACITY) / 100,
            selectable: !readOnly,
          });
          break;

        case 'line':
          const lineElement = element as LineElement;
          fabricObject = new Line(
            [
              templateToCanvas(lineElement.x),
              templateToCanvas(lineElement.y),
              templateToCanvas(lineElement.x2),
              templateToCanvas(lineElement.y2)
            ],
            {
              stroke: lineElement.color || '#000000',
              strokeWidth: templateToCanvas(lineElement.strokeWidth || DEFAULT_STROKE_WIDTH),
              opacity: (lineElement.opacity || DEFAULT_OPACITY) / 100,
              strokeDashArray: lineElement.strokeDashArray || [],
              selectable: !readOnly,
            }
          );
          break;

        default:
          return null;
      }

      // Set common properties
      fabricObject.set({
        elementIndex: index,
        elementId: element.id,
        angle: element.rotation || 0,
      });

      return fabricObject;
    } catch (error) {
      console.error('Error creating fabric object:', error);
      setError(`Failed to create element: ${element.type}`);
      return null;
    }
  }, [readOnly]);

  // Enhanced canvas update function
  const updateCanvasData = useCallback((canvas: FabricCanvas) => {
    if (readOnly) return;

    try {
      const objects = canvas.getObjects();
      const updatedElements: Element[] = [];

      objects.forEach((obj) => {
        const elementIndex = obj.get('elementIndex') as number;
        const elementId = obj.get('elementId') as string;
        
        if (elementIndex === undefined || !elementId) return;

        const originalElement = value.elements[elementIndex];
        if (!originalElement) return;

        let updatedElement: Element;

        if (obj instanceof IText) {
          let text = obj.text || '';
          // Remove placeholder brackets if it's a placeholder
          if (originalElement.type === 'placeholder' && text.startsWith('[') && text.endsWith(']')) {
            text = text.slice(1, -1);
          }
          
          updatedElement = {
            ...originalElement,
            x: canvasToTemplate(obj.left || 0),
            y: canvasToTemplate(obj.top || 0),
            text: text,
            fontSize: canvasToTemplate(obj.fontSize || DEFAULT_FONT_SIZE),
            rotation: obj.angle || 0,
          } as TextElement;
        } else if (obj instanceof Rect) {
          updatedElement = {
            ...originalElement,
            x: canvasToTemplate(obj.left || 0),
            y: canvasToTemplate(obj.top || 0),
            width: canvasToTemplate(obj.width || 0),
            height: canvasToTemplate(obj.height || 0),
            rotation: obj.angle || 0,
            opacity: (obj.opacity || 1) * 100,
          } as ShapeElement;
        } else if (obj instanceof Circle) {
          const radius = canvasToTemplate(obj.radius || 0);
          updatedElement = {
            ...originalElement,
            x: canvasToTemplate(obj.left || 0),
            y: canvasToTemplate(obj.top || 0),
            width: radius * 2,
            height: radius * 2,
            rotation: obj.angle || 0,
            opacity: (obj.opacity || 1) * 100,
          } as ShapeElement;
        } else if (obj instanceof Line) {
          updatedElement = {
            ...originalElement,
            x: canvasToTemplate(obj.x1 || 0),
            y: canvasToTemplate(obj.y1 || 0),
            x2: canvasToTemplate(obj.x2 || 0),
            y2: canvasToTemplate(obj.y2 || 0),
            rotation: obj.angle || 0,
            opacity: (obj.opacity || 1) * 100,
          } as LineElement;
        } else {
          updatedElement = {
            ...originalElement,
            x: canvasToTemplate(obj.left || 0),
            y: canvasToTemplate(obj.top || 0),
            rotation: obj.angle || 0,
          };
        }

        updatedElements[elementIndex] = updatedElement;
      });

      // Fill in any missing elements (those not on canvas)
      value.elements.forEach((element, index) => {
        if (!updatedElements[index]) {
          updatedElements[index] = element;
        }
      });

      const updatedData: CanvasData = {
        ...value,
        elements: updatedElements.filter(Boolean),
      };

      debouncedOnChange(updatedData);
    } catch (error) {
      console.error('Error updating canvas data:', error);
      setError('Failed to update canvas data');
    }
  }, [value, debouncedOnChange, readOnly]);

  // Enhanced element synchronization - Fixed color mapping
  useEffect(() => {
    if (!fabricCanvas || !value.elements) return;

    const objects = fabricCanvas.getObjects();
    
    value.elements.forEach((element, index) => {
      const fabricObject = objects.find(obj => obj.get('elementIndex') === index);
      if (!fabricObject) return;

      try {
        // Update properties based on element type with type checking
        if ((element.type === 'text' || element.type === 'placeholder') && fabricObject instanceof IText) {
          const textElement = element as TextElement;
          const displayText = element.type === 'placeholder' ? `[${textElement.text || 'Placeholder'}]` : textElement.text || '';
          fabricObject.set({
            fill: textElement.color || textElement.fill || '#000000',
            text: displayText,
            fontSize: templateToCanvas(textElement.fontSize || DEFAULT_FONT_SIZE),
            fontWeight: textElement.bold ? 'bold' : 'normal',
            fontStyle: textElement.italic ? 'italic' : 'normal',
            underline: textElement.underline || false,
            textAlign: textElement.textAlign || 'left',
          });
        } else if ((element.type === 'rectangle' || element.type === 'rounded-rectangle') && fabricObject instanceof Rect) {
          const shapeElement = element as ShapeElement;
          const updates: any = {
            fill: shapeElement.color || shapeElement.fill || shapeElement.backgroundColor || '#cccccc',
            stroke: shapeElement.strokeColor || shapeElement.stroke || shapeElement.borderColor || '',
            strokeWidth: templateToCanvas(shapeElement.strokeWidth || 0),
            opacity: (shapeElement.opacity || DEFAULT_OPACITY) / 100,
          };
          
          if (element.type === 'rounded-rectangle') {
            const cornerRadius = templateToCanvas(shapeElement.cornerRadius || 10);
            updates.rx = cornerRadius;
            updates.ry = cornerRadius;
          }
          
          fabricObject.set(updates);
        } else if (element.type === 'circle' && fabricObject instanceof Circle) {
          const shapeElement = element as ShapeElement;
          fabricObject.set({
            fill: shapeElement.color || shapeElement.fill || shapeElement.backgroundColor || '#cccccc',
            stroke: shapeElement.strokeColor || shapeElement.stroke || shapeElement.borderColor || '',
            strokeWidth: templateToCanvas(shapeElement.strokeWidth || 0),
            opacity: (shapeElement.opacity || DEFAULT_OPACITY) / 100,
          });
        } else if (element.type === 'line' && fabricObject instanceof Line) {
          const lineElement = element as LineElement;
          fabricObject.set({
            stroke: lineElement.color || lineElement.stroke || '#000000',
            strokeWidth: templateToCanvas(lineElement.strokeWidth || DEFAULT_STROKE_WIDTH),
            opacity: (lineElement.opacity || DEFAULT_OPACITY) / 100,
            strokeDashArray: lineElement.strokeDashArray || [],
          });
        }
      } catch (error) {
        console.error('Error updating fabric object:', error);
      }
    });

    fabricCanvas.renderAll();
  }, [value.elements, fabricCanvas]);

  // Handle selected element changes
  useEffect(() => {
    if (!fabricCanvas || selectedElementIndex === undefined) return;

    const objects = fabricCanvas.getObjects();
    const targetObject = objects.find(obj => obj.get('elementIndex') === selectedElementIndex);
    
    if (targetObject && targetObject !== fabricCanvas.getActiveObject()) {
      fabricCanvas.setActiveObject(targetObject);
      fabricCanvas.renderAll();
      setSelectedObject(targetObject);
    } else if (selectedElementIndex === null) {
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();
      setSelectedObject(null);
    }
  }, [selectedElementIndex, fabricCanvas]);

  // Enhanced canvas initialization
  useEffect(() => {
    if (!canvasRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const canvas = new FabricCanvas(canvasRef.current, {
        width: CANVAS_DISPLAY_WIDTH,
        height: CANVAS_DISPLAY_HEIGHT,
        backgroundColor: value.backgroundColor || '#ffffff',
        selection: !readOnly,
        interactive: !readOnly,
      });

      // Load background image if provided
      if (backgroundImage) {
        FabricImage.fromURL(backgroundImage, {
          crossOrigin: 'anonymous'
        }).then((img) => {
          if (img) {
            img.set({
              left: 0,
              top: 0,
              selectable: false,
              evented: false,
              excludeFromExport: false,
            });
            img.scaleToWidth(CANVAS_DISPLAY_WIDTH);
            canvas.backgroundImage = img;
            canvas.renderAll();
          }
        }).catch((error) => {
          console.error('Error loading background image:', error);
          setError('Failed to load background image');
        });
      }

      // Create and add fabric objects for each element
      value.elements.forEach((element, index) => {
        const fabricObject = createFabricObject(element, index);
        if (fabricObject) {
          canvas.add(fabricObject);
        }
      });

      // Enhanced event handlers
      canvas.on('selection:created', (e) => {
        const selectedObj = e.selected?.[0];
        setSelectedObject(selectedObj || null);
        if (selectedObj && onElementSelect) {
          const elementIndex = selectedObj.get('elementIndex');
          if (elementIndex !== undefined) {
            onElementSelect(elementIndex);
          }
        }
      });

      canvas.on('selection:updated', (e) => {
        const selectedObj = e.selected?.[0];
        setSelectedObject(selectedObj || null);
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

      canvas.on('object:modified', () => {
        updateCanvasData(canvas);
      });

      // Handle text editing
      canvas.on('text:changed', () => {
        updateCanvasData(canvas);
      });

      setFabricCanvas(canvas);
      setIsLoading(false);

      return () => {
        canvas.dispose();
      };
    } catch (error) {
      console.error('Error initializing canvas:', error);
      setError('Failed to initialize canvas');
      setIsLoading(false);
    }
  }, [backgroundImage, value.backgroundColor, readOnly, createFabricObject, updateCanvasData, onElementSelect]);

  // Enhanced add element functions
  const addTextElement = useCallback(() => {
    if (!fabricCanvas || readOnly) return;

    const newElement: TextElement = {
      id: generateId(),
      type: 'text',
      x: 50,
      y: 50,
      text: 'New Text',
      fontSize: DEFAULT_FONT_SIZE,
      color: '#000000',
    };

    const updatedElements = [...value.elements, newElement];
    const fabricObject = createFabricObject(newElement, updatedElements.length - 1);
    
    if (fabricObject) {
      fabricCanvas.add(fabricObject);
      fabricCanvas.setActiveObject(fabricObject);
      fabricCanvas.renderAll();
      
      const updatedData: CanvasData = {
        ...value,
        elements: updatedElements,
      };
      
      onChange(updatedData);
      addToHistory(updatedData);
    }
  }, [fabricCanvas, value, onChange, addToHistory, createFabricObject, readOnly]);

  const addPlaceholderElement = useCallback(() => {
    if (!fabricCanvas || readOnly) return;

    const newElement: TextElement = {
      id: generateId(),
      type: 'placeholder',
      x: 50,
      y: 100,
      text: 'Recipient Name',
      fontSize: DEFAULT_FONT_SIZE,
      color: '#1976d2',
    };

    const updatedElements = [...value.elements, newElement];
    const fabricObject = createFabricObject(newElement, updatedElements.length - 1);
    
    if (fabricObject) {
      fabricCanvas.add(fabricObject);
      fabricCanvas.setActiveObject(fabricObject);
      fabricCanvas.renderAll();
      
      const updatedData: CanvasData = {
        ...value,
        elements: updatedElements,
      };
      
      onChange(updatedData);
      addToHistory(updatedData);
    }
  }, [fabricCanvas, value, onChange, addToHistory, createFabricObject, readOnly]);

  const addShapeElement = useCallback((shapeType: 'rectangle' | 'rounded-rectangle' | 'circle') => {
    if (!fabricCanvas || readOnly) return;

    const newElement: ShapeElement = {
      id: generateId(),
      type: shapeType,
      x: 100,
      y: 100,
      width: shapeType === 'circle' ? 80 : 120,
      height: shapeType === 'circle' ? 80 : 80,
      color: '#cccccc',
      strokeColor: '#000000',
      strokeWidth: 1,
      opacity: DEFAULT_OPACITY,
      ...(shapeType === 'rounded-rectangle' && { cornerRadius: 10 }),
    };

    const updatedElements = [...value.elements, newElement];
    const fabricObject = createFabricObject(newElement, updatedElements.length - 1);
    
    if (fabricObject) {
      fabricCanvas.add(fabricObject);
      fabricCanvas.setActiveObject(fabricObject);
      fabricCanvas.renderAll();
      
      const updatedData: CanvasData = {
        ...value,
        elements: updatedElements,
      };
      
      onChange(updatedData);
      addToHistory(updatedData);
    }
  }, [fabricCanvas, value, onChange, addToHistory, createFabricObject, readOnly]);

  const addLineElement = useCallback(() => {
    if (!fabricCanvas || readOnly) return;

    const newElement: LineElement = {
      id: generateId(),
      type: 'line',
      x: 50,
      y: 150,
      x2: 200,
      y2: 150,
      color: '#000000',
      strokeWidth: DEFAULT_STROKE_WIDTH,
      opacity: DEFAULT_OPACITY,
    };

    const updatedElements = [...value.elements, newElement];
    const fabricObject = createFabricObject(newElement, updatedElements.length - 1);
    
    if (fabricObject) {
      fabricCanvas.add(fabricObject);
      fabricCanvas.setActiveObject(fabricObject);
      fabricCanvas.renderAll();
      
      const updatedData: CanvasData = {
        ...value,
        elements: updatedElements,
      };
      
      onChange(updatedData);
      addToHistory(updatedData);
    }
  }, [fabricCanvas, value, onChange, addToHistory, createFabricObject, readOnly]);

  const deleteSelectedElement = useCallback(() => {
    if (!fabricCanvas || !selectedObject || readOnly) return;

    const elementIndex = selectedObject.get('elementIndex') as number;
    if (elementIndex === undefined) return;

    fabricCanvas.remove(selectedObject);
    
    const updatedElements = value.elements.filter((_, index) => index !== elementIndex);
    const updatedData: CanvasData = {
      ...value,
      elements: updatedElements,
    };
    
    onChange(updatedData);
    addToHistory(updatedData);
    setSelectedObject(null);
    
    if (onElementSelect) {
      onElementSelect(null);
    }
  }, [fabricCanvas, selectedObject, value, onChange, addToHistory, onElementSelect, readOnly]);

  const handleUndo = useCallback(() => {
    const previousState = undo();
    if (previousState) {
      onChange(previousState);
    }
  }, [undo, onChange]);

  const handleRedo = useCallback(() => {
    const nextState = redo();
    if (nextState) {
      onChange(nextState);
    }
  }, [redo, onChange]);

  // Enhanced error handling and loading states
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading canvas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-red-600">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
          <Button 
            onClick={() => {
              setError(null);
              window.location.reload();
            }}
            className="mt-2"
            size="sm"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Enhanced toolbar */}
      <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
        {!readOnly && (
          <>
            <Button 
              onClick={addTextElement} 
              size="sm" 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Type className="h-4 w-4" />
              Add Text
            </Button>
            
            <Button 
              onClick={addPlaceholderElement} 
              size="sm" 
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Add Placeholder
            </Button>
            
            <Button 
              onClick={() => addShapeElement('rectangle')} 
              size="sm" 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Square className="h-4 w-4" />
              Rectangle
            </Button>
            
            <Button 
              onClick={() => addShapeElement('rounded-rectangle')} 
              size="sm" 
              variant="outline"
              className="flex items-center gap-2"
            >
              <RectangleHorizontal className="h-4 w-4" />
              Rounded
            </Button>
            
            <Button 
              onClick={() => addShapeElement('circle')} 
              size="sm" 
              variant="outline"
              className="flex items-center gap-2"
            >
              <CircleIcon className="h-4 w-4" />
              Circle
            </Button>
            
            <Button 
              onClick={addLineElement} 
              size="sm" 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Minus className="h-4 w-4" />
              Line
            </Button>

            <div className="flex items-center gap-1 ml-4 border-l pl-4">
              <Button 
                onClick={handleUndo} 
                size="sm" 
                variant="outline"
                disabled={!canUndo}
                className="flex items-center gap-2"
              >
                <Undo className="h-4 w-4" />
                Undo
              </Button>
              
              <Button 
                onClick={handleRedo} 
                size="sm" 
                variant="outline"
                disabled={!canRedo}
                className="flex items-center gap-2"
              >
                <Redo className="h-4 w-4" />
                Redo
              </Button>
            </div>

            {selectedObject && (
              <Button 
                onClick={deleteSelectedElement} 
                size="sm" 
                variant="destructive"
                className="flex items-center gap-2 ml-auto"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
          </>
        )}
      </div>

      {/* Canvas container with better styling */}
      <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <canvas 
          ref={canvasRef} 
          className="block max-w-full h-auto"
          style={{ 
            cursor: readOnly ? 'default' : 'crosshair',
            touchAction: 'none'
          }}
        />
        {readOnly && (
          <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
            Read Only
          </div>
        )}
      </div>

      {/* Enhanced properties panel */}
      {!readOnly && (
        <Collapsible open={toolsExpanded} onOpenChange={setToolsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Element Properties
              </span>
              {toolsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-4 mt-4">
            {selectedObject ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Selected Element Properties
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Enhanced property controls would go here */}
                  <p className="text-sm text-gray-600">
                    Element type: {selectedObject.get('type') || 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Position: ({Math.round(canvasToTemplate(selectedObject.left || 0))}, {Math.round(canvasToTemplate(selectedObject.top || 0))})
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-gray-500 text-sm">
                    Select an element to edit its properties
                  </p>
                </CardContent>
              </Card>
            )}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};

export default GiftCardCanvasEditor;
