import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { remindersApi } from '@/api/reminders';
import type { 
  ReminderSearchParams, 
  ReminderGroup,
  UpdateReminderInput
} from '@/types/reminder';

// Query keys
export const reminderKeys = {
  all: ['reminders'] as const,
  lists: () => [...reminderKeys.all, 'list'] as const,
  list: (params?: ReminderSearchParams) => [...reminderKeys.lists(), params] as const,
  grouped: (params?: ReminderSearchParams) => [...reminderKeys.all, 'grouped', params] as const,
  upcoming: () => [...reminderKeys.all, 'upcoming'] as const,
  detail: (id: string) => [...reminderKeys.all, 'detail', id] as const,
  preferences: () => [...reminderKeys.all, 'preferences'] as const,
};

// Get reminders with search and filters
export const useReminders = (params?: ReminderSearchParams) => {
  return useQuery({
    queryKey: reminderKeys.list(params),
    queryFn: () => remindersApi.getAll(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get reminders grouped by date
export const useGroupedReminders = (params?: ReminderSearchParams) => {
  return useQuery({
    queryKey: reminderKeys.grouped(params),
    queryFn: () => remindersApi.getGrouped(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get upcoming reminders
export const useUpcomingReminders = () => {
  return useQuery({
    queryKey: reminderKeys.upcoming(),
    queryFn: remindersApi.getUpcoming,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
};

// Get reminder by ID
export const useReminder = (id: string) => {
  return useQuery({
    queryKey: reminderKeys.detail(id),
    queryFn: () => remindersApi.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get reminder preferences
export const useReminderPreferences = () => {
  return useQuery({
    queryKey: reminderKeys.preferences(),
    queryFn: remindersApi.getPreferences,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Create reminder
export const useCreateReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: remindersApi.create,
    onSuccess: () => {
      // Invalidate all reminder queries
      queryClient.invalidateQueries({ queryKey: reminderKeys.all });
      toast.success('Reminder created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create reminder');
      console.error('Error creating reminder:', error);
    },
  });
};

// Update reminder
export const useUpdateReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReminderInput }) =>
      remindersApi.update(id, data),
    onSuccess: (updatedReminder) => {
      // Update the specific reminder in all relevant queries
      queryClient.setQueryData(reminderKeys.detail(updatedReminder.id), updatedReminder);
      
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: reminderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reminderKeys.grouped() });
      queryClient.invalidateQueries({ queryKey: reminderKeys.upcoming() });

      toast.success('Reminder updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update reminder');
      console.error('Error updating reminder:', error);
    },
  });
};

// Delete reminder
export const useDeleteReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: remindersApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove the reminder from all relevant queries
      queryClient.setQueryData(reminderKeys.lists(), (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.filter((reminder: any) => reminder.id !== deletedId);
      });

      // Update grouped reminders
      queryClient.setQueryData(reminderKeys.grouped(), (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.map((group: ReminderGroup) => ({
          ...group,
          reminders: group.reminders.filter((reminder) => reminder.id !== deletedId),
        })).filter((group: ReminderGroup) => group.reminders.length > 0);
      });

      // Update upcoming reminders
      queryClient.setQueryData(reminderKeys.upcoming(), (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.filter((reminder: any) => reminder.id !== deletedId);
      });

      // Remove from detail cache
      queryClient.removeQueries({ queryKey: reminderKeys.detail(deletedId) });

      toast.success('Reminder deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete reminder');
      console.error('Error deleting reminder:', error);
    },
  });
};

// Delete multiple reminders
export const useDeleteMultipleReminders = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: remindersApi.deleteMultiple,
    onSuccess: () => {
      // Invalidate all reminder queries
      queryClient.invalidateQueries({ queryKey: reminderKeys.all });
      toast.success('Selected reminders deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete selected reminders');
      console.error('Error deleting multiple reminders:', error);
    },
  });
};

// Cancel reminder
export const useCancelReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: remindersApi.cancel,
    onSuccess: (cancelledReminder) => {
      // Update the specific reminder in all relevant queries
      queryClient.setQueryData(reminderKeys.detail(cancelledReminder.id), cancelledReminder);
      
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: reminderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reminderKeys.grouped() });
      queryClient.invalidateQueries({ queryKey: reminderKeys.upcoming() });

      toast.success('Reminder cancelled successfully');
    },
    onError: (error) => {
      toast.error('Failed to cancel reminder');
      console.error('Error cancelling reminder:', error);
    },
  });
};

// Reschedule reminder
export const useRescheduleReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, scheduled_time }: { id: string; scheduled_time: string }) =>
      remindersApi.reschedule(id, scheduled_time),
    onSuccess: (rescheduledReminder) => {
      // Update the specific reminder in all relevant queries
      queryClient.setQueryData(reminderKeys.detail(rescheduledReminder.id), rescheduledReminder);
      
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: reminderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reminderKeys.grouped() });
      queryClient.invalidateQueries({ queryKey: reminderKeys.upcoming() });

      toast.success('Reminder rescheduled successfully');
    },
    onError: (error) => {
      toast.error('Failed to reschedule reminder');
      console.error('Error rescheduling reminder:', error);
    },
  });
};

// Update reminder preferences
export const useUpdateReminderPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: remindersApi.updatePreferences,
    onSuccess: (updatedPreferences) => {
      // Update preferences in cache
      queryClient.setQueryData(reminderKeys.preferences(), updatedPreferences);
      toast.success('Reminder preferences updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update reminder preferences');
      console.error('Error updating reminder preferences:', error);
    },
  });
};

// Test reminder
export const useTestReminder = () => {
  return useMutation({
    mutationFn: remindersApi.test,
    onSuccess: () => {
      toast.success('Test reminder sent successfully');
    },
    onError: (error) => {
      toast.error('Failed to send test reminder');
      console.error('Error sending test reminder:', error);
    },
  });
};