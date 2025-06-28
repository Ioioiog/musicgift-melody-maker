
export interface LocationData {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  timezone: string;
  currency: string;
  latitude?: number;
  longitude?: number;
}

export interface LocationContextType {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  refreshLocation: () => Promise<void>;
}
