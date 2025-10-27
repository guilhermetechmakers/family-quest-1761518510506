import { api } from '../lib/api';
import type { 
  Reminder, 
  CreateReminderInput,
  UpdateReminderInput,
  ReminderSearchParams,
  ReminderGroup,
  ReminderPreferences,
  UpdateReminderPreferencesInput
} from '@/types/reminder';

export const remindersApi = {
  // Get all reminders for current user with search and filters
  getAll: async (params?: ReminderSearchParams): Promise<Reminder[]> => {
    const searchParams = new URLSearchParams();
    
    if (params?.query) {
      searchParams.append('query', params.query);
    }
    if (params?.status) {
      searchParams.append('status', params.status);
    }
    if (params?.channel) {
      searchParams.append('channel', params.channel);
    }
    if (params?.date_range) {
      searchParams.append('start_date', params.date_range.start);
      searchParams.append('end_date', params.date_range.end);
    }
    if (params?.page) {
      searchParams.append('page', params.page.toString());
    }
    if (params?.limit) {
      searchParams.append('limit', params.limit.toString());
    }

    const queryString = searchParams.toString();
    const url = queryString ? `/reminders?${queryString}` : '/reminders';
    const response = await api.get<Reminder[]>(url);
    return response;
  },

  // Get reminders grouped by date
  getGrouped: async (params?: ReminderSearchParams): Promise<ReminderGroup[]> => {
    const searchParams = new URLSearchParams();
    
    if (params?.query) {
      searchParams.append('query', params.query);
    }
    if (params?.status) {
      searchParams.append('status', params.status);
    }
    if (params?.channel) {
      searchParams.append('channel', params.channel);
    }
    if (params?.date_range) {
      searchParams.append('start_date', params.date_range.start);
      searchParams.append('end_date', params.date_range.end);
    }
    if (params?.page) {
      searchParams.append('page', params.page.toString());
    }
    if (params?.limit) {
      searchParams.append('limit', params.limit.toString());
    }

    const queryString = searchParams.toString();
    const url = queryString ? `/reminders/grouped?${queryString}` : '/reminders/grouped';
    const response = await api.get<ReminderGroup[]>(url);
    return response;
  },

  // Get upcoming reminders (next 7 days)
  getUpcoming: async (): Promise<Reminder[]> => {
    const response = await api.get<Reminder[]>('/reminders/upcoming');
    return response;
  },

  // Get reminder by ID
  getById: async (id: string): Promise<Reminder> => {
    const response = await api.get<Reminder>(`/reminders/${id}`);
    return response;
  },

  // Create new reminder
  create: async (data: CreateReminderInput): Promise<Reminder> => {
    const response = await api.post<Reminder>('/reminders', data);
    return response;
  },

  // Update reminder
  update: async (id: string, data: UpdateReminderInput): Promise<Reminder> => {
    const response = await api.put<Reminder>(`/reminders/${id}`, data);
    return response;
  },

  // Delete reminder
  delete: async (id: string): Promise<void> => {
    await api.delete(`/reminders/${id}`);
  },

  // Delete multiple reminders
  deleteMultiple: async (ids: string[]): Promise<void> => {
    await api.post('/reminders/delete-multiple', { ids });
  },

  // Cancel reminder
  cancel: async (id: string): Promise<Reminder> => {
    const response = await api.patch<Reminder>(`/reminders/${id}/cancel`, {});
    return response;
  },

  // Reschedule reminder
  reschedule: async (id: string, scheduled_time: string): Promise<Reminder> => {
    const response = await api.patch<Reminder>(`/reminders/${id}/reschedule`, { scheduled_time });
    return response;
  },

  // Get reminder preferences
  getPreferences: async (): Promise<ReminderPreferences> => {
    const response = await api.get<ReminderPreferences>('/reminders/preferences');
    return response;
  },

  // Update reminder preferences
  updatePreferences: async (preferences: UpdateReminderPreferencesInput): Promise<ReminderPreferences> => {
    const response = await api.put<ReminderPreferences>('/reminders/preferences', preferences);
    return response;
  },

  // Test reminder (send immediately for testing)
  test: async (data: Omit<CreateReminderInput, 'scheduled_time'>): Promise<void> => {
    await api.post('/reminders/test', data);
  },
};