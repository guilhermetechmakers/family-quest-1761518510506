import { api } from '../lib/api';
import type { 
  Notification, 
  NotificationPreferences, 
  UpdateNotificationPreferencesInput,
  NotificationSearchParams,
  NotificationGroup
} from '@/types/notification';

export const notificationsApi = {
  // Get all notifications for current user with search and filters
  getAll: async (params?: NotificationSearchParams): Promise<Notification[]> => {
    const searchParams = new URLSearchParams();
    
    if (params?.query) {
      searchParams.append('query', params.query);
    }
    if (params?.filters?.type) {
      searchParams.append('type', params.filters.type);
    }
    if (params?.filters?.is_read !== undefined) {
      searchParams.append('is_read', params.filters.is_read.toString());
    }
    if (params?.filters?.date_range) {
      searchParams.append('start_date', params.filters.date_range.start);
      searchParams.append('end_date', params.filters.date_range.end);
    }
    if (params?.page) {
      searchParams.append('page', params.page.toString());
    }
    if (params?.limit) {
      searchParams.append('limit', params.limit.toString());
    }

    const queryString = searchParams.toString();
    const url = queryString ? `/notifications?${queryString}` : '/notifications';
    const response = await api.get<Notification[]>(url);
    return response;
  },

  // Get notifications grouped by date
  getGrouped: async (params?: NotificationSearchParams): Promise<NotificationGroup[]> => {
    const searchParams = new URLSearchParams();
    
    if (params?.query) {
      searchParams.append('query', params.query);
    }
    if (params?.filters?.type) {
      searchParams.append('type', params.filters.type);
    }
    if (params?.filters?.is_read !== undefined) {
      searchParams.append('is_read', params.filters.is_read.toString());
    }
    if (params?.filters?.date_range) {
      searchParams.append('start_date', params.filters.date_range.start);
      searchParams.append('end_date', params.filters.date_range.end);
    }
    if (params?.page) {
      searchParams.append('page', params.page.toString());
    }
    if (params?.limit) {
      searchParams.append('limit', params.limit.toString());
    }

    const queryString = searchParams.toString();
    const url = queryString ? `/notifications/grouped?${queryString}` : '/notifications/grouped';
    const response = await api.get<NotificationGroup[]>(url);
    return response;
  },

  // Get unread notifications count
  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<{ count: number }>('/notifications/unread-count');
    return response.count;
  },

  // Mark notification as read
  markAsRead: async (id: string): Promise<Notification> => {
    const response = await api.patch<Notification>(`/notifications/${id}/read`, {});
    return response;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    await api.post('/notifications/mark-all-read', {});
  },

  // Mark multiple notifications as read
  markMultipleAsRead: async (ids: string[]): Promise<void> => {
    await api.post('/notifications/mark-multiple-read', { ids });
  },

  // Delete notification
  delete: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },

  // Delete multiple notifications
  deleteMultiple: async (ids: string[]): Promise<void> => {
    await api.post('/notifications/delete-multiple', { ids });
  },

  // Clear all notifications
  clearAll: async (): Promise<void> => {
    await api.post('/notifications/clear-all', {});
  },

  // Get notification preferences
  getPreferences: async (): Promise<NotificationPreferences> => {
    const response = await api.get<NotificationPreferences>('/notifications/preferences');
    return response;
  },

  // Update notification preferences
  updatePreferences: async (preferences: UpdateNotificationPreferencesInput): Promise<NotificationPreferences> => {
    const response = await api.put<NotificationPreferences>('/notifications/preferences', preferences);
    return response;
  },
};