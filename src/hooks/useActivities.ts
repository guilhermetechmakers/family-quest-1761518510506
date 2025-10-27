import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { activitiesApi } from '@/api/activities';
import { toast } from 'sonner';
import type { ActivityFeedQuery } from '@/types/activity';

// Query keys
export const activityKeys = {
  all: ['activities'] as const,
  lists: () => [...activityKeys.all, 'list'] as const,
  list: (filters: string) => [...activityKeys.lists(), { filters }] as const,
  details: () => [...activityKeys.all, 'detail'] as const,
  detail: (id: string) => [...activityKeys.details(), id] as const,
  family: (familyId: string) => [...activityKeys.lists(), 'family', familyId] as const,
  goal: (goalId: string) => [...activityKeys.lists(), 'goal', goalId] as const,
  feed: (query: ActivityFeedQuery) => [...activityKeys.all, 'feed', query] as const,
};

// Get activities for a family
export const useActivities = (familyId?: string) => {
  return useQuery({
    queryKey: familyId ? activityKeys.family(familyId) : activityKeys.lists(),
    queryFn: () => activitiesApi.getByFamily(familyId || ''),
    enabled: !!familyId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Get activities for a specific goal
export const useGoalActivities = (goalId: string) => {
  return useQuery({
    queryKey: activityKeys.goal(goalId),
    queryFn: () => activitiesApi.getByGoal(goalId),
    enabled: !!goalId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Get activity by ID
export const useActivity = (id: string) => {
  return useQuery({
    queryKey: activityKeys.detail(id),
    queryFn: () => activitiesApi.getById(id),
    enabled: !!id,
  });
};

// Create activity mutation
export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activitiesApi.create,
    onSuccess: (newActivity) => {
      // Invalidate activities lists
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
      
      // Add the new activity to the cache
      queryClient.setQueryData(activityKeys.detail(newActivity.id), newActivity);
      
      toast.success('Activity posted successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to post activity: ${error.message}`);
    },
  });
};

// Add comment mutation
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ activityId, content }: { activityId: string; content: string }) =>
      activitiesApi.addComment(activityId, content),
    onSuccess: (updatedActivity, { activityId }) => {
      // Update the activity in the cache
      queryClient.setQueryData(activityKeys.detail(activityId), updatedActivity);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
      
      toast.success('Comment added!');
    },
    onError: (error) => {
      toast.error(`Failed to add comment: ${error.message}`);
    },
  });
};

// Add reaction mutation
export const useAddReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ activityId, emoji }: { activityId: string; emoji: string }) =>
      activitiesApi.addReaction(activityId, emoji),
    onSuccess: (updatedActivity, { activityId }) => {
      // Update the activity in the cache
      queryClient.setQueryData(activityKeys.detail(activityId), updatedActivity);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
      
      toast.success('Reaction added!');
    },
    onError: (error) => {
      toast.error(`Failed to add reaction: ${error.message}`);
    },
  });
};

// Delete activity mutation
export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activitiesApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove the activity from the cache
      queryClient.removeQueries({ queryKey: activityKeys.detail(deletedId) });
      
      // Invalidate activities lists
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
      
      toast.success('Activity deleted successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to delete activity: ${error.message}`);
    },
  });
};

// Get paginated activity feed with infinite scroll
export const useActivityFeed = (query: ActivityFeedQuery) => {
  return useInfiniteQuery({
    queryKey: activityKeys.feed(query),
    queryFn: ({ pageParam = 1 }) => 
      activitiesApi.getFeed({ ...query, page: pageParam }),
    getNextPageParam: (lastPage) => 
      lastPage.has_more ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Create post mutation
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activitiesApi.createPost,
    onSuccess: () => {
      // Invalidate all activity feeds
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
      
      toast.success('Post created successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to create post: ${error.message}`);
    },
  });
};

// Create child post mutation
export const useCreateChildPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activitiesApi.createChildPost,
    onSuccess: () => {
      // Invalidate all activity feeds
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
      
      toast.success('Post created successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to create post: ${error.message}`);
    },
  });
};

// Upload media mutation
export const useUploadMedia = () => {
  return useMutation({
    mutationFn: activitiesApi.uploadMedia,
    onError: (error) => {
      toast.error(`Failed to upload media: ${error.message}`);
    },
  });
};