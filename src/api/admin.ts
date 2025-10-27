import { api } from '../lib/api';
import type {
  AdminUser,
  AuditLog,
  ContentModeration,
  AdminTransaction,
  AnalyticsData,
  BroadcastMessage,
  CreateBroadcastMessageInput,
  AdminDashboardStats,
  UserSearchFilters,
  TransactionFilters,
  ModerationFilters,
} from '@/types/admin';

export const adminApi = {
  // Dashboard Stats
  getDashboardStats: async (): Promise<AdminDashboardStats> => {
    const response = await api.get<AdminDashboardStats>('/admin/dashboard/stats');
    return response;
  },

  // User Management
  getUsers: async (filters?: UserSearchFilters): Promise<AdminUser[]> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.role) params.append('role', filters.role);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.family_id) params.append('family_id', filters.family_id);
    if (filters?.date_from) params.append('date_from', filters.date_from);
    if (filters?.date_to) params.append('date_to', filters.date_to);

    const response = await api.get<AdminUser[]>(`/admin/users?${params.toString()}`);
    return response;
  },

  getUserById: async (id: string): Promise<AdminUser> => {
    const response = await api.get<AdminUser>(`/admin/users/${id}`);
    return response;
  },

  suspendUser: async (id: string, reason: string): Promise<void> => {
    await api.post(`/admin/users/${id}/suspend`, { reason });
  },

  unsuspendUser: async (id: string): Promise<void> => {
    await api.post(`/admin/users/${id}/unsuspend`, {});
  },

  resetUserPassword: async (id: string): Promise<{ temporary_password: string }> => {
    const response = await api.post<{ temporary_password: string }>(`/admin/users/${id}/reset-password`, {});
    return response;
  },

  getUserAuditLogs: async (id: string): Promise<AuditLog[]> => {
    const response = await api.get<AuditLog[]>(`/admin/users/${id}/audit-logs`);
    return response;
  },

  updateUserRole: async (id: string, role: 'admin' | 'parent' | 'child' | 'guest'): Promise<void> => {
    await api.patch(`/admin/users/${id}/role`, { role });
  },

  bulkUpdateUsers: async (userIds: string[], updates: { status?: 'active' | 'suspended' | 'pending' }): Promise<void> => {
    await api.post('/admin/users/bulk-update', { user_ids: userIds, updates });
  },

  // Content Moderation
  getModerationQueue: async (filters?: ModerationFilters): Promise<ContentModeration[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.content_type) params.append('content_type', filters.content_type);
    if (filters?.flag_count_min) params.append('flag_count_min', filters.flag_count_min.toString());
    if (filters?.date_from) params.append('date_from', filters.date_from);
    if (filters?.date_to) params.append('date_to', filters.date_to);

    const response = await api.get<ContentModeration[]>(`/admin/moderation?${params.toString()}`);
    return response;
  },

  moderateContent: async (
    id: string,
    action: 'approve' | 'reject' | 'remove',
    notes?: string
  ): Promise<void> => {
    await api.post(`/admin/moderation/${id}/action`, { action, notes });
  },

  // Transaction Management
  getTransactions: async (filters?: TransactionFilters): Promise<AdminTransaction[]> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.user_id) params.append('user_id', filters.user_id);
    if (filters?.goal_id) params.append('goal_id', filters.goal_id);
    if (filters?.date_from) params.append('date_from', filters.date_from);
    if (filters?.date_to) params.append('date_to', filters.date_to);
    if (filters?.min_amount) params.append('min_amount', filters.min_amount.toString());
    if (filters?.max_amount) params.append('max_amount', filters.max_amount.toString());

    const response = await api.get<AdminTransaction[]>(`/admin/transactions?${params.toString()}`);
    return response;
  },

  getTransactionById: async (id: string): Promise<AdminTransaction> => {
    const response = await api.get<AdminTransaction>(`/admin/transactions/${id}`);
    return response;
  },

  refundTransaction: async (id: string, amount?: number, reason?: string): Promise<void> => {
    await api.post(`/admin/transactions/${id}/refund`, { amount, reason });
  },

  // Analytics
  getAnalytics: async (period: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<AnalyticsData> => {
    const response = await api.get<AnalyticsData>(`/admin/analytics?period=${period}`);
    return response;
  },

  exportAnalytics: async (period: '7d' | '30d' | '90d' | '1y' = '30d', format: 'csv' | 'pdf' = 'csv'): Promise<Blob> => {
    const response = await api.get(`/admin/analytics/export?period=${period}&format=${format}`);
    return response as Blob;
  },

  // Broadcast Messages
  getBroadcastMessages: async (): Promise<BroadcastMessage[]> => {
    const response = await api.get<BroadcastMessage[]>('/admin/broadcast-messages');
    return response;
  },

  createBroadcastMessage: async (data: CreateBroadcastMessageInput): Promise<BroadcastMessage> => {
    const response = await api.post<BroadcastMessage>('/admin/broadcast-messages', data);
    return response;
  },

  sendBroadcastMessage: async (id: string): Promise<void> => {
    await api.post(`/admin/broadcast-messages/${id}/send`, {});
  },

  deleteBroadcastMessage: async (id: string): Promise<void> => {
    await api.delete(`/admin/broadcast-messages/${id}`);
  },

  // Support Tools
  impersonateUser: async (id: string): Promise<{ impersonation_token: string }> => {
    const response = await api.post<{ impersonation_token: string }>(`/admin/impersonate/${id}`, {});
    return response;
  },

  // System Health
  getSystemHealth: async (): Promise<{
    status: 'healthy' | 'degraded' | 'down';
    services: {
      database: 'up' | 'down';
      redis: 'up' | 'down';
      payment_gateway: 'up' | 'down';
      email_service: 'up' | 'down';
    };
    metrics: {
      response_time_ms: number;
      error_rate: number;
      uptime_percentage: number;
    };
  }> => {
    const response = await api.get<{
      status: 'healthy' | 'degraded' | 'down';
      services: {
        database: 'up' | 'down';
        redis: 'up' | 'down';
        payment_gateway: 'up' | 'down';
        email_service: 'up' | 'down';
      };
      metrics: {
        response_time_ms: number;
        error_rate: number;
        uptime_percentage: number;
      };
    }>('/admin/system/health');
    return response;
  },

  // Security Settings
  getSecuritySettings: async (): Promise<any> => {
    const response = await api.get<any>('/admin/security/settings');
    return response;
  },

  updateSecuritySettings: async (settings: any): Promise<void> => {
    await api.put('/admin/security/settings', settings);
  },

  // Audit Logs
  getAllAuditLogs: async (filters?: {
    action?: string;
    date_from?: string;
    date_to?: string;
    search?: string;
  }): Promise<AuditLog[]> => {
    const params = new URLSearchParams();
    if (filters?.action) params.append('action', filters.action);
    if (filters?.date_from) params.append('date_from', filters.date_from);
    if (filters?.date_to) params.append('date_to', filters.date_to);
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get<AuditLog[]>(`/admin/audit-logs?${params.toString()}`);
    return response;
  },

  exportAuditLogs: async (filters?: any): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filters?.action) params.append('action', filters.action);
    if (filters?.date_from) params.append('date_from', filters.date_from);
    if (filters?.date_to) params.append('date_to', filters.date_to);
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get(`/admin/audit-logs/export?${params.toString()}`);
    return response as Blob;
  },
};