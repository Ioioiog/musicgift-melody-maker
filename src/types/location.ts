
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
  postalCode?: string;
  utcOffset?: string;
  isp?: string;
  accuracyRadius?: number;
  languages?: string[];
}

export interface LocationContextType {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  refreshLocation: () => Promise<void>;
  timezone: string | null;
  localTime: Date | null;
}

export interface LocationProvider {
  name: string;
  url: string;
  transform: (data: any) => LocationData;
  priority: number;
  rateLimit: {
    requests: number;
    period: string;
  };
}
