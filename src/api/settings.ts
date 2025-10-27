import { api } from '../lib/api';
import type { User, UserPreferences } from '@/types/user';
import type { Family, FamilySettings } from '@/types/family';

// Settings API for managing user and family preferences
export const settingsApi = {
  // User Account Settings
  updateProfile: async (updates: {
    full_name?: string;
    avatar_url?: string;
  }): Promise<User> => {
    const response = await api.put<User>('/users/profile', updates);
    return response;
  },

  updatePreferences: async (preferences: Partial<UserPreferences>): Promise<User> => {
    const response = await api.put<User>('/users/preferences', { preferences });
    return response;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.post('/users/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },

  enable2FA: async (): Promise<{ qr_code: string; secret: string }> => {
    const response = await api.post<{ qr_code: string; secret: string }>('/users/2fa/enable', {});
    return response;
  },

  disable2FA: async (code: string): Promise<void> => {
    await api.post('/users/2fa/disable', { code });
  },

  verify2FA: async (code: string): Promise<void> => {
    await api.post('/users/2fa/verify', { code });
  },

  // Family Settings
  updateFamilySettings: async (familyId: string, settings: Partial<FamilySettings>): Promise<Family> => {
    const response = await api.put<Family>(`/families/${familyId}/settings`, settings);
    return response;
  },

  generateInviteLink: async (familyId: string, role: 'child' | 'guest'): Promise<{ invite_link: string }> => {
    const response = await api.post<{ invite_link: string }>(`/families/${familyId}/invite-link`, { role });
    return response;
  },

  // Notifications
  updateNotificationPreferences: async (preferences: {
    email_notifications: boolean;
    push_notifications: boolean;
    in_app_notifications: boolean;
    digest_frequency: 'daily' | 'weekly' | 'never';
  }): Promise<void> => {
    await api.put('/users/notification-preferences', preferences);
  },

  // Payment & Billing
  getBillingInfo: async (): Promise<{
    subscription_plan: string;
    billing_history: any[];
    payment_methods: any[];
  }> => {
    const response = await api.get<{
      subscription_plan: string;
      billing_history: any[];
      payment_methods: any[];
    }>('/billing/info');
    return response;
  },

  updatePaymentMethod: async (paymentMethodId: string): Promise<void> => {
    await api.put('/billing/payment-method', { payment_method_id: paymentMethodId });
  },

  cancelSubscription: async (): Promise<void> => {
    await api.post('/billing/cancel-subscription', {});
  },

  // Privacy & Data
  exportUserData: async (): Promise<{ download_url: string }> => {
    const response = await api.post<{ download_url: string }>('/privacy/export-data', {});
    return response;
  },

  deleteAccount: async (password: string): Promise<void> => {
    await api.post('/privacy/delete-account', { password });
  },

  updateDataSharingPreferences: async (preferences: {
    analytics: boolean;
    marketing: boolean;
    third_party: boolean;
  }): Promise<void> => {
    await api.put('/privacy/data-sharing', preferences);
  },
};