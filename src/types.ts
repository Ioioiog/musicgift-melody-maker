
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

export interface PackageTag {
  id: string;
  tag_type: string;
  tag_label_key?: string;
  styling_class?: string;
}

export interface Package {
  id?: string;
  value: string;
  label_key: string;
  tagline_key: string;
  description_key: string;
  price_ron: number;
  price_eur: number;
  delivery_time_key: string;
  tag?: string;
  includes?: PackageInclude[];
  available_addons: string[];
  steps: Step[];
}

export interface Addon {
  id?: string;
  addon_key: string;
  label_key: string;
  description_key: string;
  price_ron: number;
  price_eur: number;
  is_active?: boolean;
  trigger_field_type?: any;
  trigger_field_config?: any;
  trigger_condition?: string;
  trigger_condition_value?: string;
}

export type PackageData = Package;
