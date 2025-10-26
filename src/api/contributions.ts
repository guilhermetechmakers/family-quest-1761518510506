import { api } from '../lib/api';
import type { Contribution, CreateContributionInput, UpdateContributionInput, ContributionStats } from '@/types/contribution';

export const contributionsApi = {
  // Get all contributions for a goal
  getByGoal: async (goalId: string): Promise<Contribution[]> => {
    const response = await api.get<Contribution[]>(`/contributions?goal_id=${goalId}`);
    return response;
  },

  // Get all contributions for current user
  getByUser: async (): Promise<Contribution[]> => {
    const response = await api.get<Contribution[]>('/contributions');
    return response;
  },

  // Get contribution by ID
  getById: async (id: string): Promise<Contribution> => {
    const response = await api.get<Contribution>(`/contributions/${id}`);
    return response;
  },

  // Create new contribution
  create: async (contribution: CreateContributionInput): Promise<Contribution> => {
    const response = await api.post<Contribution>('/contributions', contribution);
    return response;
  },

  // Update contribution
  update: async (id: string, updates: UpdateContributionInput): Promise<Contribution> => {
    const response = await api.put<Contribution>(`/contributions/${id}`, updates);
    return response;
  },

  // Delete contribution
  delete: async (id: string): Promise<void> => {
    await api.delete(`/contributions/${id}`);
  },

  // Approve contribution
  approve: async (id: string): Promise<Contribution> => {
    const response = await api.post<Contribution>(`/contributions/${id}/approve`, {});
    return response;
  },

  // Reject contribution
  reject: async (id: string, reason?: string): Promise<Contribution> => {
    const response = await api.post<Contribution>(`/contributions/${id}/reject`, { reason });
    return response;
  },

  // Get contribution statistics
  getStats: async (goalId?: string): Promise<ContributionStats> => {
    const url = goalId ? `/contributions/stats?goal_id=${goalId}` : '/contributions/stats';
    const response = await api.get<ContributionStats>(url);
    return response;
  },
};