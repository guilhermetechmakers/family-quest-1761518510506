import { api } from '../lib/api';
import type { Notification, NotificationPreferences, UpdateNotificationPreferencesInput } from '@/types/notification';

export const notificationsApi = {
  // Get all notifications for current user
  getAll: async (): Promise<Notification[]> => {
    const response = await api.get<Notification[]>('/notifications');
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

  // Delete notification
  delete: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`);
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