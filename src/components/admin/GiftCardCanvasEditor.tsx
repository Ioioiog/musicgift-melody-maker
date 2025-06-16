import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Canvas as FabricCanvas, IText, FabricImage, Rect, Circle, Line, Object as FabricObject } from 'fabric';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ColorPicker } from '@/components/ui/color-picker';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Type, FileText, Square, RectangleHorizontal, Circle as CircleIcon, Minus, Trash2, Undo, Redo, Palette, ChevronDown, ChevronRight } from 'lucide-react';

// ========================================================================================
// TYPES AND INTERFACES
// ========================================================================================

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
  cornerRadius?: number;
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

// ========================================================================================
// CONSTANTS AND UTILITIES
// ========================================================================================

const SCALE_FACTOR = 2;
const CANVAS_DISPLAY_WIDTH = 600;
const CANVAS_DISPLAY_HEIGHT = 400;
const DEFAULT_FONT_SIZE = 16;
const DEFAULT_STROKE_WIDTH = 2;
const DEFAULT_OPACITY = 100;

// Updated placeholder options - only gift card relevant placeholders
const PLACEHOLDER_OPTIONS = [
  { category: 'Personal Information', placeholders: [
    { value: 'Recipient Name', label: 'Recipient Name', description: 'Name of the gift recipient' },
    { value: 'Sender Name', label: 'Sender Name', description: 'Name of the gift sender' },
    { value: 'Personal Message', label: 'Personal Message', description: 'Custom message from sender' },
  ]},
  { category: 'Gift Card Details', placeholders: [
    { value: 'Gift Amount', label: 'Gift Amount', description: 'Monetary value of the gift' },
    { value: 'Currency', label: 'Currency', description: 'Gift card currency (RON/EUR)' },
    { value: 'Gift Code', label: 'Gift Code', description: 'Unique gift card code' },
    { value: 'Delivery Date', label: 'Delivery Date', description: 'When the gift card will be delivered' },
  ]},
];

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

// ========================================================================================
// UNDO/REDO HOOK
// ========================================================================================

