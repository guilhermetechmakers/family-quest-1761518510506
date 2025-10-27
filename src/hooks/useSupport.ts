import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supportApi } from '@/api/support';
import type {
  SupportTicketFilters,
  CreateSupportReplyInput,
} from '@/types/support';

// Query Keys
export const supportKeys = {
  all: ['support'] as const,
  tickets: () => [...supportKeys.all, 'tickets'] as const,
  ticketsList: (filters?: SupportTicketFilters) => [...supportKeys.tickets(), 'list', filters] as const,
  ticket: (id: string) => [...supportKeys.tickets(), 'detail', id] as const,
  replies: (ticketId: string) => [...supportKeys.tickets(), 'replies', ticketId] as const,
  stats: () => [...supportKeys.all, 'stats'] as const,
  tags: () => [...supportKeys.all, 'tags'] as const,
};

// Hooks
export function useSupportTickets(filters?: SupportTicketFilters) {
  return useQuery({
    queryKey: supportKeys.ticketsList(filters),
    queryFn: () => supportApi.getTickets(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useSupportTicket(id: string) {
  return useQuery({
    queryKey: supportKeys.ticket(id),
    queryFn: () => supportApi.getTicketById(id),
    enabled: !!id,
  });
}

export function useSupportStats() {
  return useQuery({
    queryKey: supportKeys.stats(),
    queryFn: supportApi.getSupportStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useSupportTags() {
  return useQuery({
    queryKey: supportKeys.tags(),
    queryFn: supportApi.getTags,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Mutations
export function useCreateSupportTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: supportApi.createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supportKeys.tickets() });
      queryClient.invalidateQueries({ queryKey: supportKeys.stats() });
      toast.success('Support ticket created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create support ticket');
    },
  });
}

export function useUpdateSupportTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof supportApi.updateTicket>[1] }) =>
      supportApi.updateTicket(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: supportKeys.tickets() });
      queryClient.invalidateQueries({ queryKey: supportKeys.ticket(variables.id) });
      queryClient.invalidateQueries({ queryKey: supportKeys.stats() });
      toast.success('Ticket updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update ticket');
    },
  });
}

export function useAssignTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, assigned_to }: { id: string; assigned_to: string }) =>
      supportApi.assignTicket(id, assigned_to),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: supportKeys.tickets() });
      queryClient.invalidateQueries({ queryKey: supportKeys.ticket(variables.id) });
      toast.success('Ticket assigned successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to assign ticket');
    },
  });
}

export function useCloseTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, resolution_notes }: { id: string; resolution_notes?: string }) =>
      supportApi.closeTicket(id, resolution_notes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: supportKeys.tickets() });
      queryClient.invalidateQueries({ queryKey: supportKeys.ticket(variables.id) });
      queryClient.invalidateQueries({ queryKey: supportKeys.stats() });
      toast.success('Ticket closed successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to close ticket');
    },
  });
}

export function useReopenTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: supportApi.reopenTicket,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: supportKeys.tickets() });
      queryClient.invalidateQueries({ queryKey: supportKeys.ticket(variables) });
      queryClient.invalidateQueries({ queryKey: supportKeys.stats() });
      toast.success('Ticket reopened successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reopen ticket');
    },
  });
}

export function useCreateSupportReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, data }: { ticketId: string; data: CreateSupportReplyInput }) =>
      supportApi.createReply(ticketId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: supportKeys.ticket(variables.ticketId) });
      queryClient.invalidateQueries({ queryKey: supportKeys.replies(variables.ticketId) });
      toast.success('Reply added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add reply');
    },
  });
}

export function useBulkUpdateTickets() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketIds, updates }: { ticketIds: string[]; updates: Parameters<typeof supportApi.bulkUpdateTickets>[1] }) =>
      supportApi.bulkUpdateTickets(ticketIds, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supportKeys.tickets() });
      queryClient.invalidateQueries({ queryKey: supportKeys.stats() });
      toast.success('Tickets updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update tickets');
    },
  });
}

export function useBulkAssignTickets() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketIds, assigned_to }: { ticketIds: string[]; assigned_to: string }) =>
      supportApi.bulkAssignTickets(ticketIds, assigned_to),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supportKeys.tickets() });
      toast.success('Tickets assigned successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to assign tickets');
    },
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: supportApi.createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supportKeys.tags() });
      toast.success('Tag created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create tag');
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: supportApi.deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supportKeys.tags() });
      toast.success('Tag deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete tag');
    },
  });
}