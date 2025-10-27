export type TransactionType = 'contribution' | 'refund' | 'adjustment' | 'payment' | 'manual';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled' | 'disputed';

export interface TransactionHistory {
  id: string;
  date: string;
  type: TransactionType;
  amount: number;
  currency: string;
  contributor_id: string;
  goal_id: string;
  status: TransactionStatus;
  description?: string;
  payment_method_id?: string;
  external_payment_id?: string;
  dispute_flag?: boolean;
  dispute_reason?: string;
  created_at: string;
  updated_at: string;
  contributor: {
    id: string;
    full_name: string;
    avatar_url?: string;
    role: 'parent' | 'child' | 'guest';
  };
  goal: {
    id: string;
    title: string;
    image_url?: string;
  };
}

export interface TransactionHistoryFilters {
  date_from?: string;
  date_to?: string;
  goal_id?: string;
  contributor_id?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  search?: string;
}

export interface TransactionStats {
  total_transactions: number;
  total_amount: number;
  average_transaction: number;
  transactions_by_type: Record<TransactionType, number>;
  transactions_by_status: Record<TransactionStatus, number>;
  transactions_by_contributor: Array<{
    contributor_id: string;
    contributor_name: string;
    count: number;
    total_amount: number;
  }>;
  monthly_breakdown: Array<{
    month: string;
    count: number;
    total_amount: number;
  }>;
}

export interface ExportOptions {
  format: 'csv' | 'pdf';
  date_from?: string;
  date_to?: string;
  goal_id?: string;
  contributor_id?: string;
  type?: TransactionType;
  status?: TransactionStatus;
}

export interface DisputeTransactionInput {
  transaction_id: string;
  reason: string;
  additional_details?: string;
}

export interface DisputeTransactionResponse {
  success: boolean;
  dispute_id: string;
  message: string;
}