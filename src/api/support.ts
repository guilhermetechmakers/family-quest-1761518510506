import { api, apiRequest } from '../lib/api';
import type {
  SupportTicket,
  SupportTicketFilters,
  CreateSupportTicketInput,
  CreateSupportReplyInput,
  SupportStats,
} from '@/types/support';

export const supportApi = {
  // Support Tickets
  getTickets: async (filters?: SupportTicketFilters): Promise<SupportTicket[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.assigned_to) params.append('assigned_to', filters.assigned_to);
    if (filters?.user_id) params.append('user_id', filters.user_id);
    if (filters?.date_from) params.append('date_from', filters.date_from);
    if (filters?.date_to) params.append('date_to', filters.date_to);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.tags) {
      filters.tags.forEach(tag => params.append('tags', tag));
    }

    const response = await api.get<SupportTicket[]>(`/admin/support/tickets?${params.toString()}`);
    return response;
  },

  getTicketById: async (id: string): Promise<SupportTicket> => {
    const response = await api.get<SupportTicket>(`/admin/support/tickets/${id}`);
    return response;
  },

  createTicket: async (data: CreateSupportTicketInput): Promise<SupportTicket> => {
    const formData = new FormData();
    formData.append('subject', data.subject);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('priority', data.priority);
    
    if (data.attachments) {
      data.attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });
    }

    const response = await apiRequest<SupportTicket>('/admin/support/tickets', {
      method: 'POST',
      body: formData,
    });
    return response;
  },

  updateTicket: async (
    id: string,
    updates: Partial<Pick<SupportTicket, 'status' | 'priority' | 'assigned_to' | 'tags'>>
  ): Promise<SupportTicket> => {
    const response = await api.patch<SupportTicket>(`/admin/support/tickets/${id}`, updates);
    return response;
  },

  assignTicket: async (id: string, assigned_to: string): Promise<void> => {
    await api.post(`/admin/support/tickets/${id}/assign`, { assigned_to });
  },

  closeTicket: async (id: string, resolution_notes?: string): Promise<void> => {
    await api.post(`/admin/support/tickets/${id}/close`, { resolution_notes });
  },

  reopenTicket: async (id: string): Promise<void> => {
    await api.post(`/admin/support/tickets/${id}/reopen`, {});
  },

  // Support Replies
  getTicketReplies: async (ticketId: string): Promise<SupportTicket['replies']> => {
    const response = await api.get<SupportTicket['replies']>(`/admin/support/tickets/${ticketId}/replies`);
    return response;
  },

  createReply: async (ticketId: string, data: CreateSupportReplyInput): Promise<SupportTicket['replies'][0]> => {
    const formData = new FormData();
    formData.append('content', data.content);
    formData.append('is_internal', data.is_internal?.toString() || 'false');
    
    if (data.attachments) {
      data.attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });
    }

    const response = await apiRequest<SupportTicket['replies'][0]>(`/admin/support/tickets/${ticketId}/replies`, {
      method: 'POST',
      body: formData,
    });
    return response;
  },

  // Support Stats
  getSupportStats: async (): Promise<SupportStats> => {
    const response = await api.get<SupportStats>('/admin/support/stats');
    return response;
  },

  // Bulk Actions
  bulkUpdateTickets: async (ticketIds: string[], updates: Partial<Pick<SupportTicket, 'status' | 'assigned_to'>>): Promise<void> => {
    await api.post('/admin/support/tickets/bulk-update', {
      ticket_ids: ticketIds,
      updates,
    });
  },

  bulkAssignTickets: async (ticketIds: string[], assigned_to: string): Promise<void> => {
    await api.post('/admin/support/tickets/bulk-assign', {
      ticket_ids: ticketIds,
      assigned_to,
    });
  },

  // Tags Management
  getTags: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/admin/support/tags');
    return response;
  },

  createTag: async (name: string): Promise<string> => {
    const response = await api.post<{ name: string }>('/admin/support/tags', { name });
    return response.name;
  },

  deleteTag: async (name: string): Promise<void> => {
    await api.delete(`/admin/support/tags/${encodeURIComponent(name)}`);
  },
};