
interface ValidationIssue {
  type: 'error' | 'warning' | 'suggestion';
  field: string;
  message: string;
  suggestion?: string;
}

const VALID_FIELD_TYPES = [
  'text', 'email', 'tel', 'textarea', 'select', 'checkbox', 
  'checkbox-group', 'date', 'url', 'file', 'audio-recorder'
];

const VALID_TAG_TYPES = ['popular', 'hot', 'discount', 'new', 'limited'];

const COMMON_FIELD_TYPE_MISSPELLINGS = {
  'textare': 'textarea',
  'audio_recorder': 'audio-recorder',
  'checkbox_group': 'checkbox-group',
  'texte': 'text',
  'selecte': 'select'
};

export const validatePackageData = (packageData: any): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];

  // Validate package info
  if (!packageData.value) {
    issues.push({
      type: 'error',
      field: 'value',
      message: 'Package value is required'
    });
  } else {
    // Check for inconsistent package value patterns
    if (packageData.value.includes('-') && packageData.value.startsWith('pachet-')) {
      issues.push({
        type: 'suggestion',
        field: 'value',
        message: 'Package value uses Romanian prefix "pachet-"',
        suggestion: 'Consider using English naming: "' + packageData.value.replace('pachet-', '') + '"'
      });
    }
    
    // Check for mixed language naming
    if (packageData.value.includes('pachet') || packageData.value.includes('Pachet')) {
      issues.push({
        type: 'suggestion',
        field: 'value',
        message: 'Mixed language naming detected',
        suggestion: 'Consider standardizing to English package names'
      });
    }
  }

  if (!packageData.label_key) {
    issues.push({
      type: 'error',
      field: 'label_key',
      message: 'Package label key is required'
    });
  } else {
    // Check for missing translation key patterns
    if (!packageData.label_key.includes('Package') && !packageData.label_key.includes('package')) {
      issues.push({
        type: 'suggestion',
        field: 'label_key',
        message: 'Label key might benefit from standardized naming',
        suggestion: 'Consider using pattern like "packageNameLabel" or "package.name.label"'
      });
    }
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
      
      // Check for missing tag labels
      if (!tag.tag_label_key) {
        issues.push({
          type: 'warning',
          field: `tags[${index}].tag_label_key`,
          message: 'Tag missing label key',
          suggestion: 'Add a label key for better translation support'
        });
      }
    });
  } else {
    // Suggest adding tags for better marketing
    issues.push({
      type: 'suggestion',
      field: 'tags',
      message: 'Package has no tags',
      suggestion: 'Consider adding marketing tags like "popular", "new", or "discount"'
    });
  }

  // Validate includes
  if (!packageData.includes || packageData.includes.length === 0) {
    issues.push({
      type: 'suggestion',
      field: 'includes',
      message: 'Package has no includes listed',
      suggestion: 'Consider adding what\'s included in this package for better user understanding'
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

      // Check for step ordering issues
      if (step.step_number !== stepIndex + 1) {
        issues.push({
          type: 'warning',
          field: `steps[${stepIndex}].step_number`,
          message: `Step number (${step.step_number}) doesn't match expected sequence (${stepIndex + 1})`,
          suggestion: 'Ensure step numbers are sequential starting from 1'
        });
      }

      if (step.fields) {
        step.fields.forEach((field: any, fieldIndex: number) => {
          // Check for common field type misspellings
          if (COMMON_FIELD_TYPE_MISSPELLINGS[field.field_type]) {
            issues.push({
              type: 'error',
              field: `steps[${stepIndex}].fields[${fieldIndex}].field_type`,
              message: `Common misspelling detected: "${field.field_type}"`,
              suggestion: `Should be: "${COMMON_FIELD_TYPE_MISSPELLINGS[field.field_type]}"`
            });
          }
          
          // Validate field type
          else if (!VALID_FIELD_TYPES.includes(field.field_type)) {
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

          // Check for field ordering issues
          if (field.field_order !== fieldIndex + 1) {
            issues.push({
              type: 'warning',
              field: `steps[${stepIndex}].fields[${fieldIndex}].field_order`,
              message: `Field order (${field.field_order}) doesn't match expected sequence (${fieldIndex + 1})`,
              suggestion: 'Ensure field orders are sequential starting from 1'
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

          // Suggest placeholders for input fields
          if (['text', 'email', 'tel', 'textarea'].includes(field.field_type) && !field.placeholder_key) {
            issues.push({
              type: 'suggestion',
              field: `steps[${stepIndex}].fields[${fieldIndex}].placeholder_key`,
              message: 'Field missing placeholder',
              suggestion: 'Consider adding a placeholder key for better user experience'
            });
          }
        });
      }
    });
  } else {
    // Suggest adding steps for package completion
    issues.push({
      type: 'suggestion',
      field: 'steps',
      message: 'Package has no steps defined',
      suggestion: 'Add steps to guide users through the ordering process'
    });
  }

  // Check for missing description or tagline
  if (!packageData.description_key) {
    issues.push({
      type: 'suggestion',
      field: 'description_key',
      message: 'Package missing description',
      suggestion: 'Add a description key for better package explanation'
    });
  }

  if (!packageData.tagline_key) {
    issues.push({
      type: 'suggestion',
      field: 'tagline_key',
      message: 'Package missing tagline',
      suggestion: 'Add a catchy tagline for marketing appeal'
    });
  }

  if (!packageData.delivery_time_key) {
    issues.push({
      type: 'suggestion',
      field: 'delivery_time_key',
      message: 'Package missing delivery time information',
      suggestion: 'Add delivery time for customer expectations'
    });
  }

  return issues;
};

export const getIssueSummary = (issues: ValidationIssue[]) => {
  const errors = issues.filter(issue => issue.type === 'error').length;
  const warnings = issues.filter(issue => issue.type === 'warning').length;
  const suggestions = issues.filter(issue => issue.type === 'suggestion').length;
  
  return {
    total: issues.length,
    errors,
    warnings,
    suggestions,
    hasIssues: issues.length > 0,
    hasErrors: errors > 0,
    hasWarnings: warnings > 0,
    hasSuggestions: suggestions > 0
  };
};
