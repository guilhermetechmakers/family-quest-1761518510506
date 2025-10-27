import { api } from '@/lib/api';
import type { FAQ, Guide, SupportRequest, CreateSupportRequestData, FAQCategory } from '@/types/help';

export const helpApi = {
  // FAQ endpoints
  getFAQs: async (): Promise<FAQ[]> => {
    const response = await api.get<FAQ[]>('/help/faqs');
    return response;
  },

  getFAQsByCategory: async (category: string): Promise<FAQ[]> => {
    const response = await api.get<FAQ[]>(`/help/faqs?category=${category}`);
    return response;
  },

  getFAQCategories: async (): Promise<FAQCategory[]> => {
    const response = await api.get<FAQCategory[]>('/help/faqs/categories');
    return response;
  },

  // Guide endpoints
  getGuides: async (): Promise<Guide[]> => {
    const response = await api.get<Guide[]>('/help/guides');
    return response;
  },

  getGuideById: async (id: string): Promise<Guide> => {
    const response = await api.get<Guide>(`/help/guides/${id}`);
    return response;
  },

  // Support request endpoints
  createSupportRequest: async (data: CreateSupportRequestData): Promise<SupportRequest> => {
    const formData = new FormData();
    formData.append('category', data.category);
    formData.append('subject', data.subject);
    formData.append('message', data.message);
    
    if (data.attachment) {
      formData.append('attachment', data.attachment);
    }

    // For FormData, we need to use fetch directly
    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/help/support-requests`;
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  },

  getSupportRequests: async (): Promise<SupportRequest[]> => {
    const response = await api.get<SupportRequest[]>('/help/support-requests');
    return response;
  },

  getSupportRequestById: async (id: string): Promise<SupportRequest> => {
    const response = await api.get<SupportRequest>(`/help/support-requests/${id}`);
    return response;
  },
};