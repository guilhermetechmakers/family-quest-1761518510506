export interface ProgressLog {
  id: string;
  goal_id: string;
  user_id: string;
  action_type: 'contribution' | 'milestone_achieved' | 'manual_adjustment' | 'refund' | 'goal_completed';
  amount?: number;
  previous_value: number;
  new_value: number;
  percentage_change: number;
  description?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface MilestoneProgress {
  milestone_id: string;
  goal_id: string;
  title: string;
  target_value: number;
  current_value: number;
  percentage: number;
  is_achieved: boolean;
  achieved_at?: string;
  days_to_achievement?: number;
  estimated_achievement_date?: string;
  reward?: string;
  order: number;
}

export interface GoalProgressDetails {
  goal_id: string;
  goal_title: string;
  goal_type: string;
  current_value: number;
  target_value: number;
  percentage: number;
  currency: string;
  status: 'on_track' | 'behind' | 'ahead' | 'at_risk' | 'completed';
  estimated_completion_date?: string;
  days_remaining?: number;
  daily_average_contribution?: number;
  milestones: MilestoneProgress[];
  recent_activity: ProgressLog[];
  trend_data: {
    date: string;
    value: number;
    percentage: number;
  }[];
  contributors_summary: {
    user_id: string;
    full_name: string;
    avatar_url?: string;
    total_contributed: number;
    percentage_of_total: number;
  }[];
}

export interface ProgressAdjustment {
  goal_id: string;
  adjustment_type: 'manual_add' | 'manual_subtract' | 'refund' | 'correction';
  amount: number;
  reason: string;
  description?: string;
}

export interface MilestoneAchievement {
  milestone_id: string;
  goal_id: string;
  title: string;
  achieved_at: string;
  reward?: string;
  shareable_card_url?: string;
  celebration_message?: string;
}

export interface ProgressSettings {
  goal_id: string;
  auto_calculate_eta: boolean;
  milestone_notifications: boolean;
  progress_reminders: boolean;
  reminder_frequency: 'daily' | 'weekly' | 'monthly';
  share_achievements: boolean;
  celebration_animations: boolean;
}

export interface CreateProgressAdjustmentInput {
  goal_id: string;
  adjustment_type: 'manual_add' | 'manual_subtract' | 'refund' | 'correction';
  amount: number;
  reason: string;
  description?: string;
}

export interface UpdateProgressSettingsInput {
  goal_id: string;
  auto_calculate_eta?: boolean;
  milestone_notifications?: boolean;
  progress_reminders?: boolean;
  reminder_frequency?: 'daily' | 'weekly' | 'monthly';
  share_achievements?: boolean;
  celebration_animations?: boolean;
}

export interface ProgressAnalytics {
  goal_id: string;
  period: 'week' | 'month' | 'quarter' | 'year';
  total_contributions: number;
  average_daily_contribution: number;
  contribution_frequency: number;
  milestone_achievement_rate: number;
  completion_velocity: number;
  top_contributors: {
    user_id: string;
    full_name: string;
    contribution_amount: number;
    contribution_count: number;
  }[];
  trend_analysis: {
    direction: 'increasing' | 'decreasing' | 'stable';
    confidence: number;
    predicted_completion_date?: string;
  };
}

export interface ProgressNotification {
  id: string;
  user_id: string;
  goal_id: string;
  type: 'milestone_achieved' | 'progress_update' | 'eta_change' | 'goal_completed' | 'reminder';
  title: string;
  message: string;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

export interface ProgressShareCard {
  goal_id: string;
  milestone_id?: string;
  template: 'milestone' | 'progress' | 'completion';
  title: string;
  subtitle: string;
  progress_percentage: number;
  achievement_text?: string;
  background_color: string;
  accent_color: string;
  generated_at: string;
  expires_at: string;
  share_url: string;
  image_url: string;
}