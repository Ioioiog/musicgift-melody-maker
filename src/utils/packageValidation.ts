
interface ValidationIssue {
  type: 'error' | 'warning';
  field: string;
  message: string;
  suggestion?: string;
}

const VALID_FIELD_TYPES = [
  'text', 'email', 'tel', 'textarea', 'select', 'checkbox', 
  'checkbox-group', 'date', 'url', 'file', 'audio-recorder'
];

const VALID_TAG_TYPES = ['popular', 'hot', 'discount', 'new', 'limited'];

export const validatePackageData = (packageData: any): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];

  // Validate package info
  if (!packageData.value) {
    issues.push({
      type: 'error',
      field: 'value',
      message: 'Package value is required'
    });
  }

  if (!packageData.label_key) {
    issues.push({
      type: 'error',
      field: 'label_key',
      message: 'Package label key is required'
    });
  }

  if (typeof packageData.price !== 'number') {
    issues.push({
      type: 'error',
      field: 'price',
      message: 'Package price must be a number'
    });
  }

  // Validate tags
  if (packageData.tags) {
    packageData.tags.forEach((tag: any, index: number) => {
      if (!VALID_TAG_TYPES.includes(tag.tag_type)) {
        issues.push({
          type: 'error',
          field: `tags[${index}].tag_type`,
          message: `Invalid tag type: ${tag.tag_type}`,
          suggestion: `Must be one of: ${VALID_TAG_TYPES.join(', ')}`
        });
      }
    });
  }

  // Validate steps and fields
  if (packageData.steps) {
    packageData.steps.forEach((step: any, stepIndex: number) => {
      if (!step.title_key) {
        issues.push({
          type: 'error',
          field: `steps[${stepIndex}].title_key`,
          message: 'Step title key is required'
        });
      }

      if (step.fields) {
        step.fields.forEach((field: any, fieldIndex: number) => {
          // Validate field type
          if (!VALID_FIELD_TYPES.includes(field.field_type)) {
            issues.push({
              type: 'error',
              field: `steps[${stepIndex}].fields[${fieldIndex}].field_type`,
              message: `Invalid field type: ${field.field_type}`,
              suggestion: `Must be one of: ${VALID_FIELD_TYPES.join(', ')}`
            });
          }

          // Validate field name
          if (!field.field_name) {
            issues.push({
              type: 'error',
              field: `steps[${stepIndex}].fields[${fieldIndex}].field_name`,
              message: 'Field name is required'
            });
          }

          // Validate select field options
          if (field.field_type === 'select' && field.options) {
            if (Array.isArray(field.options)) {
              const hasInvalidOptions = field.options.some((option: any) => 
                typeof option === 'string' || !option.value || !option.label_key
              );
              
              if (hasInvalidOptions) {
                issues.push({
                  type: 'warning',
                  field: `steps[${stepIndex}].fields[${fieldIndex}].options`,
                  message: 'Select field options should be objects with value and label_key properties',
                  suggestion: 'Format: [{"value": "option1", "label_key": "optionLabel1"}]'
                });
              }
            }
          }
        });
      }
    });
  }

  return issues;
};

export const getIssueSummary = (issues: ValidationIssue[]) => {
  const errors = issues.filter(issue => issue.type === 'error').length;
  const warnings = issues.filter(issue => issue.type === 'warning').length;
  
  return {
    total: issues.length,
    errors,
    warnings,
    hasIssues: issues.length > 0
  };
};
