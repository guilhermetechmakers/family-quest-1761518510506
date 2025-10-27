import { api } from '../lib/api';
import type { 
  TransactionHistory, 
  TransactionHistoryFilters, 
  TransactionStats, 
  ExportOptions, 
  DisputeTransactionInput, 
  DisputeTransactionResponse 
} from '@/types/transaction';

export const transactionsApi = {
  // Get all transactions with optional filters
  getAll: async (filters?: TransactionHistoryFilters): Promise<TransactionHistory[]> => {
    const params = new URLSearchParams();
    
    if (filters?.date_from) params.append('date_from', filters.date_from);
    if (filters?.date_to) params.append('date_to', filters.date_to);
    if (filters?.goal_id) params.append('goal_id', filters.goal_id);
    if (filters?.contributor_id) params.append('contributor_id', filters.contributor_id);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    const url = queryString ? `/transactions?${queryString}` : '/transactions';
    
    const response = await api.get<TransactionHistory[]>(url);
    return response;
  },

  // Get transaction by ID
  getById: async (id: string): Promise<TransactionHistory> => {
    const response = await api.get<TransactionHistory>(`/transactions/${id}`);
    return response;
  },

  // Get transaction statistics
  getStats: async (filters?: TransactionHistoryFilters): Promise<TransactionStats> => {
    const params = new URLSearchParams();
    
    if (filters?.date_from) params.append('date_from', filters.date_from);
    if (filters?.date_to) params.append('date_to', filters.date_to);
    if (filters?.goal_id) params.append('goal_id', filters.goal_id);
    if (filters?.contributor_id) params.append('contributor_id', filters.contributor_id);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.status) params.append('status', filters.status);

    const queryString = params.toString();
    const url = queryString ? `/transactions/stats?${queryString}` : '/transactions/stats';
    
    const response = await api.get<TransactionStats>(url);
    return response;
  },

  // Export transactions
  export: async (options: ExportOptions): Promise<Blob> => {
    const params = new URLSearchParams();
    params.append('format', options.format);
    
    if (options.date_from) params.append('date_from', options.date_from);
    if (options.date_to) params.append('date_to', options.date_to);
    if (options.goal_id) params.append('goal_id', options.goal_id);
    if (options.contributor_id) params.append('contributor_id', options.contributor_id);
    if (options.type) params.append('type', options.type);
    if (options.status) params.append('status', options.status);

    const response = await api.get(`/transactions/export?${params.toString()}`);
    
    return response as Blob;
  },

  // Dispute a transaction
  dispute: async (input: DisputeTransactionInput): Promise<DisputeTransactionResponse> => {
    const response = await api.post<DisputeTransactionResponse>(`/transactions/${input.transaction_id}/dispute`, {
      reason: input.reason,
      additional_details: input.additional_details,
    });
    return response;
  },

  // Get available goals for filtering
  getGoals: async (): Promise<Array<{ id: string; title: string }>> => {
    const response = await api.get<Array<{ id: string; title: string }>>('/goals');
    return response;
  },

  // Get available contributors for filtering
  getContributors: async (): Promise<Array<{ id: string; full_name: string; role: string }>> => {
    const response = await api.get<Array<{ id: string; full_name: string; role: string }>>('/family/members');
    return response;
  },
};