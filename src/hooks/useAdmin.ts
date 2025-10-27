import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/admin';
import type {
  CreateBroadcastMessageInput,
  UserSearchFilters,
  TransactionFilters,
  ModerationFilters,
} from '@/types/admin';

// Query Keys
export const adminKeys = {
  all: ['admin'] as const,
  dashboard: () => [...adminKeys.all, 'dashboard'] as const,
  stats: () => [...adminKeys.dashboard(), 'stats'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
  user: (id: string) => [...adminKeys.users(), id] as const,
  userAuditLogs: (id: string) => [...adminKeys.user(id), 'audit-logs'] as const,
  moderation: () => [...adminKeys.all, 'moderation'] as const,
  transactions: () => [...adminKeys.all, 'transactions'] as const,
  transaction: (id: string) => [...adminKeys.transactions(), id] as const,
  analytics: (period: string) => [...adminKeys.all, 'analytics', period] as const,
  broadcastMessages: () => [...adminKeys.all, 'broadcast-messages'] as const,
  systemHealth: () => [...adminKeys.all, 'system-health'] as const,
};

// Dashboard Stats
export function useAdminDashboardStats() {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: adminApi.getDashboardStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// User Management
export function useAdminUsers(filters?: UserSearchFilters) {
  return useQuery({
    queryKey: [...adminKeys.users(), filters],
    queryFn: () => adminApi.getUsers(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: adminKeys.user(id),
    queryFn: () => adminApi.getUserById(id),
    enabled: !!id,
  });
}

export function useUserAuditLogs(id: string) {
  return useQuery({
    queryKey: adminKeys.userAuditLogs(id),
    queryFn: () => adminApi.getUserAuditLogs(id),
    enabled: !!id,
  });
}

export function useSuspendUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminApi.suspendUser(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
}

export function useUnsuspendUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => adminApi.unsuspendUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
}

export function useResetUserPassword() {
  return useMutation({
    mutationFn: (id: string) => adminApi.resetUserPassword(id),
  });
}

// Content Moderation
export function useModerationQueue(filters?: ModerationFilters) {
  return useQuery({
    queryKey: [...adminKeys.moderation(), filters],
    queryFn: () => adminApi.getModerationQueue(filters),
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}

export function useModerateContent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, action, notes }: { id: string; action: 'approve' | 'reject' | 'remove'; notes?: string }) =>
      adminApi.moderateContent(id, action, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.moderation() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
}

// Transaction Management
export function useAdminTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: [...adminKeys.transactions(), filters],
    queryFn: () => adminApi.getTransactions(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useAdminTransaction(id: string) {
  return useQuery({
    queryKey: adminKeys.transaction(id),
    queryFn: () => adminApi.getTransactionById(id),
    enabled: !!id,
  });
}

export function useRefundTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, amount, reason }: { id: string; amount?: number; reason?: string }) =>
      adminApi.refundTransaction(id, amount, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.transactions() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
    },
  });
}

// Analytics
export function useAdminAnalytics(period: '7d' | '30d' | '90d' | '1y' = '30d') {
  return useQuery({
    queryKey: adminKeys.analytics(period),
    queryFn: () => adminApi.getAnalytics(period),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useExportAnalytics() {
  return useMutation({
    mutationFn: ({ period, format }: { period: '7d' | '30d' | '90d' | '1y'; format: 'csv' | 'pdf' }) =>
      adminApi.exportAnalytics(period, format),
  });
}

// Broadcast Messages
export function useBroadcastMessages() {
  return useQuery({
    queryKey: adminKeys.broadcastMessages(),
    queryFn: adminApi.getBroadcastMessages,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateBroadcastMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateBroadcastMessageInput) => adminApi.createBroadcastMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.broadcastMessages() });
    },
  });
}

export function useSendBroadcastMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => adminApi.sendBroadcastMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.broadcastMessages() });
    },
  });
}

export function useDeleteBroadcastMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteBroadcastMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.broadcastMessages() });
    },
  });
}

// Support Tools
export function useImpersonateUser() {
  return useMutation({
    mutationFn: (id: string) => adminApi.impersonateUser(id),
  });
}

// System Health
export function useSystemHealth() {
  return useQuery({
    queryKey: adminKeys.systemHealth(),
    queryFn: adminApi.getSystemHealth,
    refetchInterval: 1000 * 60 * 2, // 2 minutes
    staleTime: 1000 * 30, // 30 seconds
  });
}