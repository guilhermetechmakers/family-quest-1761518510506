export interface PrivacyPolicySection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface ContactInfo {
  contact_id: string;
  officer_name: string;
  email: string;
  phone_number: string;
}

export interface PrivacyPolicyData {
  sections: PrivacyPolicySection[];
  contact_info: ContactInfo;
  last_updated: string;
  version: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  inquiry_type: 'general' | 'data_request' | 'complaint' | 'other';
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  submission_id?: string;
}