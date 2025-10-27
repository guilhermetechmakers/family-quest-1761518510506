import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCreatePaymentIntent, useConfirmPayment } from './usePayments';
import { toast } from 'sonner';

interface CheckoutData {
  goalId: string;
  goalTitle: string;
  amount: number;
  currency: string;
  description?: string;
}

interface UseCheckoutOptions {
  onSuccess?: (paymentIntent: any) => void;
  onError?: (error: Error) => void;
}

export function useCheckout(options: UseCheckoutOptions = {}) {
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  
  const createPaymentIntent = useCreatePaymentIntent();
  const confirmPayment = useConfirmPayment();

  // Initialize checkout data from URL params
  const initializeCheckoutData = useCallback(() => {
    const goalId = searchParams.get('goalId');
    const goalTitle = searchParams.get('goalTitle');
    const amount = searchParams.get('amount');
    const currency = searchParams.get('currency') || 'USD';
    const description = searchParams.get('description');

    if (goalId && goalTitle && amount) {
      const data: CheckoutData = {
        goalId,
        goalTitle,
        amount: parseFloat(amount),
        currency,
        description: description || undefined
      };
      setCheckoutData(data);
      return data;
    }
    
    return null;
  }, [searchParams]);

  // Process payment
  const processPayment = useCallback(async (
    paymentMethodId: string,
    _billingInfo: any
  ) => {
    if (!checkoutData) {
      throw new Error('Checkout data not initialized');
    }

    setIsProcessing(true);

    try {
      // Create payment intent
      const intent = await createPaymentIntent.mutateAsync({
        amount: Math.round(checkoutData.amount * 100), // Convert to cents
        currency: checkoutData.currency,
        goal_id: checkoutData.goalId,
        description: checkoutData.description
      });

      // Confirm payment
      const result = await confirmPayment.mutateAsync({
        payment_intent_id: intent.id,
        payment_method_id: paymentMethodId
      });

      if (result.status === 'succeeded') {
        options.onSuccess?.(result);
        return { success: true, paymentIntent: result };
      } else if (result.status === 'requires_action') {
        // Handle 3D Secure authentication
        toast.info('Additional verification required. Please complete the authentication process.');
        return { success: false, requiresAction: true, paymentIntent: result };
      } else {
        throw new Error(`Payment failed with status: ${result.status}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
      options.onError?.(error as Error);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [checkoutData, createPaymentIntent, confirmPayment, options]);

  // Validate checkout data
  const validateCheckoutData = useCallback(() => {
    if (!checkoutData) {
      return { isValid: false, error: 'Checkout data not initialized' };
    }

    if (!checkoutData.goalId || !checkoutData.goalTitle || !checkoutData.amount) {
      return { isValid: false, error: 'Missing required checkout parameters' };
    }

    if (checkoutData.amount <= 0) {
      return { isValid: false, error: 'Amount must be greater than 0' };
    }

    return { isValid: true };
  }, [checkoutData]);

  // Get checkout summary
  const getCheckoutSummary = useCallback(() => {
    if (!checkoutData) return null;

    return {
      goalTitle: checkoutData.goalTitle,
      amount: checkoutData.amount,
      currency: checkoutData.currency,
      description: checkoutData.description,
      formattedAmount: `$${checkoutData.amount.toFixed(2)} ${checkoutData.currency}`
    };
  }, [checkoutData]);

  return {
    checkoutData,
    isProcessing,
    initializeCheckoutData,
    processPayment,
    validateCheckoutData,
    getCheckoutSummary
  };
}

// Hook for managing payment method selection
export function usePaymentMethodSelection() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const selectMethod = useCallback((methodId: string) => {
    setSelectedMethod(methodId);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedMethod(null);
  }, []);

  const isMethodSelected = useCallback((methodId: string) => {
    return selectedMethod === methodId;
  }, [selectedMethod]);

  return {
    selectedMethod,
    selectMethod,
    clearSelection,
    isMethodSelected
  };
}

// Hook for managing billing information
export function useBillingInfo() {
  const [billingInfo, setBillingInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  const updateBillingInfo = useCallback((updates: Partial<typeof billingInfo>) => {
    setBillingInfo(prev => ({ ...prev, ...updates }));
  }, []);

  const resetBillingInfo = useCallback(() => {
    setBillingInfo({
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    });
  }, []);

  const validateBillingInfo = useCallback(() => {
    if (!billingInfo.email) {
      return { isValid: false, error: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(billingInfo.email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }

    return { isValid: true };
  }, [billingInfo]);

  return {
    billingInfo,
    updateBillingInfo,
    resetBillingInfo,
    validateBillingInfo
  };
}