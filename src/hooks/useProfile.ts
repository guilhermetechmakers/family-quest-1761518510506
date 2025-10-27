import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/users';
import { familiesApi } from '@/api/families';
import { paymentsApi } from '@/api/payments';
import { securityApi } from '@/api/security';
import { toast } from 'sonner';

// Query keys
export const profileKeys = {
  user: ['profile', 'user'] as const,
  family: ['profile', 'family'] as const,
  paymentMethods: ['profile', 'payment-methods'] as const,
  transactions: ['profile', 'transactions'] as const,
  security: ['profile', 'security'] as const,
};

// User profile hooks
export const useUserProfile = () => {
  return useQuery({
    queryKey: profileKeys.user,
    queryFn: usersApi.getCurrent,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(profileKeys.user, updatedUser);
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to update profile: ${error.response?.data?.message || error.message}`);
    },
  });
};

// Family management hooks
export const useFamily = () => {
  return useQuery({
    queryKey: profileKeys.family,
    queryFn: familiesApi.getCurrent,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useInviteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: familiesApi.inviteMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.family });
      toast.success('Invitation sent successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to send invitation: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ familyId, userId }: { familyId: string; userId: string }) =>
      familiesApi.removeMember(familyId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.family });
      toast.success('Member removed successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to remove member: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useUpdateMemberPermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ familyId, userId, permissions }: { familyId: string; userId: string; permissions: any }) =>
      familiesApi.updateMemberPermissions(familyId, userId, permissions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.family });
      toast.success('Permissions updated successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to update permissions: ${error.response?.data?.message || error.message}`);
    },
  });
};

// Payment methods hooks
export const usePaymentMethods = () => {
  return useQuery({
    queryKey: profileKeys.paymentMethods,
    queryFn: paymentsApi.getPaymentMethods,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAddPaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentsApi.createPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.paymentMethods });
      toast.success('Payment method added successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to add payment method: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useUpdatePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentsApi.savePaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.paymentMethods });
      toast.success('Payment method updated successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to update payment method: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentsApi.deletePaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.paymentMethods });
      toast.success('Payment method removed successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to remove payment method: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useSetDefaultPaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentsApi.savePaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.paymentMethods });
      toast.success('Default payment method updated!');
    },
    onError: (error: any) => {
      toast.error(`Failed to set default payment method: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useTransactions = (params?: { limit?: number; offset?: number; goal_id?: string; type?: string }) => {
  return useQuery({
    queryKey: [...profileKeys.transactions, params],
    queryFn: () => paymentsApi.getPaymentHistory(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Security hooks
export const useSecuritySettings = () => {
  return useQuery({
    queryKey: profileKeys.security,
    queryFn: securityApi.getSecuritySettings,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: securityApi.changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to change password: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useEnable2FA = () => {
  return useMutation({
    mutationFn: securityApi.enable2FA,
    onSuccess: () => {
      toast.success('2FA setup initiated! Scan the QR code with your authenticator app.');
    },
    onError: (error: any) => {
      toast.error(`Failed to enable 2FA: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useVerify2FA = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: securityApi.verify2FA,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.security });
      toast.success('2FA enabled successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to verify 2FA: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useDisable2FA = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: securityApi.disable2FA,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.security });
      toast.success('2FA disabled successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to disable 2FA: ${error.response?.data?.message || error.message}`);
    },
  });
};