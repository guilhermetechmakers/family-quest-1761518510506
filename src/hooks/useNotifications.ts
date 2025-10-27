import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { notificationsApi } from '@/api/notifications';
import type { 
  NotificationSearchParams, 
  NotificationGroup 
} from '@/types/notification';

// Query keys
export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (params?: NotificationSearchParams) => [...notificationKeys.lists(), params] as const,
  grouped: (params?: NotificationSearchParams) => [...notificationKeys.all, 'grouped', params] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
  preferences: () => [...notificationKeys.all, 'preferences'] as const,
};

// Get notifications with search and filters
export const useNotifications = (params?: NotificationSearchParams) => {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => notificationsApi.getAll(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get notifications grouped by date
export const useGroupedNotifications = (params?: NotificationSearchParams) => {
  return useQuery({
    queryKey: notificationKeys.grouped(params),
    queryFn: () => notificationsApi.getGrouped(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get unread count
export const useUnreadCount = () => {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: notificationsApi.getUnreadCount,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
};

// Get notification preferences
export const useNotificationPreferences = () => {
  return useQuery({
    queryKey: notificationKeys.preferences(),
    queryFn: notificationsApi.getPreferences,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Mark notification as read
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: (updatedNotification) => {
      // Update the specific notification in all relevant queries
      queryClient.setQueryData(notificationKeys.lists(), (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.map((notification: any) =>
          notification.id === updatedNotification.id ? updatedNotification : notification
        );
      });

      // Update grouped notifications
      queryClient.setQueryData(notificationKeys.grouped(), (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.map((group: NotificationGroup) => ({
          ...group,
          notifications: group.notifications.map((notification) =>
            notification.id === updatedNotification.id ? updatedNotification : notification
          ),
        }));
      });

      // Invalidate unread count
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });

      toast.success('Notification marked as read');
    },
    onError: (error) => {
      toast.error('Failed to mark notification as read');
      console.error('Error marking notification as read:', error);
    },
  });
};

// Mark all notifications as read
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      // Invalidate all notification queries
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      toast.success('All notifications marked as read');
    },
    onError: (error) => {
      toast.error('Failed to mark all notifications as read');
      console.error('Error marking all notifications as read:', error);
    },
  });
};

// Mark multiple notifications as read
export const useMarkMultipleAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.markMultipleAsRead,
    onSuccess: () => {
      // Invalidate all notification queries
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      toast.success('Selected notifications marked as read');
    },
    onError: (error) => {
      toast.error('Failed to mark selected notifications as read');
      console.error('Error marking multiple notifications as read:', error);
    },
  });
};

// Delete notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove the notification from all relevant queries
      queryClient.setQueryData(notificationKeys.lists(), (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.filter((notification: any) => notification.id !== deletedId);
      });

      // Update grouped notifications
      queryClient.setQueryData(notificationKeys.grouped(), (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.map((group: NotificationGroup) => ({
          ...group,
          notifications: group.notifications.filter((notification) => notification.id !== deletedId),
        })).filter((group: NotificationGroup) => group.notifications.length > 0);
      });

      // Invalidate unread count
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });

      toast.success('Notification deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete notification');
      console.error('Error deleting notification:', error);
    },
  });
};

// Delete multiple notifications
export const useDeleteMultipleNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.deleteMultiple,
    onSuccess: () => {
      // Invalidate all notification queries
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      toast.success('Selected notifications deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete selected notifications');
      console.error('Error deleting multiple notifications:', error);
    },
  });
};

// Clear all notifications
export const useClearAllNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.clearAll,
    onSuccess: () => {
      // Invalidate all notification queries
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      toast.success('All notifications cleared');
    },
    onError: (error) => {
      toast.error('Failed to clear all notifications');
      console.error('Error clearing all notifications:', error);
    },
  });
};

// Update notification preferences
export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.updatePreferences,
    onSuccess: (updatedPreferences) => {
      // Update preferences in cache
      queryClient.setQueryData(notificationKeys.preferences(), updatedPreferences);
      toast.success('Notification preferences updated');
    },
    onError: (error) => {
      toast.error('Failed to update notification preferences');
      console.error('Error updating notification preferences:', error);
    },
  });
};
