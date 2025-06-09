
import type { Addon } from '@/types';

export const addOns: Addon[] = [
  {
    id: "rushDelivery",
    addon_key: "rushDelivery",
    label_key: "rushDelivery",
    description_key: "rushDeliveryDesc",
    price_ron: 99,
    price_eur: 20,
    is_active: true
  },
  {
    id: "socialMediaRights",
    addon_key: "socialMediaRights",
    label_key: "socialMediaRights", 
    description_key: "socialMediaRightsDesc",
    price_ron: 0,
    price_eur: 0,
    is_active: true
  },
  {
    id: "mangoRecordsDistribution",
    addon_key: "mangoRecordsDistribution",
    label_key: "mangoRecordsDistribution",
    description_key: "mangoRecordsDistributionDesc",
    price_ron: 199,
    price_eur: 40,
    is_active: true
  },
  {
    id: "customVideo",
    addon_key: "customVideo",
    label_key: "customVideo",
    description_key: "customVideoDesc", 
    price_ron: 149,
    price_eur: 30,
    is_active: true
  },
  {
    id: "audioMessageFromSender",
    addon_key: "audioMessageFromSender",
    label_key: "audioMessageFromSender",
    description_key: "audioMessageFromSenderDesc",
    price_ron: 99,
    price_eur: 20,
    is_active: true,
    trigger_field_type: "audio-recorder",
    trigger_field_config: {
      maxDuration: 30
    }
  },
  {
    id: "brandedAudioMessage",
    addon_key: "brandedAudioMessage",
    label_key: "brandedAudioMessage",
    description_key: "brandedAudioMessageDesc",
    price_ron: 0,
    price_eur: 0,
    is_active: true,
    trigger_field_type: "audio-recorder",
    trigger_field_config: {
      maxDuration: 15
    }
  },
  {
    id: "commercialRightsUpgrade",
    addon_key: "commercialRightsUpgrade",
    label_key: "commercialRightsUpgrade",
    description_key: "commercialRightsUpgradeDesc",
    price_ron: 399,
    price_eur: 80,
    is_active: true
  },
  {
    id: "extendedSong",
    addon_key: "extendedSong",
    label_key: "extendedSong",
    description_key: "extendedSongDesc",
    price_ron: 49,
    price_eur: 10,
    is_active: true
  },
  {
    id: "godparentsMelody",
    addon_key: "godparentsMelody",
    label_key: "godparentsMelody",
    description_key: "godparentsMelodyDesc",
    price_ron: 199,
    price_eur: 40,
    is_active: true
  },
  {
    id: "separatedStems",
    addon_key: "separatedStems",
    label_key: "separatedStems",
    description_key: "separatedStemsDesc",
    price_ron: 149,
    price_eur: 30,
    is_active: true
  }
];