const useUndoRedo = (initialState: CanvasData, maxSteps: number = 50) => {
  const [history, setHistory] = useState<CanvasData[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const addToHistory = useCallback((state: CanvasData) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(state)));
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

// ========================================================================================
// MAIN COMPONENT
// ========================================================================================

const GiftCardCanvasEditor: React.FC<GiftCardCanvasEditorProps> = ({
  value,
  onChange,
  backgroundImage,
  selectedElementIndex,
  onElementSelect,
  readOnly = false,
  maxUndoSteps = 50
}) => {
  // State management
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [toolsExpanded, setToolsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { addToHistory, undo, redo, canUndo, canRedo } = useUndoRedo(value, maxUndoSteps);

  // Debounced onChange to prevent excessive updates
  const debouncedOnChange = useMemo(
    () => debounce((data: CanvasData) => {
      onChange(data);
      addToHistory(data);
    }, 300),
    [onChange, addToHistory]
  );

  // ========================================================================================
  // FABRIC OBJECT CREATION
  // ========================================================================================

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

  // ========================================================================================
  // CANVAS DATA SYNCHRONIZATION
  // ========================================================================================

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

  // ========================================================================================
  // ELEMENT ADDITION FUNCTIONS
  // ========================================================================================

  const addTextElement = useCallback(() => {
    if (!fabricCanvas || readOnly) return;

    try {
      console.log('Adding text element...');
      
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
        console.log('Text element added successfully');
      }
    } catch (error) {
      console.error('Error adding text element:', error);
      setError('Failed to add text element');
    }
  }, [fabricCanvas, value, onChange, addToHistory, createFabricObject, readOnly]);

  const addPlaceholderElement = useCallback((placeholderText: string) => {
    if (!fabricCanvas || readOnly) return;

    try {
      console.log('Adding placeholder element with text:', placeholderText);
      
      if (!placeholderText || typeof placeholderText !== 'string' || placeholderText.trim() === '') {
        console.error('Invalid placeholder text:', placeholderText);
        setError('Invalid placeholder text provided');
        return;
      }

      const newElement: TextElement = {
        id: generateId(),
        type: 'placeholder',
        x: 50,
        y: 100,
        text: placeholderText.trim(),
        fontSize: DEFAULT_FONT_SIZE,
        color: '#1976d2',
      };

      console.log('Creating placeholder element:', newElement);

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
        console.log('Placeholder element added successfully:', placeholderText);
      } else {
        console.error('Failed to create fabric object for placeholder');
        setError('Failed to create placeholder on canvas');
      }
    } catch (error) {
      console.error('Error adding placeholder element:', error);
      setError(`Failed to add placeholder: ${error.message}`);
    }
  }, [fabricCanvas, value, onChange, addToHistory, createFabricObject, readOnly]);

  const addShapeElement = useCallback((shapeType: 'rectangle' | 'rounded-rectangle' | 'circle') => {
    if (!fabricCanvas || readOnly) return;

    try {
      console.log('Adding shape element:', shapeType);
      
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
        console.log('Shape element added successfully:', shapeType);
      }
    } catch (error) {
      console.error('Error adding shape element:', error);
      setError(`Failed to add ${shapeType}`);
    }
  }, [fabricCanvas, value, onChange, addToHistory, createFabricObject, readOnly]);

  const addLineElement = useCallback(() => {
    if (!fabricCanvas || readOnly) return;

    try {
      console.log('Adding line element...');
      
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
        console.log('Line element added successfully');
      }
    } catch (error) {
      console.error('Error adding line element:', error);
      setError('Failed to add line element');
    }
  }, [fabricCanvas, value, onChange, addToHistory, createFabricObject, readOnly]);

  // ========================================================================================
  // ELEMENT MANIPULATION
  // ========================================================================================

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

  const updateSelectedElementProperty = useCallback((property: string, newValue: any) => {
    if (selectedElementIndex === null || !fabricCanvas) return;

    console.log('Updating property:', property, 'with value:', newValue);

    const updatedElements = [...value.elements];
    const currentElement = updatedElements[selectedElementIndex];
    
    if (!currentElement) return;

    updatedElements[selectedElementIndex] = {
      ...currentElement,
      [property]: newValue
    };

    const updatedData: CanvasData = {
      ...value,
      elements: updatedElements
    };

    const fabricObject = fabricCanvas.getObjects().find(obj => obj.get('elementIndex') === selectedElementIndex);
    if (fabricObject) {
      try {
        if (property === 'color' || property === 'fill') {
          if (fabricObject instanceof IText) {
            fabricObject.set({ fill: newValue });
          } else if (fabricObject instanceof Rect || fabricObject instanceof Circle) {
            fabricObject.set({ fill: newValue });
          } else if (fabricObject instanceof Line) {
            fabricObject.set({ stroke: newValue });
          }
        } else if (property === 'strokeColor' || property === 'stroke') {
          if (fabricObject instanceof Rect || fabricObject instanceof Circle) {
            fabricObject.set({ stroke: newValue });
          }
        } else if (property === 'strokeWidth') {
          fabricObject.set({ strokeWidth: templateToCanvas(newValue) });
        } else if (property === 'opacity') {
          fabricObject.set({ opacity: newValue / 100 });
        } else if (property === 'fontSize') {
          if (fabricObject instanceof IText) {
            fabricObject.set({ fontSize: templateToCanvas(newValue) });
          }
        } else if (property === 'text') {
          if (fabricObject instanceof IText) {
            const displayText = currentElement.type === 'placeholder' ? `[${newValue}]` : newValue;
            fabricObject.set({ text: displayText });
          }
        }
        
        fabricCanvas.renderAll();
      } catch (error) {
        console.error('Error updating fabric object:', error);
      }
    }

    onChange(updatedData);
  }, [selectedElementIndex, value, onChange, fabricCanvas]);

  // ========================================================================================
  // UNDO/REDO HANDLERS
  // ========================================================================================

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

  // ========================================================================================
  // CANVAS INITIALIZATION AND EFFECTS
  // ========================================================================================

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
            
            const canvasAspect = CANVAS_DISPLAY_WIDTH / CANVAS_DISPLAY_HEIGHT;
            const imgAspect = (img.width || 1) / (img.height || 1);
            
            if (imgAspect > canvasAspect) {
              img.scaleToHeight(CANVAS_DISPLAY_HEIGHT);
              img.set({ left: (CANVAS_DISPLAY_WIDTH - (img.getScaledWidth() || 0)) / 2 });
            } else {
              img.scaleToWidth(CANVAS_DISPLAY_WIDTH);
              img.set({ top: (CANVAS_DISPLAY_HEIGHT - (img.getScaledHeight() || 0)) / 2 });
            }
            
            canvas.backgroundImage = img;
            canvas.renderAll();
          }
        }).catch((error) => {
          console.error('Error loading background image:', error);
          setError('Failed to load background image');
        });
      }

      value.elements.forEach((element, index) => {
        const fabricObject = createFabricObject(element, index);
        if (fabricObject) {
          canvas.add(fabricObject);
        }
      });

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

  // Element synchronization effect
  useEffect(() => {
    if (!fabricCanvas || !value.elements) return;

    const objects = fabricCanvas.getObjects();
    
    value.elements.forEach((element, index) => {
      const fabricObject = objects.find(obj => obj.get('elementIndex') === index);
      if (!fabricObject) return;

      try {
        if ((element.type === 'text' || element.type === 'placeholder') && fabricObject instanceof IText) {
          const textElement = element as TextElement;
          const displayText = element.type === 'placeholder' ? `[${textElement.text || 'Placeholder'}]` : textElement.text || '';
          fabricObject.set({
            fill: textElement.color || '#000000',
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
            fill: shapeElement.color || '#cccccc',
            stroke: shapeElement.strokeColor || '',
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
            fill: shapeElement.color || '#cccccc',
            stroke: shapeElement.strokeColor || '',
            strokeWidth: templateToCanvas(shapeElement.strokeWidth || 0),
            opacity: (shapeElement.opacity || DEFAULT_OPACITY) / 100,
          });
        } else if (element.type === 'line' && fabricObject instanceof Line) {
          const lineElement = element as LineElement;
          fabricObject.set({
            stroke: lineElement.color || '#000000',
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

  // ========================================================================================
  // RENDER LOGIC
  // ========================================================================================

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

  const selectedElement = selectedElementIndex !== null ? value.elements[selectedElementIndex] : null;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Add Placeholder
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-white border border-gray-200 shadow-lg z-[10000] max-h-80 overflow-y-auto">
                {PLACEHOLDER_OPTIONS.map((category) => (
                  <div key={category.category}>
                    <DropdownMenuLabel className="text-xs font-semibold text-gray-500 uppercase bg-gray-50 px-3 py-2">
                      {category.category}
                    </DropdownMenuLabel>
                    {category.placeholders.map((placeholder) => (
                      <DropdownMenuItem
                        key={placeholder.value}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Dropdown clicked for placeholder:', placeholder.value);
                          addPlaceholderElement(placeholder.value);
                        }}
                        className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100 px-3 py-2"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{placeholder.label}</span>
                          <span className="text-xs text-gray-500">{placeholder.description}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator className="bg-gray-200" />
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
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

      {/* Canvas */}
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

      {/* Properties Panel */}
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
            {selectedElement ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    {selectedElement.type === 'placeholder' ? 'Placeholder Element' : 'Selected Element'} Properties
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Text/Placeholder Properties */}
                  {(selectedElement.type === 'text' || selectedElement.type === 'placeholder') && (
                    <>
                      {selectedElement.type === 'placeholder' ? (
                        <div>
                          <Label className="text-sm font-medium">Placeholder Type</Label>
                          <Select
                            value={(selectedElement as TextElement).text || ''}
                            onValueChange={(val) => updateSelectedElementProperty('text', val)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select placeholder type" />
                            </SelectTrigger>
                            <SelectContent className="bg-white z-[9999]">
                              {PLACEHOLDER_OPTIONS.map((category) => (
                                <div key={category.category}>
                                  <SelectItem value="" disabled className="text-xs font-semibold text-gray-500 uppercase">
                                    {category.category}
                                  </SelectItem>
                                  {category.placeholders.map((placeholder) => (
                                    <SelectItem key={placeholder.value} value={placeholder.value}>
                                      {placeholder.label}
                                    </SelectItem>
                                  ))}
                                </div>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <div>
                          <Label className="text-sm font-medium">Text Content</Label>
                          <Input
                            value={(selectedElement as TextElement).text || ''}
                            onChange={(e) => updateSelectedElementProperty('text', e.target.value)}
                            className="mt-1"
                            placeholder="Enter text"
                          />
                        </div>
                      )}
                      
                      <ColorPicker
                        label="Text Color"
                        value={(selectedElement as TextElement).color || '#000000'}
                        onChange={(color) => updateSelectedElementProperty('color', color)}
                      />
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-sm font-medium">Font Size</Label>
                          <Input
                            type="number"
                            value={(selectedElement as TextElement).fontSize || 16}
                            onChange={(e) => updateSelectedElementProperty('fontSize', parseInt(e.target.value))}
                            className="mt-1"
                            min="8"
                            max="72"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Font Weight</Label>
                          <Select
                            value={(selectedElement as TextElement).bold ? 'bold' : 'normal'}
                            onValueChange={(val) => updateSelectedElementProperty('bold', val === 'bold')}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white z-[9999]">
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="bold">Bold</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Shape Properties */}
                  {(selectedElement.type === 'rectangle' || selectedElement.type === 'rounded-rectangle' || selectedElement.type === 'circle') && (
                    <>
                      <ColorPicker
                        label="Fill Color"
                        value={(selectedElement as ShapeElement).color || '#cccccc'}
                        onChange={(color) => updateSelectedElementProperty('color', color)}
                      />
                      
                      <ColorPicker
                        label="Border Color"
                        value={(selectedElement as ShapeElement).strokeColor || '#000000'}
                        onChange={(color) => updateSelectedElementProperty('strokeColor', color)}
                      />
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-sm font-medium">Border Width</Label>
                          <Input
                            type="number"
                            value={(selectedElement as ShapeElement).strokeWidth || 1}
                            onChange={(e) => updateSelectedElementProperty('strokeWidth', parseInt(e.target.value))}
                            className="mt-1"
                            min="0"
                            max="20"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Opacity (%)</Label>
                          <Input
                            type="number"
                            value={Math.round((selectedElement.opacity || 100))}
                            onChange={(e) => updateSelectedElementProperty('opacity', parseInt(e.target.value))}
                            className="mt-1"
                            min="0"
                            max="100"
                          />
                        </div>
                      </div>

                      {selectedElement.type === 'rounded-rectangle' && (
                        <div>
                          <Label className="text-sm font-medium">Corner Radius</Label>
                          <Input
                            type="number"
                            value={(selectedElement as ShapeElement).cornerRadius || 10}
                            onChange={(e) => updateSelectedElementProperty('cornerRadius', parseInt(e.target.value))}
                            className="mt-1"
                            min="0"
                            max="50"
                          />
                        </div>
                      )}
                    </>
                  )}

                  {/* Line Properties */}
                  {selectedElement.type === 'line' && (
                    <>
                      <ColorPicker
                        label="Line Color"
                        value={(selectedElement as LineElement).color || '#000000'}
                        onChange={(color) => updateSelectedElementProperty('color', color)}
                      />
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-sm font-medium">Line Width</Label>
                          <Input
                            type="number"
                            value={(selectedElement as LineElement).strokeWidth || 2}
                            onChange={(e) => updateSelectedElementProperty('strokeWidth', parseInt(e.target.value))}
                            className="mt-1"
                            min="1"
                            max="20"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Opacity (%)</Label>
                          <Input
                            type="number"
                            value={Math.round((selectedElement.opacity || 100))}
                            onChange={(e) => updateSelectedElementProperty('opacity', parseInt(e.target.value))}
                            className="mt-1"
                            min="0"
                            max="100"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Position and Transform */}
                  <div className="border-t pt-4">
                    <Label className="text-sm font-medium mb-2 block">Position & Transform</Label>
                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                      <div>X: {Math.round(selectedElement.x)}</div>
                      <div>Y: {Math.round(selectedElement.y)}</div>
                      <div>Rotation: {Math.round(selectedElement.rotation || 0)}°</div>
                    </div>
                  </div>
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
