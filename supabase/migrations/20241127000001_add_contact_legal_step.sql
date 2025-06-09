
-- Add contact details and legal acceptance step for all packages
INSERT INTO package_steps (package_value, step_number, title_key, description_key, created_at, updated_at)
VALUES 
  ('personal', 999, 'contactDetailsStep', 'Enter your contact information and accept terms', NOW(), NOW()),
  ('premium', 999, 'contactDetailsStep', 'Enter your contact information and accept terms', NOW(), NOW()),
  ('business', 999, 'contactDetailsStep', 'Enter your contact information and accept terms', NOW(), NOW()),
  ('artist', 999, 'contactDetailsStep', 'Enter your contact information and accept terms', NOW(), NOW()),
  ('remix', 999, 'contactDetailsStep', 'Enter your contact information and accept terms', NOW(), NOW()),
  ('instrumental', 999, 'contactDetailsStep', 'Enter your contact information and accept terms', NOW(), NOW()),
  ('plus', 999, 'contactDetailsStep', 'Enter your contact information and accept terms', NOW(), NOW()),
  ('wedding', 999, 'contactDetailsStep', 'Enter your contact information and accept terms', NOW(), NOW()),
  ('baptism', 999, 'contactDetailsStep', 'Enter your contact information and accept terms', NOW(), NOW()),
  ('coming-of-age', 999, 'contactDetailsStep', 'Enter your contact information and accept terms', NOW(), NOW());

-- Add fields for the contact details and legal acceptance step
DO $$
DECLARE
    step_record RECORD;
BEGIN
    -- Loop through all the contact/legal steps we just created
    FOR step_record IN 
        SELECT id FROM package_steps 
        WHERE title_key = 'contactDetailsStep' 
    LOOP
        -- Full Name field
        INSERT INTO step_fields (step_id, field_name, field_type, label_key, placeholder_key, required, field_order, created_at, updated_at)
        VALUES (step_record.id, 'fullName', 'text', 'fullNameLabel', 'fullNamePlaceholder', true, 1, NOW(), NOW());
        
        -- Email field
        INSERT INTO step_fields (step_id, field_name, field_type, label_key, placeholder_key, required, field_order, created_at, updated_at)
        VALUES (step_record.id, 'email', 'email', 'emailLabel', 'emailPlaceholder', true, 2, NOW(), NOW());
        
        -- Phone field
        INSERT INTO step_fields (step_id, field_name, field_type, label_key, placeholder_key, required, false, field_order, created_at, updated_at)
        VALUES (step_record.id, 'phone', 'tel', 'phoneLabel', 'phonePlaceholder', false, 3, NOW(), NOW());
        
        -- Accept mention obligation checkbox
        INSERT INTO step_fields (step_id, field_name, field_type, label_key, placeholder_key, required, field_order, created_at, updated_at)
        VALUES (step_record.id, 'acceptMentionObligation', 'checkbox', 'acceptMentionObligation', 'acceptMentionObligation', true, 4, NOW(), NOW());
        
        -- Accept distribution checkbox
        INSERT INTO step_fields (step_id, field_name, field_type, label_key, placeholder_key, required, field_order, created_at, updated_at)
        VALUES (step_record.id, 'acceptDistribution', 'checkbox', 'acceptDistribution', 'acceptDistribution', true, 5, NOW(), NOW());
        
        -- Accept final terms checkbox
        INSERT INTO step_fields (step_id, field_name, field_type, label_key, placeholder_key, required, field_order, created_at, updated_at)
        VALUES (step_record.id, 'finalNote', 'checkbox', 'finalNote', 'finalNote', true, 6, NOW(), NOW());
    END LOOP;
END $$;
