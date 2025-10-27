import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  fetchCookiePolicy, 
  fetchCookiePreferences, 
  updateCookiePreferences, 
  resetCookiePreferences 
} from '@/api/cookies';

// Query keys
export const cookieKeys = {
  all: ['cookies'] as const,
  policy: () => [...cookieKeys.all, 'policy'] as const,
  preferences: () => [...cookieKeys.all, 'preferences'] as const,
};

/**
 * Hook to fetch cookie policy data
 */
export const useCookiePolicy = () => {
  return useQuery({
    queryKey: cookieKeys.policy(),
    queryFn: fetchCookiePolicy,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
};

/**
 * Hook to fetch user's cookie preferences
 */
export const useCookiePreferences = () => {
  return useQuery({
    queryKey: cookieKeys.preferences(),
    queryFn: fetchCookiePreferences,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook to update cookie preferences
 */
export const useUpdateCookiePreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCookiePreferences,
    onSuccess: (data) => {
      // Update the preferences cache
      queryClient.setQueryData(cookieKeys.preferences(), data.preferences);
      
      // Show success message
      toast.success('Cookie preferences updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating cookie preferences:', error);
      toast.error('Failed to update cookie preferences. Please try again.');
    },
  });
};

/**
 * Hook to reset cookie preferences
 */
export const useResetCookiePreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetCookiePreferences,
    onSuccess: (data) => {
      // Update the preferences cache
      queryClient.setQueryData(cookieKeys.preferences(), data.preferences);
      
      // Show success message
      toast.success('Cookie preferences reset to default settings.');
    },
    onError: (error) => {
      console.error('Error resetting cookie preferences:', error);
      toast.error('Failed to reset cookie preferences. Please try again.');
    },
  });
};