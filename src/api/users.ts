import { api } from '../lib/api';
import type { User, UpdateUserInput } from '@/types/user';

export const usersApi = {
  // Get current user
  getCurrent: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response;
  },

  // Update user profile
  updateProfile: async (updates: UpdateUserInput): Promise<User> => {
    const response = await api.put<User>(`/users/${updates.id}`, updates);
    return response;
  },

  // Get user by ID
  getById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response;
  },

  // Get all users (admin only)
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response;
  },

  // Delete user account
  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};