import { api } from '../lib/api';
import type { SecuritySettings } from '@/types/payment';

export const securityApi = {
  // Get security settings
  getSecuritySettings: async (): Promise<SecuritySettings> => {
    const response = await api.get<SecuritySettings>('/security/settings');
    return response;
  },

  // Change password
  changePassword: async (data: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }): Promise<void> => {
    await api.post('/security/change-password', data);
  },

  // Enable 2FA
  enable2FA: async (): Promise<{ qr_code: string; backup_codes: string[] }> => {
    const response = await api.post<{ qr_code: string; backup_codes: string[] }>('/security/2fa/enable', {});
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
};