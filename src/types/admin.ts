// This interface is redefined below as a standalone interface

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


// System Health Types
export interface SystemHealth {
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
}

// Security Settings Types
export interface SecuritySettings {
  // Authentication Settings
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSymbols: boolean;
  passwordExpiryDays: number;
  maxLoginAttempts: number;
  lockoutDurationMinutes: number;
  
  // Session Settings
  sessionTimeoutMinutes: number;
  requireReauthForSensitiveActions: boolean;
  allowConcurrentSessions: boolean;
  
  // Security Features
  enable2FA: boolean;
  enableAuditLogging: boolean;
  enableIPWhitelist: boolean;
  enableRateLimiting: boolean;
  enableCSRFProtection: boolean;
  
  // Data Protection
  enableDataEncryption: boolean;
  enableBackupEncryption: boolean;
  dataRetentionDays: number;
  enableGDPRCompliance: boolean;
  
  // Monitoring
  enableSecurityAlerts: boolean;
  enableSuspiciousActivityDetection: boolean;
  alertThreshold: 'low' | 'medium' | 'high';
  enableRealTimeMonitoring: boolean;
}

// Audit Log Types
export interface AuditLogFilters {
  action?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  user_id?: string;
  severity?: 'low' | 'medium' | 'high';
}

// System Metrics Types
export interface SystemMetrics {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_io: number;
  active_users: number;
  requests_per_minute: number;
  cache_hit_rate: number;
  queue_length: number;
}

// Security Alert Types
export interface SecurityAlert {
  id: string;
  type: 'login_anomaly' | 'suspicious_activity' | 'failed_attempts' | 'data_breach' | 'system_compromise';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  user_id?: string;
  ip_address?: string;
  created_at: string;
  resolved_at?: string;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  metadata: Record<string, any>;
}

// Admin Dashboard Types
export interface AdminDashboardMetrics {
  total_users: number;
  active_users_today: number;
  new_users_this_week: number;
  total_goals: number;
  completed_goals: number;
  pending_moderations: number;
  failed_transactions: number;
  system_health_score: number;
  security_alerts: number;
  revenue_this_month: number;
  revenue_growth_rate: number;
}

// Admin Activity Types
export interface AdminActivity {
  id: string;
  admin_id: string;
  admin_name: string;
  action: string;
  target_type: 'user' | 'goal' | 'transaction' | 'content' | 'system';
  target_id: string;
  details: Record<string, any>;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

// Admin Permissions Types
export interface AdminPermissions {
  can_manage_users: boolean;
  can_moderate_content: boolean;
  can_view_analytics: boolean;
  can_manage_transactions: boolean;
  can_send_broadcasts: boolean;
  can_view_audit_logs: boolean;
  can_manage_security: boolean;
  can_view_system_health: boolean;
  can_impersonate_users: boolean;
  can_export_data: boolean;
}

// Admin Role Types
export interface AdminRole {
  id: string;
  name: string;
  description: string;
  permissions: AdminPermissions;
  created_at: string;
  updated_at: string;
}

// Admin User Types
export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: AdminRole;
  permissions: AdminPermissions;
  family_id?: string;
  created_at: string;
  updated_at: string;
  is_verified: boolean;
  last_login: string;
  status: 'active' | 'suspended' | 'pending';
  audit_logs: AuditLog[];
  family_count: number;
  goal_count: number;
  contribution_count: number;
  created_by?: string;
}