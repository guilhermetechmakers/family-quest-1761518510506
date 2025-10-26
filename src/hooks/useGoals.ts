import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsApi } from '@/api/goals';
import { toast } from 'sonner';
import type { UpdateGoalInput } from '@/types/goal';

// Query keys
export const goalKeys = {
  all: ['goals'] as const,
  lists: () => [...goalKeys.all, 'list'] as const,
  list: (filters: string) => [...goalKeys.lists(), { filters }] as const,
  details: () => [...goalKeys.all, 'detail'] as const,
  detail: (id: string) => [...goalKeys.details(), id] as const,
  progress: (id: string) => [...goalKeys.detail(id), 'progress'] as const,
};

// Get all goals
export const useGoals = () => {
  return useQuery({
    queryKey: goalKeys.lists(),
    queryFn: goalsApi.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get goal by ID
export const useGoal = (id: string) => {
  return useQuery({
    queryKey: goalKeys.detail(id),
    queryFn: () => goalsApi.getById(id),
    enabled: !!id,
  });
};

// Get goal progress
export const useGoalProgress = (id: string) => {
  return useQuery({
    queryKey: goalKeys.progress(id),
    queryFn: () => goalsApi.getProgress(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Create goal mutation
export const useCreateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: goalsApi.create,
    onSuccess: (newGoal) => {
      // Invalidate and refetch goals list
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
      
      // Add the new goal to the cache
      queryClient.setQueryData(goalKeys.detail(newGoal.id), newGoal);
      
      toast.success('Goal created successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to create goal: ${error.message}`);
    },
  });
};

// Update goal mutation
export const useUpdateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateGoalInput }) =>
      goalsApi.update(id, updates),
    onSuccess: (updatedGoal) => {
      // Update the goal in the cache
      queryClient.setQueryData(goalKeys.detail(updatedGoal.id), updatedGoal);
      
      // Invalidate goals list to ensure consistency
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
      
      toast.success('Goal updated successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to update goal: ${error.message}`);
    },
  });
};

// Delete goal mutation
export const useDeleteGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: goalsApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove the goal from the cache
      queryClient.removeQueries({ queryKey: goalKeys.detail(deletedId) });
      
      // Invalidate goals list
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
      
      toast.success('Goal deleted successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to delete goal: ${error.message}`);
    },
  });
};

// Search goals mutation
export const useSearchGoals = () => {
  return useMutation({
    mutationFn: goalsApi.search,
    onError: (error) => {
      toast.error(`Search failed: ${error.message}`);
    },
  });
};