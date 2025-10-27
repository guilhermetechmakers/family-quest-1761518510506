export interface CookieType {
  id: string;
  name: string;
  purpose: string;
  description: string;
  category: 'essential' | 'analytics' | 'personalization' | 'marketing';
  duration: string;
  third_party: boolean;
}

export interface CookiePreferences {
  user_id: string;
  analytics_consent: boolean;
  personalization_consent: boolean;
  marketing_consent: boolean;
  essential_consent: boolean; // Always true, cannot be disabled
  updated_at: string;
}

export interface CookiePolicyData {
  cookie_types: CookieType[];
  last_updated: string;
  version: string;
}

export interface UpdatePreferencesData {
  analytics_consent: boolean;
  personalization_consent: boolean;
  marketing_consent: boolean;
}

export interface UpdatePreferencesResponse {
  success: boolean;
  message: string;
  preferences: CookiePreferences;
}