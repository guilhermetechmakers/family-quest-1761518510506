export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'account' | 'feature_request' | 'bug_report' | 'other';
  user_id: string;
  user_name: string;
  user_email: string;
  assigned_to?: string;
  assigned_to_name?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  closed_at?: string;
  tags: string[];
  attachments: SupportAttachment[];
  replies: SupportReply[];
}

export interface SupportReply {
  id: string;
  ticket_id: string;
  author_id: string;
  author_name: string;
  author_type: 'user' | 'admin' | 'system';
  content: string;
  is_internal: boolean;
  attachments: SupportAttachment[];
  created_at: string;
  updated_at: string;
}

export interface SupportAttachment {
  id: string;
  filename: string;
  file_size: number;
  mime_type: string;
  url: string;
  created_at: string;
}

export interface SupportTicketFilters {
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: 'technical' | 'billing' | 'account' | 'feature_request' | 'bug_report' | 'other';
  assigned_to?: string;
  user_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  tags?: string[];
}

export interface CreateSupportTicketInput {
  subject: string;
  description: string;
  category: 'technical' | 'billing' | 'account' | 'feature_request' | 'bug_report' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attachments?: File[];
}

export interface CreateSupportReplyInput {
  content: string;
  is_internal?: boolean;
  attachments?: File[];
}

export interface SupportStats {
  total_tickets: number;
  open_tickets: number;
  in_progress_tickets: number;
  resolved_tickets: number;
  closed_tickets: number;
  average_resolution_time_hours: number;
  tickets_by_category: Record<string, number>;
  tickets_by_priority: Record<string, number>;
  tickets_by_status: Record<string, number>;
}