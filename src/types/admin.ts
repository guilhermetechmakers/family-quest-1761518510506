export interface AdminUser extends User {
  last_login: string;
  status: 'active' | 'suspended' | 'pending';
  audit_logs: AuditLog[];
  family_count: number;
  goal_count: number;
  contribution_count: number;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  details: Record<string, any>;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export interface ContentModeration {
  id: string;
  content_id: string;
  content_type: 'post' | 'comment' | 'media';
  author_id: string;
  author_name: string;
  content: string;
  flag_count: number;
  flag_reasons: string[];
  status: 'pending' | 'approved' | 'rejected' | 'removed';
  moderator_id?: string;
  moderator_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminTransaction {
  id: string;
  user_id: string;
  user_name: string;
  goal_id: string;
  goal_title: string;
  amount: number;
  currency: string;
  type: 'contribution' | 'refund' | 'fee';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  external_payment_id?: string;
  error_code?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsData {
  users: {
    total: number;
    active_today: number;
    active_this_week: number;
    new_this_month: number;
    by_role: {
      parent: number;
      child: number;
      guest: number;
      admin: number;
    };
  };
  goals: {
    total: number;
    completed: number;
    in_progress: number;
    completion_rate: number;
    average_duration_days: number;
  };
  revenue: {
    total: number;
    this_month: number;
    last_month: number;
    growth_rate: number;
    by_currency: Record<string, number>;
  };
  activity: {
    contributions_today: number;
    contributions_this_week: number;
    posts_today: number;
    posts_this_week: number;
  };
}

export interface BroadcastMessage {
  id: string;
  title: string;
  content: string;
  target_audience: 'all' | 'parents' | 'children' | 'guests' | 'specific_families';
  target_family_ids?: string[];
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  scheduled_at?: string;
  sent_at?: string;
  created_by: string;
  created_at: string;
}

export interface CreateBroadcastMessageInput {
  title: string;
  content: string;
  target_audience: 'all' | 'parents' | 'children' | 'guests' | 'specific_families';
  target_family_ids?: string[];
  scheduled_at?: string;
}

export interface AdminDashboardStats {
  total_users: number;
  active_users_today: number;
  total_goals: number;
  completed_goals: number;
  total_revenue: number;
  pending_moderations: number;
  failed_transactions: number;
}

export interface UserSearchFilters {
  search?: string;
  role?: 'parent' | 'child' | 'guest' | 'admin';
  status?: 'active' | 'suspended' | 'pending';
  family_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface TransactionFilters {
  search?: string;
  status?: 'pending' | 'completed' | 'failed' | 'refunded';
  type?: 'contribution' | 'refund' | 'fee';
  user_id?: string;
  goal_id?: string;
  date_from?: string;
  date_to?: string;
  min_amount?: number;
  max_amount?: number;
}

export interface ModerationFilters {
  status?: 'pending' | 'approved' | 'rejected' | 'removed';
  content_type?: 'post' | 'comment' | 'media';
  flag_count_min?: number;
  date_from?: string;
  date_to?: string;
}

// Re-export User type from user.ts
import type { User } from './user';