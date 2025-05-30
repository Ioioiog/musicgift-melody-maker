
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { validateField } from '@/hooks/useFieldValidation';
import { useLanguage } from '@/contexts/LanguageContext';

interface FormField {
  id: string;
  field_name: string;
  field_type: string;
  placeholder_key?: string;
  required?: boolean;
  options?: { value: string; label_key: string }[];
  styling_class?: string;
}

interface DateValue {
  from?: Date;
  to?: Date;
}

const formatDate = (date: Date | undefined): string => {
  return date ? format(date, 'yyyy-MM-dd') : '';
};

const renderInputField = (
  field: FormField,
  value: any,
  onChange: (value: any) => void,
  errors: string[] = [],
  t: (key: string) => string
) => {
  const hasError = errors.length > 0;
  
  return (
    <div className="space-y-2">
      <Input
        type={field.field_type === 'email' ? 'email' : 
              field.field_type === 'url' ? 'url' : 
              field.field_type === 'number' ? 'number' : 'text'}
        placeholder={field.placeholder_key ? t(field.placeholder_key) : field.field_name}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={cn(hasError && 'border-red-500')}
      />
      {hasError && (
        <div className="text-red-500 text-sm">
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
    </div>
  );
};

const renderTextareaField = (
  field: FormField,
  value: any,
  onChange: (value: any) => void,
  errors: string[] = [],
  t: (key: string) => string
) => {
  const hasError = errors.length > 0;

  return (
    <div className="space-y-2">
      <Textarea
        placeholder={field.placeholder_key ? t(field.placeholder_key) : field.field_name}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={cn(hasError && 'border-red-500')}
      />
      {hasError && (
        <div className="text-red-500 text-sm">
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
    </div>
  );
};

const renderSelectField = (
  field: FormField,
  value: any,
  onChange: (value: any) => void,
  errors: string[] = [],
  t: (key: string) => string
) => {
  const hasError = errors.length > 0;

  return (
    <div className="space-y-2">
      <Select onValueChange={onChange} value={value || ''}>
        <SelectTrigger className={cn('w-full bg-white border border-gray-300 shadow-sm', hasError && 'border-red-500')}>
          <SelectValue placeholder={field.placeholder_key ? t(field.placeholder_key) : field.field_name} />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {field.options?.map((option, index) => (
            <SelectItem 
              key={`${field.field_name}-${option.value || 'empty'}-${index}`}
              value={option.value || ''}
              className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
            >
              {option.label_key ? t(option.label_key) : option.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasError && (
        <div className="text-red-500 text-sm">
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
    </div>
  );
};

const renderMultiselectField = (
  field: FormField,
  value: any[],
  onChange: (value: any[]) => void,
  errors: string[] = []
) => {
  const hasError = errors.length > 0;
  const selectedValues = Array.isArray(value) ? value : [];

  const handleCheckboxChange = (optionValue: string) => {
    if (selectedValues.includes(optionValue)) {
      onChange(selectedValues.filter((v) => v !== optionValue));
    } else {
      onChange([...selectedValues, optionValue]);
    }
  };

  return (
    <div className="space-y-2">
      <div className={cn("grid gap-2 grid-cols-2 md:grid-cols-3", hasError && 'border border-red-500 rounded-md p-2')}>
        {field.options?.map((option, index) => (
          <div key={`${field.field_name}-multiselect-${option.value || 'empty'}-${index}`} className="flex items-center space-x-2">
            <Checkbox
              id={`${field.field_name}-${option.value || 'empty'}-${index}`}
              checked={selectedValues.includes(option.value || '')}
              onCheckedChange={() => handleCheckboxChange(option.value || '')}
            />
            <Label htmlFor={`${field.field_name}-${option.value || 'empty'}-${index}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {option.label_key}
            </Label>
          </div>
        ))}
      </div>
      {hasError && (
        <div className="text-red-500 text-sm">
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
    </div>
  );
};

const renderCheckboxField = (
  field: FormField,
  value: boolean,
  onChange: (value: boolean) => void,
  errors: string[] = []
) => {
  const hasError = errors.length > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={field.field_name}
          checked={!!value}
          onCheckedChange={onChange}
        />
        <Label htmlFor={field.field_name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {field.placeholder_key || field.field_name}
        </Label>
      </div>
      {hasError && (
        <div className="text-red-500 text-sm">
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
    </div>
  );
};

const renderRadioField = (
  field: FormField,
  value: any,
  onChange: (value: any) => void,
  errors: string[] = []
) => {
  const hasError = errors.length > 0;

  return (
    <div className="space-y-2">
      <RadioGroup defaultValue={value} onValueChange={onChange} className="flex flex-col space-y-1">
        {field.options?.map((option, index) => (
          <div key={`${field.field_name}-radio-${option.value || 'empty'}-${index}`} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value || ''} id={`${field.field_name}-${option.value || 'empty'}-${index}`} />
            <Label htmlFor={`${field.field_name}-${option.value || 'empty'}-${index}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {option.label_key}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {hasError && (
        <div className="text-red-500 text-sm">
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
    </div>
  );
};

const renderDateField = (
  field: FormField,
  value: DateValue,
  onChange: (value: DateValue) => void,
  errors: string[] = []
) => {
  const hasError = errors.length > 0;
  const selectedDate = value?.from ? new Date(value.from) : undefined;

  return (
    <div className="space-y-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-[280px] justify-start text-left font-normal',
              !selectedDate && 'text-muted-foreground',
              hasError && 'border-red-500'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? formatDate(selectedDate) : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => onChange({ from: date })}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {hasError && (
        <div className="text-red-500 text-sm">
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
    </div>
  );
};

const renderFileField = (
  field: FormField,
  value: any,
  onChange: (value: any) => void,
  errors: string[] = []
) => {
  const hasError = errors.length > 0;
  const [file, setFile] = React.useState<File | null>(null);

  React.useEffect(() => {
    if (value instanceof File) {
      setFile(value);
    } else {
      setFile(null);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      onChange(selectedFile);
    } else {
      setFile(null);
      onChange(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    onChange(null);
  };

  return (
    <div className="space-y-2">
      {file ? (
        <div className="flex items-center justify-between p-4 border rounded-md">
          <span className="text-sm">{file.name}</span>
          <Button type="button" variant="ghost" size="sm" onClick={handleRemoveFile}>
            <X className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
      ) : (
        <Label htmlFor={field.field_name} className="cursor-pointer flex flex-col items-center justify-center w-full p-4 border-2 border-dashed rounded-md hover:bg-gray-50">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag and drop a file here or click to browse.
            </p>
          </div>
          <Input
            id={field.field_name}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </Label>
      )}
      {hasError && (
        <div className="text-red-500 text-sm">
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
    </div>
  );
};

interface FormFieldRendererProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  validationErrors?: string[];
}

const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({ 
  field, 
  value, 
  onChange,
  validationErrors = []
}) => {
  const { t } = useLanguage();

  const renderField = () => {
    switch (field.field_type) {
      case 'text':
      case 'email':
      case 'url':
      case 'number':
        return renderInputField(field, value, onChange, validationErrors, t);
      case 'textarea':
        return renderTextareaField(field, value, onChange, validationErrors, t);
      case 'select':
        return renderSelectField(field, value, onChange, validationErrors, t);
      case 'multiselect':
        return renderMultiselectField(field, value, onChange, validationErrors);
      case 'checkbox':
        return renderCheckboxField(field, value, onChange, validationErrors);
      case 'radio':
        return renderRadioField(field, value, onChange, validationErrors);
      case 'date':
        return renderDateField(field, value, onChange, validationErrors);
      case 'file':
        return renderFileField(field, value, onChange, validationErrors);
      default:
        return renderInputField(field, value, onChange, validationErrors, t);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={field.field_name} className={cn(
        "text-sm font-medium",
        field.required && "after:content-['*'] after:text-red-500 after:ml-1"
      )}>
        {field.field_name}
      </Label>
      {renderField()}
    </div>
  );
};

export default FormFieldRenderer;
