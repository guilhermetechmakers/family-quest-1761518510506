import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { helpApi } from '@/api/help';
import { toast } from 'sonner';
import { mockFAQs, mockFAQCategories, mockGuides } from '@/data/mockHelpData';

// Query keys
export const helpKeys = {
  all: ['help'] as const,
  faqs: () => [...helpKeys.all, 'faqs'] as const,
  faqsByCategory: (category: string) => [...helpKeys.faqs(), category] as const,
  faqCategories: () => [...helpKeys.all, 'faq-categories'] as const,
  guides: () => [...helpKeys.all, 'guides'] as const,
  guide: (id: string) => [...helpKeys.guides(), id] as const,
  supportRequests: () => [...helpKeys.all, 'support-requests'] as const,
  supportRequest: (id: string) => [...helpKeys.supportRequests(), id] as const,
};

// FAQ hooks
export const useFAQs = () => {
  return useQuery({
    queryKey: helpKeys.faqs(),
    queryFn: () => Promise.resolve(mockFAQs),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useFAQsByCategory = (category: string) => {
  return useQuery({
    queryKey: helpKeys.faqsByCategory(category),
    queryFn: () => Promise.resolve(mockFAQs.filter(faq => faq.category === category)),
    enabled: !!category,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useFAQCategories = () => {
  return useQuery({
    queryKey: helpKeys.faqCategories(),
    queryFn: () => Promise.resolve(mockFAQCategories),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Guide hooks
export const useGuides = () => {
  return useQuery({
    queryKey: helpKeys.guides(),
    queryFn: () => Promise.resolve(mockGuides),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useGuide = (id: string) => {
  return useQuery({
    queryKey: helpKeys.guide(id),
    queryFn: () => Promise.resolve(mockGuides.find(guide => guide.id === id)!),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Support request hooks
export const useCreateSupportRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: helpApi.createSupportRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: helpKeys.supportRequests() });
      toast.success('Support request submitted successfully! We\'ll get back to you within 24 hours.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit support request. Please try again.');
    },
  });
};

export const useSupportRequests = () => {
  return useQuery({
    queryKey: helpKeys.supportRequests(),
    queryFn: helpApi.getSupportRequests,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSupportRequest = (id: string) => {
  return useQuery({
    queryKey: helpKeys.supportRequest(id),
    queryFn: () => helpApi.getSupportRequestById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};