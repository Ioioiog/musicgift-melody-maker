
import { supabase } from '@/integrations/supabase/client';
import { packages, addons } from '@/data/packages';

export const migratePackageData = async () => {
  console.log('Starting package data migration...');

  try {
    // 1. Migrate packages
    const packageInserts = packages.map(pkg => ({
      value: pkg.value,
      label_key: pkg.labelKey,
      price: pkg.price,
      tagline_key: pkg.taglineKey,
      description_key: pkg.descriptionKey,
      delivery_time_key: pkg.details.deliveryTimeKey
    }));

    const { data: insertedPackages, error: packageError } = await supabase
      .from('package_info')
      .insert(packageInserts)
      .select();

    if (packageError) throw packageError;
    console.log('Packages migrated:', insertedPackages);

    // 2. Migrate package includes
    for (const pkg of packages) {
      const packageRecord = insertedPackages?.find(p => p.value === pkg.value);
      if (packageRecord && pkg.details?.includesKeys) {
        const includeInserts = pkg.details.includesKeys.map((includeKey, index) => ({
          package_id: packageRecord.id,
          include_key: includeKey,
          include_order: index
        }));

        const { error: includesError } = await supabase
          .from('package_includes')
          .insert(includeInserts);

        if (includesError) throw includesError;
      }
    }

    // 3. Migrate addons
    const addonInserts = Object.entries(addons).map(([key, addon]) => ({
      addon_key: key,
      label_key: addon.labelKey,
      price: addon.price
    }));

    const { data: insertedAddons, error: addonError } = await supabase
      .from('addons')
      .insert(addonInserts)
      .select();

    if (addonError) throw addonError;
    console.log('Addons migrated:', insertedAddons);

    // 4. Migrate package tags (add popular tag for premium)
    const premiumPackage = insertedPackages?.find(p => p.value === 'premium');
    if (premiumPackage) {
      await supabase
        .from('package_tags')
        .insert({
          package_id: premiumPackage.id,
          tag_type: 'popular',
          tag_label_key: 'mostPopular',
          styling_class: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
        });
    }

    // 5. Migrate steps configuration
    const stepConfigs = [
      // Personal package steps
      {
        packageValue: 'personal',
        steps: [
          {
            step_number: 1,
            title_key: 'choosePackage',
            fields: [
              { field_name: 'package', field_type: 'select', placeholder_key: 'choosePackage', required: true }
            ]
          },
          {
            step_number: 2,
            title_key: 'generalDetails',
            fields: [
              { field_name: 'recipientName', field_type: 'text', placeholder_key: 'recipientName', required: true },
              { field_name: 'relationship', field_type: 'select', placeholder_key: 'relationship', required: true },
              { field_name: 'occasion', field_type: 'select', placeholder_key: 'occasion', required: true },
              { field_name: 'eventDate', field_type: 'date', placeholder_key: 'eventDate', required: false },
              { field_name: 'songLanguage', field_type: 'select', placeholder_key: 'songLanguage', required: true },
              { field_name: 'pronunciationAudio_recipient', field_type: 'file', placeholder_key: 'pronunciationAudioRecipient', required: false }
            ]
          },
          {
            step_number: 3,
            title_key: 'storyAndEmotionalDetails',
            fields: [
              { field_name: 'story', field_type: 'textarea', placeholder_key: 'story', required: true },
              { field_name: 'emotionalTone', field_type: 'select', placeholder_key: 'emotionalTone', required: true },
              { field_name: 'keyMoments', field_type: 'textarea', placeholder_key: 'keyMoments', required: true },
              { field_name: 'specialWords', field_type: 'textarea', placeholder_key: 'specialWords', required: false },
              { field_name: 'pronunciationAudio_keywords', field_type: 'file', placeholder_key: 'pronunciationAudioKeywords', required: false }
            ]
          },
          {
            step_number: 4,
            title_key: 'musicalPreferences',
            fields: [
              { field_name: 'musicStyle', field_type: 'select', placeholder_key: 'musicStyle', required: true },
              { field_name: 'referenceSong', field_type: 'url', placeholder_key: 'referenceSong', required: false },
              { field_name: 'addons', field_type: 'checkbox-group', options: ['rushDelivery', 'commercialRights', 'distributionMangoRecords', 'customVideo', 'audioMessageFromSender', 'extendedSong'] }
            ]
          },
          {
            step_number: 5,
            title_key: 'confirmation',
            fields: [
              { field_name: 'fullName', field_type: 'text', placeholder_key: 'fullName', required: true },
              { field_name: 'email', field_type: 'email', placeholder_key: 'email', required: true },
              { field_name: 'phone', field_type: 'tel', placeholder_key: 'phone', required: false },
              { field_name: 'acceptMentionObligation', field_type: 'checkbox', placeholder_key: 'acceptMentionObligation', required: true }
            ]
          }
        ]
      },
      // Premium package steps
      {
        packageValue: 'premium',
        steps: [
          {
            step_number: 1,
            title_key: 'choosePackage',
            fields: [
              { field_name: 'package', field_type: 'select', placeholder_key: 'choosePackage', required: true }
            ]
          },
          {
            step_number: 2,
            title_key: 'generalDetails',
            fields: [
              { field_name: 'recipientName', field_type: 'text', placeholder_key: 'recipientName', required: true },
              { field_name: 'relationship', field_type: 'select', placeholder_key: 'relationship', required: true },
              { field_name: 'occasion', field_type: 'select', placeholder_key: 'occasion', required: true },
              { field_name: 'eventDate', field_type: 'date', placeholder_key: 'eventDate', required: false },
              { field_name: 'songLanguage', field_type: 'select', placeholder_key: 'songLanguage', required: true },
              { field_name: 'pronunciationAudio_recipient', field_type: 'file', placeholder_key: 'pronunciationAudioRecipient', required: false }
            ]
          },
          {
            step_number: 3,
            title_key: 'storyAndEmotionalDetails',
            fields: [
              { field_name: 'story', field_type: 'textarea', placeholder_key: 'story', required: true },
              { field_name: 'emotionalTone', field_type: 'select', placeholder_key: 'emotionalTone', required: true },
              { field_name: 'keyMoments', field_type: 'textarea', placeholder_key: 'keyMoments', required: true },
              { field_name: 'specialWords', field_type: 'textarea', placeholder_key: 'specialWords', required: false },
              { field_name: 'pronunciationAudio_keywords', field_type: 'file', placeholder_key: 'pronunciationAudioKeywords', required: false }
            ]
          },
          {
            step_number: 4,
            title_key: 'musicalPreferences',
            fields: [
              { field_name: 'musicStyle', field_type: 'select', placeholder_key: 'musicStyle', required: true },
              { field_name: 'referenceSong', field_type: 'url', placeholder_key: 'referenceSong', required: false },
              { field_name: 'addons', field_type: 'checkbox-group', options: ['rushDelivery', 'customVideo', 'audioMessageFromSender', 'extendedSong'] }
            ]
          },
          {
            step_number: 5,
            title_key: 'confirmation',
            fields: [
              { field_name: 'fullName', field_type: 'text', placeholder_key: 'fullName', required: true },
              { field_name: 'email', field_type: 'email', placeholder_key: 'email', required: true },
              { field_name: 'phone', field_type: 'tel', placeholder_key: 'phone', required: false },
              { field_name: 'acceptMentionObligation', field_type: 'checkbox', placeholder_key: 'acceptMentionObligation', required: true },
              { field_name: 'acceptDistribution', field_type: 'checkbox', placeholder_key: 'acceptDistribution', required: true },
              { field_name: 'finalNote', field_type: 'checkbox', placeholder_key: 'finalNote', required: true }
            ]
          }
        ]
      }
    ];

    // Insert steps and fields
    for (const config of stepConfigs) {
      const packageRecord = insertedPackages?.find(p => p.value === config.packageValue);
      if (!packageRecord) continue;

      for (const stepConfig of config.steps) {
        const { data: insertedStep, error: stepError } = await supabase
          .from('steps')
          .insert({
            package_id: packageRecord.id,
            step_number: stepConfig.step_number,
            title_key: stepConfig.title_key,
            step_order: stepConfig.step_number
          })
          .select()
          .single();

        if (stepError) throw stepError;

        // Insert fields for this step
        for (const [index, field] of stepConfig.fields.entries()) {
          await supabase
            .from('step_fields')
            .insert({
              step_id: insertedStep.id,
              field_name: field.field_name,
              field_type: field.field_type,
              placeholder_key: field.placeholder_key,
              required: field.required,
              field_order: index,
              options: field.options ? JSON.stringify(field.options) : null
            });
        }
      }
    }

    console.log('Migration completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error };
  }
};
