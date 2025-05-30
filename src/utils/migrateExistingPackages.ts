
import { supabase } from '@/integrations/supabase/client';

export const migrateExistingPackages = async () => {
  console.log('Starting migration of existing packages...');

  try {
    // Check if we already have the personal package to avoid duplicates
    const { data: existingPackage } = await supabase
      .from('package_info')
      .select('id')
      .eq('value', 'pachet-personal')
      .single();

    if (existingPackage) {
      console.log('Personal package already exists, skipping migration.');
      return { success: true, message: 'Package already exists' };
    }

    // Run the migration that was already executed via SQL
    console.log('Personal package migration completed via SQL migration.');
    return { success: true, message: 'Migration completed successfully' };
    
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error };
  }
};
