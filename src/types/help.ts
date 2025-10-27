export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  content_url?: string;
  content?: string;
  category: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface SupportRequest {
  id: string;
  user_id: string;
  category: 'general' | 'technical' | 'billing' | 'feature_request' | 'bug_report';
  subject: string;
  message: string;
  attachment_url?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface CreateSupportRequestData {
  category: SupportRequest['category'];
  subject: string;
  message: string;
  attachment?: File;
}

export interface FAQCategory {
  name: string;
  count: number;
  icon: string;
}