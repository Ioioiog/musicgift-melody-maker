
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FieldDependency {
  id: string;
  field_id: string;
  depends_on_field: string;
  condition: 'equals' | 'not_equals' | 'contains' | 'not_contains';
  condition_value: string;
  is_active: boolean;
}

export const useFieldDependencies = (packageValue: string) => {
  return useQuery({
    queryKey: ['field-dependencies', packageValue],
    queryFn: async () => {
      if (!packageValue) return [];

      const { data: packageInfo, error: packageError } = await supabase
        .from('package_info')
        .select('id')
        .eq('value', packageValue)
        .single();

      if (packageError) throw packageError;

      const { data: steps, error: stepsError } = await supabase
        .from('steps')
        .select(`
          id,
          fields:step_fields(
            id,
            field_name,
            dependencies:field_dependencies(*)
          )
        `)
        .eq('package_id', packageInfo.id)
        .eq('is_active', true);

      if (stepsError) throw stepsError;

      // Flatten dependencies from all fields
      const dependencies: FieldDependency[] = [];
      steps.forEach(step => {
        step.fields.forEach((field: any) => {
          field.dependencies.forEach((dep: any) => {
            dependencies.push({
              ...dep,
              field_id: field.id,
              target_field: field.field_name
            });
          });
        });
      });

      return dependencies;
    },
    enabled: !!packageValue
  });
};

export const evaluateFieldDependency = (
  dependency: FieldDependency,
  formData: any
): boolean => {
  const fieldValue = formData[dependency.depends_on_field];
  const conditionValue = dependency.condition_value;

  switch (dependency.condition) {
    case 'equals':
      return fieldValue === conditionValue;
    case 'not_equals':
      return fieldValue !== conditionValue;
    case 'contains':
      return Array.isArray(fieldValue) 
        ? fieldValue.includes(conditionValue)
        : String(fieldValue || '').includes(conditionValue);
    case 'not_contains':
      return Array.isArray(fieldValue)
        ? !fieldValue.includes(conditionValue)
        : !String(fieldValue || '').includes(conditionValue);
    default:
      return true;
  }
};

export const shouldShowField = (
  fieldName: string,
  dependencies: FieldDependency[],
  formData: any
): boolean => {
  const fieldDependencies = dependencies.filter(dep => 
    dep.target_field === fieldName && dep.is_active
  );

  if (fieldDependencies.length === 0) return true;

  // All dependencies must be satisfied for the field to show
  return fieldDependencies.every(dep => evaluateFieldDependency(dep, formData));
};
