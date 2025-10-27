import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi } from '@/api/payments';
import { toast } from 'sonner';

// Query keys
export const paymentKeys = {
  all: ['payments'] as const,
  intents: () => [...paymentKeys.all, 'intents'] as const,
  intent: (id: string) => [...paymentKeys.intents(), id] as const,
  methods: () => [...paymentKeys.all, 'methods'] as const,
  receipts: () => [...paymentKeys.all, 'receipts'] as const,
  receipt: (id: string) => [...paymentKeys.receipts(), id] as const,
  history: () => [...paymentKeys.all, 'history'] as const,
};

// Get payment methods
export const usePaymentMethods = () => {
  return useQuery({
    queryKey: paymentKeys.methods(),
    queryFn: paymentsApi.getPaymentMethods,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get payment history
export const usePaymentHistory = (params?: {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
}) => {
  return useQuery({
    queryKey: [...paymentKeys.history(), params],
    queryFn: () => paymentsApi.getPaymentHistory(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Get payment receipt
export const usePaymentReceipt = (paymentIntentId: string) => {
  return useQuery({
    queryKey: paymentKeys.receipt(paymentIntentId),
    queryFn: () => paymentsApi.getReceipt(paymentIntentId),
    enabled: !!paymentIntentId,
  });
};

// Create payment intent mutation
export const useCreatePaymentIntent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentsApi.createPaymentIntent,
    onSuccess: (paymentIntent) => {
      // Cache the payment intent
      queryClient.setQueryData(paymentKeys.intent(paymentIntent.id), paymentIntent);
      toast.success('Payment intent created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create payment intent: ${error.message}`);
    },
  });
};

// Confirm payment mutation
export const useConfirmPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentsApi.confirmPayment,
    onSuccess: (paymentIntent) => {
      // Update the payment intent in cache
      queryClient.setQueryData(paymentKeys.intent(paymentIntent.id), paymentIntent);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: paymentKeys.history() });
      queryClient.invalidateQueries({ queryKey: paymentKeys.receipts() });
      
      if (paymentIntent.status === 'succeeded') {
        toast.success('Payment completed successfully!');
      } else if (paymentIntent.status === 'requires_action') {
        toast.info('Payment requires additional verification');
      }
    },
    onError: (error) => {
      toast.error(`Payment failed: ${error.message}`);
    },
  });
};

// Save payment method mutation
export const useSavePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentsApi.savePaymentMethod,
    onSuccess: () => {
      // Invalidate payment methods
      queryClient.invalidateQueries({ queryKey: paymentKeys.methods() });
      toast.success('Payment method saved successfully');
    },
    onError: (error) => {
      toast.error(`Failed to save payment method: ${error.message}`);
    },
  });
};

// Delete payment method mutation
export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentsApi.deletePaymentMethod,
    onSuccess: () => {
      // Invalidate payment methods
      queryClient.invalidateQueries({ queryKey: paymentKeys.methods() });
      toast.success('Payment method deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete payment method: ${error.message}`);
    },
  });
};

// Generate receipt PDF mutation
export const useGenerateReceiptPDF = () => {
  return useMutation({
    mutationFn: paymentsApi.generateReceiptPDF,
    onSuccess: (data) => {
      // Open the download URL in a new tab
      window.open(data.download_url, '_blank');
      toast.success('Receipt PDF generated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to generate receipt PDF: ${error.message}`);
    },
  });
};

// Refund payment mutation
export const useRefundPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payment_intent_id, amount, reason }: { 
      payment_intent_id: string; 
      amount?: number; 
      reason?: string; 
    }) => paymentsApi.refundPayment(payment_intent_id, amount, reason),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: paymentKeys.history() });
      queryClient.invalidateQueries({ queryKey: paymentKeys.receipts() });
      toast.success('Refund processed successfully');
    },
    onError: (error) => {
      toast.error(`Failed to process refund: ${error.message}`);
    },
  });
};