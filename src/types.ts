
export interface PackageInclude {
  include_key: string;
  include_order?: number;
}

export interface FieldOption {
  value: string;
  label_key: string;
}

export interface Field {
  id: string;
  field_name: string;
  field_type: string;
  label_key?: string;
  placeholder_key?: string;
  required: boolean;
  field_order: number;
  options?: FieldOption[];
}

export interface Step {
  id: string;
  step_number: number;
  title_key: string;
  fields: Field[];
}

export interface Package {
  value: string;
  label_key: string;
  tagline_key: string;
  description_key: string;
  price: number;
  delivery_time_key: string;
  tag?: string;
  includes?: PackageInclude[];
  steps: Step[];
}

export interface Addon {
  labelKey: string;
  price: number;
}

export type PackageData = Package;
