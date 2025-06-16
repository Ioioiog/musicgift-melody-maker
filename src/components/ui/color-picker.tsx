
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  presetColors?: string[];
}

const defaultPresetColors = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  '#FFC0CB', '#A52A2A', '#808080', '#008000', '#000080',
  '#FFFFE0', '#ADD8E6', '#F0E68C', '#E6E6FA', '#98FB98'
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  label = "Color",
  presetColors = defaultPresetColors
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hexInput, setHexInput] = useState(value);

  const handleHexChange = (hex: string) => {
    setHexInput(hex);
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      onChange(hex);
    }
  };

  const handlePresetClick = (color: string) => {
    onChange(color);
    setHexInput(color);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <div
              className="w-4 h-4 rounded border mr-2"
              style={{ backgroundColor: value }}
            />
            <span className="flex-1">{value}</span>
            <Palette className="w-4 h-4 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3">
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-600">Hex Color</Label>
              <Input
                type="text"
                value={hexInput}
                onChange={(e) => handleHexChange(e.target.value)}
                placeholder="#000000"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label className="text-xs text-gray-600">Color Picker</Label>
              <input
                type="color"
                value={value}
                onChange={(e) => {
                  onChange(e.target.value);
                  setHexInput(e.target.value);
                }}
                className="w-full h-10 border rounded mt-1 cursor-pointer"
              />
            </div>
            
            <div>
              <Label className="text-xs text-gray-600">Preset Colors</Label>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handlePresetClick(color)}
                    className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
