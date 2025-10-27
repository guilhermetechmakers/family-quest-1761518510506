import { api } from '@/lib/api';
import type { 
  PrivacyPolicyData, 
  ContactFormData, 
  ContactFormResponse 
} from '@/types/privacy';

/**
 * Fetch privacy policy content and contact information
 */
export const fetchPrivacyPolicy = async (): Promise<PrivacyPolicyData> => {
  try {
    const response = await api.get<PrivacyPolicyData>('/privacy-policy');
    return response;
  } catch (error) {
    console.error('Error fetching privacy policy:', error);
    throw new Error('Failed to fetch privacy policy');
  }
};

/**
 * Submit contact form to data protection officer
 */
export const submitContactForm = async (formData: ContactFormData): Promise<ContactFormResponse> => {
  try {
    const response = await api.post<ContactFormResponse>('/privacy-policy/contact', formData);
    return response;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw new Error('Failed to submit contact form');
  }
};

/**
 * Log privacy policy page view for compliance tracking
 */
export const logPrivacyPolicyView = async (): Promise<void> => {
  try {
    await api.post<void>('/privacy-policy/log-view', {
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      referrer: document.referrer
    });
  } catch (error) {
    // Don't throw error for logging - it's not critical
    console.warn('Failed to log privacy policy view:', error);
  }
};

/**
 * Download privacy policy as PDF
 */
export const downloadPrivacyPolicyPDF = async (): Promise<Blob> => {
  try {
    const response = await api.get<Blob>('/privacy-policy/download');
    return response;
  } catch (error) {
    console.error('Error downloading privacy policy PDF:', error);
    throw new Error('Failed to download privacy policy PDF');
  }
};