import { api } from '../lib/api';
import type { 
  Activity, 
  CreateActivityInput, 
  ActivityFeedQuery, 
  ActivityFeedResponse,
  PostComposerData,
  ChildPostData 
} from '@/types/activity';

export const activitiesApi = {
  // Get all activities for current family
  getAll: async (): Promise<Activity[]> => {
    const response = await api.get<Activity[]>('/activities');
    return response;
  },

  // Get activities for a specific family
  getByFamily: async (familyId: string): Promise<Activity[]> => {
    const response = await api.get<Activity[]>(`/activities?family_id=${familyId}`);
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
  addComment: async (activityId: string, content: string): Promise<Activity> => {
    const response = await api.post<Activity>('/activities/comments', { activityId, content });
    return response;
  },

  // Add reaction to activity
  addReaction: async (activityId: string, emoji: string): Promise<Activity> => {
    const response = await api.post<Activity>('/activities/reactions', { activityId, emoji });
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

  // Get paginated activity feed with filters
  getFeed: async (query: ActivityFeedQuery): Promise<ActivityFeedResponse> => {
    const params = new URLSearchParams();
    params.append('family_id', query.family_id);
    
    if (query.filters) {
      if (query.filters.goal_id) params.append('goal_id', query.filters.goal_id);
      if (query.filters.user_id) params.append('user_id', query.filters.user_id);
      if (query.filters.type) params.append('type', query.filters.type);
      if (query.filters.date_from) params.append('date_from', query.filters.date_from);
      if (query.filters.date_to) params.append('date_to', query.filters.date_to);
    }
    
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.sort) params.append('sort', query.sort);

    const response = await api.get<ActivityFeedResponse>(`/activities/feed?${params.toString()}`);
    return response;
  },

  // Create post from composer
  createPost: async (data: PostComposerData): Promise<Activity> => {
    const response = await api.post<Activity>('/activities/posts', data);
    return response;
  },

  // Create child-friendly post
  createChildPost: async (data: ChildPostData): Promise<Activity> => {
    const response = await api.post<Activity>('/activities/child-posts', data);
    return response;
  },

  // Upload media for posts
  uploadMedia: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Use fetch directly for multipart/form-data uploads
    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/activities/media`;
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  },
};