import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { progressApi } from '@/api/progress';
import { toast } from 'sonner';
import type { 
  CreateProgressAdjustmentInput,
  UpdateProgressSettingsInput,
  ProgressNotification
} from '@/types/progress';

// Query keys for progress tracking
export const progressKeys = {
  all: ['progress'] as const,
  goalProgress: (goalId: string) => [...progressKeys.all, 'goal', goalId] as const,
  familyProgress: (familyId: string) => [...progressKeys.all, 'family', familyId] as const,
  adjustments: (goalId: string) => [...progressKeys.all, 'adjustments', goalId] as const,
  settings: (goalId: string) => [...progressKeys.all, 'settings', goalId] as const,
  analytics: (goalId: string, period: string) => [...progressKeys.all, 'analytics', goalId, period] as const,
  notifications: (userId: string) => [...progressKeys.all, 'notifications', userId] as const,
  shareCards: (goalId: string) => [...progressKeys.all, 'share-cards', goalId] as const,
  familySummary: (familyId: string) => [...progressKeys.all, 'family-summary', familyId] as const,
};

// Hook to get detailed progress for a specific goal
export function useGoalProgress(goalId: string) {
  return useQuery({
    queryKey: progressKeys.goalProgress(goalId),
    queryFn: () => progressApi.getGoalProgress(goalId),
    enabled: !!goalId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes for real-time updates
  });
}

// Hook to get progress for all goals in family
export function useFamilyProgress(familyId: string) {
  return useQuery({
    queryKey: progressKeys.familyProgress(familyId),
    queryFn: () => progressApi.getAllProgress(familyId),
    enabled: !!familyId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Hook to get family progress summary
export function useFamilyProgressSummary(familyId: string) {
  return useQuery({
    queryKey: progressKeys.familySummary(familyId),
    queryFn: () => progressApi.getFamilyProgressSummary(familyId),
    enabled: !!familyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to get progress adjustments for a goal
export function useProgressAdjustments(goalId: string) {
  return useQuery({
    queryKey: progressKeys.adjustments(goalId),
    queryFn: () => progressApi.getAdjustments(goalId),
    enabled: !!goalId,
  });
}

// Hook to get progress settings for a goal
export function useProgressSettings(goalId: string) {
  return useQuery({
    queryKey: progressKeys.settings(goalId),
    queryFn: () => progressApi.getSettings(goalId),
    enabled: !!goalId,
  });
}

// Hook to get progress analytics
export function useProgressAnalytics(goalId: string, period: 'week' | 'month' | 'quarter' | 'year' = 'month') {
  return useQuery({
    queryKey: progressKeys.analytics(goalId, period),
    queryFn: () => progressApi.getAnalytics(goalId, period),
    enabled: !!goalId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Hook to get progress notifications
export function useProgressNotifications(userId: string) {
  return useQuery({
    queryKey: progressKeys.notifications(userId),
    queryFn: () => progressApi.getNotifications(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}

// Hook to create progress adjustment
export function useCreateProgressAdjustment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (adjustment: CreateProgressAdjustmentInput) => 
      progressApi.createAdjustment(adjustment),
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: progressKeys.goalProgress(variables.goal_id) });
      queryClient.invalidateQueries({ queryKey: progressKeys.adjustments(variables.goal_id) });
      queryClient.invalidateQueries({ queryKey: progressKeys.familyProgress('family-123') }); // Mock family ID
      
      toast.success('Progress adjustment created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create progress adjustment');
    },
  });
}

// Hook to update progress settings
export function useUpdateProgressSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ goalId, settings }: { goalId: string; settings: UpdateProgressSettingsInput }) => 
      progressApi.updateSettings(goalId, settings),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: progressKeys.settings(variables.goalId) });
      toast.success('Progress settings updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update progress settings');
    },
  });
}

// Hook to mark notification as read
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => 
      progressApi.markNotificationRead(notificationId),
    onSuccess: (_, notificationId) => {
      // Update the notification in cache
      queryClient.setQueryData(
        progressKeys.notifications('user-123'), // Mock user ID
        (old: ProgressNotification[] | undefined) => 
          old?.map(notification => 
            notification.id === notificationId 
              ? { ...notification, is_read: true }
              : notification
          )
      );
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to mark notification as read');
    },
  });
}

// Hook to mark all notifications as read
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => 
      progressApi.markAllNotificationsRead(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: progressKeys.notifications(userId) });
      toast.success('All notifications marked as read');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to mark all notifications as read');
    },
  });
}

// Hook to generate shareable card
export function useGenerateShareCard() {
  return useMutation({
    mutationFn: ({ goalId, template, milestoneId }: { 
      goalId: string; 
      template: 'milestone' | 'progress' | 'completion'; 
      milestoneId?: string;
    }) => 
      progressApi.generateShareCard(goalId, template, milestoneId),
    onSuccess: () => {
      toast.success('Shareable card generated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to generate shareable card');
    },
  });
}

// Hook to calculate ETA
export function useCalculateETA(goalId: string) {
  return useQuery({
    queryKey: [...progressKeys.goalProgress(goalId), 'eta'],
    queryFn: () => progressApi.calculateETA(goalId),
    enabled: !!goalId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to trigger milestone check
export function useTriggerMilestoneCheck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (goalId: string) => 
      progressApi.triggerMilestoneCheck(goalId),
    onSuccess: (data, goalId) => {
      queryClient.invalidateQueries({ queryKey: progressKeys.goalProgress(goalId) });
      if (data.length > 0) {
        toast.success(`${data.length} milestone(s) achieved!`);
      } else {
        toast.info('No new milestones achieved');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to check milestones');
    },
  });
}

// Hook to get progress history
export function useProgressHistory(goalId: string, startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: [...progressKeys.goalProgress(goalId), 'history', startDate, endDate],
    queryFn: () => progressApi.getProgressHistory(goalId, startDate, endDate),
    enabled: !!goalId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Hook to export progress data
export function useExportProgressData() {
  return useMutation({
    mutationFn: ({ goalId, format }: { goalId: string; format: 'csv' | 'pdf' | 'json' }) => 
      progressApi.exportProgressData(goalId, format),
    onSuccess: (blob, { format }) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `progress-data.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`Progress data exported as ${format.toUpperCase()}`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to export progress data');
    },
  });
}