import { api } from '../lib/api';
import type { Activity, CreateActivityInput, CreateCommentInput, CreateReactionInput } from '@/types/activity';

export const activitiesApi = {
  // Get all activities for current family
  getAll: async (): Promise<Activity[]> => {
    const response = await api.get<Activity[]>('/activities');
    return response;
  },

  // Get activities for a specific goal
  getByGoal: async (goalId: string): Promise<Activity[]> => {
    const response = await api.get<Activity[]>(`/activities?goal_id=${goalId}`);
    return response;
  },

  // Get activity by ID
  getById: async (id: string): Promise<Activity> => {
    const response = await api.get<Activity>(`/activities/${id}`);
    return response;
  },

  // Create new activity
  create: async (activity: CreateActivityInput): Promise<Activity> => {
    const response = await api.post<Activity>('/activities', activity);
    return response;
  },

  // Add comment to activity
  addComment: async (comment: CreateCommentInput): Promise<Activity> => {
    const response = await api.post<Activity>('/activities/comments', comment);
    return response;
  },

  // Add reaction to activity
  addReaction: async (reaction: CreateReactionInput): Promise<Activity> => {
    const response = await api.post<Activity>('/activities/reactions', reaction);
    return response;
  },

  // Remove reaction from activity
  removeReaction: async (activityId: string, reactionId: string): Promise<void> => {
    await api.delete(`/activities/${activityId}/reactions/${reactionId}`);
  },

  // Delete activity
  delete: async (id: string): Promise<void> => {
    await api.delete(`/activities/${id}`);
  },
};