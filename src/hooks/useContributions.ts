import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contributionsApi } from '@/api/contributions';
import { toast } from 'sonner';
import type { UpdateContributionInput } from '@/types/contribution';

// Query keys
export const contributionKeys = {
  all: ['contributions'] as const,
  lists: () => [...contributionKeys.all, 'list'] as const,
  list: (filters: string) => [...contributionKeys.lists(), { filters }] as const,
  details: () => [...contributionKeys.all, 'detail'] as const,
  detail: (id: string) => [...contributionKeys.details(), id] as const,
  byGoal: (goalId: string) => [...contributionKeys.all, 'goal', goalId] as const,
  byUser: () => [...contributionKeys.all, 'user'] as const,
  stats: (goalId?: string) => [...contributionKeys.all, 'stats', goalId] as const,
};

// Get contributions by goal
export const useContributionsByGoal = (goalId: string) => {
  return useQuery({
    queryKey: contributionKeys.byGoal(goalId),
    queryFn: () => contributionsApi.getByGoal(goalId),
    enabled: !!goalId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Get contributions by user
export const useContributionsByUser = () => {
  return useQuery({
    queryKey: contributionKeys.byUser(),
    queryFn: contributionsApi.getByUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get contribution by ID
export const useContribution = (id: string) => {
  return useQuery({
    queryKey: contributionKeys.detail(id),
    queryFn: () => contributionsApi.getById(id),
    enabled: !!id,
  });
};

// Get contribution statistics
export const useContributionStats = (goalId?: string) => {
  return useQuery({
    queryKey: contributionKeys.stats(goalId),
    queryFn: () => contributionsApi.getStats(goalId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Create contribution mutation
export const useCreateContribution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contributionsApi.create,
    onSuccess: (newContribution) => {
      // Invalidate contributions lists
      queryClient.invalidateQueries({ queryKey: contributionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contributionKeys.byUser() });
      
      // Invalidate goal-specific contributions
      if (newContribution.goal_id) {
        queryClient.invalidateQueries({ 
          queryKey: contributionKeys.byGoal(newContribution.goal_id) 
        });
      }
      
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: contributionKeys.stats() });
      if (newContribution.goal_id) {
        queryClient.invalidateQueries({ 
          queryKey: contributionKeys.stats(newContribution.goal_id) 
        });
      }
      
      toast.success('Contribution added successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to add contribution: ${error.message}`);
    },
  });
};

// Update contribution mutation
export const useUpdateContribution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateContributionInput }) =>
      contributionsApi.update(id, updates),
    onSuccess: (updatedContribution) => {
      // Update the contribution in the cache
      queryClient.setQueryData(contributionKeys.detail(updatedContribution.id), updatedContribution);
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: contributionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contributionKeys.byUser() });
      
      if (updatedContribution.goal_id) {
        queryClient.invalidateQueries({ 
          queryKey: contributionKeys.byGoal(updatedContribution.goal_id) 
        });
      }
      
      toast.success('Contribution updated successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to update contribution: ${error.message}`);
    },
  });
};

// Delete contribution mutation
export const useDeleteContribution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contributionsApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove the contribution from the cache
      queryClient.removeQueries({ queryKey: contributionKeys.detail(deletedId) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: contributionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contributionKeys.byUser() });
      
      toast.success('Contribution deleted successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to delete contribution: ${error.message}`);
    },
  });
};

// Approve contribution mutation
export const useApproveContribution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contributionsApi.approve,
    onSuccess: (approvedContribution) => {
      // Update the contribution in the cache
      queryClient.setQueryData(contributionKeys.detail(approvedContribution.id), approvedContribution);
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: contributionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contributionKeys.byUser() });
      
      if (approvedContribution.goal_id) {
        queryClient.invalidateQueries({ 
          queryKey: contributionKeys.byGoal(approvedContribution.goal_id) 
        });
      }
      
      toast.success('Contribution approved!');
    },
    onError: (error) => {
      toast.error(`Failed to approve contribution: ${error.message}`);
    },
  });
};

// Reject contribution mutation
export const useRejectContribution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      contributionsApi.reject(id, reason),
    onSuccess: (rejectedContribution) => {
      // Update the contribution in the cache
      queryClient.setQueryData(contributionKeys.detail(rejectedContribution.id), rejectedContribution);
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: contributionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contributionKeys.byUser() });
      
      if (rejectedContribution.goal_id) {
        queryClient.invalidateQueries({ 
          queryKey: contributionKeys.byGoal(rejectedContribution.goal_id) 
        });
      }
      
      toast.success('Contribution rejected');
    },
    onError: (error) => {
      toast.error(`Failed to reject contribution: ${error.message}`);
    },
  });
};