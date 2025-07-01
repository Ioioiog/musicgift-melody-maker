
import { useState, useEffect } from 'react';
import { getRegionConfig, getCurrentRegionConfig, type RegionConfig } from '@/utils/regionConfig';

export function useRegionConfig() {
  const [regionConfig, setRegionConfig] = useState<RegionConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const config = getCurrentRegionConfig();
      setRegionConfig(config);
    } catch (error) {
      console.error('Error getting region config:', error);
      // Fallback to EU config
      setRegionConfig(getRegionConfig('musicgift.eu'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    regionConfig,
    isLoading,
    isDomainRo: regionConfig?.domain === 'musicgift.ro',
    isDomainEu: regionConfig?.domain === 'musicgift.eu',
    isDomainUs: regionConfig?.domain === 'musicgift.us'
  };
}
