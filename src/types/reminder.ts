export type ReminderChannel = 'push' | 'email' | 'in_app';

export type ReminderStatus = 'scheduled' | 'sent' | 'cancelled' | 'failed';

export interface Reminder {
  id: string;
  user_id: string;
  title: string;
  message: string;
  scheduled_time: string;
  channel: ReminderChannel;
  status: ReminderStatus;
  created_at: string;
  updated_at: string;
  sent_at?: string;
  metadata?: Record<string, any>;
  related_entity_id?: string;
  related_entity_type?: 'goal' | 'contribution' | 'activity' | 'family';
}

export interface CreateReminderInput {
  title: string;
  message: string;
  scheduled_time: string;
  channel: ReminderChannel;
  metadata?: Record<string, any>;
  related_entity_id?: string;
  related_entity_type?: 'goal' | 'contribution' | 'activity' | 'family';
}

export interface UpdateReminderInput {
  title?: string;
  message?: string;
  scheduled_time?: string;
  channel?: ReminderChannel;
  metadata?: Record<string, any>;
}

export interface ReminderSearchParams {
  query?: string;
  status?: ReminderStatus;
  channel?: ReminderChannel;
  date_range?: {
    start: string;
    end: string;
  };
  page?: number;
  limit?: number;
}

export interface ReminderGroup {
  date: string;
  reminders: Reminder[];
}

export interface ReminderPreferences {
  user_id: string;
  default_channel: ReminderChannel;
  advance_notice_minutes: number;
  max_reminders_per_day: number;
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  reminder_types: Record<string, boolean>;
}

export interface UpdateReminderPreferencesInput {
  default_channel?: ReminderChannel;
  advance_notice_minutes?: number;
  max_reminders_per_day?: number;
  quiet_hours_enabled?: boolean;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  reminder_types?: Partial<Record<string, boolean>>;
}