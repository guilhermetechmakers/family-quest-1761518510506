export type NotificationType = 'milestone_achieved' | 'contribution_approved' | 'contribution_pending' | 'goal_completed' | 'member_invited' | 'member_joined' | 'comment_added' | 'reaction_added';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  read_at?: string;
  metadata?: Record<string, any>;
  related_entity_id?: string;
  related_entity_type?: 'goal' | 'contribution' | 'activity' | 'family';
}

export interface CreateNotificationInput {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  related_entity_id?: string;
  related_entity_type?: 'goal' | 'contribution' | 'activity' | 'family';
}

export interface NotificationPreferences {
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  in_app_notifications: boolean;
  notification_types: Record<NotificationType, boolean>;
  digest_frequency: 'immediate' | 'daily' | 'weekly';
}

export interface UpdateNotificationPreferencesInput {
  email_notifications?: boolean;
  push_notifications?: boolean;
  in_app_notifications?: boolean;
  notification_types?: Partial<Record<NotificationType, boolean>>;
  digest_frequency?: 'immediate' | 'daily' | 'weekly';
}