import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '@/api/transactions';
import type { TransactionHistoryFilters, ExportOptions, DisputeTransactionInput } from '@/types/transaction';
import { toast } from 'sonner';

// Query keys
export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (filters?: TransactionHistoryFilters) => [...transactionKeys.lists(), filters] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
  stats: (filters?: TransactionHistoryFilters) => [...transactionKeys.all, 'stats', filters] as const,
  goals: () => [...transactionKeys.all, 'goals'] as const,
  contributors: () => [...transactionKeys.all, 'contributors'] as const,
};

// Get all transactions with filters
export const useTransactions = (filters?: TransactionHistoryFilters) => {
  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: () => transactionsApi.getAll(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get transaction by ID
export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () => transactionsApi.getById(id),
    enabled: !!id,
  });
};

// Get transaction statistics
export const useTransactionStats = (filters?: TransactionHistoryFilters) => {
  return useQuery({
    queryKey: transactionKeys.stats(filters),
    queryFn: () => transactionsApi.getStats(filters),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Get goals for filtering
export const useTransactionGoals = () => {
  return useQuery({
    queryKey: transactionKeys.goals(),
    queryFn: () => transactionsApi.getGoals(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Get contributors for filtering
export const useTransactionContributors = () => {
  return useQuery({
    queryKey: transactionKeys.contributors(),
    queryFn: () => transactionsApi.getContributors(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Export transactions mutation
export const useExportTransactions = () => {

  return useMutation({
    mutationFn: async (options: ExportOptions) => {
      const blob = await transactionsApi.export(options);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transactions-${new Date().toISOString().split('T')[0]}.${options.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return blob;
    },
    onSuccess: (_, variables) => {
      toast.success(`Transactions exported as ${variables.format.toUpperCase()}`);
    },
    onError: (error) => {
      console.error('Export failed:', error);
      toast.error('Failed to export transactions');
    },
  });
};

// Dispute transaction mutation
export const useDisputeTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DisputeTransactionInput) => transactionsApi.dispute(input),
    onSuccess: (data) => {
      toast.success(data.message || 'Transaction disputed successfully');
      // Invalidate transactions queries to refresh the list
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
    onError: (error) => {
      console.error('Dispute failed:', error);
      toast.error('Failed to dispute transaction');
    },
  });
};