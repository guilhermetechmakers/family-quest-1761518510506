import { api } from '../lib/api';
import type { Family, CreateFamilyInput, UpdateFamilyInput } from '@/types/family';
import type { InviteMemberInput } from '@/types/user';

export const familiesApi = {
  // Get current user's family
  getCurrent: async (): Promise<Family> => {
    const response = await api.get<Family>('/families/current');
    return response;
  },

  // Create new family
  create: async (family: CreateFamilyInput): Promise<Family> => {
    const response = await api.post<Family>('/families', family);
    return response;
  },

  // Update family
  update: async (id: string, updates: UpdateFamilyInput): Promise<Family> => {
    const response = await api.put<Family>(`/families/${id}`, updates);
    return response;
  },

  // Get family by ID
  getById: async (id: string): Promise<Family> => {
    const response = await api.get<Family>(`/families/${id}`);
    return response;
  },

  // Invite member to family
  inviteMember: async (invite: InviteMemberInput): Promise<void> => {
    await api.post('/families/invite', invite);
  },

  // Remove member from family
  removeMember: async (familyId: string, userId: string): Promise<void> => {
    await api.delete(`/families/${familyId}/members/${userId}`);
  },

  // Update member permissions
  updateMemberPermissions: async (
    familyId: string, 
    userId: string, 
    permissions: any
  ): Promise<void> => {
    await api.patch(`/families/${familyId}/members/${userId}`, { permissions });
  },

  // Leave family
  leave: async (familyId: string): Promise<void> => {
    await api.post(`/families/${familyId}/leave`, {});
  },
};