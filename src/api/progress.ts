import { api } from '../lib/api';
import type { 
  GoalProgressDetails, 
  ProgressAdjustment, 
  CreateProgressAdjustmentInput,
  ProgressSettings,
  UpdateProgressSettingsInput,
  ProgressAnalytics,
  ProgressNotification,
  ProgressShareCard,
  MilestoneAchievement
} from '@/types/progress';

export const progressApi = {
  // Get detailed progress for a specific goal
  getGoalProgress: async (goalId: string): Promise<GoalProgressDetails> => {
    const response = await api.get<GoalProgressDetails>(`/goals/${goalId}/progress`);
    return response;
  },

  // Get progress for all goals in family
  getAllProgress: async (familyId: string): Promise<GoalProgressDetails[]> => {
    const response = await api.get<GoalProgressDetails[]>(`/families/${familyId}/progress`);
    return response;
  },

  // Create a progress adjustment
  createAdjustment: async (adjustment: CreateProgressAdjustmentInput): Promise<ProgressAdjustment> => {
    const response = await api.post<ProgressAdjustment>('/progress/adjustments', adjustment);
    return response;
  },

  // Get progress adjustments for a goal
  getAdjustments: async (goalId: string): Promise<ProgressAdjustment[]> => {
    const response = await api.get<ProgressAdjustment[]>(`/goals/${goalId}/adjustments`);
    return response;
  },

  // Get progress settings for a goal
  getSettings: async (goalId: string): Promise<ProgressSettings> => {
    const response = await api.get<ProgressSettings>(`/goals/${goalId}/progress-settings`);
    return response;
  },

  // Update progress settings
  updateSettings: async (goalId: string, settings: UpdateProgressSettingsInput): Promise<ProgressSettings> => {
    const response = await api.patch<ProgressSettings>(`/goals/${goalId}/progress-settings`, settings);
    return response;
  },

  // Get progress analytics
  getAnalytics: async (goalId: string, period: 'week' | 'month' | 'quarter' | 'year' = 'month'): Promise<ProgressAnalytics> => {
    const response = await api.get<ProgressAnalytics>(`/goals/${goalId}/analytics?period=${period}`);
    return response;
  },

  // Get milestone achievements
  getMilestoneAchievements: async (goalId: string): Promise<MilestoneAchievement[]> => {
    const response = await api.get<MilestoneAchievement[]>(`/goals/${goalId}/milestone-achievements`);
    return response;
  },

  // Get progress notifications
  getNotifications: async (userId: string): Promise<ProgressNotification[]> => {
    const response = await api.get<ProgressNotification[]>(`/users/${userId}/progress-notifications`);
    return response;
  },

  // Mark notification as read
  markNotificationRead: async (notificationId: string): Promise<void> => {
    await api.patch(`/notifications/${notificationId}/read`, {});
  },

  // Mark all notifications as read
  markAllNotificationsRead: async (userId: string): Promise<void> => {
    await api.patch(`/users/${userId}/progress-notifications/read-all`, {});
  },

  // Generate shareable card
  generateShareCard: async (goalId: string, template: 'milestone' | 'progress' | 'completion', milestoneId?: string): Promise<ProgressShareCard> => {
    const response = await api.post<ProgressShareCard>('/progress/share-cards', {
      goal_id: goalId,
      template,
      milestone_id: milestoneId
    });
    return response;
  },

  // Get shareable card
  getShareCard: async (cardId: string): Promise<ProgressShareCard> => {
    const response = await api.get<ProgressShareCard>(`/progress/share-cards/${cardId}`);
    return response;
  },

  // Calculate ETA for goal completion
  calculateETA: async (goalId: string): Promise<{ estimated_completion_date: string; days_remaining: number; confidence: number }> => {
    const response = await api.get<{ estimated_completion_date: string; days_remaining: number; confidence: number }>(`/goals/${goalId}/eta`);
    return response;
  },

  // Trigger milestone check (for testing or manual triggers)
  triggerMilestoneCheck: async (goalId: string): Promise<MilestoneAchievement[]> => {
    const response = await api.post<MilestoneAchievement[]>(`/goals/${goalId}/check-milestones`, {});
    return response;
  },

  // Get progress history
  getProgressHistory: async (goalId: string, startDate?: string, endDate?: string): Promise<{
    date: string;
    value: number;
    percentage: number;
    contributions: number;
    milestones_achieved: number;
  }[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const response = await api.get<{
      date: string;
      value: number;
      percentage: number;
      contributions: number;
      milestones_achieved: number;
    }[]>(`/goals/${goalId}/progress-history?${params.toString()}`);
    return response;
  },

  // Export progress data
  exportProgressData: async (goalId: string, format: 'csv' | 'pdf' | 'json' = 'csv'): Promise<Blob> => {
    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/goals/${goalId}/export?format=${format}`;
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(url, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Export failed: ${response.status}`);
    }
    
    return response.blob();
  },

  // Get family progress summary
  getFamilyProgressSummary: async (familyId: string): Promise<{
    total_goals: number;
    active_goals: number;
    completed_goals: number;
    total_value: number;
    total_contributions: number;
    average_completion_rate: number;
    upcoming_milestones: {
      goal_id: string;
      goal_title: string;
      milestone_title: string;
      days_until_achievement: number;
    }[];
    recent_achievements: MilestoneAchievement[];
  }> => {
    const response = await api.get<{
      total_goals: number;
      active_goals: number;
      completed_goals: number;
      total_value: number;
      total_contributions: number;
      average_completion_rate: number;
      upcoming_milestones: {
        goal_id: string;
        goal_title: string;
        milestone_title: string;
        days_until_achievement: number;
      }[];
      recent_achievements: MilestoneAchievement[];
    }>(`/families/${familyId}/progress-summary`);
    return response;
  }
};