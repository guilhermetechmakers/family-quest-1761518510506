import { api } from '../lib/api';
import type { Goal, CreateGoalInput, UpdateGoalInput, GoalProgress } from '@/types/goal';

export const goalsApi = {
  // Get all goals for current family
  getAll: async (): Promise<Goal[]> => {
    const response = await api.get<Goal[]>('/goals');
    return response;
  },

  // Get goal by ID
  getById: async (id: string): Promise<Goal> => {
    const response = await api.get<Goal>(`/goals/${id}`);
    return response;
  },

  // Create new goal
  create: async (goal: CreateGoalInput): Promise<Goal> => {
    const response = await api.post<Goal>('/goals', goal);
    return response;
  },

  // Update goal
  update: async (id: string, updates: UpdateGoalInput): Promise<Goal> => {
    const response = await api.put<Goal>(`/goals/${id}`, updates);
    return response;
  },

  // Delete goal
  delete: async (id: string): Promise<void> => {
    await api.delete(`/goals/${id}`);
  },

  // Get goal progress
  getProgress: async (id: string): Promise<GoalProgress> => {
    const response = await api.get<GoalProgress>(`/goals/${id}/progress`);
    return response;
  },

  // Add contributor to goal
  addContributor: async (goalId: string, userId: string, permissions: any): Promise<void> => {
    await api.post(`/goals/${goalId}/contributors`, { user_id: userId, permissions });
  },

  // Remove contributor from goal
  removeContributor: async (goalId: string, userId: string): Promise<void> => {
    await api.delete(`/goals/${goalId}/contributors/${userId}`);
  },

  // Update contributor permissions
  updateContributorPermissions: async (
    goalId: string, 
    userId: string, 
    permissions: any
  ): Promise<void> => {
    await api.patch(`/goals/${goalId}/contributors/${userId}`, { permissions });
  },

  // Search goals
  search: async (query: string): Promise<Goal[]> => {
    const response = await api.get<Goal[]>(`/goals/search?q=${encodeURIComponent(query)}`);
    return response;
  },
};