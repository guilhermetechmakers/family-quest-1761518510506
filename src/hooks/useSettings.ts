import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { settingsApi } from '@/api/settings';
import { usersApi } from '@/api/users';
import { familiesApi } from '@/api/families';

// Query keys for settings
export const settingsKeys = {
  all: ['settings'] as const,
  profile: () => [...settingsKeys.all, 'profile'] as const,
  family: () => [...settingsKeys.all, 'family'] as const,
  billing: () => [...settingsKeys.all, 'billing'] as const,
  notifications: () => [...settingsKeys.all, 'notifications'] as const,
};

// User Profile Settings
export function useProfile() {
  return useQuery({
    queryKey: settingsKeys.profile(),
    queryFn: usersApi.getCurrent,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: settingsApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.profile() });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: settingsApi.updatePreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.profile() });
      toast.success('Preferences updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update preferences');
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      settingsApi.changePassword(currentPassword, newPassword),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to change password');
    },
  });
}

export function use2FA() {
  const queryClient = useQueryClient();
  
  const enable2FA = useMutation({
    mutationFn: settingsApi.enable2FA,
    onSuccess: () => {
      toast.success('2FA setup initiated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to enable 2FA');
    },
  });

  const disable2FA = useMutation({
    mutationFn: settingsApi.disable2FA,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.profile() });
      toast.success('2FA disabled successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to disable 2FA');
    },
  });

  const verify2FA = useMutation({
    mutationFn: settingsApi.verify2FA,
    onSuccess: () => {
      toast.success('2FA verified successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to verify 2FA code');
    },
  });

  return { enable2FA, disable2FA, verify2FA };
}

// Family Settings
export function useFamily() {
  return useQuery({
    queryKey: settingsKeys.family(),
    queryFn: familiesApi.getCurrent,
  });
}

export function useUpdateFamilySettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ familyId, settings }: { familyId: string; settings: any }) =>
      settingsApi.updateFamilySettings(familyId, settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.family() });
      toast.success('Family settings updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update family settings');
    },
  });
}

export function useGenerateInviteLink() {
  return useMutation({
    mutationFn: ({ familyId, role }: { familyId: string; role: 'child' | 'guest' }) =>
      settingsApi.generateInviteLink(familyId, role),
    onSuccess: (data) => {
      navigator.clipboard.writeText(data.invite_link);
      toast.success('Invite link copied to clipboard');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to generate invite link');
    },
  });
}

// Notifications
export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: settingsApi.updateNotificationPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.notifications() });
      toast.success('Notification preferences updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update notification preferences');
    },
  });
}

// Billing
export function useBillingInfo() {
  return useQuery({
    queryKey: settingsKeys.billing(),
    queryFn: settingsApi.getBillingInfo,
  });
}

export function useUpdatePaymentMethod() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: settingsApi.updatePaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.billing() });
      toast.success('Payment method updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update payment method');
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: settingsApi.cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.billing() });
      toast.success('Subscription cancelled');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to cancel subscription');
    },
  });
}

// Privacy & Data
export function useExportData() {
  return useMutation({
    mutationFn: settingsApi.exportUserData,
    onSuccess: (data) => {
      window.open(data.download_url, '_blank');
      toast.success('Data export initiated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to export data');
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ password }: { password: string }) =>
      settingsApi.deleteAccount(password),
    onSuccess: () => {
      queryClient.clear();
      toast.success('Account deleted successfully');
      // Redirect to landing page
      window.location.href = '/';
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete account');
    },
  });
}

export function useUpdateDataSharingPreferences() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: settingsApi.updateDataSharingPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.profile() });
      toast.success('Data sharing preferences updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update data sharing preferences');
    },
  });
}