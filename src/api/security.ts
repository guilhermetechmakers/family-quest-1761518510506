import { api } from '../lib/api';
import type { SecuritySettings } from '@/types/admin';

export const securityApi = {
  // Get security settings
  getSecuritySettings: async (): Promise<SecuritySettings> => {
    const response = await api.get<SecuritySettings>('/security/settings');
    return response;
  },

  // Request password reset
  requestPasswordReset: async (email: string): Promise<void> => {
    await api.post('/security/forgot-password', { email });
  },

  // Reset password with token
  resetPassword: async (data: {
    token: string;
    new_password: string;
    confirm_password: string;
  }): Promise<void> => {
    await api.post('/security/reset-password', data);
  },

  // Change password (authenticated user)
  changePassword: async (data: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }): Promise<void> => {
    await api.post('/security/change-password', data);
  },

  // Validate password strength
  validatePasswordStrength: async (password: string): Promise<{
    score: number;
    feedback: string[];
    is_strong: boolean;
  }> => {
    const response = await api.post<{
      score: number;
      feedback: string[];
      is_strong: boolean;
    }>('/security/validate-password', { password });
    return response;
  },

  // Enable 2FA
  enable2FA: async (): Promise<{ qr_code: string; backup_codes: string[]; secret: string }> => {
    const response = await api.post<{ qr_code: string; backup_codes: string[]; secret: string }>('/security/2fa/enable', {});
    return response;
  },

  // Verify 2FA setup
  verify2FA: async (code: string): Promise<void> => {
    return api.post('/security/2fa/verify', { code });
  },

  // Disable 2FA
  disable2FA: async (password: string): Promise<void> => {
    return api.post('/security/2fa/disable', { password });
  },

  // Generate new backup codes
  generateBackupCodes: async (): Promise<string[]> => {
    const response = await api.post<string[]>('/security/2fa/backup-codes', {});
    return response;
  },

  // Get 2FA status
  get2FAStatus: async (): Promise<{ enabled: boolean; backup_codes_count: number }> => {
    const response = await api.get<{ enabled: boolean; backup_codes_count: number }>('/security/2fa/status');
    return response;
  },
};