import { api } from '../lib/api';

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  cardholder_name: string;
  last_four_digits: string;
  brand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentMethodInput {
  cardholder_name: string;
  card_number: string;
  expiry_month: number;
  expiry_year: number;
  cvv: string;
  is_default?: boolean;
}

export interface CreatePaymentIntentInput {
  amount: number;
  currency: string;
  goal_id: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface ConfirmPaymentInput {
  payment_intent_id: string;
  payment_method_id?: string;
  return_url?: string;
}

export interface PaymentReceipt {
  id: string;
  payment_intent_id: string;
  amount: number;
  currency: string;
  status: string;
  receipt_url: string;
  created_at: string;
  goal: {
    id: string;
    title: string;
  };
  contributor: {
    id: string;
    full_name: string;
  };
}

export const paymentsApi = {
  // Create a payment intent
  createPaymentIntent: async (data: CreatePaymentIntentInput): Promise<PaymentIntent> => {
    const response = await api.post<PaymentIntent>('/payments/intents', data);
    return response;
  },

  // Confirm a payment intent
  confirmPayment: async (data: ConfirmPaymentInput): Promise<PaymentIntent> => {
    const response = await api.post<PaymentIntent>('/payments/confirm', data);
    return response;
  },

  // Get payment methods for user
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    const response = await api.get<PaymentMethod[]>('/payments/methods');
    return response;
  },

  // Create a payment method
  createPaymentMethod: async (data: CreatePaymentMethodInput): Promise<PaymentMethod> => {
    const response = await api.post<PaymentMethod>('/payments/methods', data);
    return response;
  },

  // Save a payment method (for existing payment method IDs)
  savePaymentMethod: async (payment_method_id: string): Promise<PaymentMethod> => {
    const response = await api.post<PaymentMethod>('/payments/methods', { payment_method_id });
    return response;
  },

  // Delete a payment method
  deletePaymentMethod: async (payment_method_id: string): Promise<void> => {
    await api.delete(`/payments/methods/${payment_method_id}`);
  },

  // Get payment receipt
  getReceipt: async (payment_intent_id: string): Promise<PaymentReceipt> => {
    const response = await api.get<PaymentReceipt>(`/payments/receipts/${payment_intent_id}`);
    return response;
  },

  // Generate receipt PDF
  generateReceiptPDF: async (payment_intent_id: string): Promise<{ download_url: string }> => {
    const response = await api.post<{ download_url: string }>(`/payments/receipts/${payment_intent_id}/pdf`, {});
    return response;
  },

  // Refund a payment
  refundPayment: async (payment_intent_id: string, amount?: number, reason?: string): Promise<{ id: string; status: string }> => {
    const response = await api.post<{ id: string; status: string }>(`/payments/${payment_intent_id}/refund`, {
      amount,
      reason,
    });
    return response;
  },

  // Get payment history
  getPaymentHistory: async (params?: {
    limit?: number;
    starting_after?: string;
    ending_before?: string;
  }): Promise<{ data: PaymentReceipt[]; has_more: boolean }> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.starting_after) queryParams.append('starting_after', params.starting_after);
    if (params?.ending_before) queryParams.append('ending_before', params.ending_before);
    
    const response = await api.get<{ data: PaymentReceipt[]; has_more: boolean }>(`/payments/history?${queryParams}`);
    return response;
  },
};