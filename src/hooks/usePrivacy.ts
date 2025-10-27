import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  fetchPrivacyPolicy, 
  submitContactForm, 
  logPrivacyPolicyView,
  downloadPrivacyPolicyPDF 
} from '@/api/privacy';
// import type { ContactFormData } from '@/types/privacy';

/**
 * Hook to fetch privacy policy data
 */
export const usePrivacyPolicy = () => {
  return useQuery({
    queryKey: ['privacy-policy'],
    queryFn: fetchPrivacyPolicy,
    staleTime: 1000 * 60 * 60, // 1 hour - privacy policy doesn't change often
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

/**
 * Hook to submit contact form to data protection officer
 */
export const useContactForm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitContactForm,
    onSuccess: () => {
      toast.success('Your message has been sent successfully!');
      // Optionally invalidate any related queries
      queryClient.invalidateQueries({ queryKey: ['privacy-policy'] });
    },
    onError: (error) => {
      toast.error('Failed to send message. Please try again.');
      console.error('Contact form error:', error);
    },
  });
};

/**
 * Hook to log privacy policy page view
 */
export const useLogPrivacyView = () => {
  return useMutation({
    mutationFn: logPrivacyPolicyView,
    onError: (error) => {
      // Don't show error to user for logging
      console.warn('Failed to log privacy policy view:', error);
    },
  });
};

/**
 * Hook to download privacy policy PDF
 */
export const useDownloadPrivacyPDF = () => {
  return useMutation({
    mutationFn: downloadPrivacyPolicyPDF,
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `family-quest-privacy-policy-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Privacy policy downloaded successfully!');
    },
    onError: (error) => {
      toast.error('Failed to download privacy policy. Please try again.');
      console.error('Download error:', error);
    },
  });
};