import { api } from '@/lib/api';
import type { 
  CookiePolicyData, 
  CookiePreferences, 
  UpdatePreferencesData, 
  UpdatePreferencesResponse 
} from '@/types/cookies';

/**
 * Fetch cookie policy content and available cookie types
 */
export const fetchCookiePolicy = async (): Promise<CookiePolicyData> => {
  try {
    const response = await api.get<CookiePolicyData>('/cookie-policy');
    return response;
  } catch (error) {
    console.error('Error fetching cookie policy:', error);
    throw new Error('Failed to fetch cookie policy');
  }
};

/**
 * Fetch current user's cookie preferences
 */
export const fetchCookiePreferences = async (): Promise<CookiePreferences> => {
  try {
    const response = await api.get<CookiePreferences>('/cookie-preferences');
    return response;
  } catch (error) {
    console.error('Error fetching cookie preferences:', error);
    throw new Error('Failed to fetch cookie preferences');
  }
};

/**
 * Update user's cookie preferences
 */
export const updateCookiePreferences = async (preferences: UpdatePreferencesData): Promise<UpdatePreferencesResponse> => {
  try {
    const response = await api.post<UpdatePreferencesResponse>('/cookie-preferences', preferences);
    return response;
  } catch (error) {
    console.error('Error updating cookie preferences:', error);
    throw new Error('Failed to update cookie preferences');
  }
};

/**
 * Reset cookie preferences to default (all false except essential)
 */
export const resetCookiePreferences = async (): Promise<UpdatePreferencesResponse> => {
  try {
    const response = await api.post<UpdatePreferencesResponse>('/cookie-preferences/reset', {});
    return response;
  } catch (error) {
    console.error('Error resetting cookie preferences:', error);
    throw new Error('Failed to reset cookie preferences');
  }
};