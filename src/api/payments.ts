import { api } from '../lib/api';
import type { PaymentMethod, CreatePaymentMethodInput, UpdatePaymentMethodInput, Transaction } from '@/types/payment';

export const paymentsApi = {
  // Get user's payment methods
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    const response = await api.get<PaymentMethod[]>('/payments/methods');
    return response;
  },

  // Add new payment method
  addPaymentMethod: async (paymentMethod: CreatePaymentMethodInput): Promise<PaymentMethod> => {
    const response = await api.post<PaymentMethod>('/payments/methods', paymentMethod);
    return response;
  },

  // Update payment method
  updatePaymentMethod: async (updates: UpdatePaymentMethodInput): Promise<PaymentMethod> => {
    const response = await api.put<PaymentMethod>(`/payments/methods/${updates.id}`, updates);
    return response;
  },

  // Delete payment method
  deletePaymentMethod: async (id: string): Promise<void> => {
    await api.delete(`/payments/methods/${id}`);
  },

  // Set default payment method
  setDefaultPaymentMethod: async (id: string): Promise<PaymentMethod> => {
    const response = await api.patch<PaymentMethod>(`/payments/methods/${id}/default`, {});
    return response;
  },

  // Get transaction history
  getTransactions: async (params?: {
    limit?: number;
    offset?: number;
    goal_id?: string;
    type?: string;
  }): Promise<{ transactions: Transaction[]; total: number }> => {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    const response = await api.get<{ transactions: Transaction[]; total: number }>(`/payments/transactions${queryString}`);
    return response;
  },
};